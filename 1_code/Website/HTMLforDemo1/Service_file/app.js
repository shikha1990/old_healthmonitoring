// $Id$

var ExternalFieldName = null;
var imgCounter = 0;
var totalImgCount = 0;

var ZCConstants = new function()
{
	this.publicAccessRequestUrl = "/zoho1/enable-public/form-perma/Request/zc_Header=false";//No I18N
	this.APPLICATION = 1;
	this.FORM = 2;
	this.VIEW = 3;
	this.HTML_PAGE = 4;
	this.REPORT = 5;
	this.PAGE = 6;
	this.SCRIPT = 7;
	this.EMBED_SECTION = 1;
	this.POP_UP = 2;
	this.GRID_TYPE = 3;
	this.SUB_FORM_INLINE = 97;
	this.SUB_FORM_POPUP = 98;
	this.SUB_FORM_GRID = 99;
	this.SINGLE_SELECT = 12
	this.MULTI_SELECT = 13

	this.PROFESSIONAL_PANE_LEFT = 1;
	this.PROFESSIONAL_TAB = 2;
	this.PROFESSIONAL_PANE_RIGHT = 3;
	this.PROFESSIONAL_TABBED_MENU = 4;
	this.PROFESSIONAL_TABBED_PANE_LEFT = 5;
	this.PROFESSIONAL_TABBED_PANE_RIGHT = 6;
	this.PROFESSIONAL_PANE_LEFT_MENU= 7;
	this.PROFESSIONAL_PANE_RIGHT_MENU = 8;

	this.FORM_EVENT_ON_LOAD = 3;
	this.FORM_COMPONENT_ON_CHANGE = 11;
	this.EDIT_FORM_EVENT_ON_LOAD = 14;
	this.FORM_ALONE = 1;
	this.VIEW_ADD_FORM = 2;
	this.VIEW_EDIT_FORM = 3;
	this.VIEW_BULK_EDIT_FORM = 4;
	this.FORM_LOOKUP_ADD_FORM = 5;
	this.DATE_TIME = 22;
	this.DATE = 10;
	this.TIME_FORMAT = "%H:%M:%S";
	this.RICH_TEXT_AREA = 24;
	this.VIEW_TABLE = 1;
	this.VIEW_CALENDAR = 2;
	this.VIEW_FLAT = 3;
	this.VIEW_SHEET = 4;
	this.VIEW_CHART = 5;
	this.VIEW_NEWSHEET = 6;
	this.FORM_TYPE_INZC = 1;
	this.FORM_TYPE_OUTZC = 2;
	this.BETWEEN = 58;
	this.CURRENT_NEXT_WEEK = 63;
	this.LAST_N_DAYS = 64;
	this.NEXT_N_YEARS = 71;
	this.LESS_EQUAL=22;
	this.GREATER_EQUAL=23;
	this.EMPTY = 29;
	this.CURRENT_NEXT_YEAR = 57;
	this.FILE_UPLOAD = 18;
	//FIELD CONSTANTS
	this.IMAGE = 20;
	this.URL = 21;
	this.PLAIN_TEXT = 14;
	this.SCRIPT = 15;
	this.MULTI_SELECT = 13;
	this.CHECK_BOX = 9;
	this.DATE=10;
	this.DATE_TIME=22;
	this.NUMBER=5;
	this.CURRENCY=6;
	this.PERCENTAGE=7;
	this.EMAIL=4;
	this.INLINE_SINGLE_SELECT = 29;
	this.SYSTEM_LOOKUP = 30;
	this.AUTO_NUMBER = 31;
	this.TEXT = 1;
	this.TEXT_AREA = 3;

	//client side js task
	this.RELOAD=1;
	this.CLEAR = 9;
	this.HIDE = 10;
	this.SHOW = 11;
    this.SET_VALUE = 12;
    this.ENABLE = 14;
	this.DISABLE = 15;
    this.PRINT_TASK = 71;
    this.OPEN_URL = 280;
	this.SELECT = 1001;
    this.DESELECT = 1002;
    this.SELECTALL = 1003;
    this.DESELECTALL = 1004;
    this.APPEND_VALUE = 1005;
    this.RESET_LOAD_LOOKUP_TASK=1006;
    this.ERROR_TASK=1007;
    this.ALERT = 1302;
  
    //Workflow Types
  	this.BUTTON_WFLOW_TYPE=51;
  	
	//REPLACE CONSTANTS
	this.REPLACE_NL_CHAR = "@@@NL@@@"; //No I18N
	this.REPLACE_DQ_CHAR = "@@@DQ@@@"; //No I18N
	this.REPLACE_SQ_CHAR = "@@@SQ@@@"; //No I18N
	this.REPLACE_DS_CHAR = "@@@DS@@@"; //No I18N
	this.FILTER_AMPERSAND_CONSTANT = ":zoho-ampersand:";//No I18N

	this.EXTERNAL_SERVICE_ZOHO_CRM = 1;
	this.EXTERNAL_SERVICE_SDP_OD = 3;

	/*** CRM & SDP Modules Module constants ***/
	this.ZOHO_CRM_LEADS = 1;
	this.ZOHO_CRM_ACCOUNTS = 2;
	this.ZOHO_CRM_POTENTIALS = 3;
	this.ZOHO_CRM_CONTACTS = 4;
	this.ZOHO_CRM_CAMPAIGNS = 5;
	this.ZOHO_CRM_TASKS = 6;
	this.ZOHO_CRM_EVENTS = 7;
	this.ZOHO_CRM_CASES = 8;
	this.ZOHO_CRM_SOLUTIONS = 9;
	this.ZOHO_CRM_PRODUCTS = 10;
	this.ZOHO_CRM_PRICEBOOKS = 11;
	this.ZOHO_CRM_QUOTES = 12;
	this.ZOHO_CRM_VENDORS = 13;
	this.ZOHO_CRM_PURCHASEORDERS = 14;
	this.ZOHO_CRM_SALESORDERS = 15;
	this.ZOHO_CRM_INVOICES = 16;
	this.ZOHO_CRM_NOTES = 17;
	this.ZOHO_CRM_USERS = 18;
	
    this.SDP_OD_TECHNICIANS = 1;
    this.SDP_OD_CATEGORY = 2;
    this.SDP_OD_STATUS = 3;
    this.SDP_OD_LEVEL = 4;
    this.SDP_OD_PRIORITY = 5;
    this.SDP_OD_REQUEST_TYPE = 6;
    this.SDP_OD_SITES = 7;
    this.SDP_OD_DEPARTMENTS = 8;
    this.SDP_OD_ASSETS = 9;
    this.SDP_OD_USERS = 10;

	/*** CRM & SDP Modules Display Names ***/
	this.ZOHO_CRM_LEADS_LINK_NAME = "Leads"; //No I18N
	this.ZOHO_CRM_ACCOUNTS_LINK_NAME = "Accounts"; //No I18N
	this.ZOHO_CRM_POTENTIALS_LINK_NAME = "Potentials"; //No I18N
	this.ZOHO_CRM_CONTACTS_LINK_NAME = "Contacts"; //No I18N
	this.ZOHO_CRM_CAMPAIGNS_LINK_NAME = "Campaigns"; //No I18N
	this.ZOHO_CRM_TASKS_LINK_NAME = "Tasks"; //No I18N
	this.ZOHO_CRM_EVENTS_LINK_NAME = "Events"; //No I18N
	this.ZOHO_CRM_CASES_LINK_NAME = "Cases"; //No I18N
	this.ZOHO_CRM_SOLUTIONS_LINK_NAME = "Solutions"; //No I18N
	this.ZOHO_CRM_PRODUCTS_LINK_NAME = "Products"; //No I18N
	this.ZOHO_CRM_PRICEBOOKS_LINK_NAME = "PriceBooks"; //No I18N
	this.ZOHO_CRM_QUOTES_LINK_NAME = "Quotes"; //No I18N
	this.ZOHO_CRM_VENDORS_LINK_NAME = "Vendors"; //No I18N
	this.ZOHO_CRM_PURCHASEORDERS_LINK_NAME = "PurchaseOrders"; //No I18N
	this.ZOHO_CRM_SALESORDERS_LINK_NAME = "SalesOrders"; //No I18N
	this.ZOHO_CRM_INVOICES_LINK_NAME = "Invoices";//No I18N
	this.ZOHO_CRM_NOTES_LINK_NAME = "Notes";//No I18N
	this.ZOHO_CRM_USERS_LINK_NAME = "Users";//No I18N
	
    this.SDP_OD_TECHNICIANS_LINK_NAME = "Technicians"; //No I18N
    this.SDP_OD_CATEGORY_LINK_NAME= "Category"; //No I18N
    this.SDP_OD_STATUS_LINK_NAME= "Status"; //No I18N
    this.SDP_OD_LEVEL_LINK_NAME= "Level"; //No I18N
    this.SDP_OD_PRIORITY_LINK_NAME= "Priority"; //No I18N
    this.SDP_OD_REQUEST_TYPE_LINK_NAME= "RequestType"; //No I18N
    this.SDP_OD_SITES_LINK_NAME= "Sites"; //No I18N
    this.SDP_OD_DEPARTMENTS_LINK_NAME= "Departments"; //No I18N
    this.SDP_OD_ASSETS_LINK_NAME= "Assets"; //No I18N
    this.SDP_OD_USERS_LINK_NAME= "Users"; //No I18N

        /*************Key Constants *************/
	this.NUMBERPAD_ZERO = 96;
	this.NUMBERPAD_NINE = 105;
	this.NUMBERPAD_MULTIPLY = 106;
	this.NUMBERPAD_ADD = 107;
	this.NUMBERPAD_SUBSTRACT = 108;
	this.NUMBERPAD_DIVIDE = 109;
	this.NUMBERPAD_DECIMAL = 110;
	this.KEYPAD_SEMICOLON = 186;
	this.KEYPAD_EQUAL = 187;
	this.KEYPAD_COMMA = 188;
	this.KEYPAD_DASH = 189;
	this.KEYPAD_COLON = 190;
	this.KEYPAD_FORWARDSLASH = 191;
	this.KEYPAD_GRAVEACCENT = 192;
	this.KEYPAD_OPENBRACE = 219
	this.KEYPAD_BACKSLASH = 220
	this.KEYPAD_CLOSEBRACE = 221
	this.KEYPAD_SINGLEQUOTE = 222
	this.KEYPAD_ZERO = 48;
	this.KEYPAD_NINE = 57;
	this.APLPHABET_A = 65;
	this.APLPHABET_Z = 90;
	this.BACKSPACE = 8;
	this.ENTER = 13;
	this.SPACE = 32;
	this.LEFT = 37;
	this.UP = 38;
	this.PAGEUP = 33;
	this.PAGEDOWN = 34;
	this.RIGHT = 39;
	this.DOWN = 40;
	this.DELETE = 46;
	this.ESCAPE = 27;
	this.TAB = 9;

	/******************** View Edit Constants ************/

		this.REL_OPR_LT = 11;
		this.REL_OPR_GT = 12;
		this.REL_OPR_LE = 13;
		this.REL_OPR_GE = 14;
		this.REL_OPR_EQ = 15;
		this.REL_OPR_NE = 16;
		this.REL_OPR_CONTAINS = 18;
		this.REL_OPR_NOTCONTAINS = 19;
		this.REL_OPR_STARTS_WITH=21;
		this.REL_OPR_ENDS_WITH=22;
		this.REL_OPR_EQUALS_IGNORE_CASE=23;
		this.REG_MATCHES=24;
		this.REG_FIND=25;
		this.YESTERDAY=31;
		this.TODAY=32;
		this.TOMORROW=33;
		this.LAST_7_DAYS=34;
		this.LAST_30_DAYS=35;
		this.LAST_60_DAYS=36;
		this.LAST_90_DAYS=37;
		this.LAST_120_DAYS=38;
		this.NEXT_7_DAYS=39;
		this.NEXT_30_DAYS=40;
		this.NEXT_60_DAYS=41;
		this.NEXT_90_DAYS=42;
		this.NEXT_120_DAYS=43;
		this.LAST_MONTH=44;
		this.THIS_MONTH=45;
		this.NEXT_MONTH=46;
		this.CURR_PREV_MONTH=47;
		this.CURR_NEXT_MONTH=48;
		this.LAST_YEAR=51;
		this.CURRENT_YEAR=52;
		this.NEXT_YEAR=53;
		this.PREVIOUS_2_YEAR=54;
		this.NEXT_2_YEAR=55;
		this.CURRENT_PREVIOUS_YEAR=56;
		this.CURRENT_NEXT_YEAR=57;
		this.THIS_WEEK=59;
		this.LAST_WEEK=60;
		this.NEXT_WEEK=61;

}

var ZCUtil = new function()
{
	this.isNull = function(value)
	{
		if(!value || value == "undefined" || typeof(value) == "undefined" || value == "NULL" || value == "null" || value.length == 0 || value == "")
		{
			return true;
		}
		return false;
	}

	this.evalJS = function(toEval)
	{
		var returnObj = toEval;
		if($.browser.msie)
		{
			returnObj = window.execScript(toEval,"javascript");	/*jshint ignore:line*/ // No I18N   
		}
		else
		{
			returnObj = window.eval(toEval);//jshint ignore:line
		}
		return returnObj;
	}

	this.evalImportJS = function(toEval)
	{
		return window.eval(toEval);//jshint ignore:line
	}

	this.evalJSONObject = function(toEvalObject)
	{
		return ZCUtil.evalImportJS("(" + toEvalObject + ")");
	}

	this.evalJSONArray = function(toEvalArray)
	{
		return ZCUtil.evalImportJS(toEvalArray);
	}

	this.escapeXml = function(value)
	{
		value = value.replace( /&lt+/g, "<" );
		value = value.replace( /&gt+/g, ">" );
		value = value.replace( /&quot;+/g, "\"" );
		value = value.replace( /&+/g, "&amp;" );
		return value;
	}

	this.getCompNameFromURL = function(compName)
	{
		var urlLink = window.location.hash;
		if(urlLink.indexOf("#") != -1)
		{
			var startIDX = 1;
			var endIDX = 5;
			if(urlLink.indexOf(":") != -1)
			{
				endIDX = urlLink.indexOf(":");
			}
			compName = urlLink.substring(startIDX, endIDX);
		}
		return compName;
	}

	this.getURLParams = function()
	{
		var befHash = window.location.search
		var afterHash = window.location.hash;
		var urlParams = (befHash.indexOf("?")!= -1)?befHash.substring(befHash.indexOf("?")+1)+"&":"";
		var crit = (afterHash.indexOf("?")!= -1)?afterHash.substring(afterHash.indexOf("?")+1):"";
		urlParams = urlParams + crit;
		return urlParams;
	}

	this.getParams = function(urlString)
	{
		return ((urlString.indexOf("?")!= -1)?urlString.substring(urlString.indexOf("?")+1):"");
	}

	this.getLinkNameFromURL = function(linkName)
	{
		return ZCUtil.getLinkName(window.location.hash);
	}

	this.getLinkName = function(urlLink)
	{
		var linkName = "";
		var hashIDX = urlLink.indexOf("#");
		if(hashIDX != -1)
		{
			var colonIDX = urlLink.indexOf(":");
			if(colonIDX != -1)
			{
				var startIDX = colonIDX + 1;
				linkName = $.trim(urlLink.substr(startIDX));
				if(urlLink.indexOf("?") != -1)
				{
					linkName = $.trim(linkName.substr(0, linkName.indexOf("?")));
				}
			}
		}
		return linkName;
	}

	this.setLinkNameInURL = function(compName, linkName, params)
	{
		if(params && params != "")
		{
			window.location.hash = "#" + compName + ":" + linkName + "?" + params;
		}
		else
		{
			window.location.hash = "#" + compName + ":" + linkName;
		}
	}

	this.getWindowObject = function(windowType)
	{
		var windowObj = window;
		if(windowType == "parent" || windowType == "parent window")
		{
			var parentWindow = window.opener;
			if(parentWindow == null)
			{
				windowObj = window.parent;
			}
			if(parentWindow != null)
			{
				windowObj = parentWindow;
			}
		}
		return windowObj;
	}

	this.setURLInLocationBar = function(urlString, setIn, timeout)
	{
		var windowObj = ZCUtil.getWindowObject(setIn);
		if(timeout && timeout > 0)
		{
			setTimeout(windowObj.location.href = urlString, timeout);
		}
		else
		{
			windowObj.location.href = urlString;
		}
	}

	this.changeURL = function(newloc)
	{
            if(!ZCApp.useRSH) {
                return;
            }
		var reload = ""; //No I18N

		if(newloc.indexOf("Script:") != 0)
		{
			ZCApp.prevURL = ZCApp.currURL;
			ZCApp.currURL = "#" + newloc;
		}
		dhtmlHistory.addHistory(newloc);

		if(ZCApp.prevURL != ZCApp.currURL)
		{
			reload ="true"; //No I18N
		}
		if(ZCApp.loadPage != "false")
		{
			ZCApp.scrollToTop = "true"
			ZCTemplate.loadPage(ZCUtil.getLinkName("#"+newloc), reload);
		}
		ZCApp.loadPage= "true" //No I18N
	}

	this.getAttrsAsArr = function(fieldValue,elType)
	{
		var attrArr = [];
		var value = fieldValue.replace(/'/g,"\"");
		var lower_value = value.toLowerCase();
		if(elType == "image")
		{
			if(lower_value.indexOf("<a") == 0)
			{
				if(lower_value.indexOf("href") != -1)
				{
					var source_point = lower_value.indexOf("href", 0);
					var source = value.substring(source_point+1);
					var start_link = source.indexOf("\"" , 0);
					var end_link = source.indexOf("\"", start_link+1);
					var linkname = source.substring(start_link+1,end_link);
					attrArr["zcfieldlink-"] = linkname;
					// if url has value initially set target into same
					attrArr["target"] = "same"; //No I18N
				}
				if(lower_value.indexOf("title") != -1)
				{
					var source_point = lower_value.indexOf("title", 0);
					var source = value.substring(source_point+1);
					var title1 = source.indexOf("\"" , 0);
					var title2 = source.indexOf("\"", title1+1);
					var img_title = source.substring(title1+1,title2);
					attrArr["zctitle-"] = img_title;
				}
				if(lower_value.indexOf("target") != -1)
				{
					var source_point = lower_value.indexOf("target", 0);
					var source = value.substring(source_point+1);
					var tar1 = source.indexOf("\"" , 0);
					var tar2 = source.indexOf("\"", tar1+1);
					var img_tar = source.substring(tar1+1,tar2);
					attrArr["target"] = (img_tar.toLowerCase().indexOf("blank") != -1)?"new":"same";
				}
				if(lower_value.indexOf("src") != -1)
				{
					var source_point = lower_value.indexOf("src", 0);
					var source = value.substring(source_point+1);
					var img = source.indexOf("\"" , 0);
					var img1 = source.indexOf("\"", img+1);
					var img_src = source.substring(img+1,img1);
					attrArr["zcsource-"] = img_src;
				}

				if(lower_value.indexOf("alt") != -1)
				{
					var source_point = lower_value.indexOf("alt", 0);
					var source = value.substring(source_point+1);
					var img = source.indexOf("\"" , 0);
					var img1 = source.indexOf("\"", img+1);
					var img_alt = source.substring(img+1,img1);
					attrArr["zcalttext-"] = img_alt;
				}
			}
			else if(lower_value.indexOf("<img") == 0)
			{
				if(lower_value.indexOf("src") != -1)
				{
					var source_point = lower_value.indexOf("src", 0);
					var source = value.substring(source_point+1);
					var img = source.indexOf("\"" , 0);
					var img1 = source.indexOf("\"", img+1);
					var img_src = source.substring(img+1,img1);
					attrArr["zcsource-"] = img_src; //No I18N
				}

				if(lower_value.indexOf("alt") != -1)
				{
					var source_point = lower_value.indexOf("alt", 0);
					var source = value.substring(source_point+1);
					var img = source.indexOf("\"" , 0);
					var img1 = source.indexOf("\"", img+1);
					var img_alt = source.substring(img+1,img1);
					attrArr["zcalttext-"] = img_alt; //No I18N
				}
			}
		}
		else
		{
			if(lower_value.indexOf("href") != -1)
			{
				var source_point = lower_value.indexOf("href", 0);
				var source = value.substring(source_point+1);
				var url = source.indexOf("\"" , 0);
				var url1 = source.indexOf("\"", url+1);
				var url_src = source.substring(url+1,url1);
				attrArr["zcurl-"] = url_src; //No I18N
				// if url has value initially set target into same
				attrArr["target"] = "same"; //No I18N
			}
			if(lower_value.indexOf("title") != -1)
			{
				var source_point = lower_value.indexOf("title", 0);
				var source = value.substring(source_point+1);
				var title = source.indexOf("\"" , 0);
				var title1 = source.indexOf("\"", title+1);
				var title_src = source.substring(title+1,title1);
				attrArr["zctitle-"] = title_src; //No I18N
			}
			if(lower_value.indexOf("target") != -1)
			{
				var source_point = lower_value.indexOf("target", 0);
				var source = value.substring(source_point+1);
				var tar1 = source.indexOf("\"" , 0);
				var tar2 = source.indexOf("\"", tar1+1);
				var url_tar = source.substring(tar1+1,tar2);
				attrArr["target"] = (url_tar.toLowerCase().indexOf("blank") != -1)?"new":"same"; //No I18N
			}
			var name1 = value.indexOf(">",0);
			var name2 = value.indexOf("<",name1);
			var url_name = value.substring(name1+1,name2);
			attrArr["zclnkname-"] = url_name; //No I18N
		}
		return attrArr;
	}

	this.getParamsAsArray = function(params, delimeter, opr)
	{
		var retArray = new Array();
		params = $.trim(params);
		if(params == "")
		{
			return retArray;
		}

		delimeter = ZCUtil.isNull(delimeter)?"&":delimeter;
		opr = ZCUtil.isNull(opr)?"=":opr;

		var paramsArray = params.split(delimeter);
		$.each(paramsArray, function(idx, val)
		{
			var oprIdx = val.indexOf(opr);
			if(oprIdx != -1)
			{
				val = val.substr(oprIdx+1);
			}
			retArray[idx] = $.trim(val);
		});
		return retArray;
	}

	this.getParamsAsMap = function(params, delimeter, opr)
	{
		params = $.trim(params);
		if(params == "") {
			return new Object();
		}

		delimeter = ZCUtil.isNull(delimeter)?"&":delimeter;
		opr = ZCUtil.isNull(opr)?"=":opr;
		var paramsArray = params.split(delimeter);
		var paramsMap = new Object();
		for(var count = 0; count < paramsArray.length; count ++)
		{
			var curParam = paramsArray[count];
			var keyName = $.trim(curParam.substring(0, curParam.indexOf(opr)));
			var keyValue = $.trim(curParam.substring((curParam.indexOf(opr) + 1), curParam.length));
			if(keyValue.indexOf(";") != -1 && params.indexOf(keyName+"_op") == -1 && keyName != "sortBy" && keyName != "renameColumns" && keyName != "groupBy" && keyName != "showColumns" && keyName != "hideColumns" && keyName != "filterVal" && keyName != "summationColumns" && keyName != "linkviewColumns")
			{
				var tempVal = keyValue;
				keyValue = "";
				var tempArr = tempVal.split(";");
				$.each(tempArr, function(index, value)
				{
					keyValue = (index == tempArr.length-1)?keyValue + $.trim(value):keyValue + $.trim(value) + ",";
				});
			}
			if(paramsMap[keyName] == null)
			{
				paramsMap[keyName] = new Array();
			}
			var val = paramsMap[keyName];
			while(keyValue.indexOf("#zc_amp#")!= -1)
			{
			keyValue=keyValue.replace("#zc_amp#","&");
			}
			val[val.length] = keyValue;
		}
		return paramsMap;
	}

	this.getParamsFromArray = function(paramsArr, paramName)
	{
		var params = "";
		$.each(paramsArr, function(index, value)
		{
			var tempParams = (params.length > 0)?"&" + paramName + "=" + value:paramName + "=" + value;
			params = params + tempParams;
		});
		return params;
	}

	this.setParamsInMap = function(paramsMap, params, delimeter, opr)
	{
		delimeter = ZCUtil.isNull(delimeter)?"&":delimeter;
		opr = ZCUtil.isNull(opr)?"=":opr;

		var paramsArr = params.split(delimeter);
		$.each(paramsArr, function(index, curParam)
		{
			var keyName = $.trim(curParam.substring(0, curParam.indexOf(opr)));
			var keyValue = $.trim(curParam.substring((curParam.indexOf(opr) + 1), curParam.length));
			if(!ZCUtil.isNull(keyValue))
			{
				ZCUtil.setInMap(paramsMap, keyName, keyValue);
			}
		});
		return paramsMap;
	}

	this.getParamsFromMap = function(viewParamsMap)
	{
		var params = "";
		$.each(viewParamsMap, function(name, value)
		{
			if(!ZCUtil.isNull(value))
			{
				var tempParams = (params.length > 0)?"&" + name + "=" + value:name + "=" + value;
				params = params + tempParams;
			}
		});
		return params;
	}

	this.getFromMap = function(paramsMap, keyName)
	{
		try {
			return paramsMap[keyName][paramsMap[keyName].length-1]
		} catch(e) {return "";}
	}
               
               this.checkMapForKeyValue = function(paramsMap, keyName, keyValue)
               {
                   var contains = false;
                   if(paramsMap[keyName] != null)
                    {
                            var value = ZCUtil.getFromMap(paramsMap, keyName);
                            contains = (keyValue == value);
                    }
                   return contains;
               }
	this.setInMap = function(paramsMap, keyName, keyValue)
	{
		if(paramsMap[keyName] == null)
		{
			var val = new Array();
			val[val.length] = keyValue;
			paramsMap[keyName] = val;
		}
		else
		{
			paramsMap[keyName][paramsMap[keyName].length-1] = keyValue;
		}
		return paramsMap;
	}

	this.removeFromMap = function(paramsMap, keyName)
	{
		paramsMap[keyName] = null;
	}

	this.replaceInParam = function(oldParams, keyName, keyVal, remove)
	{
		var newParams = "";
		$.each(oldParams.split(";"), function(index, value)
		{
			var valToCheck = (value.indexOf(":") != -1)?value.substring(0, value.indexOf(":")):value;
			value = (valToCheck == keyName)?remove?"":keyName+":"+keyVal:value;
			if(value != "") newParams = newParams + value + ";";
		});
		return newParams;
	}

	this.removeFromArray = function(arrToCheck, keyName)
	{
		$.each(arrToCheck, function(index, value)
		{
			if(!value) return;
			if(keyName == value || value.indexOf(keyName) != -1) arrToCheck.splice(index, 1);
		});
		return arrToCheck;
	}

	this.contains = function(arrToCheck, value)
	{
		var contains = false;
		$.each(arrToCheck, function(index, item)
		{
			contains = ($.trim(String(item)) == $.trim(String(value)))?true:contains;
		});
		return contains;
	}

	this.createElem = function(tagName, attrStr, innerHtml)
	{
		var attrMap = ZCUtil.getParamsAsMap(attrStr, ",", "=");
		var el = document.createElement(tagName);
		$.each(attrMap, function(name, value)
		{
			if(name.length > 1) $(el).attr(name, value);
		});
		$(el).html(innerHtml);
		return $(el);
	}

	this.createInputElem = function(name,value)
	{
		var el = document.createElement('input');
		$(el).attr("name", name);
		$(el).attr("value", value);
		return $(el);
	}

	this.findPosX = function (obj)
	{
		var curleft = 0;
		if (document.getElementById || document.all) {
			curleft += document.body.offsetLeft;
			while (obj.offsetParent) {
				curleft += obj.offsetLeft;
				obj = obj.offsetParent;
			}
			curleft += obj.offsetLeft; // this for chrome fix to make the top link menus to occur in right position
		}
		else if (document.layers) {
			curleft += obj.x;
		}
		return curleft;
	}

	this.findPosY = function (obj)
	{
		var curtop = 0;
		if (document.getElementById || document.all) {
			curtop += document.body.offsetTop;
			while (obj.offsetParent) {
				curtop += obj.offsetTop;
				obj = obj.offsetParent;
			}
			curtop += obj.offsetTop;// this for chrome fix to make the top link menus to occur in right position
		} else if (document.layers) {
			curtop += obj.y;
		}
		return curtop;
	}

	this.setPositionToCenter = function(elem) {
		var xpos = 0, ypos = 0;
		if($.browser.msie) {
			xpos = getIEScrollLeft() + (getIEClientWidth()/2) - (elem.clientWidth/2);
			ypos = getIEScrollTop() + (getIEClientHeight()/2) - (elem.clientHeight/2);
		} else {
			xpos = window.pageXOffset + (window.innerWidth/2) - elem.clientWidth/2;
			ypos = window.pageYOffset + (window.innerHeight/2) - elem.clientHeight/2;
		}
		elem.style.left = (xpos) + "px";
		elem.style.top = (ypos)  + "px";
	}

	this.setPositionToTop = function(elem, ycorr) {
		var xpos = 0, ypos = 0;
		if(!ycorr) ycorr = 0;
		if($.browser.msie) {
			xpos = getIEScrollLeft() + (document.body.clientWidth/2) - (elem.clientWidth/2);
			//xpos = document.body.scrollLeft  - (elem.clientWidth);
			ypos = getIEScrollTop();// + (document.body.clientHeight/2) - (elem.clientHeight/2);
		} else {
			xpos = window.pageXOffset + (window.innerWidth/2) - elem.clientWidth/2;
			ypos = window.pageYOffset; // + (window.innerHeight/2) - elem.clientHeight/2;
		}
		elem.style.left = (xpos) + "px";
		elem.style.top = (ypos + ycorr)  + "px";
	}

	this.showMenu = function(menuEl, xPos, yPos, anim)
	{
		var screenWidth = getWindowWidth();
		var offset = $(window)['scrollLeft']();
		menuEl.style.left = xPos + "px";
		menuEl.style.top = yPos + "px";
		$(menuEl).show();
		$($(menuEl).find("td[elName=zc-viewOptionsHeight]")[0]).height($(menuEl).height()-20);
		$(menuEl.parentNode).find("span[elName=rightArr]").show();
		$(menuEl.parentNode).find("span[elName=leftArr]").hide();
		if(xPos + menuEl.clientWidth >= screenWidth + offset) {
			menuEl.style.left = (screenWidth - menuEl.clientWidth + offset) +  "px";
			$(menuEl.parentNode).find("span[elName=rightArr]").hide();
			$(menuEl.parentNode).find("span[elName=leftArr]").show();
		}
	}

	this.showDropDownMenu = function(srcEl, menuEl, anim)
	{
		var xPos = ZCUtil.findPosX(srcEl);
		var yPos = ZCUtil.findPosY(srcEl) + srcEl.offsetHeight;
		ZCUtil.showMenu(menuEl, xPos, yPos, anim);
	}

	this.showMenuRight = function(srcEl, menuEl)
	{
		var xPos = ZCUtil.findPosX(srcEl) + srcEl.offsetWidth;
		var yPos = ZCUtil.findPosY(srcEl);
		ZCUtil.showMenu(menuEl, xPos, yPos);
	}

	this.showMenuLeft = function(srcEl, menuEl)
	{
		menuEl.style.display = "block";
		var xPos = ZCUtil.findPosX(srcEl) - menuEl.offsetWidth;
		var yPos = ZCUtil.findPosY(srcEl);
		ZCUtil.showMenu(menuEl, xPos, yPos);
	}

	this.hideMenu = function(srcEl, menuEl)
	{
		if(menuEl) menuEl.style.display = "none";
	}

	this.showSubMenu = function(srcEl, menuEl, event)
	{
		if(ZCUtil.checkFromSameElem(srcEl, event)) return;
		var xPos = ZCUtil.findPosX(srcEl);
		var offset = $(window)['scrollLeft']();

		var menuRightPos = xPos + srcEl.clientWidth
		var screenWidth = getWindowWidth();
                if(xPos + offset > screenWidth)
                {
                    offset = 0;
                }
		var corr = 1;
		if($.browser.msie) corr = 20;
		menuEl.style.left = (srcEl.offsetWidth - corr) + "px";
		var menutop = ZCUtil.findPosY(srcEl);
		//this line commented to fix the saveChanges submenu options are not clickable in chrome
		//menuEl.style.top =  (menutop - ZCUtil.findPosY(srcEl.parentNode)) + "px";
		$(menuEl).show();
		$($(menuEl).find("td[elName=zc-viewSubOptionsHeight]")[0]).height($(menuEl).height()-20);

		var avlHeight = getWindowHeight() - menutop - 20;
		if(avlHeight < $(menuEl).height()) menuEl.style.height = avlHeight + "px";
		$(menuEl).width($($(menuEl).children()[0]).width()+16);
		if((menuRightPos + menuEl.clientWidth) > screenWidth + offset) {
			corr = 22;
			if($.browser.msie) corr = 16;
			menuEl.style.left = (1 - srcEl.offsetWidth - ($(menuEl).width() - $(srcEl).width() - corr)) + "px";
			$(srcEl.parentNode).find("span[elName=leftArr]").show();
			$(srcEl.parentNode).find("span[elName=rightArr]").hide();
		} else {
			$(srcEl.parentNode).find("span[elName=rightArr]").show();
			$(srcEl.parentNode).find("span[elName=leftArr]").hide();
		}
	}

	this.hideSubMenu = function(srcEl, menuEl, event)
	{
		if(ZCUtil.checkFromSameElem(srcEl, event)) return;
		menuEl.style.display = "none";
	}

	this.checkFromSameElem = function(srcEl, event) {
		if (!event) var event = window.event;
		var relTarg = event.relatedTarget || event.fromElement;
                                if ($.browser.msie) {
                                    switch (event.type) {
                                        case 'mouseover':
                                        case 'mouseenter':
                                            relTarg = event.fromElement;
                                            break;
                                        case 'mouseout':
                                        case 'mouseleave':
                                            relTarg = event.toElement;
                                            break;
                                        }
                                }
		if(ZCUtil.isParent(relTarg, srcEl, 20)) {
			return true;
		}
		return false;
	}

	this.getParent = function(srcEl, parentType)
	{
		if(ZCUtil.isNull(parentType)) parentType = "";
		for(var count = 0; $(srcEl).parent()[0]; count++)
		{
			var retel = $(srcEl).parent(parentType);
			if(retel[0]) return retel;
			srcEl = $(srcEl).parent();
			if(count > 10) return;
		}
	}

	this.isParent = function(elem, parentElem, deepCount)
	{
		if(ZCUtil.isNull(deepCount)) deepCount = 10;
		for(var count = 0; $(elem).parent()[0]; count++)
		{
			var elem = $(elem).parent();
			if(elem[0] == parentElem) return true;
			if(count > deepCount) return false;
		}
		return false;
	}
	this.sendRequest = function(url, urlParams, resptype, callback, args, msg, hideLoading)
	{
		if(!ZCUtil.isNull(msg)) ZCApp.setLoadingMsg($("#zc-loading"), msg + " ...");
		var elem = $("#zc-loading");
		var loadingElem = elem.find('[loading=true]');
		if(loadingElem.length == 0) loadingElem = elem.find('[loading=false]');
                
		if(!hideLoading) {
			loadingElem.attr('loading', "true");
		} else {
			loadingElem.attr('loading', "false");
		}

		if(!hideLoading) ZCApp.showLoading("zc-loading");

		var params = ((urlParams.indexOf("sharedBy=") == -1)?"sharedBy="+ZCApp.sharedByDisp+"&":"") + ((urlParams.indexOf("appLinkName=") == -1)?"appLinkName="+ZCApp.appLinkName+"&":"");//No I18N
		if(ZCUtil.contains(ZCApp.csrfArray, url) && urlParams.indexOf(ZCApp.csrfParamName) == -1)
		{

			params = params + ZCApp.csrfParamName + "=" + ZCApp.csrfParamValue + "&";
		}
		params = params + urlParams;
		var paramsPos = ZCUtil.getEmptyIDX(ZCApp.paramsArr);
		ZCApp.paramsArr[paramsPos] = ZCUtil.getParamsAsMap(params);
		var argsPos = ZCUtil.getEmptyIDX(ZCApp.paramsArr);
		ZCApp.paramsArr[argsPos] = args;
               
                                
               /*                 if(ZCApp.cacheArr[url] != undefined)
                                {
                                    var paramsMap = JSON.parse(JSON.stringify(ZCApp.cacheArr[url]));
                                    var userparamsMap = ZCUtil.getParamsAsMap(params);
                                    var tmpParamMap = [];
                                    $.each(userparamsMap, function(key, val)
                                    {   
                                        for(var i=0; i<paramsMap.length; i++)
                                        {
                                            if(ZCUtil.checkMapForKeyValue(paramsMap[i], key, val))
                                            {
                                                var idx = tmpParamMap.length;
                                                tmpParamMap[idx] = paramsMap[i];
                                                delete tmpParamMap[idx][key];
                                            }
                                        }
                                        paramsMap = tmpParamMap;
                                        tmpParamMap = [];
                                    });
                                    
                                    var responseText = null;
                                    for(var i=0; i<paramsMap.length; i++)
                                    {
                                        if(Object.keys(paramsMap[i]).length == 1)
                                        {
                                            responseText = ZCUtil.getFromMap(paramsMap[i], "#resultText");
                                        }
                                    }
                                    if(responseText != null)
                                    {
                                        var respPos = ZCUtil.getEmptyIDX(ZCApp.respArr);
                                        ZCApp.respArr[respPos] = responseText;
                                        ZCApp.hideLoading("zc-loading");
                                        callbackFunc = new Function(callback + "(ZCApp.respArr["+respPos+"], ZCApp.paramsArr["+paramsPos+"], ZCApp.paramsArr["+argsPos+"])");
                                        callbackFunc();
                                        console.log("Cache ::: " + url + "::::" + params);
                                        return false;
                                    }
                                }
                                */
                
		jQuery.post(url, params, function(responseText, result)
		{
                                                //console.log("Server ::: " + url + "::::" + params);
			if(result == "success")
			{
				var respPos = ZCUtil.getEmptyIDX(ZCApp.respArr);
                                   /*                             var paramsMap = ZCUtil.getParamsAsMap(params);
                                                                ZCUtil.setInMap(paramsMap, "#resultText" ,responseText);
                                                                var length = 0;
                                                                if(ZCApp.cacheArr[url] == undefined)
                                                                {
                                                                        ZCApp.cacheArr[url] = [];
                                                                }
                                                                else
                                                                {
                                                                    length = ZCApp.cacheArr[url].length;
                                                                }
                                                                ZCApp.cacheArr[url][length] =paramsMap;*/
				ZCApp.respArr[respPos] = responseText;
				ZCApp.hideLoading("zc-loading");
                callbackFunc = new Function(callback + "(ZCApp.respArr["+respPos+"], ZCApp.paramsArr["+paramsPos+"], ZCApp.paramsArr["+argsPos+"])");//jshint ignore:line
                callbackFunc();
			}
			else
			{
				ZCApp.hideLoading("zc-loading");
				alert(i18n.failedreq);
			}
		}, resptype);

		return false;
	}

	this.getEmptyIDX = function(arr)
	{
		var idx = arr.length;
		$.each(arr, function(index, el)
		{
			if(ZCUtil.isNull(el))
			{
				idx = index;
				return;
			}
		});
		return idx;
	}

	this.toggleRadio = function(elName, labelEl, triggerOnClick)
	{
		var parentEl = ZCUtil.getParent(labelEl);
		var radioEl = parentEl.find("input[elName='"+elName+"']");
		if(!radioEl[0])
		{
			radioEl = parentEl.find("input[name='"+elName+"']");
		}
		if(!$(radioEl).attr("disabled") && $(radioEl).attr("disabled") != "disabled")
		{
			$(radioEl).prop("checked", ($(radioEl).attr("type") == "radio")?true:!$(radioEl).is(":checked"));
			if(ZCUtil.isTrue(triggerOnClick))
			{
				$(radioEl).click();
			}
			else
			{
				$(radioEl).change();
			}
		}
	}

	this.getFieldsAsParams = function(frm, critStr)
	{
		var params = "";
		var hasSubformCompositeField = false;
		$.each($(frm).find(critStr), function(index, field)
		{
			//EXCLUDING SUBFORM PARAMS

			var isSubFormParam = false;
			$.each($(field).parents('div[formType=SubForm]'), function(a,b)
			{
					isSubFormParam = true;
			});
			
			if($(field).parents('div[type=composite][elName=subformComposite]').length > 0)
			{
				hasSubformCompositeField = true;
				return true;
			}
			
			if(isSubFormParam && $(frm).attr('elName') != "subFormContainer")
				return true;
			//Get xml string form subform input values
			if($(field).attr("elName") == "subforminput")
			{
				var sfDiv = $(field).parents('div[elName=subformdiv]');
				var isGrid = $(sfDiv).attr("dispType");
				if(parseInt(isGrid) == ZCConstants.GRID_TYPE)
					return true;
				return true;
			}
			if(field.type == "select-multiple" || field.type == "multiselect")
			{
				$.each(ZCUtil.getFieldValue(field), function(idx, val)
				{
					if(!ZCUtil.isNull(val)) params = params + $(field).attr("name") + "=" + encodeURIComponent(val) + "&";
				});
			}
			else
			{
				var val = ZCUtil.getFieldValue(field);
				if(ZCUtil.isNull(val))
				{
					val = "";
				}
				if($(field).attr("fieldtype") == 24 && val.length == 4 && val =="<br>")// handled empty <br> insert in RTF fields // No I18N
				{
					val="";  // No I18N
				}
				if(($(field).attr("type") != "radio" && $(field).attr("type") != "checkbox") || !ZCUtil.isNull(val))
				{
					params = params + $(field).attr("name") + "=" + encodeURIComponent(val) + "&";
				}
			}
		});
		if(hasSubformCompositeField)
		{
			$(frm).find('div[elName=subformdiv]').each(function(){
				$(this).find('tr[elName=dataRow]').each(function(){
					$(this).find('td[elName=zc-fieldtd]').each(function(){
						var compositeDiv = $(this).find('div[elName=subformComposite][type=composite]');
						if(compositeDiv.length > 0)
						{
							var compParam = {};
							$(compositeDiv).find(':input').each(function(){
								compParam[$(this).attr('name')]= encodeURIComponent($(this).val());
								
							});
							params = params + compositeDiv.attr('compositeName') + "=" + JSON.stringify(compParam) + "&";
						}
					});
				});
			});
		}
		params = (params != "")?params.substring(0, params.length-1):params;
		return params;
	}

	this.parseJSONResponse = function(json)
	{
		var respArr = [];
		$.each(json, function(idx, item)
		{
			$.each(item, function(key, val)
			{
				respArr[key] = val;
			});
		});
		return respArr;
	}
	this.changeHref = function(compLinkName, compName)
	{
		compName = !compName?ZCApp.compProps["compName-"+ZCUtil.getFromMap(ZCApp.compNameVsTypeMap, compLinkName)]:compName
		var toRet = "/"+ZCApp.sharedByDisp+"/"+ZCApp.appLinkName+"/#"+compName+":"+compLinkName;
		window.location.href = toRet;
		return toRet;
	}

	this.css = function(el, prop) {
		var ret = parseInt($(el).css(prop), 10);
		return (isNaN(ret)? 0:ret);
	}

	this.width = function(el) {
		return $(el).width() + this.css($(el), 'paddingLeft') + this.css($(el), 'paddingRight');
	}

	this.removeInfoHdr = function()
	{
		var dialogTbl = $("#"+_DIALOG_LAYER_VAR).find(".DialogBox");
		dialogTbl.find("tr:first").remove();
		dialogTbl.find("tr:last").remove();
	}

	this.showDialog = function(msg, includeHdr, options)
	{
		if(includeHdr == "true")
		{
			msg = ZCApp.dialogAbove+msg+ZCApp.dialogBelow;
		}
		var dlgOptions = "closeButton=no";	// No I18N
		if(!ZCUtil.isNull(options))
		{
			dlgOptions += ", " + options;
		}
		ZCUtil.showInDialog(msg, dlgOptions);
		ZCUtil.removeInfoHdr();
	}

	this.showdialogInIframe = function(dialogContent, dialogOptions, paramsMap, callBackFunc, closeClBk)
	{
		ZCDialogLayer.showDialog(dialogContent, dialogOptions, paramsMap, callBackFunc, closeClBk);

		if(typeof(ZCForm.windowScrollTop) != "undefined" && typeof(ZCForm.offsetTop) != "undefined")
		{
			var formWidth = getWindowWidth();
			var formHeight = getWindowHeight();
			var formXCenter = formWidth/2;
			var formYCenter = ZCForm.windowScrollTop-ZCForm.offsetTop;

			if((formHeight-formYCenter) > 300)
			{
				formYCenter = formYCenter + 300;
			}

			var dialHeight = $('#'+_DIALOG_LAYER_VAR).height();
			var dialWidth = $('#'+_DIALOG_LAYER_VAR).width();

			$('#'+_DIALOG_LAYER_VAR).css('top',formYCenter - (dialHeight/2));
			$('#'+_DIALOG_LAYER_VAR).css('left',formXCenter - (dialWidth/2));
		}
	}

	this.showInDialog = function(dialogMsg, options, paramsMap, callBackFunc, closeClBk)
	{
		if(ZCForm.isEmbeddedForm == "true")
		{
			ZCForm.getParamsFromIfrme();
			ZCUtil.showdialogInIframe(dialogMsg, options, paramsMap, callBackFunc, closeClBk);
		}
		else
		{
			ZCDialogLayer.showDialog(dialogMsg, options, paramsMap, callBackFunc, closeClBk);
		}
	}

	this.replaceCls = function(el, toReplace, replaceWith)
	{
		var cls = $(el).attr("class");
		$(el).attr("class", cls.replace(toReplace, replaceWith));
	}

	this.getFieldValue = function(field)
	{
		switch($(field).attr("type"))
		{

			case "select-multiple":
			case "multiselect":
			{
				var multival = [];
				$.each($(field).find("option"), function(idx, opt)
				{
					if($(opt).prop("selected") || $(opt).prop("selected") == "true")
					{
						multival.push($(opt).val());
					}
				});
				return multival;
			}
			case "radio":
			case "checkbox":
			{
				if($(field).attr("fieldtype") == ZCConstants.CHECK_BOX)
				{
					if($(field).is(":checked"))
					{
						return "zc_checked"; //No I18N
					}
					else
					{
						return "zc_unchecked"; //No I18N
					}
				}
				else
				{
					if($(field).is(":checked"))
					{
						return $(field).val();
					}
				}
				break;
			}
			default:
			{
				return $(field).val();
			}
		}
	}

	this.getWidthForText= function(txt) {
		var t = document.createElement('table');
		var tb = document.createElement('tbody');
		var r = document.createElement('tr');
		var c = document.createElement('td');
		t.appendChild(tb);
		tb.appendChild(r);
		r.appendChild(c);
		c.innerHTML = txt;
		c.style.width='1px';
		t.style.width='1px';
		c.style.whiteSpace = 'normal';
		document.body.appendChild(t);
		var toRet = $(c).width();
		document.body.removeChild(t);
		return toRet;
	}

	this.appendStrIfNotExist = function(appendTo, appendStr, checkStr)
	{
		if(!checkStr) checkStr = appendStr;
		if(appendTo.indexOf(checkStr) == -1)
		{
			appendTo += appendStr;
		}
		return appendTo;
	}

	this.goToTop = function(animate)
	{
		if(animate)
		{
			$('html,body').animate({scrollTop: 0}, 1000);
		}
		else
		{
			$(window).scrollTop(0);
		}
	}

	this.isHidden = function(elToCheck)
	{
		return $(elToCheck).is(":hidden");
	}

	this.isTrue = function(valToCheck)
	{
		return (valToCheck && valToCheck.toString() == "true");
	}
	
	this.isValueKeyPressed = function(e)
	{
		var keycode = e.keyCode;
		if(
			(keycode >= ZCConstants.KEYPAD_ZERO && keycode <= ZCConstants.KEYPAD_NINE) ||
			(keycode >= ZCConstants.APLPHABET_A && keycode <= ZCConstants.APLPHABET_Z) ||
			(keycode >= ZCConstants.NUMBERPAD_ZERO && keycode <= ZCConstants.NUMBERPAD_DECIMAL) ||
			(keycode >= ZCConstants.KEYPAD_SEMICOLON && keycode <= ZCConstants.KEYPAD_GRAVEACCENT) ||
			(keycode >= ZCConstants.KEYPAD_OPENBRACE && keycode <= ZCConstants.KEYPAD_SINGLEQUOTE) ||
			keycode === ZCConstants.BACKSPACE || keycode === ZCConstants.DELETE || keycode === ZCConstants.SPACE
		)
		{
			return true;
		}
		return false;
	}
}();
var BetaFeature = new function()
{
	this.featureUpdate = function(feature)
	{
		var mode;
		if($(feature).text().trim()==="Enable")
		{
			$(feature).removeClass( "bg_green" ).addClass( "bg_default" );
			mode = 1;
			$(feature).text("Disable");
		}
		else
		{
			$(feature).removeClass( "bg_default" ).addClass( "bg_green" );
			mode = 0;
			$(feature).text("Enable");
		}
		$.post( "/featureUpdate.do",{
			sharedBy : ZCApp.sharedByDisp,
			featureId : $(feature).attr('featureId'),
			mode : mode
			},function() {
		});
		
		var a = parseInt($('#notifyCount').text())
		if(mode === 1){
			a = a-1;
		}
		else{
			a = a+1;
		}
		$('#notifyCount').text(a);
		if(a === 0){
			$('#notifyCount').hide();
		}
		if(a > 0){
			$('#notifyCount').show();
		}
	}
	this.setCookie = function ()
	{
		var d = new Date();
		d.setTime(d.getTime()+(24*60*60*1000));
		var expires = "expires="+d.toString();
		document.cookie = "BetaFeature=1" + "; " + expires +";path=/";
	}
	this.getCookie = function ()
	{
		var name = "BetaFeature=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) 
		{
		  var c = ca[i].trim();
		  if (c.indexOf(name)===0){
			  return c.substring(name.length,c.length);
		  }
		}
		return "";
	}
}();
var ZCApp = new function()
{
                this.cacheArr = [];
	this.respArr = [];
	this.htmlArr = [];
	this.currURL = "#";
	this.compProps = [];
	this.paramsArr = [];
	this.pageVsHideMap = new Object();
	this.pageVsCompNameMap = new Object();
	this.compNameVsTypeMap = new Object();
	this.compNameVsPageMap = new Object();
	this.compNameVsLinkIDMap = new Object();
	this.compNameVsCompDispName = new Object();
        this.formCompIDVsDispName = new Object();
        this.formCompIDVsPageID = new Object();
        this.InZCformsIDs = [];
	this.compProps["compName-"+ZCConstants.PAGE] =  "Page";
	this.compProps["compName-"+ZCConstants.FORM] =  "Form";
	this.compProps["compName-"+ZCConstants.VIEW] =  "View";
	this.compProps["compName-"+ZCConstants.REPORT] = "Report" // NO I18N
	this.compProps["compName-"+ZCConstants.SCRIPT] =  "Script";
	this.compProps["compName-"+ZCConstants.HTML_PAGE] = "View"
	this.compProps["paramName-"+ZCConstants.FORM] =  "formLinkName";
	this.compProps["paramName-"+ZCConstants.VIEW] =  "viewLinkName";
	this.compProps["paramName-"+ZCConstants.REPORT] = "reportLinkName" // NO I18N
	this.compProps["paramName-"+ZCConstants.HTML_PAGE] = "viewLinkName";
	this.compProps["actionURL-"+ZCConstants.FORM] =  "/liveFormHeader.do";
	this.compProps["actionURL-"+ZCConstants.VIEW] =  "/liveViewHeader.do";
	this.compProps["actionURL-"+ZCConstants.REPORT] =  "/liveReportHeader.do"; // NO I18N
	this.compProps["actionURL-"+ZCConstants.HTML_PAGE] = "/liveViewHeader.do";
	this.csrfArray = new Array("/getPrivateLink.do", "/copyApp.do", "/addRecordValidateNew.do", "/addRecordValidate.do", "/addrecord.do", "/editrecord.do", "/editrecordNew.do", "/editbulkrecord.do", "/editbulkrecordNew.do", "/duplicaterecordaction.do", "/duplicaterecordactionNew.do", "/gridRecordAction.do", "/gridRecordActionNew.do","/deleterecordaction.do", "/deleterecordactionNew.do","/uploadFile.do", "/saveNewView.do", "/generateJS.do", "/home/rateApp", "/home/addReviews", "/ccvalidation.do","/validateSubForm.do", "/importFormData.do", "/formpaymentprocess.do", "/setCriteria.do", "/colupdate.do","/setFilters.do", "/updateCalEvent.do");
	this.dialogAbove = "<div elname='zc-dialogheader' class=\"zc-dialogheader\" onmousedown=\"captureDialog(event)\" ><table cellspacing=\"0\"><tr><td class=\"zc-dialog-left\"></td><td class=\"zc-dialog-right\" onclick=\"ZCApp.closeDialog();\" onmouseover=\"this.className='zc-dialog-right-hover';\" onmouseout=\"this.className='zc-dialog-right';\">Close</td></tr></table></div><div class=\"zc-dialogdiv\">";
       

//	this.dlgHdr = " <div elname='zc-dialogheader' class=\"zc-dialogheader\" onmousedown=\"captureDialog(event)\" ><table cellspacing=\"0\"><tr><td class=\"zc-dialog-left\"></td><td class=\"zc-dialog-right\" onclick=\"ZCApp.closeDialog();\" onmouseover=\"this.className='zc-dialog-right-hover';\" onmouseout=\"this.className='zc-dialog-right';\">Close</td></tr></table></div><div class=\"zc-dialogdiv\">";
	this.dialogBelow = "</div>";
	this.loadPage="true"; //No I18N
	this.scrollToTop = "false";
	this.printCurComp = false;
	this.embededCompLen = 0;
	this.curEmbededCompCnt = 0;
	this.contextPath = "";
	this.viewEditElements = new Array("zc-viewedit-columns", "zc-viewedit-criteria","zc-viewedit-filters","zc-viewedit-sort","zc-viewedit-group","zc-viewedit-permissions","zc-viewedit-custombuttons");
	this.useRSH = true;
	this.isMobileSite = false;
	this.isNewEditModeEnabled = false;
	this.isDefaultTemplate = false;

	this.addToAppPageMap = function(pageName, pageId, compLinkNames, compDispNames, compTypes, compLinkIDs, isHidden, compIDs, InZCformIDs)
	{
		ZCUtil.setInMap(ZCApp.pageVsHideMap, pageName, isHidden);
		ZCUtil.setInMap(ZCApp.pageVsCompNameMap, pageName, ZCUtil.getParamsAsArray(compLinkNames.substring(1, compLinkNames.length-1), ","));
                ZCApp.InZCformsIDs = ZCUtil.getParamsAsArray(InZCformIDs.substring(1, InZCformIDs.length-1), ",");
		var compNameArr = ZCUtil.getParamsAsArray(compLinkNames.substring(1, compLinkNames.length-1), ",");
		var compDispNameArr = ZCUtil.getParamsAsArray(compDispNames.substring(1, compDispNames.length-1), ",");
		var compLinkIDArr = ZCUtil.getParamsAsArray(compLinkIDs.substring(1, compLinkIDs.length-1), ",");
		var compTypeArr = ZCUtil.getParamsAsArray(compTypes.substring(1, compTypes.length-1), ",");
                var compIDsArr = ZCUtil.getParamsAsArray(compIDs.substring(1, compIDs.length-1), ",");
		$.each(compNameArr, function(index, compName)
		{
			ZCUtil.setInMap(ZCApp.compNameVsLinkIDMap, compName, compLinkIDArr[index]);
			ZCUtil.setInMap(ZCApp.compNameVsCompDispName, compName, compDispNameArr[index]);
			ZCUtil.setInMap(ZCApp.compNameVsTypeMap, compName, compTypeArr[index]);
                        if(compTypeArr[index] == ZCConstants.FORM)
                        {
                            ZCUtil.setInMap(ZCApp.formCompIDVsDispName, compIDsArr[index], compDispNameArr[index]);
                            ZCUtil.setInMap(ZCApp.formCompIDVsPageID, compIDsArr[index], pageId);
                        }
    			ZCUtil.setInMap(ZCApp.compNameVsPageMap, compName, pageName);
		});
	}

	this.regGlobalEvents = function()
	{
		//$("#zc-loading").ajaxStart(function(){ZCApp.showLoading("zc-loading")});
		//$("#zc-loading").ajaxStop(function(){ZCApp.hideLoading("zc-loading")});
	}

	this.hideLoading = function(elemID) {
		$("#"+elemID).hide();
	}

	this.showLoading = function(elemID) {
		var elem = $("#"+elemID);
		var loadingElem = elem.find('[loading=true]');

		if(loadingElem.length == 0) return;
		loadingElem[0].innerHTML = elem.attr("msg");
		$(elem).show();

		var screenWidth = getWindowWidth();
		var screenHeight = getWindowHeight();
		var offsetX = $(window)['scrollLeft']();
		var offsetY = $(window)['scrollTop']();

		//$(elem)[0].style.left = (screenWidth + offsetX - $(elem).width() -50) + "px";
		$(elem)[0].style.left = (offsetX + screenWidth/2 - $(elem).width()/2) + "px";
		//$(elem)[0].style.top = (offsetY + 90)  + "px";
		$(elem)[0].style.top = (offsetY + screenHeight/2 - $(elem).height()/2) + "px";
		elem.attr("msg", i18n.loadingmsg);
	}

	this.setLoadingMsg = function(elem, msg) {
		$(elem).attr("msg", msg);
	}

	this.showFading = function()
	{
		var elem = $("#zc-fadding");
		elem.find('[loading=true]').text(elem.attr("msg"));

		var screenWidth = getWindowWidth();
		var screenHeight = getWindowHeight();
		var offsetX = $(window)['scrollLeft']();
		var offsetY = $(window)['scrollTop']();

		var formXCenter = offsetX + screenWidth/2;
		var formYCenter = offsetY + screenHeight/2;

		if(ZCForm.isEmbeddedForm == "true")
		{
			ZCForm.getParamsFromIfrme();

			if(typeof(ZCForm.windowScrollTop) != "undefined" && typeof(ZCForm.offsetTop) != "undefined")
			{
				formYCenter = ZCForm.windowScrollTop - ZCForm.offsetTop;
			}

			if((screenHeight - formYCenter) > 200)
			{
				formYCenter = formYCenter + 200;
			}
		}
		if($(elem)[0] != undefined)
		{
			$(elem)[0].style.left = (formXCenter - $(elem).width()/2) + "px";
			$(elem)[0].style.top = (formYCenter - $(elem).height()/2) + "px";
		}

		elem.attr("msg", i18n.loadingmsg);
		$(elem).show();
	}

	this.showFadingMsg = function(msg, starttime, endtime)
	{
		if(ZCUtil.isNull(msg) || msg == "zc_success") return;
		ZCApp.hideLoading("zc-loading")
		ZCApp.setLoadingMsg($("#zc-fadding"), msg);
		if(starttime == 0) {
			ZCApp.showFading();
		} else {
			setTimeout(function(){ZCApp.showFading()}, starttime);
		}
		setTimeout(function(){ZCApp.hideLoading("zc-fadding");}, endtime);
	}

	this.setGlobals = function(sharedBy, sharedByDisp, appLinkName, appID, loginUser, appOwner, layoutType, pageLinkNames, compLinkNames, inZC, isAdmin,isOrg)
	{
		this.isAdmin = isAdmin;
		this.isOrg = isOrg;
		this.inZC = inZC;
		this.sharedBy = sharedBy;
		this.sharedByDisp = sharedByDisp;
		this.appLinkName = appLinkName;
		this.appID = appID;
		this.appOwner = appOwner;
		this.loginUser = loginUser;
		this.layoutType = layoutType;
		this.compLinkNames = ZCUtil.getParamsAsArray(compLinkNames.substring(1, compLinkNames.length-1), ",");
		this.pageLinkNames = ZCUtil.getParamsAsArray(pageLinkNames.substring(1, pageLinkNames.length-1), ",");
		$.ajaxSetup( {
			contentType:"application/x-www-form-urlencoded;charset=UTF-8"
		} );
	}

	this.setCSRFParams = function(paramName, paramValue)
	{
		this.csrfParamName = paramName;
		this.csrfParamValue = paramValue;
	}
	
	this.showLanguageDropDown = function(el, toShow, event)
	{
		ZCApp.hideAndStopPropogation(event);
        if(toShow)
		{
			ZCUtil.showDropDownMenu(el, $("#zc-langdropdown")[0]);
		}
		else
		{
			ZCUtil.hideMenu(el, $("#zc-langdropdown")[0]);
		}
	}

	this.showHomeDropDown = function(el, toShow, event)
	{
		ZCApp.hideAndStopPropogation(event);
        if(toShow)
		{
			ZCUtil.showDropDownMenu(el, $("#zc-homedropdown")[0]);
		}
		else
		{
			ZCUtil.hideMenu(el, $("#zc-homedropdown")[0]);
		}
	}

	this.showHideCopyApp = function(el, toShow, event)
	{
		ZCApp.hideAndStopPropogation(event);
        	document.getElementById("zc-homedropdown").style.display = "none";
		if(toShow)
		{
			ZCUtil.showDropDownMenu(el, $("#zc-copyappdiv")[0]);
		}
		else
		{
			ZCUtil.hideMenu(el, $("#zc-copyappdiv")[0]);
		}
	}

	this.copyApp = function()
	{
		ZCUtil.sendRequest("/copyApp.do", "isLiveMode=true&appname="+ZCApp.appLinkName, "json", "ZCApp.copyAppResp");
	}
	
	this.showFeatureNotification = function(el, toShow, event)
	{
		ZCApp.hideAndStopPropogation(event);
        	if(toShow)
        	{
        		$("#notification_container").show();
        		if($(window).width() < ($("#notification_container").offset().left + $("#notification_container").width()))
        		{
        			$("#notification_container").css("right","15px");
        		}
        	}
        	else
        	{
        		$("#notification_container").hide();
        	}
	}
		
	this.copyAppResp = function(respTxt, paramsMap, argsMap)
	{
		$.each(respTxt, function(idx, obj)
		{
			$.each(obj, function(key, val)
			{
				if(key == "success")
				{
					location.href = val;
				}
				else if(key == "failure")
				{
					ZCUtil.showDialog(val, "true");
				}
			});
		});
	}

	this.resetPrivateLink = function(enable, pageCompID, compLinkName, dialogName)
	{
		if(!dialogName) dialogName = "perma";
		ZCUtil.sendRequest("/getPrivateLink.do", "pageCompID="+pageCompID+"&enable="+enable, "text", "ZCApp.updatePrivateLink", ZCUtil.getParamsAsMap("compLinkName="+compLinkName+"&dialogName="+dialogName));
	}

	this.requestForPublicAccess = function()
	{
		window.open(ZCConstants.publicAccessRequestUrl,'RequestPublicAccess','width=500,height=550,left=400,top=70');
	}

	this.showErrorDialog = function(headerMsg, message, options)
	{
		var dialogEle = $("#zc_error_dialog");
		dialogEle.find("[elName='zc_dialog_header']").html(headerMsg);
		dialogEle.find("div[elName='zc_dialog_content']").html(message);

		var val = "<div id='zc_error_dialog_clone'>" + dialogEle.html() + "</div>";;
		var dlgOptions = "closeButton=no,modal=yes";// No I18N

		if(!ZCUtil.isNull(options) && options != "undefined")
		{
			dlgOptions = dlgOptions + "," + options;
		}
		ZCUtil.showInDialog(val, dlgOptions);

		var errorDialogButtons = document.getElementById("zc_error_dialog_clone").getElementsByTagName("input");
		var errorDialogButtonsNos= errorDialogButtons.length;
		if(errorDialogButtonsNos >= 1)
		{
			if(errorDialogButtons[0].getAttribute("elName") == "error_dialog_ok_button")
			{	
				errorDialogButtons[0].focus();
			}
		}
	}

	this.showUpgradeDialog = function(message)
	{
		var dialogEle = $("#zc_upgrade_error_dialog");
		dialogEle.find("span[elName='upgradeMsg']").html(message);
		var val = dialogEle.html();
		var dlgOptions = "closeButton=no,modal=yes";// No I18N
		showDialog(val, dlgOptions);
	}

	this.updatePrivateLink = function(respTxt, paramsMap, argsMap)
	{
		if(respTxt == "ZC_ERROR")
		{
			alert(i18n.errormsg);
		}
		else if(respTxt == "ZC_UNCONFIRMEDUSERSHARE")
		{
			alert(i18n.unconfirmeduserpublish);
		}
		else if(respTxt == "ZC_DISABLE_PUBLIC" || respTxt == "ZC_PUBLIC_REQUESTED")
		{
			var publicStatusMsg = replaceParams(i18n.publicaccessupgrade);
			ZCApp.showUpgradeDialog(publicStatusMsg);
		}
		else
		{
			var dialogName = ZCUtil.getFromMap(argsMap, "dialogName");
			var dialogdiv = $("div[elName=zc-"+dialogName+"-dialog-div]");
			var compLinkName = ZCUtil.getFromMap(argsMap, "compLinkName");
			var compType = ZCUtil.getFromMap(ZCApp.compNameVsTypeMap, compLinkName);
			var container = ZCForm.getFormCont(compLinkName);
			if(compType == ZCConstants.VIEW)
			{
				container = ZCView.getViewCont(compLinkName);
			}
			else if(compType == ZCConstants.REPORT)
			{
				container = ZCReport.getReportCont(compLinkName);
			}
			$(container).find("div[elName=zc-linkinfo-div]").attr("privateLink", respTxt);
			ZCApp.toggleLoginPrompt(container, dialogdiv, compLinkName);
			if(dialogName == "perma") ZCApp.setPermaLink(container, dialogdiv, compLinkName);
			else if(dialogName == "embed") ZCApp.resetEmbedParams(compLinkName);
			else if(dialogName == "ical") ZCApp.setIcalUrl(container, dialogdiv, compLinkName);
			else ZCApp.setExportLinks(container, dialogdiv, compLinkName);
		}
	}

	this.setIcalUrl = function(container, permadiv, compLinkName)
	{
		var el = $(permadiv).find("textarea[elName='zc-ical-ta']");
		var linkdiv = $(container).find("div[elName=zc-linkinfo-div]");
		var privUrl = $(linkdiv).attr("privateLink");
		$(el).val($(linkdiv).attr("scheme") + "://" + $(linkdiv).attr("exportServerPrefix") + "/" + ZCApp.sharedByDisp + "/" + ZCApp.appLinkName + "/" + $(el).attr("comptype") + "/" + compLinkName + "/" + privUrl);
	}

	this.resetEmbedParams = function(compLinkName)
	{
		var compType = ZCUtil.getFromMap(ZCApp.compNameVsTypeMap, compLinkName);
		var container = ZCForm.getFormCont(compLinkName);
		if(compType == ZCConstants.VIEW)
		{
			container = ZCView.getViewCont(compLinkName);
		}
		else if(compType == ZCConstants.REPORT)
		{
			container = ZCReport.getReportCont(compLinkName);
		}
		var embedParams = "";
		if(compType == ZCConstants.FORM)
		{
			embedParams = ZCForm.getEmbedParams(compLinkName);
		}
		else if(compType == ZCConstants.VIEW)
		{
			embedParams = ZCView.getEmbedParams(compLinkName);
		}
		ZCApp.setEmbedLink(container, $("div[elName=zc-embed-dialog-div]"), embedParams);
	}

	this.toggleLoginPrompt = function(container, permadiv, compLinkName)
	{
		var privUrl = $(container).find("div[elName=zc-linkinfo-div]").attr("privateLink");
		$(permadiv).find("div[comElName=zc-logininfo-div]").hide();
		if(ZCUtil.isNull(privUrl)) $(permadiv).find("div[elName=zc-nologin-div]").show();
		else $(permadiv).find("div[elName=zc-promptlogin-div]").show();
	}

	this.setPermaLink = function(container, permadiv, compLinkName)
	{
		var el = $(permadiv).find("textarea[elName='zc-perma-ta']");
		var linkdiv = $(container).find("div[elName=zc-linkinfo-div]");
		var privUrl = $(linkdiv).attr("privateLink");
		var scheme = $(linkdiv).attr("scheme");
		var publicserver = $(linkdiv).attr("publicserver");
		$(el).val((ZCUtil.isNull(privUrl) ? $(linkdiv).attr("serverprefix") : (scheme + "://" +publicserver))+ "/" + ZCApp.sharedByDisp + "/" + ZCApp.appLinkName + "/" + $(el).attr("comptype") + "/" + compLinkName + "/" + privUrl);
	}

	this.setExportLinks = function(container, exportdiv, compLinkName)
	{
		$.each($(exportdiv).find("textarea[comElName='zc-export-ta']"), function(index, el)
		{
			var linkdiv = $(container).find("div[elName=zc-linkinfo-div]");
			var privUrl = $(linkdiv).attr("privateLink");
			privUrl = ZCUtil.isNull(privUrl)?"":privUrl+"/";
			var includeCrit = false;
			if($(exportdiv).attr("includecrit") == "true"|| $(exportdiv).attr("includecrit") == true) // NO I18N
			{
				includeCrit = true;
			}
			var critstr = (includeCrit)?$(linkdiv).attr("critStr"):""; // NO I18N
			$(el).val($(linkdiv).attr("scheme") + "://" + $(linkdiv).attr("exportServerPrefix") + "/" + ZCApp.sharedByDisp + "/" + ZCApp.appLinkName + "/" + $(el).attr("exportype") + "/" + compLinkName + "/" + privUrl + critstr);
		});
	}

	this.setEmbedLink = function(container, embediv, embedParams)
	{
		embedParams = ZCUtil.isNull(embedParams)?"":embedParams;
		var privUrl = $(container).find("div[elName=zc-linkinfo-div]").attr("privateLink");
		var publicserver = $(container).find("div[elName=zc-linkinfo-div]").attr("publicserver");
		var scheme = $(container).find("div[elName=zc-linkinfo-div]").attr("scheme");
		var embedurl = $(embediv).attr("embedurl");
		var embedjsurl = $(embediv).attr("embedjsurl");
		var embedEndUrl = $(embediv).attr("embedEndUrl");
		var permaurl = embedurl.substring(embedurl.indexOf("src=")+5).replace("-embed/", "-perma/");
		var url = permaurl.substring(permaurl.indexOf("://")+3)
		url = url.substring(url.indexOf("/"));
		
		if(ZCUtil.isNull(privUrl))
		{
			privUrl = "";
			$(embediv).find("[elName='zc-formembedsnippet']").hide();
		}
		else
		{
			
			permaurl = scheme + "://" + publicserver + url;
			var eurl = permaurl.replace("-perma/", "-embed/");
			embedjsurl = "<script src='"+eurl;
			embedurl = "<iframe height='500px' width='100%' name='formEmbed-Test_Form' frameborder='0' allowTransparency='true' scrolling='auto' src='"+eurl;
			
			embedjsurl = embedjsurl + "&privateLink=" + privUrl;
			privUrl = privUrl + "/";
			$(embediv).find("[elName='zc-formembedsnippet']").show();
		}
		$(embediv).find('textarea[elName="zc-embed-ta"]').val(embedurl+privUrl+embedParams+embedEndUrl);
		$(embediv).find('textarea[elName="zc-perma-ta"]').val(permaurl+privUrl+embedParams);
		$(embediv).find('textarea[elName="zc-embed-js-ta"]').val(embedjsurl + "'></script>");
	}

	this.clearZCComponent = function()
	{
		var comps = $("#zc-component").find("div[comElName=zc-component]");
		for(var i=0; i<comps.length; i++) {
			$(comps[i]).get(0).innerHTML = "";
			$(comps[i]).hide();
		}
	}

	this.loadZCComponent = function(responseText, paramsMap, argsMap)
	{
		var loadIn = ZCUtil.getFromMap(paramsMap, "zc_LoadIn");
		ZCForm.onUserInputElem = new Array();
		if(loadIn == "html")
		{
			ZCApp.setZCCompInHTML(responseText, paramsMap, argsMap);
			return false;
		}
		else if(loadIn == "dialog")
		{
			ZCUtil.setInMap(argsMap, "include", "true");
			ZCApp.loadZCCompInDialog(responseText, paramsMap, argsMap);
			return false;
		}
		ZCApp.clearZCComponent();
		var compName = ZCUtil.getFromMap(argsMap, "compName");
		ZCApp.currZCComp = ZCUtil.getFromMap(argsMap, "compLinkName");
		var isFromChildView = ZCUtil.getFromMap(paramsMap, "ZC_REC_ID"); // This variable for Sub-form and lookup linked view. To traverse parent view.
		if(isFromChildView != "")
		{
			closeDialog();
			ZCApp.currZCComp = ZCUtil.getFromMap(paramsMap, "linkedViewLinkName");
		}

		var compDIV = $("#zc-component").find("div[elName=zc-component-"+ZCApp.currZCComp+"]");

	   		if(ZCApp.scrollToTop == "true")
	   		{
	   			if(ZCApp.inZC)
			{
				ZCUtil.goToTop(false);
			}

 		}
 		ZCApp.scrollToTop = "false";
		imgCounter = 0;
		totalImgCount = 0;
 		compDIV[0].innerHTML = responseText;	//	This is taking 500ms to execute

		//Harishankar - If this is a payment callback, then display only the callback messages
		if($('#pmtCallbackDiv').length > 0)
		{
			compDIV[0].innerHTML = $('#pmtCallbackDiv').html();
			compDIV.show();
			$('#pmtCallbackDiv').remove();
			return;
		}
 		compDIV.show();
                if(typeof ZCTemplate != "undefined")
                {
                    ZCTemplate.setPaddingFixForHtmlView();
                }
 		//setTimeout(function(){
                                ZCUtil.evalJS($(compDIV).find("script").html());//}, 0);
                              //  var isTemplate = ZCUtil.getFromMap(viewParamsMap,"isFromTemplate");     
		if(ZCApp.inZC)
		{
			reloadCurrView = true;
			relodCurrentForm = "true"; //No I18N

			var linkView = ZCUtil.getFromMap(paramsMap, "linkedView");
			if(ZCUtil.isNull(linkView))
			{
				ZCTemplate.doLayoutActions();
			}

			ZCTemplate.adjustHeightWidth();	//	This is taking 500ms to execute

			var hrefStr = "";
			var compType = ZCUtil.getFromMap(ZCApp.compNameVsTypeMap, ZCApp.currZCComp);
			if (ZCApp.isNewEditModeEnabled)
			{
				var compTypeName = "";
				var compTypeInt = 0;
				try {
					compTypeInt = parseInt(compType);
				} catch (err) {}

				switch(compTypeInt)
                {
                	case ZCConstants.FORM:
                	{
                		compTypeName = "form";
                		break;
                	}
                    case ZCConstants.HTML_PAGE:
                    {
                    	compTypeName = "page";
                        break;
                    }
                    case ZCConstants.REPORT:
                    {
                    	compTypeName = "report";
                        break;
                    }
                    case ZCConstants.VIEW:
                    {
                    	compTypeName = "report";
                        break;
                    }
                }
				hrefStr = "/appbuilder/" + ZCApp.sharedByDisp + "/" + ZCApp.appLinkName + "/" + compTypeName + "/" + ZCApp.currZCComp + "/edit"; //No I18N
			}
			else
			{
				hrefStr = "/"+ZCApp.sharedByDisp+"/"+compName.toLowerCase()+"/"+ZCUtil.getFromMap(ZCApp.compNameVsLinkIDMap, ZCApp.currZCComp)+"/edit/";//No I18N
				if(compType == ZCConstants.HTML_PAGE)
				{
					hrefStr = "/"+ZCApp.sharedByDisp+"/"+ZCApp.appLinkName+"/htmlview/"+ZCApp.currZCComp+"/edit/";//No I18N
				}
				else if(compType == ZCConstants.REPORT)
				{
					hrefStr = "/"+ZCApp.sharedByDisp+"/"+ZCApp.appLinkName+"/reports/edit/";	// No I18N
				}
			}

			if(compType == ZCConstants.HTML_PAGE)
			{
				ZCApp.loadZCCompsInHTML();
			}
			hrefStr = $("#zc-editThisAppEl").attr("scheme")+"://"+$("#zc-editThisAppEl").attr("servername")+hrefStr;
			$("#zc-editThisAppEl").attr("href", hrefStr);
			/*if (ZCApp.isNewEditModeEnabled) {
				$("#zc-editThisAppEl").attr("target", "zceditapp");
			}*/
			$("[elname=zc-EditThisComp]").attr("href", hrefStr);


			// set it only once.. set the flag

			var currentUrl= window.location.href;

			var loginUrl = ZCApp.sharedByDisp+"/" + ZCApp.appLinkName+"/"+compName.toLowerCase()+"-login/"+ZCApp.currZCComp ; //No I18N

			var signOuthref = "/logoutpage.jsp?sharedBy="+ ZCApp.sharedByDisp + "&appID="+ ZCApp.appID +"&appLinkName="+ZCApp.appLinkName+"&signOutUrl="+loginUrl; //No I18N

			var encodeURL = ""; //No I18N

			if(currentUrl.indexOf("?") != -1)
			{
				var userParams= currentUrl.substring(currentUrl.indexOf("?")+1);
				encodeURL = encodeURL+"/" +userParams;
			}
			signOuthref = signOuthref + encodeURIComponent(encodeURL);
			$("#zc-signOutEl").attr("href", signOuthref); //No I18N

			var signInhref= "/"+loginUrl; //No I18N
			$("#zc-signInEl").attr("href", signInhref); //No I18N
		}
		if(ZCUtil.getFromMap(argsMap, "setURL") == "true")
		{
			var params = "";
			if(!ZCUtil.isNull(ZCUtil.getFromMap(argsMap, "nextUrlParams")))
			{
				params = ZCUtil.getFromMap(argsMap, "nextUrlParams");
			}
			ZCUtil.setLinkNameInURL(compName, ZCApp.currZCComp, params);
		}
                searchFactory.clearCache(null); // Clearing Search Cache (Lookup Search)
        
        if(ZCApp.isMobileSite)
        {
        	ZCApp.fixMobileHeader();
        }
	}

	this.reloadZCComp = function(compLinkName, params)
	{
		compLinkName = ZCUtil.isNull(compLinkName)?ZCApp.currZCComp:compLinkName;
		var compType = ZCUtil.getFromMap(ZCApp.compNameVsTypeMap, compLinkName);
		var compName = ZCApp.compProps["compName-"+compType];
		var url = ZCApp.compProps["actionURL-"+compType];
		var paramName = ZCApp.compProps["paramName-"+compType];
		var paramsMap = (compType == ZCConstants.FORM)?ZCForm.formArr[compLinkName]:ZCView.viewArr[compLinkName];
		if(ZCUtil.isNull(paramsMap))
		{
			paramsMap = ZCUtil.getParamsAsMap(paramName + "=" + compLinkName);
		}
		if(!ZCUtil.isNull(params))
		{
			paramsMap = ZCUtil.setParamsInMap(paramsMap, params);
		}
		ZCUtil.sendRequest(url, ZCUtil.getParamsFromMap(paramsMap), "html", "ZCApp.loadZCComponent", ZCUtil.getParamsAsMap("compLinkName="+compLinkName+"&compName="+compName+"&setURL=true&nextUrlParams="+params), i18n.loading +" " +compName);
	}

	this.loadZCCompsInHTML = function(ZCComp)
	{
		if(ZCComp){
			var viewCont = $("#"+_DIALOG_LAYER_VAR).find("[elName=zc-maincontent]");
		}else{
			var viewCont = $("#zc-component").find("div[elName=zc-component-"+ZCApp.currZCComp+"]");
		}
		var zcComps = viewCont.find("div[elName=zc-component]");
        ZCApp.embededCompLen = zcComps.length;
		if (ZCApp.printCurComp && ZCApp.embededCompLen == 0)
		{
	        ZCApp.printComp();
		}
		$.each(zcComps, function(index, comp)
		{
			var compType = ZCConstants.FORM;
			var params = $(comp).attr("params");
			var sharedBy = $(comp).attr("sharedBy");
			var appLinkName = $(comp).attr("appLinkName");
			var viewLinkName = $(comp).attr("viewLinkName");
			var formLinkName = $(comp).attr("formLinkName");
			var reportLinkName = $(comp).attr("reportLinkName");
			if(!ZCUtil.isNull(sharedBy))
			{
				params = params + "&sharedBy=" + sharedBy;
			}
			if(!ZCUtil.isNull(appLinkName))
			{
				params = params + "&appLinkName=" + appLinkName;
			}
			if(!ZCUtil.isNull(formLinkName))
			{
				params = params + "&formLinkName=" + formLinkName;
			}
			else if(!ZCUtil.isNull(viewLinkName))
			{
				compType = ZCConstants.VIEW;
				params = params + "&viewLinkName=" + viewLinkName;
			}
			else
			{
				compType = ZCConstants.REPORT;
				params = params + "&reportLinkName=" + reportLinkName;
			}
			params = params + "&zc_LoadIn=html";
			ZCUtil.sendRequest(ZCApp.compProps["actionURL-"+compType], params, "html", "ZCApp.setZCCompInHTML", ZCUtil.getParamsAsMap("compType="+compType), i18n.loadingdot);
		});
	}

	this.setZCCompInHTML = function(responseText, paramsMap, argsMap)
	{
		if(layerCount>1){
			var viewCont = $("#"+_DIALOG_LAYER_VAR).find("[elName=zc-maincontent]");
		}else{
			var viewCont = $("#zc-component").find("div[elName=zc-component-"+ZCApp.currZCComp+"]");
		}
		var compType = ZCUtil.getFromMap(argsMap, "compType");
		var paramName = ZCApp.compProps["paramName-"+compType];
		var compLinkName = ZCUtil.getFromMap(paramsMap, paramName);
		var compdiv = viewCont.find("div["+paramName+"="+compLinkName+"]");
        compdiv[0].innerHTML = responseText;
        ZCUtil.evalJS($(compdiv).find("script").html());

        ZCApp.curEmbededCompCnt++;
        if(ZCApp.printCurComp && ZCApp.embededCompLen == ZCApp.curEmbededCompCnt)
		{
		   ZCApp.printComp();
		}

        if(layerCount>1){
        	var oDialog = $('#'+_DIALOG_LAYER_VAR);
        	var oDialogContent = oDialog.find("#_DIALOG_CONTENT");
        	var mainContent = oDialogContent.find("[elname=zc-maincontent]");
        	oDialogContent.width(mainContent.width()+20);

        	var top = (window.innerHeight - oDialog[0].offsetHeight)/2;
        	var left = (window.innerWidth - oDialog[0].offsetWidth)/2;

    		oDialog.css('top', top + pageYOffset);//No I18N
    		oDialog.css('left', left + pageXOffset);//No I18N
        }
	}
    this.printComp = function()
    {
        window.print();
		ZCApp.printCurComp = false;
		ZCApp.curEmbededCompCnt = 0;
    }

	this.closeDialog = function()
	{
		closeDialog();
		if(ZCApp.currURL.indexOf('zc_LoadIn=dialog') !=-1)
		{               
			window.location.href = ZCApp.prevURL;
			ZCApp.loadPage = "false";	//No I18N
		}
                                if(isViewBeta)
                                {
                                    ZCTemplate.correctViewHeader();
                                }  
	}
	this.correctDialog = function() {
		var zcDial = $('#'+_DIALOG_LAYER_VAR); //No I18N
                                var freeLayer = $('#FreezeLayer_'+layerCount); //No I18N
		if(zcDial) {                        
			var dialHeight = zcDial.height();
			var dialWidth = zcDial.width();
			var winWidth = getWindowWidth();
			var winHeight = getWindowHeight();

                        var verScroll = false;
			var dialCont = zcDial.find("div[zcDialog=mainCont]");//No I18N
			if(dialWidth > winWidth - 100) {
			//	var originalWidth = dialCont.width();
			//	var diffWidth = originalWidth - winWidth + 50;
				dialCont.width(winWidth - 100);
                                                                freeLayer.width(winWidth - 100);
			}                        
			if(dialHeight > winHeight - 100) {
			//	var originalHeight = dialCont.height();
			//	var diffHeight = originalHeight - winHeight + 50;
				dialCont.height(winHeight  - 100);
                                                                freeLayer.height(winHeight  - 100);
                                verScroll = true;
			}
                        var outerCont = zcDial.find("div[zcDialog=outerCont]");
                        dialWidth = zcDial.width();
                        var zcWidth = outerCont.attr("zcWidth");//No I18N
                        if(dialWidth <=  winWidth-20 && verScroll) {
				var originalWidth = outerCont.width() + 30;
				outerCont.width(originalWidth);
                                outerCont.attr("zcWidth", originalWidth);//No I18N
                        }
			dialHeight = zcDial.height();
			dialWidth = zcDial.width();

			var sl = $(window)['scrollLeft']();//No I18N
			var st = $(window)['scrollTop']();//No I18N                        
			zcDial.css('left', (winWidth - dialWidth)/2 + sl);//No I18N
			zcDial.css('top', (winHeight - dialHeight)/2 + st);//No I18N
		}
	}
	
	this.loadZCCompInDialog = function(responseText, paramsMap, argsMap)
	{
        if(ZCUtil.getFromMap(argsMap, "closeDialog") == "true")
        {
            closeDialog();
        }
		var dlgOptions = "closeButton=no, modal=yes";//No I18N
		var openUrlWindowSizeOpts = ZCUtil.getFromMap(argsMap, "openURLWindowOpts");  //No I18N
		if(!ZCUtil.isNull(openUrlWindowSizeOpts))
		{
			//dlgOptions += ", "+openUrlWindowSizeOpts;
		}
		var compType = ZCUtil.getFromMap(paramsMap, "compType");
		ZCForm.onUserInputElem = new Array();
		if(ZCUtil.getFromMap(argsMap, "include") == "true")
		{
			var dialHdr = ZCApp.dialogAbove;
			var dialFtr = ZCApp.dialogBelow;
			if(ZCUtil.getFromMap(paramsMap, "zc_LoadIn") == "dialog")
			{
				/*
				 * Navigation URL Issue fix :: closeDialog commented to allow mutiple dialog to be opened.
				 */
				//closeDialog();
				dlgOptions += ", closeOnEscKey=no";
				/*
					if(ZCUtil.isNull(ZCUtil.getFromMap(argsMap, "isOpenUrl")))
					{
						dialHdr = ZCApp.dlgHdr;
					}
				*/
			}
			responseText = dialHdr + responseText + dialFtr;
		}
		if(ZCUtil.getFromMap(argsMap, "formAccessType") == ZCConstants.FORM_LOOKUP_ADD_FORM)
		{
			if(ZCUtil.getFromMap(argsMap, "closedialog") == "true")
			{
				closeDialog();
			}

			dlgOptions += ", position=absolute, closeParent=false";//No I18N
		}
		else
		{
			dlgOptions += ", position=relative";//No I18N
		}

		ZCUtil.showInDialog(responseText, dlgOptions, paramsMap);
		
		var sl = $(window)['scrollLeft']();
		var st = $(window)['scrollTop']();
		
		var screenXCenter = getWindowWidth()/2 + sl;
		var screenYCenter = getWindowHeight()/2 + st;
		
	/*	if(isViewBeta) {
			//zc-formDiv'
			this.correctDialog();
			
		} else {*/
		var dialHeight = $('#'+_DIALOG_LAYER_VAR).height();
		var dialWidth = $('#'+_DIALOG_LAYER_VAR).width();
		if(getWindowHeight() > dialHeight + 50) {
		 $('#'+_DIALOG_LAYER_VAR).css('top',screenYCenter - dialHeight/2);
		} else {
		 $('#'+_DIALOG_LAYER_VAR).css('top',st + 30);
		}
		if(getWindowWidth() > dialWidth + 50) {
		 $('#'+_DIALOG_LAYER_VAR).css('left',screenXCenter - dialWidth/2);
		} else {
			var popupLeft=30;
			if(ZCApp.isMobileSite)
				{
					popupLeft=12;
				}
		 $('#'+_DIALOG_LAYER_VAR).css('left',sl + popupLeft);
		}
		//}
		
		if(compType == ZCConstants.FORM)
		{
			var formLinkName = ZCUtil.getFromMap(paramsMap, "formLinkName");
			var formAccessType = ZCConstants.FORM_ALONE;
			if(!ZCUtil.isNull(ZCUtil.getFromMap(paramsMap, "formAccessType")))
			{
				formAccessType = ZCUtil.getFromMap(paramsMap, "formAccessType");
			}
			$.each(paramsMap, function(paramName, paramValue)
			{
				for(var i = 0; i < paramValue.length;i++)
				{
				    paramValue[i]=decodeURIComponent(paramValue[i]);
				}
				ZCForm.isAddToParentLookup = true;
				ZCForm.setFieldValue(formLinkName, paramName, formAccessType,paramValue);
			});
		}

		if(compType == ZCConstants.VIEW){
			var viewLinkName = ZCUtil.getFromMap(paramsMap, "viewLinkName");//No I18N
			compType = ZCUtil.getFromMap(ZCApp.compNameVsTypeMap, viewLinkName);
			if(compType == ZCConstants.HTML_PAGE){
				ZCApp.loadZCCompsInHTML(viewLinkName);
			}
		}

		var dialogDivEl = $('#'+_DIALOG_LAYER_VAR).find("div[id=_DIALOG_CONTENT]");
		$(dialogDivEl).scroll(function (event) {
			var lftPos = $(dialogDivEl).scrollLeft();
			$(dialogDivEl).find("div[elName=zc-dialogheader]").css('position','relative');
			$(dialogDivEl).find("div[elName=zc-dialogheader]").css('left',lftPos);
		});
		searchFactory.clearCache(null); // Clearing Search Cache (Lookup Search)
	}

	this.openUrlInDialog = function(urlString, options)
	{
		var reqParams = "zc_LoadIn=dialog&";
		if(urlString.indexOf("/")==0)
		{
			var slashIdx = urlString.indexOf("/");
			var remUrl = urlString.substr(slashIdx+1);
			slashIdx = remUrl.indexOf("/");
			var sharedBy = remUrl.substring(0, slashIdx);
			remUrl = remUrl.substr(slashIdx+1);
			slashIdx = remUrl.indexOf("/");
			var appLinkName = remUrl.substring(0, slashIdx);
			urlString = remUrl.substr(slashIdx+1);
			reqParams = reqParams + "sharedBy=" + sharedBy + "&appLinkName=" + appLinkName + "&";
		}
		if(urlString.indexOf("#")==0 || urlString.indexOf("/#")==0 )
		{
			var hashIdx = urlString.indexOf("#");
			var endIdx = urlString.indexOf("?");
			var params = (endIdx == -1)?"":urlString.substr(endIdx+1);
			var compName = urlString.substring(hashIdx+1, hashIdx+5);

			var compType = (compName == "Form")?ZCConstants.FORM:ZCConstants.VIEW;
			var compLinkName = (endIdx == -1)?urlString.substr(hashIdx+6):urlString.substring(hashIdx+6, endIdx);
			var paramName = ZCApp.compProps["paramName-"+compType];
		}
		ZCUtil.sendRequest(ZCApp.compProps["actionURL-"+compType], reqParams+paramName+"="+compLinkName+"&"+params+"&compType="+compType, "html", "ZCApp.loadZCCompInDialog", ZCUtil.getParamsAsMap("include=true&isOpenUrl=true&openURLWindowOpts="+options), i18n.loadingdot); //No I18N
	}

	this.reloadSameURL = function(urlString, windowType)
	{
		var windowObj = ZCUtil.getWindowObject(windowType);
		if(urlString.indexOf("#") == 0 || urlString.indexOf("/#") ==0 || windowObj.location.href == urlString)
		{
			var linkName = ZCUtil.getLinkNameFromURL(urlString);
			if(linkName == ZCApp.currZCComp)
			{
				ZCTemplate.loadPage(linkName, "true");
			}
		}
	}

	this.hideAppMenus = function()
	{
		$("[elName=zcDDPagination]").hide();
		ZCApp.hideLookUpSearch();
		ZCUtil.hideMenu(null, $("#zc-copyappdiv")[0]);
		ZCUtil.hideMenu(null, $("#zc-homedropdown")[0]);
		ZCUtil.hideMenu(null, $("#zc-langdropdown")[0]);
		$("#notification_container").hide();
		ZCUtil.hideMenu(null, $("#zc-toggleAgentAvailability")[0]);
		ZCAppSearch.hideSearchList();
		ZCForm.hideFormMenus(ZCForm.getFormCont(ZCApp.currZCComp));
		ZCView.hideViewMenus(ZCView.getViewContainers(ZCApp.currZCComp), ZCApp.currZCComp);
		ZCReport.hideReportMenus(ZCReport.getReportCont(ZCApp.currZCComp));
	}
    this.hideFormPermaContent = function()
	{
		ZCApp.hideLookUpSearch();
		ZCForm.hideFormMenus(ZCForm.getFormCont(ZCApp.currZCComp));
	}
    this.hideViewPermaContent = function()
	{
		ZCApp.hideLookUpSearch();
	}
    this.hideFormEmbedContent = function()
    {
        ZCApp.hideLookUpSearch();
    }
    this.hideViewEmbedContent = function()
    {
    	ZCApp.hideLookUpSearch();
    }
	this.hideLookUpSearch = function()
	{
		$("[elName=srchDivEl]").hide();
	}

	this.stopPropogation = function(event) {
		if ($.browser.msie) {
			window.event.cancelBubble = true;
		} else if (browser_nn6) {
			event.stopPropagation();
		}
	}
	
	this.hideAndStopPropogation = function(event) {
		if ($.browser.msie) {
			window.event.cancelBubble = true;
		} else if (browser_nn6) {
			event.stopPropagation();
		}
		ZCUtil.hideMenu(null, $("#zc-copyappdiv")[0]);
		ZCUtil.hideMenu(null, $("#zc-homedropdown")[0]);
		ZCUtil.hideMenu(null, $("#zc-langdropdown")[0]);
		$("#notification_container").hide();
	}

    this.toggleRatingsDiv = function(id)
    {
        if(authenticate())
        {
           var ele = docid(id);
           var eStyle = ele.style;
           if (eStyle.display == "block")
           {
               eStyle.display = "none";
           }
           else
           {
               ele.style.display = "block";
               docid("ratemsg").innerHTML = getA(docid("ratemsg"), "origMsg");
               docid("rateimgs").style.display='block';
           }
        }
        else
        {
            alert(i18n.apprating);
        }
    }

    this.showAppRating = function(ratingValue)
    {
        var roundValue = Math.round(ratingValue);
        var len = 0;
        len = ratingValue;

        for(var i = 1; i <= 5; i++)
        {
            if(i <= len)
            {
                docid("star"+i).src="/platform/images/star-gold.gif";
            }
            else if(roundValue > ratingValue)
            {
                len = roundValue - 1;
                docid("star"+roundValue).src="/platform/images/star-halfrated.gif";
            }
            else
            {
                docid("star"+i).src="/platform/images/star-notrated.gif";
            }
        }
    }

    this.setAppRating = function(rating, canvasurl)
    {
    	this.showAppRating(rating);
        var url = "/home/rateApp";
        var params = "rating="+rating+"&canvasurl="+canvasurl; // No i18n
        ZCUtil.sendRequest(url, params, "text", "ZCApp.handleAppRatingResp", "", i18n.updratings);
    }

    this.handleAppRatingResp = function()
    {
    var reqOptions = {FADE_INTERVAL:10};
	docid("rateimgs").style.display='none';
	docid("ratemsg").innerHTML = getA(docid("ratemsg"), "successMsg");
	$("#rateThisApp").fadeOut(5000);
    }

    this.toggleReviewDiv = function(id)
    {
        if(authenticate())
        {
            ZCUtil.showInDialog(docid(id).innerHTML, 'closeButton=no, modal=yes, width=745'); // No i18n
        }
        else
        {
            alert(i18n.appreview);
        }
    }

    this.addReview = function(formObj)
    {
        var reviewtitle = formObj.reviewTitle.value;
        var reviewcomment = formObj.reviewComment.value;
        if (reviewtitle=="" && reviewcomment=="")
        {
            alert(i18n.reviewtitleandcontent);
            formObj.reviewTitle.focus();
        }
        else if (reviewtitle == "")
        {
            alert(i18n.reviewtitle);
            formObj.reviewTitle.focus();
        }
        else if (reviewcomment == "")
        {
            alert(i18n.reviewcontent);
            formObj.reviewComment.focus();
        }
        else
        {
        	ZCUtil.sendRequest($(formObj).attr("action"), ZCUtil.getFieldsAsParams(formObj, ":input[type!=reset][type!=submit][type!=button][type!=file]"), "text", "ZCApp.handleAddReviewResp", ZCUtil.setInMap(new Object(), "formObj", formObj), i18n.addreview);
        }
        return false;
    }

    this.handleAddReviewResp = function(result, paramsMap, argsMap)
    {
    	var formObj = ZCUtil.getFromMap(argsMap, "formObj");
	if (result.toLowerCase().indexOf("success") != -1)
	{
		closeDialog();
		ZCApp.showFadingMsg(i18n.reviewadded, 0, 2000);
		formObj.reviewTitle.value="";
		formObj.reviewComment.value="";
	}
    }


	this.getRespArr = function(response)
	{
		/*eslint-disable */
		var jsonResp = eval(response);//jshint ignore:line
		/*eslint-enable */
		var respArr = new Array();
		for(var i in jsonResp)
		{
			var jsonObj = jsonResp[i];
			for(var j in jsonObj)
			{
				respArr[j] = jsonObj[j];
			}
		}
		return respArr;
	}

	this.scrollToPageTop = function(height)
	{
		if(typeof(height) == 'undefined')
		{
			height = 1;
		}
		window.scrollTo(0,height);
	}
	
	this.hideAddressBar = function(height,seconds)
	{
		setTimeout(function(){ZCApp.scrollToPageTop(height)}, seconds);
	}
	
	this.fixMobileHeader = function()
	{
    	//this is added to fix minimum height if there is no data availble cases - bcoz the screen size is very less
		docid("zc-component").style.minHeight = getWindowHeight() + 60;
    	
		docid("mobile-title-hdr").style.position="fixed";
		docid("mobile-title-hdr").style.top="0";
		
		if(docid("mobile-form-header") != undefined)
		{
			docid("mobile-form-header").style.minHeight="42px";
		}
		if(docid("mobile-view-header") != undefined)
		{
			docid("mobile-view-header").style.minHeight="42px";
		}
	}

	this.hideMobileBackBtnInIframe = function()
	{
		if(window.top!=window.self)
		{
			docid("back-btn").style.display="none";
		}
	}

	this.scroll = function() {
		
		ZCAppSearch.adjustFixedBar();
		ZCApp.adjustFixedHeader();
		
		// this is to hide addressbar when summary search open and keypad visible
		if(ZCApp.isMobileSite && docid("sum_search").style.display!='none')
		{
			ZCApp.scrollToPageTop();
		}
	}
                
    this.adjustFixedHeader = function()
    {   
        if(_DIALOG_LAYER_VAR == "_DIALOG_LAYER" || _DIALOG_LAYER_VAR == "_DIALOG_LAYER_0")
        {	
            //var st = document.body.scrollTop;
            var st = $(window).scrollTop();
            //console.log(st);
            if(st > 50) {
                $("#zc-header-right").hide();
            } else {
                $("#zc-header-right").show();
            }

            if(ZCView.fixedHeaderNeeded) 
            {	                        		            
            		if(ZCApp.isMobileSite)
            		{
            			var mobileViewHeader= $("#mobile-view-header");
                		var mobileViewHeaderHeight = mobileViewHeader.height();
            			ZCView.pageHeaderHeight = mobileViewHeaderHeight;
            		}
            			
            		if(st > ZCView.pageHeaderHeight || ZCApp.isMobileSite) {
            		
            			var adjustTop = 0;
            			
            			var searchboxid='none';
            			if(docid("sum_search") != null)
            			{
            				searchboxid = docid("sum_search").style.display;
            			}
            			if(ZCApp.isMobileSite && searchboxid == 'none')
            			{
            				adjustTop = $("#mobile-view-header").height();
            			}
            			ZCView.setWidthInView(adjustTop,st);
            			
                    } else {
                            ZCView.resetWidthInView(st);
                    }
            }
            if(isViewBeta && ($(document).width() > getWindowWidth())) {
                    ZCView.handleHorizontalScroll();
            }
        }
    }

	this.adjustForView = function(screenWidth) {
		var compLinkName = ZCApp.currZCComp;
		if(ZCView.viewContFixed != null && ZCView.fixedHeaderNeeded && ZCView.viewContFixed.html() != "") {
			ZCView.handleScreenResize(compLinkName, screenWidth);
			this.scroll();
		}
		if(ZCApp.isMobileSite && $('#'+FreezeLayer_VAR) != null)
		{
			$('#'+FreezeLayer_VAR).width(getWindowWidth());
			
			// commented to fix the add record popup comes in center whenever we scroll. 
			//actually this code is written to maked the popup dialog comes in center but that is fixed by solai so this is not needed
			//this.adjustDialogInCenter();
		}
	}
	
	this.adjustDialogInCenter = function() {
		var sl = $(window)['scrollLeft']();
		var st = $(window)['scrollTop']();

		var screenXCenter = getWindowWidth()/2 + sl;
		var screenYCenter = getWindowHeight()/2 + st;

		var dialHeight = $('#'+_DIALOG_LAYER_VAR).height();
		var dialWidth = $('#'+_DIALOG_LAYER_VAR).width();
		
		if(getWindowHeight() > dialHeight + 50) {
		 $('#'+_DIALOG_LAYER_VAR).css('top',screenYCenter - dialHeight/2);
		} else {
		 $('#'+_DIALOG_LAYER_VAR).css('top',st + 30);
		}
		if(getWindowWidth() > dialWidth + 50) {
		 $('#'+_DIALOG_LAYER_VAR).css('left',screenXCenter - dialWidth/2);
		} else {
			var popupLeft=30+sl;
			if(ZCApp.isMobileSite)
				{
					popupLeft=12;
				}
		 $('#'+_DIALOG_LAYER_VAR).css('left',popupLeft);
		}
	}

	this.resize = function() {
		this.adjustForView(getWindowWidth());
		this.adjustForForm();
		var betaSpan = $('#zc-viewbeta-preview').find("div[elname=beta-preview-span]");//No I18N
		if(betaSpan) {
			var winWidth = getWindowWidth();
			betaSpan.css("left", (winWidth-betaSpan.width())/2);//No I18N
		}
	}
	
	this.adjustForForm = function() {
		var compLinkName = ZCApp.currZCComp;
		if(ZCUtil.getFromMap(ZCApp.compNameVsTypeMap, compLinkName) == ZCConstants.FORM) {
			var f = ZCForm.getForm(compLinkName, ZCConstants.FORM_ALONE);
			ZCForm.handleScreenResize(f);
		}
	}
	
	this.setCookie =  function(keyName,value,expiryTime,domain)
	{	
		var expdate=new Date();
		if(expiryTime)
		{
		 expdate.setTime(expdate.getTime()+(expiryTime*24*3600*1000));
		}
		else
		{
		 expdate.setTime(expdate.getTime()+(365*24*3600*1000));
		}
		
		var cookieStr = keyName+ "=" +escape(value)+ ";expires="+expdate.toGMTString()+";path=/;";//No I18N
		if(domain)
		{
			cookieStr = cookieStr + "domain="+escape(domain);//No I18N
		}
		document.cookie=cookieStr;
	}

	this.goToMobileSite = function(loginUserDisp,sharedBy,appLinkName)
	{
		var domainName = document.domain;
		var temp = domainName.substring(0,domainName.lastIndexOf("."));
		var cookieDomain = domainName.substring(temp.lastIndexOf("."),domainName.length);
		
		ZCApp.setCookie(loginUserDisp+'_isalwaysfullsite','false',null,cookieDomain);
		window.location.href = "/mobile/"+sharedBy+"/"+appLinkName+"/";
	}
	
    this.showCustomerProfile = function()
    {
    	var url = '/showCustomerProfile.do';		//No I18N
		var params = "sharedBy=" + ZCApp.sharedByDisp;
		//params = params + "&externalUrl=" +externalUrl;
		//params = params + "&appLinkName=" +ZCApp.appLinkName;
    	ZCUtil.sendRequest(url, params, "html", "ZCApp.showCustomerProfile_return");	//No I18N
    }
    
    this.showCustomerProfile_return = function(html, params)
	{
		var options = "position=absmiddle, closeButton=no, modal=yes, position=absolute, closeParent=false, width=745";
		showDialog(html, options);
	}
	
	this.spreadSheetReportCnfm = function(compTypeName,compName)
	{
			var status = $("span[elname=zc-saveViewRecsEl]").attr("status");
			if(status === "enable")
			{
				ZCView.showConfirmPopUp(i18n.spreadsheetcnfm1, function(){ZCView.toggleViewMenu(compName, 'show', 'disable');window.location.href = "#"+compTypeName+":"+compName;});
				return false;
			}
			else
			{
				window.location.href = "#"+compTypeName+":"+compName;
			}
	}
	
//	this.setLanguageCookie = function()
//	{
//		alert("comes");
//		var language = $(el).attr('langvalue');
//		console.log(language);
// 		var appId= $(el).attr('appid');
// 		console.log(appId);
// 		var displayName= $(el).attr('dispname');
// 		console.log(displayName);
//	}

}


function findFullDocDim() {
	return { width : $(document).width(), height : $(document).height()}
}

function trim(str)
{
    return(str.replace(/\s+$/,''));
}

function openPluginField(module,fldVal)
{
    window.open("https://crm.zoho.com/crm/Search.do?searchmodule="+module, "_blank", "left=420,top=50,resizable=1,width=500,height=360");
}
function clearPluginField(obj, formCompID)
{
    $(obj.parentNode).find("input[formCompID="+formCompID+"]").attr("value","");
}

var ZCEvalApp = new function()
{
    this.validateLicAgreeCheck = function(frm)
    {
        if(frm.agree.checked)
        {
            frm.create.disabled=false;
        }
        else
        {
            frm.create.disabled=true;
        }
    }
    this.validateCCForm = function(frm)
    {
        try {
            docid('errorrow').style.display = 'none';
            var divId = document.getElementById('signup_status');
            var objRegExp  = /^[a-z0-9]([a-z0-9_\-\.\+]*)@([a-z0-9_\-\.]*)(\.[a-z]{2,4}(\.[a-z]{2}){0,2})$/i;
            var cval = frm.cardnum.value;
            var cvval = frm.cardvernum.value;
            var toret = true;
            var errmsg = '';
            if(trim(frm.streetaddress.value).length == 0)
            {
                errmsg = errmsg + i18Arr['zc.ccinfo.validstreetaddress'] + "<br>";
                frm.streetaddress.focus();
                toret = false;
            }
            if(trim(frm.zipcode.value).length == 0)
            {
                errmsg = errmsg + i18Arr['zc.ccinfo.validzipcode'] + "<br>";
                frm.zipcode.focus();
                toret = false;
            }
            if(trim(frm.cardnum.value).length == 0)
            {
                errmsg = errmsg + i18Arr['zc.ccinfo.validcardnum'] + "<br>";
                frm.cardnum.focus();
                toret = false;
            }
            if(cval.indexOf(' ')!=-1)
            {
                errmsg = errmsg + i18Arr['zc.ccinfo.nospaces'] + "<br>";
                frm.cardnum.focus();
                toret = false;
            }
            if(trim(frm.cardvernum.value).length == 0)
            {
                errmsg = errmsg + i18Arr['zc.ccinfo.validcardvernum'] + "<br>";
                frm.cardvernum.focus();
                toret = false;
            }
            if(cvval.indexOf(' ')!=-1)
            {
                errmsg = errmsg + i18Arr['zc.ccinfo.nospacesincardvernum'] + "<br>";
                frm.cardvernum.focus();
                toret = false;
            }
            if(errmsg != '') {
                setError(errmsg);
            }
            if(toret == true) {
                ZCUtil.sendRequest($(frm).attr("action"), ZCUtil.getFieldsAsParams(frm, ":input[type!=reset][type!=submit][type!=button][type!=file]"), "text", "ZCEvalApp.handleResponse", "", i18Arr['loading']);
            }
        } catch(e) {
            alert('Please report this error to support@zohocreator.com <br>' + e);
        }
        return false;
    }

    this.toggleUpgradeDiv = function(id)
    {
        docid('evalAppUpgradeCCDetails').style.display = 'none';
        docid('evalAppUpgradeFrmContent').style.display = 'block';
        ZCUtil.showInDialog(docid(id).innerHTML, 'closeButton=no, modal=yes');
        this.calculateAmt();
    }

    this.upgrade = function(formObj, isAccUpgradeIncluded)
    {
        var dur = this.getDuration();
        if (isAccUpgradeIncluded)
        {
            var plan = this.docid('planselected');
            var usercnt = plan.options[plan.selectedIndex].getAttribute("users");
            var planno = plan.options[plan.selectedIndex].getAttribute("plan");
            var addrecords = parseInt(this.docid('addonrecords').value);
            var addfiles = parseInt(this.docid('addonfiles').value);
            var addemails = parseInt(this.docid('addonemails').value);
            //var appcharges = parseInt(this.docid('evalappcharges').getAttribute("cost"));
            addrecords = addrecords*5000;
            addfiles = addfiles*0.5;
            addemails = addemails*500;

            formObj.plan.value = planno;
            formObj.usercnt.value = usercnt;
            formObj.duration.value = dur;
            formObj.addrecords.value = addrecords;
            formObj.addfiles.value = addfiles;
            formObj.addemails.value = addemails;
            //formObj.appcharges.value = appcharges;
        }
        else
        {
            formObj.duration.value = dur;
        }

        closeDialog();

        var popName = "evalAppPopUp";
        var popWidth = "750";
        var popHeight = "615";
        var popStyle = "width=" + popWidth + ",height=" + popHeight + ",location=yes,resizable=yes,left=" + ((window.screen.width - popWidth) / 2) + ",top=" + ((window.screen.height - popHeight) / 2);
        formObj.target = popName;
        _win = window.open("", popName, popStyle);
        _win.focus();
        return true;
        //ZCUtil.sendRequest($(formObj).attr("action"), ZCUtil.getFieldsAsParams(formObj, ":input[type!=reset][type!=submit][type!=button][type!=file]"), "text", "ZCEvalApp.handleResponse", "", i18n.loading);
        //return false;
    }

    this.handleResponse = function(result, paramsMap, argsMap)
    {
        if(result == 'success') {
            window.opener.location.reload(false);
            window.close();
            return;
        }
        if (window.opener && !window.opener.closed)
        {
            //window.opener.ZCApp.handleResponse(result, paramsMap, argsMap);
            alert(i18Arr['zc.ccvalidation.failure']);
            return;
        }
        var ccDetails = docid('evalAppUpgradeCCDetails');
        ccDetails.innerHTML = result;
        ccDetails.style.display = 'block';
        docid('evalAppUpgradeFrmContent').style.display = 'none';
        ZCUtil.showInDialog(docid('evalAppUpgradeFrmCon').innerHTML, 'closeButton=no, modal=yes');
    }

    this.calculateAmt = function(id)
    {
        var selAmt = parseInt(this.docid('planselected').value);
        var addrecords = parseInt(this.docid('addonrecords').value);
        var addfiles = parseInt(this.docid('addonfiles').value);
        var addemails = parseInt(this.docid('addonemails').value);
        //var appcharges = parseInt(this.docid('evalappcharges').getAttribute("cost"));
        var appcharges = parseInt(this.docid('planselected').getAttribute("appcost"));

        var selAmtToDisp = selAmt;
        var addrecordsToDisp = addrecords*10;
        var addfilesToDisp = addfiles*10;
        var addemailsToDisp = addemails*20;
        var appchargesToDisp = appcharges;

        var isPlanChooseAvail = (typeof(this.docid('planselected').options) != "undefined");

        var factor = 1;
        var dur = this.getDuration();
        var occur = this.docid('occurance');
        occur.innerHTML = 'MONTH';

        if(dur == 1) { // quarterly
            factor = 3;
            occur.innerHTML = 'QUARTER';
        } else if(dur == 2) { // Half Yearly
            factor = 6*0.95;
            occur.innerHTML = '6 MONTHS';
        } else if(dur == 3) { // Yearly
            factor = 12*0.90;
            occur.innerHTML = 'YEAR';
        }

        selAmtToDisp = selAmt*factor;
        addrecordsToDisp = addrecordsToDisp*factor;
        addfilesToDisp = addfilesToDisp*factor;
        addemailsToDisp = addemailsToDisp*factor;
        appchargesToDisp = appchargesToDisp*factor;
        var total = addrecordsToDisp + addfilesToDisp + addemailsToDisp + appchargesToDisp;

        if (isPlanChooseAvail)
        {
            total += selAmtToDisp;
            //this.docid('plancharges').innerHTML = "$" + this.formatNumb(selAmtToDisp, 2);
            this.docid('plancharges').innerHTML = "$" + this.formatNumb(selAmtToDisp + appchargesToDisp, 2);
        }

        this.docid('recordscharges').innerHTML = "$" + this.formatNumb(addrecordsToDisp, 2);
        this.docid('filescharges').innerHTML = "$" + this.formatNumb(addfilesToDisp, 2);
        this.docid('emailcharges').innerHTML = "$" + this.formatNumb(addemailsToDisp, 2);
        //this.docid('evalappcharges').innerHTML = "$" + this.formatNumb(appchargesToDisp, 2);
        this.docid('totalcharges').innerHTML = "$" + this.formatNumb(total, 2);
        //this.docid('totalamount').innerHTML = "$" + this.formatNumb(total + parseInt(this.docid('evalappcharges').getAttribute("cost")), 2);

        if(id) {
            var arr = new Array(this.docid(id), this.docid('totalcharges'));
            if(id == 'plancharges') {
                arr = new Array(this.docid('plancharges'), this.docid('recordscharges'), this.docid('filescharges'), this.docid('emailcharges'), this.docid('totalcharges'), this.docid('occurance'));
            }
            //DoFade(arr);

        }
    }

    this.docid = function(id) {
        var pid = "#"+_DIALOG_LAYER_VAR;
        return $(pid).find('#' + id).get(0);
    }

    this.getDuration = function() {
        var relems = this.docid('planradiotd').getElementsByTagName('input');
        for(var i=0; i<relems.length; i++) {
            var relem = relems.item(i);
            if(relem.checked == true) {
                return relem.value;
            }
        }
        return 0;
    }
    this.formatNumb = function(num, dec) {
        var decimal = 1;
        for(i=1; i<=dec;i++) {
            decimal = decimal *10;
        }
        return (Math.round(num * decimal)/decimal).toFixed(dec);
    }

        this.clearField = function(fieldLabel,idFieldLabel,obj) {
        	var isdisabled=$("#"+fieldLabel).attr("disabled");
        	var issub=$(obj).attr("labelname");
        	if(issub!==undefined)
        	{
        		var lName = fieldLabel +"_" +issub;
        		isdisabled=$("input[id='"+lName+"']").attr("disabled");
        	}
        	if(isdisabled !== "disabled")
        	{
             document.getElementById(fieldLabel).value = '';
             if(idFieldLabel != 'undefined' && idFieldLabel != "")
             {
             	document.getElementById(idFieldLabel).value = '';
             }
             ExternalFieldName = fieldLabel;
             if(ExternalFieldName)
             {
                 ZCForm.triggerExternalOnUser(fieldLabel);
                 ExternalFieldName = '';
             }
        	}
        }

        this.clearExtField = function(fieldLabel, fcid) {
        	var isdisabled=$("#"+fieldLabel).attr("disabled");
        	if(isdisabled !== "disabled")
        	{
	             document.getElementById(fieldLabel).value = '';
	             if(fcid == "grid")
	             {
	             	document.getElementById(fieldLabel).setAttribute("extValue", "");
	             }
	             else
	             {
			     var parent = document.getElementById("ext_fields_" +fcid);
			     for (var i = 0; i < parent.childNodes.length; i++)
			     {
				 var child = parent.childNodes[i];
				 if(child.value != undefined && child.value != "undefined")
				 {
					child.value = '';
				 }
			     }
			     ExternalFieldName = fieldLabel;
			     if(ExternalFieldName)
			     {
				 ZCForm.triggerExternalOnUser(fieldLabel);
				 ExternalFieldName = '';
			     }
		     }
           }
        }

        this.constructExternalURL = function(serviceType, moduleType, fieldName, idFieldName , baseUrl)
        {
        	var urlString;
                switch(serviceType)
                {
                    case ZCConstants.EXTERNAL_SERVICE_ZOHO_CRM:
                    {
                        switch(moduleType)
                        {
                            case ZCConstants.ZOHO_CRM_LEADS:
                            {
                                urlString = baseUrl + "searchmodule=" + ZCConstants.ZOHO_CRM_LEADS_LINK_NAME; //No I18N
                                break;
                            }
                            case ZCConstants.ZOHO_CRM_ACCOUNTS:
                            {
                                urlString = baseUrl + "searchmodule=" + ZCConstants.ZOHO_CRM_ACCOUNTS_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.ZOHO_CRM_CONTACTS:
                            {
                                urlString = baseUrl + "searchmodule=" + ZCConstants.ZOHO_CRM_CONTACTS_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.ZOHO_CRM_POTENTIALS:
                            {
                                urlString = baseUrl + "searchmodule=" + ZCConstants.ZOHO_CRM_POTENTIALS_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.ZOHO_CRM_CAMPAIGNS:
                            {
                                urlString = baseUrl + "searchmodule=" + ZCConstants.ZOHO_CRM_CAMPAIGNS_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.ZOHO_CRM_NOTES:
                            {
                                urlString = baseUrl + "searchmodule=" + ZCConstants.ZOHO_CRM_NOTES_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.ZOHO_CRM_SALESORDERS:
                            {
                                urlString = baseUrl + "searchmodule=" + ZCConstants.ZOHO_CRM_SALESORDERS_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.ZOHO_CRM_PURCHASEORDERS:
                            {
                                urlString = baseUrl + "searchmodule=" + ZCConstants.ZOHO_CRM_PURCHASEORDERS_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.ZOHO_CRM_INVOICES:
                            {
                                urlString = baseUrl + "searchmodule=" + ZCConstants.ZOHO_CRM_INVOICES_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.ZOHO_CRM_CASES:
                            {
                                urlString = baseUrl + "searchmodule=" + ZCConstants.ZOHO_CRM_CASES_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.ZOHO_CRM_TASKS:
                            {
                                urlString = baseUrl + "searchmodule=" + ZCConstants.ZOHO_CRM_TASKS_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.ZOHO_CRM_EVENTS:
                            {
                                urlString = baseUrl + "searchmodule=" + ZCConstants.ZOHO_CRM_EVENTS_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.ZOHO_CRM_QUOTES:
                            {
                                urlString = baseUrl + "searchmodule=" + ZCConstants.ZOHO_CRM_QUOTES_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.ZOHO_CRM_VENDORS:
                            {
                                urlString = baseUrl + "searchmodule=" + ZCConstants.ZOHO_CRM_VENDORS_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.ZOHO_CRM_PRODUCTS:
                            {
                                urlString = baseUrl + "searchmodule=" + ZCConstants.ZOHO_CRM_PRODUCTS_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.ZOHO_CRM_PRICEBOOKS:
                            {
                                urlString = baseUrl + "searchmodule=" + ZCConstants.ZOHO_CRM_PRICEBOOKS_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.ZOHO_CRM_SOLUTIONS:
                            {
                                urlString = baseUrl + "searchmodule=" + ZCConstants.ZOHO_CRM_SOLUTIONS_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.ZOHO_CRM_USERS:
                            {
                                urlString = baseUrl + "searchmodule=" + ZCConstants.ZOHO_CRM_USERS_LINK_NAME;//No I18N
                                break;
                            }
                            default:
                            {
                                urlString =  baseUrl;
                            }
                        }
                        return urlString + "&fldName=" + fieldName + "&fldId=" + idFieldName + "&frmzc=true";//No I18N
                    }
                    case ZCConstants.EXTERNAL_SERVICE_SDP_OD:
                	{
                    	switch(moduleType)
                        {
                            case ZCConstants.SDP_OD_TECHNICIANS:
                            {
                                urlString = baseUrl + "actionToCall=searchGlobal&searchModule=" + ZCConstants.SDP_OD_TECHNICIANS_LINK_NAME; //No I18N
                                break;
                            }
                            case ZCConstants.SDP_OD_CATEGORY:
                            {
                                urlString = baseUrl + "actionToCall=searchGlobal&searchModule=" + ZCConstants.SDP_OD_CATEGORY_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.SDP_OD_STATUS:
                            {
                                urlString = baseUrl + "actionToCall=searchGlobal&searchModule=" + ZCConstants.SDP_OD_STATUS_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.SDP_OD_LEVEL:
                            {
                                urlString = baseUrl + "actionToCall=searchGlobal&searchModule=" + ZCConstants.SDP_OD_LEVEL_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.SDP_OD_PRIORITY:
                            {
                                urlString = baseUrl + "actionToCall=searchGlobal&searchModule=" + ZCConstants.SDP_OD_PRIORITY_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.SDP_OD_REQUEST_TYPE:
                            {
                                urlString = baseUrl + "actionToCall=searchGlobal&searchModule=" + ZCConstants.SDP_OD_REQUEST_TYPE_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.SDP_OD_SITES:
                            {
                                urlString = baseUrl + "actionToCall=searchGlobal&searchModule=" + ZCConstants.SDP_OD_SITES_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.SDP_OD_DEPARTMENTS:
                            {
                                urlString = baseUrl + "actionToCall=searchGlobal&searchModule=" + ZCConstants.SDP_OD_DEPARTMENTS_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.SDP_OD_ASSETS:
                            {
                                urlString = baseUrl + "actionToCall=searchGlobal&searchModule=" + ZCConstants.SDP_OD_ASSETS_LINK_NAME;//No I18N
                                break;
                            }
                            case ZCConstants.SDP_OD_USERS:
                            {
                                urlString = baseUrl + "actionToCall=searchGlobal&searchModule=" + ZCConstants.SDP_OD_USERS_LINK_NAME;//No I18N
                                break;
                            }
                            default:
                            {
                                urlString =  baseUrl;
                            }
                        }
                    	return urlString + "&fldName=" + fieldName + "&fldId=" + idFieldName;//No I18N
                	}
                    default:
                    {
                        return baseUrl;//No I18N
                    }
                }
        }

        this.showExternalGridPopup = function(el, serType, modType, fieldName, extFieldName, baseUrl)
        {
        	var recID = el.getAttribute("labelName");
        	var lName = fieldName +"_" +recID;
        	var extLName = extFieldName +"_" +recID;
        	var isdisabled=$("input[id='"+lName+"']").attr("disabled");
        	if(isdisabled !== "disabled")
        	{
	        	var url = ZCEvalApp.constructExternalURL(serType, modType, lName, extLName, baseUrl);
	        	if(serType == ZCConstants.EXTERNAL_SERVICE_SDP_OD)
	    		{
	        		ZCEvalApp.showExternalLookupInIframe(url, fieldName);
	    		}
	        	else
	            {
	            	ZCEvalApp.showExternalPopup(url, fieldName);
	            }
        	}
    	}

        this.showExternalPopup = function(url,fieldName)
        {
        	var isdisabled=$("#"+fieldName).attr("disabled");
        	if(isdisabled !== "disabled")
        	{
	        	var scheme = (document.location.protocol == "ht"+"tps:")?"ht"+"tps://":"ht"+"tp://";
	        	ExternalFieldName = fieldName;
	        	window.open(scheme+url,"creatorwindow","location=1,status=1,scrollbars=1,width=700,height=600");
        	}
    	}
        
        this.showExternalLookupInIframe = function(externalUrl, fieldName)
        {
        	var url = '/externalLookupInIframe.do';//No I18N
    		var params = "sharedBy=" + ZCApp.sharedByDisp;
    		params = params + "&externalUrl=" +externalUrl;
    		params = params + "&appLinkName=" +ZCApp.appLinkName;
        	ZCUtil.sendRequest(url,params,"html","ZCEvalApp.showExternalLookupInIframe_return");//No I18N
        }
        
        this.showExternalLookupInIframe_return = function(html, params)
    	{
    		var options = "position=absmiddle, closeButton=no, modal=yes, position=absolute, closeParent=false";
    		showDialog(html, options);
    	}

	this.showExternalModuleLookup = function(serviceType, moduleType, fieldName, fsField, fcID, extType)
	{
		/*var compLinkName = ZCApp.currZCComp;
		var compType = ZCUtil.getFromMap(ZCApp.compNameVsTypeMap, compLinkName);
		var paramsMap = (compType == ZCConstants.FORM)?ZCForm.formArr[compLinkName]:ZCView.viewArr[compLinkName];
		var formLinkName = ZCUtil.getFromMap(paramsMap, "formLinkName");
		if(formLinkName == "")
		{
			formLinkName = ZCUtil.getFromMap(paramsMap, "viewFormName")
		}*/
		var isdisabled=$("#"+fieldName).attr("disabled");
    	if(isdisabled !== "disabled")
    	{
			var formLinkName = docid(fieldName).getAttribute("formLinkName");
			var url = '/externalModuleLookup.do';//No I18N
			var params = "sharedBy=" + ZCApp.sharedByDisp;
			params = params + "&serviceType=" +serviceType;
			params = params + "&moduleType=" +moduleType;
			params = params + "&fieldName=" +fieldName;
			params = params + "&fsField=" +fsField;
			params = params + "&fcID=" +fcID;
			params = params + "&formLinkName="+formLinkName;
			if(!extType)
			{
				extType = ""
			}
			params = params + "&extType="+extType;
			ZCUtil.sendRequest(url,params,"html","ZCEvalApp.showExternalModuleLookup_return");//No I18N
    	}
	}

        this.showExternalModuleLookup_return = function(html, params)
	{
		var options = "position=absmiddle, closeButton=no, modal=yes, position=absolute, closeParent=false";
		showDialog(html, options);
	}

	this.showExternalModuleLookupSubform = function(el, serviceType, moduleType, fieldName, fsField)
	{
        	var recID = el.getAttribute("labelName");
        	var lName = fieldName +"_" +recID;
        	var isdisabled=$("input[id='"+lName+"']").attr("disabled");
        	if(isdisabled !== "disabled")
        	{
	    		var formLinkName = docid(fieldName+"_"+recID).getAttribute("formLinkName");
	    		var appLinkName = docid(fieldName+"_"+recID).getAttribute("appLinkName");
	    		var url = '/externalModuleLookup.do';//No I18N
	    		var params = "sharedBy=" + ZCApp.sharedByDisp;
	    		params = params + "&serviceType=" +serviceType;
	    		params = params + "&moduleType=" +moduleType;
	    		params = params + "&fieldName=" +fieldName;
	    		params = params + "&fsField=" +fsField;
	    		params = params + "&fcID=" +recID;
	    		params = params + "&formLinkName="+formLinkName;
	    		params = params + "&appLinkName="+appLinkName;
	    		params = params + "&extType=subform";
	    		ZCUtil.sendRequest(url,params,"html","ZCEvalApp.showExternalModuleLookup_return");//No I18N
        	}
	}

	this.searchExternalModuleLookup = function(el, fromRange, totalUsers)
	{
		/*var compLinkName = ZCApp.currZCComp;
		var compType = ZCUtil.getFromMap(ZCApp.compNameVsTypeMap, compLinkName);
		var paramsMap = (compType == ZCConstants.FORM)?ZCForm.formArr[compLinkName]:ZCView.viewArr[compLinkName];
		var formLinkName = ZCUtil.getFromMap(paramsMap, "formLinkName");
		if(formLinkName == "")
		{
			formLinkName = ZCUtil.getFromMap(paramsMap, "viewFormName")
		}*/
		var formLinkName = docid("ext-formLinkName").value;
		var searchString = docid("ext-search-str").value;
		var serviceType = docid("ext-serType").value;
		var moduleType = docid("ext-modType").value;
		var fieldName = docid("ext-fieldName").value;
		var fsField = docid("ext-fsField").value;
		var fcID = docid("ext-fcID").value;
		var extType = docid("ext-Type").value;
		var params = "sharedBy=" + ZCApp.sharedByDisp;
		params = params + "&serviceType=" +serviceType;
		params = params + "&moduleType=" +moduleType;
		params = params + "&fieldName=" +fieldName;
		params = params + "&fsField=" +fsField;
		params = params + "&fcID=" +fcID;
		params = params + "&formLinkName="+formLinkName;
		params = params + "&extType="+extType;
		var toRange = fromRange+9;
		if(el)
		{
			if(fromRange < 0 || el == "first")
			{
				fromRange = 0;
				toRange = 9;
			}
			else if(el == "last")
			{
				fromRange = totalUsers - (totalUsers % 10);
				toRange = fromRange+9;
			}
			else if(el == "next" && fromRange > totalUsers)
			{
				fromRange = fromRange - 10;
				toRange = fromRange + 9;
			}
			params = params + "&searchString=" +searchString + "&from=" +fromRange + "&to=" +toRange;
		}
		else
		{
			params = params + "&searchString=" +searchString;
		}
		var url = '/externalModuleLookup.do';//No I18N
		ZCUtil.sendRequest(url,params,"html","ZCEvalApp.searchExternalModuleLookup_return");
	}

	this.searchExternalModuleLookup_return = function(html, params)
	{
		closeDialog();
		var options = "position=absmiddle, closeButton=no, modal=yes, position=absolute, closeParent=false";
		showDialog(html, options);
	}

	this.setExtFieldValue = function(el,fieldName, fcID)
	{
		var extType = docid("ext-Type").value;

		closeDialog();
		if(extType == "grid")
		{
			var pn = el.parentNode;
			var cn = pn.getElementsByTagName("td");
		   	var node = cn[cn.length-1];
			docid(fieldName).value = (el.innerHTML).trim();
			docid(fieldName).setAttribute("extValue",(node.innerHTML).trim());
		}
		else if(extType === "sheet")
		{
			var pn = el.parentNode;
			var cn = pn.getElementsByTagName("td");
		   	var node = cn[cn.length-1];
			docid(fieldName).value = (el.innerHTML).trim();
			docid(fieldName).setAttribute("extValue",(node.innerHTML).trim());
			ZCSheetView.updateZohoCrmUserVal(fieldName);
		}
		else if(extType == "subform")
		{
			var pn = el.parentNode;
			var cn = pn.getElementsByTagName("td");
		   	var node = cn[cn.length-1];
		    	var fName = el.getAttribute("fName");
			docid(fieldName+"_"+fcID).value = (node.innerHTML).trim();
			docid(fName+"_"+fcID).value = (el.innerHTML.trim());
		}
		else
		{
			var pn = el.parentNode;
			var cn = pn.getElementsByTagName("td");
			for(var index=0;index<cn.length;index++)
			{
			    var node = cn[index];
			    var fName = node.getAttribute("fName");
			    docid(fName+"_"+fcID).value = (node.innerHTML).trim();
			}
			docid(fieldName).value = (el.innerHTML).trim();
			ExternalFieldName = fieldName;
			if(ExternalFieldName)
			{
				ZCForm.triggerExternalOnUser(fieldName);
				ExternalFieldName = '';
			}
		}
	}
	
	this.showUsers = function(dName, compId, lName, formLinkName)
	{
		var params = "sharedBy=" + ZCApp.sharedByDisp;
		params = params + "&displayName="+dName;
		params = params + "&labelName="+lName;
		params = params + "&compId="+compId;
		params = params + "&formLinkName="+formLinkName;
		ZCUtil.sendRequest('/showUsersDialog.do',params,"html","ZCEvalApp.showUsers_return");
	}

	this.showUsers_return = function(html, params)
	{
		var options = "position=absmiddle, closeButton=no, modal=yes, position=absolute, closeParent=false";
		showDialog(html, options);
	}
}

var ZCAppSearch = new function(){
	
	/****APP SEARCH BOX FUNCTIONALITY START*****/
	this.showHideSearchList = function() {
		var appSearchList = $('#app_search_option_list');
		appSearchList.toggle();
		if(appSearchList.css("display") == 'none'){
			$('#app_search_box').removeClass('moreSearch');
		}else{
			$('#app_search_box').addClass('moreSearch');
			
		}
			
	}
	
	this.hideSearchList = function(){
		var appSearchList = $('#app_search_option_list');
		appSearchList.css("display", 'none')
		$('#app_search_box').removeClass('moreSearch');
	}
	
	this.searchFormList = function(el) {
		var filter = $(el).val();
		var list = $('#app_search_box_container').find('li[elname="formNameList"]');
		if(filter){
			$(list).find( "label:not(:contains(" + filter + "))" ).closest("li").slideUp();
			$(list).find("label:contains(" + filter + ")").closest("li").slideDown();
		}else{
			$(list).slideDown();
		}	
	}
	
	this.resetElementSelect = function(el){
		
		var ckbox = $('#app_search_box_container').find('li[elname="formNameList"]').find('input');
		if( $(el).is(':checked') ) {
			ckbox.prop('checked', true);
	    }
	    else {
	    	ckbox.removeAttr('checked');
	    }
		
	}
	
	this.uncheckALL_Form = function(){
		$('#All_Form').removeAttr('checked');
	}
	
	/****APP SEARCH BOX FUNCTIONALITY END*****/
	
	this.MAX_LAYOUT_SIZE = 4;
	
	this.layoutDetails;
	this.searchTerm;
	
	this.searchableLayouts;
	this.loadedLayouts;
	
	this.clearAndLoadLayouts = function(el, event) {
		if(event.keyCode == 13)	{
			if( !this.isSearchTermBlank(el) ) {
				this.searchTerm = $(el).val();
				this.layoutDetails = {};
				
				this.searchableLayouts = null;
				this.loadedLayouts = new Array();
				this.loadLayouts();
			}
		}
	}
	
	this.isSearchTermBlank = function(el){
		var searchTerm = $(el).val();
		return (searchTerm.length === 0 || !searchTerm.trim());
	}
	
	this.removeFromArray = function(array, value){
		var index = array.indexOf(value);
		if(index != -1) {
			array.splice(index, 1);
		}
	}
	
	this.enDisPreAndNextlink = function(){
		
		var searchContainer = $('div[elname="searchResultsContainer"]');
		if( this.searchableLayouts.length == this.loadedLayouts.length){
			//disable Next link
			searchContainer.find('div[elname="searchlayoutNextlink"]').css('display','none');
		}else{
			searchContainer.find('div[elname="searchlayoutNextlink"]').css('display','');
		}
		
		if(this.loadedLayouts.length <= this.MAX_LAYOUT_SIZE){
			//disable Prev Link
			searchContainer.find('div[elname="searchlayoutPreviouslink"]').css('display','none');
		}else{
			searchContainer.find('div[elname="searchlayoutPreviouslink"]').css('display','');
		}
		
		if( searchContainer.find('div[elname="layoutDiv"]').length == 0 ){
			searchContainer.prepend('<div class="outerlayer"><div class="searchNoResults" align="center">No matching record(s) found </div><div>');
		}
	}
	
	this.loadPrevious = function(){
		for(var i=0; i< this.MAX_LAYOUT_SIZE + $('div[elname="layoutDiv"]').length; i++){
			this.loadedLayouts.pop();
		}
		this.loadLayouts();
	}
	
	this.loadNext = function(){
		this.loadLayouts();
	}
	
	this.loadLayouts = function(){
		var postData = {};
		postData.searchTerm = this.searchTerm;
    	postData.appLinkName = ZCApp.appLinkName;
    	postData[ZCApp.csrfParamName] = ZCApp.csrfParamValue;
    	postData.sharedBy = ZCApp.sharedBy;
    	postData.selectedLayouts = JSON.stringify(this.getSearchableLayouts());
    	
    	ZCApp.setLoadingMsg($("#zc-loading"), i18n.pleasewait + " ...");
		ZCApp.showLoading("zc-loading");//No I18N
    	
    	$.post( "/appDataSearch.do", postData, function(data, textStatus, jqXHR) { 
    												var searchlayoutdiv = $("#zc-component").find("div[elname='zc-component-searchlayout']");
    												ZCApp.clearZCComponent();
										    		searchlayoutdiv.append(data);
    												searchlayoutdiv.css("display", "");
    												ZCApp.hideLoading("zc-loading");
    												
										    	}, "html");
    	
	}
	
	this.getSearchableLayouts = function(){
		
		var arr = new Array();
		if(!this.searchableLayouts){
			var layouts = $('#app_search_box_container').find('input[elname="searchoption"]:checked'); 
			this.searchableLayouts = new Array();
			for(var i=0; i<layouts.size(); i++){
				this.searchableLayouts[i] = $(layouts[i]).attr('id');
			}
		}
		
		for( var j=0; j<this.searchableLayouts.length; j++){
			if( this.loadedLayouts.indexOf(this.searchableLayouts[j]) == -1){
				arr.push(this.searchableLayouts[j]);
			}
		}
		return arr;
	}
	
	this.setLayoutDetails = function(layoutName, map){
		
		var layout = $("div[layoutName='" + layoutName +"']");
		
		layout.find("span[elname='fromIndex']").text(map.fromIndex);
		layout.find("span[elname='lastIndex']").text(map.lastIndex);
		
		var previousLink = layout.find('div[elname="previouslink"]');
		var nextLink = layout.find('div[elname="nextlink"]');
		
		if( map.hasPreviousElements ) {
			previousLink.removeClass('searchlayoutprelink_disabled searchlayoutprelink_enabled').addClass('searchlayoutprelink_enabled');
			previousLink.click( function(){
											ZCAppSearch.loadLayoutData( layoutName, 'previous')
										});
		}else{
			previousLink.removeClass('searchlayoutprelink_disabled searchlayoutprelink_enabled' ).addClass('searchlayoutprelink_disabled');
			previousLink.off("click");
		}
		
		if( map.hasMoreElements){
			nextLink.removeClass('searchlayoutnextlink_disabled searchlayoutnextlink_enabled'  ).addClass('searchlayoutnextlink_enabled');
			nextLink.click( function(){
										ZCAppSearch.loadLayoutData( layoutName, 'next')
									});
		}else{
			nextLink.removeClass('searchlayoutnextlink_disabled searchlayoutnextlink_enabled'  ).addClass('searchlayoutnextlink_disabled');
			nextLink.off("click");
		}
		
	}
	
	this.loadLayoutData = function(layoutName, navigation){
			var searchlayoutdiv = $("#zc-component").find("div[elname='zc-component-searchlayout']");
			var layoutDiv = searchlayoutdiv.find("[layoutname='" + layoutName + "']");
			var dataDiv = layoutDiv.find("div[elname='dataDiv']");
			var tableEl = dataDiv.find("table");
			var details = this.layoutDetails[ layoutName];
			
			
			if( !details['loadingtriggerd'] )	{
	
				details['loadingtriggerd'] = true;
				var postData = {};
				postData.searchTerm = this.searchTerm;
				postData[ZCApp.csrfParamName] = ZCApp.csrfParamValue;
				postData.layout = layoutName;
		    	postData.appLinkName = ZCApp.appLinkName;
		    	postData.fromIndex = details['fromIndex'];
		    	postData.lastIndex = details['lastIndex'];
		    	postData.searchState = JSON.stringify(details['searchState']);
		    	postData.navigation = navigation;
		    	postData.sharedBy = ZCApp.sharedBy;
		  
		    	ZCApp.setLoadingMsg($("#zc-loading"), i18n.pleasewait + " ...");
				ZCApp.showLoading("zc-loading");//No I18N
				
				$.post( "/loadLayoutData.do", postData, function(data, textStatus, jqXHR){
															var tableBody = tableEl.find('tbody');
															tableBody.find('tr').remove();
															tableBody.append(data);
															details['loadingtriggerd'] = false;
															ZCApp.hideLoading("zc-loading");
															
														}, "html" );
			}
		}
	    
	
	/***EDIT DELETE CODE START*****/
	this.showEditForm = function(el){
		var  tr = $(el).closest('tr');
		var formLinkName = tr.closest('div[elname="layoutDiv"]').attr('layoutname');
		var recLinkID = tr.attr('reclinkid');
		var params = "compType="+ZCConstants.FORM+"&formLinkName="+formLinkName+"&formAccessType="+ZCConstants.VIEW_EDIT_FORM+"&recLinkID="+recLinkID; //No I18N
		params = params + "&formBasedOperation=true" + "&isNewAppearance=true"+ "&zc_EditType=default"; 	
		//params = params + "&isViewBeta=true" ;//No I18N
        ZCUtil.sendRequest(ZCApp.compProps["actionURL-"+ZCConstants.FORM], params, "html", "ZCApp.loadZCCompInDialog", ZCUtil.getParamsAsMap("include=false&closeDialog=true"), i18n.pleasewait);
	}
	
	this.deleteRecord = function(el){
		
		var  tr = $(el).closest('tr');
		var formLinkName = tr.closest('div[elname="layoutDiv"]').attr('layoutname');
		var recLinkID = tr.attr('reclinkid');
		
        var deleteUrl = "/deleteformrecord.do";
		var deleteParams = "sharedBy=" + ZCApp.sharedByDisp + "&appLinkName=" + ZCApp.appLinkName + "&formLinkName=" + formLinkName +"&deletegroup="+recLinkID; //No I18N
		deleteParams = deleteParams + "&" + ZCApp.csrfParamName + "=" + ZCApp.csrfParamValue;
		deleteParams = deleteParams + "&" + "formBasedOperation=true";
     	
		ZCView.showConfirmPopUp(i18n.deleterecord, function(){
     															//ZCView.commitDelDupl(deleteUrl, "delete", deleteParams);
     															ZCUtil.sendRequest(deleteUrl, deleteParams, "json", "ZCAppSearch.handleDelRecAction", "duplicate", i18n.duplicateinfomsg); // No I18N
     														});//No I18N
     	
		
	}
	
	this.viewRecord = function(el){
		
		var  tr = $(el).closest('tr');
		var formLinkName = tr.closest('div[elname="layoutDiv"]').attr('layoutname');
		var recLinkID = tr.attr('reclinkid');
		var viewurl = "/viewformrecord.do";
	    var postData = {};
	    postData.sharedBy = ZCApp.sharedByDisp;
	    postData.appLinkName = ZCApp.appLinkName;
	    postData.formLinkName = formLinkName; 
	    postData.recordlinkID = recLinkID; 
	    postData[ZCApp.csrfParamName] = ZCApp.csrfParamValue;
	    postData.formBasedOperation=true;
	    
		$.post( viewurl, postData, function(data, textStatus, jqXHR){
	           //var showClosebtn = "closelink=no";//No I18N
				var showClosebtn = "closeButton=no";//No I18N
               ZCUtil.showInDialog(data, "position=absolute, " + showClosebtn + ",closeOnBodyClick=yes, modal=yes, dialog_closeOutside=true");//No I18N
               ZCApp.correctDialog();
		}, "html" );
		
	}
	
	this.handleDelRecAction = function(respTxt, paramsMap, argsMap)
	{
		var delrecaction = null;
		var responseArr = ZCForm.getMsgFromResponse(respTxt, "");
		var succMsg = ZCUtil.isNull(responseArr["succMsg"])?"":responseArr["succMsg"];
		var succMsgDuration = responseArr["successMsgDuration"]; // No I18N
		var succList = responseArr["successList"];
		var errList = responseArr["errorList"];
		//var delactdiv = $(viewCont).find("div[elName=zc-delactionsdiv]").clone(true);
		var succStr = (succList)?succList.length + " " + i18n.delsuccmsg:"";
		var failStr = (errList)?errList.length + " " + i18n.delfailmsg:"";
		if(!ZCUtil.isNull(errList) || !ZCUtil.isNull(succList))
		{
			//ZCView.setActionRespInDiv(delactdiv, succList, errList, succStr, failStr);
			//if(!ZCUtil.isNull(errList))
			//{
				//succMsg = "";
			//}
			//if($(delactdiv).attr("showDialog"))
			//{
				//succMsg = "";
				//delrecaction = $(delactdiv).html();
			//}
		}
        
		//ZCView.showView(viewParamsMap, succMsg, delrecaction, succMsgDuration);
		//showDialog(ZCApp.dialogAbove+$(delactdiv).html()+ZCApp.dialogBelow, "closeButton=no");
		ZCAppSearch.loadLayoutData( paramsMap['formLinkName'][0], 'current');
		return false;
	}
		/****EDIT DELETE CODE END****/
	
	
	/***Fixed Bar Repositioning start***/
	this.adjustFixedBar = function(){
		if($('#searchResultsContainerDiv')[0]){
			var documentWidth = $(document).width();
			var scrollLeft = $(window).scrollLeft();
			var windowWidth = $(window).width();
			var layoutFooters = $('div[elname="searchlayoutfooter"]');
			layoutFooters.css('right', 15 + documentWidth - (windowWidth + scrollLeft)  );
			
			var layoutNavBar = $('div[elname="searchlayoutsNavBar"]');
			var preLinkDisplay = layoutNavBar.find('div[elname="searchlayoutPreviouslink"]').css('display');
			var nextLinkDisplay = layoutNavBar.find('div[elname="searchlayoutNextlink"]').css('display');
			var size =  preLinkDisplay !== 'none' ? 94: 0;
			size += nextLinkDisplay !== 'none' ? 94: 0;
			size += preLinkDisplay !== 'none' && nextLinkDisplay !== 'none' ? 10 : 0;
			layoutNavBar.css('left', scrollLeft + (windowWidth-size)/2);
			//layoutNavBar.css('left', scrollLeft + (windowWidth-layoutNavBar.width())/2);
		}
	}
	/***Fixed Bar Repositioning end***/

	/*
	this.layoutDetails = {};
	this.selectedLayouts = new Array();
	this.searchTerm = "";
	this.clearZCComponent = false;
	
	
	
	this.reloadCurrentLayout = function(){
		this.layoutDetails = {};
		this.selectedLayouts = this.getSelectedLayouts();
		this.clearZCComponent = true;
		this.loadLayouts();
	}
	
	this.clearAndLoadLayouts = function(el, event) {
		if(event.keyCode == 13)	{
			this.layoutDetails = {};
			this.searchTerm = $(el).val();
			this.selectedLayouts = this.getSelectedLayouts();
			this.clearZCComponent = true;
			this.loadLayouts();
			
	    }
	}
	
	this.loadLayouts = function(layoutName){
		var postData = {};
		postData.searchTerm = this.searchTerm;
    	postData.appLinkName = ZCApp.appLinkName;
    	postData[ZCApp.csrfParamName] = ZCApp.csrfParamValue;
    	postData.sharedBy = ZCApp.sharedBy;
    	
    	if(layoutName){
    		var arr = new Array();
    		arr.push(layoutName);
    		postData.selectedLayouts = JSON.stringify(arr);
    	}else{
    		postData.selectedLayouts = JSON.stringify(this.getUnLoadedLayouts());
    	}
    	
    	$.post( "/appDataSearch.do", postData, function(data, textStatus, jqXHR) { 
    												var searchlayoutdiv = $("#zc-component").find("div[elname='zc-component-searchlayout']");
    												ZCApp.clearZCComponent();
										    		this.clearZCComponent = false;
										    		searchlayoutdiv.append(data);
    												searchlayoutdiv.css("display", "");
										        	
										    	}, "html");
    	
   }
	
	
	this.loadLayoutData = function(layoutName, previous){
		
		var searchlayoutdiv = $("#zc-component").find("div[elname='zc-component-searchlayout']");
		var layoutDiv = searchlayoutdiv.find("[layoutname='" + layoutName + "']");
		var dataDiv = layoutDiv.find("div[elname='dataDiv']");
		var tableEl = dataDiv.find("table");
		var details = this.layoutDetails[ layoutName];
		
		
		if( !details['loadingtriggerd'] )	{

			details['loadingtriggerd'] = true;
			var postData = {};
			postData.searchTerm = this.searchTerm;
			postData[ZCApp.csrfParamName] = ZCApp.csrfParamValue;
			postData.layout = layoutName;
	    	postData.appLinkName = ZCApp.appLinkName;
	    	postData.fromIndex = details['fromIndex'];
	    	postData.lastIndex = details['lastIndex'];
	    	postData.searchState = JSON.stringify(details['searchState']);
	    	postData.previous = previous;
	    	postData.sharedBy = ZCApp.sharedBy;
	  
			$.post( "/loadLayoutData.do", postData, function(data, textStatus, jqXHR){
														var tableBody = tableEl.find('tbody');
														tableBody.find('tr').remove();
														tableBody.append(data);
														
														layoutDiv.find('span[elname="fromIndex"]').html( ZCAppSearch.layoutDetails[layoutName].fromIndex );
														layoutDiv.find('span[elname="lastIndex"]').html( ZCAppSearch.layoutDetails[layoutName].lastIndex );
														
														layoutDiv.find('a[elname="previouslink_enable"]').css("display", ZCAppSearch.layoutDetails[layoutName].hasPreviousElements ? "" : "none" );
														layoutDiv.find('a[elname="nextlink_enable"]').css("display", ZCAppSearch.layoutDetails[layoutName].hasMoreElements ? "" : "none" );
														
														layoutDiv.find('a[elname="previouslink_disable"]').css("display", (!ZCAppSearch.layoutDetails[layoutName].hasPreviousElements) ? "" : "none" );
														layoutDiv.find('a[elname="nextlink_disable"]').css("display", (!ZCAppSearch.layoutDetails[layoutName].hasMoreElements) ? "" : "none" );
														
														details['loadingtriggerd'] = false;
														
													}, "html" );
		}
	}
	    

	
	this.getSelectedLayouts = function(){
		var layouts = $('#app_search_box_container').find('input[elname="searchoption"]:checked'); 
		var arr = new Array();
		for(var i=0; i<layouts.size(); i++){
			arr[i] = $(layouts[i]).attr('id');
		}
		return arr;
	}
	
	this.getUnLoadedLayouts = function(){
		
		var unLoadedLayouts = new Array();
		for(var i=0; i<this.selectedLayouts.length; i++){
			if(!this.layoutDetails[ this.selectedLayouts[i] ]){
				unLoadedLayouts.push( this.selectedLayouts[i] );
			}
		}
		return unLoadedLayouts;
	}

	

	*/
}	

//jQuery migrate js file (not using this as sepatete file bcz of sites integration)

jQuery.uaMatch = function( ua ) {
	ua = ua.toLowerCase();

	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

	return {
		browser: match[ 1 ] || "",
		version: match[ 2 ] || "0"
	};
};

// Don't clobber any existing jQuery.browser in case it's different
if ( !jQuery.browser ) {
	matched = jQuery.uaMatch( navigator.userAgent );
	browser = {chrome:false,webkit:false,safari:false,msie:false,mozilla:false,opera:false};

	if ( matched.browser ) {
		browser[ matched.browser ] = true;
		browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
		browser.webkit = true;
	} else if ( browser.webkit ) {
		browser.safari = true;
	}

	jQuery.browser = browser;
}


function getWindowHeight() {
	var myHeight = 0;
	if( typeof( window.innerWidth ) == 'number' ) {
		//Non-IE
		myHeight = window.innerHeight;
	} else if( document.documentElement && (document.documentElement.clientHeight ) ) {
		//IE 6+ in 'standards compliant mode'
		myHeight = document.documentElement.clientHeight;
	} else if( document.body && (document.body.clientHeight ) ) {
		//IE 4 compatible
		myHeight = document.body.clientHeight;
	}
	return myHeight;
}

function getWindowWidth() {
  var myWidth = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
  } else if( document.documentElement && ( document.documentElement.clientWidth) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
  } else if( document.body && ( document.body.clientWidth) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
  }
	return myWidth;
}

//jQuery migrate js file ENDS

function setLanguageCookie(el)
{
	var language = $(el).attr('langvalue');
	var appId= $(el).attr('appid');
	var displayName= $(el).attr('dispname');
	
	ZCApp.setCookie("zc_" + appId + "_" + displayName + "_language",language);
	window.location.reload();
}

function showLiveDeskPane()
{
	$('#chatContainer').slideDown(500);
	$('#liveChatFloat').fadeOut();
	var appLinkName= $('#liveChatFloat').attr('appLinkName');
	var displayName= $('#liveChatFloat').attr('dispname');
	
	ZCApp.setCookie("zc_" + appLinkName + "_" + displayName + "_ChatFrameVisible",'true');
}

function hideLiveDeskPane()
{
	$("#chatContainer").slideUp(500);
	$("#liveChatFloat").fadeIn();
	
	var appLinkName= $('#chatContainer').attr('appLinkName');
	var displayName= $('#chatContainer').attr('dispname');
	
	ZCApp.setCookie("zc_" + appLinkName + "_" + displayName + "_ChatFrameVisible",'');
}