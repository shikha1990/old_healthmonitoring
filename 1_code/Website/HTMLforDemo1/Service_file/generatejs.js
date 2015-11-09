/*$Id$*/

var genScriptURL= "/generateJS.do";
var form_element = new Array();
var relodCurrentForm = "true";
var viewLogPreviousValue = "";
var reloadCurrView = true;
//Harishankar - Used during payment callback for handling redirection logic - variable to indicate if openWindowTask has been executed
var isOpenWindowTaskExec = false;
var newGenerateJsCodeEnabled=false;
var isRecursionInGenJSAllowed=true;


var ZCNewGenerateJsTask=new function(){
	   
    this.executeTask=function(result,paramsMap){
    	for(var i=0;i<result.length;i++)
    		{
    			var taskObj=result[i];
    			var recType=ZCUtil.getFromMap(paramsMap, "recType");
    			if((taskObj.compType == 12 || taskObj.compType == 13 || taskObj.compType == 29) && (!taskObj.fieldValue) && (taskObj.task == ZCConstants.SET_VALUE || ZCConstants.APPEND_VALUE))
				{
    				taskObj.fieldValue="";
				}
    			if(taskObj.subFormName!=null)
    			{
    				subFormFieldJSTask(taskObj.task, taskObj.formName, taskObj.subFormName, taskObj.fieldValue, taskObj.rowNo, taskObj.fieldName, taskObj.compType, 99, recType, taskObj.combinedValue,taskObj.isAppend);
    			}
    			else
    			{
    				switch(taskObj.task)
	        		{
	        				case ZCConstants.RELOAD:
	        					reloadForm(taskObj.formName,recType);
	        					break;
	        				case ZCConstants.CLEAR:
	    	    				clearComponent(taskObj.formName, taskObj.fieldName, recType);
	    	    				break;
	    	    			case ZCConstants.HIDE:
	    	    				hideComponent(taskObj.formName,taskObj.fieldName, recType);
	    	    				break;
	    	    			case ZCConstants.SHOW:
	    	    				showComponent(taskObj.formName, taskObj.fieldName, recType);
	    	    				break;
	    	    			case ZCConstants.ENABLE:
	    	    				enableComponent(taskObj.formName,taskObj.fieldName, recType);
	    	    				break;
	    	    			case ZCConstants.DISABLE:
	    	    				disableComponent(taskObj.formName, taskObj.fieldName, recType);
	    	    				break;
	    	    			case ZCConstants.SELECTALL:
	    	    				selectAllValue(taskObj.formName, taskObj.fieldName, recType);
	    	    				break;
	    	    			case ZCConstants.DESELECTALL:
	    	    				deSelectAllValue(taskObj.formName, taskObj.fieldName, recType);
	    	    				break;
	    	    			case ZCConstants.ALERT:
	    	    				jsalert(taskObj.alertValue);
	    	    				break;
	    	    			case ZCConstants.SET_VALUE:
	    	    				setValue(taskObj.formName, taskObj.fieldName, taskObj.fieldValue, recType,taskObj.isFromSubForm,taskObj.rowNo, taskObj.combinedValue);
	    	    				break;
	    	    			case ZCConstants.SELECT:
	    	    				selectValue(taskObj.formName, taskObj.fieldName, taskObj.fieldValue, recType, taskObj.combinedValue);
	    	    				break;
	    	    			case ZCConstants.DESELECT:
	    	    				deSelectValue(taskObj.formName, taskObj.fieldName, taskObj.fieldValue, recType, taskObj.combinedValue);
	    	    				break;
	    	    			case ZCConstants.APPEND_VALUE:
	    	    				addValueToTheFieldElem(taskObj.formName, taskObj.fieldName, taskObj.fieldValue, recType, taskObj.combinedValue,taskObj.isAppend);
	    	    				break;
	    	    			case ZCConstants.OPEN_URL:
	    	    				openWindowTask(taskObj.urlString,taskObj.windowType,taskObj.windowSpecificArgument);
	    	    				break;
	    	    			case ZCConstants.PRINT_TASK:
	    	    				printInfoMsg(taskObj.infoValue,paramsMap);
	    	    				break;
	    	    			case ZCConstants.ERROR_TASK:
	    	    				showValidationError(taskObj.errors,paramsMap);
	    	    				break;
	    	    			case ZCConstants.RESET_LOAD_LOOKUP_TASK:
	    	    				resetLoadLookupOptions(taskObj.formName, null, taskObj.fieldName, recType);
	    	    				break;
	    	    			default:
	    	    				 handleScriptError(taskObj.message);
	           		}
    			}
     		}
     	}
 	}

function getRowIdFromCompName(subFCName)
{
	return subFCName.split(").FD(")[1].split(").")[0];;
}
function printInfoMsg(value,paramsMap)
{
	var formLinkName = ZCUtil.getFromMap(paramsMap, "formLinkName");
	var formAccessType = ZCUtil.getFromMap(paramsMap, "recType");
	var info = $("<table style='width:100%;' elname='errortable' border ='0' cellpadding='0' cellspacing='0'><tbody><tr><td valign=\"middle\" class = \"zoho-black-small-text\"><strong>On Click - log messages:</strong></td></tr>");
	for(var i in value)
	{
		var innermsg=$("<tr><td valign=\"middle\" class = \"zoho-black-small-text\"></td></tr>");
		innermsg.children().text(value[i]);
		$(info).append(innermsg);
	}
	$(info).append("</tbody></table>");
	var infoMsg=(ZCApp.sharedBy == ZCApp.loginUser || ZCApp.loginUser == ZCApp.appOwner)?$(info)[0].outerHTML:"";
	ZCForm.showInfo(infoMsg, infoMsg, formLinkName, formAccessType, "");
	
}

function showValidationError(value,paramsMap)
{
	var formLinkName = ZCUtil.getFromMap(paramsMap, "formLinkName");
	var formAccessType = ZCUtil.getFromMap(paramsMap, "recType");
	ZCForm.showErrors(formLinkName, formAccessType, "", "",value);
}

function genScriptURLValue()
{
	if(genScriptURL.indexOf(ZCApp.contextPath) < 0)
    {
    	genScriptURL = ZCApp.contextPath+genScriptURL;
    }
	return genScriptURL;
}

function onChangeScript(formElem, formID, fcID, recType, isLookupSearch)
{
	setFormState(formElem);
	ZCForm.updateRichTextContent();
	var formLinkName = $(formElem).attr("name");
	var formParamsMap = ZCForm.formArr[formLinkName];
	var onUserInputArr = new Array();
	if(!ZCUtil.isNull(ZCUtil.getFromMap(formParamsMap, "onuserinput"))) //No I18N
	{
		onUserInputArr = ZCUtil.getFromMap(formParamsMap, "onuserinput"); //No I18N
		if(!ZCUtil.contains(onUserInputArr, fcID))
		{
			onUserInputArr[onUserInputArr.length] = fcID;
		}
	}
	else
	{
		onUserInputArr[0] = fcID;
	}
	ZCUtil.setInMap(formParamsMap, "onuserinput", onUserInputArr); //No I18N
	doAction(formElem, formID, fcID, recType, null, null,isLookupSearch, ZCForm.isRecursiveCall);
}
function executeFormula(formElem,formID, fcID, isLookupSearch)
{
	if(newGenerateJsCodeEnabled)
	{
		var respType = "json";//No internationalization
	}
	else
	{
		var respType = "script";//No internationalization
	}
	var params = cloneAndGetParams(formElem);
	//params= params+"&workflow_Id="+workflow_Id;
	params=params+"&isFormula=true";//No internationalization
	params = params + "&fcid="+fcID;//No internationalization
	params = params + "&isLookupSearch="+isLookupSearch;//No I18N

	//alert("our params da ::"+params);
	var loadingMsg = i18n.loadingmsg;
	var hideLoading = true ;
	var formLinkName = $(formElem).attr("name");
	var formParamsMap = ZCForm.formArr[formLinkName];
	ZCUtil.setInMap(formParamsMap, "executeFormula", fcID); //No I18N
   	ZCUtil.sendRequest(genScriptURLValue(), params, respType, "handleHttpResponse", ZCUtil.getParamsAsMap("isLookupSearch="+isLookupSearch), loadingMsg, hideLoading);//No I18N
 	ZCUtil.removeFromMap(formParamsMap, "executeFormula");//No internationalization
}

function executeFormulaforSubForm(formElem,formID,fcID, subFCID,subFCName, recType, isLookupSearch)
{
	if(newGenerateJsCodeEnabled)
	{
		var genSubScriptURL="/newCalculateFormula.do";
		var respType = "json";//No internationalization
	}
	else
	{
		var respType = "script";//No internationalization
		var genSubScriptURL="/CalculateFormula.do";
	}
var loadingMsg = i18n.loadingmsg;
var hideLoading = true ;
var params = cloneAndGetParams(formElem);
params = params + "&fcid="+fcID;//No internationalization
params=params+"&isFormula=true";//No internationalization
params = params + "&subfcid=" + subFCID;//No internationalization
params = params + "&subfcname="+subFCName;//No internationalization
params = params + "&isSubForm=true";//No internationalization

if(newGenerateJsCodeEnabled)
{
	params = params + "&rowseqid="+getRowIdFromCompName(subFCName);//No internationalization
}
var formLinkName = $(formElem).attr("name");
var formParamsMap = ZCForm.formArr[formLinkName];
ZCUtil.setInMap(formParamsMap, "executeFormula", fcID); //No I18N
ZCUtil.sendRequest(genSubScriptURL, params, respType, "handleHttpResponse", ZCUtil.getParamsAsMap("isLookupSearch="+isLookupSearch), loadingMsg, hideLoading);//No I18N
ZCUtil.removeFromMap(formParamsMap, "executeFormula");//No internationalization
}

function onChangeSubFormScript(formElem, formID, fcID, subFCID, subFCName,recType)
{
	if(newGenerateJsCodeEnabled)
	{
		var respType = "json";
	}
	else
	{
		var respType = "script";
	}
	
	ZCApp.setLoadingMsg($("#zc-loading"),i18n.pleasewait);
    var params = cloneAndGetParams(formElem);
    params = params + "&fcid="+fcID;
    params = params + "&subfcid=" + subFCID;
    params = params + "&subfcname="+subFCName;
 	if(newGenerateJsCodeEnabled)
 	{   
    	params = params + "&rowseqid="+getRowIdFromCompName(subFCName);
    }
	var formLinkName = $(formElem).attr("name");
	var formParamsMap = ZCForm.formArr[formLinkName];
    var onUserInputArr = new Array();
	if(!ZCUtil.isNull(ZCUtil.getFromMap(formParamsMap, "onuserinput"))) //No I18N
	{
		onUserInputArr = ZCUtil.getFromMap(formParamsMap, "onuserinput"); //No I18N
		if(!ZCUtil.contains(onUserInputArr, subFCName))
		{
			onUserInputArr[onUserInputArr.length] = subFCName;
		}
	}
	else
	{
		onUserInputArr[0] = subFCName;
	}
	ZCUtil.setInMap(formParamsMap, "onuserinput", onUserInputArr); //No I18N
    var loadingMsg = i18n.loadingmsg;
    var hideLoading = ((fcID != null) && (fcID.length > 0));
    ZCUtil.sendRequest(genScriptURLValue(), params, respType, "handleHttpResponse", new Object(), loadingMsg, hideLoading);//No I18N
}

function subFormRowAction(formElem, formID, fcID, fcName, rowid, rowActionType, recType){
	 if(newGenerateJsCodeEnabled)
		{
			var respType = "json";
		}
		else
		{
			var respType = "script";
		}
    ZCApp.setLoadingMsg($("#zc-loading"),i18n.pleasewait);
    var params = cloneAndGetParams(formElem);
    params = params + "&fcid="+fcID;
    params = params + "&fcname="+ fcName;
    params = params + "&rowseqid=" + rowid;
    params = params + "&rowactiontype=" + rowActionType;
    var loadingMsg = i18n.loadingmsg;
    var hideLoading = ((fcID != null) && (fcID.length > 0));
    ZCUtil.sendRequest(genScriptURLValue(), params, respType, "handleHttpResponse", new Object(), loadingMsg, hideLoading);//No I18N
}

function onInitScript(formElem, formID, fcID, recType)
{
    setFormState(formElem);
    var formLinkName = $(formElem).attr("name");
    var formParamsMap = ZCForm.formArr[formLinkName];
    var onInittArr = new Array();
    if(!ZCUtil.isNull(ZCUtil.getFromMap(formParamsMap, "oninit"))) //No I18N
    {
        onInittArr = ZCUtil.getFromMap(formParamsMap, "oninit"); //No I18N
        if(!ZCUtil.contains(onInittArr, fcID))
        {
            onInittArr[onInittArr.length] = fcID;
        }
    }
    else
    {
        onInittArr[0] = fcID;
    }
    ZCUtil.setInMap(formParamsMap, "oninit", onInittArr); //No I18N
    doAction(formElem, formID, fcID, recType);
}

function submitExtForm(formElem, formAccessType, buttonID, eventType)
{
	setFormState(formElem);
	doAction(formElem, "", "", formAccessType, buttonID, eventType);
}

function doActionOnLoad(formID, formElem)
{
        setFormState(formElem);
        var params = cloneAndGetParams(formElem);
        if($(formElem).attr("formType") == "SubForm")
        {
                var formLinkName = $(formElem).attr("name");
        //      var subFormCompID = getSubFormCompID(formElem);
                var formParamsMap = ZCForm.formArr[formLinkName];
                var formid = ZCUtil.getFromMap(formParamsMap, "formID");                //No I18N
                params +="&formLinkName=" + formLinkName + "&formid="+formid+"&subform=true&";          //No I18N
        }

        if(newGenerateJsCodeEnabled)
		{
			var respType = "json";
		}
		else
		{
			var respType = "script";
		}
        ZCUtil.sendRequest(genScriptURLValue(), params, respType, "handleFormActionOnLoad", "",i18n.pleasewait, false);//No I18N
}

function cloneAndGetParams(frm)
{
    var params = "";
    var delugetypeParamList = new Array();
    var delugetypeidx = 0;
    $(":input[type!=reset][type!=submit][type!=button][type!=file]", $(frm)).each(function(index)
    {
        var el = $(this);
        $delugeType = $(el).attr("delugeType");
        var elName = $(el).attr("name");
        var elValue = $(el).prop("value");
        
        //EXCLUDING SUBFORM PARAMS

        var isSubFormParam = false;
        $.each($(el).parents('div[formType=SubForm]'), function(a,b)
        {
                isSubFormParam = true;
        });
        if(isSubFormParam && $(frm).attr('elName') != "subFormContainer")
                return true;
        //Get xml string form subform input values
        if($(el).attr("elName") == "subforminput"){
                        return true;
        }

        if($delugeType)
        {
                var elType = $(el).attr("type");
                if((elType != "file" && elName != "uploadFile") && (elType != "radio" || (elType == "radio" && $(el).prop("checked"))))
                {
                        if(elType == "select-multiple" || elType == "multiselect")
                        {
                                $.each(ZCUtil.getFieldValue(el), function(idx, val)
                                {
                                        if(!ZCUtil.isNull(val)) params = params + $(el).attr("name") + "=" + encodeURIComponent(val) + "&";
                                });
                        }
                        else if(elType == "checkbox")
                        {
                                 if($delugeType == "BOOLEAN")
                                {
                                        var decisionVal = $(el).prop("checked") ? "zc_checked" : "zc_unchecked"; //No I18N
                                        params = params + elName + "=" + decisionVal + "&"; //No I18N
                                }
                                else if($(el).prop("checked"))
                                {
                                        params = params + elName + "=" + encodeURIComponent(elValue) + "&";
                                }
                        }
                        else
                        {
                                var val = ZCUtil.getFieldValue($(el));
                                if(ZCUtil.isNull(val))
                                {
                                        val = "";
                                }
                                if(($(el).attr("type") != "radio" && $(el).attr("type") != "checkbox") || !ZCUtil.isNull(val))
                                {
                                        params = params + $(el).attr("name") + "=" + encodeURIComponent(val) + "&";
                                }
                        }

                        /*var checkDuplicateEle = -1;
						if ((elType == "checkbox" && $delugeType != "BOOLEAN"))
                        {
                                checkDuplicateEle = jQuery.inArray(elName, delugetypeParamList);
                        }
                        if(checkDuplicateEle == -1)
                        {
                                params = params + elName+"_delugetype" + "=" + $delugeType + "&";
                                delugetypeParamList[delugetypeidx] = elName;
                                delugetypeidx++;
                        }*/
                }
        }
        else
        {
                params = params + elName + "=" + encodeURIComponent(elValue) + "&";
        }
    });
    params = (params != "")?params.substring(0, params.length-1):params;
    return params;
}

function handleFormActionOnLoad(result, paramsMap)
{
	if(newGenerateJsCodeEnabled)
		{
			ZCNewGenerateJsTask.executeTask(result,paramsMap);
		}
	else
		{
			evaluateJs(result, ZCUtil.getFromMap(paramsMap, "recType"));
		}
	for(fe in form_element)
	{
		var temp = form_element[fe];
		form_element[fe]="";
		if(temp != "")
		{
			fireOnChange(temp);
		}
	}
	form_element = new Array();
	if(ZCForm.showFormVar == "true")
	{
		ZCForm.enableForm(ZCUtil.getFromMap(paramsMap, "formLinkName"), ZCUtil.getFromMap(paramsMap, "recType"));
	}
	ZCForm.showFormVar = "true";

}
/*
 * isRecursiveCall argument is added for collecting metrics.  it is passed from onChangeScript() function. - RAJA
 */
function doAction(formElem, formid, fcid, recType, buttonID, eventType, isLookupSearch, isRecursiveCall)
{
		if(newGenerateJsCodeEnabled)
		{
			var respType = "json";
		}
		else
		{
			var respType = "script";
		}	
		ZCApp.setLoadingMsg($("#zc-loading"),i18n.pleasewait);
        var params = cloneAndGetParams(formElem);
        params = params + "&fcid="+fcid;
        var loadingMsg = i18n.loadingmsg;
        if(eventType)
        {
                respType = "json";
                params = params + "&buttonid="+buttonID+"&buttonwftype="+eventType;
                loadingMsg = i18n.pleasewait;
        }
                if($(formElem).attr("formType") == "SubForm")
                {
                        var formLinkName = $(formElem).attr("name");
                        params +="&formLinkName=" + formLinkName + "&formid="+formid+"&subform=true&";          //No I18N
                }
                if(isRecursiveCall)	{
                		params += "&isRecursiveCall="+isRecursiveCall;
                	}
        var hideLoading = ((fcid != null) && (fcid.length > 0));
        ZCUtil.sendRequest(genScriptURLValue(), params, respType, "handleHttpResponse", ZCUtil.getParamsAsMap("eventType="+eventType+"&isLookupSearch="+isLookupSearch), loadingMsg, hideLoading);//No I18N
}

function evaluateJs(result, recType)
{
	ZCUtil.evalJS(result);
	doaction(recType);
}

function handleScriptError(msg)
{
	closeDialog();
	msg = msg.replace(new RegExp(ZCConstants.REPLACE_SQ_CHAR,'g'),"'");
	ZCUtil.showDialog(msg, "true");
	ZCForm.showFormVar = "false";
}

function handleHttpResponse(result, paramsMap, argsMap)
{
	var responseArr = new Array();
	var formLinkName = ZCUtil.getFromMap(paramsMap, "formLinkName");
	var formAccessType = ZCUtil.getFromMap(paramsMap, "recType");
	var formEl = ZCForm.getForm(formLinkName, formAccessType);
	var eventType = ZCUtil.getFromMap(argsMap, "eventType");
	var isLookupSearch = ZCUtil.getFromMap(argsMap, "isLookupSearch");
	var isDummyForm = "";

	ZCForm.defreezeButton(formEl);
	
		if(!ZCUtil.isNull(eventType))
		{
			if(newGenerateJsCodeEnabled)
			{
				ZCForm.clearErrors(formEl);
				if(eventType == ZCConstants.BUTTON_WFLOW_TYPE)
				{
					relodCurrentForm = "false";
				}
			}
			else
			{
			responseArr = ZCForm.getMsgFromResponse(result, ZCUtil.getFromMap(paramsMap, "formid"));
			var errMsg = responseArr["errMsg"];
			var infoMsg = (ZCApp.sharedBy == ZCApp.loginUser || ZCApp.loginUser == ZCApp.appOwner)?responseArr["infoMsg"]:"";
			var errMsg = (!ZCUtil.isNull(errMsg))?errMsg:"";
			var actInfoMsg = (!ZCUtil.isNull(infoMsg))?infoMsg:"";
			ZCForm.clearErrors(formEl);
			if(!ZCUtil.isNull(actInfoMsg) || !ZCUtil.isNull(errMsg))
			{
				ZCForm.showInfo(actInfoMsg, infoMsg, formLinkName, formAccessType, errMsg);
			}
			ZCForm.showErrors(formLinkName, formAccessType, "", "", responseArr["fieldErrObj"]);
			result = responseArr["generatedjs"];
			isDummyForm = responseArr["dummyForm"];
			}
			
		}
	    if(isDummyForm && isDummyForm == "true")
		{
	            relodCurrentForm = "false";
		}
	
    var onUserInputArrValue="";
    if( !ZCUtil.isNull(ZCUtil.getFromMap(paramsMap, "fcid")) && !ZCUtil.isNull(ZCUtil.getFromMap(paramsMap, "subfcid")))
    {
    	onUserInputArrValue = ZCUtil.getFromMap(paramsMap, "subfcname");//No I18N
    	if(formEl != undefined && $(formEl).find(":input[name='"+ZCUtil.getFromMap(paramsMap, "subfcname")+"']").length > 0){
    		ZCForm.showHideCog($(formEl).find(":input[name='"+ZCUtil.getFromMap(paramsMap, "subfcname")+"']"), "hidden");
    	}else if(formEl != undefined && $(formEl).find("div[elName=srchDiv][name='"+ZCUtil.getFromMap(paramsMap, "subfcname")+"']").length > 0){
			// Fix for deselecting last value of multiselect searchable lookup inside the subform which results in removing all input
    		ZCForm.showHideCog($(formEl).find("div[elName=srchDiv][name='"+ZCUtil.getFromMap(paramsMap, "subfcname")+"']"), "hidden");	
    	}
    	else{
    		ZCForm.showHideCog($(formEl).find(":input[name='"+ZCUtil.getFromMap(paramsMap, "subfcname")+"']"), "hidden");
    	}
    }
    else if( !ZCUtil.isNull(ZCUtil.getFromMap(paramsMap, "fcid")) && !ZCUtil.isNull(ZCUtil.getFromMap(paramsMap, "rowseqid")))
    {
    	var labelName = "SF(" + ZCUtil.getFromMap(paramsMap, "fcname") + ").FD(" + ZCUtil.getFromMap(paramsMap, "rowseqid") + ").SV(ID)";
    	ZCForm.showHideCog($(formEl).find("a[labelname='"+ labelName +"']"), "hidden", true);
    }
    else if(!ZCUtil.isNull(ZCUtil.getFromMap(paramsMap, "fcid")))
	{
    	onUserInputArrValue = ZCUtil.getFromMap(paramsMap, "fcid");//No I18N
		if(isLookupSearch == "true")
		{
    		ZCForm.showHideCog($(formEl).find("div[elName=srchDiv][formCompID="+ZCUtil.getFromMap(paramsMap, "fcid")+"]"), "hidden");
		}
    	else
    	{
    		ZCForm.showHideCog($(formEl).find(":input[formCompID="+ZCUtil.getFromMap(paramsMap, "fcid")+"]"), "hidden");
    	}
	}
	
	if(!ZCUtil.isNull(result))
	{
	if(newGenerateJsCodeEnabled)
	{
		ZCNewGenerateJsTask.executeTask(result,paramsMap);
	}
	else
	{
			evaluateJs(result, formAccessType);
	}
	}
	if(!ZCUtil.isNull(eventType))
	{
		if(relodCurrentForm && relodCurrentForm == "true" && ZCUtil.isNull(responseArr["errMsg"]) && ZCUtil.isNull(responseArr["fieldErrObj"]))
		{
			ZCForm.showForm(formLinkName, formAccessType, "", "", responseArr["succMsg"]);
		}
        relodCurrentForm = "true";
	}
     	if(form_element!="")
	{
	   var temp = form_element;
	   form_element="";
	   fireOnChange(temp);
	}
	for(fe in form_element)
	{
		var temp = form_element[fe];
		form_element[fe]="";
		if(temp != "")
		{
			fireOnChange(temp);
		}
	}
	form_element = new Array();
	var formMap = ZCForm.formArr[formLinkName];
	var onUserInputArr = ZCUtil.getFromMap(formMap, "onuserinput"); //No I18N
	if(onUserInputArr != "")
	{
		onUserInputArr = ZCUtil.removeFromArray(onUserInputArr, onUserInputArrValue); //No I18N
		if(onUserInputArr.length>0)
		{
			ZCUtil.setInMap(formMap, "onuserinput", onUserInputArr); //No I18N
		}
		else
		{
			ZCUtil.removeFromMap(formMap, "onuserinput"); //No I18N
		}
	}
	if(ZCUtil.isNull(ZCUtil.getFromMap(formMap, "fieldchange")) && !ZCUtil.isNull(ZCUtil.getFromMap(formMap, "autosubmit")) && onUserInputArr == "")
	{
        if(!ZCUtil.isNull(ZCUtil.getFromMap(formMap, "buttonelem")))
        {
            buttonEl = ZCUtil.getFromMap(formMap, "buttonelem"); //No I18N
            ZCForm.handleButtonOnClick(formEl,formAccessType,buttonEl);
        }
        else
        {
            ZCForm.submitForm(formEl);
        }
	}
	else if(!ZCUtil.isNull(ZCUtil.getFromMap(formMap, "fieldchange")) && !ZCUtil.isNull(ZCUtil.getFromMap(formMap, "autosubmit")))
	{
		ZCApp.showFadingMsg(i18n.invalidsubmission,0,1000);
		ZCForm.clearErrors(formEl);
		ZCForm.showErrors(formLinkName, formAccessType, "", i18n.showfield);
	}
	if(ZCUtil.getFromMap(paramsMap, 'rowactiontype') === "ondeleterow"){
		ZCForm.removeTR(formEl, ZCUtil.getFromMap(paramsMap, 'fcname'), ZCUtil.getFromMap(paramsMap, 'rowseqid'));
	}
}

function hideComponent(formName, fieldName, recType)
{
	ZCForm.showHideField(false, formName, fieldName, recType);
}

function showComponent(formName, fieldName, recType)
{
	ZCForm.showHideField(true, formName, fieldName, recType);
	var formParamsMap = ZCForm.formArr[formName];
	ZCUtil.setInMap(formParamsMap, "fieldchange", "true"); //No I18N
}

function enableComponent(formName, fieldName, recType)
{
	ZCForm.enDisableField(false, formName, fieldName, recType);
	var formParamsMap = ZCForm.formArr[formName];
	ZCUtil.setInMap(formParamsMap, "fieldchange", "true"); //No I18N
}

function disableComponent(formName, fieldName, recType)
{
	ZCForm.enDisableField(true, formName, fieldName, recType);
}

function clearComponent(formName, fieldName, recType)
{
	var el = ZCForm.clearField(formName, fieldName, recType);
	if($(el).attr("type") == "picklist" || $(el).attr("type") == "select-one")
	{
		$(el).append(ZCUtil.createElem("option", "value=-Select-", "-"+i18n.selectOption+"-"));
	}
  	//form_element = el; //ZCForm.getDOMObjectForField(formName, fieldName, recType);
	if(!form_element[el])
	{
	   form_element[el]=el;
	}
}

function resetLoadLookupOptions(formLinkName, subForm, fieldName, recType)
{
	if(subForm)
	{	
		var subFormRecordCmpName = "SF(" + subForm.Name + ").FD(" + subForm.rowID + ")." + ( ZCConstants.MULTI_SELECT == subForm.compType ? "MV(" : "SV(" ) + fieldName + ")";	//No I18N
		var formEle = ZCForm.getForm(formLinkName, recType);
		var el = $(formEle).find("div[name='"+subFormRecordCmpName+"']");
	}	
	else
	{
		var el = ZCForm.getField(formLinkName, fieldName, recType);
	}
	
	$(el).data('immutable',false);
	var srchDivEl = el.siblings("div[elname='srchDivEl']");
	var stateValueTable = srchDivEl.find("table[id='" + fieldName + "_valTable']");
	stateValueTable.attr("issaturated", "false");
}

function addValueToTheFieldElem(formName, fieldName, value, recType, combinedValue, isAppend)
{
	var fieldElem = document.getElementById( formName + ":" + fieldName + "_recType_comp" );
	addValue(formName, fieldName, fieldElem, value, recType, combinedValue, null,null,isAppend);
}

function addValue(formName, fieldName, fieldElem, value, recType, combinedValue,isFromSubForm, subFormRecordCmpName, isAppend)
{
	if(!newGenerateJsCodeEnabled && value.constructor.toString().indexOf("Array") == -1)
	{
		value = value.replace(new RegExp(ZCConstants.REPLACE_DQ_CHAR,'g'),"\"");
		value = value.replace(new RegExp(ZCConstants.REPLACE_NL_CHAR,'g'),"\n"); //No I18N
	}
	var frm = ZCForm.getForm(formName, recType);
	var el ;
	if(isFromSubForm)
	{
		el = $(ZCForm.getForm(formName, recType)).find(":input[lblName='"+fieldName+"'][name='"+$(fieldElem).attr('name')+"'], div[elName=srchDiv][labelName='"+fieldName+"'][name='"+$(fieldElem).attr('name')+"']");
	}
	else
	{
		el = ZCForm.getField(formName, fieldName, recType);
	}
	el = (el[0])?el:frm.find("div[name='parentOf-"+fieldName+"'],span[name='parentOf-"+fieldName+"']");
	var onchange = $(el).onchange;

	$(el).onchange=new Function("evt",""); // jshint ignore:line
	var valueList = new Array();
	var combinedValueList = new Array();
	if(value.constructor.toString().indexOf("Array")  == -1)
	{
		valueList.push(value);
	}
	else
	{
		valueList = value;
	}
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
	if($(el).attr("type") == "picklist" || $(el).attr("type") == "select-one"||$(el).attr("type") == "multiselect" || $(el).attr("type") == "select-multiple")
	{
		for (var i = 0; i < valueList.length; i++)
	    {
			var indVal = valueList[i];
			var indCombinedVal = combinedValueList[i];
					
			if(newGenerateJsCodeEnabled)
			{
				var newOptionEle = $("<option></option>"); //Changed
				newOptionEle.val(indVal); //Changed
				newOptionEle.text(indVal); //Changed
			}
			else
			{
				var newOptionEle = $("<option value=\""+indVal+"\">"+indVal+"</option>");
			}

			if(indCombinedVal != undefined)
			{
				if(newGenerateJsCodeEnabled)
				{
					newOptionEle.text(indCombinedVal); //Changed
				}
				else
				{
					newOptionEle = $("<option value=\""+indVal+"\">"+indCombinedVal+"</option>");
				}
			}
			$(el).append(newOptionEle);
	    }
	    $(el).onchange=onchange;
	}

	if($(el).attr("type") == "searchLookupSingle" ||  $(el).attr("type") == "searchLookupMulti")
	{
		for (var i = 0; i < valueList.length; i++)
		    {
				
				var indVal = valueList[i];
				var indCombinedVal = combinedValueList[i];
				var selFieldName = fieldName;
                if (selFieldName.indexOf(":") > 0) {
					selFieldName = selFieldName.replace(/\(/g,"\\(");
					selFieldName = selFieldName.replace(/\)/g,"\\)");
					selFieldName = selFieldName.replace(/:/g,"\\:");
					selFieldName = selFieldName.replace(/\./g,"\\.");
                }
				var rowCount = $("#srchDiv_"+selFieldName).find("div[elName=srchValDiv]").find("table").find("tr[value != -Select-]").length;
				if(newGenerateJsCodeEnabled)
				{
					var trEl = $("<tr elname=\"srchValtr\" class=\"\"><td></td></tr>") ; //changed
					trEl.attr('labelname',fieldName); //changed
					trEl.attr('value',indVal);//changed
					trEl.attr('rowno',(rowCount+1));//changed
					trEl.children().text(indVal);//changed
				}
				else
				{
					var trEl = "<tr labelname=\""+fieldName+"\" elname=\"srchValtr\" value=\""+indVal+"\" rowno=\""+(rowCount+1)+"\" class=\"\"><td>"+indVal+"</td></tr>" ;
				}
						
				if(indCombinedVal != undefined)
				{
					if(newGenerateJsCodeEnabled)
					{
						trEl.children().text(indCombinedVal);//changed
					}
					else
					{
						trEl = "<tr labelname=\""+fieldName+"\" elname=\"srchValtr\" value=\""+indVal+"\" rowno=\""+(rowCount+1)+"\" class=\"\"><td>"+indCombinedVal+"</td></tr>" ;
					}
				}
				if(!isFromSubForm)
				{
					if(searchFactory.getCache(fieldName) != undefined)
					{
						$(el).parent("div:first").find("div[elName=srchValDiv]").html(searchFactory.getCache(fieldName).cacheData[""]);
						searchFactory.clearCache(fieldName);
					}
					$(el).parent("div:first").find("div[elName=srchValDiv]").find("table").find("tr[elName=noResultTr]").remove();
					$(el).parent("div:first").find("div[elName=srchValDiv]").find("table").append(trEl);
				}
				else
				{
					for(var j = 0; j < $(el).length; j++)
					{
						if(searchFactory.getCache(fieldName) != undefined)
						{
							$(el[j]).parent("div:first").find("div[elName=srchValDiv]").html(searchFactory.getCache(fieldName).cacheData[""]);
						}
					}
					searchFactory.clearCache(fieldName);
					$(fieldElem).parent("div:first").find("div[elName=srchValDiv]").find("table").find("tr[elName=noResultTr]").remove();
					$(fieldElem).parent("div:first").find("div[elName=srchValDiv]").find("table").append(trEl);
					if(isAppend != undefined && isAppend == true)
					{
						if(searchFactory.getCache(subFormRecordCmpName)!= undefined)
						{
							var htm = searchFactory.getCache(subFormRecordCmpName).cacheData[""];
							if(htm != undefined)
							{
								$(htm).find("tr[elName=noResultTr]").remove();
								htm = $(htm).append(trEl);
								searchFactory.setCache(subFormRecordCmpName,htm,"");
							}
						}
					}
				}
		    }
	}
	else
	{
		var optTbl = docid("opt-table-"+el.attr("formCompID"));
		if(($(el).attr("name")).indexOf("parentOf-") == -1)
		{
		   el = $(optTbl).parent();
		}
		if($(el).attr("type") == "radio")
		{
			var rlayout = 1;
			if (!ZCUtil.isNull($(el).attr("layout")))
			{
				rlayout = parseInt($(el).attr("layout"));
			}
			var newRowEl = ZCUtil.createElem("tr", "", "");//No I18N
			for (var i = 0; i < valueList.length; i++)
			{
				var indVal = valueList[i];
				var indCombinedVal = combinedValueList[i];
				var inputTdEl = $("<td></td>");
			
				if(newGenerateJsCodeEnabled)
				{
					var inputEl = $("<input class=\"zc-radio\" tagfor=\"formComp\" type=\"radio\" delugeType=\"STRING\" formCompID=\""+el.attr("formCompID")+"\" onChangeExists=\""+el.attr("onChangeExists")+"\" isformulaexist=\""+el.attr("isformulaexist")+"\"" + "/>"); //No I18N
					inputEl.attr('id', "radioEl_"+fieldName+"_"+indVal+"_1");
					inputEl.attr('name',fieldName);//changed
					inputEl.attr('value',indVal);//changed
				}
				else
				{
					var inputEl = $("<input class=\"zc-radio\" tagfor=\"formComp\" type=\"radio\" name=\""+fieldName+"\" value=\""+indVal+"\" delugeType=\"STRING\" formCompID=\""+el.attr("formCompID")+"\" onChangeExists=\""+el.attr("onChangeExists")+"\" isformulaexist=\""+el.attr("isformulaexist")+"\"" + "/>"); //No I18N
					inputEl.attr('id', "radioEl_"+fieldName+"_"+indVal+"_1");
				}
				inputEl.onchange=onchange;
				$(inputTdEl).append(inputEl);

				if(newGenerateJsCodeEnabled)
				{
					var labelTdEle = $("<td><label class=\"zc-radiolabel\">"+indVal+"</label></td>");//changed
					labelTdEle.children().attr('for',"radioEl_"+fieldName+"_"+indVal+"_1");//changed
				}
				else
				{
					var labelTdEle = $("<td><label class=\"zc-radiolabel\" for=\"radioEl_"+fieldName+"_"+indVal+"_1\">"+indVal+"</label></td>");
				}
				if(indCombinedVal != undefined)
				{
					if(newGenerateJsCodeEnabled)
					{
						labelTdEle = $("<td><label class=\"zc-radiolabel\">"+indCombinedVal+"</label></td>");//changed
						labelTdEle.children().attr('for',"radioEl_"+fieldName+"_"+indVal+"_1");//changed
					}
					else
					{
						labelTdEle = $("<td><label class=\"zc-radiolabel\" for=\"radioEl_"+fieldName+"_"+indVal+"_1\">"+indCombinedVal+"</label></td>");
					}
				}

				$(newRowEl).append(inputTdEl);
				$(newRowEl).append(labelTdEle);
				//setOnChangeAndDisable(el,frm, inputEl, recType);
				//if Radio type field has onchange event, it leads IE Related Issue
				setOnClickAndDisable(el,frm, inputEl, recType);
				$(optTbl).append(newRowEl);

				if ((i+1) % (rlayout) === 0)
				{
					newRowEl = ZCUtil.createElem("tr", "", "");//No I18N
				}
			}
		}
		else if($(el).attr("type") == "checkbox")
		{
			var rlayout = 1;
			if (!ZCUtil.isNull($(el).attr("layout")))
			{
				rlayout = parseInt($(el).attr("layout"));
			}
			var newRowEl = ZCUtil.createElem("tr", "", "");//No I18N
			for (var i = 0; i < valueList.length; i++)
			{
				var indVal = valueList[i];
				var indCombinedVal = combinedValueList[i];
				var inputTdEl = $("<td></td>");
				
				if(newGenerateJsCodeEnabled)
				{
					var inputEl = $("<input class=\"zc-checkboxes\" tagfor=\"formComp\" type=\"checkbox\" delugeType=\""+$(el).attr("delugetype")+"\" fieldtype=\"13\" formCompID=\""+el.attr("formCompID")+"\" onChangeExists=\""+el.attr("onChangeExists") + "\" isformulaexist=\""+el.attr("isformulaexist")+"\"" + "/>"); //No I18N
					inputEl.attr('name',fieldName);//changed
					inputEl.attr('id',"checkboxesEl_"+fieldName+"_"+indVal+"_1");//changed
					inputEl.val(indVal);//changed
				}
				else
				{
					var inputEl = $("<input class=\"zc-checkboxes\" tagfor=\"formComp\" type=\"checkbox\" name=\""+fieldName+"\" value=\""+indVal+"\" delugeType=\""+$(el).attr("delugetype")+"\" fieldtype=\"13\" id=\"checkboxesEl_"+fieldName+"_"+indVal+"_1\" formCompID=\""+el.attr("formCompID")+"\" onChangeExists=\""+el.attr("onChangeExists") + "\" isformulaexist=\""+el.attr("isformulaexist")+"\"" + "/>"); //No I18N
				}
				
				inputEl.onchange=onchange;
				$(inputTdEl).append(inputEl);

				if(newGenerateJsCodeEnabled)
				{
					var labelTdEle = $("<td><label class=\"zc-checkboxeslabel\">"+indVal+"</label></td>");//changed
					labelTdEle.children().attr('for',"checkboxesEl_"+fieldName+"_"+indVal+"_1");//changed
				}
				else
				{
					var labelTdEle = $("<td><label class=\"zc-checkboxeslabel\" for=\"checkboxesEl_"+fieldName+"_"+indVal+"_1\">"+indVal+"</label></td>");
				}
									
				if(indCombinedVal != undefined)
				{
					if(newGenerateJsCodeEnabled)
					{
						labelTdEle = $("<td><label class=\"zc-checkboxeslabel\">"+indCombinedVal+"</label></td>");//changed
						labelTdEle.children().attr('for',"checkboxesEl_"+fieldName+"_"+indVal+"_1");//changed
					}
					else
					{
						labelTdEle = $("<td><label class=\"zc-checkboxeslabel\" for=\"checkboxesEl_"+fieldName+"_"+indVal+"_1\">"+indCombinedVal+"</label></td>");
					}
				}

				$(newRowEl).append(inputTdEl);
				$(newRowEl).append(labelTdEle);
				//setOnChangeAndDisable(el,frm, inputEl, recType);
				//if Radio type field has onchange event, it leads IE Related Issue
				setOnClickAndDisable(el,frm, inputEl, recType);
				$(optTbl).append(newRowEl);

				if ((i+1) % (rlayout) === 0)
				{
					newRowEl = ZCUtil.createElem("tr", "", "");//No I18N
				}
			}
		}
	}
	var el = ZCForm.getField(formName, fieldName, recType);
	el = (el[0])?el:frm.find("div[name='parentOf-"+fieldName+"']");
}

function setOnChangeAndDisable(el,frm, inputEl, recType)
{
  $(inputEl).change(function()
  {
    if($(inputEl).attr("onChangeExists")=="true")
    {
       onChangeScript(frm, $(frm).find(":input[name=formid]").val(), $(inputEl).attr("formCompID"), recType);
    }
  });
  if($(el).attr("status") ==  "disable") $(inputEl).attr("disabled",true);
}

function setOnClickAndDisable(el,frm, inputEl, recType)
{

	  $(inputEl).click(	function(){
										var divElem = $(this).parents('div[elname=subformdiv]')[0];
										if(divElem){
											ZCForm.invokeOnChange(this, frm, recType, $(divElem).attr('formcompid'));
										}else{
											ZCForm.invokeOnChange(this, frm, recType);
										}
								  });
/*
  $(inputEl).click(function()
  {
    if($(inputEl).attr("onChangeExists")=="true")
    {
       onChangeScript(frm, $(frm).find(":input[name=formid]").val(), $(inputEl).attr("formCompID"), recType);
    }
  });
*/
  if($(el).attr("status") ==  "disable") $(inputEl).attr("disabled",true);
}

function selectValue(formName, fieldName, fieldValue, recType, combinedValue)
{
	ZCForm.selectDeselect(formName, fieldName, recType, fieldValue, true, combinedValue);
}

function deSelectValue(formName, fieldName, fieldValue, recType, combinedValue)
{
	ZCForm.selectDeselect(formName, fieldName, recType, fieldValue, false, combinedValue);
}

function selectAllValue(formName, fieldName, recType)
{
	ZCForm.selectDeselectAll(formName, fieldName, recType, true);
}

function deSelectAllValue(formName, fieldName, recType)
{
	ZCForm.selectDeselectAll(formName, fieldName, recType, false);
}

function setValue(formName, fieldName, fieldValue, recType,isFromSubForm,rowNo, combinedValue)
{
	if(!newGenerateJsCodeEnabled && fieldValue.constructor.toString().indexOf("Array") == -1)
	{
	   //fieldValue = fieldValue.replace(/@At8#1/g,"\"");
	   //fieldValue = fieldValue.replace(/@At8#1/g,"\"");
	   fieldValue = fieldValue.replace(new RegExp(ZCConstants.REPLACE_DQ_CHAR,'g'),"\"");
	   fieldValue = fieldValue.replace(new RegExp(ZCConstants.REPLACE_NL_CHAR,'g'),"\n"); //No I18N
	}
	el = ZCForm.setFieldValue(formName, fieldName, recType, fieldValue,null,isFromSubForm,rowNo, combinedValue);

	if(isRecursionInGenJSAllowed)
	{
		fireOnChange(el);
	}
}


function subFormFieldJSTask(actionType, formLinkName, subFormName, fieldValue, rowID, compName, compType, subFormDisType, recType, combinedValue, isAppend)
{
	if(rowID)
	{
		var subFormRecordCmpName = "SF(" + subFormName + ").FD(" + rowID + ")." + ( ZCConstants.MULTI_SELECT == compType ? "MV(" : "SV(" ) + compName + ")";	//No I18N
	}
	switch(actionType)
	{
		case ZCConstants.CLEAR:
			var el = ZCForm.clearField(formLinkName, subFormRecordCmpName, recType);
			if($(el).attr("type") == "picklist" || $(el).attr("type") == "select-one")
			{
				$(el).append(ZCUtil.createElem("option", "value=-Select-", "-"+i18n.selectOption+"-"));
			}
			break;

		case ZCConstants.SET_VALUE:
			if(compType == ZCConstants.IMAGE || compType == ZCConstants.URL){
				setSubFormImageUrlValue(formLinkName, subFormName, subFormRecordCmpName, rowID, compName, fieldValue, recType);
			}
			else{
                if(!newGenerateJsCodeEnabled && fieldValue.constructor.toString().indexOf("Array") == -1)
                {
                   fieldValue = fieldValue.replace(new RegExp(ZCConstants.REPLACE_DQ_CHAR,'g'),"\"");//No I18N
                   fieldValue = fieldValue.replace(new RegExp(ZCConstants.REPLACE_NL_CHAR,'g'),"\n"); //No I18N
                }
				el = ZCForm.setSubFormValue(formLinkName, subFormRecordCmpName, recType, fieldValue, subFormDisType, combinedValue);
			}
			break;

		case ZCConstants.DISABLE:
		case ZCConstants.HIDE:
		case ZCConstants.ENABLE:
		case ZCConstants.SHOW:
			subFormColumnLevelAction(formLinkName, subFormName, compName, actionType, compType, recType);
			break;

		case ZCConstants.APPEND_VALUE:
			var frmCmpElem = $(ZCForm.getForm(formLinkName, recType)).find("[name='"+subFormRecordCmpName+"']");
			addValue(formLinkName, compName, frmCmpElem, fieldValue, recType, combinedValue,true,subFormRecordCmpName,isAppend);
			break;
		case ZCConstants.RESET_LOAD_LOOKUP_TASK:
			var subform=new Object();
			subform.Name=subFormName;
			subform.rowID=rowID;
			subform.compType=compType;
			resetLoadLookupOptions(formLinkName, subform, compName, recType);
			break;

	}
}

function subFormColumnLevelAction(formName, subFormName, compName, actionType, compType, recType)
{
	var subFormEl = ZCForm.getField(formName, subFormName, recType);
	var searchStr = "[name*=')." + ( ZCConstants.MULTI_SELECT == compType ? "MV" : "SV" ) + "(" + compName + ")']";//No I18N
	var serEl = subFormEl.find(searchStr);
	//console.log(serEl);

	switch(actionType)
	{
		case ZCConstants.HIDE:
		case ZCConstants.SHOW:
			var toShow = actionType === ZCConstants.SHOW;
			$.each(	serEl, function(index, elem){
													var tdElem = $(elem).parents("td");
													$(tdElem[0]).css("display", toShow?"":"none");//No I18N

												}
				);
			subFormEl.find("th[delugename=" + compName + "]").css("display", toShow?"":"none");//No I18N
			break;

		case ZCConstants.ENABLE:
		case ZCConstants.DISABLE:
			var disable = actionType === ZCConstants.DISABLE
			switch(compType)
			{
				case ZCConstants.RICH_TEXT_AREA:
					searchrt = "[nameoftextarea*=')." + ( ZCConstants.MULTI_SELECT == compType ? "MV" : "SV" ) + "(" + compName + ")']";
					var el = subFormEl.find(searchStr);
					for(var i=0; i<el.length; i++)
					{
						var textareaname = $(el[i]).attr("formcompid");
						var freezdivid = "freezdiv_" + textareaname;
						var _editordiv = $("div[textareaname=" + textareaname + "]")[i];
				
						var divID = $(_editordiv).attr("id");//No I18N
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
									if(!($.browser.msie))
									{
										_RTEditor.doc.designMode = desMod;
									}
									else
									{
										var ieMod = disable?"false":"true";
										_RTEditor.doc.body.contentEditable=ieMod;
									}
								}
							}
						}
						catch(e4){}
						var _freezdiv = _editordiv.find("#"+freezdivid);
						var enable_map = { "zIndex":disable?50:-50 };
						
						if( _editordiv.find("#"+freezdivid)[i] ){
							_freezdiv.css(enable_map);
						}
						if(disable)
						{
							if(_editordiv.attr("disablerichtext") != "true")
							{
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
								_editordiv.attr("disablerichtext",true);
								_editordiv[0].appendChild(_newdiv);
							}
						}
						else
						{
							_editordiv.attr("disablerichtext",false);
							_freezdiv.css(enable_map);
						}
					}
				break;
				
				case ZCConstants.DATE:
				case ZCConstants.DATE_TIME:
					serEl.attr("disabled", disable);//No I18N
					$.each(	serEl, function(index, elem){
															if(disable) ZCUtil.getParent(elem).find("a").css("visibility", "hidden");
															else ZCUtil.getParent(elem).find("a").css("visibility", "visible");//No I18N

														}
						);
				break;

				case ZCConstants.IMAGE:
				case ZCConstants.URL:
					$.each(	serEl, function(index, inElem) {
						var elToLoop = $(inElem).find(":input");
						if(compType == ZCConstants.IMAGE && recType == "3")
						{
							$(inElem).find("a[enable=enable]").each(function(index, elem) {
								(disable) ? $(elem).css("visibility", "hidden"): $(elem).css("visibility", "visible");
							});
						}
						$.each(elToLoop, function(index, elem) {
							$(elem).attr("disabled", disable);
						});
					});
					break;

				case ZCConstants.FILE_UPLOAD:

					if(serEl.attr("subType") == "file")
					{
						var subformRows = $(serEl);
						for(var i=0; i < subformRows.length;i++)
						{
							var ele1 = ZCForm.getFileUploadField(formName, $(subformRows[i]).attr("name"), recType);
							$(ele1).attr("disabled", disable);
						}
					}
					break;

				case ZCConstants.SINGLE_SELECT:
				case ZCConstants.MULTI_SELECT:

					if(serEl.attr("type") == "searchLookupSingle" || serEl.attr("type") == "searchLookupMulti")
					{
						if(disable)
						{
							$(serEl).parent("div:first").find("div[elName=srchDivEl]").css("display","none");   // No I18N
							$(serEl).css("background-color","#ebebe4");
							$(serEl).attr("disable","true");
							$(serEl).unbind();
						}
						else
						{
							$(serEl).css("background-color","");
							$(serEl).attr("disable","false");
							$(serEl).click(function(event)
							{
								searchFactory.setVariables(this,false);
								searchFactory.triggerClickEvent(event);
							});
						}
					}
					else
					{
						serEl.attr("disabled", disable);//No I18N
					}
					break;

				default:
					serEl.attr("disabled", disable);//No I18N
					break;
			}
			break;
	}
}

function setSubFormImageUrlValue(formName, subFormName, subFormRecordCmpName, rowID, compName, valArr, recType)
{
	var el = ZCForm.getField(formName, subFormRecordCmpName, recType);
	var name = "SF(" + subFormName + ").FD(" + rowID + ").SV(";	//No I18N
	if(newGenerateJsCodeEnabled){
		valArr = valArr == null ? '' : valArr;
	}	
	if(el.attr("type") == "image")
	{
		el.find(":input[name='" + name + "zcsource-"+compName+")']").val(checkValue(valArr["zcsource-"]));//No I18N
		el.find(":input[name='" + name + "zctitle-"+compName+")']").val(checkValue(valArr["zctitle-"]));//No I18N
		el.find(":input[name='" + name + "zcalttext-"+compName+")']").val(checkValue(valArr["zcalttext-"]));//No I18N
		el.find(":input[name='" + name + "zcfieldlink-"+compName+")']").val(checkValue(valArr["zcfieldlink-"]));//No I18N
		el.find(":input[name='" + name + "zctarget-"+compName+")']").val(checkValue(valArr["target"]));//No I18N
	}
	else
	{
		el.find(":input[name='" + name + "zcurl-"+compName+")']").val(checkValue(valArr["zcurl-"]));//No I18N
		el.find(":input[name='" + name + "zctitle-"+compName+")']").val(checkValue(valArr["zctitle-"]));//No I18N
		el.find(":input[name='" + name + "zclnkname-"+compName+")']").val(checkValue(valArr["zclnkname-"]));//No I18N
		el.find(":input[name='" + name + "zctarget-"+compName+")']").val(checkValue(valArr["target"]));//No I18N
	}
}

function makeArray()
{
	var argArr = new Array();
	for(i=0; i<makeArray.arguments.length;i=i+2)
	{
		argArr[makeArray.arguments[i]]= makeArray.arguments[i+1];
	}
	return argArr;
}

function makeList()
{
	var argArr = new Array();
	for(i=0; i<makeList.arguments.length;i++)
	{
		argArr[i] = makeList.arguments[i];
	}
	return argArr;
}

function checkValue(value)
{
	if(value)
	{
		return value;
	}
	return ""; // NO I18N
}

function setImageUrlValue(formName, fieldName, valArr, recType)
{
	var el = ZCForm.getField(formName, fieldName, recType);
	if(el.attr("type") == "image")
	{
		el.find(":input[name='zcsource-"+fieldName+"']").val(checkValue(valArr["zcsource-"]));
		el.find(":input[name='zctitle-"+fieldName+"']").val(checkValue(valArr["zctitle-"]));
		el.find(":input[name='zcalttext-"+fieldName+"']").val(checkValue(valArr["zcalttext-"]));
		el.find(":input[name='zcfieldlink-"+fieldName+"']").val(checkValue(valArr["zcfieldlink-"]));
		el.find(":input[value="+valArr["target"]+"]").prop("checked", "checked");
	}
	else
	{
		el.find(":input[name='zcurl-"+fieldName+"']").val(checkValue(valArr["zcurl-"]));
		el.find(":input[name='zctitle-"+fieldName+"']").val(checkValue(valArr["zctitle-"]));
		el.find(":input[name='zclnkname-"+fieldName+"']").val(checkValue(valArr["zclnkname-"]));
		el.find(":input[value="+valArr["target"]+"]").prop("checked", "checked");
	}
}

function openWindowTask(urlString,windowType,windowSpecificArgument)
{
	//Harishankar - Used during payment callback for handling redirection logic - Set isOpenWindowTaskExec to true
	isOpenWindowTaskExec = true;

	// for the on success-> open url : dialogue is closed for all cases except open in new window.
	// form is not reloaded when open url is done in parent window.

	windowType = windowType.toLowerCase();
	urlString = trimLeftString(urlString);

	if(windowType == "new window" || windowType == "new" || ZCUtil.isNull(windowType))
	{
		window.open(urlString,"_new");


	}
	else if(windowType == "iframe")
	{
	    //alert("it' working"+windowSpecificArgument);//No I18N
	    //alert("urlString:"+urlString);
		//	top.frames[windowSpecificArgument].src = urlString;
		window.open(urlString,windowSpecificArgument);
	}
	else
	{
		/*
		 * Navigation URL Issue fix :: closeDialog() is commented to allow multiple popups to be opened.
		 */
		//closeDialog();
		if(windowType == "popup" || windowType == "popup window")
		{
			if(urlString.indexOf("#")==0 || urlString.indexOf("/#")==0 || urlString.indexOf("/")==0)
			{
				ZCApp.openUrlInDialog(urlString, windowSpecificArgument);
			}
			else
			{
				var paramString = "resizable=false,scrollbars=yes,toolbar=false,location=false,directories=false,status=false,menubar=false,copyhistory=false";
				paramString = paramString + "," + windowSpecificArgument;
				window.open(urlString,"_blank",paramString);
			}
		}
		else
		{
			closeAllDialog();
			reloadCurrView = false;
	    		relodCurrentForm = "false";

	    		ZCUtil.setURLInLocationBar(urlString, windowType, 0);
	    		ZCApp.reloadSameURL(urlString, windowType);
		}
	}
}

function jsalert(alertValue)
{
	if(!newGenerateJsCodeEnabled)
	{
		alertValue = alertValue.replace(new RegExp(ZCConstants.REPLACE_DQ_CHAR,'g'),"\"");
		alertValue = alertValue.replace(new RegExp(ZCConstants.REPLACE_NL_CHAR,'g'),"<br>"); //No I18N
	}
	else
	{
		alertValue = alertValue.replace(/\r/g,"");
		alertValue = alertValue.replace(/\n/g,"<br>");
	}
	//alert(alertValue);
	ZCApp.showErrorDialog(null, alertValue);
}

function fireOnChange(element)
{
	if($(element).attr("onChangeExists"))
	{
		ZCForm.isRecursiveCall = true;
		if($(element).attr("type") == "radio" || $(element).attr("type") == "checkbox")
		{
			$(element).triggerHandler("click");
			//$(element).click();
		}
		else
		{
			$(element).change();
 		}
		ZCForm.isRecursiveCall = false;
	}
        if(form_element[element])
        {
	   form_element[element]="";
        }
}

function setFormState(formElem)
{
	var formLinkName = $(formElem).attr("name");
	var formParamsMap = ZCForm.formArr[formLinkName];
	ZCUtil.setInMap(formParamsMap, "client", "changed");
}

function getURLFromViewer(value)
{
	if( viewLogPreviousValue  != value && value != -1)
	{
			if(value == -1)
			{
				alert(i18Arr['zc.alertmsg.selectadate']);
			}
			else
			{
				//var url = "/appcreator/jsp/getURLFromViewer.jsp?date="+value;
                var url = "/GetURLFromViewer.do";
                var keys = new Array('date');
                var values = new Array(value);
                getHtmlForForm(getForm(url,keys,values),"setURLtoIFrame",null,i18Arr['zc.viewlive.loading']);//No I18N
				//getHtml(url,"setURLtoIFrame",null,"Loading");
			}
	}
	viewLogPreviousValue = value;
}

function getScheduleURLFromViewer(value, admin, sharedBy)
{
	if( viewLogPreviousValue  != value && value != -1)
	{
			if(value == -1)
			{
				alert(i18Arr['zc.alertmsg.selectadate']);
			}
			else
			{
				//var url = "/appcreator/jsp/getURLFromViewer.jsp?date="+value;
                var url = null;
                if(admin == "true")
                {
                	url = "/GetScheduleURLFromViewer_zcadmin.do?sharedBy="+sharedBy;//No I18N
                }
                else
                {
                	url = "/GetScheduleURLFromViewer.do";//No I18N
                }
                var keys = new Array('date');
                var values = new Array(value);
                getHtmlForForm(getForm(url,keys,values),"setURLtoIFrame",null,i18Arr['zc.viewlive.loading']);//No I18N
				//getHtml(url,"setURLtoIFrame",null,"Loading");
			}
	}
	viewLogPreviousValue = value;
}

function setURLtoIFrame(text)
{
	document.getElementById("display-loginfo-span").innerHTML = text;
}

function copySelectionFromGvn(srcElement,destElement)
{
      for(var i=0;i<srcElement.length;i++)
      {
          destElement[i].selected=srcElement[i].selected;
      }
}

function trimLeftString(str)
{
    do
    {
        index = str.indexOf(" ");
        if(index == 0)
        {
            str = str.substring(1);
        }
     }
    while(index == 0);
    return str;
}

function getLoggingDetailWhileRefresh()
{

	try
	{
		var selectEle = document.getElementById("loggingDetailSelect");
		var value = selectEle.value;
		if(value != "" && value  != undefined)
		{
			getURLFromViewer(value);
		}
	}
	catch(error)
	{

	}
}

function getScheduleLoggingDetailWhileRefresh()
{

	try
	{
		var selectEle = document.getElementById("loggingDetailSelect");
		var value = selectEle.value;
		if(value != "" && value  != undefined)
		{
			getURLFromViewer(value);
		}
	}
	catch(error)
	{

	}
}

function showStackTrace(contentid)
{
	var popup = window.open('','name1','height=500,width=500');
	popup.document.write('<html><head><title>StackTrace</title>');
	popup.document.write('</head><body>');
	popup.document.write('<textarea style="width:500;height:500">'+document.getElementById(contentid).value+'</textarea>');
	popup.document.write('</body></html>');
	popup = null;
}

function reloadForm(formName,recType)
{
        ZCForm.resetForm(formName,recType);
}