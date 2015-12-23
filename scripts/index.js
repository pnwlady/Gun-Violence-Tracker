var index = {};

index.modal = function() {
  $('.container.takeActionModal').hide();
  $('.container.textOver').fadeIn();
  $('.overlay').fadeIn(1000);
  $('#topLayerText').show();
  // $('#US').addClass('active');
  // $('#US').siblings().removeClass('active');
};

index.googleMap = function() {
  $('.container.textOver').hide();
  $('.container.takeActionModal').hide();
  $('.overlay').fadeOut(1000);

  $('#imap').hide();

  $('#US').addClass('active');
  $('#US').siblings().removeClass('active');
  $('#imap').empty();

  if(index.gMap) {
    index.gMap.render();
  } else {
    index.gMap = new GoogleMap();
  }
};



index.intlMap = function() {
  $('.container.textOver').hide();
  $('.container.takeActionModal').hide();
  $('.overlay').fadeOut(1000);
  $('#gmap').hide();

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

  $('#inter').addClass('active');
  $('#inter').siblings().removeClass('active');
  $('#gmap').empty();
};

index.takeAction = function() {
  $('.container.textOver').hide();
  $('.container.takeActionModal').fadeIn();
  $('.overlay').fadeIn(1000);
  $('#topLayerText').show();
  $('#takeAction').addClass('active');
  $('#takeAction').siblings().removeClass('active');
};

$(function() {
  index.gMap = new GoogleMap();
  index.iMap = new IntlMap();
  $('#continue').on('click', function(event){
    event.preventDefault();
    $('.container.textOver').hide();
    $('.overlay').fadeOut(1000);
    $('#US').addClass('active');
  });
  $('div.overlay').on('click', function(event){
    event.preventDefault();
    $('#topLayerText').hide();
    $('.overlay').fadeOut(1000);
    // $('#US').addClass('active');
  });
  $('#returnToMap').on('click', function(event){
    event.preventDefault();
    $('.container.takeActionModal').hide();
    $('.overlay').fadeOut(1000);
  });
});
