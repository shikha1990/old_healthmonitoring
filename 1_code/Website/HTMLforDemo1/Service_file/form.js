// $Id$
 
function CRMLookupCallBack()
{
    ZCForm.triggerExternalOnUser(ExternalFieldName);
}
function SDPODLookupCallBack()
{
    ZCForm.triggerExternalOnUser(ExternalFieldName);
}
function gDocImportFile(fileName, gDocId)
{
	var importEl = $("#gFormName");
	if($(importEl).attr("importOpen") == 'true')
	{
		$("[name=GDOC_ID]").val(gDocId);
		$("#gFormName").html(fileName);
		closeDialog();
		$(importEl).attr("importOpen", false);
	}
	else
	{
		ZCForm.googleDocAttachEvent(fileName, gDocId);
	}
}
function closeGDocDialog()
{
	var importEl = $("#gFormName");
	if($(importEl).attr("importOpen") == 'true')
	{
		closeDialog();
		$(importEl).attr("importOpen", false);
	}
	else
	{
		ZCForm.closeDocsAttachTemplate();
	}
}

function selectedDocDetails(docDetails, docName)
{
	ZCForm.cloudDocAttachEvent(docDetails, docName);
	closeCloudPicDialog();
}

function closeCloudPicDialog()
{
	$("#zc-gadgets_cloudpicker_div").remove();
	$("[isAttachOpen=true]:first").removeAttr("isAttachOpen");
}

isViewBeta = false;
var ZCForm = new function()
{
	this.formArr = [];
	this.showFormVar = "true";
	this.custParams = "";
	this.onUserInputElem = new Array();
	this.editorRef =  new Array();
	this.isEmbeddedForm = "false";
	this.isPermaForm = "false";
	this.inZohoCreator = true;
	this.zcFormAttributes = new Array();
	this.zcFormAttributes['formParentDiv'] = true;
	this.zcFormAttributes['customCalendar'] = false;
	this.zcFormAttributes['browseralert'] = false;
	this.zcFormAttributes['ajaxreload'] = true;
	this.zcFormAttributes['fieldContainer'] = "tr";
	this.zcFormAttributes['eleErrTemplate'] = "<tr tag='eleErr'><td width='100%' height='100%' valign='top' colspan='insertColSpan' class='zc-form-errormsg' > insertMessage </td></tr>";
	this.isSubFormFileSubmit = false;
	this.focusElement = "";
	this.formLabelWidth = "auto"; //No I18N
	this.isRecursiveCall = false;

	this.addToFormArr = function(formParamsMap, formLinkName)
	{
		formParamsMap = formParamsMap.substring(1, formParamsMap.length-1);
		formParamsMap = ZCUtil.getParamsAsMap(formParamsMap, ",", "=");
        isViewBeta = ZCUtil.getFromMap(formParamsMap, "isViewBeta") == "true";//No I18N
        this.formLabelWidth = ZCUtil.getFromMap(formParamsMap, "formLabelWidth");//No I18N
		this.formArr[formLinkName] = formParamsMap;
                if(isViewBeta)
                {
                    ZCApp.dialogAbove = "<div class=\"zc-dialog-heading zc-dialog-noheading\" elname=\"zc-dialogheader\"><h1 elname=\"zc_dialog_header\">&nbsp;</h1></div><div class=\"zc-dialogdiv zc-noappearance\">";
                }
	}

	this.addNextUrlToFormArr = function(zcNextUrl, formLinkName)
	{
		if(zcNextUrl && zcNextUrl != "")
		{
			var formParamsMap = ZCForm.formArr[formLinkName];

			formParamsMap["zc_NextUrl"] = new Array();
			var val = formParamsMap["zc_NextUrl"];
			val[val.length] = zcNextUrl;

			ZCForm.formArr[formLinkName] = formParamsMap;
		}
	}

	this.callFormOnLoad = function(formActionMap, formID, formLinkName, formAccessType)
	{
		ZCForm.showFormVar = "true";
		var invokeOnLoad = false;
		if(formActionMap.length > 4)
		{
			formActionMap = formActionMap.substring(1, formActionMap.length-1);
			formActionMap = ZCUtil.getParamsAsMap(formActionMap, ",", "=");
			try {
				invokeOnLoad = (formAccessType == ZCConstants.FORM_LOOKUP_ADD_FORM || formAccessType == ZCConstants.FORM_ALONE || formAccessType == ZCConstants.VIEW_ADD_FORM)?ZCUtil.getFromMap(formActionMap, ZCConstants.FORM_EVENT_ON_LOAD):false;
				invokeOnLoad = (formAccessType == ZCConstants.VIEW_EDIT_FORM)?ZCUtil.getFromMap(formActionMap, ZCConstants.EDIT_FORM_EVENT_ON_LOAD):invokeOnLoad;
			} catch(e) { }
			if(invokeOnLoad) doActionOnLoad(formID, ZCForm.getForm(formLinkName, formAccessType)[0]);
			else ZCForm.enableForm(formLinkName, formAccessType);
		}
		else
		{
			ZCForm.enableForm(formLinkName, formAccessType);
		}
	}


	this.enableForm = function(formLinkName, formAccessType,subFormLabelName)
	{
		var frm = ZCForm.getForm(formLinkName, formAccessType,subFormLabelName);
		if($(frm).attr("formType") == "SubForm" || !this.zcFormAttributes['formParentDiv'])
		{
			$(frm).css("visibility", "visible");
			return false;
		}
		ZCUtil.getParent(frm, "div").css("visibility", "visible");
		//$(frm).find(":input[type!=hidden]:eq(0)").focus();
		if(ZCApp.inZC)
		ZCForm.setFocus(frm);
                                this.handleScreenResize(frm);
	}


	this.handleScreenResize = function(formCont) {
		if(isViewBeta) {
			var zcFieldsTable = formCont.find('table[elName=zc-fieldsTable]');//No I18N
			if(ZCForm.formLabelWidth == 'auto') { //No I18N
				zcFieldsTable.each(function() { //No I18N
					var maxWidth = 0;
					var tdList = $(this).find("tbody tr td[class=zc-labelheader]"); //No I18N
					tdList.find('label').each(function() { //No I18N
						var wi = $(this).outerWidth();
						if(wi>maxWidth) maxWidth = wi;
					});
					tdList.css("width", (maxWidth+10) + "px"); //No I18N
				});
			}
			var totalWidth = 0;
			zcFieldsTable.each(function() { //No I18N
				totalWidth = totalWidth + $(this).width();
			});
			var inpElSpan = formCont.find('table[elName=zc-submitTable]').find("span[elName=zc-formsubmitspan]");//No I18N
                                                var padding =  (totalWidth - inpElSpan.width())/2;
			inpElSpan.css("padding-left", (padding>0)?padding:0);//No I18N
		}
	}


	this.setFocus = function(frm)
	{
		var firstElement = ZCForm.getFirstVisibleElement(frm);
		if(firstElement)
		{
			var x = window.scrollX, y = window.scrollY;
			$(firstElement).focus();
			window.scrollTo(x, y);
		}

	}
	this.getFirstVisibleElement = function(frm)
	{
		var element;
		$(frm).find("table[elname=zc-fieldsTable]").find("tr").each(function()
		{
			var style = $(this).css("display");
			var parentStyle = $(this).parents("tr").css("display");
			if(style != "none" && parentStyle != "none")
			{
				element = $(this).find(":input[type!=hidden]:eq(0)");
				if($(element).attr("name")!=null)
				return false;
			}

		});
		return element;
	}

	this.getNextLookupPage = function(respTxt, paramsMap, argsMap)
	{
		var compName = ZCUtil.getFromMap(argsMap, "compName");
		var El = $("div[zcSearchDDFieldName="+compName+"]:first");
		$(El).html(respTxt);
		ZCForm.regCustomLookUpEvents(El);
	}

	this.regCustomLookUpEvents = function(El)
	{
		$(El).find("[elName=zcSearchDDListing] tr").click(function()
		{
			ZCForm.selectExternalModule(this);
		});
		$(El).find("[elName=zcSearchDDListing] tr").mouseover(function()
		{
			$(this).removeClass().addClass("custom_dropdown_menu_selected");
		});
		$(El).find("[elName=zcSearchDDListing] tr").mouseleave(function()
		{
			$(this).removeClass("custom_dropdown_menu_selected");
		});
		$(El).find("[elName=zc-zcDDPaginationEl]").click(function(event)
		{
			ZCApp.hideAndStopPropogation(event);
			var parEl = $(this).parents("div[elName=zcDDPagination]:first");
			var formID = $(parEl).attr("zcFormID");
			var formCompID = $(parEl).attr("zcFormCompId");
			var reqPage = $(this).attr("showList");
			var startIndex = $(parEl).find("[startIndex]").attr("startIndex");
			var endIndex = $(parEl).find("[startIndex]").attr("endIndex");
			var compName = $(parEl).attr("zcsearchddfieldname");
			var urlParams = "formID="+formID+"&formCompID="+formCompID+"&startIndex="+startIndex+"&endIndex="+endIndex+"&reqPage="+reqPage+"&compName=" + compName;
			var args = "compName=" + compName;
			ZCUtil.sendRequest("/live/common/jsp/form/fields/getnextpagelist.jsp", urlParams, "html", "ZCForm.getNextLookupPage", ZCUtil.getParamsAsMap(args), i18n.pleasewait); //No I18N
		});

		$(El).find("[elName=zcDropDownSelVal],[elName=zcDropDownImg]").click(function(event) {
			var isVisible = $(this).parents("[elName=zc-fieldtd]:first").find("[elName=zcDDPagination]:first").is(":visible");
			ZCApp.hideAndStopPropogation(event);
			$("[elName=zcDDPagination]").hide();
			if(!isVisible)
			{
				$(this).parents("[elName=zc-fieldtd]:first").find("[elName=zcDDPagination]:first").show();
			}
			else
			{
				$(this).parents("[elName=zc-fieldtd]:first").find("[elName=zcDDPagination]:first").hide();
			}
		});
	}

	this.selectExternalModule = function(thisObj)
	{
		var El = $(thisObj).parents("[elName=zc-fieldtd]:first");
		$(El).find(":input[type=text]").val($(thisObj).attr("elValue"));
		$(El).find("div[elName=zcDropDownSelVal]").html($(thisObj).attr("elDispVal"));
		$(El).find("div[elName=zcDDPagination]").hide();

		var mainForm =  $(El).parents('form');
		var mainFormLinkName = $(mainForm).attr("name");
		var formParamsMap = ZCForm.formArr[mainFormLinkName];
		var formAccessType = ZCUtil.getFromMap(formParamsMap,"formAccessType");//No I18N
		var formID  = ZCUtil.getFromMap(formParamsMap,"formID");
		var formElem = ZCForm.getForm(mainFormLinkName, formAccessType);

		ZCForm.invokeOnChange($(El).find(":input[type=text]"), mainForm, formAccessType);
	}

	this.setFieldValsFromURL = function(formLinkName, formAccessType)
	{
		var loc = location.href;
		if(formLinkName == ZCApp.currZCComp)
		{
			var params = loc.substr(loc.lastIndexOf("/")+1);
			var hashIdx = params.indexOf("#");
			var qstIdx = params.indexOf("?");
			if(hashIdx != -1 && qstIdx != -1)
			{
				if(hashIdx == 0 && qstIdx != -1)
				{
					params = params.substr(qstIdx+1)
				}
				else
				{
					params = params.substring(0, hashIdx) + "&" + params.substr(qstIdx+1);
				}
			}

			var paramsMap = ZCUtil.getParamsAsMap(params);

			$.each(paramsMap, function(paramName, paramValue)
			{
				if(paramName.indexOf(".do?") != -1) 
				{
				      paramName = paramName.substring(paramName.indexOf(".do?")+4);
				}
				
				if(paramName.indexOf("?") != -1) 
				{
				      paramName = paramName.substring(paramName.indexOf("?")+1);
				}
				
					if(paramName != "sharedBy" && paramName != "appLinkName")
					{
						for(var i = 0; i < paramValue.length;i++)
						{
							paramValue[i]=decodeURIComponent(paramValue[i]);
						}
						var el = ZCForm.getField(formLinkName, paramName, formAccessType);
						var elType = el.attr("type");											// No I18N
						if(elType != "searchLookupSingle" && elType != "searchLookupMulti")
						{
							ZCForm.setFieldValue(formLinkName, paramName, formAccessType, paramValue);
						}
					}
			});
		}
	}

	this.showHideField = function(toShow, formLinkName, fieldName, formAccessType)
	{
       var trID = formLinkName+"-"+fieldName+"-"+formAccessType;
		var eltr = $("#"+trID);
		if(eltr.length == 0)
		{
			var el = ZCForm.getField(formLinkName, fieldName, formAccessType);
			if(ZCUtil.isNull(el))
			{
				el = $(ZCForm.getForm(formLinkName, formAccessType)).find("div[name=parentOf-"+fieldName + "],span[name=parentOf-"+fieldName + "]");
			}
			if(ZCUtil.isNull(el))

	        {
	        	el = $(ZCForm.getForm(formLinkName, formAccessType)).find("td[elName="+fieldName+"_label]");
	       }
	       eltr = ZCUtil.getParent(el, "tr");
	       // specifically put for zohosites bcoz their form field construction based on li in ul instead of tr in table
           if(eltr == undefined)
           {
                    eltr = ZCUtil.getParent(el, "li");
           }

//			var eltable = ZCUtil.getParent(eltr, "table");
//			var colCount = eltable.attr("colCount");

		}
		if($(el).is(':button') || $(el).is(':submit') || $(el).is(':reset'))
		{
			eltr = el;
		}	
		if(eltr != undefined)
		{
			eltr.css("display", toShow?"":"none");
		}
		//Custom event triggered to reposition the disable div - Rich Text Field
		

	}

	this.enDisableField = function(disable, formLinkName, fieldName, formAccessType)
	{
		var el = ZCForm.getField(formLinkName, fieldName, formAccessType);
		var type = el.attr("type");
		var elToLoop = (type == "image" || type == "url")?el.find(":input"):el;
		if (type == "image" && formAccessType == "3")
		{
			el.find("a[enable=enable]").each(function(index, elem) {
				(disable) ? $(elem).css("visibility", "hidden"): $(elem).css("visibility", "visible");
			});
		}
		$.each(elToLoop, function(index, elem)
		{
			$(elem).attr("disabled", disable);
		});

		if(type == "radio" || type == "checkbox" || type == "select-one" || type == "select-multiple")	{

			var par = (type=="radio"||type=="checkbox")?ZCUtil.getParent(el).parent():ZCUtil.getParent(el);
			var spanToLoop = par.find("span");
			$.each(spanToLoop, function(index, elem){
						if($(elem).attr("elname") == "zc-show-parent"){

							if(disable) $(elem).css("visibility", "hidden");
							else $(elem).css("visibility", "visible");
						}
					}
			);

		}
		
		var modtype=$("#"+fieldName).attr("modtype");
		if((modtype!==undefined) && (modtype===ZCConstants.ZOHO_CRM_USERS))
		{
			$("#"+fieldName).attr("disabled", disable);
		}
		
		if(el.attr("fieldtype") == ZCConstants.FILE_UPLOAD)
		{
		var fieldid=el.attr("formCompID"); //No internationalization
		$("a[id=zc-toggleupload-"+fieldid+"]").css("visibility", disable?"hidden":"visible"); //No internationalization

 		}
		
		if(el.attr("fieldtype") == ZCConstants.RICH_TEXT_AREA && !ZCApp.isMobileSite)
		{	
			var textareaname = el.attr("formcompid");
			var freezdivid = "freezdiv_" + textareaname;
			var _editordiv = $("div[textareaname=" + textareaname + "]");
			
			var divID = _editordiv.attr("id");//No I18N
			
			var _RTEditor = ZCForm.editorRef[divID];
			//console.log(divID);
			try{
			if(_RTEditor){
			
				if(_RTEditor.mode == "plaintext"){
					$(_RTEditor._textarea).attr("disabled" , disable);
				}else{
					var _iframe = _RTEditor.iframe;
					var desMod = disable?"off":"on";
					if(!($.browser.msie))
					_RTEditor.doc.designMode = desMod;
					else
						{
						var ieMod = disable?"false":"true";
						_RTEditor.doc.body.contentEditable=ieMod; //test
						}
					}
				}
			}
			catch(e4){}
			
			if( _editordiv.find("#"+freezdivid)[0] ){

				var _freezdiv = _editordiv.find("#"+freezdivid);
				var _map = {
								"zIndex":disable?50:-50
							};
				ZE_Init.tabKeyHandling=true;
				_freezdiv.css(_map);

			}else if(disable){

			    var _newdiv = document.createElement("div");
				_newdiv.className = "freezeLayer";
				_newdiv.id = freezdivid;
				
				var _map = {
						"left":"0",
						"top":"0",
						"height":"100%",
						"width":"100%",
						"zIndex":50,
						"background":"#AAAAAA",
						"border":"1px solid #AAAAAA"
					};
				$(_newdiv).css(_map);
				_editordiv[0].appendChild(_newdiv);
				
										
			}
		}
		
		/*if(el.attr("fieldtype") == ZCConstants.RICH_TEXT_AREA && !ZCApp.isMobileSite)
		{	
			var textareaname = el.attr("formcompid");
			var freezdivid = "freezdiv_" + textareaname;
			var freezdivbody = "bodydiv_" + freezdivid;
			var _editordiv = $("div[textareaname=" + textareaname + "]");
			
			var divID = _editordiv.attr("id");//No I18N
			
			var _RTEditor = ZCForm.editorRef[divID];
			
			//console.log(divID);
			try{
				if(_RTEditor && _RTEditor.doc)	{
					
					if(_RTEditor.mode == "plaintext") {
					
						$(_RTEditor._textarea).attr("disabled" , disable);
					
					} else {
						
						//var _iframe = _RTEditor.iframe;
						var toolbardiv = _editordiv.find('div[class="ze_toolbarbg"]');
						
						if(toolbardiv) {
							
							if(disable){
								toolbardiv.hide();
							}else{
								toolbardiv.show();
							}

							//var if1 = _editordiv.find('iframe');
							//var yy = if1[0];
							//yy.contentDocument.bgColor = disable ?  '#AAAAAA' : '#FFFFFF';
							
							_RTEditor.iframe.contentDocument.bgColor = disable ?  '#AAAAAA' : '#FFFFFF';		
							
							if(!($.browser.msie)) {
								_RTEditor.doc.designMode = disable?"off":"on"; 					
							}
							else {
								var ieMod = disable?"false":"true";
								_RTEditor.doc.body.contentEditable=ieMod; //test
								$(_RTEditor.doc.body).keydown(function(event){
									 event.cancelBubble = true;
									 event.returnValue = false;
								} );
							}
							
						} else {

							setTimeout( function() {
														ZCForm.enDisableField(disable, formLinkName, fieldName, formAccessType);
												}, 100);
						}
					}
				
				}else{
				
					setTimeout( function(){
												ZCForm.enDisableField(disable, formLinkName, fieldName, formAccessType);
										}, 100);
				}
				
				
			} catch(e4) {
				console.log(fieldName);
				console.log(e4);
			}
		}*/

		if((el.attr("type") == "radio") || (el.attr("type") == "checkbox" && el.attr("fieldtype") !=  9))
		{
		  var optTbl = docid("opt-table-"+el.attr("formCompID"));
		  el = $(optTbl);

		  if(disable) ZCUtil.getParent(el).attr("status","disable");
		  else ZCUtil.getParent(el).attr("status","enable");
		}
		else if(el.attr("delugeType") == "TIMESTAMP")
		{
			if(disable) ZCUtil.getParent(el).find("a").css("visibility", "hidden");
			else ZCUtil.getParent(el).find("a").css("visibility", "visible");
		}
		else if(el.attr("subType") == "file")
		{
		   var ele = ZCForm.getFileUploadField(formLinkName, fieldName, formAccessType);
		   (ele).attr("disabled", disable);
		}
		else if(el.attr("disptype") == "popup")
		{
			var divEl = $(el).parents("[elname=zc-fieldtd]:first").find("[elname=zcDisableDiv]");
			if(disable)
			{
				$(divEl).show();
			}
			else
			{
				$(divEl).hide();
			}
		}
		else if(type == "searchLookupSingle" || type == "searchLookupMulti")
		{
			if(disable)
			{
				$(el).parent("div:first").find("div[elName=srchDivEl]").css("display","none");   // No I18N
				$(el).css("background-color","#ebebe4");
				$(el).unbind();
			}
			else
			{
				$(el).css("background-color","");
					$(el).click(function(event)
					{
						searchFactory.setVariables(this,false);
						searchFactory.triggerClickEvent(event);
			
					});
			}
		}
		else if(type == "picklist")
		{
			if(disable)
			{
				$(el).css("background-color","#ebebe4");
			}
			else
			{
				$(el).css("background-color","");
			}
		}
	}
	//Two new functions - To Show/Hide Subform's Add and Delete buttons
	this.hideShowAddEntry = function(toHide, formLinkName, fieldName, formAccessType)
	{
		var subform = $('body').find('div[name='+fieldName+']');
		var addbutton1 = subform.find('div[id='+fieldName+'_addNewLine]');
		var addbutton2 = subform.find('table').find('tr[elname='+fieldName+'_norecordrow]').find('span[class=add_value_link]');
		
		if(toHide)
		{
			$(addbutton1).hide();
			$(addbutton2).hide();
		}
		else
		{
			$(addbutton1).show();
			$(addbutton2).show();
		}
	}

	this.hideShowDeleteEntry = function(toHide, formLinkName, fieldName, formAccessType)
	{
		$('body').find('div[name='+fieldName+']').find('table').find('tr[elname=dataRow]').each(function()
		{
			if(toHide) 
			{
				$(this).first().find('a').hide();				//Hide Delete Buttons
			}
			else
			{
				$(this).first().find('a').show();				// Shows Delete buttons
			}
		});
	}
	
	this.addButtonStatus = function(fieldName)
	{
		var subform = $('body').find('div[name='+fieldName+']');
		var addbutton1 = subform.find('div[id='+fieldName+'_addNewLine]');
		return $(addbutton1).is(':visible');
	}
	
	this.deleteButtonStatus = function(fieldName)
	{
		return $('body').find('div[name='+fieldName+']').find('table').find('tr[elname=dataRow]:last').first().find('a').is(':visible');
	}
	
	this.clearField = function(formLinkName, fieldName, formAccessType)//issue fix
	{
		var el = ZCForm.getField(formLinkName, fieldName, formAccessType);
		var optTbl;
		var inputEl;
		if(el.attr("type") == "radio"||el.attr("type") == "checkbox")
                {
                        inputEl = $(el); // Input Ele
                        optTbl = docid("opt-table-"+el.attr("formCompID")); // Table Ele
                        el = $(optTbl).parent(); // Span Ele
                }
		if($(el).attr("disptype") == "popup")
		{
			var defVal = "-Select-";
			$(el).val(defVal);
			var parEl = $(el).parents("[elname=zc-fieldtd]:first");
			var selEl = $(parEl).find("[elname=zcDDPagination]");
			$(parEl).find("[elname=zcDropDownSelVal]:first").html(defVal);
			$(selEl).find("tr").each(function(){
				if($(this).attr("elValue") != defVal)
				{
					$(this).remove();
				}
			});
			ZCForm.invokeOnChange($(el).find(":input[type=text]"), mainForm, formAccessType);
		}
		else if($(el).attr("type") == "searchLookupSingle" || $(el).attr("type") == "searchLookupMulti")
		{
			 $(el).data('immutable',true);
			 searchFactory.clearCache(fieldName);
			 $(el).find("li").remove();
			 $(el).parent("div:first").find("div[elName=srchValDiv]").find("table").attr("issaturated","true");  // No I18N
		     $(el).parent("div:first").find("div[elName=srchValDiv]").find("table").find("tr[value!=-Select-]").remove();
		     if($(el).attr("type") == "searchLookupSingle")
			 {
		    	 var valhtml = searchFactory.formatValueToShow($(el).parent("div:first").find("table").find("tr[value=-Select-]"), $(el).attr("name"), $(el).attr("type"),$(el).width());
		    	 $(el).append(valhtml);
			 }
			 else
			 {
				 $(el).find("span[elName=selectEl]").show();
			 }
		}
		else
		{
                        if(el.attr("type") == "radio" || el.attr("type") == "checkbox")
                        {
                                $(optTbl).empty();
                        }
                        else
                        {
                                el.empty();
                        }
		}
		return el[0];
	}

	this.setFieldValue = function(formLinkName, fieldName, formAccessType, fieldValue, subFormLabelName, isFromSubForm, rowNo, combinedValue, onChangeFlag)
	{
		onChangeFlag = onChangeFlag == undefined ? true:onChangeFlag;
		var el ;
		if(isFromSubForm)
		{
			if(rowNo != -1)
				el = $(ZCForm.getForm(formLinkName, formAccessType)).find(":input[rowLabelName='"+fieldName+"_"+rowNo+"'], div[elName=srchDiv][labelName='"+fieldName+"'][subformrow='"+rowNo+"']");
		}
		else
		{
			el = ZCForm.getField(formLinkName, fieldName, formAccessType,subFormLabelName);
		}
		var elType = el.attr("type");
		var elToLoop = (elType == "image" || elType == "url")?el.find(":input"):el;
		if(!newGenerateJsCodeEnabled && fieldValue.constructor.toString().indexOf("Array")  == -1)
		{
			fieldValue = fieldValue.replace(new RegExp(ZCConstants.REPLACE_DQ_CHAR,'g'),"\"");
		}

		var combinedValueList = new Array();
		if(combinedValue != undefined)
		{
			if(combinedValue.constructor.toString().indexOf("Array")  == -1)
			{
			   combinedValueList.push(combinedValue);
			}
			else
			{
				combinedValueList = combinedValue;
			}
		}

		var paramsMap = ZCForm.formArr[formLinkName];
		var formID = ZCUtil.getFromMap(paramsMap, "formID");  // No I18N
		if(!ZCForm.isAddToParentLookup && elType == "searchLookupMulti")
    	{
			$(el).find("li").remove();
    	}
		if(elType == "searchLookupSingle" || (elType == "searchLookupMulti" && typeof(fieldValue) == "string"))
		{
			if(elType == "searchLookupSingle" && fieldValue == "")
			{
				fieldValue = "-Select-";  // No I18N
			}
			var tmpFieldValue = "";
			if(typeof(fieldValue) == "object")
			{
				tmpFieldValue = fieldValue[0].replace("'","");
			}
			else
			{
				tmpFieldValue = fieldValue.replace("'","");
			}
			if($(el).find("li[selValue='"+tmpFieldValue+"']").length == 0)
			{
				var trEl = $(el).parent("div").find("div[elName=srchValDiv]").find("table").find("tr[value='"+tmpFieldValue+"']");
	            var inputname = !ZCUtil.isNull(isFromSubForm) ? $(el).attr("name") : fieldName;
	            var valHtml = searchFactory.formatValueToShow(trEl, inputname, elType,$(el).width(),fieldValue, combinedValueList[0]);
				$(el).find("span[elName=selectEl]").hide();
				$(el).find("li").remove();
				$(el).append(valHtml);
			}
			var onChangeExists = $(el).attr("onChangeExists"); // No I18N
			var formCompId = $(el).attr("formCompId"); // No I18N
			if(onChangeFlag && onChangeExists == "true" && formAccessType != ZCConstants.VIEW_BULK_EDIT_FORM)
			{
				ZCForm.showHideCog(el, "visible");  // No I18N
				onChangeScript(ZCForm.getForm(formLinkName, formAccessType),formID, formCompId,formAccessType,true);
			}
		}
		else if(elType == "searchLookupMulti" && typeof(fieldValue) == "object")
		{
			var inputname = !ZCUtil.isNull(isFromSubForm) ? $(el).attr("name") : fieldName;
			for(var i = 0; i < fieldValue.length; i++)
			{
				var tmpFieldValue = fieldValue[i].replace("'","");
				if($(el).find("li[selValue='"+tmpFieldValue+"']").length == 0)
				{
					var trEl = $(el).parent("div").find("div[elName=srchValDiv]").find("table").find("tr[value='"+tmpFieldValue+"']");
					var valHtml = searchFactory.formatValueToShow(trEl, inputname, elType, $(el).width(),fieldValue[i], combinedValueList[i]);
					$(el).find("span[elName=selectEl]").hide();
					$(el).append(valHtml);
				}
			}
			var onChangeExists = $(el).attr("onChangeExists"); // No I18N
			var formCompId = $(el).attr("formCompId"); // No I18N
			if(onChangeExists == "true" && formAccessType != ZCConstants.VIEW_BULK_EDIT_FORM)
			{
				ZCForm.showHideCog(el, "visible");  // No I18N
				onChangeScript(ZCForm.getForm(formLinkName, formAccessType),formID, formCompId,formAccessType,true);
			}
		}

		var chck = false;
		var radioOther = true;
		var picklistOther =true;
		$.each(elToLoop, function(index, elem)
		{
			if((elType == "radio" || elType == "checkbox") && !ZCForm.isAddToParentLookup)
			{
				$(elem).removeAttr("checked");
			}
			if(elType == "radio" && $(elem).val() == fieldValue)
			{
				$(elem).prop("checked", "checked");
				radioOther = false;
			}
			else if(elType == "checkbox")
			{
			 	if(el.attr("delugetype")  == "BOOLEAN")//if(fieldValue.constructor.toString().indexOf("Array")  == -1)
				 {
				     if(fieldValue == "true")
				     {
					 $(elem).prop("checked", "checked");
				     }
				     else
				     {
					 $(elem).removeAttr("checked");
				     }
				 }
				 else
				 {
					 for(var i = 0;i < fieldValue.length;i++)
					 {
						 if($(elem).val() == fieldValue[i])
						 {
							 chck = true;
							 $(elem).prop("checked","checked");
						 }
					 }
					 if (!chck && fieldValue.length == 1 && fieldValue[0].indexOf(",") > 0)
					 {
						 var tmpFieldValue = fieldValue[0].split(",");
						 for(var i = 0;i < tmpFieldValue.length;i++)
						 {
							 if($(elem).val() == tmpFieldValue[i] || $(elem).val() == tmpFieldValue[i].trim())
							 {
								 $(elem).prop("checked","checked");
							 }
						 }
					 }
				 }
			}
			else if(elType == "plaintext")
			{
				fieldValue = fieldValue ? fieldValue.toString() : '';
				$(elem).html(fieldValue);
			}
			else if(elType == "hidden" || elType == "text"|| elType == "picklist"  || elType == "select-one" || elType == "textarea" || elType == "number" || elType == "email")
			{
				if(fieldValue == "" && (elType == "picklist" || elType == "select-one"))
				{
					$(elem).val("-Select-");
					picklistOther = false;
				}
				else if($(elem).attr("fieldtype") == ZCConstants.RICH_TEXT_AREA && elType == "textarea")
				{
					var textareaname = $(elem).attr("name");
					var richtextdiv = $("div[nameoftextarea='" + textareaname + "']"); //No I18N
					var divID = $(richtextdiv).attr("id");//No I18N
					if (divID  !=  "" && ZCForm.editorRef[divID] != null) //No I18N
					{
					ZCForm.editorRef[divID].setContent(fieldValue);
					}
				}
				else
				{
					$(elem).val(fieldValue);
				}
				if($(elem).attr("disptype") == "popup")
				{
					var parEl = $(elem).parents("[elname=zc-fieldtd]:first");
					var selEl = $(parEl).find("[elname=zcDDPagination] tr[elvalue='"+ fieldValue +"']");
					if(selEl != null)
					{
						$(parEl).find("[elname=zcDropDownSelVal]:first").html(fieldValue);
					}
				}
				try{
					if(elType == "picklist"  || elType == "select-one"){
						if(typeof(fieldValue) == "object")
						{
							var temp = fieldValue[0].replace("'","");
							if($(elem).find("option[value='"+temp+"']").length != 0)
							{
								picklistOther = false;
							}
						}
						else
						{
							var elToLoop = $(el).children();
                            $.each(elToLoop, function() {
                                if($(this).val() == fieldValue)
                                {
                                	picklistOther = false;
                                	return false;
                                }
                            });
						}
					}
				}
				catch(e){}
			}
		    else if(elType == "select-multiple" || elType == "multiselect")
		    {
		    	if(!ZCForm.isAddToParentLookup)
		    	{
		    		$(el.find("option")).removeAttr("selected");
		    	}
				for(var i = 0; i < fieldValue.length; i++)
				{
					var mulEle = $(el.find("option[value='"+fieldValue[i]+"']"));//No I18N
					if (mulEle.length > 0)
					{
						chck = true;
						mulEle.prop("selected","selected");//No I18N
					}
				}
				if (!chck && fieldValue.length == 1 && fieldValue[0].indexOf(",") > 0)
				{
					var tmpFieldValue = fieldValue[0].split(",");
					for(var i = 0;i < tmpFieldValue.length;i++)
					{
						var mulEle = $(el.find("option[value='" + tmpFieldValue[i] + "']"));//No I18N
						if (mulEle.length > 0)
						{
							mulEle.prop("selected","selected");//No I18N
						}
						else
						{
							$(el.find("option[value='" + tmpFieldValue[i].trim() + "']")).prop("selected","selected");//No I18N
						}
					}
				}
		    }
			else if(elType == "image" || elType == "url")
			{
				if(newGenerateJsCodeEnabled){
					fieldValue =  fieldValue ? fieldValue : '' ;
				}
                		fieldValue = fieldValue.toString();
				var valArr = ZCUtil.getAttrsAsArr(fieldValue,elType);
				setImageUrlValue(formLinkName, fieldName, valArr, formAccessType)
			}
		});
		
		/**
		 * Handled for other option by script
		 */
		if(elType == "radio")
		{
			if(radioOther && fieldValue!='')
			{
				$.each(elToLoop, function(index, elem)
				{
					if($(elem).val() == "-otherVal-")
					{
						$(elem).prop("checked", "checked");
						$(elem).closest('table').siblings('div').find('input').val(fieldValue);
						$(elem).closest('table').siblings('div').show()
					}
				});
			}
			else
			{
				$.each(elToLoop, function(index, elem)
				{
					$(elem).closest('table').siblings('div').hide();
					$(elem).closest('table').siblings('div').find('input').val("");
				});
			}
		}
		if(elType == "picklist" || elType == "select-one")
		{
			if(picklistOther)
			{
				$.each(elToLoop, function(index, elem)
				{
					if($(elem).find("option[value='-otherVal-']").length == 1)
					{
						$(elem).val("-otherVal-");
					}
					else
					{
						$(elem).val("-Select-");
					}
					$(elem).siblings('div').find('input').val(fieldValue);
					$(elem).siblings('div').show();
				});
			}
			else
			{
				$.each(elToLoop, function(index, elem)
				{
					$(elem).siblings('div').hide();
					$(elem).siblings('div').find('input').val("");
				});
			}
		}
		
		return el[0];
	}

	this.setSubFormValue = function(formLinkName, fieldName, formAccessType, fieldValue, disType, combinedValue){

		if(disType == ZCConstants.SUB_FORM_GRID){
			return ZCForm.setFieldValue(formLinkName, fieldName, formAccessType, fieldValue, null, false, null , combinedValue, false);
		}
		else{
			//console.log("Client side action supported only for GridType : " + fieldName + "_____" + fieldValue);
		}
	}

    this.doActionOnInit = function(formLinkName,formCompID,formAccessType)
    {
            var frm = ZCForm.getForm(formLinkName, formAccessType);
            onInitScript(frm, $(frm).find(":input[name=formid]").val(), formCompID, formAccessType);
    }

	this.selectDeselect= function(formLinkName, fieldName, formAccessType, fieldValue, selectBool, combinedValue)
	{
	    var el = ZCForm.getField(formLinkName, fieldName, formAccessType);
		var elType = el.attr("type");

		if((elType == "radio" || elType == "picklist" || elType == "select-one" || el.attr("disptype") == "popup") && selectBool)
		{
			el = ZCForm.setFieldValue(formLinkName, fieldName, formAccessType, fieldValue, null, false, null, combinedValue);
		}
		else if(elType == "multiselect" || elType == "select-multiple" || elType == "checkbox")
		{
			var onChange = false;
			var elToLoop = (elType == "checkbox")?el:$(el).children();
			var lastEl = null;
		        $.each(elToLoop, function(){
			      var preValue = (elType == "checkbox")?$(this).prop("checked"):$(this).prop("selected");
                  if(fieldValue.constructor.toString().indexOf("Array")  == -1)
			      {
		                 fieldValue = fieldValue.replace(new RegExp(ZCConstants.REPLACE_DQ_CHAR,'g'),"\"");//No I18N
                         fieldValue = fieldValue.replace(new RegExp(ZCConstants.REPLACE_NL_CHAR,'g'),"\n"); //No I18N
		                 if($(this).val() == fieldValue) (elType == "checkbox")?$(this).prop("checked",selectBool):$(this).prop("selected",selectBool);
			      }
			      else
			      {
   		                 if(jQuery.inArray(($(this).val()),fieldValue)!= -1)  (elType == "checkbox")?$(this).prop("checked",selectBool):$(this).prop("selected",selectBool);
			      }
			      var postValue = (elType == "checkbox")?$(this).prop("checked"):$(this).prop("selected");
			      if(preValue != postValue)
			      {
			         onChange = true;
			      }
			      lastEl = (elType == "checkbox")?$(this):$(el);
                           });
			if(onChange)
			{
			   if(lastEl != null)
			   {
			      fireOnChange(lastEl);
			   }
			}
        }
		else if(!selectBool)
		{
			if(elType == "radio")
			{
			$(el).removeAttr("checked");
			}
			else if(elType == "picklist" || elType == "select-one")
			{
			$(el).val(selectBool);
			}

		}

		var combinedValueList = new Array();
		if(combinedValue != undefined)
		{
			if(combinedValue.constructor.toString().indexOf("Array")  == -1)
			{
			   combinedValueList.push(combinedValue);
			}
			else
			{
				combinedValueList = combinedValue;
			}
		}

		if(elType == "searchLookupSingle" || (elType == "searchLookupMulti" && typeof(fieldValue) == "string"))
		{
			if(selectBool)
			{
				if($(el).find("li[selValue='"+fieldValue+"']").length == 0)
				{
	                var trEl = $(el).parent("div").find("div[elName=srchValDiv]").find("table").find("tr[value='"+fieldValue+"']");
	                var valHtml = searchFactory.formatValueToShow(trEl, fieldName, elType,$(el).width(), fieldValue, combinedValueList[0]);
					$(el).find("span[elName=selectEl]").hide();
					if(el.attr("fieldType") == ZCConstants.SINGLE_SELECT)
					{
						$(el).find("li").remove();
					}
					$(el).append(valHtml);
				}
			}
			else
			{
				$(el).find("li[selValue='"+fieldValue+"']").remove();
			}
			if($(el).find("li").length == 0)
			{
				if(elType == "searchLookupSingle")
				{
					var valhtml = searchFactory.formatValueToShow($(el).parent("div:first").find("table").find("tr[value=-Select-]"), $(el).attr("name"), elType,$(el).width());
					$(el).append(valhtml);
				}
				$(el).find("span[elName=selectEl]").show();
			}
		}
		else if(elType == "searchLookupMulti" && typeof(fieldValue) == "object")
		{
			if(selectBool)
			{
				for(var i = 0; i < fieldValue.length; i++)
				{
					if($(el).find("li[selValue='"+fieldValue[i]+"']").length == 0)
					{
						var trEl = $(el).parent("div").find("div[elName=srchValDiv]").find("table").find("tr[value='"+fieldValue[i]+"']");
						var valHtml = searchFactory.formatValueToShow(trEl, fieldName, elType, $(el).width(),fieldValue[i], combinedValueList[i]);
						$(el).find("span[elName=selectEl]").hide();
						$(el).append(valHtml);
					}
				}
			}
			else
			{
				for(var i = 0; i < fieldValue.length; i++)
				{
					$(el).find("li[selValue='"+fieldValue[i]+"']").remove();
				}
			}
			if($(el).find("li").length == 0)
			{
				$(el).find("span[elName=selectEl]").show();
			}
		}
	}

	this.selectDeselectAll = function(formLinkName, fieldName, formAccessType, selectBool)
	{
		var el = ZCForm.getField(formLinkName, fieldName, formAccessType);
	    var elType = el.attr("type");
        if(elType == "multiselect" || elType == "select-multiple")
        {
           if(selectBool)
           {
        	   $(el).find("option:not(selected)").prop("selected",true);  // No I18N
           }
           else
           {
        	   $(el).find("option:selected").prop("selected",false);
           }
        }
		else if(elType == "checkbox")
		{
		   $(el).prop("checked",selectBool);
		}
		else if(el.attr("disptype") == "popup")
		{
			ZCForm.setFieldValue(formLinkName, fieldName, formAccessType, "-Select-");
		}
		else if(elType == "searchLookupMulti")
		{
			if(selectBool)
	        {
				$(el).find("li").remove();
				var tableRows = $(el).parent("div:first").find("div[elName=srchDivEl]").find("table").find("tr");
				for(var i = 0 ; i < tableRows.length ; i++)
				{

					var trEl = tableRows[i];
					var valHtml = searchFactory.formatValueToShow(trEl, fieldName, elType,$(el).width());
					$(el).find("span[elName=selectEl]").hide();
					$(el).append(valHtml);
				}
	        }
	        else
	        {
	        	$(el).find("li").remove();
	        	$(el).find("span[elName=selectEl]").show();
	        }
		}
	}
	
	this.useNewGetFieldApi = false;
	this.getField = function(formLinkName, fieldName, formAccessType,subFormLabelName)
	{
		if(ZCForm.useNewGetFieldApi)
		{
			return ZCForm.getZCField(formLinkName, fieldName, formAccessType,subFormLabelName);
		}
		
		var fiedEl = $(ZCForm.getForm(formLinkName, formAccessType,subFormLabelName)).find(":input[name='"+fieldName+"'], span[name='"+fieldName+"'], div[name='"+fieldName+"'], table[name='"+fieldName+"'], div[elName=srchDiv][labelName='"+fieldName+"'],div[elName=subformComposite][compositeName='"+fieldName+"']");
		if($(fiedEl).attr("type") == "searchLookupSingle" || $(fiedEl).attr("type") == "searchLookupMulti")
		{
			fiedEl = $(fiedEl).eq(0);
		}
		return fiedEl;
	}
	
	
	this.getZCField = function(formLinkName, fieldName, formAccessType,subFormLabelName)
	{
		var form = ZCForm.getForm(formLinkName, formAccessType,subFormLabelName);
		 /*		var fiedEl = $(form).find(":input[name='"+fieldName+"'], span[name='"+fieldName+"'], div[name='"+fieldName+"'], table[name='"+fieldName+"'], div[elName=srchDiv][labelName='"+fieldName+"'],div[elName=subformComposite][compositeName='"+fieldName+"']");*/
		
		var fiedEl = new Array();
		var t = form[0].elements[fieldName];
		if(t !== undefined)
		{
		   if(t instanceof NodeList)
		   {
			   fiedEl = Array.prototype.slice.call(t);   
		   }
		   else
		   {
			   fiedEl.push(t);
		   }	   
		   
		   t = $(form).find('div[elName=srchDiv][labelName='+fieldName+']')[0];
		   if(t !== undefined)
		   {
			   fiedEl = new Array();
			   fiedEl.push(t);
		   }   
		   return $(fiedEl);
		}

		t = t === undefined ? $(form).find('span[name='+fieldName+']')[0] : t;
		t = t === undefined ? $(form).find('div[name='+fieldName+']')[0] : t;
		t = t === undefined ? $(form).find('table[name='+fieldName+']')[0] : t;
		t = t === undefined ? $(form).find('div[elName=subformComposite][compositeName='+fieldName+']')[0] : t;
		if(t !== undefined)
		{
			fiedEl.push(t);
			return $(fiedEl);
		}
		return $(fiedEl);
	}

	this.getFileUploadField = function(formLinkName, fieldName, formAccessType)
	{
			return $(ZCForm.getForm(formLinkName, formAccessType)).find(":input[labelname='"+fieldName+"'],span[name='"+fieldName+"'],div[name='"+fieldName+"'], table[name='"+fieldName+"']");
	}

	this.getFormCont = function(formLinkName, formAccessType,subFormLabelName)
	{
		if(ZCUtil.isNull(formAccessType)) formAccessType = ZCConstants.FORM_ALONE;
		if(ZCUtil.isNull(subFormLabelName))
			return $("#"+formLinkName+"_"+formAccessType);
		else
			return $("#"+subFormLabelName+"_"+formLinkName+"_"+formAccessType);

	}

	this.getForm = function(formLinkName, formAccessType, subFormLabelName)
	{
		if(!this.zcFormAttributes['formParentDiv'])
		{
			return $("form[elName="+formLinkName+"]");
		}
		else
		{
			var formCont = ZCForm.getFormCont(formLinkName, formAccessType,subFormLabelName);
			if($(formCont).attr("formType") == "Form")
				return $(formCont).find("form[elName="+formLinkName+"]");
			else
				return formCont;
		}
	}

	this.selectCustomDDValue = function(formName, fieldName, fieldValue, recType, envalue)
	{
		var elem = document.getElementById(formName+":"+fieldName+"_"+recType+"_comp");
		var parEl = $(elem).parents("[elname=zc-fieldtd]:first");
		var selEl = $(parEl).find("[elname=zcDDPagination] tr[elvalue='"+ fieldValue +"']");
		if(selEl != null)
		{
			$(parEl).find("[elname=zcDropDownSelVal]:first").html(fieldValue);
		}
	}
	this.hideFormMenus = function(formCont)
	{
		if($(formCont)[0])
		{
			ZCUtil.hideMenu($(formCont)[0], $(formCont).find("div[elName=zc-formOptionsDIV]")[0]);
                        $(formCont).find("div[elName=zc-moreactionsel]").find("a:first").removeClass("zc-viewheader-menus-moreicon");//No I18N
		}
	}

	this.regCommonFormEvents = function(formLinkName, formAccessType,subFormLabelName)
	{
		var formCont = ZCForm.getFormCont(formLinkName, formAccessType,subFormLabelName);
		var frm = ZCForm.getForm(formLinkName, formAccessType,subFormLabelName);
		var moreAct = $(formCont).find("div[elName=zc-moreactionsel]");
		$(moreAct).click(function(event)
		{
                        $(moreAct).find("a:first").addClass("zc-viewheader-menus-moreicon");
						var showEl = $(formCont).find("div[elName=zc-formOptionsDIV]")[0];
			ZCUtil.showDropDownMenu(this, showEl);
			$(showEl).css("top",$(showEl).position().top -1);
			ZCApp.hideAndStopPropogation(event);
			//event.stopPropagation();
		});

		var exFile_fileupload={};
        $(formCont).find("a[elName=zc-toggleupload]").click(function()
        {
        	var enable = $(this).attr("enable");
        	var fileupname = $(this).attr("fileupname");
        	
			ZCUtil.getParent(this)[0].style.display = "none";
			var fieldtd = ZCUtil.getParent(this, "td");
			if(exFile_fileupload[fileupname] == undefined || exFile_fileupload[fileupname] == "")
			{
				exFile_fileupload[fileupname] = $(fieldtd).find("input[subtype=file]").prop("value");
				$(fieldtd).find("input[subtype=file]").attr("value","");
			}
			else
			{
				$(fieldtd).find("input[subtype=file]").attr("value",exFile_fileupload[fileupname]);
				exFile_fileupload[fileupname] = "";
			}
			var fileEl = $(fieldtd).find(":input[name=uploadFile]");
			$(fileEl).attr("changed", (enable == "enable")?"changed":null);
			$(fieldtd).find("span[elName=zc-"+enable+"upload],div[elName=zc-"+enable+"upload]")[0].style.display = "";
		});
		
		//Signature field handling
        $(formCont).find("div[eleName=signature-field], div[eleName=signature-field-subform]").each(function() {
        	var signatureFieldObj = this;
        	var recordsequence = $(signatureFieldObj).attr("recordsequence");
        	recordsequence = recordsequence !== undefined ? recordsequence : "1"; //Subform handling //No I18N
        	
        	if(recordsequence !== "0")
        	{
        		var signature = $(signatureFieldObj).find("div[eleName=signature]");
    			
    			$(signatureFieldObj).find("span[eleName=signatureClear]").click(function() {
    				$(signature).jSignature("reset");
    			});

    			$(signature).jSignature({'decor-color': 'transparent', 'height':'100', 'width':'300'});
    			$(signature).addClass("signature-div");  //No I18N
    			
    			var signatureEle = $(this).find("div[divName=signatureEle]");
    			if($(signatureEle).attr("isHide") === "true")
    			{
    				$(signatureEle).hide();
    			}
    			
    			$(signatureFieldObj).find("a[eleName=zc-togglesignature]").click(function() {
    				
    	        	$(signatureFieldObj).find("div[elName=editEle-signature]").hide();
    	        	
    	        	var signatureEle = $(signatureFieldObj).find("div[divName=signatureEle]");
    	        	$(signatureEle).show();
    	        	$(signatureEle).find("div[eleName=signature]").attr("update","true");
    			});
    			
    			$(signatureFieldObj).find("a[elName=zc-togglesignature-restore]").click(function() {

    				$(signatureFieldObj).find("div[elName=editEle-signature]").show();
    	        	
    	        	var signatureEle = $(signatureFieldObj).find("div[divName=signatureEle]");
    	        	$(signatureEle).hide();
    	        	$(signatureEle).find("div[eleName=signature]").attr("update","false");
    	        });
        	}
			
		});
        
        var exFile_image={};
        $(formCont).find("a[elName=zc-toggleimage]").click(function()
        {
        			var enable = $(this).attr("enable");
        			var imgname = $(this).attr("imgname");

        			ZCUtil.getParent(this)[0].style.display = "none";
        			var fieldtd = ZCUtil.getParent(this, "table"); // No I18N

        			var imgfile = "";
        			if(exFile_image[imgname] == undefined || exFile_image[imgname] == "")
        			{
        				exFile_image[imgname] = $(fieldtd).find("input[subtype=image]").prop("value");
        				$(fieldtd).find("input[subtype=image]").attr("value","");
        			}
        			else
        			{
        				$(fieldtd).find("input[subtype=image]").attr("value",exFile_image[imgname]);
        				imgfile = exFile_image[imgname];
        				exFile_image[imgname] = "";
        			}
        			var zcimagetype = ($(fieldtd).find("input[subname=zcimagetype]").attr("value") == undefined) ? "input[subname=zcimagetype-"+imgname+"]" : "input[subname=zcimagetype]";
        			if(enable == "enable")
        			{
        				$(fieldtd).find("tr[imagelocal=browselocal]").show()
        				$(fieldtd).find("input[subtype=image]").attr("imagevalue","");
        				$(fieldtd).find(zcimagetype).attr("value","2");
        			}
        			else
        			{
        				$(fieldtd).find("tr[imagelocal=browselocal]").hide()
        				$(fieldtd).find("input[subtype=image]").attr("imagevalue",imgfile);
        				$(fieldtd).find(zcimagetype).attr("value","1");
        			}

        			if($(fieldtd).find("input[name=displayLinkImage]")[0] && enable == "enable")
        			{
        				$(fieldtd).find("input[subname=zcimagetype]").attr("value","2");
        			}

        			if($(fieldtd).find("input[name=displayLinkImage]")[0] && enable == "disable")
        			{
        				$(fieldtd).find("input[subname=zcimagetype]").attr("value","1");
        			}
        			var fileEl = $(fieldtd).find(":input[name=uploadFile]");
        			$(fileEl).attr("changed", (enable == "enable")?"changed":null); // No I18N
        			$(fieldtd).find("span[elName=zc-"+enable+"upload],div[elName=zc-"+enable+"upload]")[0].style.display = "";
        });
		$(formCont).find("tr[elName=zc-showFormDialog],a[elName=zc-showFormDialog]").click(function()
		{
			var dialogKey = $(this).attr("dialogHTMLKey");

			if(ZCApp.htmlArr[formLinkName+"-"+dialogKey] == null)
			{
				var dialogDiv = $(formCont).find("div[elName='"+$(this).attr("dialogElName")+"']");
				ZCApp.htmlArr[formLinkName+"-"+dialogKey] = $(dialogDiv).html();
				$(dialogDiv).remove();
			}
			var props = "";
			if(dialogKey == 'embedDialogHtml') {
				props = ",position=absolute,left=300";
			}
			ZCUtil.showInDialog(ZCApp.htmlArr[formLinkName+"-"+dialogKey], "closeButton=no, modal=yes" + props);

			if($(this).attr("dialogElName")=="zc-embed-dialog" || $(this).attr("dialogElName")=="zc-perma-dialog")
			{
				ZCForm.custParams = "";
				var embediv = $("div[elName=zc-embed-dialog-div]");
				ZCApp.toggleLoginPrompt(formCont, embediv, formLinkName);
				ZCApp.setEmbedLink(formCont, embediv);

				var embedUrl = $(embediv).attr("embedurl");
				var beforeht = embedUrl.substring(0, embedUrl.indexOf("height='")+8);
				var afterht = embedUrl.substr(embedUrl.indexOf("px")+2);
				embedUrl = beforeht + ($(formCont).find("table").attr("clientHeight")+200) + "px" + afterht;
				$(embediv).attr("embedurl", embedUrl)
				//$(embediv).find('textarea[elName="zc-embed-ta"]').val(embedUrl+"'></iframe>");
				if($(this).attr("selectEl")=="zc-perma") {
					ZCForm.toggleEmbedTag($(embediv).find('td[comElName="zc-embed-crit-td"]')[1], 'zc-javascript-code');
				}
			}
		});
		if(!this.zcFormAttributes['customCalendar'])
		{
			$(frm).find(":input[fieldType="+ZCConstants.DATE+"], :input[fieldType="+ZCConstants.DATE_TIME+"]").each(function()
			{
				var elID = $(this).attr("id");
				var buttonID = "dateButtonEl_"+elID.substr(elID.indexOf("_")+1);
				var shTime = ($(this).attr("fieldType") == ZCConstants.DATE_TIME)?true:false;
				var format = shTime?ZCApp.dateFormat + " " + ZCConstants.TIME_FORMAT:ZCApp.dateFormat;
                var weekWork = $(this).attr("workweek");
				//ZCForm.setUpCalendar(elID, elID, format, shTime);
				ZCForm.setUpCalendar(elID, buttonID, format, shTime, weekWork);
			});
		}
	}

	this.setEmbedLinks = function(embediv, formLinkName, embedParams)
	{
		embedParams = ZCUtil.isNull(embedParams)?"":embedParams;
		var embedurl = $(embediv).attr("embedurl");
		var privUrl = $(embediv).attr("privateLink");
		if(ZCUtil.isNull(privUrl))
		{
			privUrl = "";
			$(embediv).find("div[elName='zc-embedInfoDivDisable']").hide();
			$(embediv).find("div[elName='zc-embedInfoDivEnable']").show();
		}
		else
		{
			privUrl = privUrl + "/";
			$(embediv).find("div[elName='zc-embedInfoDivEnable']").hide();
			$(embediv).find("div[elName='zc-embedInfoDivDisable']").show();
		}
		$(embediv).find('textarea[elName="zc-embedSnippet"]').val(embedurl+privUrl+embedParams+"'></iframe>");
	}

	this.showSubForm = function(el)
	{
		var url = "/showSubForm.do";			//No I18N
		var formElem =  $(el).parents('td[elname = subformtd]:first').find('div[elname = subformdiv]');
		var zc_LblWidth =  $(el).attr("lblwidth");
		if(zc_LblWidth != null) zc_LblWidth = zc_LblWidth.replace("%","_");
		var parentFormName = $(formElem).attr("parentFormName");
		var formLinkName = $(formElem).attr("subFormLinkName");
		var subFormAppLinkName = $(formElem).attr("subFormAppLinkName");
		var dispType = $(formElem).attr("dispType");
		var labelName = $(formElem).attr("name");
		var formAccessType = $(formElem).attr("formAccessType");
		var formCompID = $(formElem).attr("formcompid");
		var params = "sharedBy=" + ZCApp.sharedByDisp + "&appLinkName=" + subFormAppLinkName + "&formLinkName=" + formLinkName+ "&isSubform=" + true+ "&compType=" + ZCConstants.FORM+ "&formAccessType=" + formAccessType+"&labelName=" + labelName ; //No I18
		var argsMap = ZCUtil.getParamsAsMap("appLinkName="+subFormAppLinkName+"&formLinkName="+formLinkName+"&dispType="+dispType+ "&parentFormName=" + parentFormName+ "&labelName=" + labelName + "&formCompID=" + formCompID);		//No I18N
		ZCUtil.sendRequest(url,params,null,"ZCForm.loadSubForm",argsMap);					//No I18N
	}

	this.cancelSubForm = function(el)
	{
		var url = "/showSubForm.do";			//No I18N
		var formCont =  $(el).parents('div[elname = subFormContainer]:first');
		var formLinkName = $(formCont).attr("name");
		var labelName = $(formCont).attr("labelName");
		var formElem = $('div[name = '+labelName+']');
		$(formCont).remove();
		$(formElem).attr("edit","");
		var subFormLink = $(formElem).parents('td[elname = subformtd]:first').find('a[elname=subFormLink]');
		var eventOnClick = "ZCForm.showSubForm(this);";		//No I18N
		$(subFormLink).attr("onClick",eventOnClick);
		if($(formElem).attr("dispType") == ZCConstants.SUB_FORM_POPUP || $(formCont).attr("isEditRecord") == "true")
			closeDialog();
		var valTab = $(formElem).find('table[elname = subform_values]');
		if(parseInt($(valTab).attr("recCount")) == 0)
			$(formElem).find('div[elname=no_records_div]').css("display","block");
		else
			$(formElem).find('div[elname=no_records_div]').css("display","none");
	}
	this.loadSubForm = function(responseText, paramsMap, argsMap)
	{
		var dispType = ZCUtil.getFromMap(argsMap, "dispType");		//No I18N
		var isSubformRecEdit = ZCUtil.getFromMap(argsMap, "isSubformRecEdit");		//No I18N
		if(dispType == ZCConstants.SUB_FORM_POPUP || isSubformRecEdit == "true")
		{
			ZCForm.loadSubFormInDialog(responseText, paramsMap, argsMap);
			return;
		}
		var formLinkName = ZCUtil.getFromMap(argsMap, "formLinkName");				//No I18N
		var parentFormName = ZCUtil.getFromMap(argsMap, "parentFormName");		//No I18N
		var parentFormParamsMap = ZCForm.formArr[parentFormName];
		var parentFormAccessType = ZCUtil.getFromMap(parentFormParamsMap, "formAccessType");		//No I18N
		var formAccessType = ZCUtil.getFromMap(paramsMap, "formAccessType");		//No I18N
		var labelName = ZCUtil.getFromMap(argsMap, "labelName");//No I18N
		var compDIV = ZCForm.getField(parentFormName, labelName, parentFormAccessType);
 		$(compDIV).find('div[elname=staticSubFormHolder]').html(responseText);
 		 ZCUtil.evalJS($(compDIV).find("script").html());
		 var link = $(compDIV).parents('td[elname = subformtd]:first').find('a[elname=subFormLink]');
		 $(link).attr('onClick','');
		 $(compDIV).find('div[elname=no_records_div]').css("display","none");
	}

	this.loadSubFormInDialog = function(responseText, paramsMap, argsMap)
	{
		ZCUtil.setInMap(argsMap, "include", "true");		//No I18N
		ZCApp.loadZCCompInDialog(responseText, paramsMap, argsMap);
		var formLinkName = ZCUtil.getFromMap(argsMap, "formLinkName");		//No I18N
		var formAccessType = ZCUtil.getFromMap(paramsMap, "formAccessType");		//No I18N
		var formCont = ZCForm.getForm(formLinkName,formAccessType);
		var formElem = $('div[subFormLinkName = '+formLinkName+']');
	}
	this.triggerSubFormSubmit = function(el)
	{
		var formCont = $(el).parents('div[elname = subFormContainer]:first');
		var fileElArr = $(formCont).find(":input[type=file]");
		if(fileElArr.length > 0 )
		{
			ZCForm.uploadFilesAndSubmit(formCont,fileElArr,el,true);
			return false;
		}
		else
		{
			ZCForm.submitSubForm(el);
		}
	}
	this.submitSubForm = function(el)
	{
		var formCont = $(el).parents('div[elname = subFormContainer]:first');
		var formLinkName = $(formCont).attr("name");
		var labelName = $(formCont).attr("labelName");
		var formElem = $('div[name = '+labelName+']');
		var subFormAppLinkName = $(formElem).attr("subFormAppLinkName");
		var parentFormName = $(formElem).attr("parentFormName");
		var isNewTypeSubform =$(formElem).attr("isNewTypeSubform");
		var subFormType = $(formElem).attr("disptype");
		if(subFormType == ZCConstants.SUB_FORM_POPUP)
		{
			ZCForm.isSubFormFileSubmit = false;
		}
		var formParamsMap = ZCForm.formArr[formLinkName];
		var formAccessType = ZCUtil.getFromMap(formParamsMap,"formAccessType");	//No I18N
		ZCForm.updateRichTextContent();
		var params = "appLinkName="+subFormAppLinkName+"&formLinkName=" +formLinkName+"&formAccessType="+formAccessType+"&";		//No I18N
		if(ZCUtil.isNull(ZCUtil.getFromMap(formParamsMap,"onuserinput")))
		{
			ZCUtil.removeFromMap(formParamsMap, "showfield"); //No I18N
			ZCUtil.removeFromMap(formParamsMap, "autosubmit"); //No I18N
			params+= ZCUtil.getFieldsAsParams(formCont, ":input[type!=reset][type!=submit][type!=button][type!=file]");	//No I18N
			ZCUtil.sendRequest("/validateSubForm.do", params, "json", "ZCForm.handleSubFormResponse", ZCUtil.getParamsAsMap("formLinkName="+formLinkName+"&formAccessType="+formAccessType+"&parentFormName="+parentFormName+"&labelName="+labelName), i18n.pleasewait); //No I18N
			return false;
		}
		else
		{
			ZCUtil.removeFromMap(formParamsMap, "showfield"); //No I18N
			ZCUtil.setInMap(formParamsMap, "autosubmit", "true"); //No I18N
			ZCForm.clearErrors(formCont);
			return false;
		}
	}

	this.handleSubFormResponse = function(responseText, paramsMap, argsMap)
	{
		var labelName = ZCUtil.getFromMap(argsMap, "labelName"); //No I18N
		var parentFormName = ZCUtil.getFromMap(argsMap, "parentFormName");		//No I18N
		var formLinkName = ZCUtil.getFromMap(paramsMap, "formLinkName");	//No I18N
		var formParamsMap = ZCForm.formArr[formLinkName];
		var formAccessType = ZCUtil.getFromMap(argsMap, "formAccessType");
		var subFormLabelName = ZCUtil.getFromMap(argsMap, "labelName");
		var formCont = ZCForm.getForm(formLinkName,formAccessType,subFormLabelName);
		var formID  = ZCUtil.getFromMap(formParamsMap,"formID");				//No I18N
		var responseArr = ZCForm.getMsgFromResponse(responseText, formID);
		var fieldsArr = ZCForm.getFieldsArrFromResponse(responseText, formID);
		var succMsg = responseArr["succMsg"];
		var errMsg = responseArr["errMsg"];
		var fieldErrObj = responseArr["fieldErrObj"];
		var infoMsg = (ZCApp.sharedBy == ZCApp.loginUser || ZCApp.loginUser == ZCApp.appOwner)?responseArr["infoMsg"]:"";			//No I18N
		var errorMsg = responseArr["errorMsg"];

		ZCForm.defreezeButton(formCont);
		ZCForm.clearErrors(formCont);

		var alertMsg = responseArr["alertMsg"];
		if(!ZCUtil.isNull(succMsg))
		{
			 if(relodCurrentForm == "true")
			{
				ZCForm.CreateSFTable(formLinkName,fieldsArr,parentFormName,labelName,formAccessType);
				var btn  = $(formCont).find('input[name = reset]');
				if(formAccessType == ZCConstants.VIEW_EDIT_FORM)
					btn  = $(formCont).find('input[name = cancel]');
				var formElem = $("#"+subFormLabelName+"_"+formLinkName);
				var dispType = $(formElem).attr("dispType");
				if(dispType == ZCConstants.SUB_FORM_POPUP || $(formCont).attr("isEditRecord") == "true")
				{
					$('div[elname = no_records_div]').css("display","none");
					closeDialog();
				}
				else
				{
					//ZCForm.resetSubForm(btn);
					ZCForm.cancelSubForm(btn);
				}
			}
				relodCurrentForm = "true";
		}
		else
		{
			ZCApp.showFadingMsg(i18n.invalidmsg, 0, 5000);
			ZCForm.resetCaptcha(formElem);
			ZCForm.showErrors(formLinkName, formAccessType, null, null, fieldErrObj,subFormLabelName);
			if(!ZCUtil.isNull(infoMsg)|| !ZCUtil.isNull(errorMsg)) ZCForm.showInfo(infoMsg, succMsg, formLinkName, formAccessType, errorMsg);
		}

	}
	this.CreateSFTable = function(formLinkName,fieldsArr,parentFormName,subFormLabelName,formAccessType)
	{
			var parentFormParamsMap = ZCForm.formArr[parentFormName];
			var parentFormAccessType = ZCUtil.getFromMap(parentFormParamsMap,"formAccessType");		//No I18N
			var subFormCont = ZCForm.getForm(formLinkName,formAccessType);
			var compDIV = $('div[id = '+subFormLabelName+"_"+formLinkName+']');
			var valTab = $(compDIV).find('table[elname=subform_values]');
			var i = 0;
			var valRow = $(valTab).find('tr')[1];

			var recCount =parseInt($(valTab).attr('recCount'));
			var nextRecordSequence = parseInt($(compDIV).attr('nextRecordSequence'))+1;
			var tempValRow = $(valRow).clone();
			$(valRow).append(ZCForm.createHiddenInputElement(subFormLabelName,nextRecordSequence,"record::status","added",true));
			$(valTab).attr('recCount',recCount+1);
			$(compDIV).attr('nextRecordSequence',nextRecordSequence);
			if($(valRow).css("display") == "none")
				$(valRow).css("display","");
			for(i=1;i<fieldsArr.length;i++)
			{
				if(fieldsArr[i] == null)
				 continue;
				var url = "";
				var link = "";
				var title ="";
				var imgSrc = "";
				var imgTitle ="";
				var imgLink = "";
				var imgAltText = "";
				var valueToShow = "";
				var chkVal = false;
				var fieldsArrMap = ZCUtil.getParamsAsMap(fieldsArr[i]);
				var value = ZCUtil.getFromMap(fieldsArrMap,"value");		//No I18N
				var labelName = ZCUtil.getFromMap(fieldsArrMap,"labelName");		//No I18N
				var dispName = ZCUtil.getFromMap(fieldsArrMap,"fieldName");		//No I18N
				var type = ZCUtil.getFromMap(fieldsArrMap,"paramType");
				var fcType = ZCUtil.getFromMap(fieldsArrMap,"fcType");//No I18N
				if(fcType != ZCConstants.PLAIN_TEXT && fcType != ZCConstants.SCRIPT)
				{
					if($(valTab).attr('labelAdded') != "true")
					{
						var labRow = $(valTab).find('tr:first');
						var labCol = $(labRow).find('td:last');
						var tempLabCol = $(labCol).clone();
						$(labCol).attr("elname","labelCol");
						$(labCol).css("display","");
						$(labCol).attr("type",type);
						$(labCol).attr("label",labelName);
						$(labCol).attr("fcType",fcType);
						$(labCol).text(dispName);
						$(labRow).append(tempLabCol);
					}
					var valCol = $(valRow).find('td:last');
					var tempValCol = $(valCol).clone();
					if(fcType == ZCConstants.URL)
					{
							url = ZCUtil.getFromMap(fieldsArrMap,"zcurl-"+labelName);
							link = ZCUtil.getFromMap(fieldsArrMap,"zclnkname-"+labelName);
							title = ZCUtil.getFromMap(fieldsArrMap,"zctitle-"+labelName);
							if(!ZCUtil.isNull(url))
							{
								value = "URL : "+url;
								$(valCol).attr("urlvalue",url);
							}
							if(!ZCUtil.isNull(link))
							{
								value = value+"<br>Link : "+link;
								$(valCol).attr("linkvalue",link);
							}
							if(!ZCUtil.isNull(title))
							{
								value = value+"<br>Title : "+title;
								$(valCol).attr("titlevalue",title);
							}
					}
					if(fcType == ZCConstants.IMAGE)
					{
							imgSrc = ZCUtil.getFromMap(fieldsArrMap,"zcsource-"+labelName);
							imgLink = ZCUtil.getFromMap(fieldsArrMap,"zcfieldlink-"+labelName);
							imgTitle = ZCUtil.getFromMap(fieldsArrMap,"zctitle-"+labelName);
							imgAltText = ZCUtil.getFromMap(fieldsArrMap,"zcalttext-"+labelName);
							if(!ZCUtil.isNull(imgSrc))
							{
								value = "Source : "+imgSrc;
								$(valCol).attr("imgSrc",imgSrc);
							}
							if(!ZCUtil.isNull(imgAltText))
							{
								value = value+"<br>Alt Text : "+imgAltText;
								$(valCol).attr("imgAltText",imgAltText);
							}
							if(!ZCUtil.isNull(imgLink))
							{
								value = value+"<br>Link : "+imgLink;
								$(valCol).attr("imgLink",imgLink);
							}
							if(!ZCUtil.isNull(imgTitle))
							{
								value = value+"<br>Title : "+imgTitle;
								$(valCol).attr("imgTitle",imgTitle);
							}
					}
					else if(fcType == ZCConstants.FILE_UPLOAD)
					{
						if(value!="")
						{
							valueToShow = value.substring(value.indexOf('_')+1);
						}
					}
					else if(fcType == ZCConstants.CHECK_BOX)
					{
						if(value!="")
						{
							chkVal = true;
							valueToShow = "true";
						}
						else
						{
							chkVal = false;
							valueToShow = "false";
						}
					}
					$(valCol).attr("elname","valueCol");
					$(valCol).attr("label",labelName);
					$(valCol).attr("type",type);
					$(valCol).attr("fcType",fcType);
					$(valCol).css("display","");
					if((value == "" || value == null || value == "-Select-")&&(fcType != ZCConstants.CHECK_BOX) )
					{
						$(valCol).html("&nbsp;");
					}
					else
					{
						if(fcType == ZCConstants.FILE_UPLOAD || fcType == ZCConstants.CHECK_BOX)
							$(valCol).html(valueToShow);
						else
							$(valCol).html(value);
					}

					if(fcType == ZCConstants.URL)
					{
						if(!ZCUtil.isNull(url))
						{
							$(valCol).append(ZCForm.createHiddenInputElement(subFormLabelName,nextRecordSequence,"zcurl-"+labelName,url,true));
						}

						if(!ZCUtil.isNull(link))
						{
							$(valCol).append(ZCForm.createHiddenInputElement(subFormLabelName,nextRecordSequence,"zclnkname-"+labelName,link,true));
						}

						if(!ZCUtil.isNull(title))
						{
							$(valCol).append(ZCForm.createHiddenInputElement(subFormLabelName,nextRecordSequence,"zctitle-"+labelName,title,true));
						}

					}
					else if(fcType == ZCConstants.IMAGE)
					{
						if(!ZCUtil.isNull(imgSrc))
						{
							$(valCol).append(ZCForm.createHiddenInputElement(subFormLabelName,nextRecordSequence,"zcsource-"+labelName,imgSrc,true));
						}

						if(!ZCUtil.isNull(imgLink))
						{
							$(valCol).append(ZCForm.createHiddenInputElement(subFormLabelName,nextRecordSequence,"zcfieldlink-"+labelName,imgLink,true));
						}

						if(!ZCUtil.isNull(imgAltText))
						{
							$(valCol).append(ZCForm.createHiddenInputElement(subFormLabelName,nextRecordSequence,"zcalttext-"+labelName,imgAltText,true));
						}

						if(!ZCUtil.isNull(imgTitle))
						{
							$(valCol).append(ZCForm.createHiddenInputElement(subFormLabelName,nextRecordSequence,"zctitle-"+labelName,imgTitle,true));
						}

					}
					else if(fcType == ZCConstants.MULTI_SELECT)
					{
						var options = value.split(",");
						for(var opt=0;opt<options.length;opt++)
						{
							$(valCol).append(ZCForm.createHiddenInputElement(subFormLabelName,nextRecordSequence,labelName,options[opt],false));
						}
					}
					else
					{
						$(valCol).append(ZCForm.createHiddenInputElement(subFormLabelName,nextRecordSequence,labelName,value,true));
					}
					$(valCol).attr("value",value);
					$(valRow).append(tempValCol);
				}
			}
			if($(valTab).attr('labelAdded') != "true")
				$(valTab).attr("labelAdded","true");

			$(valRow).attr("status","added");
			$(valRow).attr("isTemp","false");
			$(tempValRow).css("display","none");
			if($(compDIV).attr("edit") == "true")
			{
				var rowInd = $(compDIV).attr("rowInd");$(compDIV).attr("edit","");
				var editRow = $(valTab).find('tr')[rowInd];
				var status = $(editRow).attr("status");
				$(editRow).html($(valRow).html());
				$(editRow).attr("status",status);
				$(valRow).remove();$(valTab).attr('recCount',recCount);
			}
			$(valTab).find('tr:first').after(tempValRow);
			if($(valTab).css("display") == "none");
				$(valTab).css("display","");
			ZCForm.applyClass(valTab);
	}

	this.createHiddenInputElement = function(subFormLabelName,nextRecordSequence,labelName,value,isSingleValued)
	{
		var paramType = "";
		if(isSingleValued)
		{
			paramType = "SV";
		}
		else
		{
			paramType = "MV";
		}
		var inputelem = document.createElement('input');
		$(inputelem).attr('type','hidden');
		$(inputelem).attr('value',value)
		var inputelName = "SF("+subFormLabelName+").FD(t::row_"+nextRecordSequence+")."+paramType+"("+labelName+")";
		return $(inputelem).attr('name',inputelName);
	}

	this.applyClass = function(valTab)
	{
		$.each($(valTab).find('tr[status!=deleted]'),function(i,e){
			if(i != 0 && (i%2)==0)	$(e).attr("class","zc-subform-viewrow zc-row-1");
			else if(i != 0 && (i%2)!=0) $(e).attr("class","zc-subform-viewrow zc-row-2");
			});
	}

	this.EditSubFormRecord = function(col,formLinkName,parentFormName,labelName, subFormAppLinkName)
	{
		var url = "/showSubForm.do";			//No I18N
		var parentFormParamsMap = ZCForm.formArr[parentFormName];
		var parentFormAccessType = ZCUtil.getFromMap(parentFormParamsMap, "formAccessType");
		//No I18N
		var formElem =  ZCForm.getField(parentFormName, labelName, parentFormAccessType);
		var formCompID = $(formElem).attr("formcompid");
		var formParamsMap = ZCForm.formArr[formLinkName];
		var formAccessType = $(formElem).attr("formAccessType");		//No I18N
		var formContainer = ZCForm.getForm(formLinkName,formAccessType);
		$(formContainer).remove();
		var subFormLink = $(formElem).parents('td[elname = subformtd]:first').find('a[elname=subFormLink]');
		var eventOnClick = "ZCForm.showSubForm(this);";		//No I18N
		$(subFormLink).attr("onClick",eventOnClick);
		var rowIndex = $(col).parents('table:first').find('tr').index($(col).parents('tr:first'));
		$(formElem).attr("edit","true");
		$(formElem).attr("rowInd",rowIndex);
		//ZCForm.DeleteSubFormRecord(col);
		var params = "sharedBy=" + ZCApp.sharedByDisp + "&appLinkName=" + subFormAppLinkName + "&formLinkName=" + formLinkName + "&parentFormName=" + parentFormName+ "&labelName=" + labelName + "&compType=" + ZCConstants.FORM+ "&formCompID=" + formCompID+ "&formAccessType=" + ZCConstants.VIEW_EDIT_FORM +"&edit=true&rowIndex="+rowIndex+"&isSubform="+true+"&isSubformRecEdit="+true;		//No I18N
		$(col).parents('tr:first').find('td[elname=valueCol]').each(function(){
			var label = $(this).attr("label");
			var val = $(this).attr("value");

			if($(this).attr("fctype") == ZCConstants.CHECK_BOX)
			{
				if(val != "") val = "true";
				else val = "false";
			}
			if($(this).attr("fctype") == ZCConstants.MULTI_SELECT)
			{
				var valArr = val.split(",");
				for(var i=0; i<valArr.length;i++)
				{
					params+="&"+label +"=" + valArr[i];
				}
			}
			else if($(this).attr("fctype") == ZCConstants.URL)
			{
				if(!ZCUtil.isNull($(this).attr("urlvalue")))
				{
					params+="&zcurl-"+label +"=" + $(this).attr("urlvalue");
				}
				if(!ZCUtil.isNull($(this).attr("linkvalue")))
				{
					params+="&zclnkname-"+label +"=" + $(this).attr("linkvalue");
				}
				if(!ZCUtil.isNull($(this).attr("titlevalue")))
				{
					params+="&zctitle-"+label +"=" + $(this).attr("titlevalue");
				}
			}
			else if($(this).attr("fctype") == ZCConstants.IMAGE)
			{
				if(!ZCUtil.isNull($(this).attr("imgSrc")))
				{
					params+="&zcsource-"+label +"=" + $(this).attr("imgSrc");
				}
				if(!ZCUtil.isNull($(this).attr("imgLink")))
				{
					params+="&zcfieldlink-"+label +"=" + $(this).attr("imgLink");
				}
				if(!ZCUtil.isNull($(this).attr("imgTitle")))
				{
					params+="&zctitle-"+label +"=" + $(this).attr("imgTitle");
				}
				if(!ZCUtil.isNull($(this).attr("imgAltText")))
				{
					params+="&zcalttext-"+label +"=" + $(this).attr("imgAltText");
				}
				params+="&zcimagetype-"+label +"=" + $(this).attr("zcimagetype"); //No I18N
			}
			else
			{
				params+="&"+label +"=" + val;
			}
			});
		var argsMap = ZCUtil.getParamsAsMap("appLinkName="+subFormAppLinkName+"&formLinkName="+formLinkName+"&dispType="+ZCConstants.SUB_FORM_POPUP+ "&parentFormName=" + parentFormName+ "&labelName=" + labelName + "&formCompID=" + formCompID+"&edit=true"+"&rowIndex="+rowIndex);		//No I18N
		ZCUtil.sendRequest(url,params,null,"ZCForm.loadSubForm",argsMap);					//No I18N
	}

	this.DeleteSubFormRecord = function(col)
	{
		var parentRow = $(col).parents('tr:first');
		var valTab = $(parentRow).parents('table[elname = subform_values]');
		$(valTab).attr("recCount",parseInt($(valTab).attr("recCount")) - 1)
		if(parseInt($(valTab).attr("recCount")) == 0)
		{
			$(valTab).css("display","none");
			if($(valTab).parents('div[elname=subformdiv]').find('div[elname=subFormContainer]').css("visibility") != "visible")
				$(valTab).parents('div[elname=subformdiv]').find('div[elname=no_records_div]').css("display","block");				//No I18N
		}
		var status = $(parentRow).attr("status");
		if(status == "added")
		{
			$(parentRow).remove();
		}
		else
		{
			$(parentRow).css("display","none");
			$(parentRow).attr("status","deleted");
			$(parentRow).find("input[elName=record_status]").attr("value","deleted");
		}

		ZCForm.applyClass(valTab);
	}
	this.resetSubForm = function(el)
	{
		var url = "/showSubForm.do";			//No I18N
		var formCont = $(el).parents('div[elname = subFormContainer]:first');
		var formLinkName = $(formCont).attr("name");
		var labelName = $(formCont).attr("labelName");
		var formElem = $('div[name = '+labelName+']');
		var parentFormName = $(formElem).attr("parentFormName");
		var subFormAppLinkName = $(formElem).attr("subFormAppLinkName");
		var labelName = $(formElem).attr("name");
		var formParamsMap = ZCForm.formArr[formLinkName];
		var formAccessType = ZCUtil.getFromMap(formParamsMap, "formAccessType"); //No I18N
		var subFormLabelName = ZCUtil.getFromMap(formParamsMap, "subFormLabelName");
		var formContainer = $("#"+subFormLabelName+"_"+formLinkName+"_"+formAccessType);
		$(formElem).find('div[elname=staticSubFormHolder]').css("visibility","hidden");
		$(formContainer).remove();
		var subFormLink = $(formElem).parents('td[elname = subformtd]:first').find('a[elname=subFormLink]');

		var zc_LblWidth =  $(subFormLink).attr("lblwidth");
		if(zc_LblWidth != null) zc_LblWidth = zc_LblWidth.replace("%","_");
		var dispType = $(formElem).attr("dispType");
		var params = "sharedBy=" + ZCApp.sharedByDisp + "&appLinkName=" + subFormAppLinkName + "&formLinkName=" + formLinkName+ "&isSubform=" + true+ "&compType=" + ZCConstants.FORM+ "&formAccessType=" + formAccessType+"&labelName="+subFormLabelName; 		//No I18
		var argsMap = ZCUtil.getParamsAsMap("appLinkName="+subFormAppLinkName+"&formLinkName="+formLinkName+"&dispType="+dispType+ "&parentFormName=" + parentFormName+ "&labelName=" + labelName);		//No I18N
		if(dispType == ZCConstants.SUB_FORM_POPUP || $(formCont).attr("isEditRecord") == "true")
		{
				closeDialog();
				if($(formCont).attr("isEditRecord") == "true")
				{
					params+="&isSubformRecEdit="+true;
					ZCUtil.setInMap(argsMap,"isSubformRecEdit","true");
				}
		}
		ZCUtil.sendRequest(url,params,null,"ZCForm.loadSubForm",argsMap);
	}

	this.setPermaLinks = function(permadiv, formLinkName)
	{
		var privUrl = $(permadiv).attr("privateLink");
		if(!ZCUtil.isNull(privUrl))
		{
			$("div[elName='zc-permaLinkDiv']").find("div[elName='zc-embedInfoDivEnable']").hide();
			$("div[elName='zc-permaLinkDiv']").find("div[elName='zc-embedInfoDivDisable']").show();
		}
		else
		{
			privUrl = "";
			$("div[elName='zc-permaLinkDiv']").find("div[elName='zc-embedInfoDivDisable']").hide();
			$("div[elName='zc-permaLinkDiv']").find("div[elName='zc-embedInfoDivEnable']").show();
		}
		$(permadiv).find("textarea[elName=zc-textareaPermaDialog]").val($(permadiv).attr("serverprefix") + "/" + ZCApp.sharedByDisp + "/" + ZCApp.appLinkName + "/form-perma/" + formLinkName + "/" + privUrl);//No I18N
	}

	this.regBulkEditFormEvents = function(formLinkName, formAccessType)
	{
		var formCont = ZCForm.getFormCont(formLinkName, formAccessType);
		var frm = ZCForm.getForm(formLinkName, formAccessType);
		var lblNameArr = [];
		var notSelArr = [];

		$(formCont).find(":input[fieldtype = "+ZCConstants.INLINE_SINGLE_SELECT+"]").change( function() //No I18N
		{
			showOthersOption(this);
		}
		);
		$.each($(formCont).find("select[elName=zc-formFieldSelectEl]").find("option[value!=-1]"),function(index, elem)
		{
			var isBidirectOtherSideSingle = $(elem).attr("isBidirectOtherSideSingle");
			if(isBidirectOtherSideSingle == "true")
			{
			//notSelArr[notSelArr.length] = $(elem).val();
			$(elem).remove();
			}
		});
		$(formCont).find("select[elName=zc-formFieldSelectEl]").change(function()
		{
			var fieldName = $(this).val();
			lblNameArr[lblNameArr.length] = fieldName;
			ZCForm.showHideField(true, formLinkName, fieldName, formAccessType);
			$(this)[0].options[0].innerHTML = i18n.selectcolumn;
			$(this)[0].options[$(this)[0].selectedIndex] = null;
		/*	if(isViewBeta) {
				ZCApp.correctDialog();
			}*/
		});
		$(formCont).find("a[elName=zc-hideFormFieldEl]").click(function()
		{
			var fieldName = $(this).attr("labelName");
			ZCUtil.removeFromArray(lblNameArr, fieldName);
			ZCForm.showHideField(false, formLinkName, fieldName, formAccessType);
			ZCForm.getFormCont(formLinkName, formAccessType).find("select[elName=zc-formFieldSelectEl]").append($("<option value="+$(this).attr("labelName")+">"+$(this).attr("displayName")+"</option>"));
		});
		$.each($(frm).find(":input[tagfor=formComp],div[tagfor=formComp],span[tagfor=formComp],div[elName=srchDiv]"), function(index, inputEl)
		{
			ZCUtil.getParent(inputEl, "tr").attr("style", "display:none");//No I18N
		});
		$(frm).find(":input[type=submit]").click(function(formElem)
		{
			ZCForm.updateRichTextContent();
			return ZCForm.bulkEditRecords(formLinkName, formAccessType, lblNameArr);
		});
		$(frm).find("span[elname=zc-show-parent]").click(function()
			{
				ZCForm.showLookupForm(this);
			});
		ZCForm.regCustomLookUpEvents(frm);
		ZCForm.showRichTextEditor(frm);
		/* Lookup Search Reg-Event Starts */
		var paramsMap = ZCForm.formArr[formLinkName];
		var formID = ZCUtil.getFromMap(paramsMap, "formID");
		searchFactory.regLookupSearchEvents(frm,formID,formAccessType);
		/* Lookup Search Reg-Event Ends */
	}

	this.adjustWidth = function(formLinkName)
	{
		var formCont = ZCForm.getFormCont(formLinkName, ZCConstants.FORM_ALONE);
		var fUrl = $(formCont).attr("formURL");
		var zcFormTable = formCont.find('table[elName=zc-formTable]');
		if(fUrl.indexOf('/showPermaForm.do') != -1 || fUrl.indexOf('/liveFormHeader.do') != -1 )
		{
			zcFormTable.css('width', '100%');
		}
	}

	this.isAddToParentLookup = false;
	this.childFormName = new Array();
	this.childAppName = new Array();
	this.childLabelName = new Array();
	this.lookupCount = 1;
	this.findArrayLocation = function(array, ele)
	{
		var size = array.length;
		for(var location=0; location<size; location++)
		{
			if(array[location] == ele)
			{
				return location;
			}
		}
		return '-1';
	}

	this.setLookupCount = function(formLinkName)
	{
		var location = ZCForm.findArrayLocation(ZCForm.childFormName, formLinkName);
		if(location != -1)
		{
			ZCForm.childFormName = ZCForm.childFormName.slice(0,location);
			ZCForm.childAppName = ZCForm.childAppName.slice(0,location);
			ZCForm.childLabelName = ZCForm.childLabelName.slice(0,location);

			ZCForm.lookupCount = location+1;
		}
	}

	this.showLookupForm = function(el)
	{
		var isFromSubForm = ($(el).attr("isFromSubForm") == 'true') ? true : false;
		var parentFormName = "";
		if(isFromSubForm)
		{
			parentFormName =  $(el).attr("parentFormName");
		}
		var formLinkName = $(el).attr("formLinkName");
		var viewLinkName = $(el).attr("viewLinkName");
		var appLinkName = $(el).attr("appLinkName");
		var labelName = $(el).attr("labelName");
		var formAccessType = $(el).attr("formAccessType");
		var rowNo = $(el).attr("rowNo");
		rowNo = ZCUtil.isNull(rowNo) ? -1 : rowNo;

		var isNewTypeSubform = $(el).attr("isNewTypeSubform");
		var childSubformField = $(el).attr("childSubformField");
		
		ZCForm.setLookupCount(formLinkName);

		ZCForm.childFormName[ZCForm.lookupCount-1] = formLinkName;
		ZCForm.childAppName[ZCForm.lookupCount-1] = appLinkName;
		ZCForm.childLabelName[ZCForm.lookupCount-1] = labelName;

		var childParams = "";
		var length = ZCForm.childAppName.length;
		for(var i=1; i <= length; i++)
		{
			childParams = childParams + "&zc_childformname_" + i + "=" + ZCForm.childFormName[i-1] + "&zc_childappname_" + i + "=" + ZCForm.childAppName[i-1] + "&zc_childlabelname_" + i + "=" + ZCForm.childLabelName[i-1];//No I18N
		}

		var refFormCompName = $(el).attr("refFormCompName");
		var refFormID = $(el).attr("formID");
		var formCompID = $(el).attr("formCompID");
		var dispType = $(el).attr("dispType");
		var privateLink = $(el).parents("[elName="+formLinkName+"]").find(":input[name=privatelink]").val();

		var url = "/getRefFormDetails.do";//No I18N
		var params = "sharedBy=" + ZCApp.sharedByDisp + "&appLinkName=" + appLinkName + "&refFormID="+refFormID + "&formLinkName=" + formLinkName + "&formAccessType=" + ZCConstants.FORM_LOOKUP_ADD_FORM + "&privateLink="+privateLink + "&zc_lookupCount=" + ZCForm.lookupCount + childParams;//No I18N
		if(viewLinkName !== '')
		{
			params = params + "&viewLinkName=" + viewLinkName;
		}
		if(isNewTypeSubform !== '')
		{
			params = params + "&isNewTypeSubform=" + isNewTypeSubform;
		}
		ZCForm.lookupCount++;
		ZCUtil.sendRequest(url,params,"json","ZCForm.loadLookupForm",ZCUtil.getParamsAsMap("refFormCompName="+refFormCompName+"&lookupFormCompID="+formCompID+"&formAccessType="+formAccessType+"&formLinkName="+formLinkName+"&labelName="+labelName+"&refFormID="+refFormID+"&privateLink="+privateLink+"&isFromSubForm="+isFromSubForm+"&rowNo="+rowNo+"&parentFormName="+parentFormName+"&isNewTypeSubform="+isNewTypeSubform+"&childSubformField="+childSubformField));//No I18N
	}

	this.loadLookupForm = function(respText, paramsMap, argsMap)
	{
		var isFromSubForm = ZCUtil.getFromMap(argsMap, "isFromSubForm");//No I18N
		var refFormCompName = ZCUtil.getFromMap(argsMap, "refFormCompName");//No I18N
		var subFormLinkName = "";
		var subFormAppName = "";
		var childFormLinkName = "";
		if(isFromSubForm == "false")
		{
			childFormLinkName = ZCUtil.getFromMap(argsMap, "formLinkName");//No I18N
		}
		else
		{
			subFormLinkName = ZCUtil.getFromMap(paramsMap, "formLinkName");//No I18N
			subFormAppName = ZCUtil.getFromMap(paramsMap, "appLinkName");//No I18N
			childFormLinkName = ZCUtil.getFromMap(argsMap, "parentFormName");//No I18N
		}
		var childFieldLabelName = ZCUtil.getFromMap(argsMap, "labelName");//No I18N
		var childFormAccessType = ZCUtil.getFromMap(argsMap, "formAccessType");//No I18N
		var childFormPrivateLink = ZCUtil.getFromMap(argsMap, "privateLink");//No I18N
		var formid = ZCUtil.getFromMap(argsMap, "refFormID");//No I18N
		var respArr = ZCUtil.parseJSONResponse(respText);
		var refFormLinkName = respArr["refFormLinkName"];
		var refAppLinkName = respArr["refAppLinkName"];
		var isFromSubForm = ZCUtil.getFromMap(argsMap, "isFromSubForm");
		var rowNo = ZCUtil.getFromMap(argsMap, "rowNo");
		var isNewTypeSubform = ZCUtil.getFromMap(argsMap, "isNewTypeSubform");//No I18N
		var childSubformField = ZCUtil.getFromMap(argsMap, "childSubformField");//No I18N

		var childParams = "";
		var length = ZCForm.childAppName.length;
		var lastChildAppName = ZCForm.childAppName[length-1];
		for(var i=1; i <= length; i++)
		{
			childParams = childParams + "&zc_childformname_" + i + "=" + ZCForm.childFormName[i-1] + "&zc_childappname_" + i + "=" + ZCForm.childAppName[i-1] + "&zc_childlabelname_" + i + "=" + ZCForm.childLabelName[i-1];//No I18N
		}

 	 	if(!ZCUtil.isNull(refFormLinkName) && !ZCUtil.isNull(refAppLinkName))
		{
			var params = "sharedBy=" + ZCApp.sharedByDisp + "&appLinkName=" + refAppLinkName + "&compType=" + ZCConstants.FORM + "&formLinkName=" + refFormLinkName + "&formAccessType=" + ZCConstants.FORM_LOOKUP_ADD_FORM + "&lookupFieldName=" + refFormCompName+"&childFormLinkName="+childFormLinkName+"&childFieldLabelName="+childFieldLabelName+"&childFormAccessType="+childFormAccessType+"&childAppLinkName="+lastChildAppName+"&childFormPrivateLink="+childFormPrivateLink+"&zc_lookupCount="+(ZCForm.lookupCount-1)+childParams+"&isFromSubForm="+isFromSubForm+"&rowNo="+rowNo+"&subFormLinkName="+subFormLinkName+"&subFormAppName="+subFormAppName+"&isNewTypeSubform="+isNewTypeSubform+"&childSubformField="+childSubformField;//No I18N
                        if(isViewBeta)
                        {
                            params = params + "&isNewAppearance=true";//No I18N
                        }
            var viewLinkName = ZCUtil.getFromMap(paramsMap, "viewLinkName");//No I18N    
            if(!ZCUtil.isNull(viewLinkName))
        	{
            	params = params + "&viewLinkName=" + viewLinkName;//No I18N
        	}
			ZCUtil.sendRequest(ZCApp.compProps["actionURL-"+ZCConstants.FORM], params, "html", "ZCApp.loadZCCompInDialog", ZCUtil.getParamsAsMap("include=false&formAccessType=" + ZCConstants.FORM_LOOKUP_ADD_FORM), i18n.pleasewait);//No I18N
		}
	}


	this.regFormEvents = function(formLinkName, formAccessType,subFormLabelName)
	{
		ZCForm.regCommonFormEvents(formLinkName, formAccessType,subFormLabelName);
		var formCont = ZCForm.getFormCont(formLinkName, formAccessType,subFormLabelName);
		var frm = ZCForm.getForm(formLinkName, formAccessType,subFormLabelName);
		if(formAccessType == ZCConstants.VIEW_BULK_EDIT_FORM)
		{
			ZCForm.regBulkEditFormEvents(formLinkName, formAccessType);
		}
		else
		{
			$(frm).find("span[elname=zc-show-parent]").click(function()
			{
				ZCForm.showLookupForm(this);
			});
			$(frm).find(":input[type=radio], :input[type=checkbox]").click(function()
			{
				var divElem = $(this).parents('div[elname=subformdiv]')[0];
				if(divElem)
				{
					ZCForm.invokeOnChange(this, frm, formAccessType, $(divElem).attr('formcompid'));
				}
				else
				{
					ZCForm.invokeOnChange(this, frm, formAccessType);
				}
			});
			$(frm).find(":input[type!=hidden][type!=reset][type!=submit][type!=button][type!=radio][type!=checkbox]").keyup(function(e){
				var el = this;
				if(!ZCUtil.isValueKeyPressed(e))
				{
					return false;
				}
				if(window.RuleEvents !== undefined && window.RuleEvents[$(frm).attr('name')] !== undefined && window.RuleEvents[$(frm).attr('name')][$(el).attr('name')] !== undefined)
				{
					window.RuleEvents[$(frm).attr('name')][$(el).attr('name')]();
				}	
			});
			
			$(frm).find(":input[type!=hidden][type!=reset][type!=submit][type!=button][type!=radio][type!=checkbox]").change(function()
			{
				if($(this).attr("type") == "file")
				{
					$(this).attr("changed", "changed");
				}
				var divElem = $(this).parents('div[elname=subformdiv]')[0];
				if(divElem)
				{
					ZCForm.invokeOnChange(this, frm, formAccessType, $(divElem).attr('formcompid'));
				}
				else
				{
					ZCForm.invokeOnChange(this, frm, formAccessType);
				}
			});

			$(frm).submit(function(formElem)
			{
				ZCForm.updateRichTextContent();
				if(ZCForm.doSubmit(frm))
				{
					ZCForm.freezeButton(frm);
					if($(frm).attr("formType") == ZCConstants.FORM_TYPE_OUTZC)
					{
						return ZCForm.handleButtonOnClick(frm, formAccessType, $(frm).find(":input[type=submit]"));
					}
					else
					{
						if(!ZCForm.isSubFormFileSubmit)
						{
							return ZCForm.triggerSubmit(frm);
						}
						ZCForm.isSubFormFileSubmit = false; //reseting the flag;
					}
				}
				else
				{
					return false;
				}
			});
			$(frm).find(":input[type=reset]").click(function(formElem)
			{
				ZCForm.resetForm(formLinkName, formAccessType);
			});
			$(frm).find(":input[comElName=zc-extformbutton][type!=submit][type!=reset]").click(function(formElem)
			{
				if(ZCForm.doSubmit(frm))
				{
					ZCForm.freezeButton(frm);
					return ZCForm.handleButtonOnClick(frm, formAccessType, this);
				}
			});
			$(frm).find(":input[elName=zc-cancelformbutton]").click(function(formElem)
			{
				var viewLinkName = $(frm).find(":input[name=viewLinkName]").val();
				closeDialog();
				/*
				 * Navigation URL Issue fix :: While canceling the form Edit popup the brower url should be set to prevURL
				 */
				if(ZCApp.currURL.indexOf('zc_LoadIn=dialog') !=-1){
					window.location.href = ZCApp.prevURL;
					ZCApp.loadPage = "false";	//No I18N
				}
				var viewParamsMap = ZCView.viewArr[viewLinkName];
				if(ZCUtil.getFromMap(viewParamsMap, "viewType") == ZCConstants.VIEW_CALENDAR && ZCView.currRecSumry)
				{
					ZCUtil.showInDialog(ZCView.currRecSumry, "closeButton=no, closeOnBodyClick=yes, modal=yes");
				}
			});
			/* Lookup Search Reg-Event Starts */
			var paramsMap = ZCForm.formArr[formLinkName];
			var formID = ZCUtil.getFromMap(paramsMap, "formID");	//No I18N
			searchFactory.regLookupSearchEvents(frm,formID,formAccessType);
			/* Lookup Search Reg-Event Ends */
			ZCForm.regCustomLookUpEvents(frm);
			ZCForm.showRichTextEditor(frm);
			$(frm).find("div[elName=subformdiv]").each(function(index,subformEl)
			{
				var defRows = $(subformEl).attr("defRows");
				var currentRows = $(subformEl).find("tr[elName=dataRow][reclinkid!='t::row']").length;
				for(var i=0;i<defRows - currentRows;i++)
				{
					ZCForm.createNewSubFormRow($(subformEl).find("a[elName=subFormLink]"), false);
				}
			});
		}
		if(this.isEmbeddedForm == "true" || this.isPermaForm == "true" || formAccessType == ZCConstants.VIEW_ADD_FORM || formAccessType == ZCConstants.VIEW_EDIT_FORM || formAccessType == ZCConstants.FORM_LOOKUP_ADD_FORM  || formAccessType == ZCConstants.FORM_ALONE) { //No I18N
			var formElem = ZCForm.getForm(formLinkName, formAccessType);
			formElem.find("td[elName=zc-formTableFix]").width("1px"); //No I18N
			this.handleScreenResize(formElem);
		}
	}

	this.applyDefaultStylesToComponents = function(formLinkName, styleJson, formAccessType)
	{
		var styleJson = JSON.parse(styleJson);
		for(fieldName in styleJson)
		{
			for(attr in styleJson[fieldName])
			{
				switch(attr)
				{
					case 'disabled':
						ZCForm.enDisableField(styleJson[fieldName][attr], formLinkName, fieldName, formAccessType);
						break;
					case 'display':
						ZCForm.showHideField(styleJson[fieldName][attr] === 'block', formLinkName, fieldName, formAccessType);
						break;
				}
			}
		}
	}
	
	this.showRichTextEditor = function(frm)
	{
		var randNum = Math.floor(Math.random() * 10000000);
		var richtext_div = $(frm).find("div[elName=zc-richtextarea]").get();//No I18N
		for (i=0; i<richtext_div.length; i++)
		{
			randNum = randNum+1;
			divID = randNum + "";
			$(richtext_div[i]).attr("id",divID);
			var divHeight = $(richtext_div[i]).attr("zc-editor-height");
			divHeight = divHeight.substring(0, divHeight.length-2);
			var textAreaName = $(richtext_div[i]).attr("nameoftextarea");
			var textAreaElem = $(frm).find("textarea[name = '"+textAreaName+"']");//No I18N
			var rteContent = $(textAreaElem).val();

			var toolsJson = $(textAreaElem).attr("zc-rtetToolsJson");//No I18N
			toolsJson =  (ZCUtil.isNull(toolsJson) ? "" : JSON.parse(toolsJson));//No I18N

			var fontSizeJson = $(textAreaElem).attr("zc-rtetFontJson");//No I18N
			fontSizeJson = (ZCUtil.isNull(fontSizeJson) ? "" : JSON.parse(fontSizeJson));//No I18N

			var fontFamilyJson = $(textAreaElem).attr("zc-rtetFontFamilyJson"); //No I18n
			fontFamilyJson = (ZCUtil.isNull(fontFamilyJson) ? "" : JSON.parse(fontFamilyJson));//No I18N

			var initObj = {id : divID, content : rteContent, editorheight : divHeight, toolbar : toolsJson, fontsize : fontSizeJson, fontfamily : fontFamilyJson};
			ZCForm.createRichTextEditor(divID,initObj);
		}
	}

	this.createRichTextEditor = function(divID, initObj)
	{
		try
		{
			this.editorRef[divID] = ZE.create(initObj);
			return true;
		}
		catch(e)
		{
			setTimeout(function(){ ZCForm.createRichTextEditor(divID,initObj);},1000);
		}
	}

	this.updateRichTextContent = function()
	{
		var richtext_div = $("div[elName=zc-richtextarea]").get();//No I18N
		for (i=0; i<richtext_div.length; i++)
		{
			divID = $(richtext_div[i]).attr("Id");
			var nameoftextarea = $(richtext_div[i]).attr("nameoftextarea");
			var content = this.editorRef[divID].getContent();
			var multiTextName = $("textarea[name='"+nameoftextarea+"']");//No I18N
			$(multiTextName).val(content);
		}
	}
	this.doSubmit = function(frm)
	{
		//var submitBtn = $(frm).find(":input[type=submit],[type=button]");  //IE 8 - Permission Denied Issue
		//var freezeTime = submitBtn.attr("freezeTime");
 		var freezeTime = $(frm).attr("freezeTime");
		if(!ZCUtil.isNull(freezeTime) && ((new Date() - new Date(freezeTime)) < 5000))
		{
			return false;
		}
		//submitBtn.removeAttr("freezeTime");
		$(frm).removeAttr("freezeTime");
		return true;
	}

	this.freezeButton = function(frm)
	{
 		//$(frm).find(":input[type=submit],[type=button]").attr("freezeTime", new Date());	//IE 8 - Permission Denied Issue
		 $(frm).attr("freezeTime", new Date());
	}

	this.defreezeButton = function(frm)
	{
 		//$(frm).find(":input[type=submit],[type=button]").removeAttr("freezeTime");	//IE 8 - Permission Denied Issue
		$(frm).removeAttr("freezeTime");
	}

	this.invokeOnChange = function(el, frm, formAccessType, frmCmpID)
	{
		if(window.RuleEvents !== undefined && window.RuleEvents[$(frm).attr('name')] !== undefined && window.RuleEvents[$(frm).attr('name')][$(el).attr('name')] !== undefined)
		{
			window.RuleEvents[$(frm).attr('name')][$(el).attr('name')]();
		}	
		var formCompObj = $(el);
		var fieldtype =formCompObj.attr("fieldtype"); //No I18N
		if(fieldtype == 29)//to support others option
		{
			showOthersOption(formCompObj); //No I18N
		}
		if($(el).attr("onChangeExists"))
		{
			ZCForm.showHideCog(el, "visible");
			/*if($(frm).attr("formType") == "SubForm")
			{
				var  id = $(frm).attr("id");
				var formLinkName = $(frm).attr("name");
				var paramsMap = ZCForm.formArr[formLinkName];
				var formID = ZCUtil.getFromMap(paramsMap, "formID");		//No I18N
				onChangeScript(frm, formID, $(el).attr("formCompID"), formAccessType);
			}
			else*/
			if(frmCmpID){
                var name = $(el).attr("name");
                if($(el).attr("type") == "file")
                {
                	name = $(el).siblings('input[type=hidden]').attr("name");
                }
				
				onChangeSubFormScript(frm, $(frm).find(":input[name=formid]").val(), frmCmpID, $(el).attr("formCompID"), name, formAccessType);
			}
			else{
				onChangeScript(frm, $(frm).find(":input[name=formid]").val(), $(el).attr("formCompID"), formAccessType);
			}
		}
		if($(el).attr("isFormulaExist")== "true")
				{
					ZCForm.showHideCog(el, "visible");//No internationalization
					if(frmCmpID)
					{
					 executeFormulaforSubForm(frm, $(frm).find(":input[name=formid]").val(), frmCmpID, $(el).attr("formCompID"), $(el).attr("name"), formAccessType);
					}
					else
					{
					 executeFormula(frm, $(frm).find(":input[name=formid]").val(), $(el).attr("formCompID"));
					}
		}
	}

	this.invokeGridRowAction = function(el, frm, rowID, actionType, formAccessType){


		if( (actionType==="onaddrow" && el.attr('onaddrowexist')) || (actionType==="ondeleterow" && el.attr('ondeleterowexist')) ){

			var labelName = "SF(" + $(el).attr("name") + ").FD(" + rowID + ").SV(ID)";
			ZCForm.showHideCog(el.find("a[labelname='"+ labelName +"']"), "visible", true);
			subFormRowAction(frm, $(frm).find(":input[name=formid]").val(), $(el).attr("formCompID"), $(el).attr("name"), rowID, actionType, formAccessType);
			return true;
		}

	}

	this.handleButtonOnClick = function(formElem, formAccessType, buttonEl)
	{
		ZCForm.updateRichTextContent();
		if($(buttonEl).attr("eventType"))
		{
            var formLinkName = $(formElem).find(":input[name=formLinkName]").val();
            var formParamsMap = ZCForm.formArr[formLinkName];
            if(ZCUtil.isNull(ZCUtil.getFromMap(formParamsMap,"onuserinput")))
            {
                ZCUtil.removeFromMap(formParamsMap, "fieldchange"); //No I18N
                ZCUtil.removeFromMap(formParamsMap, "autosubmit"); //No I18N
                ZCUtil.removeFromMap(formParamsMap, "buttonelem"); //No I18N
                submitExtForm(formElem, formAccessType, $(buttonEl).attr("buttonID"), $(buttonEl).attr("eventType"));
            }
            else
            {
                ZCUtil.removeFromMap(formParamsMap, "fieldchange"); //No I18N
                ZCUtil.setInMap(formParamsMap, "autosubmit", "true"); //No I18N
                ZCUtil.setInMap(formParamsMap, "buttonelem", buttonEl); //No I18N
                ZCForm.clearErrors(formElem);
            }
		}
		return false;
	}

	this.bulkEditRecords = function(formLinkName, formAccessType, lblNameArr)
	{
		var formElem = ZCForm.getForm(formLinkName, formAccessType);
		var viewLinkName = $(formElem).find(":input[name=viewLinkName]").val();
		var viewParamsMap = ZCView.viewArr[viewLinkName];
		var recLength = ZCUtil.getFromMap(viewParamsMap, "updateIdList").split(",").length-1;
                var paramsArr = new Array();
		paramsArr[0] = recLength;
		var bulkEditMsg= replaceParams(i18n.bulkEditMsg, paramsArr);
	//	if(confirm(bulkEditMsg))
	//	{
		if(lblNameArr == "" || lblNameArr == undefined || lblNameArr == null)
		{
			ZCView.showAlertPopUp(i18n['zc.viewlive.selectatleastonefield']);
			return false;
		}
                ZCView.showConfirmPopUp(bulkEditMsg, function(){
			var params = "addviewid="+ZCUtil.getFromMap(viewParamsMap, "viewID")+"&tableName="+ZCUtil.getFromMap(viewParamsMap, "tableName")+"&formid="+ZCUtil.getFromMap(viewParamsMap, "viewFormID")+"&updateIdList="+ZCUtil.getFromMap(viewParamsMap, "updateIdList")+"&privateLink="+ZCUtil.getFromMap(viewParamsMap, "privateLink");
			params = params + "&dateFormat=" + $(formElem).find(":input[name=dateFormat]").val()+ "&timeZone=" + $(formElem).find(":input[name=timeZone]").val()+"&viewLinkName="+viewLinkName;
			var othersObj = $(formElem).find(":input[name*=othersVal]"); //No I18N
			$.each(othersObj,function(index ,obj)
			{
				params=params+"&"+obj.name+"="+obj.value; //No I18N
 			}
			);
			$.each(lblNameArr, function(index, fieldName)
			{
				var tempParam = "";
				var fieldEl = $(formElem).find(":input[name="+fieldName+"],div[name="+fieldName+"]");
				var fieldType = fieldEl.attr("type");

				if(fieldType == "url" || fieldType == "image" || fieldType == "radio" || (fieldType == "checkbox" && $(formElem).find("span[name=parentOf-"+fieldName+"]")[0]))
				{
					if(fieldType == "checkbox" || fieldType == "radio")
					{
						fieldEl = $(formElem).find("span[name=parentOf-"+fieldName+"],div[name=parentOf-"+fieldName+"]");
					}
					$.each($(fieldEl).find(":input"), function(index, tag)
					{
						if((fieldType == "radio" && $(tag).attr("type") === "text") || ($(tag).attr("type") == "radio" && !$(tag).prop("checked")) || (fieldType == "checkbox" && !$(tag).prop("checked"))){ return };
						tempParam = tempParam+"&"+$(tag).attr("name")+"="+encodeURIComponent($(tag).val());
					});
				}
				else if(fieldType == "checkbox" && $(fieldEl).prop("checked")) // DECISION CHECK
				{
					tempParam = "&"+fieldName+"="+$(fieldEl).prop("checked");
				}
				else if(fieldType == "searchLookupSingle" ||  fieldType == "searchLookupMulti")
				{
					$.each($(fieldEl).find("input"), function(index, el)
					{
						tempParam = tempParam+"&"+fieldName+"="+encodeURIComponent($(el).val());
					});
				}
				else if(fieldType === "composite")
				{
					$.each($(fieldEl).find(':input'),function(el,index){
						tempParam = tempParam +"&"+ $(this).attr('name')+"="+$(this).val();
					});
					tempParam = tempParam +"&CF("+$(fieldEl).attr('name')+").SV(status)=edit";
				}
				else
				{
					if(fieldType == "select-multiple" || fieldType == "multiselect")
					{
						var vals = ZCUtil.getFieldValue(fieldEl);
						if(!ZCUtil.isNull(vals))
						{
							$.each(vals, function(idx, val)
							{
								if(!ZCUtil.isNull(val)) tempParam = tempParam + "&"+ fieldName + "=" + encodeURIComponent(val);
							});
						}
					}
					else if(fieldEl.attr("fieldtype") == 25)
					{
						var extFieldEl = $(formElem).find(":input[name="+fieldName+"_ID],div[name="+fieldName+"_ID]");
						tempParam = tempParam + "&"+ fieldName+"="+encodeURIComponent(ZCUtil.getFieldValue(fieldEl));
						tempParam = tempParam + "&"+ fieldName+"_ID="+encodeURIComponent(ZCUtil.getFieldValue(extFieldEl));	//No I18N
						lblNameArr[lblNameArr.length] = fieldName+"_ID";
					}
					else if($(fieldEl).length > 1)
					{
						$.each(fieldEl,function(index, el){

							tempParam = tempParam+"&"+$(el).attr("name")+"="+encodeURIComponent($(el).val());
						});
					}
					else
					{
						tempParam = tempParam + "&"+ fieldName+"="+encodeURIComponent(ZCUtil.getFieldValue(fieldEl));
					}
				}
				params = params + tempParam;
			});
			var linkedView = ZCUtil.getFromMap(viewParamsMap, "linkedView");
			if(!ZCUtil.isNull(linkedView))
			{
				params = params + "&linkedView="+linkedView;
			}
			params = params + "&" + ZCUtil.getParamsFromArray(lblNameArr, "SelLabel");
            var newCodeBse = ZCUtil.getFromMap(viewParamsMap,"newCodeBaseEnabled");
            var bulkeditUrl = (newCodeBse != "" && newCodeBse == "true") ? "/editbulkrecordNew.do" : "/editbulkrecord.do";
		    ZCUtil.sendRequest(bulkeditUrl , params, "json", "ZCForm.handleBulkEditResponse", ZCUtil.getParamsAsMap("viewLinkName="+viewLinkName+"&formLinkName="+formLinkName+"&formAccessType="+formAccessType+"&fid="+ZCUtil.getFromMap(viewParamsMap, "viewFormID")), i18n.pleasewait); //No I18N
			return false;
		});
	/*	else
		{
			return false;
		}*/
                return false;
	}

	this.windowScrollTop;
	this.offsetTop;

	this.getParamsFromIfrme = function()
	{
		var message = document.location.hash;
	    if (message.length > 1)
	    {
		    message = message.substr(1);
			var parameters = ZCForm.parseIframeParameters(message);

			if((parameters["windowScrollTop"] != null)  && (parameters["offsetTop"] != null))
			{
				ZCForm.windowScrollTop = parameters["windowScrollTop"];
				ZCForm.offsetTop = parameters["offsetTop"];
			}
		}
	}

	this.parseIframeParameters = function(message)
	{
		var dictionary = new Array();
		var pairs = message.split(/&/);

		for (var keyValuePairIndex in pairs)
		{
		    var nameVal = pairs[keyValuePairIndex].split(/=/);
		    dictionary[nameVal[0]] = nameVal[1];
		}
		return dictionary;
	}

	this.triggerSubmit = function(formElem)
	{
		ZCApp.setLoadingMsg($("#zc-loading"), i18n.pleasewait + " ...");
		ZCApp.showLoading("zc-loading");//No I18N
		var elem = $("#zc-loading");
		var loadingElem = elem.find('[loading=true]');
		if(loadingElem.length == 0) loadingElem = elem.find('[loading=false]');
		loadingElem.attr('loading', "true");
		ZCForm.clearErrors(formElem);

		var fileElArr = $(formElem).find(":input[type=file]");
		if(fileElArr.length > 0)
		{
			return ZCForm.uploadFilesAndSubmit(formElem, fileElArr);
		}
		else
		{
			return ZCForm.submitForm(formElem);
		}
	}

	this.resetForm = function(formLinkName, formAccessType)
	{
		var formParamsMap = ZCForm.formArr[formLinkName];

		if(ZCUtil.getFromMap(formParamsMap, "zc_LoadIn") == "dialog")
		{
		    ZCApp.reloadZCComp(formLinkName);
		}
		else
		{
			if(formAccessType == ZCConstants.VIEW_ADD_FORM)
			{
				closeDialog();
				var viewLinkName = ZCUtil.getFromMap(formParamsMap, "viewLinkName");
                var jsonObject = ZCUtil.getFromMap(formParamsMap, "dateJsonObject"); // No I18N
                if(!ZCUtil.isNull(jsonObject))
                {
                    jsonObject = jsonObject.replace(new RegExp('#zc_comma#','g'),",");
                    jsonObject = jsonObject.replace(new RegExp('&#034,','g'),"\"");
                }
                ZCView.showAddForm(ZCView.getViewCont(viewLinkName).find("a[elName=zc-showAddFormEl]"), viewLinkName, jsonObject);
			}
			else if(formAccessType == ZCConstants.FORM_LOOKUP_ADD_FORM)
			{
				var frm = ZCForm.getForm(formLinkName, formAccessType);
				var el = $(frm).find(":input[type=reset]");

                var refFormCompName = $(frm).find(':input[name=lookupFieldName]').val();//No I18N
				var childFormLinkName = $(frm).find(':input[name=childFormLinkName]').val();//No I18N
				var childFieldLabelName = $(frm).find(':input[name=childFieldLabelName]').val();//No I18N
				var childFormAccessType = $(frm).find(':input[name=childFormAccessType]').val();//No I18N
				var childFormPrivateLink = $(frm).find(':input[name=childFormPrivateLink]').val(); //No I18N
				var childAppLinkName = $(frm).find(':input[name=childAppLinkName]').val();//No I18N
				var isFromSubForm = ($(frm).find(':input[name=isFromSubForm]').val() == 'true') ? true : false;
				var appLinkName = $(frm).find(':input[name=appLinkName]').val();
				var childParams = "";
				var length = ZCForm.childAppName.length;
				for(var i=1; i <= length; i++)
				{
					childParams = childParams + "&zc_childformname_" + i + "=" + ZCForm.childFormName[i-1] + "&zc_childappname_" + i + "=" + ZCForm.childAppName[i-1] + "&zc_childlabelname_" + i + "=" + ZCForm.childLabelName[i-1];//No I18N
				}

				var params = "sharedBy=" + ZCApp.sharedByDisp + "&appLinkName=" + appLinkName + "&compType=" + ZCConstants.FORM + "&formLinkName=" + formLinkName + "&formAccessType=" + ZCConstants.FORM_LOOKUP_ADD_FORM + "&lookupFieldName=" + refFormCompName+"&childFormLinkName="+childFormLinkName+"&childFieldLabelName="+childFieldLabelName+"&childFormAccessType="+childFormAccessType+"&childAppLinkName="+childAppLinkName+"&childFormPrivateLink="+childFormPrivateLink+"&zc_lookupCount=" + ZCForm.lookupCount + childParams+"&isFromSubForm="+isFromSubForm;//No I18N
				ZCUtil.sendRequest(ZCApp.compProps["actionURL-"+ZCConstants.FORM], params, "html", "ZCApp.loadZCCompInDialog", ZCUtil.getParamsAsMap("include = false & closedialog = true & formAccessType =" + ZCConstants.FORM_LOOKUP_ADD_FORM), i18n.pleasewait);//No I18N
			}
			else
			{
				if(ZCUtil.getFromMap(formParamsMap, "client") == "changed")
				{
					ZCUtil.setInMap(formParamsMap, "client", "reset");
					ZCForm.showForm(formLinkName, formAccessType);
					var frm = ZCForm.getForm(formLinkName,formAccessType);
				}
				//clear RichTextArea Content
				var _iframe = document.getElementsByTagName("iframe");
				var _length = _iframe.length;
				for(var i = 0;i < _length;i++)
				{
				if(_iframe[i].className === "ze_area")
				{
				_iframe[i].contentWindow.document.body.innerHTML = "";
				}
				}
				/*var editorRefObj = this.editorRef;
				$(frm).find("div[elName=zc-richtextarea]").each(function(){
					var divID = $(this).attr("Id");
					editorRefObj[divID].setContent('');
				});waiting for the fix from writer team */

				var formCont = ZCForm.getForm(formLinkName, formAccessType);
				$(formCont).find("input[type=file]").each(function(){
					ZCForm.removeUploadedFile($(this));
				});

				$(formCont).find("div[elName=zcDropDownSelVal]").each(function(){
					$(this).attr("elValue", "-Select-");
					$(this).html("-Select-");
				});
					$(formCont).find("div[elName=srchDiv]").each(function(){
					$(this).find("li").remove();
					if($(this).attr("type") == "searchLookupSingle")
					{
						var valhtml = searchFactory.formatValueToShow($(this).parent("div:first").find("table").find("tr[value=-Select-]"), $(this).attr("name"), $(this).attr("type"),$(this).width());
						$(this).append(valhtml);
					}
					else
					{
						$(this).find("span[elName=selectEl]").show();
					}
				});

			//Delete SubForm Tables....
				$(frm).find('table[elname=subform_values]').each(function(){
					$(this).find('tr').each(function(i,r){
						if(i<=1){
							$(r).find('td[elname!=delCol][elname!=editCol][elname!=template]').each(function(){
								$(this).remove();
								});
							}
						else
								$(r).remove();
						});
						$(this).css("display","none");
						$(this).attr("labelAdded","");
						$(this).attr("reccount","0");
					});
					return false;

			}
		 }
	}

	this.clearEmptyFiles = function(formElem, fileNamesMap)
	{
		fileNamesMap = fileNamesMap.substring(1, fileNamesMap.length-1);
		fileNamesMap = ZCUtil.getParamsAsMap(fileNamesMap, ",", "=");
		$(formElem).find(":input[type=file][changed='changed']").each(function()
		{
			var fieldName = $(this).attr("labelName"); //No I18N
			var fileVal =ZCUtil.getFromMap(fileNamesMap, fieldName);

			if(ZCUtil.isNull(fileVal))
			{
				$(formElem).find("input[subType=file][name="+fieldName+"]").each(function()
				{
					$(this).attr("value",""); //No I18N
				});
			}
			});
	}
	this.submitForm = function(formElem)
	{
		var formLinkName = $(formElem).find(":input[name=formLinkName]").val();
		var formAccessType = $(formElem).find(":input[name=recType]").val();
 		var focussed = document.activeElement;
		var formCont = $(focussed).parents('div[class=zc-formcontainer]:first');

		//Signature field handling
		var signatureElArr = $(formElem).find("div[eleName=signature]");
		$.each(signatureElArr, function(index, el)
		{
			var isEdit = $(el).attr("isEdit");
			var value = "add";
			var update = "true";
			if(isEdit === "true")
			{
				value = "update";	
				update = $(el).attr("update");
				update = update === undefined ? true : update;
			}
			if(update === "true")
			{
				var base30Arrdata = $(el).jSignature('getData','base30');
				if(base30Arrdata != undefined)
				{
					var dataLength = base30Arrdata[1].length;
					if(dataLength > 0)
					{
						var data = $(el).jSignature('getData', "image");
			            var srcValue = value + "," + data[1];
						var parentDiv = $(el).parent();
						$(parentDiv).find("textarea[elename=signatureText]").val(srcValue);
					}
					else if(isEdit)
					{
						var parentDiv = $(el).parent();
						$(parentDiv).find("textarea[elename=signatureText]").val("");
					}
				}
			}
		});
		
		if($(formCont).attr("formType") == "SubForm")
		{
			var subFormLinkName = $(formCont).attr("name");
			var subFormLabelName = $(formCont).parents('div[elname=subformdiv]').attr("name");
			ZCForm.submitSubForm(subFormLinkName,formLinkName,subFormLabelName);
			 return false;
		}
		var formParamsMap = ZCForm.formArr[formLinkName];
		if(ZCUtil.isNull(ZCUtil.getFromMap(formParamsMap,"onuserinput")))
		{
			ZCUtil.removeFromMap(formParamsMap, "fieldchange"); //No I18N
			ZCUtil.removeFromMap(formParamsMap, "autosubmit"); //No I18N

			$(formElem).find("div[elName=zc-fileuploadtemplate]").html("");
			var params = ZCUtil.getFieldsAsParams(formElem, ":input[type!=reset][type!=submit][type!=button][type!=file]",formLinkName,formAccessType);	//No I18N
			var linkedView = ZCUtil.getFromMap(formParamsMap, "linkedView");
			if(!ZCUtil.isNull(linkedView))
			{
				params += "&linkedView="+linkedView;
			}

			params += "&hasSubForm="+ZCUtil.getFromMap(formParamsMap,"hasSubForm");		//No I18N
			params += "&formBasedOperation="+ZCUtil.getFromMap(formParamsMap, "formBasedOperation");
			ZCUtil.sendRequest($(formElem).attr("action"), params, "json", "ZCForm.handleResponse", ZCUtil.getParamsAsMap("formLinkName="+formLinkName+"&formAccessType="+formAccessType), i18n.pleasewait); //No I18N
			return false;
		}
		else
		{
			ZCUtil.removeFromMap(formParamsMap, "fieldchange"); //No I18N
			ZCUtil.setInMap(formParamsMap, "autosubmit", "true"); //No I18N
			ZCForm.clearErrors(formElem);
			return false;
		}
	}

	this.uploadFilesAndSubmit = function(formElem, fileUploadArr,el,isSubForm)
	{
		var submitFile = "";
		var filediv = ZCUtil.getParent(formElem, "div").find("div[elName=zc-fileuploadtemplate]:first");
		var fileform = filediv.find("form")[0];
		//sharedbyDisp and applinkname will come from the zohosites
        if(ZCApp.sharedByDisp != undefined)
        {
                fileform.sharedBy.value = ZCApp.sharedByDisp;
        }
        if(ZCApp.appLinkName != undefined)
        {
                fileform.appLinkName.value = ZCApp.appLinkName;
        }
		//fileform.formAccessType.value = $(formElem).find(":input[name=recType]").val();
		//fileform.formLinkName.value = $(formElem).find(":input[name=formLinkName]").val();
        var imageElArr = $(formElem).find(":input[subType=image]");
        $.each(imageElArr, function(index, el)
        {
        	var imgval = $(el).prop("value");
        	var orgval = $(el).attr("imagevalue");
        	if(imgval == "" && orgval != "" && orgval != null)
        	{
        		$(el).val(orgval);
        	}
        });

		$.each(fileUploadArr, function(index, el)
		{
			var changed = $(el).attr("changed");
			if(changed && changed == "changed")
			{
				submitFile = "submit";
				if($(el).attr("zc-Attached-Type") == "browse")
				{
					$(el).after($(el).clone()[0]);
					$(el).attr("name", $(el).attr("labelName"));
					$(fileform).append(el);
				}
				else if($(el).attr("zc-Attached-Type") == "cloud")
				{
					var arrEl = document.createElement('input');
					$(arrEl).attr("type", "hidden");
					$(arrEl).attr("name", "cloudDocAttachments");
					$(arrEl).attr("value", $(el).attr("labelName"));
					$(fileform).append(arrEl);

					var inputEl = document.createElement('input');
					$(inputEl).attr("type", "hidden");
					$(inputEl).attr("name", $(el).attr("labelName"));
					$(inputEl).attr("value", $(el).attr("zc-DocId"));
					$(fileform).append(inputEl);
				}
				else if($(el).attr("zc-Attached-Type") == "google")
				{
					var arrEl = document.createElement('input');
					$(arrEl).attr("type", "hidden");
					$(arrEl).attr("name", "gDocAttachments");
					$(arrEl).attr("value", $(el).attr("labelName"));
					$(fileform).append(arrEl);

					var inputEl = document.createElement('input');
					$(inputEl).attr("type", "hidden");
					$(inputEl).attr("name", $(el).attr("labelName"));
					$(inputEl).attr("value", $(el).attr("zc-DocId"));
					$(fileform).append(inputEl);
				}
				else if($(el).attr("zc-Attached-Type") == "zoho")
				{
					var arrEl = document.createElement('input');
					$(arrEl).attr("type", "hidden");
					$(arrEl).attr("name", "zDocAttachments");
					$(arrEl).attr("value", $(el).attr("labelName"));
					$(fileform).append(arrEl);

					var inputEl = document.createElement('input');
					$(inputEl).attr("type", "hidden");
					$(inputEl).attr("name", $(el).attr("labelName"));
					$(inputEl).attr("value", $(el).attr("zc-DocId"));
					$(fileform).append(inputEl);
				}
			}
		});
		if(submitFile == "submit")
		{
			if(isSubForm == true)
			{
				ZCForm.isSubFormFileSubmit = true;
			}
			else
			{
				ZCForm.isSubFormFileSubmit = false;
			}
			$(fileform).submit();
		}
		else if(isSubForm != true)
		{
			return ZCForm.submitForm(formElem);
		}
		else
		{
			return ZCForm.submitSubForm(el);
		}
		return false;
	}

	this.clearimagevalue = function(thisObj, showDiv)
	{
		var tableEl = $(thisObj).parents("[elName=zc-fieldtd]:first");
		var sourcevalue = $(tableEl).find("input[name="+showDiv+"]").val();
		$(tableEl).find("input[name="+showDiv+"]").attr("imagevalue",sourcevalue);

		var subsourcevalue = $(tableEl).find("input[subname="+showDiv+"]").val();
		$(tableEl).find("input[subname="+showDiv+"]").attr("imagevalue",subsourcevalue);
	}
	this.clearUploadForm = function(origform)
	{
		var filediv = ZCUtil.getParent(origform, "div").find("div[elName=zc-fileuploadtemplate]");
		var fileform = filediv.find("form");
		$(fileform).find(":input").remove("[type=file]");
	}

	this.revertUpload = function(origform)
	{
		var filediv = ZCUtil.getParent(origform, "div").find("div[elName=zc-fileuploadtemplate]");
		var fileform = filediv.find("form");

		$.each($(origform).find(":input[type=file]"), function(index, elem)
		{
			$(elem).attr("name", "uploadFile");
		});
		$.each((fileform).find("input[name=gDocAttachments]"), function(index, elem)
		{
			var fieldName = $(fileform).find("input[name=gDocAttachments]").prop("value");
			$(fileform).find("input[name=gDocAttachments]").remove();
			$(fileform).find("input[name=" + fieldName +"]").remove();
		});
		$.each((fileform).find("input[name=zDocAttachments]"), function(index, elem)
		{
			var fieldName = $(fileform).find("input[name=zDocAttachments]").prop("value");
			$(fileform).find("input[name=zDocAttachments]").remove();
			$(fileform).find("input[name=" + fieldName +"]").remove();
		});
	/*	$.each($(fileform).find(":input[type=file]"), function(index, elem)
		{
			var name = $(elem).attr("name");
			var textel = $(origform).find(":input[name="+name+"]");
			ZCUtil.getParent(textel).find(":input").remove("[type=file]");
			$(elem).attr("name", "uploadFile")
			$(textel).after($(elem)[0]);
		});*/
		ZCForm.clearUploadForm(origform);
		ZCApp.hideLoading("zc-loading");
	}

	this.setUpCalendar = function(inputElID, buttonElID, format, showTime, weekWork)
	{
        var workDays = new Array();
        if(weekWork != undefined && weekWork != "")
        {
            workDays = weekWork.split(",");
        }
		Calendar.setup(
		{
			inputField : inputElID,
			ifFormat : format,
			showsTime : showTime,
			button : buttonElID,
			onUpdate : ZCForm.triggerOnChange
            /*dateStatusFunc : function(dateObj)
            {
                 if(workDays.length > 0 && !isValueExist(workDays, dateObj.getDay()))
                 {
                      return true;
                 }
                 return false;
            }*/
		});
	}

	this.triggerOnChange = function(cal)
	{
		var el = cal.params.inputField;
		$(el).change();
	}

	this.checkAndAppend = function(formElem, elName, value, elem)
	{
		var envalueElem = $(formElem).find(":input[name="+elName+"]")
		if(envalueElem.get(0))
		{
			envalueElem.attr("value", value);
		}
		else
		{
			$(ZCUtil.createElem("input", "type=hidden,name="+elName+",value="+value, "")).insertAfter($(elem));
		}
		return formElem;
	}

 	this.getFieldsArrFromResponse = function(responseText, formID)
 	{
        var fieldsArr =new Array();
        if(typeof(responseText) == "object") {
           for(var eachResText in responseText) {
               var objEle = responseText[eachResText];
                if(typeof(objEle) == "object") {
                     for(var eachObjEle in objEle) {
                         var insideObj = objEle[eachObjEle];
                         if(typeof(insideObj) == "object") {
                             var key = "";
                             var val = "";
                             for(var eachInsideObj in insideObj) {
                                    var el = insideObj[eachInsideObj];
                                    if(eachInsideObj == "seq")
                                         {key=el;}
                                    val=val + eachInsideObj + "=" +el+"&";
                              }
                              if(key!="")
                                    fieldsArr[key] = val;
                                   //ieldsArr[key]);
                         }
                      }
                 }
            }
       }
       return fieldsArr;
    }

	this.getMsgFromResponse = function(responseText, formID)
	{
		var responseArr = [];
		if(typeof(responseText) == "object") {
			for(var eachResText in responseText) {
				var objEle = responseText[eachResText];
				if(typeof(objEle) == "object") {
					for(var eachObjEle in objEle) {
						var insideObj = objEle[eachObjEle];
						if(eachObjEle==("success"+formID)) {
							responseArr["succMsg"] = insideObj;
						}
						else if(eachObjEle==("errors"+formID) && typeof(insideObj) == "object") {
							responseArr["fieldErrObj"] = insideObj;
						}
						else if(eachObjEle==("errors"+formID)) {
							responseArr["errors"] = insideObj;
						}
						else if(eachObjEle==("errorList"+formID) && typeof(insideObj) == "object") {
							responseArr["errorList"] = insideObj;
						}
						else if(eachObjEle==("successList"+formID) && typeof(insideObj) == "object") {
							responseArr["successList"] = insideObj;
						}
						else if(eachObjEle==("successes"+formID)) {
							responseArr["fieldSuccObj"] = insideObj;
						}
						else if(eachObjEle==("recordDetails"+formID)) {
							responseArr["recordDetails"] = insideObj;
						}
						else if(eachObjEle==("msg"+formID)) {
							responseArr["errMsg"] = insideObj;
						}
						else if(eachObjEle==("info"+formID)) {
							responseArr["infoMsg"] = insideObj;
						}
						else if(eachObjEle==("alert"+formID)) {
							responseArr["alertMsg"] = insideObj;
						}
						else if(eachObjEle==("successMsgDuration"+formID)) {
							responseArr["successMsgDuration"] = insideObj;
						}
						else if(eachObjEle==("captcha"+formID)) {
							responseArr["captchaTxt"] = insideObj;
						}
						else if(eachObjEle==("generatedjs"+formID)) {
							responseArr["generatedjs"] = insideObj;
						}
						else if(eachObjEle==("errorMsg"+formID)) {
							responseArr["errorMsg"] = insideObj;
						}
						else if(eachObjEle==("status"+formID)) {
							responseArr["statusMsg"] = insideObj;
						}
						else if(eachObjEle==("dummyForm")) {
							responseArr["dummyForm"] = insideObj;
						}
						else if(eachObjEle==("execType")) {
							responseArr["execType"] = insideObj;
						}
						else if(eachObjEle==("successmsg")) {
							responseArr["successmsg"] = insideObj;
						}
						else if(eachObjEle==("lookupFieldValue"+formID)) {
							responseArr["lookupFieldValue"] = insideObj;
						}
						else if(eachObjEle==("childFormAccessType"+formID)) {
							responseArr["childFormAccessType"] = insideObj;
						}
						else if(eachObjEle==("childFieldLabelName"+formID)) {
							responseArr["childFieldLabelName"] = insideObj;
						}
						else if(eachObjEle==("childFormLinkName"+formID)) {
							responseArr["childFormLinkName"] = insideObj;
						}
						else if(eachObjEle==("isFromSubForm"+formID)) {
							responseArr["isFromSubForm"] = insideObj;
						}
						else if(eachObjEle==("compType"+formID)) {
							responseArr.compType = insideObj;
						}
						else if(eachObjEle==("childSubformField"+formID)) {
							responseArr.childSubformField = insideObj;
						}
						else if(eachObjEle==("rowNo"+formID)) {
							responseArr["rowNo"] = insideObj;
						}
						else if(eachObjEle==("recLinkID"+formID)) {
							responseArr["recLinkID"] = insideObj;
						}
						else if(eachObjEle==("paymentConfigId"+formID)) {
							responseArr["paymentConfigId"] = insideObj;
						}
						else if(eachObjEle==("combinedValue"+formID)) {
							responseArr["combinedValue"] = insideObj;
						}
						else if(eachObjEle == ("paidUserFieldError"+formID))
						{
							responseArr["paidUserFieldError"] = insideObj;
						}
						else if(eachObjEle === ("nexturl_rule"+formID))
						{
							responseArr.nexturl_rule = insideObj;
						}
					}
				}
			}
		}
		return responseArr;
	}

	this.handleBulkEditResponse = function(responseText, paramsMap, argsMap)
	{
		var viewLinkName = ZCUtil.getFromMap(argsMap, "viewLinkName");
		var formLinkName = ZCUtil.getFromMap(argsMap, "formLinkName");
		var formAccessType = ZCUtil.getFromMap(argsMap, "formAccessType");
		var viewParamsMap = ZCView.viewArr[viewLinkName];
		var formElem = ZCForm.getForm(formLinkName, formAccessType);
		var formID  = $(formElem).find(":input[name=formid]").val();
		var responseArr = ZCForm.getMsgFromResponse(responseText, formID);
		var succMsg = responseArr["succMsg"];
		var errMsg = responseArr["errMsg"];
		var fieldErrObj = responseArr["fieldErrObj"];
		ZCForm.clearErrors(formElem);
		if(ZCUtil.isNull(succMsg))
		{
			ZCForm.showErrors(formLinkName, formAccessType, "", "", fieldErrObj);
		}
		else
		{
			closeDialog();
			ZCUtil.removeFromMap(viewParamsMap, "bulkEditParams");
			ZCView.showView(viewParamsMap, succMsg);
		}
	}

	this.resetCaptcha = function(formElem)
	{
	        var formID  = $(formElem).find(":input[name=formid]").val();
		$(formElem).find(":input[name=captcha]").val("");
		var captchaUrl = "/getcaptcha.do?time="+new Date()+"&formid="+formID;//No I18N
		if(ZCApp.contextPath != "")
		{
			captchaUrl = ZCApp.contextPath + captchaUrl;
		}
		$(formElem).find("img[elName='zc-captcha']").attr("src", captchaUrl);
	}

	this.handleResponse = function(responseText, paramsMap, argsMap)
	{
		var formLinkName = ZCUtil.getFromMap(paramsMap, "formLinkName");
		var formParamsMap = ZCForm.formArr[formLinkName];
		var zcNextUrl = ZCUtil.getFromMap(formParamsMap, "zc_NextUrl");
		var zcnewPage = ZCUtil.getFromMap(formParamsMap,"zc_newPage");
		var zc_EditType = ZCUtil.getFromMap(formParamsMap, "zc_EditType"); //No I18N
		var formBasedOperation = ZCUtil.getFromMap(paramsMap, "formBasedOperation");
		var formAccessType = ZCUtil.getFromMap(paramsMap, "recType");
		var formElem = ZCForm.getForm(formLinkName, formAccessType);
		var formID  = $(formElem).find(":input[name=formid]").val();

		var responseArr = ZCForm.getMsgFromResponse(responseText, formID);
		var succMsg = responseArr["succMsg"];
		var succMsgDuration = responseArr["successMsgDuration"];
		var errMsg = responseArr["errMsg"];
		var paidUserFieldError = responseArr["paidUserFieldError"];
		var fieldErrObj = responseArr["fieldErrObj"];
		var combinedValue = responseArr["combinedValue"];
		var lookupFieldValue = responseArr["lookupFieldValue"];
		var compType = responseArr.compType;
		var childFormLinkName = responseArr["childFormLinkName"];
		var childFieldLabelName = responseArr["childFieldLabelName"];
		var childFormAccessType = responseArr["childFormAccessType"];
		var isFromSubForm = (responseArr["isFromSubForm"] == 'true') ? true : false;
		var rowNo = responseArr["rowNo"] ;
		var childSubformField = responseArr.childSubformField;
		var infoMsg = (ZCApp.sharedBy == ZCApp.loginUser || ZCApp.loginUser == ZCApp.appOwner)?responseArr["infoMsg"]:"";
		var errorMsg = responseArr["errorMsg"];

		ZCForm.defreezeButton(formElem);
		ZCForm.clearErrors(formElem);

		var alertMsg = responseArr["alertMsg"];
		var captchaTxt = responseArr["captchaTxt"];
		var generatedjs = responseArr["generatedjs"];
		var nexturl_rule = responseArr.nexturl_rule;
		//Harishankar - payment feature actions
		var paymentConfigId = responseArr["paymentConfigId"];
		var recLinkID = responseArr["recLinkID"];
		if(!ZCUtil.isNull(succMsg))
		{
			if(formAccessType == ZCConstants.FORM_LOOKUP_ADD_FORM)
			{
				relodCurrentForm = "false";
				closeDialog();
				var subFormRecordCmpName = "SF(" + childSubformField + ").FD(t::row_" + rowNo + ")." + ( ZCConstants.MULTI_SELECT == compType ? "MV(" : "SV(" ) + childFieldLabelName + ")";	//No I18N
				var frmCmpElem = $(ZCForm.getForm(childFormLinkName, childFormAccessType)).find("[name='"+subFormRecordCmpName+"']");
				addValue(childFormLinkName, childFieldLabelName, frmCmpElem, lookupFieldValue, childFormAccessType, combinedValue,isFromSubForm);//No I18N
				setValue(childFormLinkName, childFieldLabelName, new makeList(lookupFieldValue), childFormAccessType,isFromSubForm,rowNo, combinedValue);
			}
			if(!ZCUtil.isNull(generatedjs) && ZCUtil.isNull(paymentConfigId))
			{
				if( relodCurrentForm != "falseRS") { ZCApp.showFadingMsg(succMsg, 0,5000); }
				if(formAccessType != ZCConstants.FORM_LOOKUP_ADD_FORM){
					evaluateJs(generatedjs, formAccessType);
				}
			}

			
			if(!ZCUtil.isNull(nexturl_rule))
			{
				window.location = nexturl_rule;
			}
			


			if(formAccessType == ZCConstants.VIEW_EDIT_FORM && formBasedOperation && formBasedOperation == "true")
			{
				
				relodCurrentForm = "false";
				closeDialog();
				ZCAppSearch.loadLayoutData(formLinkName, 'current');
			}
			else if(formAccessType == ZCConstants.VIEW_EDIT_FORM && (zcnewPage == "true" || zc_EditType != "default"))
			{
				var urlParams = ZCUtil.getURLParams();
				var reloadPrevURL = false;
				if(urlParams)
				{
					var urlArr = urlParams.split("&");
					for(var i=0; i< urlArr.length; i++)
					{
						var attr = (urlArr[i]).split("=");
						if(attr[0] == "zc_LoadIn" && attr[1] == "dialog" )
						{
							reloadPrevURL = true;
							break;
						}
					}
				}

				if(!ZCUtil.isNull(zcNextUrl))
				{
					ZCApp.showFadingMsg(succMsg, 0, succMsgDuration||2500);
					if(layerCount>1)
					{
						closeDialog();
					}
					zcNextUrl = ZCForm.correctURL(zcNextUrl);
					ZCUtil.setURLInLocationBar(zcNextUrl);
				}
				else if(relodCurrentForm == "true")
				{
					if(layerCount>1)
					{
						ZCApp.showFadingMsg(succMsg, 0, succMsgDuration||2500);
						closeDialog();
						ZCUtil.setURLInLocationBar(reloadPrevURL?ZCApp.prevURL:ZCApp.currURL);
						if(!reloadPrevURL){
							ZCApp.reloadSameURL(ZCApp.currURL);
						}
					}
					else
					{
					var f = document.createElement('form');
					f.method="post";//No I18N
					f.action=encodeURI("/appcreator/jsp/successpage.jsp");
					var sucElement = document.createElement("input");
					sucElement.name = "success";
					sucElement.type="hidden";
								sucElement.value=succMsg;
								f.appendChild(sucElement);
								document.body.appendChild(f);
								relodCurrentForm = "true"; //No I18N
								f.submit();
					}
				}
			}
			else if(relodCurrentForm == "true")
			{
				if(!this.zcFormAttributes['ajaxreload'])
				{
					var windowlocation = location.href;
					if(windowlocation.indexOf("?") == -1)
					{
						windowlocation = windowlocation + "?zc_success=true"; // No I18N
					}
					else
					{
						windowlocation = windowlocation + "&zc_success=true"; // No I18N
					}
					location.href = windowlocation;
				}
				if(!ZCUtil.isNull(paymentConfigId))
				{
					var formParamsMap = ZCForm.formArr[formLinkName];
					ZCUtil.setInMap(formParamsMap, "processPayment", true);
					ZCUtil.setInMap(formParamsMap, "recLinkID", recLinkID);
					ZCUtil.setInMap(formParamsMap, "paymentConfigId", paymentConfigId);
					var formCont = ZCForm.getFormCont(formLinkName, formAccessType);
					var fUrl = $(formCont).attr("formURL");
					if(fUrl.indexOf('/showPermaForm.do') != -1)
					{
							ZCUtil.setInMap(formParamsMap, "perma", "true");
					}
					if(!ZCUtil.isNull(zcNextUrl))
					{
						var zcPmtNextUrl = ZCForm.correctURL(zcNextUrl);
						zcNextUrl="";
						ZCUtil.setInMap(formParamsMap, "zc_NextUrl", zcNextUrl);
						ZCUtil.setInMap(formParamsMap, "zc_PmtNextUrl", zcPmtNextUrl);
					}
					ZCForm.formArr[formLinkName]=formParamsMap;
					ZCForm.reloadFormView(formLinkName, formAccessType, paramsMap, infoMsg, errorMsg, succMsg);
				}
				else
				{
					ZCForm.reloadFormView(formLinkName, formAccessType, paramsMap, infoMsg, errorMsg, succMsg, succMsgDuration);
				}
			}
			else if(!ZCUtil.isNull(ZCForm.callbackFunc))
			{
				relodCurrentForm = "true";
				ZCForm.callbackFunc(formLinkName, formAccessType, paramsMap, infoMsg, errorMsg, succMsg, succMsgDuration);
			}
			else if(relodCurrentForm == "falseRS") //For edit action in record summary live view
			{	
				closeDialog();
				ZCApp.showFadingMsg(succMsg, 0, relodCurrentForm == "falseRS"?1000:5000);
				var viewLinkName = ZCUtil.getFromMap(paramsMap, "viewLinkName");
				ZCView.refreshRecordSummaryView(viewLinkName);
				relodCurrentForm = "true";
			}

			// When a callback function is assigned (actually used in Zoho Sites) the callback function itself will take care of resetting the relodCurrentForm value
			if(ZCUtil.isNull(ZCForm.callbackFunc))
			{
				relodCurrentForm = "true";
			}
		}
		else
		{
			var options = "position=absmiddle, closeParent=false";//No I18N
			var headerMsg = i18n.headererrormsg;
			if(alertMsg == "" || alertMsg == undefined)
			{
				alertMsg = i18n.invalidmsg;
			}
			if(!this.zcFormAttributes['browseralert'])
			{
				if(paidUserFieldError == undefined)
				{
					headerMsg =  i18n.headererrormsg;
					if(typeof(alertMsg) == "object")
					{
						alertMsg = alertMsg[0];
						for(var msgtype in alertMsg) {
							var eachAlertMsg = alertMsg[msgtype];
							eachAlertMsg = eachAlertMsg.replace(new RegExp('\n','g'),"<br>");
							eachAlertMsg = eachAlertMsg.replace(new RegExp('#zc_amp#','g'),"&");

							ZCApp.showErrorDialog(headerMsg, eachAlertMsg, options);
						}
					}
					else
					{
						ZCApp.showErrorDialog(headerMsg, alertMsg, options);
					}
				}
				else
				{
					if(ZCApp.isAdmin == "true")
					{
							ZCApp.showUpgradeDialog(paidUserFieldError);
					}
					else
					{
							ZCApp.showErrorDialog(headerMsg, paidUserFieldError, options);
					}
				}
			}
			else
			{
				if(typeof(alertMsg) == "object")
				{
					alertMsg = alertMsg[0];
					for(var msgtype in alertMsg) {
						var eachAlertMsg = alertMsg[msgtype];
						eachAlertMsg = eachAlertMsg.replace(new RegExp('\n','g'),"<br>");
						eachAlertMsg = eachAlertMsg.replace(new RegExp('#zc_amp#','g'),"&");
						alert(eachAlertMsg);
					}
				}
				else
				{
					alert(alertMsg);
				}
			}

			ZCForm.resetCaptcha(formElem);
			if(paidUserFieldError == undefined)
			{
				ZCForm.showErrors(formLinkName, formAccessType, errMsg, null, fieldErrObj);
				if(!ZCUtil.isNull(infoMsg) || !ZCUtil.isNull(errorMsg)) ZCForm.showInfo(infoMsg, succMsg, formLinkName, formAccessType, errorMsg);
			}
		}

	}
	
	this.reloadFormView = function(formLinkName, formAccessType, paramsMap, infoMsg, errorMsg, succMsg, succMsgDuration)
	{
		var formParamsMap = ZCForm.formArr[formLinkName];
		var zc_EditType = ZCUtil.getFromMap(formParamsMap, "zc_EditType");
		var processPayment = ZCUtil.getFromMap(formParamsMap, "processPayment");

		if(formAccessType == ZCConstants.VIEW_ADD_FORM || formAccessType == ZCConstants.VIEW_EDIT_FORM)
		{
			if(formAccessType == ZCConstants.VIEW_EDIT_FORM && zc_EditType != "default")
			{
				ZCApp.showFadingMsg(succMsg, 0, 5000);
			}
			else
			{
				closeDialog();
                var viewParamsMap = ZCView.viewArr[ZCUtil.getFromMap(paramsMap, "viewLinkName")];
                if(ZCUtil.getFromMap(viewParamsMap, "viewType") == ZCConstants.VIEW_CALENDAR)
                {
                     if(formAccessType == ZCConstants.VIEW_EDIT_FORM)
                     {
                        var viewObject = ZCView.zc_calendar.fullCalendar('getView'); // No I18N
                        var viewType = ZCView.calDisplayType(viewObject.name);
                        ZCUtil.setInMap(viewParamsMap, "calViewType", viewType); // No I18N
                     }
                     else if(formAccessType == ZCConstants.VIEW_ADD_FORM)
                     {
                         var jsonStr = ZCUtil.getFromMap(formParamsMap, "dateJsonObject");  // No I18N
                         if(!ZCUtil.isNull(jsonStr))
                         {
                              jsonStr = jsonStr.replace(new RegExp('#zc_comma#','g'),",");
                              jsonStr = jsonStr.replace(new RegExp('&#034,','g'),"\"");
                              ZCUtil.setInMap(viewParamsMap, "dateJsonObject", jsonStr); // No I18N
                         }
                     }
                }
				ZCView.showView(viewParamsMap, succMsg, infoMsg, succMsgDuration, errorMsg);
			}
		}
		else if(!ZCUtil.isNull(processPayment) && processPayment==true)
		{
 			ZCUtil.removeFromMap(formParamsMap, "client");
			var params = ZCUtil.getParamsFromMap(formParamsMap);
			var args = "compLinkName="+formLinkName+"&formAccessType="+formAccessType+"&succMsg="+succMsg+"&compName=Form&compType="+ZCConstants.FORM;

			var infoMsgStr = ZCForm.convertInfoMsgObjToString(infoMsg);
			var paramsMap = ZCUtil.getParamsAsMap(args);
			paramsMap["infoMsg"]=new Array()
			paramsMap["infoMsg"][0] = infoMsgStr;
			paramsMap["errorMsg"]=new Array();
			paramsMap["errorMsg"][0] = errorMsg;

			var isInIFrame = (window.top!=window.self) ? true : false;
			if(isInIFrame)
			{
				//Harishankar - Due to cross domain permission denial, href of current window is taken instead of top window
				//params = params + "&zc_pmtRetUrl=" + encodeURIComponent(window.top.location.href);
				params = params + "&zc_pmtRetUrl=" + encodeURIComponent(window.location.href);
			}
			else
			{
				params = params + "&zc_pmtRetUrl=" + encodeURIComponent(window.location.href);
			}
			if(window.location.href.indexOf("/form-perma/")!= -1 || window.location.href.indexOf("/view-perma/")!= -1)
			{
				params = params + "&isPermaPage=true";
			}
			if(window.location.href.indexOf("/form-embed/")!= -1 || window.location.href.indexOf("/view-embed/")!= -1)
			{
				params = params + "&isPermaPage=true";
			}
			ZCUtil.sendRequest("/formpaymentprocess.do", params, "html", "ZCForm.loadForm", paramsMap,i18n.loadingmsg,false);

		}
		else
		{
			ZCForm.showForm(formLinkName, formAccessType, infoMsg, errorMsg, succMsg, succMsgDuration);
		}
	}

	this.getInfoMsgHtml = function(actInfoMsg, errorMsg)
	{
		infoMsg = actInfoMsg;
		if(typeof(infoMsg) == "object")
		{
			infoMsg = ZCForm.convertInfoMsgObjToString(infoMsg);
			actInfoMsg = infoMsg;
		}

		if(infoMsg != "" && infoMsg != undefined)
		{
			infoMsg = infoMsg.replace(new RegExp('\r\n','g'), "<br>");
            infoMsg = infoMsg.replace(new RegExp('\n','g'), "<br>");

            infoMsg = infoMsg.replace(/\\n|\\r/g,"<br />");
            infoMsg = infoMsg.replace(/\\t/g," ");
            infoMsg = infoMsg.replace(/\\\\/g,"@@@BSD@@@");
            infoMsg = infoMsg.replace(/\\/g,"");
            infoMsg = infoMsg.replace(/@@@BSD@@@/g,"\\\\");

            try {
            	infoMsg = JSON.parse(infoMsg);	// jshint ignore:line
            } catch (e) {}

			if (typeof(infoMsg) == "object")
			{
				//infoMsg comes as a json string assumption so we convert that to object and form an html
				var infoMsgHtml = "<table style='width:100%;' elname='errortable' border='0' cellpadding='0' cellspacing='0'><tbody>";

				var userInfoMsgObj = "";
				var infoHeaderMsgObj = "";
				for(var wfType in infoMsg)
				{
					var infoMsgMap = infoMsg[wfType];
					if(infoMsgMap["HeaderMsg"] != undefined)
					{
						userInfoMsgObj = infoMsgMap["UserMsgs"];
						infoHeaderMsgObj = infoMsgMap["HeaderMsg"];

						infoMsgHtml += "<tr><td valign='middle' class='zoho-black-small-text'><strong>"+infoHeaderMsgObj+"</strong></td></tr>";

						if(userInfoMsgObj != "")
						{
							infoMsgHtml += "<tr><td valign='middle' class='zoho-black-small-text'>";

							for(var msgtype in userInfoMsgObj) {
								var eachInfoMsg = userInfoMsgObj[msgtype];
								eachInfoMsg = eachInfoMsg.replace(new RegExp(ZCConstants.REPLACE_DQ_CHAR,'g'),"\"");
								infoMsgHtml += eachInfoMsg+"<br><br>";
							}

							infoMsgHtml += "</td></tr>";
						}
					}
				}
				if(errorMsg != "" && errorMsg != undefined)
				{
					infoMsgHtml += "<tr><td valign='middle' class='zoho-black-small-text'>" + errorMsg + "</td></tr>";
				}
				infoMsgHtml += "</tbody></table>";
				return infoMsgHtml;
			}
		}
		if(errorMsg != "" && errorMsg != undefined)
		{
			return errorMsg;
		}
		return actInfoMsg;
	}

	this.showInfo = function(infoMsg, succMsg, formLinkName, formAccessType, errorMsg)
	{
		var infoMsgHtml = ZCForm.getInfoMsgHtml(infoMsg, errorMsg);
		if (infoMsgHtml == "") return;

		var linkStr = (!ZCUtil.isNull(succMsg))?i18n.viewlogdetails:i18n.viewerrordetails; //No I18N
		var formElem = ZCForm.getForm(formLinkName, formAccessType);
		if(succMsg && succMsg != "" && formAccessType != ZCConstants.FORM_ALONE)
		{
			ZCUtil.showInDialog(ZCApp.dialogAbove+infoMsgHtml+ZCApp.dialogBelow, "closeButton=no");
			ZCUtil.removeInfoHdr();
		}
		else
		{
			var errLogTR = $(formElem).find("tr[elName='zc-errorLogAlert']");
			$(errLogTR).find("a[elName=errorLogAnc]").html(linkStr);
			$(errLogTR).show();
			$(errLogTR).children().children().unbind("click");
			$(errLogTR).children().children().click(function()
			{
				if(formAccessType != ZCConstants.FORM_ALONE || formAccessType == ZCConstants.VIEW_ADD_FORM || formAccessType == ZCConstants.VIEW_EDIT_FORM)
				{
					var ftable = $(formElem).find("table[elname='zc-formTable']");
					if(ftable.length == 0) {
						ftable = $(formElem).find("table[elname='zc-form2Table']");
					}
					if($(formElem).find("tr[elName=zc-infoMsgTag]")[0])
					{
						var hCorr = 12;
						$(formElem).find("tr").remove("[elName=zc-infoMsgTag]");
                                                                                                if(!isViewBeta)
                                                                                                {
                                                                                                    var hei = ftable.height();
                                                                                                    hei = hei + $('#_DIALOG_CONTENT').find("div[elname='zc-dialogheader']").height();
                                                                                                    $('#_DIALOG_CONTENT').height(hei + 12);
                                                                                                    var widnow = ftable.width();
                                                                                                    $('#_DIALOG_CONTENT').find("div[elname='zc-dialogheader']").width(widnow - 8);
                                                                                                }
					}
					else
					{
						var colValue = formElem.attr('colValue');
						var cspan = 2;
						if(colValue == '2') cspan = 3;
						var infoMsgTag = "<tr tag='eleErr'elName='zc-infoMsgTag'><td class='zc-form-errormsg' width='100%' height='100%' valign='top' text-align='left' colspan='" + cspan + "'>  "+infoMsgHtml+"</td></tr>";
						$(infoMsgTag).insertBefore(ZCUtil.getParent($(formElem).find(":input[elName='zc-submitformbutton']"), "tr"));

						var freezeLayerHeight = $('#FreezeLayer_1').height();

						var dialogLayerHeight = $('#_DIALOG_LAYER_1').height();
						var dialogLayerTop = $('#_DIALOG_LAYER_1').position().top;
						var totalHeight = dialogLayerHeight + dialogLayerTop;

						if(totalHeight > freezeLayerHeight)
						{
							$('#FreezeLayer_1').height(totalHeight);
						}
						$('#_DIALOG_CONTENT').height('auto');

						$('#_DIALOG_CONTENT').find("div[elname='zc-dialogheader']").width('auto');
					}

				}
				else
				{
					ZCUtil.showInDialog(ZCApp.dialogAbove+infoMsgHtml+ZCApp.dialogBelow, "closeButton=yes, width=500px");
					ZCUtil.removeInfoHdr();
					var widnow = $('#_DIALOG_CONTENT').find("table[elname='errortable']").width();
					if(widnow < 500) {
						widnow = 490;
					}
					$('#_DIALOG_CONTENT').find("div[elname='zc-dialogheader']").width(widnow);
				}
			});
		}
	}

	this.clearErrors = function(formEl)
	{
		$(formEl).find("tr[tag=eleErr], div[tag=eleErr]").remove();
		$(formEl).find("tr[elName=zc-errorLogAlert], div[elName=zc-errorLogAlert]").hide();
	}

	this.showErrors = function(formLinkName, formAccessType, errMsg, alertMsg, fieldErrObj,subFormLabelName)
	{
		var formElem = ZCForm.getForm(formLinkName, formAccessType);
		var formFooterElem = $(formElem).find("tr[elName=zc-errorLogAlert], div[elName=zc-errorLogAlert]");
		var colValue = formElem.attr('colValue');
		var cspan = 2;
		if(colValue == '2') cspan = 3;

		var eleErrTemplate = this.zcFormAttributes['eleErrTemplate'];
		eleErrTemplate = eleErrTemplate.replace("insertColSpan", cspan);

		if(!ZCUtil.isNull(alertMsg))
		{
			$(eleErrTemplate.replace("insertMessage", alertMsg)).insertBefore(formFooterElem);
		}
		if(!ZCUtil.isNull(errMsg))
		{
			$(eleErrTemplate.replace("insertMessage", errMsg)).insertBefore(formFooterElem);
		}
		if(typeof(fieldErrObj) == "object") {
			for(var eachInsideObj in fieldErrObj) {
				var eachElem = fieldErrObj[eachInsideObj];
				if(typeof(eachElem) == "object") {
					for(var eachElemName in eachElem) {
						var errorElem = eachElem[eachElemName];
						var fieldEl = ZCForm.getField(formLinkName, eachElemName , formAccessType,subFormLabelName);

						ZCForm.showFieldErr(fieldEl, errorElem, subFormLabelName);

						if(this.focusElement == "")
						{
							this.focusElement = fieldEl;
						}

					}
				}
			}
		}
	}

	this.showFieldErr = function(fieldEl, errMsg, subFormLabelName)
	{
		//Harishankar - calculate the number of columns in existing rows of the table and set that as the column span for the new row
		if($(fieldEl)[0])
		{
			if($(fieldEl).attr("type") == "radio" || ($(fieldEl).attr("type") == "checkbox" && $(fieldEl).attr("fieldtype") !=  9))
			{
				var optTbl = docid("opt-table-"+$(fieldEl).attr("formCompID"));
				fieldEl =  $(ZCUtil.getParent(optTbl, "span"));
			}

			var fieldRow = $(ZCUtil.getParent(fieldEl, "tr"));
			var noOfCols = fieldRow.children("td").size();//No I18N
			if(ZCUtil.isNull(subFormLabelName))
			{
				noOfCols = noOfCols + 1;
			}
			var errorTag = this.zcFormAttributes['eleErrTemplate'];
			errorTag = errorTag.replace("insertColSpan", noOfCols);
			errorTag = errorTag.replace("insertMessage", errMsg);
			errorTag = errorTag.replace("height='100%'", "height='25px'");
			$(errorTag).insertAfter(ZCUtil.getParent(fieldEl, this.zcFormAttributes['fieldContainer']));
		}
	}

	this.showHideCog = function(field, visibleStr, isRowAction)
	{
		if(this.inZohoCreator){

			if(isRowAction){

				$("#zc-rowaction-image").css("visibility", visibleStr);//No I18N
			}else{

				ZCUtil.getParent(field, "td[elName=zc-fieldtd],div[elName=zc-fieldtd]").find("img[elName=zc-onchange-image]").css("visibility", visibleStr);//No I18N
			}
		}
		else
		{
			//show the revolving image
		}
	}

	this.correctURL = function(zcNextUrl)
	{
		if(zcNextUrl.indexOf("ht" + "tp:") == 0)
		{
			var slashIdx = zcNextUrl.indexOf("/");
			var scheme = zcNextUrl.substr(0, slashIdx);
			if(zcNextUrl.charAt(slashIdx+1) != "/")
			{
				zcNextUrl = scheme + "//" + zcNextUrl.substr(slashIdx+1);
			}
		}
		return zcNextUrl;
	}

	this.showForm = function(formLinkName, formAccessType, infoMsg, errorMsg, succMsg, succMsgDuration)
	{
		var formParamsMap = ZCForm.formArr[formLinkName];
		var zcNextUrl = ZCUtil.getFromMap(formParamsMap, "zc_NextUrl");
		var zcSuccMsg = ZCUtil.getFromMap(formParamsMap, "zc_SuccMsg");
		var zcOpenUrlIn = ZCUtil.getFromMap(formParamsMap, "zc_OpenUrlIn");
		var zcLoadIn = ZCUtil.getFromMap(formParamsMap, "zc_LoadIn");
		var clientAction = ZCUtil.getFromMap(formParamsMap, "client");
		ZCUtil.setInMap(formParamsMap, "zc-mobile", ZCApp.isMobileSite);//No I18N
		succMsg = ZCUtil.isNull(zcSuccMsg)?succMsg:zcSuccMsg;
		if(!ZCUtil.isNull(succMsg) && succMsg != 'zc_success' && clientAction != "reset")
		{
			if(!ZCUtil.isNull(succMsgDuration))
			{
				succMsgDuration = succMsgDuration*1000;
				ZCApp.showFadingMsg(succMsg, 0, succMsgDuration);
			}
			else
			{
				ZCApp.showFadingMsg(succMsg, 0, 2000);
			}
		}

		if(!ZCUtil.isNull(zcNextUrl) && clientAction != "reset")
		{
			closeDialog();
			zcNextUrl = ZCForm.correctURL(zcNextUrl);
			if(zcLoadIn == "dialog" && zcNextUrl.indexOf("#Script:") != 0)
			{
				ZCApp.reloadZCComp(ZCUtil.getLinkName(zcNextUrl), ZCUtil.getParams(zcNextUrl));
				return false;
			}
			else
			{
				var timeout = (zcNextUrl.indexOf("#") == 0)?0:5000;
				ZCUtil.setURLInLocationBar(zcNextUrl, zcOpenUrlIn, timeout);
			}
		}
		else
		{
			var formCont = ZCForm.getFormCont(formLinkName, formAccessType);
 			ZCUtil.removeFromMap(formParamsMap, "client");
			var params = ZCUtil.getParamsFromMap(formParamsMap);
			var args = "compLinkName="+formLinkName+"&formAccessType="+formAccessType+"&succMsg="+succMsg+"&compName=Form&compType="+ZCConstants.FORM;

			var infoMsgStr = ZCForm.convertInfoMsgObjToString(infoMsg);
			var paramsMap = ZCUtil.getParamsAsMap(args);
			paramsMap["infoMsg"]=new Array()
			paramsMap["infoMsg"][0] = infoMsgStr;
			paramsMap["errorMsg"]=new Array();
			paramsMap["errorMsg"][0] = errorMsg;

			ZCUtil.sendRequest($(formCont).attr("formURL"), params, "html", "ZCForm.loadForm", paramsMap, i18n.loadingform);
		}
	}

	this.convertInfoMsgObjToString = function(infoMsg)
	{
		var infoMsgStr = "";
		var i = 0;
		if(infoMsg != "" && infoMsg != undefined)
		{
		for(var wfType in infoMsg)
		{
			if(wfType.length>0)
			{
				i++;
				if (i != 1)
				{
					infoMsgStr += ",";
				}
				infoMsgStr += "\""+wfType+"\":";

				var userInfoMsg = "{\"UserMsgs\":[";
				var infoHeaderMsg = "";

				var infoMsgMap = infoMsg[wfType];
				if(infoMsgMap["HeaderMsg"] != undefined)
				{
					var userInfoMsgObj = infoMsgMap["UserMsgs"];

					var userInfoMsgStrList = "";
					for(var msgtype in userInfoMsgObj) {
						if(msgtype > 0)
						{
							userInfoMsgStrList += ",";
						}
						var eachInfoMsg = userInfoMsgObj[msgtype];
						eachInfoMsg = eachInfoMsg.replace(new RegExp('"','g'),ZCConstants.REPLACE_DQ_CHAR);
						userInfoMsgStrList += "\""+eachInfoMsg+"\"";
					}

					userInfoMsg += userInfoMsgStrList;
					infoHeaderMsg += ",\"HeaderMsg\":\"";
					infoHeaderMsg += infoMsgMap["HeaderMsg"]+"\"}";
				}
				userInfoMsg += "]";

				infoMsgStr += userInfoMsg + infoHeaderMsg;
			}
		}
		if(infoMsgStr.length > 1)
		{
			infoMsgStr = "{" + infoMsgStr + "}";
		}

		while(infoMsgStr.indexOf("#zc_amp#")!= -1)
		{
			infoMsgStr=infoMsgStr.replace("#zc_amp#","&");
		}
		}
		return infoMsgStr;
	}

	this.loadForm = function(respTxt, paramsMap, argsMap)
	{
		var infoMsg = ZCUtil.getFromMap(argsMap, "infoMsg");
		var errorMsg = ZCUtil.getFromMap(argsMap, "errorMsg");
		var succMsg = ZCUtil.getFromMap(argsMap, "succMsg");
		var formLinkName = ZCUtil.getFromMap(argsMap, "compLinkName");
		var formAccessType = ZCUtil.getFromMap(argsMap, "formAccessType");
		ZCApp.loadZCComponent(respTxt, paramsMap, argsMap);
		if(!ZCUtil.isNull(infoMsg)|| !ZCUtil.isNull(errorMsg)) ZCForm.showInfo(infoMsg, succMsg, formLinkName, formAccessType, errorMsg);
	}

	this.changeImpMode = function(inputElem,elname)
	{
		var divElem =$("#zc-import-dialog");
		if($(inputElem).val() == "pastedata")
		{
			$(divElem).find("div[elName=impDataFileSec]").hide();
			$(divElem).find("div[elName=impPasteDataSec]").show();
			$(divElem).find("div[elName=fileExtension]").show();
			$(divElem).find("input[elName=headerRow]").prop("checked",false);
		}
		if($(inputElem).val() == "importfile")
		{
			$(divElem).find("div[elName=impPasteDataSec]").hide();
			$(divElem).find("div[elName=impDataFileSec]").show();
			$(divElem).find("div[elName=fileExtension]").hide();
			$(divElem).find("input[elName=headerRow]").prop("checked","checked");
		}
	}

	this.importData = function(formElem, formId)
	{
		if($(formElem).find("textarea[name=pData]").val() == '' && $(formElem).find("input[elName=writeDataRadio]").is(":checked"))
		{
			alert(i18n.pastedata);
			return false;
		}
		ZCUtil.sendRequest("/isFormBusy.do", "fid="+formId, "text", "ZCForm.submitImportForm", ZCUtil.setInMap(new Object(), "formElem", formElem), i18n.importing); //No I18N
	}

	this.submitImportForm = function(responseText, paramsMap, argsMap)
	{
		if(responseText == "true")
		{
			alertFormLiveBusy();
			return false;
		}

		var formElem = $("#zc-import-dialog").find("form[elName=zc-import-form]");
		$(formElem)[0].submit;
	}


	this.handleImportResp = function(respTxt, paramsMap, argsMap)
	{
	       var responseArr = ZCForm.getMsgFromResponse(respTxt,"");
	       var statusMsg = responseArr["statusMsg"];

	       if(statusMsg == "success")
		{
			closeDialog();
			var viewLinkName = ZCUtil.getFromMap(paramsMap, "viewLinkName");
			if(!ZCUtil.isNull(viewLinkName))
			{
				ZCView.showView(ZCView.viewArr[viewLinkName], i18n.successmsg);
			}
			else
			{
				ZCApp.showFadingMsg(i18n.successmsg, 0, 2000);
			}
		}
		else
		{
		        var errorMsg = responseArr["errorMsg"];
		        var errInfo =  responseArr["info"];
		        if(!ZCUtil.isNull(errorMsg))
		         {
		           alert(errorMsg);
		         }else if(!ZCUtil.isNull(errInfo))
		         {
		           alert(errInfo);
		         }else {
		           alert(i18n.dataerror);

		         }

		}
	}

	this.updateEmbedField = function(el, formLinkName) {
		var param = $(el).val().trim();
		if(paramValue!="") {
			if($(el).attr("elName").indexOf("Clr") != -1 && param.indexOf("#") == -1) {
					var colors = new Array("aqua","black","blue","fuchsia","gray","green","lime","maroon","navy","olive","purple","red","silver","teal","white","yellow");
					if("rgb" != (param.substr(0,3).toLowerCase()) && colors.indexOf(param.toLowerCase()) == -1) {
							param = "#" + param;
					}
			}

			if($(el).attr("elName").indexOf("Height") != -1 || $(el).attr("elName").indexOf("Width") != -1){
					if(param.indexOf("px") == -1 && param.indexOf("%") == -1){
									param = param + "px";					//No I18N
					}
			}


			var paramValue = param.replace("#", "_");
			paramValue = paramValue.replace("%", "_");
			if(ZCForm.custParams.indexOf($(el).attr("elName"))!=-1) {
				ZCForm.removeParam(el);
			}
			ZCForm.custParams = ZCForm.custParams + ZCForm.checkForAnd(ZCForm.custParams) + $(el).attr("elName") + "=" + paramValue;
			if($(el).attr("elName").indexOf('Clr') != -1) {
				$(el).css("background-color", param);
			}
		}
		else {
			if(ZCForm.custParams.indexOf($(el).attr("elName"))!=-1) {
				ZCForm.removeParam(el);
			}
		}
		ZCApp.resetEmbedParams(formLinkName);
	}

	this.removeParam = function(el) {
		var elemIndex = ZCForm.custParams.indexOf($(el).attr("elName"));
		var initial = ZCForm.custParams.substring(0, elemIndex);
		var temp = ZCForm.custParams.substring(elemIndex);
		var last = "";
		if(temp.indexOf("&")!=-1) {
			last = temp.substring(temp.indexOf("&")+1 , temp.length);
		}
		else {
			initial = initial.substring(0,initial.lastIndexOf("&"));
		}
		ZCForm.custParams = initial + last;
	}

	this.getEmbedParams = function(formLinkName) {
		var embediv = $('div[elName="zc-embed-dialog-div"]');
		var successmsg = $(embediv).find("input[elName=zc-successmsg]").val();
		var nexturl = $(embediv).find("input[elName=zc-nexturl]").val();
		nexturl = ((nexturl.substring(0, 3)).indexOf("www") != -1)?"ht" + "tp:" + "//"+nexturl:nexturl;
		var openinparent = $(embediv).find("input[elName=zc-openinparent]").is(":checked");
		var embedParams = ($(embediv).find("input[elName=zc-hidehdr]").is(":checked"))?"zc_Header=false":"";
		embedParams = ZCUtil.isNull(successmsg)?embedParams:embedParams+ ZCForm.checkForAnd(embedParams) +"zc_SuccMsg=" + successmsg;
		embedParams = ZCUtil.isNull(nexturl)?embedParams:embedParams+ ZCForm.checkForAnd(embedParams) +"zc_NextUrl="+nexturl;
		embedParams = ZCUtil.isNull(nexturl)?embedParams:(openinparent == true)?embedParams+"&zc_OpenUrlIn=parent":embedParams;
		if(ZCForm.custParams!=""&&embedParams!="") {
			embedParams = ZCForm.custParams + "&" + embedParams;
		}
		else {
			embedParams = ZCForm.custParams + embedParams;
		}
		return embedParams;
	}

	this.checkForAnd = function(checkVar) {
		var andifneed = checkVar!=""?"&":"";
		return andifneed;
	}

	this.showCustomize = function(el) {
		var embediv = $('div[elName="zc-embed-dialog-div"]');
		$(embediv).find("td[comElName=zc-embed-left-td]").attr("class", "zc-dialog-viewtypes-normal");
		$(embediv).find("table[comElName=zc-embed-table]").hide();
		$(el).attr("class", "zc-dialog-viewtypes-selected");
		var typestr = $(el).attr("elName");
		$(embediv).find("table[elName="+typestr+ "]").show();
	}

	this.alertFormLiveBusy = function()
	{
		alert(i18n.formulacalc);
	}

	this.toggleEmbedTag = function(el, selTab) {
		var tabTr = ZCUtil.getParent(el).find('td[comElName="zc-embed-crit-td"]');
		for(var i = 0; i<tabTr.length; i++) {
			$(tabTr[i]).attr("class", "zc-dialog-viewtypes-normal-tab");
		}
		$(el).attr("class", "zc-dialog-viewtypes-selected-tab");
		var tabTable = ZCUtil.getParent(el,"td").find('[comElName="zc-embed-crit-table"]');//No I18N
		for(var i = 0; i<tabTable.length; i++) {
			if(selTab.match($(tabTable[i]).attr("elName"))) {
				$(tabTable[i]).show();
			}
			else {
				$(tabTable[i]).hide();
			}
		}
	}

	this.toggleEmbedProps = function(el) {
		var tableElem = ZCUtil.getParent(el).find('table[elName="zc-embed-props-table"]');
		var imgElem = $(el).find('img')[0];
		if(tableElem[0].style.display=="none") {
			$(imgElem).attr("src", $(imgElem).attr("src").replace("show","hide"));
			$(tableElem[0]).show();
		}else {
			$(imgElem).attr("src", $(imgElem).attr("src").replace("hide","show"));
			$(tableElem[0]).hide();
		}
	}

	this.showImportDialog = function(formLinkName)
	{
                params = "";
                if(isViewBeta)
                {
                    params = "&isViewBeta=true";//No I18N
                }
		ZCUtil.sendRequest("/showImportDialog.do", "formLinkName="+formLinkName + params, "html", "ZCForm.loadImportDialog", "", i18n.pleasewait); //No I18N
	}

	this.loadImportDialog = function(respTxt, paramsMap)
	{
		closeDialog();
		ZCUtil.showDialog(respTxt, "false", "modal=yes, width=800px");	//No I18N
		//ZCUtil.showInDialog(respTxt, "closeButton=no, modal=yes, width=800px");	//No I18N
	}

	this.showImportError = function(zcErrMsg)
	{
		if(!ZCUtil.isNull(zcErrMsg))
		{
			var alertMsg = i18n.importerror;
			if(zcErrMsg == "NOFILE")
			{
				alertMsg = i18n.nofiletoimport;
			}
			else
			{
				if(zcErrMsg == "EMPTYFILE")
				{
					alertMsg = i18n.emptyfiletoimport;
				}
				else if(zcErrMsg == "FILETOOLARGE")
				{
					alertMsg = i18n.largefiletoimport + "\n" + i18n.uploadmore;	//No I18N
				}
			}
			alert(alertMsg);
		}
	}

	this.setImportMode = function(impModeEl)
	{
		var matchColsDiv = $("#ZC_IMPORTDATA_DIV").find("div[elName=UPDATE_ADD_DIV]");
		if($(impModeEl).val() == "UPDATE_ADD")
		{
			matchColsDiv.show();
		}
		else
		{
			matchColsDiv.hide();
			matchColsDiv.find(":input[type=checkbox]").prop("checked", false);	//No I18N
		}
	}

	this.toggleDataLoc = function(radioEl)
	{
		var radioVal = $(radioEl).val();
		var impDataDiv = $("#ZC_IMPORTDATA_DIV");
		if(radioVal == "PASTED_DATA")
		{
			impDataDiv.find("div[elName=WEBCLIENT_DIV]").show();
			impDataDiv.find("div[elName=PASTED_DATA_DIV]").show();
			impDataDiv.find("div[elName=LOCAL_DRIVE_DIV]").hide();
			impDataDiv.find("div[elName=MIGRATION_DIV]").hide();
			impDataDiv.find("div[elName=CLOUD_PICKER_DIV]").hide();
			impDataDiv.find("div[elName=GOOGLE_DOCS_DIV]").hide();
		}
		else if(radioVal == "CLOUD_PICKER")
		{
			impDataDiv.find("div[elName=WEBCLIENT_DIV]").show();
			impDataDiv.find("div[elName=PASTED_DATA_DIV]").hide();
			impDataDiv.find("div[elName=LOCAL_DRIVE_DIV]").hide();
			impDataDiv.find("div[elName=CLOUD_PICKER_DIV]").show();
			impDataDiv.find("div[elName=GOOGLE_DOCS_DIV]").hide();
			impDataDiv.find("div[elName=MIGRATION_DIV]").hide();
		}
		else if(radioVal == "GOOGLE_DOCS")
		{
			impDataDiv.find("div[elName=WEBCLIENT_DIV]").show();
			impDataDiv.find("div[elName=PASTED_DATA_DIV]").hide();
			impDataDiv.find("div[elName=LOCAL_DRIVE_DIV]").hide();
			impDataDiv.find("div[elName=CLOUD_PICKER_DIV]").hide();
			impDataDiv.find("div[elName=GOOGLE_DOCS_DIV]").show();
			impDataDiv.find("div[elName=MIGRATION_DIV]").hide();
		}
		else if(radioVal == "LOCAL_DRIVE")
		{
			impDataDiv.find("div[elName=WEBCLIENT_DIV]").show();
			impDataDiv.find("div[elName=PASTED_DATA_DIV]").hide();
			impDataDiv.find("div[elName=LOCAL_DRIVE_DIV]").show();
			impDataDiv.find("div[elName=MIGRATION_DIV]").hide();
			impDataDiv.find("div[elName=CLOUD_PICKER_DIV]").hide();
			impDataDiv.find("div[elName=GOOGLE_DOCS_DIV]").hide();
		}
		else if(radioVal == "MIGRATION")
		{
			impDataDiv.find("div[elName=PASTED_DATA_DIV]").hide();
			impDataDiv.find("div[elName=LOCAL_DRIVE_DIV]").hide();
			impDataDiv.find("div[elName=WEBCLIENT_DIV]").hide();
			impDataDiv.find("div[elName=MIGRATION_DIV]").show();
			impDataDiv.find("div[elName=CLOUD_PICKER_DIV]").hide();
			impDataDiv.find("div[elName=GOOGLE_DOCS_DIV]").hide();
		}
	}

	this.toggleScriptDiv = function()
	{
		var skipScriptDiv = $("#ZC_IMPORTDATA_DIV").find("div[elName=SKIP_SCRIPT_DIV]");
		if($(skipScriptDiv).css("display") == "none")
		{
			$(skipScriptDiv).show();
		}
		else
		{
			$(skipScriptDiv).hide();
		}
	}

	this.continueImport = function(formElem)
	{
		var goAhead = ZCForm.checkInputs(formElem);
		if(goAhead)
		{
			ZCApp.showLoading("zc-loading");	//No I18N
		}
		return goAhead;
	}

	this.checkInputs = function(formElem)
	{
		if($(formElem).find(":input[name=IMPORT_MODE]").val() == "UPDATE_ADD")
		{
			var noCol = true;
			$.each($(formElem).find("div[elName=UPDATE_ADD_DIV]").find(":input[name=UPDATE_ADD_COLS]"), function(idx, elem)
			{
				if($(elem).is(":checked"))
				{
					noCol = false;
				}
			});
			if(ZCUtil.isTrue(noCol))
			{
				alert(i18n.nofldtomatch);
				return false;
			}
		}
		if($(formElem).find(":input[elName=PASTED_DATA_RADIO]").is(":checked"))
		{
			if($(formElem).find(":input[name=PASTED_DATA]").val() == "")
			{
				alert(i18n.plzpastedata);
				return false;
			}
		}
		if($(formElem).find(":input[elName=GOOGLE_DOCS_RADIO]").is(":checked"))
		{
			if($(formElem).find(":input[name=GDOC_ID]").val() == "")
			{
				alert(i18n.nofiletoimport);
				return false;
			}
		}

		return true;
	}

	this.toggleFirstRow = function(radioEl)
	{
		var previewDiv = $("#ZC_IMPORTDATA_DIV").find("div[elName=ZCIMPORT_PREVIEW_DIV]");

		var hdrDataTR = $(previewDiv).find("tr[elName=ZCIMPORT_HDRDATA_TR]");
		var hasHdrTR = $(previewDiv).find("tr[elName=ZCIMPORT_HASHDR_TR]");
		var noHdrTR = $(previewDiv).find("tr[elName=ZCIMPORT_NOHDR_TR]");

		if(ZCUtil.isTrue($(radioEl).val()))
		{
			$(hdrDataTR).hide();
			$(noHdrTR).hide();
			$(hasHdrTR).show();
		}
		else
		{
			$(hdrDataTR).show();
			$(hasHdrTR).hide();
			$(noHdrTR).show();
		}
	}

	this.toggleCSVSettings = function()
	{
		var importDiv = $("#ZC_IMPORTDATA_DIV");
		var csvSettingsDiv = $(importDiv).find("div[elName=ZCIMPORT_CSVSETTINGS_DIV]");
		var refPrevMsgDiv = $(importDiv).find("div[elName=ZCIMPORT_PREVIEW_REFRESH_DIV]");

		if(ZCUtil.isHidden(csvSettingsDiv))
		{
			$(csvSettingsDiv).show();
		}
		else
		{
			$(csvSettingsDiv).hide();
		}
	}

	this.refreshPreview = function(formLinkName, fileName)
	{
		var importDiv = $("#ZC_IMPORTDATA_DIV");
		var csvSettingsDiv = $(importDiv).find("div[elName=ZCIMPORT_CSVSETTINGS_DIV]");

		var urlParams = "ZCACTION=PARSEFILE&formLinkName="+formLinkName+"&FILENAME="+fileName;	//No I18N
		urlParams += "&DELIMETER=" + $(csvSettingsDiv).find(":input[name=DELIMETER]").val();	//No I18N
		urlParams += "&HASFIELDNAMES="+$(importDiv).find(":input[elName=HASFIELDNAMES_RADIO]").is(":checked");	//No I18N
		urlParams += "&TEXT_QUALIFIER="+$(csvSettingsDiv).find(":input[name=TEXT_QUALIFIER]").val();	//No I18N
                urlParams += "&isViewBeta="+$(csvSettingsDiv).find(":input[name=isViewBeta]").val();	//No I18N

		var skipTopRows = $(csvSettingsDiv).find(":input[name=SKIP_TOP_ROWS]").val();	//No I18N
		if(!ZCUtil.isNull(skipTopRows))
		{
			urlParams += "&SKIP_TOP_ROWS="+skipTopRows;	//No I18N
		}
		var commentChar = $(csvSettingsDiv).find(":input[name=COMMENT_CHAR]").val();	//No I18N
		if(!ZCUtil.isNull(commentChar))
		{
			urlParams += "&COMMENT_CHAR="+commentChar;	//No I18N
		}

		ZCUtil.sendRequest("/importFormData.do", urlParams, "html", "ZCForm.reloadPreview", "", i18n.pleasewait); //No I18N
	}

	this.reloadPreview = function(respTxt)
	{
		$("#ZC_IMPORTDATA_DIV").find("div[elName=ZCIMPORT_PREVIEW_DIV]").html(respTxt);	//No I18N
	}

	this.fieldOnChange = function(selectEl)
	{
		var previewDiv = $("#ZC_IMPORTDATA_DIV").find("div[elName=ZCIMPORT_PREVIEW_DIV]");	//No I18N

		var colIndex = $(selectEl).attr("colIndex");
		var currFCLabelName = $(selectEl).val();

		var noHdrTRElem = $(previewDiv).find("tr[elName=ZCIMPORT_NOHDR_TR]");
		var hasHdrTRElem = $(previewDiv).find("tr[elName=ZCIMPORT_HASHDR_TR]");

		if(currFCLabelName == -1)
		{
			$(hasHdrTRElem).find(":checkbox:eq("+colIndex+")").prop("checked", false); //No I18N
			$(noHdrTRElem).find(":checkbox:eq("+colIndex+")").prop("checked", false); //No I18N
		}
		else
		{
			$.each($(previewDiv).find("select"), function(colIDX, currSelectEl)
			{
				if(currFCLabelName == $(currSelectEl).val())
				{
					var isChecked = (colIDX == colIndex);

					if(!ZCUtil.isTrue(isChecked))
					{
						$(currSelectEl).val(-1);
					}

					$(hasHdrTRElem).find(":checkbox:eq("+colIDX+")").prop("checked", isChecked);	//No I18N
					$(noHdrTRElem).find(":checkbox:eq("+colIDX+")").prop("checked", isChecked);	//No I18N
				}
			});
		}
	}

	this.checkColumn = function(checkBoxElem)
	{
		if(!ZCUtil.isTrue($(checkBoxElem).is(":checked")))
		{
			$("#ZC_IMPORTDATA_DIV").find("div[elName=ZCIMPORT_PREVIEW_DIV]").find("select:eq("+$(checkBoxElem).attr("colIndex")+")").val(-1);	//No I18N
		}
	}

	this.importFormData = function(formLinkName, importParamsJSON)
	{
		var importDiv = $("#ZC_IMPORTDATA_DIV");	//No I18N
		var previewDiv = $(importDiv).find("div[elName=ZCIMPORT_PREVIEW_DIV]");	//No I18N
		var labelTR = $(previewDiv).find("tr[elName=ZCIMPORT_LABEL_TR]");	//No I18N
		var hasFldNames = $(importDiv).find(":input[elName=HASFIELDNAMES_RADIO]").is(":checked");	//No I18N
		var headerTR = hasFldNames?$(previewDiv).find("tr[elName=ZCIMPORT_HASHDR_TR]"):$(previewDiv).find("tr[elName=ZCIMPORT_NOHDR_TR]");	//No I18N

		var importParams = "ZCACTION=IMPORT";	//No I18N
		importParams += "&formLinkName="+formLinkName;	//No I18N
		importParams += "&HASFIELDNAMES="+hasFldNames;	//No I18N
		importParams += "&DELIMETER="+$(importDiv).find(":input[name=DELIMETER]").val();	//No I18N
		importParams += "&TEXT_QUALIFIER="+$(importDiv).find(":input[name=TEXT_QUALIFIER]").val();	//No I18N
		importParams += "&SKIP_TOP_ROWS="+$(importDiv).find(":input[name=SKIP_TOP_ROWS]").val();	//No I18N
		importParams += "&ONIMPORTERROR="+$(importDiv).find(":input[name=ONIMPORTERROR]").val();	//No I18N
                importParams += "&isViewBeta="+$(importDiv).find(":input[name=isViewBeta]").val();	//No I18N

		var dateFormat = $(importDiv).find(":input[name=DATE_FORMAT]").val();	//No I18N
		if(!ZCUtil.isNull(dateFormat))
		{
			importParams += "&DATE_FORMAT="+dateFormat;	//No I18N
		}

		var commentChar = $(importDiv).find(":input[name=COMMENT_CHAR]").val();	//No I18N
		if(!ZCUtil.isNull(commentChar))
		{
			importParams += "&DATE_FORMAT="+commentChar;	//No I18N
		}

		var importSettings = ZCUtil.evalJSONObject(importParamsJSON);
		if(!ZCUtil.isNull(importSettings.FILENAME))
		{
            var passFile = importSettings.FILENAME;
            var filename = $(importDiv).find("select[name=SHEET_NAME]").val();
            if(filename != undefined)
            {
                passFile = filename;
            }
			importParams += "&FILENAME=" + encodeURIComponent(passFile);	//No I18N
		}
        var datetype = $(importDiv).find("select[name=DATE_TYPE]").val();
        if(!ZCUtil.isNull(datetype))
        {
            importParams += "&DATE_TYPE=" + datetype;	//No I18N
        }
		if(!ZCUtil.isNull(importSettings.IMPORT_MODE))
		{
			importParams += "&IMPORT_MODE=" + importSettings.IMPORT_MODE;	//No I18N
		}
		if(!ZCUtil.isNull(importSettings.SKIP_ONUPDATE))
		{
			importParams += "&SKIP_ONUPDATE=" + importSettings.SKIP_ONUPDATE;	//No I18N
		}
		if(!ZCUtil.isNull(importSettings.SKIP_ONSUBMIT))
		{
			importParams += "&SKIP_ONSUBMIT=" + importSettings.SKIP_ONSUBMIT;	//No I18N
		}
		if(!ZCUtil.isNull(importSettings.SKIP_ONCOMMIT))
		{
			importParams += "&SKIP_ONCOMMIT=" + importSettings.SKIP_ONCOMMIT;	//No I18N
		}
		if(!ZCUtil.isNull(importSettings.IMPORTSUBFORMDATA))
		{
			importParams += "&IMPORTSUBFORMDATA=" + importSettings.IMPORTSUBFORMDATA;	//No I18N
		}
		if(!ZCUtil.isNull(importSettings.MATCHING_COLUMNS))
		{
			var matchColsArr = ZCUtil.evalJSONArray(importSettings.MATCHING_COLUMNS);
			for(var colCount = 0; colCount < matchColsArr.length; colCount++)
			{
				importParams += "&MATCHING_COLUMNS=" + matchColsArr[colCount];
			}
		}
		var hasColsToImport = false;

		importParams += "&IMPORTCOLUMNS=<COLUMNS>"	//No I18N
		$.each($(headerTR).find(":input[type=checkbox]"), function(idx, hdrElem)
		{
			var delugeName = $(labelTR).find(":input:eq("+idx+")").val();
			var toImport = (ZCUtil.isTrue($(hdrElem).is(":checked")) && (delugeName != -1));
			if(ZCUtil.isTrue(toImport))
			{
				hasColsToImport = true;
			}
			importParams += "<COLUMN INDEX=\"" + (idx+1) + "\" DELUGENAME=\"" + delugeName + "\" IMPORT=\"" + toImport + "\" />";	//No I18N
		});
		importParams += "</COLUMNS>";	//No I18N

		if(hasColsToImport)
		{
			ZCUtil.sendRequest("/importFormData.do", importParams, "html", "ZCForm.loadImportDialog", "", i18n.importingmsg); //No I18N
		}
		else
		{
			alert(i18n.selcols4imp);
		}
	}

	this.showHideImportError = function(clickEl)
	{
		var errorTR = ZCUtil.getParent(clickEl, "table").find("tr[elName=ZCERRORDETAILS]");	// No I18N
		if(ZCUtil.isTrue($(clickEl).attr("showError")))
		{
			$(errorTR).show();
			$(clickEl).attr("showError", false);
			$(clickEl).html(i18n.hideimperrors);
		}
		else
		{
			$(errorTR).hide();
			$(clickEl).attr("showError", true);
			$(clickEl).html(i18n.showimperrors);
		}
	}

	this.closeImportDialog = function()
	{
		closeDialog();
		if(ZCUtil.getFromMap(ZCApp.compNameVsTypeMap, ZCApp.currZCComp) == ZCConstants.VIEW)
		{
			ZCView.showView(ZCView.viewArr[ZCApp.currZCComp]);
		}
	}

	//Included by Harishankar for Grid-view type subform
	//Gets invoked when the Add link is clicked for adding a new row
	this.createNewSubFormRow = function(el, isRowActionNeeded){
		var mainForm =  $(el).parents('form');
		var mainFormLinkName = $(mainForm).attr("name");
		var formParamsMap = ZCForm.formArr[mainFormLinkName];
		var formAccessType = ZCUtil.getFromMap(formParamsMap,"formAccessType");//No I18N

		var formElem =  $(el).parents('td[elname = subformtd]:first').find('div[elname = subformdiv]');
		var maxRows = $(formElem).attr("maxRows");
		if(maxRows == 0)
		{
			ZCApp.showErrorDialog(i18n.headererrormsg,i18n.cannoraddsubformrowmsg);
			return;
		}
		var subFormLabelName =  $(formElem).attr("name");
		$(formElem).find("tr[elName="+subFormLabelName+"_norecordrow]").css('display','none');
		//$("#"+subFormLabelName+"_addNewLine").css('display','');
		var name = $(formElem).attr("name");
		var formCompID = $(formElem).attr("formcompid");
		var nextRecordSequence = ZCUtil.isNull($(formElem).attr("nextRecordSequence"))?0:$(formElem).attr("nextRecordSequence");
		var newSequence = parseInt(nextRecordSequence) + 1;
		var formTable = $(formElem).find("table[elName='zc-subFormTable']");
		var className = $(formElem).find("tr[id='" + name + "_t::row']").attr("class");
		var dataRows = $(formElem).find("tr[elName=dataRow]");
		$.each($(dataRows),function(index,rowEl){
			$(rowEl).find("td").css("border-bottom","");
 		});

		var newRow = $(formElem).find("tr[id='" + name + "_t::row']").clone();
		$(newRow).attr("id",name + "-" + nextRecordSequence);
		$(newRow).show();
		$(newRow).find("td").css("border-bottom","none");
		$(formElem).attr("nextRecordSequence",newSequence);
		$(formTable).children("tbody").append(newRow);

		$(newRow).attr("reclinkid","");
		$(newRow).find(":input[id*='0'],:checkbox[id*='0'],:radio[id*='0'],:hidden[id*='0'],div[id*='0'],span[id*='0'],a[id*='0'],label[id*='0']").each(
			function(){
				$(this).attr("id",$(this).attr("id").replace("row_0","row_"+nextRecordSequence));
			}
		);
		$(newRow).find(":input[name*='0'],:checkbox[name*='0'],:radio[name*='0'],:hidden[name*='0'],div[name*='0'],span[name*='0'],a[name*='0'],label[name*='0']").each(
			function(){
				$(this).attr("name",$(this).attr("name").replace("row_0","row_"+nextRecordSequence));
			}
		);
		$(newRow).find("label[for*='0']").each(
			function(){
				$(this).attr("for",$(this).attr("for").replace("_0","_"+nextRecordSequence));
			}
		);
		$(newRow).find("a[labelName*='0'],:file[labelName*='0']").each(
			function(){
				$(this).attr("labelName",$(this).attr("labelName").replace("row_0","row_"+nextRecordSequence));
			}
		);
		$(newRow).find("span[rowNo*='0']").each(
				function(){
					$(this).attr("rowNo",nextRecordSequence);
				}
			);
		$(newRow).find(":input[rowLabelName*='0']").each(
				function(){
					$(this).attr("rowLabelName",$(this).attr("rowLabelName").replace("_0","_"+nextRecordSequence));
				}
			);
		$(newRow).find("div[compositename*='0']").each(
				function(){
					$(this).attr("compositename",$(this).attr("compositename").replace("_0","_"+nextRecordSequence));
				}
			);
		//Bind events to calendar and form elements in the new row
		$(newRow).find(":input[fieldType="+ZCConstants.DATE+"], :input[fieldType="+ZCConstants.DATE_TIME+"]").each(function()
		{
			var elID = $(this).attr("id");
			var buttonID = "dateButtonEl_"+elID.substr(elID.indexOf("_")+1);// No I18N
			var shTime = ($(this).attr("fieldType") == ZCConstants.DATE_TIME)?true:false;
			var format = shTime?ZCApp.dateFormat + " " + ZCConstants.TIME_FORMAT:ZCApp.dateFormat;
			ZCForm.setUpCalendar(elID, buttonID, format, shTime);
		});
		$(newRow).find(":input[type=radio], :input[type=checkbox]").click(function()
		{
			ZCForm.invokeOnChange(this, mainForm, formAccessType, formCompID);
		});
		$(newRow).find(":input[type!=hidden][type!=reset][type!=submit][type!=button][type!=radio][type!=checkbox]").change(function()
		{
			if($(this).attr("type") == "file")
			{
				$(this).attr("changed", "changed");
			}
			ZCForm.invokeOnChange(this, mainForm, formAccessType, formCompID);
		});
		$(newRow).find("span[elname=zc-show-parent]").click(function()
		{
					ZCForm.showLookupForm(this);
		});

		var randNum = Math.floor(Math.random() * 10000000);
		$(newRow).find("div[elName=zc-richtextarea]").each(function(index,elem){
			$(this).attr("nameoftextarea",$(this).attr("nameoftextarea").replace("0",nextRecordSequence));
			randNum = randNum+1;
			var defaultrow = $(formElem).find("tr[id='" + name + "_t::row']");
			var disable = $(defaultrow).find("div[elname=zc-richtextarea]").attr("disablerichtext");
			divID = randNum+"";
			$(elem).attr("id",divID);
			var divHeight = $(elem).attr("zc-editor-height");
			divHeight = divHeight.substring(0, divHeight.length-2);
			var textAreaElem = $(elem).parents("td").find("textarea[formcompid="+$(elem).attr("textAreaName")+"]");//No I18N
			var rteContent = $(textAreaElem).val();

			var toolsJson = $(textAreaElem).attr("zc-rtetToolsJson");//No I18N
			toolsJson =  (ZCUtil.isNull(toolsJson) ? "" : JSON.parse(toolsJson));//No I18N

			var fontSizeJson = $(textAreaElem).attr("zc-rtetFontJson");//No I18N
			fontSizeJson = (ZCUtil.isNull(fontSizeJson) ? "" : JSON.parse(fontSizeJson));//No I18N

			var fontFamilyJson = $(textAreaElem).attr("zc-rtetFontFamilyJson"); //No I18n
			fontFamilyJson = (ZCUtil.isNull(fontFamilyJson) ? "" : JSON.parse(fontFamilyJson));//No I18N

			var initObj = {id : divID, content : rteContent, editorheight : divHeight, toolbar : toolsJson, fontsize : fontSizeJson, fontfamily : fontFamilyJson};
			$(elem).html("");
			ZCForm.createRichTextEditor(divID,initObj);
			if((disable=="true"))
			{
				var freezdivid = "freezdiv_" + $(this).attr("textareaname");
				_editordiv = $("div[id=" + divID + "]");
				
				var _RTEditor = ZCForm.editorRef[divID];
				try
				{
					if(_RTEditor)
					{
						if(_RTEditor.mode == "plaintext")
						{
							$(_RTEditor._textarea).attr("disabled" , disable);
						}
						else
						{
							var _iframe = _RTEditor.iframe;
							var desMod = disable?"off":"on";
							var ieMod = disable?"false":"true";
							if(!($.browser.msie))
							{
								setTimeout(function(){_RTEditor.doc.body.contentEditable=ieMod}, 100);
								_RTEditor.doc.designMode = desMod;
							}
							else
							{
								setTimeout(function(){_RTEditor.doc.body.contentEditable=ieMod}, 100);
							}
						}
					}
				}
				catch(e4){}

				var _newdiv = document.createElement("div");
				_newdiv.className = "freezeLayer";
				_newdiv.id = freezdivid;
				
				var _map = {
						"left":"0",
						"top":"0",
						"height":"100%",
						"width":"100%",
						"zIndex":50,
						"background":"#AAAAAA",
						"border":"1px solid #AAAAAA"
					};
				$(_newdiv).css(_map);
				$(_editordiv).css("position","relative");
				_editordiv[0].appendChild(_newdiv);
			}
		});
		/* Lookup Search Reg-Event Starts */
		$(newRow).find("div[elName=srchDiv]").each(function(){
			$(this).attr("subFormRow",nextRecordSequence);
		});
		var paramsMap = ZCForm.formArr[mainFormLinkName];
		var formID = ZCUtil.getFromMap(paramsMap, "formID");
		searchFactory.regLookupSearchEvents(newRow,formID,formAccessType,mainForm);

		$(newRow).find("div[elName=srchDiv]").each(function(i,element){
			if($(element).attr("disable") == "true")
			{
				$(element).unbind();
			}
		});
		

		$(newRow).find("div[eleName=signature-field-subform]").each(function() {
	        	var signatureFieldObj = this;
	        	
				var signature = $(signatureFieldObj).find("div[eleName=signature]");
				
				$(signatureFieldObj).find("span[eleName=signatureClear]").click(function() {
					$(signature).jSignature("reset");
				});

				$(signature).jSignature({'decor-color': 'transparent', 'height':'100', 'width':'300'})
				$(signature).addClass("signature-div");  //No I18N
				
				var signatureEle = $(this).find("div[divName=signatureEle]");
				if($(signatureEle).attr("isHide") === "true")
				{
					$(signatureEle).hide();
				}
				
			});
		 
		/* Lookup Search Reg-Event Ends */

		if(isRowActionNeeded)
		{
		   ZCForm.invokeGridRowAction(formElem, mainForm, "t::row_" + nextRecordSequence, "onaddrow", formAccessType);
		}
		$(formElem).attr("maxRows",maxRows-1);
                if(!isViewBeta)
                {
                    resizeDialog($(mainForm).parents("div[id=_DIALOG_CONTENT]:first")); //No I18N
                }
	}
	//Included by Harishankar for Grid-view type subform
	//Gets invoked when the delete link is clicked for deleting a row
	this.deleteSubFormRow = function(deleteLinkElement){
		var parentTr = $(deleteLinkElement).parents('tr:first');
		var mainForm =  parentTr.parents('form');
		var mainFormLinkName = $(mainForm).attr("name");
		var formParamsMap = ZCForm.formArr[mainFormLinkName];
		var formAccessType = ZCUtil.getFromMap(formParamsMap,"formAccessType");//No I18N
		var recLinkId = parentTr.attr("reclinkid");// No I18N
		var formElem =  parentTr.parents('div[elname = subformdiv]');
                var maxRows = parseInt($(formElem).attr("maxRows"));
		var labelname = $(deleteLinkElement).attr('labelname');
		var str1 = "SF(" + $(formElem).attr("name") +").FD(";
		var str2 = ").SV(ID)";
		var rowID = labelname.split(str1)[1].split(str2)[0];

		if(!ZCForm.invokeGridRowAction(formElem, mainForm, rowID, "ondeleterow", formAccessType)){
			ZCForm.removeTR(mainForm, $(formElem).attr("name"), rowID);
		}
		$(formElem).attr("maxRows",maxRows+1);
                if(!isViewBeta)
                {
                    resizeDialog($(mainForm).parents("div[id=_DIALOG_CONTENT]:first"));
                }
	}

	this.removeTR = function(mainForm, subfrmCmpName, rowID){

		var formElem = mainForm.find('div[name='+ subfrmCmpName +']');
		var labelName = "SF(" + subfrmCmpName +").FD(" + rowID + ").SV(ID)";
		var deleteLinkElement = formElem.find("a[labelname='"+ labelName +"']");
		var parentTr = $(deleteLinkElement).parents('tr:first');
		var parentTable = $(parentTr).parents('table[elName=zc-subFormTable]');
		var noOfTrs = $(parentTable).find("tr[elName=dataRow]").length;
		if(noOfTrs-1 == 1)
		{
			$(parentTable).find("tr[elName="+subfrmCmpName+"_norecordrow]").css('display','');
		}
		var recLinkId = parentTr.attr("reclinkid");// No I18N
		/*if(recLinkId != null)
		{
			if(recLinkId.trim() != "")
			{
				$(parentTr).find(":input[elname=record_status]").attr("value","deleted");
				$(parentTr).css("display","none");
			}
			else
			{
				$(parentTr).remove();
			}
		}
		else
		{
			$(parentTr).remove();
		}*/
		$(parentTr).remove();
	}


    this.triggerExternalOnUser = function(exFldName)
    {
        try
        {
            if(exFldName == ExternalFieldName)
            {
                var ele = document.getElementById(exFldName);
                var onUserInput = ele.getAttribute("onChangeExists");
                var isformula=ele.getAttribute("isFormulaExist");
                var setdataatcell = ele.getAttribute("setdataatcell");
                if(onUserInput == "true" || isformula=="true")
                {
                    var formCompId = ele.getAttribute("formCompID");
                    var mainForm =  $(ele).parents('form');
                    var mainFormLinkName = $(mainForm).attr("name");
                    var formParamsMap = ZCForm.formArr[mainFormLinkName];
                    var formAccessType = ZCUtil.getFromMap(formParamsMap,"formAccessType");//No I18N
                    var formID  = ZCUtil.getFromMap(formParamsMap,"formID");
                    var formElem = ZCForm.getForm(mainFormLinkName, formAccessType);
                    if(onUserInput == "true")
                	{
                    	  onChangeScript(formElem,formID,formCompId);
                	}
                    if(isformula=="true")
                	{
                    	executeFormula(formElem,formID,formCompId);
                	}

                }
                else if(setdataatcell === "true")
                {
                	ZCSheetView.updateZohoCrmVal(exFldName);
                }
            }
            ExternalFieldName = '';
        }
        catch(e)
        {

        }
    }

	this.showhideFileUploadDiv = function(thisObj, showDiv)
	{
		var tableEl = $(thisObj).parents("[elName=zc-fieldtd]:first");
		if($(tableEl).find(":input[type=file]").attr("isAttached") == "true")
		{
			alert(i18n.alreadyfileuploaded);
			return;
		}
		$(tableEl).find("[zc-type=fileUpload-Div]").hide();
		$(tableEl).find("[zc-type=fileUpload-Div][elName="+ showDiv +"]").show();
		var elName = $(thisObj).attr("name");
		$(tableEl).find("[name="+ elName +"]").removeClass("selected");
		$(tableEl).find("[name="+ elName +"]").removeClass("normal");
		$(tableEl).find("[name="+ elName +"]").addClass("normal");
		$(thisObj).removeClass("normal").addClass("selected");
	}

	this.showhideImageDiv = function(thisObj, showDiv, labelName, type, isLocalImage)
	{
		var tableEl = $(thisObj).parents("[elName=zc-fieldtd]:first");

		if ($(tableEl).find("[name=zcimagetype-"+labelName+"],[subname=zcimagetype-"+labelName+"]").attr("disabled") == true)
		{
			return; // Image field is disabled
		}

		$(tableEl).find("[zc-type=imageUpload-Div]").hide();
		$(tableEl).find("[zc-type=imageUpload-Div][elName="+ showDiv +"]").show();
		var elName = $(thisObj).attr("name");
		$(tableEl).find("[name="+ elName +"]").removeClass("selected");
		$(tableEl).find("[name="+ elName +"]").removeClass("normal");
		$(tableEl).find("[name="+ elName +"]").addClass("normal");
		$(thisObj).removeClass("normal").addClass("selected");

		if(isLocalImage && type=='link')
		{
			$(tableEl).find("[name=zcsource-"+labelName+"]").val('');
			$(tableEl).find("[subname=zcsource-"+labelName+"]").val('');
		}

		if(isLocalImage && type=='local')
		{
			var iamgeval = $(tableEl).find("[name=zcsource-"+labelName+"]").attr('imagevalue');
			$(tableEl).find("[name=zcsource-"+labelName+"]").val(iamgeval);
			var subiamgeval = $(tableEl).find("[subname=zcsource-"+labelName+"]").attr('imagevalue');
			$(tableEl).find("[subname=zcsource-"+labelName+"]").val(subiamgeval);
		}
		if(type=='link')
		{
			$(tableEl).find("[name=zcimagetype-"+labelName+"]").val('1');
			$(tableEl).find("[subname=zcimagetype-"+labelName+"]").val('1');
		}
		else
		{
			$(tableEl).find("[name=zcimagetype-"+labelName+"]").val('2');
			$(tableEl).find("[subname=zcimagetype-"+labelName+"]").val('2');
		}

	}

	this.browseAttachEvent = function(thisObj)
	{
		$(thisObj).attr("zc-Attached-Type", "browse");
		$(thisObj).attr("zc-DocId","");
		$(thisObj).attr("isAttached","true");
		$(thisObj).parents("[elName=zc-fieldtd]:first").find("[elName=zc-Browse-FileAttach]").show();
	}
	this.googleDocAttachEvent = function(fileName, gDocId)
	{
		$("[isAttachOpen=true]:first").find("[elName=zc-GoogleDoc-FileName]").html(fileName);
		var El = $("[isAttachOpen=true]:first").find(":input[type=file]");
		$(El).attr("zc-Attached-Type", "google");
		$(El).attr("zc-DocId", gDocId);
		$(El).attr("isAttached","true");
		$(El).attr("changed", "changed");
		$(El).parent().html($(El).parent().html());
		$("[isAttachOpen=true]:first").find("[elName=zc-GoogleDoc-Button]").hide();
		$("[isAttachOpen=true]:first").find("[elName=zc-GoogleDoc-FileAttach]").show();
		ZCForm.closeDocsAttachTemplate();
	}
	this.isImport = false;
	this.cloudDocAttachEvent = function(docDetails, fileName)
	{
		if(this.isImport)
		{
			$("#cloudPickVal").val(docDetails);
			$("#cloudFileName").html(fileName);
			this.isImport = false;
		}
		else{
			$("[isAttachOpen=true]:first").find("[elName=zc-CloudDoc-FileName]").html(fileName);
			var El = $("[isAttachOpen=true]:first").find(":input[type=file]");
			$(El).attr("zc-Attached-Type", "cloud");
			$(El).attr("zc-DocId", docDetails);
			$(El).attr("isAttached","true");
			$(El).attr("changed", "changed");
			$("[isAttachOpen=true]:first").find("[elName=zc-CloudDoc-Button]").hide();
			$("[isAttachOpen=true]:first").find("[elName=zc-CloudDoc-FileAttach]").show();
		}
	}
	
	this.openCloudPickerForImport = function(thisObj)
	{
		this.isImport= true;
		var docDiv = $("<div id=\"zc-gadgets_cloudpicker_div\"></div>");
		docDiv.addClass("gadgets_cloudpicker_div");
		docDiv.css("z-index", "99");
		docDiv.append("<iframe class='gadgets_cloudpicker_iframe' style='' id='zc-file_attach_iframe' src='"+ clouddocurl +"'>")
		$("body").append(docDiv);
	}
	
	this.zohoDocAttachEvent = function(fileName, zDocId)
	{
		$("[isAttachOpen=true]:first").find("[elName=zc-ZohoDoc-FileName]").html(fileName);
		var El = $("[isAttachOpen=true]:first").find(":input[type=file]");
		$(El).attr("zc-Attached-Type", "zoho");
		$(El).attr("zc-DocId", zDocId);
		$(El).attr("isAttached","true");
		$(El).attr("changed", "changed");
		$(El).parent().html($(El).parent().html());
		$("[isAttachOpen=true]:first").find("[elName=zc-ZohoDoc-Button]").hide();
		$("[isAttachOpen=true]:first").find("[elName=zc-ZohoDoc-FileAttach]").show();
		ZCForm.closeDocsAttachTemplate();
	}

	this.openCloudAttachTemplate = function(thisObj)
	{
		$(thisObj).parents("[elName=zc-fieldtd]:first").attr("isattachopen", "true");
		var docDiv = $("<div id=\"zc-gadgets_cloudpicker_div\"></div>");
		docDiv.addClass("gadgets_cloudpicker_div");
		var cloudService = $(thisObj).attr('cloudService');
		var cloudPickUrl = fileCloudUrl.replace("=ZCCLOUD_OPT", "=" + cloudService);
		docDiv.append("<iframe class='gadgets_cloudpicker_iframe' style='' id='zc-file_attach_iframe' src='"+ cloudPickUrl +"'>")
		$("body").append(docDiv);	
	}
	
	this.openDocsAttachTemplate = function(thisObj)
	{
		$(thisObj).parents("[elName=zc-fieldtd]:first").attr("isattachopen", "true");
		var url = '';
		if($(thisObj).attr("zc-Doc-Type") == "zoho")
		{
			url = zohodocurl;
		}
		else if($(thisObj).attr("zc-Doc-Type") == "google")
		{
			url = googledocurl;
		}

		ZCUtil.showDialog("<iframe class='file_attach_iframe' id='zc-file_attach_iframe' src='"+ url +"'>", "false", "modal=yes");	//No I18N
		$(".file_attach_iframe").parents(".dialog-border:first").removeClass("dialog-border");
	}
	this.openImportGDocDialog = function()
	{
		$("#gFormName").attr("importOpen", true);
		ZCUtil.showDialog("<iframe class='file_attach_iframe' id='zc-file_attach_iframe' src='" + googlesheeturl + "'>", "false", "modal=yes");	//No I18N
		$(".file_attach_iframe").parents(".dialog-border:first").removeClass("dialog-border");
	}
	this.closeDocsAttachTemplate = function()
	{
		$("[isAttachOpen=true]").attr("isAttachOpen", "false");
		closeDialog();
	}
	this.removeUploadedFile = function(thisObj)
	{
		var tableEl = $(thisObj).parents("[elName=zc-fieldtd]:first");
		$(tableEl).find(":input[subtype=file]").attr("value","");
		$(tableEl).find(":input[type=file]").attr("zc-Attached-Type","browse");
		$(tableEl).find(":input[type=file]").attr("zc-DocId","");
		$(tableEl).find(":input[type=file]").attr("isAttached","false");
		$(tableEl).find(":input[type=file]").parent().html($(tableEl).find(":input[type=file]").parent().html());
		$(tableEl).find("[elName=zc-GoogleDoc-FileName]").html("");
		$(tableEl).find("[elName=zc-ZohoDoc-FileName]").html("");
		$(tableEl).find("[elName=zc-GoogleDoc-Button]").show();
		$(tableEl).find("[elName=zc-GoogleDoc-FileAttach]").hide();
		$(tableEl).find("[elName=zc-ZohoDoc-Button]").show();
		$(tableEl).find("[elName=zc-ZohoDoc-FileAttach]").hide();
		$(tableEl).find("[elName=zc-Browse-FileAttach]").hide();
		$(tableEl).find("[elName=zc-CloudDoc-Button]").show();
		$(tableEl).find("[elName=zc-CloudDoc-FileAttach]").hide();
		$(tableEl).find("[elName=zc-CloudDoc-FileName]").html("");
	}
}();