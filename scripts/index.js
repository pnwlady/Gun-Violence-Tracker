var index = {};

index.modal = function() {
  $('.container.takeActionModal').hide();
  $('.container.textOver').fadeIn();
  $('.overlay').fadeIn(1000);
};

index.googleMap = function() {
  $('.container.textOver').hide();
  $('.container.takeActionModal').hide();
  $('.overlay').fadeOut(1000);
  $('#imap').hide();
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

  $.getJSON('data/internationalData.json', function(data) {
    var arr = [['ISO code', 'Average firearms per 100 people']];

    data.forEach(function(element) {
      if(element['Average firearms per 100 people'] != 'null') {
        arr.push([{v:element['ISO code'], f:element['Country/Territory']}, Number(element['Average firearms per 100 people'])]);
      } else {
        arr.push([{v:element['ISO code'], f:element['Country/Territory']}, undefined]);
      }
    });

    index.iMap.render(google.visualization.arrayToDataTable(arr));
  });

};

index.takeAction = function() {
  $('.container.textOver').hide();
  $('.container.takeActionModal').fadeIn();
  $('.overlay').fadeIn(1000);
};

$(function() {
  index.gMap = new GoogleMap();
  index.iMap = new IntlMap();
  $('#continue').on('click', function(event){
    event.preventDefault();
    $('.container.textOver').hide();
    $('.overlay').fadeOut(1000);
  });
  $('#returnToMap').on('click', function(event){
    event.preventDefault();
    $('.container.takeActionModal').hide();
    $('.overlay').fadeOut(1000);
  });
});
