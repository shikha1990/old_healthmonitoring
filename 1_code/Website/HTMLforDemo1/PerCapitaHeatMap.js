//written by: Dean Takacs
// tested by: Dean Takacs
// debugged by: Dean Takacs



JsonGeoData = jsonGeoData;



var map;
var heatmap;
HeatMapData=[];

WeightedMapData = [];
RegularMapData = []; 

//data from other file



//This function accepts JSON in the form of the following
// {lat:30.0923,log:-77.037,weight:98}
//It populates 2 sets of google maps data, one weighted and one regular
// the regular just sets all weights to 1.
function PushGeoData(geoData)
{

	for(var i = 0; i < geoData.length; i++) 
	{
		
		var latLng = new google.maps.LatLng(geoData[i].lat, geoData[i].log);
		var weightedLoc = 
		{
			location: latLng,
			weight: geoData[i].weight
		};
		var regularLoc =
		{
			location: latLng,
			weight: 1
		};
		
		WeightedMapData.push(weightedLoc);
		RegularMapData.push(regularLoc);
	}
}

      function initializeHeatMap()
	{
		
        var mapOptions = {
          center: new google.maps.LatLng(39.833333, -98.583333),
          zoom: 4,
          mapTypeId: google.maps.MapTypeId.SATELLITE
        }

		var mapCanvas = document.getElementById('map_canvas');

        map = new google.maps.Map(mapCanvas, mapOptions)
      
		heatmap = new google.maps.visualization.HeatmapLayer({
		data: HeatMapData,
		radius:30

		});
		heatmap.setMap(map);
		
	}

google.maps.event.addDomListener(window, 'load', initializeHeatMap);
PushGeoData(JsonGeoData);


	function ChooseWeighted()
{
	HeatMapData = WeightedMapData;
	initializeHeatMap();
	PushGeoData(JsonGeoData);
}

	function ChooseRegular()
	{
		HeatMapData = RegularMapData;
		initializeHeatMap();
		PushGeoData(JsonGeoData);
	}
	/*
	function ShowAllTime()
	{
		MasterEndTime = 1;
		MasterStartTime = currentUnixtime + 1;
	}

	function ShowThisWeek() 
	{
		MasterEndTime = currentUnixtime - 7*24*60*60;
		MasterStartTime = currentUnixtime + 1;
    } 
	
	function ShowLastWeek()
	{
		MasterEndTime = currentUnixtime - 2*7*24*60*60;
		MasterStartTime = currentUnixtime - 7*24*60*60;
	}
    
	function ShowTwoWeeksAgo()
	{
		MasterEndTime = currentUnixtime - 3*7*24*60*60;
		MasterStartTime = currentUnixtime - 2*7*24*60*60;
	}
	
	function ShowThreeWeeksAgo()
	{
		MasterEndTime = currentUnixtime - 4*7*24*60*60;
		MasterStartTime = currentUnixtime - 3*7*24*60*60;
	}
*/
