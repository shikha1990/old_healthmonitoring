//written by: Dean Takacs
// tested by: Dean Takacs
// debugged by: Dean Takacs

var map, RunningMapData;
var MapHeading="Regular Heat Map";

var NYwgt=1, LAwgt=1, CHGOwgt=1, HSTwgt=1, JAXwgt=1, DNVwgt=1, SEAwgt=1;


//EXAMPLE DATA FOR THE PER CAPITA HEAT MAP
function DeclareExampleData(){
RunningMapData = [
  {location: new google.maps.LatLng(40.6643 ,-73.9385), weight: NYwgt},
  {location: new google.maps.LatLng(40.6643 ,-73.9385), weight: NYwgt},
  {location: new google.maps.LatLng(40.6643 ,-73.9385), weight: NYwgt},
  {location: new google.maps.LatLng(40.6643 ,-73.9385), weight: NYwgt},
  {location: new google.maps.LatLng(40.6643 ,-73.9385), weight: NYwgt},
  {location: new google.maps.LatLng(40.6643 ,-73.9385), weight: NYwgt},
  {location: new google.maps.LatLng(40.6643 ,-73.9385), weight: NYwgt},
  {location: new google.maps.LatLng(40.6643 ,-73.9385), weight: NYwgt},
  {location: new google.maps.LatLng(40.6643 ,-73.9385), weight: NYwgt},
  {location: new google.maps.LatLng(40.6643 ,-73.9385), weight: NYwgt},
  {location: new google.maps.LatLng(40.6643 ,-73.9385), weight: NYwgt},
  {location: new google.maps.LatLng(40.6643 ,-73.9385), weight: NYwgt},
  {location: new google.maps.LatLng(40.6643 ,-73.9385), weight: NYwgt},



  {location: new google.maps.LatLng(34.0194, -118.4108), weight: LAwgt},
  {location: new google.maps.LatLng(34.0194, -118.4108), weight: LAwgt},
  {location: new google.maps.LatLng(34.0194, -118.4108), weight: LAwgt},
  {location: new google.maps.LatLng(34.0194, -118.4108), weight: LAwgt},
  {location: new google.maps.LatLng(34.0194, -118.4108), weight: LAwgt},
  {location: new google.maps.LatLng(34.0194, -118.4108), weight: LAwgt},
  {location: new google.maps.LatLng(34.0194, -118.4108), weight: LAwgt},
  {location: new google.maps.LatLng(34.0194, -118.4108), weight: LAwgt},
  {location: new google.maps.LatLng(34.0194, -118.4108), weight: LAwgt},
  {location: new google.maps.LatLng(34.0194, -118.4108), weight: LAwgt},

  {location: new google.maps.LatLng(41.8376, -87.6818), weight: CHGOwgt},
  {location: new google.maps.LatLng(41.8376, -87.6818), weight: CHGOwgt},
  {location: new google.maps.LatLng(41.8376, -87.6818), weight: CHGOwgt},
  {location: new google.maps.LatLng(41.8376, -87.6818), weight: CHGOwgt},
  {location: new google.maps.LatLng(41.8376, -87.6818), weight: CHGOwgt},
  {location: new google.maps.LatLng(41.8376, -87.6818), weight: CHGOwgt},
  {location: new google.maps.LatLng(41.8376, -87.6818), weight: CHGOwgt},
  {location: new google.maps.LatLng(41.8376, -87.6818), weight: CHGOwgt},


  {location: new google.maps.LatLng(29.7805, -95.3863), weight: HSTwgt},
  {location: new google.maps.LatLng(29.7805, -95.3863), weight: HSTwgt},
  {location: new google.maps.LatLng(29.7805, -95.3863), weight: HSTwgt},
  {location: new google.maps.LatLng(29.7805, -95.3863), weight: HSTwgt},
  {location: new google.maps.LatLng(29.7805, -95.3863), weight: HSTwgt},
  {location: new google.maps.LatLng(29.7805, -95.3863), weight: HSTwgt},
  {location: new google.maps.LatLng(29.7805, -95.3863), weight: HSTwgt},
  {location: new google.maps.LatLng(29.7805, -95.3863), weight: HSTwgt},
  {location: new google.maps.LatLng(29.7805, -95.3863), weight: HSTwgt},
  {location: new google.maps.LatLng(29.7805, -95.3863), weight: HSTwgt},


  {location: new google.maps.LatLng(30.3370, -81.6613), weight: JAXwgt},
  {location: new google.maps.LatLng(30.3370, -81.6613), weight: JAXwgt},
  {location: new google.maps.LatLng(30.3370, -81.6613), weight: JAXwgt},
  {location: new google.maps.LatLng(30.3370, -81.6613), weight: JAXwgt},


  {location: new google.maps.LatLng(47.6205, -122.3509), weight: SEAwgt},
  {location: new google.maps.LatLng(47.6205, -122.3509), weight: SEAwgt},
  {location: new google.maps.LatLng(47.6205, -122.3509), weight: SEAwgt},
  {location: new google.maps.LatLng(47.6205, -122.3509), weight: SEAwgt},
  {location: new google.maps.LatLng(47.6205, -122.3509), weight: SEAwgt},
  {location: new google.maps.LatLng(47.6205, -122.3509), weight: SEAwgt},
  {location: new google.maps.LatLng(47.6205, -122.3509), weight: SEAwgt},


  {location: new google.maps.LatLng(39.7618, -104.8806), weight: DNVwgt},
  {location: new google.maps.LatLng(39.7618, -104.8806), weight: DNVwgt},
  {location: new google.maps.LatLng(39.7618, -104.8806), weight: DNVwgt},
  {location: new google.maps.LatLng(39.7618, -104.8806), weight: DNVwgt},
  {location: new google.maps.LatLng(39.7618, -104.8806), weight: DNVwgt},
  {location: new google.maps.LatLng(39.7618, -104.8806), weight: DNVwgt}

];
}

DeclareExampleData();

      function initialize() {
  
        var mapOptions = {
          center: new google.maps.LatLng(39.833333, -98.583333),
          zoom: 4,
          mapTypeId: google.maps.MapTypeId.SATELLITE

        }

	var mapCanvas = document.getElementById('map_canvas');

        map = new google.maps.Map(mapCanvas, mapOptions)
      


	heatmap = new google.maps.visualization.HeatmapLayer({
	data: RunningMapData,
		radius:75

	});


	heatmap.setMap(map);

	}


function ChooseRegHeatMap()
{
	NYwgt=1, LAwgt=1, CHGOwgt=1, HSTwgt=1, JAXwgt=1, DNVwgt=1, SEAwgt=1;
	DeclareExampleData();
	initialize();
}

function ChoosePerCapitaHeatMap()
{
	NYwgt=1, LAwgt=(8405.0/3884.0), CHGOwgt=(8405.0/2718.0), HSTwgt=(8405.0/2195.0), JAXwgt=(8405.0/842.0), DNVwgt=(8405.0/649.0), SEAwgt=(8405.0/652.0);
	//NYwgt=1, LAwgt=10, CHGOwgt=1, HSTwgt=1, JAXwgt=1, DNVwgt=1, SEAwgt=1;
	DeclareExampleData();
	initialize();

}




	google.maps.event.addDomListener(window, 'load', initialize);
