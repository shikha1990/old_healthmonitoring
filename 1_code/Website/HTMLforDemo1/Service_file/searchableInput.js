// $Id$
function searchVariables()
{
/**************** Common Form Variables ********************/
					this.formEl = null;
					this.formID = null;
					this.formAccessType = null;
					this.privateLink = null;
					this.viewPrivateLink = null;
					this.viewLinkName = null;
					this.childFormPrivateLink = null;
					this.childFormLinkName = null;

	/**************** Each Form Component Variables ********************/
					this.labelName = null;
					this.onChangeExists = false;
					this.isFormulaExist = false;
					this.fieldType = null;
					this.formCompId = null;
					this.nameOfInput = null;

	/**************** HTML Element Variables ********************/
					this.srchDiv = null;
					this.srchContDiv = null;
					this.srchInputDiv = null;
					this.srchValDiv = null;
					this.srchInput = null;

	/***************** SubForm Variables *************************/
					this.mainFormEl = null;
					this.isSubForm = false;
					this.recLinkID = null;
					this.subFormRow = null;
					this.subFormCompId = null;
					this.subFormId = null;
					this.subFormLabelName = null;

}

var searchFactory = new function()
{
	/**************** other Global Variables ********************/
	this.cacheMap = {};
	this.maxRows = 200;
	this.cacheThreshold = 100;
	this.delay = 1500;
	this.currentElement = 0;
	this.waitTime = 0;
	this.lastRequestSentTime;
	this.timeout;
	this.scrollPointToSendReq = 1200;
	this.isRequestCompleted = false;
	
	this.setVariables = function(srchEventClickEl,isSubForm)
	{
		
		var searchVariable = new searchVariables();
		
		for(key in searchVariable)
		{
			searchFactory[key]= searchVariable[key];
		}
		
		searchFactory.groupByColumnName = $(srchEventClickEl).attr("groupByColumnName"); // No I18N
		searchFactory.groupByTableName = $(srchEventClickEl).attr("groupByTableName"); // No I18N
		searchFactory.formLinkName = $(srchEventClickEl).attr("formLinkName"); // No I18N
		var paramsMap = ZCForm.formArr[searchFactory.formLinkName];
		searchFactory.formID = ZCUtil.getFromMap(paramsMap, "formID"); // No I18N
		searchFactory.formAccessType = ZCUtil.getFromMap(paramsMap, "formAccessType"); // No I18N
		searchFactory.formEl = ZCForm.getForm(searchFactory.formLinkName, searchFactory.formAccessType);
		searchFactory.privateLink = $(searchFactory.formEl).find(":input[name=privatelink]").val(); // No I18N
		searchFactory.viewPrivateLink = $(searchFactory.formEl).find(":input[name=viewPrivateLink]").val(); // No I18N
		searchFactory.childFormPrivateLink = $(searchFactory.formEl).find(":input[name=childFormPrivateLink]").val(); // No I18N
		searchFactory.viewLinkName = $(searchFactory.formEl).find(":input[name=viewLinkName]").val(); // No I18N
		searchFactory.childFormLinkName = $(searchFactory.formEl).find(":input[name=childFormLinkName]").val(); // No I18N

		searchFactory.labelName = $(srchEventClickEl).attr("labelName");
		searchFactory.onChangeExists = $(srchEventClickEl).attr("onChangeExists");
		searchFactory.isFormulaExist = $(srchEventClickEl).attr("isformulaexist");

		searchFactory.fieldType = $(srchEventClickEl).attr("fieldType");
		searchFactory.formCompId = $(srchEventClickEl).attr("formCompId");
		if(!isSubForm)
		{
			searchFactory.nameOfInput = searchFactory.labelName;
		}
		else
		{
			searchFactory.mainFormEl = searchFactory.formEl;
			searchFactory.isSubForm = isSubForm;
			searchFactory.subFormLabelName = $(srchEventClickEl).attr("subFormLabelName");
			searchFactory.subFormCompId = $(srchEventClickEl).attr("subFormCompId");
			searchFactory.subFormId = $(srchEventClickEl).attr("subFormId");
			searchFactory.subFormRow = $(srchEventClickEl).attr("subFormRow");
			searchFactory.recLinkID = $(srchEventClickEl).attr("recLinkID");
			if(searchFactory.fieldType == ZCConstants.SINGLE_SELECT || searchFactory.fieldType == ZCConstants.SYSTEM_LOOKUP)
			{
				searchFactory.nameOfInput = "SF("+searchFactory.subFormLabelName+").FD("+searchFactory.recLinkID+"_"+searchFactory.subFormRow+").SV("+searchFactory.labelName+")";//No I18N
			}
			else
			{
				searchFactory.nameOfInput = "SF("+searchFactory.subFormLabelName+").FD("+searchFactory.recLinkID+"_"+searchFactory.subFormRow+").MV("+searchFactory.labelName+")";//No I18N
			}
		}
		searchFactory.srchDiv = $(srchEventClickEl);
		searchFactory.srchContDiv = $(searchFactory.srchDiv).parents("td:first").find("div[elName=srchDivEl]");
		searchFactory.srchValDiv = $(searchFactory.srchContDiv).find("div[elName=srchValDiv]");
		searchFactory.srchInputDiv = $(searchFactory.srchContDiv).find("div[elName=srchInputDiv]");
		searchFactory.srchInput = $(searchFactory.srchInputDiv).find("input");
	}

	/*********************** Search Initializer **************************************/

	this.regLookupSearchEvents = function(formEl,formID,formAccessType,mainFormEl)
	{
		$(formEl).find("div[elName=srchDiv]").each(function()
		{
			var subFormLabelName = $(this).attr("subFormLabelName");
			var elType = $(this).attr("type");
			
			if($('#sysLookupSingleSrch').html() != undefined || (elType == "searchLookupSingle" && $(this).find("li").length == 0 && ZCUtil.isNull(mainFormEl)))
			{
				var selValWidth = $(this).width(); 
				if(ZCApp.isMobileSite)
				{
					selValWidth = "";
				}
				var valhtml = "";
				
				if(elType == "searchLookupSingle" && $(this).find("li").length == 0 && ZCUtil.isNull(mainFormEl))
				{
					valhtml = searchFactory.formatValueToShow($(this).parent("div:first").find("table").find("tr[value=-Select-]"), $(this).attr("name"), elType,selValWidth);
				}
				if($(this).attr("elemName") === "usersPicklist" && $(this).find("li").length === 0)
				{
					valhtml = searchFactory.formatValueToShow($(this).next().find("table").find("tr[value=-Select-]"), $(this).attr("name"), elType,selValWidth);
				}
				$(this).append(valhtml);
			}
			

			$(this).bind("click focus", function(event)
			{
				if(!ZCUtil.isNull(subFormLabelName))
				{
					searchFactory.setVariables(this,true);
				}
				else
				{
					searchFactory.setVariables(this,false);
				}
				searchFactory.triggerClickEvent(event);
			});
		});
	}
	this.triggerClickEvent = function(event)
	{
		if($(event.target).attr("elName") == "removeVal")
		{
			searchFactory.triggerRuleEvents();
			$(event.target).parent("li:first").remove();
			if($(searchFactory.srchDiv).find("li").length == 0)
			{
				$(searchFactory.srchDiv).find("span[elName=selectEl]").show();
			}
			var isFormulaExist = $(this).attr("isformulaexist")
			if(isFormulaExist == "true" && searchFactory.formAccessType != ZCConstants.VIEW_BULK_EDIT_FORM)
			{
				ZCForm.showHideCog(searchFactory.srchDiv, "visible");  // No I18N
				executeFormula(searchFactory.formEl, searchFactory.formID, searchFactory.formCompId, true);
			}
			var onChangeExists = $(this).attr("onChangeExists");
			if(onChangeExists == "true" && searchFactory.formAccessType != ZCConstants.VIEW_BULK_EDIT_FORM)
			{
				ZCForm.showHideCog(searchFactory.srchDiv, "visible");  // No I18N
				if(searchFactory.isSubForm)
				{
					onChangeSubFormScript(searchFactory.mainFormEl, searchFactory.formID, searchFactory.subFormCompId, searchFactory.formCompId, searchFactory.nameOfInput, searchFactory.formAccessType);
				}
				else
				{
					onChangeScript(searchFactory.formEl, searchFactory.formID, searchFactory.formCompId,searchFactory.formAccessType,true);
				}
			}
			return;
		}
		$("[elName=srchDivEl]").hide();
		if(searchFactory.getCache(searchFactory.nameOfInput) == undefined)
		{
			searchFactory.buildCache(searchFactory.nameOfInput);
		}
		else
		{
			if(searchFactory.getCache(searchFactory.nameOfInput).cacheData[""] == undefined)
			{
				searchFactory.setCache(searchFactory.nameOfInput, $(searchFactory.srchContDiv).find("div[elName=srchValDiv]").html(),"");
			}
		}
		searchFactory.bindEventHandlers(searchFactory.labelName);
		$(searchFactory.srchInput).val("");
		searchFactory.changeDivContentByCache(searchFactory.labelName,searchFactory.getCache(searchFactory.nameOfInput).cacheData[""]);
		searchFactory.getCache(searchFactory.nameOfInput).noOfRecords = $(searchFactory.srchValDiv).find("table").find("tr[elName=srchValtr][rowno != 0]").length;
		$(searchFactory.srchContDiv).show();
		$(searchFactory.srchValDiv).scrollTop(0);
		$(searchFactory.srchInput).focus();

		searchFactory.applyBrowserStyles();
		ZCApp.hideAndStopPropogation(event);
	}

	/*********************** Cache Management Methods **************************************/

	this.buildCache = function(labelName)
	{
			searchFactory.createCache(labelName);
			searchFactory.setCache(labelName, $(searchFactory.srchContDiv).find("div[elName=srchValDiv]").html(),"");
	}
	this.createCache = function(labelName)
	{
		if(searchFactory.getCache(labelName) == undefined)
		{
			var cache = {
				cacheData : {},
				cacheLength : 0,
				noOfRecords : 0
			};
			searchFactory.cacheMap[labelName] = cache;
		}
	}
	this.clearCache = function(labelName)
	{
		if(ZCUtil.isNull(labelName))
		{
			searchFactory.cacheMap = {};
		}
		else
		{
			if(searchFactory.getCache(labelName) != undefined)
			{
				searchFactory.getCache(labelName).cacheData = {};
			}
		}
	};
	this.getCache = function(labelName)
	{
		if(searchFactory.cacheMap[labelName])
		{
			return searchFactory.cacheMap[labelName];
		}
	}
	this.setCache = function(labelName, cache, keyVal)
	{
		if(searchFactory.getCache(labelName) != undefined)
		{
			if(searchFactory.getCache(labelName).cacheLength == searchFactory.cacheThreshold)
			{
				searchFactory.clearCache(labelName);
			}
			searchFactory.getCache(labelName).cacheData[keyVal] = cache;
			searchFactory.getCache(labelName).cacheLength = searchFactory.getCache(labelName).cacheLength + 1;
			searchFactory.getCache(labelName).noOfRecords = $(cache).find("tr[elName=srchValtr][rowno != 0]").length;
		}
	}
	/*********************** Event Handler Methods **************************************/

	this.bindEventHandlers = function(labelName)
	{
		$(searchFactory.srchInput).unbind("keyup");
		$(searchFactory.srchInput).unbind("keydown");
		$(searchFactory.srchInput).unbind("click");
		$(searchFactory.srchValDiv).unbind("scroll");
		$(searchFactory.srchInput).bind("keyup",function(e)
		{
			var keycode = e.keyCode;
			if(
				(keycode >= ZCConstants.KEYPAD_ZERO && keycode <= ZCConstants.KEYPAD_NINE) ||
				(keycode >= ZCConstants.APLPHABET_A && keycode <= ZCConstants.APLPHABET_Z) ||
				(keycode >= ZCConstants.NUMBERPAD_ZERO && keycode <= ZCConstants.NUMBERPAD_DECIMAL) ||
				(keycode >= ZCConstants.KEYPAD_SEMICOLON && keycode <= ZCConstants.KEYPAD_GRAVEACCENT) ||
				(keycode >= ZCConstants.KEYPAD_OPENBRACE && keycode <= ZCConstants.KEYPAD_SINGLEQUOTE) ||
				keycode == ZCConstants.BACKSPACE || keycode == ZCConstants.DELETE || keycode == ZCConstants.SPACE
			)
			{
				var searchValue = encodeURIComponent($.trim($(searchFactory.srchInput).val()));
				var isAvailable = searchFactory.isSearchValueInCache(labelName,searchValue);
				if(isAvailable)
				{
					var noOfFilteredValues = searchFactory.getFilterdRowsCount($(searchFactory.srchValDiv).find("table"));
					
					if(noOfFilteredValues < searchFactory.maxRows)
					{
						searchFactory.loadDataFromServer(searchValue,labelName,false);
					}
				}
				else
				{
					searchFactory.loadDataFromServer(searchValue,labelName,false);
				}
			}
		});
		$(searchFactory.srchInput).bind("keydown",function(e)
		{
			var keycode = e.keyCode;
			if(keycode == ZCConstants.DOWN)
			{
				searchFactory.currentElement++;
				searchFactory.moveElement(labelName,searchFactory.srchValDiv,keycode);
			}
			else if(keycode == ZCConstants.UP)
			{
				searchFactory.currentElement--;
				searchFactory.moveElement(labelName,searchFactory.srchValDiv,keycode);
			}
			/*else if(keycode == ZCConstants.PAGEUP)
			{
				$(searchFactory.srchValDiv).scrollTop(0);
				$(searchFactory.srchValDiv).find("table").find("tr[elName=srchValtr][class=zc-searchlookupselectvalue]").removeClass();
				$(searchFactory.srchValDiv).find("table").find("tr[elName=srchValtr]:first").addClass("zc-searchlookupselectvalue");
				searchFactory.currentElement = 1;
			}
			else if(keycode == ZCConstants.PAGEDOWN)
			{
				$(searchFactory.srchValDiv).scrollTop($(searchFactory.srchValDiv).attr("scrollHeight"));
				$(searchFactory.srchValDiv).find("table").find("tr[elName=srchValtr][class=zc-searchlookupselectvalue]").removeClass();
				$(searchFactory.srchValDiv).find("table").find("tr[elName=srchValtr]:last").addClass("zc-searchlookupselectvalue");
				searchFactory.currentElement = parseInt($(searchFactory.srchValDiv).find("table").find("tr[elName=srchValtr]:last").attr("rowNo"));
			}*/
			else if(keycode == ZCConstants.ENTER || (!e.shiftKey && keycode == ZCConstants.TAB))
			{
				searchFactory.selectValue($(searchFactory.srchValDiv).find("table"));

				if(searchFactory.isFormulaExist == "true" && searchFactory.formAccessType != ZCConstants.VIEW_BULK_EDIT_FORM)
				{
					ZCForm.showHideCog(searchFactory.srchDiv, "visible");//No I18N
					if(searchFactory.isSubForm)
					{
						executeFormulaforSubForm(searchFactory.mainFormEl, searchFactory.formID, searchFactory.subFormCompId, searchFactory.formCompId, searchFactory.nameOfInput, searchFactory.formAccessType, true)
					}
					else
					{
						executeFormula(searchFactory.formEl, searchFactory.formID, searchFactory.formCompId, true);
					}
				}

				if(searchFactory.onChangeExists == "true" && searchFactory.formAccessType != ZCConstants.VIEW_BULK_EDIT_FORM)
				{
					ZCForm.showHideCog(searchFactory.srchDiv, "visible");
					if(searchFactory.isSubForm)
					{
						onChangeSubFormScript(searchFactory.mainFormEl, searchFactory.formID, searchFactory.subFormCompId, searchFactory.formCompId, searchFactory.nameOfInput, searchFactory.formAccessType);
					}
					else
					{
						onChangeScript(searchFactory.formEl, searchFactory.formID, searchFactory.formCompId,searchFactory.formAccessType,true);
					}
				}
				if(searchFactory.fieldType == ZCConstants.SINGLE_SELECT || searchFactory.fieldType == ZCConstants.SYSTEM_LOOKUP)
				{
					$(searchFactory.srchContDiv).hide();
				}
				else
				{
					$(searchFactory.srchInput).focus();
				}
				if(keycode != ZCConstants.TAB)
				{
					return false;
				}
			}
			else if(keycode == ZCConstants.ESCAPE)
			{
				$(searchFactory.srchContDiv).hide();
				return false;
			}
			else if(!e.shiftKey && keycode == ZCConstants.TAB) 
			{ 
				$(searchFactory.srchContDiv).next().focus();
				$(searchFactory.srchContDiv).hide();
			}
			else if(e.shiftKey && keycode == ZCConstants.TAB) 
			{ 
				$(searchFactory.srchContDiv).prev().focus();
				$(searchFactory.srchContDiv).hide();
			}
		});
		$(searchFactory.srchInput).click(function(e)
		{
			ZCApp.hideAndStopPropogation(e);
		});
		$(searchFactory.srchValDiv).scroll(function(event){
			if($(searchFactory.srchValDiv).get(0).scrollHeight - $(searchFactory.srchValDiv).get(0).scrollTop < searchFactory.scrollPointToSendReq)
			{
				searchFactory.loadDataFromServer($(searchFactory.srchInput).val(), labelName, true);
			}
		});
	}
	this.rowEvents = function(trEl,labelName)
	{
		$(trEl).unbind("mouseover");
		$(trEl).unbind("click");
		$(trEl).mouseover(function(event)
		{
			$(searchFactory.srchValDiv).find("table").find("tr[elName=srchValtr][rowNo="+searchFactory.currentElement+"]").removeClass("zc-searchlookupselectvalue");
			searchFactory.currentElement = $(this).attr("rowNo");
			$(this).addClass("zc-searchlookupselectvalue");
		});
		$(trEl).click(function(event)
		{
			if(searchFactory.fieldType == ZCConstants.MULTI_SELECT)
			{
				$(searchFactory.srchInput).focus();
				ZCApp.hideAndStopPropogation(event);
			}
			var isAlreadySelected = searchFactory.checkIsAlreadySelected(this);
			if(isAlreadySelected)
			{
				//ZCApp.showErrorDialog(i18n.duplicateheader,i18n.alreadyselected);
				return;
			}
			var srchDivWidth = $(searchFactory.srchDiv).width();
			if(ZCApp.isMobileSite)
			{
				srchDivWidth = "";
			}
			var valhtml = searchFactory.formatValueToShow(this, null, searchFactory.fieldType,srchDivWidth);
			$(searchFactory.srchDiv).find("span[elName=selectEl]").hide();
			if(searchFactory.fieldType == ZCConstants.SINGLE_SELECT || searchFactory.fieldType == ZCConstants.SYSTEM_LOOKUP)
			{
				$(searchFactory.srchDiv).find("li").remove();
			}
			$(searchFactory.srchDiv).append(valhtml);

			if(searchFactory.isFormulaExist == "true" && searchFactory.formAccessType != ZCConstants.VIEW_BULK_EDIT_FORM)
			{
				ZCForm.showHideCog(searchFactory.srchDiv, "visible");//No I18N
				if(searchFactory.isSubForm)
				{
					executeFormulaforSubForm(searchFactory.mainFormEl, searchFactory.formID, searchFactory.subFormCompId, searchFactory.formCompId, searchFactory.nameOfInput, searchFactory.formAccessType, true);
				}
				else
				{
					executeFormula(searchFactory.formEl, searchFactory.formID, searchFactory.formCompId, true);
				}
			}
			
			searchFactory.triggerRuleEvents();
			if(searchFactory.onChangeExists == "true" && searchFactory.formAccessType != ZCConstants.VIEW_BULK_EDIT_FORM)
			{
				ZCForm.showHideCog(searchFactory.srchDiv, "visible");
				if(searchFactory.isSubForm)
				{
					onChangeSubFormScript(searchFactory.mainFormEl, searchFactory.formID, searchFactory.subFormCompId, searchFactory.formCompId, searchFactory.nameOfInput, searchFactory.formAccessType);
				}
				else
				{
					onChangeScript(searchFactory.formEl, searchFactory.formID, searchFactory.formCompId,searchFactory.formAccessType,true);
				}
			}
		});
	}
	this.moveElement = function(labelName,el,keycode)
	{
		var currentElem = $(searchFactory.srchValDiv).find("table").find("tr[elName=srchValtr][rowNo="+searchFactory.currentElement+"]");		
		var elemTop = currentElem.prop("offsetTop");
		var elemHeight = currentElem.prop("offsetHeight");
		if($(currentElem).val() == undefined)
		{
			searchFactory.currentElement = (keycode == ZCConstants.DOWN) ? searchFactory.currentElement-1: searchFactory.currentElement+1;
			if(keycode == ZCConstants.UP)
			{
				 $(el).scrollTop(0);
			}
			else
			{
				 $(el).scrollTop($(el).scrollTop() + $(el).height() + 10 );
			}
			return;
		}
		else if($(currentElem).css("display") == "none")
		{
			searchFactory.currentElement = (keycode == ZCConstants.DOWN) ? searchFactory.currentElement+1 : searchFactory.currentElement-1;
			searchFactory.moveElement(labelName,el,keycode);
			return;
		}
		
		$(searchFactory.srchValDiv).find("table").find("tr[elName=srchValtr][class=zc-searchlookupselectvalue]").removeClass("zc-searchlookupselectvalue");
		$(currentElem).addClass("zc-searchlookupselectvalue");
		
		if(keycode == ZCConstants.DOWN)
		{
			if(elemTop > $(el).height())
			{
				$(el).scrollTop($(el).scrollTop()+elemHeight);
			}
		}
		else
		{
			if(elemTop < $(el).scrollTop())
			{
				$(el).scrollTop($(el).scrollTop()-elemHeight);
			}
		}
	}
	/*************************** Change Div Content and Cache Methods***********************************/

	this.isSearchValueInCache = function(labelName,searchVal)
	{
		var isAvailable = false;
		var cacheForSearchVal =  searchFactory.getCache(searchFactory.nameOfInput).cacheData[searchVal];
		if(searchFactory.fieldType == ZCConstants.SYSTEM_LOOKUP)
		{
			searchFactory.changeDivContentByCache(labelName,cacheForSearchVal);
			isAvailable = true;
		}
		else
		{
			if(cacheForSearchVal)
			{
				searchFactory.changeDivContentByCache(labelName,cacheForSearchVal);
				isAvailable = true;
			}
			else
			{
				for(var i = searchVal.length - 1; i >= 1; i--)
				{
					cacheForSearchVal = searchFactory.getCache(searchFactory.nameOfInput).cacheData[searchVal.substring(0, i)];
					if(cacheForSearchVal)
					{
						searchFactory.changeDivContentByCache(labelName,cacheForSearchVal);
						isAvailable = true;
						break;
					}
				}
			}
		}
		return isAvailable;
	}

	this.loadDataFromServer = function(searchValue,labelName,isAppend)
	{
		var isImmutable = $(searchFactory.srchDiv).data('immutable');
		var url = "/LoadLookupValues.do"
		var date = new Date();
		var currentTime = date.getTime();
		var interval = currentTime - searchFactory.lastRequestSentTime;
		$(searchFactory.srchValDiv).find("table").find("tr[elName=noResultTr]").remove();
		if($(searchFactory.srchValDiv).find("table").attr("isSaturated") == "true" || !searchFactory.isRequestCompleted || isImmutable)
		{
			searchFactory.filterValues(searchValue);
			return;
		}
		searchFactory.lastRequestSentTime = currentTime;
		var params = "sharedBy="+ZCApp.sharedByDisp+"&searchValue=" +searchValue+"&formCompId="+searchFactory.formCompId+"&appnedRows="+isAppend+(!ZCUtil.isNull(searchFactory.groupByColumnName) ? "&groupByColumnName="+searchFactory.groupByColumnName : "")+(!ZCUtil.isNull(searchFactory.groupByTableName) ? "&groupByTableName="+searchFactory.groupByTableName : "")+"&noOfRecsInCache="+searchFactory.getCache(searchFactory.nameOfInput).noOfRecords+(!ZCUtil.isNull(searchFactory.subFormId) ? "&subFormId="+searchFactory.subFormId : ""); //NO I18N
		if(!ZCUtil.isNull(searchFactory.privateLink))
		{
			params = params + "&privateLink=" + searchFactory.privateLink;  // No I18N
		}
		/*if(searchFactory.formAccessType == ZCConstants.VIEW_ADD_FORM || searchFactory.formAccessType == ZCConstants.VIEW_EDIT_FORM || searchFactory.formAccessType == ZCConstants.VIEW_BULK_EDIT_FORM)
		{
			if(!ZCUtil.isNull(searchFactory.viewPrivateLink))
			{
				params = params + "&viewPrivateLink=" + searchFactory.viewPrivateLink;  // No I18N
			}
			if(!ZCUtil.isNull(searchFactory.viewLinkName))
			{
				params = params + "&viewLinkName=" + searchFactory.viewLinkName;  // No I18N
			}
		}
		if(searchFactory.formAccessType == ZCConstants.FORM_LOOKUP_ADD_FORM)
		{
			if(!ZCUtil.isNull(searchFactory.childFormPrivateLink))
			{
				params = params + "&childFormPrivateLink=" + searchFactory.childFormPrivateLink;  // No I18N
			}
			if(!ZCUtil.isNull(searchFactory.childFormLinkName))
			{
				params = params + "&childFormLinkName=" + searchFactory.childFormLinkName;  // No I18N
			}
		}*/
		params = params + "&formAccessType=" + searchFactory.formAccessType;  // No I18N
		params = params + "&" + cloneAndGetParams(this.formEl);
		if(this.recLinkID && this.subFormRow)
		{
			params = params + "&subFormRecID="+this.recLinkID+"_"+this.subFormRow+"&subFormLabelName="+this.subFormLabelName;//No I18N
		}
		if(searchFactory.fieldType == ZCConstants.SYSTEM_LOOKUP)
		{
			params = params+"&labelName="+labelName+"&fType="+searchFactory.fieldType;
		}
		var args = params+"&labelName="+labelName+"&nameOfInput="+searchFactory.nameOfInput;  // No I18N
		$(searchFactory.srchDiv).parents("td:first").find("img[elName=zc-onchange-image]").css("visibility", "visible");  // No I18N
		if(interval < searchFactory.delay)
		{
			if(interval <= searchFactory.waitTime)
			{
				clearTimeout(searchFactory.timeout);
				searchFactory.waitTime = searchFactory.waitTime - interval;
			}
			else
			{
				searchFactory.waitTime = (searchFactory.waitTime - interval) + searchFactory.delay ;
			}
		}
		$(searchFactory.srchValDiv).find("table").append(searchFactory.getStatusMessage("Loading ..."));
		searchFactory.timeout = setTimeout("ZCUtil.sendRequest(\""+url+"\",\""+params+"\","+null+",\"searchFactory.loadValuesToCache\",\""+args+"\","+null+","+true+")", searchFactory.waitTime);
		searchFactory.isRequestCompleted = false;
	}
	this.loadValuesToCache = function(response, paramsMap, args)
	{
		var argsMap = ZCUtil.getParamsAsMap(args);
		var searchValue = argsMap["searchValue"];
		var labelName = argsMap["labelName"];
		var isAppend = argsMap["appnedRows"];
		var noOfRecsInCache = argsMap["noOfRecsInCache"];
		var nameOfInput = argsMap["nameOfInput"];
		$(searchFactory.srchDiv).parents("td:first").find("img[elName=zc-onchange-image]").css("visibility", "hidden");  // No I18N
		if(isAppend == "true")
		{
			responsenew = "<tbody>"+ response +"</tbody>";
			searchFactory.getCache(nameOfInput).noOfRecords = searchFactory.getCache(nameOfInput).noOfRecords + $(responsenew).find("tr[elName=srchValtr][rowno != 0]").length;
			if($(responsenew).find("tr[elName=srchValtr]").length < searchFactory.maxRows)
			{
				$(searchFactory.srchValDiv).find("table").attr("isSaturated","true");
			}
		}
		else
		{
			searchFactory.setCache(nameOfInput, response, searchValue);
		}
		$(searchFactory.srchValDiv).find("table").find("tr[elName=noResultTr]").remove();
		searchFactory.changeDivContentByCache(labelName, response,isAppend);
	}
	this.changeDivContentByCache = function(labelName,cache,isAppend)
	{
		if(isAppend == "true")
		{
			$(searchFactory.srchValDiv).find("table").append(cache);
			searchFactory.applyStyleToValuesFromServer();
			searchFactory.rowEvents($(searchFactory.srchValDiv).find("table").find("tr[elName=srchValtr]"), labelName);
			searchFactory.filterValues(currentInputVal);
			searchFactory.isRequestCompleted = true;
			return;
		}
		var currentInputVal = $(searchFactory.srchInput).val();
		$(searchFactory.srchValDiv).html(cache);
		searchFactory.applyStyleToValuesFromServer();
		searchFactory.rowEvents($(searchFactory.srchValDiv).find("table").find("tr[elName=srchValtr]"),labelName);
		searchFactory.rearrangeRows(currentInputVal);
		searchFactory.currentElement = 0;
		if(currentInputVal != "")
		{
			searchFactory.filterValues(currentInputVal);
		}
		searchFactory.isRequestCompleted = true;
	}

	/****************************** Util Methods ****************************************/
	this.filterValues = function(searchVal)
	{
		if(ZCUtil.isNull(searchVal))
		{
			return;
		}
		var isAnyValMatch = false;
		searchVal = decodeURIComponent(searchVal);
		var userRegex = new RegExp(searchVal,'i'); // No I18n
		var listValues = $(searchFactory.srchValDiv).find("table").find("tr[elName=srchValtr][rowno != 0]"); //No I18N
		$(searchFactory.srchValDiv).find("table").find("tr[elName=srchValtr][rowno=0]").hide(); //No I18N
		for(var i=0;i<listValues.length;i++)
		{
			var listValue = $(listValues[i]);
			var showVal = $(listValue).find("td").html();
			showVal= showVal.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"');
			if(userRegex.test(showVal))
			{
				//$(listValue).find("td").html(showVal.replace(new RegExp(searchVal,'gi'), "<font style='color:blue; background-color:yellow;'>"+searchVal+"</font>"));
				$(listValue).show();
				if(!isAnyValMatch)
				{
					$(searchFactory.srchValDiv).find("table").find("tr[class=zc-searchlookupselectvalue]").removeClass("zc-searchlookupselectvalue");  // No I18N
					$(listValue).addClass("zc-searchlookupselectvalue");
					searchFactory.currentElement = $(listValue).attr("rowNo") ;
				}
				isAnyValMatch = true;
			}
			else
			{
				$(listValue).hide();
			}
		}
		if(!isAnyValMatch)
		{
			$(searchFactory.srchValDiv).find("table").append(searchFactory.getStatusMessage("No results found"));
		}
	}
	this.getFilterdRowsCount = function(tableEl)
	{
		var count = 0;
		var rows = $(tableEl).find("tr"); //No I18N
		for(var i=0;i<rows.length;i++)
		{
			var eachRow = $(rows[i]);
			if($(eachRow).css("display")!='none')
			{
				count++;
			}
		}
		return count;
	}
	this.selectValue = function(tableEl)
	{
		var rows = $(tableEl).find("tr"); //No I18N
		for(var i=0;i<rows.length;i++)
		{
			var eachRow = $(rows[i]);
			if($(eachRow).prop("class") != '')
			{
				var isAlreadySelected = searchFactory.checkIsAlreadySelected(eachRow);
				if(isAlreadySelected)
				{
					//ZCApp.showErrorDialog(i18n.duplicateheader,i18n.alreadyselected);
					return;
				}
				var valHtml = searchFactory.formatValueToShow(eachRow, null,searchFactory.fieldType,$(searchFactory.srchDiv).width());
				$(searchFactory.srchDiv).find("span[elName=selectEl]").hide();
				if(searchFactory.fieldType == ZCConstants.SINGLE_SELECT || searchFactory.fieldType == ZCConstants.SYSTEM_LOOKUP)
				{
					$(searchFactory.srchDiv).find("li").remove();
				}
				$(searchFactory.srchDiv).append(valHtml);
				break;
			}
		}
	}
	this.formatValueToShow = function(trEl,nameFromScript, fType, divWidth, fieldValueFromScript, combinedValueFromScript)
	{
		var showVal = ZCUtil.isNull(fieldValueFromScript) ? $(trEl).find("td").text() : fieldValueFromScript;
		var origVal = ZCUtil.isNull(fieldValueFromScript) ? $(trEl).attr('value') : fieldValueFromScript;
		var name= ZCUtil.isNull(nameFromScript) ? searchFactory.nameOfInput : nameFromScript;
		if(fType == "searchLookupSingle")
		{
			fType = ZCConstants.SINGLE_SELECT;
		}
		if(ZCUtil.isNull(combinedValueFromScript))
		{
			combinedValueFromScript = showVal;
		}

		var singleSelTruncateStyle = "style=\"display:block;overflow:hidden;width:"+(divWidth - 17)+"px;\"";  //No I18N
			
		if(newGenerateJsCodeEnabled &&  !ZCUtil.isNull(fieldValueFromScript))
		{
            var liHtml= $("<li></li>");
            liHtml.attr('class',"search-selected-val "+(fType == ZCConstants.SINGLE_SELECT || fType == ZCConstants.SYSTEM_LOOKUP ? "" : "search-selected-val-multi"));
            liHtml.attr('selValue',origVal);

            liHtml.append(fType == ZCConstants.SINGLE_SELECT ? "" : "<span elName=\"removeVal\" class=\"search-selected-val-del\"></span>");

            var spanHtml= $("<span elname='inputVal'" + (fType == ZCConstants.SINGLE_SELECT || fType == ZCConstants.SYSTEM_LOOKUP ? singleSelTruncateStyle : "") +" ></span>");
            spanHtml.attr('title',combinedValueFromScript);
            /*if($(combinedValueFromScript).is('span'))
        	{
            	combinedValueFromScript = $(combinedValueFromScript).text();
        	}*/
            spanHtml.text(combinedValueFromScript);

            liHtml.append(spanHtml);

            var inpHtml = $("<input type='hidden'/>");
            inpHtml.attr('name',name);
            inpHtml.attr('value',origVal);

            liHtml.append(inpHtml);
            return liHtml;
		
		}
		else
		{
			var titleVal = combinedValueFromScript.replace(/"/g, "'");
			var showHtml = "<li class=\"search-selected-val "+(fType == ZCConstants.SINGLE_SELECT ? "" : "search-selected-val-multi")+"\" selValue=\""+origVal+"\" >"+(fType == ZCConstants.SINGLE_SELECT ? "" : "<span elName=\"removeVal\" class=\"search-selected-val-del\"></span>")+"<span title=\""+titleVal+"\" elname=\"inputVal\" "+ (fType == ZCConstants.SINGLE_SELECT ? singleSelTruncateStyle : "") +">"+combinedValueFromScript+"</span>";
			if(fType == ZCConstants.SYSTEM_LOOKUP)
			{
				showHtml = "<li class=\"search-selected-val "+(fType == ZCConstants.SYSTEM_LOOKUP ? "" : "search-selected-val-multi")+"\" selValue=\""+origVal+"\" >"+(fType == ZCConstants.SYSTEM_LOOKUP ? "" : "<span elName=\"removeVal\" class=\"search-selected-val-del\"></span>")+"<span title=\""+titleVal+"\" elname=\"inputVal\" "+ (fType == ZCConstants.SYSTEM_LOOKUP ? singleSelTruncateStyle : "") +">"+combinedValueFromScript+"</span>";
			}
			var inpHtml = "<input type=\"hidden\" name=\""+name+"\" value=\""+origVal+"\"/></li>";
			return (showHtml+""+inpHtml);
		}
		
	} 

	this.getStatusMessage = function(status)
	{
		var statusHTML = "<tr value=\"-1\" elName=\"noResultTr\"><td><div class=\"no-search-val-div\">"+status+"</div></td></tr>";
		return statusHTML;
	}
	this.checkIsAlreadySelected = function(trEl)
	{
		var isAlreadySelected = false;
		var selectedValue = $(trEl).attr('value');
		$(searchFactory.srchDiv).find("input").each(function(index, el){
			var valueAlreadySelected = $(el).val();
			if(selectedValue == valueAlreadySelected)
			{
				isAlreadySelected = true;
			}
		});
		return isAlreadySelected;
	}
	this.applyStyleToValuesFromServer = function()
	{
		if(searchFactory.isSubForm)
		{
			$(searchFactory.srchValDiv).find("table").find("td").each(function(index,el){
				$(el).addClass("resetGridClass");
			});
		}
	}
	this.applyBrowserStyles = function()
	{
		if($.browser.msie )
		{
			var maxHeightOfValuesDiv = 269;
			var currentHeight = $(searchFactory.srchValDiv).outerHeight();
			var newHeight = currentHeight > maxHeightOfValuesDiv ? maxHeightOfValuesDiv : currentHeight;
			$(searchFactory.srchValDiv).height(newHeight);
		}
		if (ZCApp.isMobileSite)
		{
			var srchDivWidth = $(searchFactory.srchDiv).outerWidth();
			$(searchFactory.srchInputDiv).width(srchDivWidth-8);
			$(searchFactory.srchValDiv).width(srchDivWidth-8);
			$(searchFactory.srchInput).width(srchDivWidth-30);
		}
	}
	this.rearrangeRows = function(searchVal)
	{
		searchVal = decodeURIComponent(searchVal);
		var rows = $(searchFactory.srchValDiv).find("table").find("tr[elName=srchValtr][rowno != 0]"); //No I18N
		$(searchFactory.srchValDiv).find("table").find("tr[elName=srchValtr][rowno != 0]").remove();
		var startsWithRegex = new RegExp("^"+searchVal,'i'); // No I18n
		var containsRegex = new RegExp(searchVal,'i'); // No I18n
		for(var i=0;i<rows.length;i++)
		{
			var eachRow = $(rows[i]);
			var showVal = $(eachRow).find("td").html();
			showVal= showVal.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"');
			if(startsWithRegex.test(showVal))
			{
				$(searchFactory.srchValDiv).find("table").append(eachRow);
			}
		}
		for(var i=0;i<rows.length;i++)
		{
			var eachRow = $(rows[i]);
			var showVal = $(eachRow).find("td").html();
			showVal= showVal.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"');
			if(!startsWithRegex.test(showVal) && containsRegex.test(showVal))
			{
				$(searchFactory.srchValDiv).find("table").append(eachRow);
			}
		}
		for(var i=0;i<rows.length;i++)
		{
			var eachRow = $(rows[i]);
			var showVal = $(eachRow).find("td").html();
			showVal= showVal.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"');
			if(!startsWithRegex.test(showVal) && !containsRegex.test(showVal))
			{
				$(eachRow).hide();
				$(searchFactory.srchValDiv).find("table").append(eachRow);
			}
		}
		searchFactory.rowEvents($(searchFactory.srchValDiv).find("table").find("tr[elName=srchValtr]"));
	}
	
	this.triggerRuleEvents = function()
	{
		if(window.RuleEvents !== undefined && window.RuleEvents[searchFactory.formLinkName] !== undefined && window.RuleEvents[searchFactory.formLinkName][searchFactory.labelName] !== undefined)
		{
			window.RuleEvents[searchFactory.formLinkName][searchFactory.labelName]();
		}
	}
}

