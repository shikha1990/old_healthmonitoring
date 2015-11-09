/*$Id$*/
openWindowTask = function(urlString, windowType, windowSpecificArgument){
    if(windowType == "New window")
	window.open(urlString, "_blank");
    else if(windowType == "Parent window")
	window.open(urlString, "_parent");
    else if(windowType == "Same window")
	window.location.href = urlString;
}
