var index = {};
localStorage.setItem('currentMap', '#gmap');

index.chooseActiveMap = function(){
  var currentMap = localStorage.getItem('currentMap');
  if(currentMap === '#gmap'){
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

index.googleMap = function() {
  localStorage.setItem('currentMap', '#gmap');
  $('#topLayerText').hide();
  $('#imap').hide();
  $('#gmap').show();
  $('.overlay').fadeOut(1000);
  index.chooseActiveMap();

  if(index.gMap) {
    index.gMap.render();
  } else {
    index.gMap = new GoogleMap();
  }
};



index.intlMap = function() {
  localStorage.setItem('currentMap', '#imap');
  $('#topLayerText').hide();
  $('#gmap').hide();
  $('#imap').show();
  $('.overlay').fadeOut(1000);
  index.chooseActiveMap();

  $.getJSON('data/intlData.json', function(data) {
    var arr = [['location_name', 'mean']];

    data.forEach(function(element) {
      // if(element['location_name'] != 'null') {
      //   arr.push([{v:element['ISO code'], f:element['Country/Territory']}, Number(element['% of homicides by firearm'])]);
      // } else {
      //   arr.push([{v:element['ISO code'], f:element['Country/Territory']}, undefined]);
      // }
      if(element['unit'] == 'rate per 100,000')
        arr.push([element['location_name'], Number(element['mean'])]);
    });

    index.iMap.render(google.visualization.arrayToDataTable(arr));
  });
};

index.takeAction = function() {
  $('#topLayerText').show();
  $('.container.textOver').hide();
  $('.container.takeActionModal').fadeIn();
  $('.overlay').fadeIn(1000);
  $('#takeAction').addClass('active');
  $('#takeAction').siblings().removeClass('active');
};

$(function() {
  index.gMap = new GoogleMap();
  index.iMap = new IntlMap();

  $('#continue').on('click', index.removeText);

  $('div.overlay').on('click', index.removeText);

  $('#returnToMap').on('click', index.removeText);
});
