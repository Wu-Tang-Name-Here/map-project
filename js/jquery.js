var foursquareRequest = function (marker) {
    var apiURL = 'https://api.foursquare.com/v2/venues/';
    var foursquareClientID = 'YKM1SQVAHAI2ERVFQZNT1BXARDYSGBEACCAOKPTAWLMNVNCK'
    var foursquareSecret ='2U0X5KPXABRQKNKB1VPTEWYN3SVA0NKMFC1VMQEGMPECEZFB';
    var foursquareVersion = '20170112';
    var venueFoursquareID = initialLocations.venueID

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
