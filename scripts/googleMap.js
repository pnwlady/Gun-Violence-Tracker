// US Map Model
var prev = false;

GoogleMap = function() {
  GoogleMap.initMap();
};

GoogleMap.prototype.model = function() {

};

GoogleMap.prototype.view = function() {

};

GoogleMap.prototype.controller = function() {

};

GoogleMap.prototype.render = function() {
  GoogleMap.initMap();
};

GoogleMap.initMap = function() {
  var coordinate = {lat:37.09024,lng:-95.712891}; //Coordinate for the USA
  var loadMarker = false;
  var mapOptions = {
    center: coordinate,
    zoom: 4,
    minZoom: 4,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var dataURL = 'data/gunViolenceArchive.json';
  var markerJSON = {};
  $.ajax({url: dataURL, success: function() {
    console.log('Returning data from ' + dataURL);
  }, error: function() {
    console.log('Failed to load data from ' + dataURL);
  }})
    .done(function(data) {
      markerJSON = data;
      loadMarker = true;
    });
  var map = new google.maps.Map(document.getElementById('gmap'),mapOptions);
  var markerCounter = 0;
  var geocoder = new google.maps.Geocoder();
  setInterval(function() {
    if (loadMarker) {
      loadMarker = false;
      var marker = markerJSON[markerCounter];
      var address = (marker['Address'] + ' ' + marker['City or County'] + ', ' + marker['State']);
      geocoder.geocode({'address':address}, function(results,status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var latitude = results[0].geometry.location.lat();
          var longitude = results[0].geometry.location.lng();
          coordinate.lat = latitude;
          coordinate.lng = longitude;
          var mapMarker = new google.maps.Marker({
            position: coordinate,
            map: map,
            title: marker['Incident Date']
          });

          GoogleMap.attachInfo(mapMarker, marker, map);
          markerCounter++;
          console.log(markerCounter);
          loadMarker = true;
          /*
          if (markerCounter === markerJSON.length) {
            clearInterval(loadMapMarkers);
          }
          */
        }
      });
      /*
      //geocoder built from example found here: http://stackoverflow.com/questions/5984179/javascript-geocoding-from-address-to-latitude-and-longitude-numbers-not-working
      */
    }
  },1000);
};

GoogleMap.attachInfo = function(marker, info, map) {
  var infoWindow = new google.maps.InfoWindow({
    content:
      '<p>' + info['Incident Date'] + '</p><p>Killed: ' +
      info['Killed'] + '</p><p>Injured: ' + info['Injured'] + '</p>' +
      '<div id=pano></div>'
  });
  marker.addListener('click', function() {
    if(prev) prev.close();
    prev = infoWindow;
    infoWindow.open(map, marker);
    this.pano = new google.maps.StreetViewPanorama($('#pano')[0], {position: marker.position});
  });
};
