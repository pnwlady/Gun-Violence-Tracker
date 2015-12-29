/* The Google Map Object */
var GoogleMap = function(elementID,dataUrl,parameters) {
  this.model(elementID,dataUrl,parameters);
  this.view(parameters);
  this.controller();
};
GoogleMap.prototype.model = function(elementID,dataUrl,parameters) {
  var address = parameters[0];
  var latitude = 37.09024;
  var longitude = -95.712891;
  var zoom = 4;
  if (address !== null) {
    var urlAddress = address.replace(/ /g,'+');
    $.ajax({async: false, url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+urlAddress+'&key='+googleAPIKey}).done(function(data) {
      if (data.status !== 'ZERO_RESULTS') {
        latitude = data.results[0].geometry.location.lat;
        longitude = data.results[0].geometry.location.lng;
        if (data.results[0].address_components[0].types[0] === 'street_number') {
          zoom = 17;
        } else if (data.results[0].address_components[0].types[0] === 'neighborhood') {
          zoom = 15;
        } else if (data.results[0].address_components[0].types[0] === 'locality') {
          zoom = 11;
        } else if (data.results[0].address_components[0].types[0] === 'administrative_area_level_2') {
          zoom = 9;
        } else if (data.results[0].address_components[0].types[0] === 'administrative_area_level_1') {
          zoom = 7;
        } else if(data.results[0].address_components[0].types[0] === 'country') {
          zoom = 4;
        }
      }
    });
  }
  this.markers = [];
  this.loadMarkers = false;
  this.modelSet = false;
  this.viewSet = false;
  this.currentMarkerWindow = false;
  var coordinate = {lat:latitude,lng:longitude}; //Coordinate for the USA
  var mapOptions = {
    center: coordinate,
    zoom: zoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(document.getElementById(elementID),mapOptions);
  this.dataURL = dataUrl;
  this.markersJSON = {};
  var googleMap = this;
  var loading = false;
  var loadModel = setInterval(function() {
    if (!loading) {
      loading = true;
      $.ajax({url: googleMap.getDataURL(), success: function() {
        console.log('Returning data from ' + googleMap.getDataURL());
      }, error: function() {
        console.log('Failed to load data from ' + googleMap.getDataURL());
      }}).done(function(data) {
        googleMap.setMarkersJSON(data);
        googleMap.setLoadMarkers(true);
        googleMap.setModelSet(true);
        clearInterval(loadModel);
      });
    }
  },10);
};
GoogleMap.prototype.view = function(parameters) {
  var googleMap = this;
  var loadView = setInterval(function() {
    if (googleMap.getModelSet()) {
      google.maps.event.addDomListener(window, 'load', googleMap.initMap(googleMap,parameters));
      googleMap.setViewSet(true);
      clearInterval(loadView);
    }
  },10);
};
GoogleMap.prototype.controller = function() {
  var googleMap = this;
  var loadController = setInterval(function() {
    if (googleMap.getViewSet()) {
      googleMap.setupFilterActions(googleMap);
      clearInterval(loadController);
    }
  },10);
};
GoogleMap.prototype.setModelSet = function(bool) {
  this.modelSet = bool;
};
GoogleMap.prototype.getViewSet = function() {
  return this.viewSet;
};
GoogleMap.prototype.setViewSet = function(bool) {
  this.viewSet = bool;
};
GoogleMap.prototype.setMarkersJSON = function(data) {
  this.markersJSON = data;
};
GoogleMap.prototype.getDataURL = function() {
  return this.dataURL;
};
GoogleMap.prototype.getModelSet = function() {
  return this.modelSet;
};
GoogleMap.prototype.getLoadMarkers = function() {
  return this.loadMarkers;
};
GoogleMap.prototype.getMarkersJSON = function() {
  return this.markersJSON;
};
GoogleMap.prototype.setLoadMarkers = function(bool) {
  this.loadMarkers = bool;
};
GoogleMap.prototype.getMarkerDate = function(markerDate) {
  var dateComponents = markerDate.split(' ');
  dateComponents[1] = dateComponents[1].substring(0,dateComponents[1].length-1);
  if (dateComponents[0] === 'January') {
    dateComponents[0] = '0';
  } else if (dateComponents[0] === 'February') {
    dateComponents[0] = '1';
  } else if (dateComponents[0] === 'March') {
    dateComponents[0] = '2';
  } else if (dateComponents[0] === 'April') {
    dateComponents[0] = '3';
  } else if (dateComponents[0] === 'May') {
    dateComponents[0] = '4';
  } else if (dateComponents[0] === 'June') {
    dateComponents[0] = '5';
  } else if (dateComponents[0] === 'July') {
    dateComponents[0] = '6';
  } else if (dateComponents[0] === 'August') {
    dateComponents[0] = '7';
  } else if (dateComponents[0] === 'September') {
    dateComponents[0] = '8';
  } else if (dateComponents[0] === 'October') {
    dateComponents[0] = '9';
  } else if (dateComponents[0] === 'November') {
    dateComponents[0] = '10';
  } else if (dateComponents[0] === 'December') {
    dateComponents[0] = '11';
  }
  return (dateComponents[2] + '-' + dateComponents[0] + '-' + dateComponents[1]).toString();
};
GoogleMap.prototype.addMarker = function(markerMap,coordinates,title,date,killed,injured,hasStreetView) {
  var infoWindowHTML = '';
  if (hasStreetView) {
    infoWindowHTML = ('<p>' + title + '</p>' +
      '<p>Killed: ' + killed + '</p>' +
      '<p>Injured: ' + injured + '</p>' +
      '<div id="street-view-panorama"></div>');
  } else {
    infoWindowHTML = ('<p>' + title + '</p>' +
      '<p>Killed: ' + killed + '</p>' +
      '<p>Injured: ' + injured + '</p>');
  }
  var infoWindow = new google.maps.InfoWindow({
    content: infoWindowHTML
  });
  var mapMarker = new google.maps.Marker({
    position: coordinates,
    map: markerMap.map,
    title: title,
    date: date,
    killed: killed,
    injured: injured,
    infoWindow: infoWindow,
    mapObj: markerMap,
    hasStreetView: hasStreetView
  });
  mapMarker.addListener('click', function() {
    if (this.mapObj.currentMarkerWindow) {
      this.mapObj.currentMarkerWindow.close();
    }
    this.mapObj.currentMarkerWindow = this.infoWindow;
    this.infoWindow.open(this.map, this);
    if (this.hasStreetView) {
      this.panorama = new google.maps.StreetViewPanorama($('#street-view-panorama')[0],{position: this.position});
    }
  });
  markerMap.addMarkerToMarkers(mapMarker);
};
GoogleMap.prototype.addMarkerToMarkers = function(marker) {
  this.markers.push(marker);
};
GoogleMap.prototype.getMapMarkers = function() {
  return this.markers;
};
GoogleMap.prototype.hideMapMarker = function(index) {
  this.markers[index].setVisible(false);
};
GoogleMap.prototype.showMapMarker = function(index) {
  this.markers[index].setVisible(true);
};
GoogleMap.prototype.getMapMarkerVisibility = function(index) {
  return this.markers[index].getVisible();
};
GoogleMap.prototype.initMap = function(map,parameters) {
  var googleMap = map;
  var loadMapMarkers = setInterval(function() {
    if (googleMap.getLoadMarkers()) {
      googleMap.setLoadMarkers(false);
      var markersJSON = googleMap.getMarkersJSON();
      for (i = 0; i < markersJSON.length; i++) {
        var markerJSON = markersJSON[i];
        if (markerJSON.hasOwnProperty('latitude') && markerJSON.hasOwnProperty('longitude')) {
          var coordinate = {'lat':markerJSON.latitude,'lng':markerJSON.longitude};
          var markerDate = googleMap.getMarkerDate(markerJSON['Incident Date']);
          googleMap.addMarker(googleMap,coordinate,markerJSON['Incident Date'],markerDate,markerJSON['Killed'],markerJSON['Injured'],markerJSON['hasStreetView']);
        }
        if ((i + 1) >= markersJSON.length) {
          googleMap.createDateFilter(parameters[1],parameters[2]);
          clearInterval(loadMapMarkers);
        }
      }
    }
  },10);
};
GoogleMap.prototype.createDateFilter = function(min,max) {
  var oldestMarkerDate = '';
  var newestMarkerDate = '';
  var minMarkerDate = '';
  var maxMarkerDate = '';
  var mapMarkers = this.getMapMarkers();
  for (i = 0; i < mapMarkers.length; i++) {
    if (oldestMarkerDate === '') {
      oldestMarkerDate = mapMarkers[i].date.toString();
    }
    if (newestMarkerDate === '') {
      newestMarkerDate = mapMarkers[i].date.toString();
    }
    var markerYear = mapMarkers[i].date.substring(0,4);
    var markerMonth = mapMarkers[i].date.substring(5,7);
    var markerDay = mapMarkers[i].date.substring(8,mapMarkers[i].date.length);
    var oldestMarkerYear = oldestMarkerDate.substring(0,4);
    var oldestMarkerMonth = oldestMarkerDate.substring(5,7);
    var oldestMarkerDay = oldestMarkerDate.substring(8,oldestMarkerDate.length);
    var newestMarkerYear = newestMarkerDate.substring(0,4);
    var newestMarkerMonth = newestMarkerDate.substring(5,7);
    var newestMarkerDay = newestMarkerDate.substring(8,newestMarkerDate.length);
    var oldestDate = false;
    var oldestYear = false;
    var oldestMonth = false;
    var oldestDay = false;
    var newestDate = false;
    var newestYear = false;
    var newestMonth = false;
    var newestDay = false;
    if (markerYear <= oldestMarkerYear) {
      oldestYear = true;
    } else if (markerYear >= newestMarkerYear) {
      newestYear = true;
    }
    if (markerMonth <= oldestMarkerMonth) {
      oldestMonth = true;
    } else if (markerMonth >= newestMarkerMonth) {
      newestMonth = true;
    }
    if (markerDay <= oldestMarkerDay) {
      oldestDay = true;
    } else if (markerDay >= newestMarkerDay) {
      newestDay = true;
    }
    if (oldestYear && oldestMonth && oldestDay) {
      oldestMarkerDate = mapMarkers[i].date.toString();
    }
    if (newestYear && newestMonth && newestDay) {
      newestMarkerDate = mapMarkers[i].date.toString();
    }
  }
  oldestMarkerDate = oldestMarkerDate.split('-');
  newestMarkerDate = newestMarkerDate.split('-');
  oldestMarkerDate = new Date(oldestMarkerDate[0],oldestMarkerDate[1],oldestMarkerDate[2]);
  newestMarkerDate = new Date(newestMarkerDate[0],newestMarkerDate[1],newestMarkerDate[2]);
  minMarkerDate = oldestMarkerDate;
  maxMarkerDate = newestMarkerDate;
  if (min !== null) {
    var minDate = min;
    var minMarkerYear = minDate.substring(0,4);
    var minMarkerMonth = minDate.substring(5,7);
    var minMarkerDay = minDate.substring(8,minDate.length);
    minMarkerDate = new Date(parseInt(minMarkerYear),(parseInt(minMarkerMonth)-1),parseInt(minMarkerDay));
  }
  if (max !== null) {
    var maxDate = max;
    var maxMarkerYear = maxDate.substring(0,4);
    var maxMarkerMonth = maxDate.substring(5,7);
    var maxMarkerDay = maxDate.substring(8,maxDate.length);
    maxMarkerDate = new Date(parseInt(maxMarkerYear),(parseInt(maxMarkerMonth)-1),parseInt(maxMarkerDay));
  }
  $('#date_range_slider').dateRangeSlider({
    defaultValues: {min:minMarkerDate,max:maxMarkerDate},
    bounds: {min:oldestMarkerDate,max:newestMarkerDate}
  });
  var mapMarkers = this.getMapMarkers();
  var minDate = minMarkerDate;
  var maxDate = maxMarkerDate;
  var oldestMarkerYear = minDate.getFullYear();
  var oldestMarkerMonth = minDate.getMonth();
  var oldestMarkerDay = minDate.getDate();
  var newestMarkerYear = maxDate.getFullYear();
  var newestMarkerMonth = maxDate.getMonth();
  var newestMarkerDay = maxDate.getDate();
  for (i = 0; i < mapMarkers.length; i++) {
    var show = false;
    var markerYear = mapMarkers[i].date.substring(0,4);
    var markerMonth = mapMarkers[i].date.substring(5,7);
    var markerDay = mapMarkers[i].date.substring(7,mapMarkers[i].date.length);
    var isInRangeOfOldestDate = false;
    var isInRangeOfNewestDate = false;
    if (parseInt(markerYear) >= parseInt(oldestMarkerYear)) {
      if (parseInt(markerYear) === parseInt(oldestMarkerYear)) {
        if (parseInt(markerMonth) >= parseInt(oldestMarkerMonth)) {
          if (parseInt(markerMonth) === parseInt(oldestMarkerMonth)) {
            if (parseInt(markerDay) >= parseInt(oldestMarkerDay)) {
              isInRangeOfOldestDate = true;
            }
          } else {
            isInRangeOfOldestDate = true;
          }
        }
      } else {
        isInRangeOfOldestDate = true;
      }
    }
    if (parseInt(markerYear) <= parseInt(newestMarkerYear)) {
      if (parseInt(markerYear) === parseInt(newestMarkerYear)) {
        if (parseInt(markerMonth) <= parseInt(newestMarkerMonth)) {
          if (parseInt(markerMonth) === parseInt(newestMarkerMonth)) {
            if (parseInt(markerDay) <= parseInt(newestMarkerDay)) {
              isInRangeOfNewestDate = true;
            }
          } else {
            isInRangeOfNewestDate = true;
          }
        }
      } else {
        isInRangeOfNewestDate = true;
      }
    }
    if (isInRangeOfOldestDate && isInRangeOfNewestDate) {
      show = true;
    }
    if (!show) {
      if (this.getMapMarkerVisibility(i)) {
        this.hideMapMarker(i);
      }
    } else {
      if (!this.getMapMarkerVisibility(i)) {
        this.showMapMarker(i);
      }
    }
  }
};
GoogleMap.prototype.setupDateFilter = function(min,max) {
  var oldestMarkerDate = '';
  var newestMarkerDate = '';
  var minMarkerDate = '';
  var maxMarkerDate = '';
  var mapMarkers = this.getMapMarkers();
  for (i = 0; i < mapMarkers.length; i++) {
    if (oldestMarkerDate === '') {
      oldestMarkerDate = mapMarkers[i].date.toString();
    }
    if (newestMarkerDate === '') {
      newestMarkerDate = mapMarkers[i].date.toString();
    }
    var markerYear = mapMarkers[i].date.substring(0,4);
    var markerMonth = mapMarkers[i].date.substring(5,7);
    var markerDay = mapMarkers[i].date.substring(8,mapMarkers[i].date.length);
    var oldestMarkerYear = oldestMarkerDate.substring(0,4);
    var oldestMarkerMonth = oldestMarkerDate.substring(5,7);
    var oldestMarkerDay = oldestMarkerDate.substring(8,oldestMarkerDate.length);
    var newestMarkerYear = newestMarkerDate.substring(0,4);
    var newestMarkerMonth = newestMarkerDate.substring(5,7);
    var newestMarkerDay = newestMarkerDate.substring(8,newestMarkerDate.length);
    var oldestDate = false;
    var oldestYear = false;
    var oldestMonth = false;
    var oldestDay = false;
    var newestDate = false;
    var newestYear = false;
    var newestMonth = false;
    var newestDay = false;
    if (markerYear <= oldestMarkerYear) {
      oldestYear = true;
    } else if (markerYear >= newestMarkerYear) {
      newestYear = true;
    }
    if (markerMonth <= oldestMarkerMonth) {
      oldestMonth = true;
    } else if (markerMonth >= newestMarkerMonth) {
      newestMonth = true;
    }
    if (markerDay <= oldestMarkerDay) {
      oldestDay = true;
    } else if (markerDay >= newestMarkerDay) {
      newestDay = true;
    }
    if (oldestYear && oldestMonth && oldestDay) {
      oldestMarkerDate = mapMarkers[i].date.toString();
    }
    if (newestYear && newestMonth && newestDay) {
      newestMarkerDate = mapMarkers[i].date.toString();
    }
  }
  oldestMarkerDate = oldestMarkerDate.split('-');
  newestMarkerDate = newestMarkerDate.split('-');
  oldestMarkerDate = new Date(oldestMarkerDate[0],oldestMarkerDate[1],oldestMarkerDate[2]);
  newestMarkerDate = new Date(newestMarkerDate[0],newestMarkerDate[1],newestMarkerDate[2]);
  minMarkerDate = oldestMarkerDate;
  maxMarkerDate = newestMarkerDate;
  if (min !== null) {
    var minDate = min;
    var minMarkerYear = minDate.substring(0,4);
    var minMarkerMonth = minDate.substring(5,7);
    var minMarkerDay = minDate.substring(8,minDate.length);
    minMarkerDate = new Date(parseInt(minMarkerYear),(parseInt(minMarkerMonth)-1),parseInt(minMarkerDay));
  }
  if (max !== null) {
    var maxDate = max;
    var maxMarkerYear = maxDate.substring(0,4);
    var maxMarkerMonth = maxDate.substring(5,7);
    var maxMarkerDay = maxDate.substring(8,maxDate.length);
    maxMarkerDate = new Date(parseInt(maxMarkerYear),(parseInt(maxMarkerMonth)-1),parseInt(maxMarkerDay));
  }
  $('#date_range_slider').dateRangeSlider('values',minMarkerDate,maxMarkerDate);
  $('#date_range_slider').dateRangeSlider('bounds',oldestMarkerDate,newestMarkerDate);
};
GoogleMap.prototype.setupFilterActions = function(map) {
  var googleMap = map;
  $('#date_range_slider').bind('valuesChanged', function(e, data){
    var mapMarkers = googleMap.getMapMarkers();
    var minDate = new Date(data.values.min);
    var maxDate = new Date(data.values.max);
    var oldestMarkerYear = minDate.getFullYear();
    var oldestMarkerMonth = minDate.getMonth();
    var oldestMarkerDay = minDate.getDate();
    var newestMarkerYear = maxDate.getFullYear();
    var newestMarkerMonth = maxDate.getMonth();
    var newestMarkerDay = maxDate.getDate();
    var oldestMarkerMonthString = oldestMarkerMonth + 1;
    var oldestMarkerDayString = oldestMarkerDay;
    if (oldestMarkerMonthString < 10) {
      oldestMarkerMonthString = ('0' + oldestMarkerMonthString).toString();
    }
    if (oldestMarkerDayString < 10) {
      oldestMarkerDayString = ('0' + oldestMarkerDayString).toString();
    }
    var newestMarkerMonthString = newestMarkerMonth + 1;
    var newestMarkerDayString = newestMarkerDay;
    if (newestMarkerMonthString < 10) {
      newestMarkerMonthString = ('0' + newestMarkerMonthString).toString();
    }
    if (newestMarkerDayString < 10) {
      newestMarkerDayString = ('0' + newestMarkerDayString).toString();
    }
    var minDateString = (oldestMarkerYear + '-' + oldestMarkerMonthString + '-' + oldestMarkerDayString).toString();
    var maxDateString = (newestMarkerYear + '-' + newestMarkerMonthString + '-' + newestMarkerDayString).toString();
    for (i = 0; i < mapMarkers.length; i++) {
      var show = false;
      var markerYear = mapMarkers[i].date.substring(0,4);
      var markerMonth = mapMarkers[i].date.substring(5,7);
      var markerDay = mapMarkers[i].date.substring(7,mapMarkers[i].date.length);
      var isInRangeOfOldestDate = false;
      var isInRangeOfNewestDate = false;
      if (parseInt(markerYear) >= parseInt(oldestMarkerYear)) {
        if (parseInt(markerYear) === parseInt(oldestMarkerYear)) {
          if (parseInt(markerMonth) >= parseInt(oldestMarkerMonth)) {
            if (parseInt(markerMonth) === parseInt(oldestMarkerMonth)) {
              if (parseInt(markerDay) >= parseInt(oldestMarkerDay)) {
                isInRangeOfOldestDate = true;
              }
            } else {
              isInRangeOfOldestDate = true;
            }
          }
        } else {
          isInRangeOfOldestDate = true;
        }
      }
      if (parseInt(markerYear) <= parseInt(newestMarkerYear)) {
        if (parseInt(markerYear) === parseInt(newestMarkerYear)) {
          if (parseInt(markerMonth) <= parseInt(newestMarkerMonth)) {
            if (parseInt(markerMonth) === parseInt(newestMarkerMonth)) {
              if (parseInt(markerDay) <= parseInt(newestMarkerDay)) {
                isInRangeOfNewestDate = true;
              }
            } else {
              isInRangeOfNewestDate = true;
            }
          }
        } else {
          isInRangeOfNewestDate = true;
        }
      }
      if (isInRangeOfOldestDate && isInRangeOfNewestDate) {
        show = true;
      }
      if (!show) {
        if (googleMap.getMapMarkerVisibility(i)) {
          googleMap.hideMapMarker(i);
        }
      } else {
        if (!googleMap.getMapMarkerVisibility(i)) {
          googleMap.showMapMarker(i);
        }
      }
    }
    var url = window.location.href;
    var lastSlash = window.location.href.lastIndexOf('/');
    var queryString = '';
    if (lastSlash <= 8) {
      var baseUrl = window.location.href;
      var dateRangeString = (minDateString + '+' + maxDateString).toString();
      dateRangeString = dateRangeString.replace(/[a-z]/gi,'');
      dateRangeString = ('Date-Range=' + dateRangeString);
      window.location.href = baseUrl + '/us/' + dateRangeString;
    } else if (window.location.href.substring((lastSlash + 1),(lastSlash+3)) === 'us') {
      var baseUrl = window.location.href.substring(0,lastSlash+3);
      queryString = window.location.href.substring((lastSlash + 1),window.location.href.length);
      var locationString = '';
      var dateRangeString = '';
      queryString = queryString.split('&');
      if (queryString[0].indexOf('Location=') > -1) {
        locationString = queryString[0].substring(9,queryString[0].length);
      } else if (queryString[0].indexOf('Date-Range=') > -1) {
        dateRangeString = queryString[0].substring(11,queryString[0].length);
      }
      if (queryString.length > 1) {
        if (queryString[1].indexOf('Location=') > -1) {
          locationString = queryString[1].substring(9,queryString[1].length);
        } else if (queryString[1].indexOf('Date-Range=') > -1) {
          dateRangeString = queryString[1].substring(11,queryString[1].length);
        }
      }
      if (locationString === '') {
        locationString = null;
      } else {
        locationString = locationString.replace(/[^a-z0-9+-]+/gi,'');
      }
      if (dateRangeString === '') {
        dateRangeString = null;
      } else {
        dateRangeString = dateRangeString.replace(/[a-z]/gi,'');
      }
      dateRangeString = (minDateString + '+' + maxDateString).toString();
      dateRangeString = dateRangeString.replace(/[a-z]/gi,'');
      dateRangeString = ('Date-Range=' + dateRangeString);
      if (locationString !== null) {
        locationString = ('Location=' + locationString);
      }
      if (locationString !== null) {
        window.location.href = baseUrl + '/' + locationString + '&' + dateRangeString;
      } else {
        window.location.href = baseUrl + '/' + dateRangeString;
      }
    } else {
      var baseUrl = window.location.href.substring(0,lastSlash);
      queryString = window.location.href.substring((lastSlash + 1),window.location.href.length);
      var locationString = '';
      var dateRangeString = '';
      queryString = queryString.split('&');
      if (queryString[0].indexOf('Location=') > -1) {
        locationString = queryString[0].substring(9,queryString[0].length);
      } else if (queryString[0].indexOf('Date-Range=') > -1) {
        dateRangeString = queryString[0].substring(11,queryString[0].length);
      }
      if (queryString.length > 1) {
        if (queryString[1].indexOf('Location=') > -1) {
          locationString = queryString[1].substring(9,queryString[1].length);
        } else if (queryString[1].indexOf('Date-Range=') > -1) {
          dateRangeString = queryString[1].substring(11,queryString[1].length);
        }
      }
      if (locationString === '') {
        locationString = null;
      } else {
        locationString = locationString.replace(/[^a-z0-9+-]+/gi,'');
      }
      if (dateRangeString === '') {
        dateRangeString = null;
      } else {
        dateRangeString = dateRangeString.replace(/[a-z]/gi,'');
      }
      dateRangeString = (minDateString + '+' + maxDateString).toString();
      dateRangeString = dateRangeString.replace(/[a-z]/gi,'');
      dateRangeString = ('Date-Range=' + dateRangeString);
      if (locationString !== null) {
        locationString = ('Location=' + locationString);
      }
      if (locationString !== null) {
        window.location.href = baseUrl + '/' + locationString + '&' + dateRangeString;
      } else {
        window.location.href = baseUrl + '/' + dateRangeString;
      }
    }
  });
  $('#united_states_map_location_input').keyup(function(event){
    if(event.keyCode == 13) {
      var value = $('#united_states_map_location_input').val();
      if (value !== '') {
        var urlAddress = value.replace(/ /g,'+');
        $.ajax({url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+urlAddress+'&key='+googleAPIKey}).done(function(data) {
          if (data.status !== 'ZERO_RESULTS') {
            var latitude = data.results[0].geometry.location.lat;
            var longitude = data.results[0].geometry.location.lng;
            googleMap.map.setCenter(new google.maps.LatLng(latitude,longitude));
            var zoom = 0;
            if (data.results[0].address_components[0].types[0] === 'street_number') {
              zoom = 17;
            } else if (data.results[0].address_components[0].types[0] === 'neighborhood') {
              zoom = 15;
            } else if (data.results[0].address_components[0].types[0] === 'locality') {
              zoom = 11;
            } else if (data.results[0].address_components[0].types[0] === 'administrative_area_level_2') {
              zoom = 9;
            } else if (data.results[0].address_components[0].types[0] === 'administrative_area_level_1') {
              zoom = 7;
            } else if(data.results[0].address_components[0].types[0] === 'country') {
              zoom = 4;
            }
            googleMap.map.setZoom(zoom);
            var url = window.location.href;
            var lastSlash = window.location.href.lastIndexOf('/');
            var queryString = '';
            if (lastSlash <= 8) {
              alert('0');
              locationString = urlAddress.replace(/[^a-z0-9+-]+/gi,'');
              locationString = ('Location=' + locationString);
              window.location.href = baseUrl + locationString;
            } else if (window.location.href.substring((lastSlash + 1),(lastSlash+3)) === 'us') {
              alert('1');
              var baseUrl = window.location.href.substring(0,lastSlash+3);
              queryString = window.location.href.substring((lastSlash + 1),window.location.href.length);
              var locationString = '';
              var dateRangeString = '';
              queryString = queryString.split('&');
              if (queryString[0].indexOf('Location=') > -1) {
                locationString = queryString[0].substring(9,queryString[0].length);
              } else if (queryString[0].indexOf('Date-Range=') > -1) {
                dateRangeString = queryString[0].substring(11,queryString[0].length);
              }
              if (queryString.length > 1) {
                if (queryString[1].indexOf('Location=') > -1) {
                  locationString = queryString[1].substring(9,queryString[1].length);
                } else if (queryString[1].indexOf('Date-Range=') > -1) {
                  dateRangeString = queryString[1].substring(11,queryString[1].length);
                }
              }
              if (locationString === '') {
                locationString = null;
              } else {
                locationString = locationString.replace(/[^a-z0-9+-]+/gi,'');
              }
              if (dateRangeString === '') {
                dateRangeString = null;
              } else {
                dateRangeString = dateRangeString.replace(/[a-z]/gi,'');
              }
              locationString = urlAddress.replace(/[^a-z0-9+-]+/gi,'');
              locationString = ('Location=' + locationString);
              if (dateRangeString !== null) {
                dateRangeString = ('Date-Range=' + dateRangeString);
              }
              if (dateRangeString !== null) {
                window.location.href = baseUrl + '/' + locationString + '&' + dateRangeString;
              } else {
                window.location.href = baseUrl + '/' + locationString;
              }
            } else {
              alert('2');
              var baseUrl = window.location.href.substring(0,lastSlash - 3);
              queryString = window.location.href.substring((lastSlash + 1),window.location.href.length);
              var locationString = '';
              var dateRangeString = '';
              queryString = queryString.split('&');
              if (queryString[0].indexOf('Location=') > -1) {
                locationString = queryString[0].substring(9,queryString[0].length);
              } else if (queryString[0].indexOf('Date-Range=') > -1) {
                dateRangeString = queryString[0].substring(11,queryString[0].length);
              }
              if (queryString.length > 1) {
                if (queryString[1].indexOf('Location=') > -1) {
                  locationString = queryString[1].substring(9,queryString[1].length);
                } else if (queryString[1].indexOf('Date-Range=') > -1) {
                  dateRangeString = queryString[1].substring(11,queryString[1].length);
                }
              }
              if (locationString === '') {
                locationString = null;
              } else {
                locationString = locationString.replace(/[^a-z0-9+-]+/gi,'');
              }
              if (dateRangeString === '') {
                dateRangeString = null;
              } else {
                dateRangeString = dateRangeString.replace(/[a-z]/gi,'');
              }
              locationString = urlAddress.replace(/[^a-z0-9+-]+/gi,'');
              alert('Location: '+locationString);
              locationString = ('Location=' + locationString);
              if (dateRangeString !== null) {
                dateRangeString = ('Date-Range=' + dateRangeString);
              }
              if (dateRangeString !== null) {
                window.location.href = baseUrl + '/us/' + locationString + '&' + dateRangeString;
              } else {
                window.location.href = baseUrl + '/us/' + locationString;
              }
            }
          }
        });
      }
    }
  });
};
GoogleMap.prototype.refresh = function() {
  google.maps.event.trigger(this.map, 'resize');
  this.map.setZoom(4);
  this.map.setCenter(new google.maps.LatLng(37.09024,-95.712891));
};
GoogleMap.prototype.centerMapOnAddress = function(address) {
  if (address !== '') {
    var urlAddress = address.replace(/ /g,'+');
    $.ajax({async: false, url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+urlAddress+'&key='+googleAPIKey}).done(function(data) {
      if (data.status !== 'ZERO_RESULTS') {
        var latitude = data.results[0].geometry.location.lat;
        var longitude = data.results[0].geometry.location.lng;
        this.map.setCenter(new google.maps.LatLng(latitude,longitude));
        var zoom = 0;
        if (data.results[0].address_components[0].types[0] === 'street_number') {
          zoom = 17;
        } else if (data.results[0].address_components[0].types[0] === 'neighborhood') {
          zoom = 15;
        } else if (data.results[0].address_components[0].types[0] === 'locality') {
          zoom = 11;
        } else if (data.results[0].address_components[0].types[0] === 'administrative_area_level_2') {
          zoom = 9;
        } else if (data.results[0].address_components[0].types[0] === 'administrative_area_level_1') {
          zoom = 7;
        } else if(data.results[0].address_components[0].types[0] === 'country') {
          zoom = 4;
        }
        this.map.setZoom(zoom);
      }
    });
  }
};
