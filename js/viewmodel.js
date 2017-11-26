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
            coordinates: {lat: 37.752938, lng:  -122.418218},
            venueID: '455877bff964a520453d1fe3'
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
    this.name = data.name;
    this.address = data.address;
    this.coordinates = data.coordinates;
    this.marker = data.marker;
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

  this.showMarker = function(location) {
    console.log(location);
    google.maps.event.trigger(location.marker,'click');
  }

  /////Filter
    this.filter = ko.observable("");

    this.filteredLocations = ko.computed(function() {
        console.log("works");
        var filter = self.filter().toLowerCase();
        if (!filter) {
            return self.locationList();
        } else {
            return ko.utils.arrayFilter(this.locations(), function(location) {
                return ko.utils.stringStartsWith(Location.name().toLowerCase(), filter);
            })
        }
    },);

};

///////////View/////////////////////////

/////MAP/////
var map;

//creates blank array for all listings
var markers = [];

//var contentString = '<div> + marker.title + </div>'

//function to initialize the map
var initMap = function() {

    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.758778, lng: -122.417022},
    zoom: 14
   });

    /*var contentString = ko.computed( function () {
        return this.name + " " + this.address;
    }, this);*/

 //var contentString = '<div> + marker.title + </div>'
    var largeInfoWindow = new google.maps.InfoWindow();

    //var largeInfoWindows = new google.maps.InfoWindow();
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
        initialLocations[i].marker = marker;

        //etends boundries of the map for each marker
        bounds.extend(marker.position);
        //create an onclick event to open an infowindow at each arker
        marker.addListener('click', function() {
          populateInfoWindow(this, largeInfoWindow);
        });
    }
  ko.applyBindings(new ViewModel());

    var populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '<p>' + marker.address + '</div>');
            infowindow.open(map, marker);

            infowindow.addListener('closeclick', function(){
                infowindow.setMarker(null);
            })
        }
    }
};