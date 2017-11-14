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

	this.locationList = ko.observable([]);

	initialLocations.forEach(function(locationItem){
		this.locationList = ko.observableArray([]);
	});

	this.currentLocation = ko.observable( this.locationList()[0] );

	this.setLocation = function(clickedLoc) {
		self.currentLocation(clickedLoc);
	};

	/////MAP//////
	/*self.myMap = ko.observable({
		lat: ko.observable(37.759951),
		lng: ko.observable(-122.415139)
	})*/
};

///////////View/////////////////////////
/*ko.bindingHandlers.map = {

    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var mapObj = ko.utils.unwrapObservable(valueAccessor());
        var latLng = new google.maps.LatLng(
            ko.utils.unwrapObservable(mapObj.lat),
            ko.utils.unwrapObservable(mapObj.lng));
        var mapOptions = { center: latLng,
                          zoom: 5, 
                          mapTypeId: google.maps.MapTypeId.ROADMAP};

        mapObj.googleMap = new google.maps.Map(element, mapOptions);
    }
};*/

var map;

//creates blank array for all listings
var markers = [];

//function to initialize the map
var initMap = function() {
       
	map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.759951, lng: -122.415139}, 
    zoom: 15
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
      }
};
ko.applyBindings(new ViewModel());