/*$Id: navigation.js,v 2030:c5f590d454a5 2011/07/19 10:33:16 prashantd $*/
var navTimer;
var navTop;
var navMoreUL;
var navMoreLI;
var navFirstOffset = {};
var navFirstElement;
var navOffsetParent;
var childPage;
var same =0;
var touch=false;
var ofwParent;
var smListeners = [];
var smTransitionProp=[];
var navPositionFixed=false;
var uagent = navigator.userAgent;
if(uagent.indexOf("iPhone")!=-1||uagent.indexOf("iPad")!=-1||uagent.indexOf("Mobile Safari")!=-1||uagent.indexOf("Nokia")!=-1|| uagent.indexOf("Fennec")!=-1||  uagent.indexOf("Opera Mini")!=-1||uagent.indexOf("IEMobile")!=-1)
    touch=true;


navOffset = function (el) {
    var curleft = 0, curtop = 0;
    if (el.offsetParent) {
        curleft = el.offsetLeft;
        curtop = el.offsetTop;
        while ((el = el.offsetParent) && (el!=navOffsetParent)) {
            curleft += el.offsetLeft;
            curtop += el.offsetTop;
        }
    }
    var n = {
        left:curleft,
        top:curtop
    };
    return n;
}

navOffsetBody = function (el) {
    var curleft = 0, curtop = 0;
    if (el.offsetParent) {
        curleft = el.offsetLeft;
        curtop = el.offsetTop;
        while ((el = el.offsetParent)) {
            curleft += el.offsetLeft;
            curtop += el.offsetTop;
            if(el==navOffsetParent){
                break;
            }
        }
    }
    var n = {
        left:curleft,
        top:curtop
    };
    return n;
}

navOffsetNavigation = function (el) {
    var navDiv = document.getElementById("navigation");
    var childPage = document.getElementById("navigation");
    var curleft = 0, curtop = 0;
    if (el.offsetParent) {
        curleft = el.offsetLeft;
        curtop = el.offsetTop;
        if(el==childPage){
            el = navDiv;
        }
        while ((el = el.offsetParent) && (el!=navDiv)) {
            if(el.id=="childPage"){
                el = navDiv;
            }
            if(el.id!="navigation"){
                curleft += el.offsetLeft;
                curtop += el.offsetTop;
            }else{
                break;
            }
        }
    }
    var n = {
        left:curleft,
        top:curtop
    };
    return n;
}

navOffsetChildParentPage = function (el) {
    var navDiv = document.getElementById("childPageParent");
    var childPage = document.getElementById("navigation");
    var curleft = 0, curtop = 0;
    if (el.offsetParent) {
        curleft = el.offsetLeft;
        curtop = el.offsetTop;
        if(el==childPage){
            el = navDiv;
        }
        while ((el = el.offsetParent) && (el!=navDiv)) {
            if(el.id=="childPageParent"){
                el = navDiv;
            }
            if(el.id!="navigation"){
                curleft += el.offsetLeft;
                curtop += el.offsetTop;
            }else{
                break;
            }
        }
    }
    var n = {
        left:curleft,
        top:curtop
    };
    return n;
}


navGetStyle = function(el,prop) {
    var val;
    if(window.getComputedStyle) {
        var cmpstyle = window.getComputedStyle(el,'')
        val = cmpstyle.getPropertyValue(prop); //NO I18N
    }else if(el.currentStyle) {
        if(prop == 'float') prop='styleFloat'
        prop = prop.replace(/\-(\w)/g,function(s, l) {
            return l.toUpperCase();
        })
        val = el.currentStyle[prop];
    }
    return val;
}

var trans = false;
fnCheckTransition = function(){
    if(!window.ZS_PublishMode){navTop.setAttribute("data-transition",false);return;}
    var styleLen = document.styleSheets.length;
    var styleSheet;
    for(i=0;i<styleLen;i++){
        if(document.styleSheets[i].href !==null &&( document.styleSheets[i].href.indexOf("/theme/style.css")!==-1||document.styleSheets[i].href.indexOf("/templates/")!==-1)){
            styleSheet = document.styleSheets[i];
            break;
        }
    }
    var rules = styleSheet.rules ? styleSheet.rules : styleSheet.cssRules;
    var rulLen = rules.length;
    for(i=0;i<rulLen;i++){
        if(rules[i].selectorText===".submenu"){
            var tr = rules[i].style.transition;
            if(tr!==""){
                trans=true;
            }
            break;
        }
    }
    navTop.setAttribute("data-transition",trans);
}

fnRemoveSubmenuOver = function(){
    var styleLen = document.styleSheets.length;
    var styleSheet;
    for(i=0;i<styleLen;i++){
        if(document.styleSheets[i].href !==null &&( document.styleSheets[i].href.indexOf("/theme/style.css")!==-1)){
            styleSheet = document.styleSheets[i];
            break;
        }
    }
    var rules = styleSheet.rules ? styleSheet.rules : styleSheet.cssRules;
    var rulLen = rules.length;
    for(i=0;i<rulLen;i++){
        if(rules[i].selectorText===".submenu li a:hover"){
            var text = rules[i].cssText;
            var classValue = text.substring(text.indexOf("{"),text.indexOf("}")+1);
            styleSheet.removeRule(i);
            styleSheet.insertRule(".submenu li.selected a"+classValue,i);// No I18N
            break;
        }
    }
}

navGetClassProp= function(el,prop) {
    var val;
    if(el.currentStyle) {
        if(prop === 'float') {
            prop='styleFloat';//No I18N
        }
        prop = prop.replace(/\-(\w)/g,function(s, l) {
            return l.toUpperCase();
        })
        val = (el.currentStyle[prop]) ? el.currentStyle[prop] : "";
    }else if(window.getComputedStyle) {
        var cmpstyle = window.getComputedStyle(el,'')
        val = cmpstyle[prop]; //NO I18N
    }
    return val;
}

navGetOffsetParent = function(el){
    do {
        el = el.offsetParent;
        if(el) {
            var tn = el.tagName.toLowerCase();
            if(tn == 'body' || tn == 'html') break;
            if(navGetStyle(el,'position') != 'static') break;
        }
    }while(el)
    return el;
}
navEventInside = function(el,ev) {
    var rt = ev.relatedTarget||((ev.type == 'mouseover')?ev.fromElement:ev.toElement);
    if(!rt)return false;
    var p=rt;
    do{
        if(p==el)return true;
    }while(p=p.parentNode) 
    return false;
}

var adjustMoreTimer,adjustMoreTimerCount;
navAppendChildPage = function(){
    childPage = document.getElementById("childPageParent");
    
    var topNode = document.getElementById("navigation").parentNode;//No I18N
    while (topNode!=navOffsetParent){
        var ofwProp = navGetStyle(topNode,'overflow');//No I18N
        if(ofwProp=="hidden"){
            ofwParent = topNode;
        }
        var posProp = navGetStyle(topNode,'position');//No I18N
        if(posProp=="fixed"){
            navPositionFixed = true;
        }
        topNode = topNode.parentNode; 
    }
    
    if(ofwParent){
        ofwParent.parentNode.insertBefore(childPage, ofwParent);
    }else{
    
        var navElement = document.getElementById("navigation").parentNode;//No I18N
        var p = navElement;
        var sibli = document.getElementById("navigation");
        if(sibli){
            p.insertBefore(childPage,sibli);
        }else{
            p.appendChild(childPage);
        }
        ofwParent= childPage.parentNode;
    }
}
navSetSMValues = function(){
    var submenus;
    if(document.quertSelectorAll){
        submenus = childPage.querySelectorAll(".submenu");//No I18N
    } else{
        submenus = fnGetDocumentElements_IEfix("div", "class", "submenu", childPage);//No I18N
    }
    if(submenus.length!==0){
        smTransitionProp = navGetClassProp(submenus[0],'transitionProperty');//No I18N
        if(!smTransitionProp) {
            smTransitionProp = navGetClassProp(submenus[0],'WebkitTransitionProperty');//No I18N
        }
        for(i=0;i<submenus.length;i++){
            var el = submenus[i];
            var elf = document.getElementById(el.id.replace("submenu","smframe"));
            fnSetSMValues(el,elf); 
        }
    }
}

navActivate = function(){
    navTop = document.getElementById('nav-top');
    navOffsetParent = document.getElementById("zppages");//No I18N
    if(!navOffsetParent){
        navOffsetParent = document.body;
    }
    if(!document.getElementById("childPageParent")){
        childPage = document.createElement('div');
        childPage.id = "childPageParent";
        childPage.style.position = "relative";
        childPageDiv = document.createElement('div');
        childPageDiv.id = "childPage";
        childPage.appendChild(childPageDiv);
        navOffsetParent.appendChild(childPage);
    }    
    navAppendChildPage();
    fnCheckTransition();
    if(touch){
        fnRemoveSubmenuOver();
    }
    var transAvailable = navTop.getAttribute("data-transition");
    if(transAvailable==="true"){
        navSetSMValues();
    }
    if(navTop.getAttribute("data-navorientation").toLowerCase()=="vertical"){
        //menu is vertical
        var ulss = navTop.getElementsByTagName("ul");
        navAlignUlLi(ulss);
        navAddEventHandler(navTop);
        ulss = childPage.getElementsByTagName("ul");
        navAlignUlLi(ulss);
        navAddEventHandler(navTop);
        navSetClassNames();
        return;
    }
    navSetClassNames();
    var tempNav = document.createElement('div');
    var tempUl = document.createElement('ul');
    var firstList = [];
    var listLis = navTop.childNodes;
    var i,j;
    for(i=0,j=0;i<listLis.length;i++){
        if(listLis[i].tagName=="LI"){
            firstList[j]=listLis[i];
            j++;
        }
    }
    if(firstList.length>1){
        var ff=navOffset(firstList[0]);
        var ss=navOffset(firstList[1]);
        if(ff.top!=ss.top){
            setTimeout(function(){
                navActivate()
            },500);
            return;
        }
    }
    for(var x=0;x<firstList.length;x++){
        tempUl.appendChild(firstList[x]);
    }
    tempNav.appendChild(tempUl);
    var len = tempUl.childNodes.length;
    var moreSub = document.createElement("div");
    moreSub.id="nav-submenu-idMore";
    moreSub.className="submenu";
    moreSub.style.display='none';
    moreSub.style.zIndex='201';
    moreSub.style.top="0px";
    moreSub.style.overflow="hidden";
    
   var iframeMore = document.createElement('iframe');
   iframeMore.style.display='none';
   iframeMore.style.position='absolute';
   iframeMore.style.zIndex='200';
   iframeMore.id = "nav-smframe-idMore";
   iframeMore.src="/html/blank";
   iframeMore.setAttribute("scrolling","no");
   iframeMore.setAttribute("frameborder","0");
   iframeMore.style.filter="alpha(opacity=0)";

    navMoreUL = document.createElement('ul');
    navMoreUL.id="nav-ulMore";
    navMoreUL.setAttribute("navparent","nav-ulMore");
    navMoreLI = document.createElement('li');
    navMoreLI.id="nav-liMore";
    navMoreLI.className=" navArrow";
    navMoreLI.setAttribute("navsub","nav-ulMore");
    for(var k=0;k<len;k++){
        var uls = tempUl.childNodes[0].getElementsByTagName("ul");
        navAlignUlLi(uls);
        var elem = tempUl.childNodes[0];
        navTop.appendChild(tempUl.childNodes[0]);
        if(k==0){
            navFirstOffset.left = navOffset(elem).left;
            navFirstOffset.top = navOffset(elem).top;
            navFirstElement = elem;
        }
        var realTop=navOffset(elem);
        if(navFirstOffset.top != realTop.top || navFirstElement.offsetTop != elem.offsetTop){
            navMoreUL.appendChild(elem);
            for(x=0;x<tempUl.childNodes.length;){
                navMoreUL.appendChild(tempUl.childNodes[0]);
            }
            break;
        }
    }
    if(navMoreUL.childNodes.length!=0){
        var childPageApd = document.getElementById("childPage");
        moreSub.appendChild(navMoreUL);
        childPageApd.appendChild(moreSub);
        childPageApd.appendChild(iframeMore);
        var spanMore = document.createElement('span');
        var liA = document.createElement('a');
        spanMore.innerHTML="More";//No I18N
        var emMore = document.createElement('em');
        liA.appendChild(spanMore);
        liA.appendChild(emMore);
        navMoreLI.appendChild(liA);
        navTop.appendChild(navMoreLI);
        
        adjustMoreTimerCount=0;
        navAdjustMoreTimerFn();
    }
    navAddEventHandler(navTop);
    var childPageUls = childPage.getElementsByTagName("ul");
    navAlignUlLi(childPageUls);
    navAddEventHandler(childPage);
}
navAdjustMore = function(){
    var liTop = navOffset(navMoreLI);
    navFirstOffset.left = navOffset(navFirstElement).left;
    navFirstOffset.top = navOffset(navFirstElement).top;
    while(navFirstOffset.top!=liTop.top){
        navTop.removeChild(navMoreLI);
        navMoreUL.insertBefore(navTop.lastChild,navMoreUL.firstChild);
        navTop.appendChild(navMoreLI);
        var ulsubs = navMoreLI.parentNode.getElementsByTagName("ul");
        navAlignUlLi(ulsubs,ulsubs.parentNode);
        liTop = navOffset(navMoreLI);
    }
}
navAdjustMoreTimerFn = function(){
    if(adjustMoreTimer) clearTimeout(adjustMoreTimer);
    navAdjustMore();
    adjustMoreTimerCount++;
    if(adjustMoreTimerCount < 60 ) {
        adjustMoreTimer = setTimeout(navAdjustMoreTimerFn,1000)
    }
}
navId = function(el) {
    var undefined;
    if(el.id == undefined || el.id == "")el.id="nav-id"+(Math.random()*11111111111111111111);
}

navAlignUlLi = function(uls,liLL){
    var auls=[]
    var li;
    for(var i=0;ul=uls[i];i++) {
        auls[i]=ul;
        li = ul.parentNode;
        if(li.getElementsByTagName('li')[0]){
            if(ul.id=="")navId(ul);
            if(li.id=="")navId(li);
            if(ul.id===""){ul.setAttribute("navparent",li.id);}
            if(li.id===""){li.setAttribute("navsub",ul.id);}
            if(liLL==undefined){
                navAddEventHandler(ul);
            }else{
                liLL.onmouseover = navItemMouseOver;
                liLL.onmouseout = navItemMouseOut;
                liLL.ontouchstart = navItemTouch;
            }
            ul.onmouseover = navMouseOver;
            ul.onmouseout = navMouseOut;
            ul.ontouchstart = navTouch;
        }
    }
    var childPageInner = document.getElementById("childPage");
    for(var i=0;ul=auls[i];i++) {
        var sm,smf;
        if(ul.id.indexOf("nav-ul")!=-1){break;}
        if(document.getElementById(ul.id.replace(/nav\-/,'nav-submenu-')))
            sm = document.getElementById(ul.id.replace(/nav\-/,'nav-submenu-'));
        else
            sm = document.createElement('div');
        sm.className = 'submenu';
        sm.style.zIndex='201';
        sm.appendChild(ul);
        sm.id = ul.id.replace(/nav\-/,'nav-submenu-');
        childPageInner.appendChild(sm);
        if(document.getElementById(ul.id.replace(/nav\-/,'nav-smframe-')))
            smf = document.getElementById(ul.id.replace(/nav\-/,'nav-smframe-'));
        else
            smf = document.createElement('iframe');
        smf.style.display='none';
        smf.style.position='absolute';
        smf.style.zIndex='200';
        smf.id = ul.id.replace(/nav\-/,'nav-smframe-');
        smf.src="/html/blank";
        smf.setAttribute("scrolling","no");
        smf.setAttribute("frameborder","0");
        sm.style.display='none';
        smf.style.filter="alpha(opacity=0)";
        childPageInner.appendChild(smf);
    }
    document.getElementsByTagName("html")[0].ontouchstart= fnMouseOut;
}

navAddEventHandler = function(ul) {
    var lis = ul.childNodes;
    var i,li;
    for(var i=0;li=lis[i];i++) {
        if(li.tagName=="LI" || li.tagName=="li") {
            li.onmouseover = navItemMouseOver;
            li.onmouseout = navItemMouseOut;
            li.ontouchstart = navItemTouch;
        }
    }
    if(window.ZS_PreviewMode){
        fnBindHandleClickEvents();
    }
}

navMenuAlign = function(curr,sm){
    var bdHeight = navOffsetParent.offsetHeight;
    var thisPos = navOffset(curr).top;
    var toShowHeight = thisPos+curr.offsetHeight+sm.offsetHeight;
    var childPageParentDiv = document.getElementById("childPageParent");
    var orient = childPageParentDiv.getAttribute("data-sm-orientation");
    if(orient!="" && orient!="bottom" &&orient!="top"){
        if(((bdHeight-toShowHeight)<sm.offsetHeight && thisPos>(bdHeight/2)) || window.innerHeight==(thisPos+curr.offsetHeight)){//|| thisPos == 0){
            orient="bottom";//No I18N 
        }else{
            orient="top";//No I18N
        }
    }
    
    
    childPageParentDiv.setAttribute("data-sm-orientation",orient);
    
    var navigationLeft = navOffset(sm).left;
    var navigationRight;
    navigationRight=window.innerWidth-navigationLeft;
    if(navigationLeft>navigationRight){
        orient+="Right";//No I18N
    }else{
        orient+="Left";//No I18N
    }
    return orient;
}

navSetClassNames = function(){
    var lis = navTop.getElementsByTagName("li");
    for(var i=0;li=lis[i];i++){
        if(li.getAttribute('navsub') != null)
            li.className = li.className+" navArrow";
    }
    lis = childPage.getElementsByTagName("li");
    for(i=0;li=lis[i];i++){
        if(li.getAttribute('navsub') != null)
            li.className = li.className+" navArrow";
    }
    
}

navItemTouch = function(ev){
    stopPropagation(ev);
    if(this.tagName &&((this.tagName.toLowerCase()=="ul" && (!this.getAttribute("navshowing") != null))||(this.tagName.toLowerCase()=="li" && (!this.parentNode.getAttribute("navshowing") != null)))){
        if(this.tagName.toLowerCase()==="li" && this.getAttribute("navsub") !== null && this.className.indexOf("active") === -1)
            preventDefault(ev);
        navShowMenu.call(this,ev);
    }
}
navTouch =function(ev){
    if(navTimer)clearTimeout(navTimer);
}

navItemMouseOver = function(ev) {
    ev=ev||window.event;
    if(navEventInside(this,ev))return;
    navItemMouseEnter.call(this,ev);
}
navItemMouseOut = function(ev) {
    ev=ev||window.event;
    if(navEventInside(this,ev))return;
    navItemMouseLeave.call(this,ev);
}
navMouseOver = function(ev) {
    ev=ev||window.event;
    if(navEventInside(this,ev))return;
    navMouseEnter.call(this,ev);
}
navMouseOut = function(ev) {
    ev=ev||window.event;
    if(navEventInside(this,ev))return;
    navMouseLeave.call(this,ev);
}
navItemMouseEnter = function(ev) {
    navShowMenu.call(this,ev)
}
navItemMouseLeave = function(ev) {
    var el = this;
    if(navTimer)clearTimeout(navTimer);
    navTimer = setTimeout(function(){
        navHideMenu(el.parentNode)
    },500);
}
navMouseEnter = function(ev) {
    var el = this;
    if(navTimer)clearTimeout(navTimer)
}
navMouseLeave = function(ev) {
    var el = this;
    if(navTimer)clearTimeout(navTimer)
    navTimer = setTimeout(function(){
        navHideSelf(el)
    },500);
}

fnSetSMValues = function(sm,smf){
    var ulElem = getFirstChild(sm);
    
    var dummy = document.createElement("div");
    dummy.id="dummyForTransition";
    dummy.style.display="block";
    dummy.style.left="-4000px";
    var dum = sm.cloneNode(true);
    dum.style.height='';
    //dum.style.width='';
    dummy.appendChild(dum);
    navOffsetParent.appendChild(dummy);
    
    if(smTransitionProp.indexOf("height")>-1){
        sm.style.height='0px';
        smf.style.height='0px';
    }
    if(smTransitionProp.indexOf("width")>-1){
        sm.style.width='0px';
        smf.style.width='0px';
    }
    if(smTransitionProp.indexOf("top")>-1){
        /*sm.style.top='0px';
        smf.style.top='0px';*/
    }
    /*if(smTransitionProp.indexOf("opacity")>-1){
        ulElem.style.opacity='0';
        sm.style.opacity='0';
        smf.style.opacity='0';
    }*/
    
    var smOffHei = dum.offsetHeight;
    var smOffWid = dum.offsetWidth;
    //var smOffTop = 0-dum.offsetHeight;
    //console.log("ooo::"+smOffTop);
    var smOffOpa = 1;
    if(smTransitionProp.indexOf("height")>-1){
        sm.setAttribute("data-height",smOffHei+"px");
        ulElem.setAttribute("data-height",smOffHei+"px");
        smf.setAttribute("data-height",smOffHei+"px");
    }
    if(smTransitionProp.indexOf("width")>-1){
        sm.setAttribute("data-width",smOffWid+"px");
        ulElem.setAttribute("data-width",smOffWid+"px");
        smf.setAttribute("data-width",smOffWid+"px");
    }
    /*if(smTransitionProp.indexOf("top")>-1){
        sm.setAttribute("data-top",smOffTop+"px");
        ulElem.setAttribute("data-top",smOffTop+"px");
        smf.setAttribute("data-top",smOffTop+"px");
    }*/
    if(smTransitionProp.indexOf("opacity")>-1){
        sm.setAttribute("data-opacity",1);
        ulElem.setAttribute("data-opacity",1);
        smf.setAttribute("data-opacity",1);
    }
    dum.parentNode.parentNode.removeChild(dummy);
    //var data = {height:smOffHei+"px",width:smOffWid+"px",top:smOffTop+"px",opacity:smOffOpa};
    var data = {height:smOffHei+"px",width:smOffWid+"px",opacity:smOffOpa};//No I18N
    return data;
}

navShowMenu = function(event) {
    if(navTimer)clearTimeout(navTimer)
    navHideMenu(this.parentNode);
    var subId = this.getAttribute('navsub');
    if(!subId)return;
    subId = subId.replace("ul","id");
    //var pxls=this.parentNode.hasAttribute("navparent")?5:0;
    var sm =  document.getElementById(subId.replace(/nav\-/,'nav-submenu-'));
    var smf =  document.getElementById(subId.replace(/nav\-/,'nav-smframe-'));
    var off = navOffset(this);
    var flt = navGetStyle(this,'float');//NO I18N
    var zIndexNode;
    if(this.parentNode.getAttribute("navparent") != null){
        zIndexNode = this.parentNode.parentNode;
        var zi = navGetStyle(zIndexNode,'z-index');//No I18N
        sm.style.zIndex=zi-0+1;
    }
    for(i=0;i<smListeners.length;){
        unbindEvent(sm,smListeners[i].type,testhideSM);
        smListeners.splice(i);
    }
    smf.style.display = 'block';
    sm.style.display = 'block';
    
    var fstChild = getFirstChild(sm);
    var getParentId = fstChild.getAttribute("navparent");
    var getParElem = document.getElementById(getParentId);
    var parElem = document.getElementById(getParElem.parentNode.getAttribute("navparent"));
    if(getParElem.className.indexOf("active")== -1)
        getParElem.className+=" active";
    
    var diffTop = navOffset(this);
    var diff = document.getElementById('childPageParent');
    var offsetChildPage = navOffset(diff);
    if(navTop.getAttribute("data-navorientation").toLowerCase()!="vertical"){
        var offsetToNavigation = navOffsetNavigation(this);
        
        if(flt!='none'){
            smf.style.left = sm.style.left = offsetToNavigation.left-offsetChildPage.left+ 'px';
        }else{
            if((off.left+sm.offsetWidth+this.offsetWidth)>document.body.clientWidth||(parElem && navOffset(parElem).left>off.left)&&(off.left>this.offsetWidth))         {
                sm.style.left=smf.style.left=(offsetToNavigation.left-this.offsetWidth-offsetChildPage.left )+'px';
            }else{
                sm.style.left=smf.style.left=(offsetToNavigation.left+this.offsetWidth-offsetChildPage.left )+'px';
            }
        
        
        }
        var smPos = navMenuAlign(this,sm);
        //alert(smPos);
        switch(smPos){
            case "bottomRight"://No I18N
            case "bottomLeft"://No I18N
                if(offsetChildPage.top==diffTop.top){
                    smf.style.top = sm.style.top = 0-sm.offsetHeight+'px';
                }else{
                    var offsetToChildPage = navOffsetChildParentPage(this);
                    smf.style.top = sm.style.top = (offsetToChildPage.top+this.offsetHeight-sm.offsetHeight)+'px';
                }
                break;
            default:
                if(flt!='none'){
                    smf.style.top = sm.style.top = (diffTop.top-offsetChildPage.top+this.offsetHeight)+'px';
                }else{
                    smf.style.top = sm.style.top = this.parentNode.parentNode.offsetTop+this.offsetTop+'px';
                }
                break;
        }
    }else{
        var smWidth = sm.offsetWidth;
        var dataWidth = sm.getAttribute("data-width");
        if(dataWidth){
            smWidth = parseInt(dataWidth.replace("px",""));
        }
        smf.style.top = sm.style.top = diffTop.top-offsetChildPage.top+'px';
        if((diffTop.left+this.offsetWidth+smWidth)>window.innerWidth){
            sm.style.left=smf.style.left=diffTop.left-offsetChildPage.left-this.offsetWidth+'px';
        }else{
            sm.style.left=smf.style.left=diffTop.left-offsetChildPage.left+this.offsetWidth+'px';
        }
    }
    
    var transAvailable = navTop.getAttribute("data-transition");
    if(transAvailable=="true"){
        smTransitionProp = navGetClassProp(sm,'transitionProperty');//No I18N
        if(!smTransitionProp) {
            smTransitionProp = navGetClassProp(sm,'WebkitTransitionProperty');//No I18N
        }
        var ulElem = getFirstChild(sm);
        if(smTransitionProp.indexOf("top")>-1){
            var dataTop = sm.getAttribute("data-top");
            if(dataTop=="" || dataTop==null){
                dataTop= sm.style.top;
                ulElem.style.top="0px";
                sm.style.top="0px";
                smf.style.top="0px";
                sm.setAttribute("data-top",dataTop);
                ulElem.setAttribute("data-top",dataTop);
                smf.setAttribute("data-top",dataTop);
            }
            ulElem.style.top=dataTop;
            sm.style.top=dataTop;
            smf.style.top=dataTop;
        }
        if(smTransitionProp.indexOf("left")>-1){
            var dataLeft = sm.getAttribute("data-left");
            if(dataLeft=="" || dataLeft==null){
                dataLeft = sm.style.left;
                ulElem.style.left="0px";
                sm.style.left="0px";
                smf.style.left="0px";
                sm.setAttribute("data-left",dataLeft);
                ulElem.setAttribute("data-left",dataLeft);
                smf.setAttribute("data-left",dataLeft);
            }
            ulElem.style.left=dataLeft;
            sm.style.left=dataLeft;
            smf.style.left=dataLeft;
        }
        if(smTransitionProp.indexOf("height")>-1){
            var dataHeight = sm.getAttribute("data-height");
            if(dataHeight=="" || dataHeight==null){
                var dataObj=fnSetSMValues(sm,smf);
                dataHeight=dataObj.height;
            }
            ulElem.style.height=dataHeight;
            sm.style.height=dataHeight;
            smf.style.height=dataHeight;
        }
    
        if(smTransitionProp.indexOf("width")>-1){
            var dataWidth = sm.getAttribute("data-width");
            if(dataWidth=="" || dataWidth==null){
                var dataObj=fnSetSMValues(sm,smf);
                dataWidth=dataObj.width;
            }
            ulElem.style.width=dataWidth;
            sm.style.width=dataWidth;
            smf.style.width=dataWidth;
        }
    }
    /*if(smTransitionProp.indexOf("top")>-1){
        var dataTop = sm.getAttribute("data-top");
        if(dataTop=="" || dataTop==null){
            var dataObj=fnSetSMValues(sm,smf);
            dataWidth=dataObj.top;
        }
        console.log(dataTop+".ohoh77");
        ulElem.style.top=dataTop;
        sm.style.top=dataTop;
        smf.style.top=dataTop;
    }*/
    if(smTransitionProp.indexOf("opacity")>-1){
        var dataOpacity = sm.getAttribute("data-opacity");
        if(dataOpacity=="" || dataOpacity==null){
            var dataObj=fnSetSMValues(sm,smf);
            aa = navGetClassProp(sm,'opacity');//No I18N
            dataOpacity=dataObj.opacity;
        }
        ulElem.style.opacity=dataOpacity;
        sm.style.opacity=dataOpacity;
        smf.style.opacity=dataOpacity;
    }
    smf.style.display = '';
    sm.style.display = '';
    //smf.style.width = sm.offsetWidth+"px";
    //smf.style.height = sm.offsetHeight+"px";
    this.parentNode.setAttribute("navshowing",this.id);
}

navMenuBtm = function(curr){
   
    var navigationTop = navOffset(curr).top;
    var navigationBottom;
    navigationBottom=window.innerHeight-navigationTop;
    return navigationBottom;
}

navHideSelf = function(ul) {
    var sm = ul.parentNode;
    if(sm.className.indexOf('submenu')!=-1) {
        smf = document.getElementById(sm.id.replace(/nav\-submenu/,'nav-smframe'));
        var transAvailable = navTop.getAttribute("data-transition");
        if(transAvailable=="true"){
            var support = transSupportNav();
            if(support.transitionEnd){
                if(smTransitionProp.indexOf("height")>-1){
                    sm.style.height="0px";
                    smf.style.height="0px";
                }
                if(smTransitionProp.indexOf("width")>-1){
                    sm.style.width="0px";
                    smf.style.width="0px";
                }
                if(smTransitionProp.indexOf("opacity")>-1){
                    sm.style.opacity="0";
                    smf.style.opacity="0";
                }
                if(smTransitionProp.indexOf("top")>-1){
                    sm.style.top="0px";
                    smf.style.top="0px";
                }
                if(smTransitionProp.indexOf("left")>-1){
                    sm.style.left="0px";
                    smf.style.left="0px";
                }
                var abc= {
                    element:sm,
                    type:support.transitionEnd,
                    handler:testhideSM
                };
                smListeners.push(abc);
                bindEvent(sm,support.transitionEnd,testhideSM);
            }else{
                sm.style.display = 'none';
                smf.style.display = 'none';
            }
            setTimeout(function(){
                navHideMenu(ul);
            },500);
        }else{
         sm.style.display="none";
         navHideMenu(ul);
        }
    }
    var navparent = ul.getAttribute('navparent');
    if(navparent && navparent != '') {
        var par = document.getElementById(navparent);
        if(par){
            var el;
            if(par.tagName=="ul" || par.tagName=="UL"){
                el= par;
            }else{
                el= par.parentNode;
            }
             
            if(par.className.indexOf("active")!= -1)
                par.className = par.className.replace("active","");
            if(navTimer)clearTimeout(navTimer)
            navTimer = setTimeout(function(){
                navHideSelf(el)
            },500);
        }
    }
}
testhideSM = function(ab){
    var sm = ab.currentTarget;
    sm.style.display="none";
    var smf =  document.getElementById(sm.id.replace('nav-submenu-','nav-smframe-'));
    smf.style.display="none";
    unbindEvent(sm,"transitionend",arguments.callee);//No I18N
}
//var sm1,smf1;
navHideMenu = function(ul) {
    if(ul && ul.id.indexOf("nav-submenu-")!=-1){
        ul = getFirstChild(ul);
       
    }
    if(ul && ul.getAttribute('navshowing')){
        var showingId = ul.getAttribute('navshowing');
        if(showingId && document.getElementById(showingId)){
            var subId = document.getElementById(showingId).getAttribute('navsub');
            var submenu = document.getElementById(subId);
            subId = subId.replace("ul","id");
            var sm =  document.getElementById(subId.replace(/nav\-/,'nav-submenu-'));
            var smf =  document.getElementById(subId.replace(/nav\-/,'nav-smframe-'));
            navHideMenu(submenu);
            var fstChild = getFirstChild(sm);
            var getParentId = fstChild.getAttribute("navparent");
            var getParElem = document.getElementById(getParentId);
            if(getParElem.className.indexOf("active")!= -1)
                getParElem.className = getParElem.className.replace("active","");
            ul.removeAttribute('navshowing');
            var transAvailable = navTop.getAttribute("data-transition");
            if(transAvailable=="true"){
                var support = transSupportNav();
                if(support.transitionEnd){
                    if(smTransitionProp.indexOf("height")>-1){
                        sm.style.height="0px";
                        smf.style.height="0px";
                    }
                
                    if(smTransitionProp.indexOf("width")>-1){
                        sm.style.width="0px";
                        smf.style.width="0px";
                    }
                    if(smTransitionProp.indexOf("top")>-1){
                        sm.style.top="0px";
                        smf.style.top="0px";
                    }
                    if(smTransitionProp.indexOf("left")>-1){
                        sm.style.left="0px";
                        smf.style.left="0px";
                    }
                    if(smTransitionProp.indexOf("opacity")>-1){
                        sm.style.opacity="0";
                        smf.style.opacity="0";
                    }
                    var abc= {
                        element:sm,
                        type:support.transitionEnd,
                        handler:testhideSM
                    };
                    smListeners.push(abc);
                    bindEvent(sm,support.transitionEnd,testhideSM);
                }else{
                    sm.style.display = 'none';
                    smf.style.display = 'none';
                }
            }else{
                sm.style.display = 'none';
            smf.style.display = 'none';
            }
        }
    }
}

hideSubMenus = function(sm,smf){
    sm.style.display="none";
    smf.style.display="none";
    
}

stopPropagation = function(e){
    if (e.stopPropagation) {
        e.stopPropagation();
    }else {
        e.cancelBubble = true;
    }
}
preventDefault = function(e){
    if(e.preventDefault) {
        e.preventDefault();
    }else {
        e.returnValue = false;
    }
}

fnMouseOut =function(ev){
    stopPropagation(ev);
    var targt = ev.target;
    if(targt && targt.tagName){
        while(targt && targt.tagName && targt.tagName.toLowerCase()!="ul"){
            if(targt.tagName.toLowerCase()=="body"){
                break;
            }else{
                targt = targt.parentNode;
            }
        }
        if(targt && targt.tagName.toLowerCase()=="ul" && (targt.id=="nav-top"|| targt.getAttribute("navparent") != null))
            return;
    }
    var lis = document.getElementsByTagName("li");
    var li,elem;
    for(var i=0;(li=lis[i]);i++){
        if(li.className.indexOf("active")!=-1){
            elem = li;
            break;
        }
    }
    if(elem){
        fnNavHideMenu(elem);
    }
}

fnNavHideMenu = function(elem){
    if(elem.getAttribute('navsub') != null){
        var subId = elem.getAttribute('navsub');
        var submenu = document.getElementById(subId);
        var sm =  document.getElementById(subId.replace(/nav\-/,'nav-submenu-'));
        var smf =  document.getElementById(subId.replace(/nav\-/,'nav-smframe-'));
        if(submenu){
            var lis = submenu.getElementsByTagName("li");
            var li;
            for(var i=0;(li=lis[i]);i++){
                if(li.getAttribute('navsub') != null)
                    fnNavHideMenu(li);
            }
        }
        if(elem.className.indexOf("active")!= -1)
            elem.className = elem.className.replace("active","");
        if(elem.tagName.toLowerCase()=="ul" && elem.getAttribute('navshowing') != null)
            elem.removeAttribute('navshowing');
        else if(elem.tagName.toLowerCase()=="li" && elem.parentNode.getAttribute('navshowing') != null)
            elem.parentNode.removeAttribute('navshowing');
        if(sm){
            sm.style.height="0px";
            sm.style.width="0px";
            sm.style.left="-4000px";
        }
        if(smf){
            smf.style.height="0px";
            smf.style.width="0px";
            smf.style.left="-4000px";
        }
    }else{
        var subId= elem.parentNode.id;
        var sm =  document.getElementById(subId);
        var smf =  document.getElementById(subId.replace('submenu','smframe'));
        if(sm){
            sm.style.height="0px";
            sm.style.width="0px";
            sm.style.left="-4000px";
        }
        if(smf){
            smf.style.height="0px";
            smf.style.width="0px";
            smf.style.left="-4000px";
        }
    }
}

getFirstChild = function(elm){
    for(x=0;x<elm.childNodes.length;x++){
        firstChild=elm.childNodes[x];
        if(firstChild.nodeType!=3){
            break;
        }        
    }
    return firstChild;
}

setTimeout(function(){
    if(window.ZS_PublishMode && !window.ZS_PreviewMode){
        var userView = getCookie('userView');// No I18N
        if(userView == 'web'){
            var mobile;
            var userAgent = navigator.userAgent;
            mobile =!!(userAgent.match(/(iPhone|iPod|blackberry|android 0.5|htc|lg|midp|mmp|mobile|nokia|opera mini|palm|pocket|psp|sgh|smartphone|symbian|treo mini|Playstation Portable|SonyEricsson|Samsung|MobileExplorer|PalmSource|Benq|Windows Phone|Windows Mobile|IEMobile|Windows CE|Nintendo Wii)/i));
            if(document.getElementById('footerBar').style.display!='none'){
                if(document.getElementById('mobileBar') && mobile){
                    document.getElementById('mobileBar').style.display="block";
                }
            }
            else{
                document.getElementById('footerBar').style.display='block';	
            }
            if(mobile){
                document.getElementById('mobileSite').style.display="block";
            }
        }else{
            delCookie('userView');//No I18N
        }
    }
},1000);//No I18N

fnBindHandleClickEvents = function(){
        var container = document.getElementsByTagName("body");
        var links = container[0].getElementsByTagName("a");
        for(var i =0;link=links[i];i++){
            if(link.parentNode.parentNode.id!=="nav-top" && link.parentNode.parentNode.id.indexOf("nav-ul")===-1 && link.id!=="zpFooterUpgradeLink" && link.id !== "zpBlogNext" && link.id !== "zpBlogPrev" && link.href.search("blogs/feed/") === -1){
                link.onclick = function(){
                   var infoElem = parent.document.getElementById("zpPreviewClickInfoMsg");
                   if(infoElem){
                       infoElem.style.display="block";
                       var msgWid = infoElem.offsetWidth;
                       var wwidth = parent.document.documentElement.clientWidth;
                       infoElem.style.left=(wwidth/2-msgWid/2)+'px';
                       infoElem.style.top='0px';
                       infoElem.style.position="absolute";
                       setTimeout(function(){
                               infoElem.style.display='none';
                               },2000);
                    }
                    return false;
                }
            }
        }
}

transSupportNav = function(){
     var transitions = {
                'transition':'transitionend',// No I18N
                'OTransition':'oTransitionEnd',// No I18N
                'MSTransition':'msTransitionEnd',// No I18N
                'MozTransition':'transitionend',// No I18N
                'WebkitTransition':'webkitTransitionEnd'// No I18N
     }
     var style = document.body.style || document.documentElement.style;
     for(transition in transitions){
        if(style[transition] != undefined){
            return {transitionEnd:transitions[transition],'transition':transition};
        }
     }
     return {'transitionEnd':undefined};// No I18N
}

/*bindEvent=function(el,type,func){
    if(el.addEventListener){
        el.addEventListener(type,func,false);
    }else if(el.attachEvent){
        el.attachEvent('on'+type,func);
    }
}
unbindEvent=function(el,type,handler){
    if(handler){
        if(el.removeEventListener){
            el.removeEventListener(type,handler,false);    
        }else if(el.detachEvent){
            el.detachEvent('on'+type,handler);
        }
    }
}*/

