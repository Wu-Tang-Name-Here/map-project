//////////////MODEL////////////////////////
var initialLocations = [
	{
			name: 'La Taqueria', 
			address: '2889 Mission St, San Francisco, CA', 
			coordinates: {lat: 37.751087, lng: -122.418092}
		},
		{
			name: 'Taqueria El Farolito', 
			address: '2779 Mission St, San Francisco, CA', 
			coordinates: {lat: 37.752938, lng:  -122.418218}
		},
		{
			name: 'Taqueria La Cumbre', 
			address: '515 Valencia St, San Francisco, CA', 
			coordinates: {lat: 37.764852, lng: -122.421671}
		},
		{
			name: 'El Faro', 
			address: '2399 Folsom St, San Francisco, CA', 
			coordinates: {lat: 37.759231, lng: -122.414514}
		},
		{
			name: 'Taqueria Vallarta', 
			address: '3033 24th St, San Francisco, CA', 
			coordinates: {lat: 37.752637, lng: -122.412566}
		}
]

var Location = function(data) {
	this.name = ko.observable(data.name);
	this.address = ko.observable(data.address);
	this.coordinates = ko.observable(data.coordinates);
};

var ViewModel = function(){
	var self = this;

	this.locationList = ko.observableArray([]);

	initialLocations.forEach(function(locationItem){
		self.locationList.push( new Location(locationItem) );
	});

	this.currentLocation = ko.observable( this.locationList()[0] );

	this.setLocation = function(clickedLoc) {
		self.currentLocation(clickedLoc);
	};

};

///////////View/////////////////////////

/////MAP/////
var map;

//creates blank array for all listings
var markers = [];

//function to initialize the map
var initMap = function() {
       
	map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.758778, lng: -122.417022}, 
    zoom: 14
   });
 
 	var largeInfoWindows = new google.maps.InfoWindow();
      var bounds = new google.maps.LatLngBounds();

      for (var i = 0; i < initialLocations.length; i++) {
        //get position from location array
        var position = initialLocations[i].coordinates;
        var address = initialLocations[i].address;
        var title = initialLocations[i].name;
        //create marker per locations and put into markers array
        var marker = new google.maps.Marker({
          map: map,
          position: position,
          title: title,
          address: address,
          animation: google.maps.Animation.DROP,
          id: i
        });
        //push marker to our array of markers
        markers.push(marker);
        //etends boundries of the map for each marker
        bounds.extend(marker.position);
        //create an onclick event to open an infowindow at each arker
        marker.addListener('mouseover', function() {
          populateInfoWindow(this, largeInfoWindows);
        });

    var populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {
          infowindow.setContent('');
          infowindow.marker = marker;
          infowindow.addListener('closeclick', function(){
            infowindow.marker = null;
          });

          var streetViewService = new google.maps.StreetViewService();
          var radius = 50;

          var getStreetView = function(data, status) {
            if(status == google.maps.StreetViewStatus.OK) {
              var nearStreetViewLocation = data.location.latLng;
              var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
                infowindow.setContent('<div' + marker.title + '</div><div id="pano"></div>');
                  var panormaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                      heading: heading,
                      pitch: 30
                    }
                  };
                  var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panormaOptions);
            } else {
              infowindow.setContent('<div>' + marker.title + '</div>' + '<div>No Street View Found</div>');
            }
          }
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          infowindow.open(map, marker);
        }
      }
    }
};
ko.applyBindings(new ViewModel());