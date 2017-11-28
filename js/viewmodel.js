//////////////MODEL////////////////////////
var initialLocations = [
    {
            name: 'La Taqueria',
            address: '2889 Mission St, San Francisco, CA',
            coordinates: {lat: 37.751087, lng: -122.418092},
            venueID: '4533c484f964a5208e3b1fe3'
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
            coordinates: {lat: 37.764852, lng: -122.421671},
            venueID: '4533c484f964a5208e3b1fe3'
        },
        {
            name: 'El Faro',
            address: '2399 Folsom St, San Francisco, CA',
            coordinates: {lat: 37.759231, lng: -122.414514},
            venueID: '4a90ad48f964a5201a1920e3'
        },
        {
            name: 'Taqueria Vallarta',
            address: '3033 24th St, San Francisco, CA',
            coordinates: {lat: 37.752637, lng: -122.412566},
            venueID: '49cda4adf964a5200a5a1fe3'
        },
        {
            name: 'Papalote Mexican Grill',
            address: '3409 24th St, San Francisco, CA',
            coordinates: {lat: 37.751955, lng: -122.420978},
            venueID: '43b439b6f964a520bc2c1fe3'
        },
        {
            name: 'El Matate',
            address: '2406 Bryant St, San Francisco, CA',
            coordinates: {lat: 37.755781, lng: -122.409632},
            venueID: '48484314f964a52074501fe3'
        },
        {
            name: "Mateo's Taquerilla",
            address: '2471 Mission St, San Francisco, CA',
            coordinates: {lat: 37.757552, lng: -122.418730},
            venueID: '55f1ea7f498eef987c30e8d1'
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
    google.maps.event.trigger(location.marker,'click');
  }

  /////Filter
    this.filter = ko.observable("");

    this.filteredLocations = ko.computed(function() {
    var filter = self.filter().toLowerCase();
    return ko.utils.arrayFilter(self.locationList(), function(item) {
        const isVisible = item.name.toLowerCase().indexOf(filter) > -1 || !filter;
        item.marker.setVisible(isVisible);
        return isVisible;
    })
});

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
        var venueID = initialLocations[i].venueID;

        //create marker per locations and put into markers array
        var marker = new google.maps.Marker({
          map: map,
          position: position,
          title: title,
          address: address,
          animation: google.maps.Animation.DROP,
          id: venueID
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

    /////////populates info window
    var populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.marker = marker;

            infowindow.setContent('<div>' + marker.title +
                                    '<p>' + marker.address + '</div>'+
                                    '<p>' + 'FourSquare ');
            infowindow.open(map, marker);

            infowindow.addListener('closeclick', function(){
            })
        }
    };

    /////ajax request for FourSquare API
    var foursquareRequest = function (marker) {
        var apiURL = 'https://api.foursquare.com/v2/venues/';
        var foursquareClientID = 'YKM1SQVAHAI2ERVFQZNT1BXARDYSGBEACCAOKPTAWLMNVNCK'
        var foursquareSecret ='2U0X5KPXABRQKNKB1VPTEWYN3SVA0NKMFC1VMQEGMPECEZFB';
        var foursquareVersion = '20170112';
        var venueFoursquareID = marker.id;

        var foursquareURL = apiURL + venueFoursquareID + '?client_id=' + foursquareClientID +  '&client_secret=' + foursquareSecret +'&v=' + foursquareVersion;

        $.ajax({
          url: foursquareURL,
          success: function(data) {
            console.log(data);

            var rating = data.response.venue.rating;
            var hours = data.response.venue.hours;
            var menu = data.response.venue.menu;
            var description = data.response.venue.description;
          }
        });
    }

};