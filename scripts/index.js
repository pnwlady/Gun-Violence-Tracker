var index = {};
localStorage.setItem('currentMap', '#united_states_map');
index.chooseActiveMap = function(){
  var currentMap = localStorage.getItem('currentMap');
  if(currentMap === '#united_states_map'){
    $('#US').addClass('active').siblings().removeClass('active');
  }
  else {
    $('#inter').addClass('active').siblings().removeClass('active');
  }
};
index.removeText = function(event) {
  event.preventDefault();
  $('#topLayerText').hide();
  $('.overlay').fadeOut(1000);
  index.chooseActiveMap();
};
index.modal = function() {
  $('#topLayerText').show();
  $('.container.takeActionModal').hide();
  $('.container.textOver').fadeIn();
  $('.overlay').fadeIn(1000);
};
index.unitedStatesMap = function() {
  localStorage.setItem('currentMap', '#united_states_map');
  $('#topLayerText').hide();
  $('#imap').hide();
  $('.intlMapToggle').hide();
  $('#united_states_map').show();
  $('#united_states_map_filters').show();
  $('.overlay').fadeOut(1000);
  index.chooseActiveMap();
  var parameters = [null,null,null];
  if (index.unitedStatesGoogleMap === undefined) {
    index.unitedStatesGoogleMap = new GoogleMap('united_states_map','../data/gunViolenceArchive.json',parameters);
  } else {
    index.unitedStatesGoogleMap.refresh();
    index.unitedStatesGoogleMap.setupDateFilter(null,null);
    index.unitedStatesGoogleMap.centerMapOnAddress('United+States');
  }
};
index.unitedStatesSpecificMap = function() {
  localStorage.setItem('currentMap', '#united_states_map');
  $('#topLayerText').hide();
  $('#imap').hide();
  $('.intlMapToggle').hide();
  $('#united_states_map').show();
  $('#united_states_map_filters').show();
  $('.overlay').fadeOut(1000);
  var lastSlash = window.location.href.lastIndexOf('/');
  var queryString = window.location.href.substring((lastSlash + 1),window.location.href.length);
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
  var centeredMapAddress = locationString;
  var markerDates = '';
  if (dateRangeString !== null) {
    markerDates = dateRangeString.split('+');
  }
  var markerMinDate = '';
  var markerMaxDate = '';
  if (markerDates.length === 2) {
    markerMinDate = markerDates[0].split('-');
    markerMaxDate = markerDates[1].split('-');
  }
  for (i = 0; i < markerMinDate.length; i++) {
    markerMinDate[i] = markerMinDate[i].replace(/\W+/g,'');
  }
  for (i = 0; i < markerMaxDate.length; i++) {
    markerMaxDate[i] = markerMaxDate[i].replace(/\W+/g,'');
  }
  if (markerMinDate.length !== 3) {
    markerMinDate = null;
  }
  if (markerMaxDate.length !== 3) {
    markerMaxDate = null;
  }
  if (markerMinDate !== null) {
    markerMinDate = (markerMinDate[0]+'-'+markerMinDate[1]+'-'+markerMinDate[2]).toString();
  }
  if (markerMaxDate !== null) {
    markerMaxDate = (markerMaxDate[0]+'-'+markerMaxDate[1]+'-'+markerMaxDate[2]).toString();
  }
  var parameters = [centeredMapAddress,markerMinDate,markerMaxDate];
  index.chooseActiveMap();
  if (index.unitedStatesGoogleMap === undefined) {
    index.unitedStatesGoogleMap = new GoogleMap('united_states_map','../data/gunViolenceArchive.json',parameters);
    index.unitedStatesGoogleMap.centerMapOnAddress(parameters[0]);
  } else {
    index.unitedStatesGoogleMap.refresh();
    index.unitedStatesGoogleMap.setupDateFilter(parameters[1],parameters[2]);
    index.unitedStatesGoogleMap.centerMapOnAddress(parameters[0]);
  }
};
index.iMapChange = function() {
  index.iMap.changeFilter();
  $.getJSON('data/intlData.json', function(data) {
    var arr = [['location_name', 'mean']];
    data.forEach(function(element) {
      if(element['unit'] == index.iMap.filters[index.iMap.currentFilter])
        arr.push([element['location_name'], Number(element['mean'])]);
    });
    index.iMap.render(google.visualization.arrayToDataTable(arr));
  });
};
index.internationalMap = function() {
  localStorage.setItem('currentMap', '#imap');
  $('#topLayerText').hide();
  $('#united_states_map').hide();
  $('#united_states_map_filters').hide();
  $('#imap').show();
  $('.intlMapToggle').show();
  $('.overlay').fadeOut(1000);
  index.chooseActiveMap();
  $.getJSON('data/intlData.json', function(data) {
    var arr = [['location_name', index.iMap.filters[index.iMap.currentFilter]]];
    data.forEach(function(element) {
      if(element['unit'] == index.iMap.filters[index.iMap.currentFilter])
        arr.push([element['location_name'], Number(element['mean'])]);
    });
    index.iMap.render(google.visualization.arrayToDataTable(arr));
  });
};
index.takeAction = function() {
  $('#takeActionModal').modal('show');
  $('#topLayerText').show();
  $('.container.textOver').hide();
  $('.container.takeActionModal').fadeIn();
  $('.overlay').fadeIn(1000);
  $('#takeAction').addClass('active');
  $('#takeAction').siblings().removeClass('active');
};
$(function() {
  index.iMap = new IntlMap();
  $('#continue').on('click', index.removeText);
  $('div.overlay').on('click', index.removeText);
  $('#returnToMap').on('click', index.removeText);
});
