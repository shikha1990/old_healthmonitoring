/*$Id:$*/
// This script consists of two modules
// 1. Form Rendering
// 2. DatePicker

//---------------------------------- start : Form Renderer --------------------------------//
ZohoForms={};
ZohoForms.PREFIX = "/siteforms";
ZohoForms.TEXT=1;
ZohoForms.TEXT_AREA=3;
ZohoForms.EMAIL_ADDRESS=4;
ZohoForms.NUMBER=5;
ZohoForms.CURRENCY=6;
ZohoForms.PERCENTAGE=7;
ZohoForms.CHECK_BOX=9;
ZohoForms.DATE=10;
ZohoForms.TIME=11;
ZohoForms.PLAIN_TEXT=14;
ZohoForms.SCRIPT=15;
ZohoForms.FLOAT=16;
ZohoForms.FROMTO=17;
ZohoForms.FILE_UPLOAD=18;
ZohoForms.DECIMAL=19;
ZohoForms.IMAGE=20;
ZohoForms.URL=21;
ZohoForms.DATE_TIME=22;
ZohoForms.RICH_TEXT=24;
ZohoForms.PICK_LIST=100;
ZohoForms.RADIO=101;
ZohoForms.LIST=102;
ZohoForms.CHECK_BOXES=103;
ZohoForms.IMPORT_DATA=104;
ZohoForms.upload= false;
var mobile =navigator.userAgent.match(/(iPhone|iPod|blackberry|android 0.5|htc|lg|midp|mmp|mobile|nokia|opera mini|palm|pocket|psp|sgh|smartphone|symbian|treo mini|Playstation Portable|SonyEricsson|Samsung|MobileExplorer|PalmSource|Benq|Windows Phone|Windows Mobile|IEMobile|Windows CE|Nintendo Wii)/i);

ZohoForms.renderForm = function(form_meta) {//function for rendering the form from the meta data
    var html =[];
    if(window.ZS_PreviewMode) {
        html.push("<div><form elname=\"",form_meta.formLinkName,"\" name=\"",form_meta.formLinkName,"\" onsubmit=\"fnFormPreviewSubmit();return false;\">");
    }
    else {
        html.push("<div><form elname=\"",form_meta.formLinkName,"\" name=\"",form_meta.formLinkName,"\" action=\"",ZohoForms.PREFIX,"/addRecordValidate.do\" onsubmit=\"fnFormSubmit(this)\" method=\"post\">");
    }
    if(!window.i18n) {
        window.i18n={};
        i18n.selectOption ="Select";i18n.invalidmsg="Invalid entries found, please correct and resubmit.";i18n.pleasewait="Please Wait";//No I18N
    }
    var formid =form_meta.tableName.replace("t_","") ;//form_meta.tableName.replace("t_","") to be changed to form_meta.formid once updated by creator
    html.push("<input type=\"hidden\" name=\"formLinkName\" value=\"",form_meta.formLinkName,"\"/>");
    html.push("<input type=\"hidden\" name=\"recType\" value=\"",form_meta.recType,"\"/>");
    html.push("<input type=\"hidden\" name=\"formid\" value=\"",formid,"\"/>");
    html.push("<input type=\"hidden\" name=\"formLinkId\" value=\"",form_meta.formLinkId,"\"/>");
    html.push("<input type=\"hidden\" name=\"tableName\" value=\"",form_meta.tableName,"\"/>");
    html.push("<input type=\"hidden\" name=\"appLinkName\" value=\"",form_meta.appLinkName,"\"/>");
    html.push("<input type=\"hidden\" name=\"sharedBy\" value=\"",form_meta.sharedBy,"\"/>");
    html.push("<input type=\"hidden\" name=\"dateFormat\" value=\"",form_meta.dateFormat,"\"/>");
    html.push("<input type=\"hidden\" name=\"timeZone\" value=\"",form_meta.timeZone,"\"/>");
    html.push("<h2 class=\"frmname\">",fnAsString(form_meta.DisplayName),"</h2><ul>");
    var field,fields = form_meta.Fields;
    for(i=0;(field = fields[i]);i++) {
        html.push("<li id=\"",form_meta.formLinkName,"-",field.FieldName,"-",form_meta.recType,"\">");
        switch(field.Type) {
            case ZohoForms.TEXT:
            case ZohoForms.EMAIL_ADDRESS:
            case ZohoForms.NUMBER:
            case ZohoForms.DECIMAL:
                fnLabelElem(field, html);
                html.push("<div><span><input formcompid=\"",field.formcompid,"\" onchangeexists=\"",field.onChangeExists,"\" name=\"",field.FieldName,"\" fieldtype=\"",field.Type,"\" delugetype=\"",field.delugeType,"\" type=\"text\" value=\"",(field.Initial)?fnAsString(field.Initial):"","\"",(field.formulaExists && field.formulaExists == true)?"isformulaexist=\"true\"":"",(field.Tooltip)?"title=\""+fnAsString(field.Tooltip)+"\"":"","/></span></div>"); //No I18N
                break;
            case ZohoForms.SCRIPT:
                if(field.Visiblity == "visible"){
                    fnLabelElem(field, html);
                    html.push("<div><span><input formcompid=\"",field.formcompid,"\" onchangeexists=\"",field.onChangeExists,"\" name=\"",field.FieldName,"\" fieldtype=\"",field.Type,"\" delugetype=\"",field.delugeType,"\" style=\"background:none repeat scroll 0 0 #C4C0C0\" type=\"text\" value=\"",(field.Initial)?fnAsString(field.Initial):"","\" disabled/></span></div>");
                }
                break;
            case ZohoForms.PLAIN_TEXT:
                html.push("<div name=\"",field.FieldName,"\" type =\"plaintext\">",field.Text,"</div>");
                break;
            case ZohoForms.CURRENCY:
                fnLabelElem(field, html);
                html.push("<div><span><input formcompid=\"",field.formcompid,"\" onchangeexists=\"",field.onChangeExists,"\" name=\"",field.FieldName,"\" fieldtype=\"",field.Type,"\" delugetype=\"",field.delugeType,"\" type=\"text\" value=\"",(field.Initial)?fnAsString(field.Initial):"","\"",(field.formulaExists && field.formulaExists == true)?"isformulaexist=\"true\"":"",(field.Tooltip)?"title=\""+fnAsString(field.Tooltip)+"\"":""," /><label>", field.CurrencyType, "</label></span></div>");
                break;
            case ZohoForms.PERCENTAGE:
                fnLabelElem(field, html);
                html.push("<div><span><input formcompid=\"",field.formcompid,"\" onchangeexists=\"",field.onChangeExists,"\" name=\"",field.FieldName,"\" fieldtype=\"",field.Type,"\" delugetype=\"",field.delugeType,"\" type=\"text\" value=\"",(field.Initial)?fnAsString(field.Initial):"","\"",(field.formulaExists && field.formulaExists == true)?"isformulaexist=\"true\"":"",(field.Tooltip)?"title=\""+fnAsString(field.Tooltip)+"\"":""," /><label>  % </label></span></div>");
                break;
            case ZohoForms.TEXT_AREA:
            case ZohoForms.RICH_TEXT: 
                fnLabelElem(field, html);
                html.push("<div><span><textarea  name=\"",field.FieldName,"\" formcompid=\"",field.formcompid,"\" onchangeexists=\"",field.onChangeExists,"\" fieldtype=\"",field.Type,"\" delugetype=\"",field.delugeType,"\"",(field.formulaExists && field.formulaExists == true)?"isformulaexist=\"true\"":"",(field.Tooltip)?"title=\""+fnAsString(field.Tooltip)+"\"":""," /></textarea></span></div>");
                break;
            case ZohoForms.DATE:
                fnLabelElem(field, html);
                html.push("<div><span><input formcompid=\"",field.formcompid,"\" onchangeexists=\"",field.onChangeExists,"\" id=\"dateEl-",fnAsString(field.DisplayName),"-",form_meta.formLinkName,"-",form_meta.recType,"\" format=\"",form_meta.dateFormat,"\" name=\"",field.FieldName,"\" fieldtype=\"",field.Type,"\" delugetype=\"",field.delugeType,"\" type=\"text\" value=\"",(field.Initial)?fnAsString(field.Initial):"","\" readonly=\"readonly\"",(field.formulaExists && field.formulaExists === true)?"isformulaexist=\"true\"":"",(field.Tooltip)?"title=\""+fnAsString(field.Tooltip)+"\"":""," />");
                if(window.ZS_PreviewMode) {
                    html.push("<button type=\"button\" for=\"dateEl-",fnAsString(field.DisplayName),"-",form_meta.formLinkName,"-",form_meta.recType,"\" class=\"dateinvoker\"></button></span></div>");
                }else{
                    html.push("<button onclick=\"datepicker.show(this,'date',true)\" type=\"button\" for=\"dateEl-",fnAsString(field.DisplayName),"-",form_meta.formLinkName,"-",form_meta.recType,"\"class=\"dateinvoker\"></button></span></div>");
                }
                break;
            case ZohoForms.DATE_TIME:
                fnLabelElem(field, html);
                html.push("<div><span><input formcompid=\"",field.formcompid,"\" onchangeexists=\"",field.onChangeExists,"\" id=\"dateEl-",fnAsString(field.DisplayName),"-",form_meta.formLinkName,"-",form_meta.recType,"\" format=\"",form_meta.dateFormat,"\" name=\"",field.FieldName,"\" fieldtype=\"",field.Type,"\" delugetype=\"",field.delugeType,"\" type=\"text\" value=\"",(field.Initial)?fnAsString(field.Initial):"","\"",(field.formulaExists && field.formulaExists === true)?"isformulaexist=\"true\"":"",(field.Tooltip)?"title=\""+fnAsString(field.Tooltip)+"\"":""," />");
                if(window.ZS_PreviewMode) {
                    html.push("<button type=\"button\" for=\"dateEl-",fnAsString(field.DisplayName),"-",form_meta.formLinkName,"-",form_meta.recType,"\" class=\"dateinvoker\"></button></span></div>");
                }else{
                    html.push("<button onclick=\"datepicker.show(this,'datetime',true)\" type=\"button\" for=\"dateEl-",fnAsString(field.DisplayName),"-",form_meta.formLinkName,"-",form_meta.recType,"\"class=\"dateinvoker\"></button></span></div>");
                }
                break;
            case ZohoForms.CHECK_BOX:
                html.push("<label>&nbsp;</label><div formcompid=\"",field.formcompid,"\" onchangeexists=\"\" ><span><input id=\"",field.FieldName,"\"  formcompid=\"",field.formcompid,"\" onchangeexists=\"",field.onChangeExists,"\" fieldtype=\"",field.Type,"\" delugetype=\"",field.delugeType,"\" name=\"",field.FieldName,"\" type=\"checkbox\"",(field.Initial === "checked")?"checked":""," value=\"",fnAsString(field.DisplayName),"\" id=\"checkboxesEl_",fnAsString(field.DisplayName),"_",form_meta.recType,"\"/>");
                if(field.Reqd === true){
                    html.push("<label for=\"",field.FieldName,"\">",fnAsString(field.DisplayName),"<font color=\"#ec3e3e\" size\"2\">&nbsp;*</font></label></span></div>");
                } else{
                    html.push("<label for=\"",field.FieldName,"\">",fnAsString(field.DisplayName),"</label></span></div>");
                }
                break;
            case ZohoForms.PICK_LIST:
            case ZohoForms.LIST:
            case ZohoForms.RADIO:
            case ZohoForms.CHECK_BOXES:
                fnLabelElem(field, html);
                if(field.delugeType==undefined){
                    field.delugeType="STRING";
                }
                if(field.Type == ZohoForms.PICK_LIST || field.Type == ZohoForms.LIST) {
                    html.push("<div><span><select formcompid=\"",field.formcompid,"\" onchangeexists=\"",field.onChangeExists,"\" fieldtype=\"",field.Type,"\" delugetype=\"",field.delugeType,"\" ",(field.Type == ZohoForms.LIST)?"type=\"multiselect\"":""," name=\"",field.FieldName,"\" ",(field.Type == ZohoForms.LIST)?"multiple":"",(field.formulaExists && field.formulaExists == true)?"isformulaexist=\"true\"":"",(field.Tooltip)?"title=\""+fnAsString(field.Tooltip)+"\"":"",">");
                    if(field.Type == ZohoForms.PICK_LIST) 
                        html.push("<option>-Select-</option>");
                }else{
                    html.push("<div formcompid=\"",field.formcompid,"\" onchangeexists=\"",field.onChangeExists,"\"",(field.formulaExists && field.formulaExists == true)?"isformulaexist=\"true\"":"",(field.Tooltip)?"title=\""+fnAsString(field.Tooltip)+"\"":"",">");
                }
                var choices = field.Choices[0];
                var choicesArray = [];
                var selectedChoice=-1;
                var choiceName,choiceValue;
                for(choiceName in choices) {
                    var choiceIndex = parseInt(choiceName.replace(/choice/,""),10);
                    if((choiceValue = choices[choiceName]) == field.Initial) selectedChoice=choiceIndex;
                    choicesArray[choiceIndex]=choiceValue;
                }
                for(var c=1;c<choicesArray.length;c++) {
                    if(field.Type == ZohoForms.PICK_LIST || field.Type == ZohoForms.LIST) {
                        html.push("<option ",(c == selectedChoice)?"selected":""," value=\"",fnAsString(choicesArray[c]),"\">",fnAsString(choicesArray[c]),"</option>");
                    }
                    else {
                        fieldtype = (field.Type == ZohoForms.RADIO)?"radio":"checkbox";
                        idtype = (field.Type == ZohoForms.RADIO)?"radioEl":"checkboxesEl";
                        html.push("<span><input id=\"",idtype,"_",field.FieldName,"_",fnAsString(choicesArray[c]),"_",form_meta.recType,"\" name=\"",field.FieldName,"\" type=\"",fieldtype,"\" ",(c == selectedChoice)?"checked":""," value=\"",fnAsString(choicesArray[c]),"\" formcompid=\"",field.formcompid,"\" onchangeexists=\"",field.onChangeExists,"\" fieldtype=\"",field.Type,"\" delugetype=\"",field.delugeType,"\"",(field.formulaExists && field.formulaExists == true)?"isformulaexist=\"true\"":""," />");
                        html.push("<label for=\"",fnAsString(choicesArray[c]),"\">",fnAsString(choicesArray[c]),"</label></span>");
                    }
                }
                if(field.Type == ZohoForms.PICK_LIST || field.Type == ZohoForms.LIST) {
                    html.push("</select></span></div>");
                }else{
                    html.push("</div>");
                }
                break;
            case ZohoForms.IMAGE :
                fnLabelElem(field, html);
                html.push("<div name=\"",fnAsString(field.DisplayName),"\" type=\"image\">");
                html.push("<span><em>Source</em><input name=\"zcsource-",fnAsString(field.DisplayName),"\" fieldtype=\"", field.Type,"\" delugetype=\"",field.delugeType,"\" type=\"text\"",(field.Tooltip)?"title=\""+fnAsString(field.Tooltip)+"\"":""," /></span>");//No I18N
                if(field.altTxtReq === true){
                    html.push("<span><em>Alt Text</em><input name=\"zcalttext-",fnAsString(field.DisplayName),"\" fieldtype=\"", field.Type,"\" delugetype=\"",field.delugeType,"\" type=\"text\"/></span>");//No I18N
                }
                if(field.imgLinkReq === true){
                    html.push("<span><em>Link</em><input name=\"zcfieldlink-",fnAsString(field.DisplayName),"\" fieldtype=\"", field.Type,"\" delugetype=\"",field.delugeType,"\" type=\"text\"/></span>");//No I18N
                }
                if(field.imgTitleReq === true){
                    html.push("<span><em>Title</em><input name=\"zctitle-",fnAsString(field.DisplayName),"\" fieldtype=\"", field.Type,"\" delugetype=\"",field.delugeType,"\" type=\"text\"/></span>");//No I18N
                }
                html.push("<input name=\"zctarget-",fnAsString(field.DisplayName),"\" fieldtype=\"", field.Type,"\" type=\"hidden\" value=\"new\"/></div>");
                break;
            case ZohoForms.URL :
                fnLabelElem(field, html);
                html.push(" <div name=\"",fnAsString(field.DisplayName),"\" type=\"url\">"); 
                html.push("<span><em>URL</em><input name=\"zcurl-",fnAsString(field.DisplayName),"\" fieldtype=\"", field.Type,"\" delugetype=\"",field.delugeType,"\" type=\"text\"",(field.Tooltip)?"title=\""+fnAsString(field.Tooltip)+"\"":""," /></span>");//No I18N
                if(field.urlLinkNameReq === true){
                    html.push("<span><em>Link Name</em><input name=\"zclnkname-",fnAsString(field.DisplayName),"\" fieldtype=\"", field.Type,"\" delugetype=\"",field.delugeType,"\" type=\"text\"",(field.Tooltip)?"title=\""+fnAsString(field.Tooltip)+"\"":""," /></span>");//No I18N
                }
                if(field.urlTitleReq === true){
                    html.push("<span><em>Title</em><input name=\"zctitle-",fnAsString(field.DisplayName),"\" fieldtype=\"", field.Type,"\" delugetype=\"",field.delugeType,"\" type=\"text\"/></span>");//No I18N
                }
                html.push("<input name=\"zctarg-",fnAsString(field.DisplayName),"\" fieldtype=\"", field.Type,"\" type=\"hidden\" value=\"new\"/></div>");
                break;
            case ZohoForms.FILE_UPLOAD:
                fnLabelElem(field, html);
                if(!window.ZS_PreviewMode) {
                    html.push(" <div><span><input type=\"hidden\" value=\"\" formcompid=\"",field.formcompid,"\" delugetype=\"",field.delugeType,"\" style=\"\" fieldtype=\"18\" subtype=\"file\" name=\"",field.FieldName,"\" tagfor=\"formComp\"><input type=\"file\" isattached=\"false\" onchange=\"ZCForm.browseAttachEvent(this);\" zc-docid=\"\" zc-attached-type=\"browse\" onchangeexists=\"\" formcompid=\"",field.formcompid,"\" delugetype=\"",field.delugeType,"\" labelname=\"",field.FieldName,"\" name=\"uploadFile\" changed=\"false\"",(field.Tooltip)?"title=\""+fnAsString(field.Tooltip)+"\"":"","><span onclick=\"ZCForm.removeUploadedFile(this);\" style=\"display: none;font-size: 12px;\" elname=\"zc-Browse-FileAttach\">&nbsp;<a href=\"javascript:void(0);\">[Remove]</a></span> <img src=\"/appcreator/live/01/images/loading.gif\" style=\"visibility:hidden;vertical-align:top;margin-left:5px;\" elname=\"zc-onchange-image\"></span></div>");
                    ZohoForms.upload = true;
                }else{
                    html.push(" <div><span><input type=\"hidden\" value=\"\" formcompid=\"",field.formcompid,"\" delugetype=\"",field.delugeType,"\" style=\"\" fieldtype=\"18\" subtype=\"file\" name=\"",field.FieldName,"\" tagfor=\"formComp\"><input type=\"file\" isattached=\"false\" onchange=\"\" zc-docid=\"\" zc-attached-type=\"browse\" onchangeexists=\"\" formcompid=\"",field.formcompid,"\" delugetype=\"",field.delugeType,"\" labelname=\"",field.FieldName,"\" name=\"uploadFile\" changed=\"false\"",(field.Tooltip)?"title=\""+fnAsString(field.Tooltip)+"\"":"","><span onclick=\"\" style=\"display: none;font-size: 12px;\" elname=\"zc-Browse-FileAttach\">&nbsp;<a href=\"\">[Remove]</a></span> <img src=\"/appcreator/live/01/images/loading.gif\" style=\"visibility:hidden;vertical-align:top;margin-left:5px;\" elname=\"zc-onchange-image\"></span></div>");
                }    
                break;
        }
        html.push("</li>");
    }

    var captcha = form_meta.Captcha;
    if(captcha && captcha != ""){
        var time = new Date().getTime();
        html.push("<li id=\"",form_meta.formLinkName,"-Captcha-",form_meta.recType,"\">");
        html.push("<label>Verification Code</label>");//NO I18N
        html.push("<div><span><input type=\"text\" style=\"width:150px;\" name=\"captcha\"/></span></div>");
        html.push("<div><span><img src=\"/siteforms/getcaptcha.do?time=",time,"&formid=",formid,"\" elname=\"zc-captcha\"></span></div>");
        html.push("</li>");
    }
     html.push("<li><span style=\"display:none;\" id=\"formMsg_",form_meta.formLinkName,"\"/></span></li>");

     var buttons = form_meta.Buttons;
     if(buttons && buttons.length >0 ){
         html.push("<li><label>&nbsp;</label><div><input type=\"submit\" value=\"",fnAsString(buttons[0].DisplayName),"\"><input type=\"reset\" value=\"",fnAsString(buttons[1].DisplayName),"\"/></div></li>");//NO I18N
     } else{
         html.push("<li><label>&nbsp;</label><div><input type=\"submit\" value=\"Submit\"><input type=\"reset\" value=\"Reset\"/></div></li>");//NO I18N
     }
     html.push("</ul></form>");
    if(ZohoForms.upload == true){
        html.push("<div style=\"display:none;border:0;width:0;height:0;\" elname=\"zc-fileuploadtemplate\"><form target=\"zc-fileupload-target\" enctype=\"multipart/form-data\" method=\"post\" name=\"UploadFileForm\" action=\"/siteforms/uploadFile.do\"><input type=\"hidden\" value=\"",form_meta.sharedBy,"\" name=\"sharedBy\"><input type=\"hidden\" value=\"",form_meta.recType,"\" name=\"formAccessType\"><input type=\"hidden\" value=\"",form_meta.formLinkName,"\" name=\"formLinkName\"><input type=\"hidden\" value=\"",form_meta.appLinkName,"\" name=\"appLinkName\"></form><iframe height=\"30\" frameborder=\"0\" width=\"100%\" scrolling=\"no\" align=\"top\" marginheight=\"0\" marginwidth=\"0\" name=\"zc-fileupload-target\"></iframe></div>");
    }
    html.push("</div>");
    if(!window.ZS_PreviewMode) {
        html.push("<script>i18n[\"selectOption\"] =\"Select\";i18n[\"invalidmsg\"]=\"Invalid entries found, please correct and resubmit.\";i18n[\"pleasewait\"]=\"Please Wait\";ZCForm.inZohoCreator = false;var onLoadExist = ",form_meta.onLoadExist,";var appLinkName = \"",form_meta.appLinkName,"\";var formLinkName = \"",form_meta.formLinkName,"\";var formDispName = \"",fnAsString(form_meta.DisplayName),"\";var formAccessType = ",form_meta.recType,";var formID = ",form_meta.formLinkId,";ZCForm.zcFormAttributes['genScriptURL'] = \"/siteforms/generateJS.do\";ZCForm.zcFormAttributes['formParentDiv'] = false;ZCForm.zcFormAttributes['customCalendar'] = true;ZCForm.zcFormAttributes['browseralert'] = false;ZCForm.zcFormAttributes['ajaxreload'] = true;ZCForm.zcFormAttributes['fieldContainer'] = \"div\";   ZCForm.zcFormAttributes['eleErrTemplate'] = \"<div tag='eleErr'> insertMessage </div>\"; var paramsMapString = \"formID=\" + formID + \",appLinkName=\" + appLinkName + \",formDispName=\"+ formDispName + \",formAccessType=1,formLinkName=\"+formLinkName; ZCForm.addToFormArr(paramsMapString, formLinkName);if(onLoadExist){doActionOnLoad(formID, ZCForm.getForm(formLinkName, formAccessType)); } else { ZCForm.enableForm(formLinkName,formAccessType); } ZCForm.regFormEvents(\"formLinkName\",\"formAccessType\");</script>");//No I18N
    }
    return(html.join(""));
}

fnLabelElem = function(field, html){
    if(field.Type != ZohoForms.CHECK_BOX){
        if(field.Reqd === true){
            html.push("<label>",fnAsString(field.DisplayName),"<font color=\"#ec3e3e\" size=\"2\">&nbsp;*</font></label>");//No I18N
        } else{
            html.push("<label>",fnAsString(field.DisplayName),"</label>");//No I18N
        }
    }
}

// ------------------------- end : Form Renderer -------------------------------------//
//-------------------------- start : Date Picker ------------------------------------- // 


datepicker={}
datepicker.display_months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
datepicker.display_long_months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
datepicker.display_single_days = ['S','M','T','W','T','F','S'];
datepicker.display_days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
datepicker.display_long_days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

datepicker.init = function() {// initializing the datepicker 
    var dp = document.createElement('div');
    if(datepicker.publishMode){
        dp.id = "datepicker";
    }else{
        dp.id= "scheduledDatePicker";
    }
    dp.style.position = "absolute";
    dp.style.left = "-1000px";
    dp.style.top = "1px";
    var table_html = [];

    if(datepicker.publishMode){
        table_html.push("<table cellpadding='0' cellspacing='0'><thead><tr><th colspan=\"7\"><span>&laquo;</span> <span>&lsaquo;</span><span> <select></select></span><span><select></select></span> <span>&rsaquo;</span> <span>&raquo;</span></th></tr></thead><tbody><tr class=\"days\">");
    }else{
        table_html.push("<table cellpadding='0' cellspacing='0'><thead><tr><th colspan=\"7\"><span class=\"sdpnextPrevStyle\">&laquo;</span> <span class=\"sdpnextPrevStyle\">&lsaquo;</span><span> <select class=\"monyrsStyle\"></select></span><span><select class=\"monyrsStyle\"></select></span> <span class=\"sdpnextPrevStyle\">&rsaquo;</span> <span class=\"sdpnextPrevStyle\">&raquo;</span></th></tr></thead><tbody><tr class=\"days daysStyle\">");
    }
    for(var i=0;i<7;i++)
        table_html.push("<td>",datepicker.display_single_days[i],"</td>");
    table_html.push("</tr>");
    for(var i=0;i<6;i++)
    table_html.push("<tr><td class='day datePickerDay'></td><td class='day datePickerDay'></td><td class='day datePickerDay'></td><td class='day datePickerDay'></td><td class='day datePickerDay'></td><td class='day datePickerDay'></td><td class='day datePickerDay'></td></tr>");
    if(datepicker.publishMode){
        table_html.push("<tr class='time' id='time'><td class='time tdborder' colspan='7'><span>Time</span>");
        table_html.push("<span><input type='text' id='zphours' value='00' style='width:17px;' maxlength='2' onclick='this.select()'/></span><span > :</span><span><input type='text' id='zpmins' value='00' style='width:17px;' maxlength='2'onclick='this.select()'/></span><span > :</span><span><input type='text' id='zpsec' value='00' style='width:17px;' maxlength='2' onclick='this.select()'/> </span>");
        table_html.push("<span><select id='zptimeformat' name='zptimeformat' style='width:50px;'><option value='24' selected='true'>24</option><option value='AM'>AM</option><option value='PM'>PM</option></select></span></td></tr>");
        table_html.push("<tr id='dpOK'><td class='dpOK tdborder' colspan='7'><input type='button' id='dpBtnOK' value='OK' onclick='datepicker.submitDate()' style='cursor:pointer'/><input type='button' value='Cancel' onclick='datepicker.cancelDate()' style='cursor:pointer'/></td></tr>");
    }else{
        table_html.push("<tr class='time' id='time'><td class='time tdborder' colspan='7'><span class='labelStyle'>Time :</span>");
        table_html.push("<span><input type='text' id='zphours' value='00' class='timeboxStyle' maxlength='2' onclick='this.select()'/></span><span class='labelStyle2'> :</span><span><input type='text' id='zpmins' value='00' class='timeboxStyle' maxlength='2'onclick='this.select()'/></span><span class='labelStyle2'> :</span><span><input type='text' id='zpsec' value='00' class='timeboxStyle' maxlength='2' onclick='this.select()'/> </span>");
        table_html.push("<span><select id='zptimeformat' name='zptimeformat' class='ampmboxStyle'><option value='24' selected='true'>24</option><option value='AM'>AM</option><option value='PM'>PM</option></select></span></td></tr>");
        table_html.push("<tr id='dpOK'><td class='dpOK tdborder' colspan='7'><input type='button' value='Cancel' onclick='datepicker.cancelDate()' class='buttonStyle'/><input type='button' id='dpBtnOK' value='OK' onclick='datepicker.submitDate()' class='buttonStyle'/></td></tr>");
    }
    table_html.push("</tbody></table>");

    dp.innerHTML = table_html.join("");
    this.dp = dp;
    var mov = function(){
        /* Mouse over on the td */
        if(/^\d+$/.test(this.innerHTML) || this.tagName.toLowerCase() == 'span'){
            if(/\ mover/.test(this.className)){
                this.className=this.className.replace(/\ mover/,'');
            }else{
                this.className+=' mover';
            }
        }else{
            this.style.cursor='default';
        }
    };
    var mclick = function(){
        /*set date for element*/
        if(datepicker.mode=="datetime"){
            if(/^\d+$/.test(this.innerHTML)){
                var els= dp.getElementsByTagName('td');
                for(var el,i=0;(el = els[i]);i++) {
                    if(/\ selected/.test(el.className))
                        el.className=el.className.replace(/\ selected/," ");
                }
                this.className+=' selected';
                datepicker.date=parseInt(this.innerHTML,10);
            }
        }else if(datepicker.mode=="date"){
            datepicker.date=parseInt(this.innerHTML,10);
            datepicker.forElement.value=datepicker.format(datepicker.forElement.getAttribute("format") || "MM-dd-yyyy", new Date(datepicker.showYear,datepicker.showMonth,datepicker.date));
            var node = document.getElementById("datepicker");
            node.parentNode.removeChild(node);
            fnTriggerEvent();
        }
    };
    var els= dp.getElementsByTagName('td');
    for(var el,i=0;(el = els[i]);i++) {
        if(el.className=="day datePickerDay"){
            el.onmouseover = el.onmouseout = mov;
            el.onclick = mclick;
        }else{
            el.style.cursor='default';
        }
    }
    this.tds = els;
    els= dp.getElementsByTagName('span');
    var nclick = function(){/*set date for element*/
        var t = this.innerHTML
        switch(t.charCodeAt(0)) {
            case 171:
                if(datepicker.mode=="datetime")
                    datepicker.go(new Date(datepicker.showYear-1,datepicker.showMonth,1,datepicker.hours,datepicker.mins,datepicker.secs));
                else
                    datepicker.go(new Date(datepicker.showYear-1,datepicker.showMonth,1));
                break;
            case 8249:
                var m = (12+datepicker.showMonth-1)%12;
                if(datepicker.mode=="datetime")
                    datepicker.go(new Date(datepicker.showYear-((m==11)?1:0),m,1,datepicker.hours,datepicker.mins,datepicker.secs));
                else
                    datepicker.go(new Date(datepicker.showYear-((m==11)?1:0),m,1));
                break;
            case 8250:
                var m = (12+datepicker.showMonth+1)%12;
                if(datepicker.mode=="datetime")
                    datepicker.go(new Date(datepicker.showYear+((m==0)?1:0),m,1,datepicker.hours,datepicker.mins,datepicker.secs));
                else
                    datepicker.go(new Date(datepicker.showYear+((m==0)?1:0),m,1));
                break;
            case 187:
                if(datepicker.mode=="datetime")
                    datepicker.go(new Date(datepicker.showYear+1,datepicker.showMonth,1,datepicker.hours,datepicker.mins,datepicker.secs));
                else
                    datepicker.go(new Date(datepicker.showYear+1,datepicker.showMonth,1));
                break;
        }
    };
    var kPress = function(event){/* increased/decreased time by keyboard up/down arrow */
        var code = event.keyCode;
        var n =parseInt(this.childNodes[0].value,10);
        if(n<59 && code == 38){
            this.childNodes[0].value=(n<9)?"0"+parseInt(n+1):parseInt(n+1);
        }else if(n>0 && code == 40){
            this.childNodes[0].value=(n<=10)?"0"+parseInt(n-1):parseInt(n-1);
        }
    };
    for(var el,i=0;(el = els[i]);i++) {
        el.onmouseover = el.onmouseout = mov;
        el.onclick = nclick;
        el.onkeydown=kPress;
    }
    this.table = dp.getElementsByTagName('table')[0];
    els= dp.getElementsByTagName('select');
    this.monthSelect = els[0];
    for(var i=0; i < 12; i++) {
        var opt = new Option(this.display_months[i]);
        this.monthSelect.options[i]=opt;
    }
    this.yearSelect = els[1];
    this.monthSelect.onchange = function(){
        if(datepicker.mode=="datetime")
            datepicker.go(new Date(datepicker.showYear,this.selectedIndex,1,datepicker.hours,datepicker.mins,datepicker.secs));
        else
            datepicker.go(new Date(datepicker.showYear,this.selectedIndex,1));
    }
    this.yearSelect.onchange = function(){
        if(datepicker.mode=="datetime")
            datepicker.go(new Date(parseInt(this.options[this.selectedIndex].value,10),datepicker.showMonth,1,datepicker.hours,datepicker.mins,datepicker.secs));
        else
            datepicker.go(new Date(parseInt(this.options[this.selectedIndex].value,10),datepicker.showMonth,1));
    }
    this.timeformat=els[2];
    var preTf = this.timeformat.value
    this.timeformat.onchange = function(){
        var tf =this.options[this.selectedIndex].value;
        if(tf =="PM" || tf=="AM"){
            datepicker.hours = (datepicker.hours>11)?datepicker.hours-12:datepicker.hours;
        }else if(preTf =="PM"){
            datepicker.hours=parseInt(datepicker.hours);
            datepicker.hours+=12;
        }
        preTf = tf;
        datepicker.go(new Date(datepicker.showYear,datepicker.showMonth,datepicker.date,datepicker.hours,datepicker.mins,datepicker.secs));
    }
}

datepicker.go = function(dt) {//setting the date in date picker
    this.monthSelect.selectedIndex = dt.getMonth();
    var showYear = this.showYear = dt.getFullYear();
    var showMonth = this.showMonth = dt.getMonth();
    var currDate = this.date = dt.getDate();
    while(this.yearSelect.firstChild)
        this.yearSelect.removeChild(this.yearSelect.firstChild);
    for(var sy=showYear-101; sy < (showYear + 15);sy++) {
        var opt = new Option(""+sy);
        this.yearSelect.options[this.yearSelect.options.length]=opt;
    }
    this.yearSelect.selectedIndex = 101;
    var day1 = new Date(showYear,showMonth,1)
    var weekday = day1.getDay()+7;
    var td;
    var tdArray =this.dp.getElementsByTagName("td");
    for(var i=7; (td = tdArray[i]);i++) {
        if(td.getAttribute('style'))td.removeAttribute('style');
        if(/^day datePickerDay/.test(td.className)){
            if(/\ selected/.test(td.className)){
                td.className=td.className.replace(/\ selected/,'');
            }
            if(/\ tdborder/.test(td.className)){
                td.className=td.className.replace(/\ tdborder/,'');
            }
            if(showMonth == day1.getMonth() && i>=weekday){
                td.innerHTML = day1.getDate();
                if(currDate == day1.getDate())td.className+=' selected';
                day1 = new Date(day1.getTime()+86400000)
            }else{
                td.innerHTML="";
                if(i>=42)td.className+=' tdborder';
            }
        }else{
            td.style.cursor='default';
        }
	}
    if(datepicker.mode=="datetime"){
       this.hours=document.getElementById("zphours").value=(dt.getHours()<10?("0"+dt.getHours()):dt.getHours());
       this.mins=document.getElementById("zpmins").value=dt.getMinutes()<10?("0"+dt.getMinutes()):dt.getMinutes();
       this.secs=document.getElementById("zpsec").value=dt.getSeconds()<10?("0"+dt.getSeconds()):dt.getSeconds();
    }
}

datepicker.show = function(invoker,mode, publishMode){// showing the datepicker with the specified date selected
    var node;
    if(publishMode)
        node = document.getElementById("datepicker");
    else
        node =document.getElementById("scheduledDatePicker");
    if(node)node.parentNode.removeChild(node);
    this.publishMode = publishMode;
    this.init();
    this.invoker = invoker;
    this.mode = mode;
    var formnode=this.invoker;
    while(formnode.tagName.toLowerCase() !="form"){
	formnode = formnode.parentNode;
    }
    formnode.appendChild(this.dp);
    var _for = invoker.getAttribute('for')||invoker.getAttribute('htmlFor');
    var fore= this.forElement = (_for)?invoker.parentNode.children[0]:invoker;
    var posElem;
    if(mobile)
        posElem = this.forElement;
    else
        posElem = invoker;
    if(ZS_ColumnFix){//IE7
        var obj= invoker;
        var ol = ot = 0;
        if (obj.offsetParent) {
            do {
                ol += obj.offsetLeft;
                ot += obj.offsetTop;
            }while(obj = obj.offsetParent);
        }
        this.dp.style.top = (ot+ posElem.offsetHeight)+'px';
        this.dp.style.left =(ol)+'px';
    }else{//other than IE 7*/
        this.dp.style.top = (posElem.offsetTop + invoker.offsetHeight)+'px';
        this.dp.style.left = posElem.offsetLeft+'px';
    }
    var  format = datepicker.forElement.getAttribute("format");
    if(this.mode =="date"){
        document.getElementById("dpBtnOK").style.display="none";
    }
    if(this.mode=="datetime")
        format +=" HH:mm:ss";
    if(fore.value) {
        if(this.publishMode){
            this.showDate = datepicker.parse(format,fore.value);
        }else{
            this.showDate = new Date(fore.value);
        }
    }else
       this.showDate = new Date();
    if(this.mode =="date"){
        document.getElementById("time").style.display="none";
    }
    this.go(this.showDate);
    return false;
}

datepicker.format = function(os,date) {// formating the given date according to the specified date format
    if(isNaN(date.getFullYear()))
        return null;
    if(/yyyy/.test(os))
        os = os.replace(/yyyy/g,date.getFullYear());
    else if(/yy/i.test(os)) {
        os = os.replace(/yy/g,(date.getFullYear()+"").substring(2));
    }
    if(/MMMM/.test(os)) {
        os = os.replace(/MMMM/g,datepicker.display_long_months[date.getMonth()]);
    } else if(/MMM/.test(os)) {
        os = os.replace(/MMM/g,datepicker.display_months[date.getMonth()]);
    } else if(/MM/.test(os)) {
        var m = date.getMonth()+1;
        m = m<10?"0"+m:m;
        os = os.replace(/MM/g,m);
    } else if(/M/.test(os)) {
        var m = date.getMonth()+1;
        os = os.replace(/M/g,m);
    }
    if(/dddd/.test(os)) {
        os = os.replace(/dddd/g,datepicker.display_long_days[date.getDay()]);
    } else if(/ddd/.test(os)) {
        os = os.replace(/ddd/g,datepicker.display_days[date.getDay()]);
    }
    if(/dd/.test(os)) {
        var d = date.getDate();
        d = d<10?"0"+d:d;
        os = os.replace(/dd/gi,d);
    } else if(/d/.test(os)) {
        var d = date.getDate();
        os = os.replace(/d/gi,d);
    }
    if(/HH/.test(os)){
        var h = datepicker.hours;
        os = os.replace(/HH/gi,h);
    }else if(/hh/.test(os)){
        var h = datepicker.hours;
        os = os.replace(/hh/gi,h);
    }
    if(/mm/.test(os)){
        var m= datepicker.mins;
        os = os.replace(/mm/gi,m);
    }
    if(/ss/.test(os)){
        var s= datepicker.secs;
        os = os.replace(/ss/gi,s);
    }
    return os;
}

datepicker.parse = function(format,ds) {// formating the date in the input box in any format as a date object
    var format_token=[],ds_token=[];
    for(var i=0;i<=format.length;){
        var x= format[i];
        var j=i+1;
        while((format[j]==format[i])&&(j<=format.length)){
            x+=format[j++];
        }
        i=j;
        format_token.push(x);
    }
    var x=0;
    for(var i=0;i<ds.length;){
        j=0,y="";
        while(x<format_token.length && j<format_token[x].length){
            y+=ds[i++];
            j++;
        }
        x++;
        ds_token.push(y);
    }
    var year=0;
	var month=0;
	var dt=0;
	var hour=0;
	var min=0;
	var sec=0;
	var day=0;
    for(var i=0;i<format_token.length;i++){
        switch(format_token[i]){
            case "yyyy":
            case "yy":
                year=parseInt(ds_token[i]);
            	break;
            case "MMMM":
                for(var k=0;k<12;k++){
                    if(ds_token[i]==datepicker.display_long_months[k] ){
                        month=k;
                        break;
                    }
                }
            	break;
            case "MMM":
                for(var k=0;k<12;k++){
                    if(ds_token[i]==datepicker.display_months[k] ){
                        month=k;
                        break;
                    }
                }
            	break;
            case "MM":
            case "M" :
                month=(parseInt(ds_token[i])-1);
            	break;
            case "dddd":
            case "ddd":
                day=ds_token[i];
				break;
            case "dd":
            case "d":
                dt = parseInt(ds_token[i]);
            	break;
            case "HH":
            case "hh":
                hour= parseInt(ds_token[i]);
            	break;
            case "mm":
                min= parseInt(ds_token[i]);
            	break;
            case "ss":
                sec= parseInt(ds_token[i]);
            	break;
            default:
            	break;
        }
    }
    if(isNaN(year) || isNaN(month) || isNaN(dt) || isNaN(hour) || isNaN(min) || isNaN(sec)){
        return(new Date());
    }else if(format.indexOf('mm')!==-1)
		return(new Date(year,month,dt,hour,min,sec));
	else
		return(new Date(year,month,dt));
}

datepicker.submitDate=function(){// submitting the date and time selected to the input box
    datepicker.timeformat=document.getElementById("zptimeformat").options[document.getElementById("zptimeformat").selectedIndex].value;
    datepicker.hours= document.getElementById("zphours").value;
    datepicker.mins = document.getElementById("zpmins").value;
    datepicker.secs = document.getElementById("zpsec").value;
    if(datepicker.timeformat=="24"){
        if(!(/^(([0-9])|([0-1][0-9])|(2[0-3]))$/.test(datepicker.hours))){
            document.getElementById("zphours").select();
            return;
        }
    }else{
        if(!(/^((0?[0-9])|(1[0-2]))$/.test(datepicker.hours))){
            document.getElementById("zphours").select();
            return;
        }
    }   
    if(!(/^(([0-9])|([0-5][0-9]))$/.test(datepicker.mins))){
        document.getElementById("zpmins").select();
        return;
    }
    if(!(/^(([0-9])|([0-5][0-9]))$/.test(datepicker.secs))){
        document.getElementById("zpsec").select();
        return;
    }
    if(!isNaN(datepicker.date)) {
        if(datepicker.timeformat=="PM"){
            datepicker.hours= parseInt(datepicker.hours);
            datepicker.hours+=12;
        }
        var dateformat = datepicker.forElement.getAttribute("format")+" HH:mm:ss";
        var newDate = new Date(datepicker.showYear,datepicker.showMonth,datepicker.date,datepicker.hours,datepicker.mins,datepicker.secs);
        if(new Date()>newDate){
            alert("The Date and Time you have selected is before the current time");
            document.getElementById("zpmins").select();
            return;
        }
        datepicker.forElement.value=datepicker.format(dateformat || "MM-dd-yyyy HH:mm:ss", newDate);//NO I18N
        var node;
        if(datepicker.publishMode){
            node = document.getElementById("datepicker");
        }else{
            pagecanvas.$("#zp_savepublishPost")[0].setAttribute("schedulePost",true);
            pagecanvas.fnPublishPostContent();
            node=document.getElementById("scheduledDatePicker");
        }
        node.parentNode.removeChild(node);
    }
    fnTriggerEvent();
}

datepicker.cancelDate=function(){//cancelling the date picker
    var node;
    if(datepicker.publishMode){
        node = document.getElementById("datepicker");
    }else{
        node = document.getElementById("scheduledDatePicker");
        Dialog.dismiss();
    }
    node.parentNode.removeChild(node);
}

fnTriggerEvent = function(){
    var evnt;
    if(document.createEvent){ //for IE 9, Frefox, Chrome browser
	evnt = document.createEvent("HTMLEvents");//No I18N
	evnt.initEvent("change", true, false);//No I18N
	datepicker.forElement.dispatchEvent(evnt);
    } else if(document.createEventObject){ //for IE 7, 8 browser
	evnt = document.createEventObject();
	datepicker.forElement.fireEvent("onchange", evnt);//No I18N
    }

}

//----------------------------------------------- end : Datepicker -------------------------------//
