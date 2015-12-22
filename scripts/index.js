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
  $('#gmap').empty();
};

index.takeAction = function() {
  $('.container.textOver').hide();
  $('.container.takeActionModal').fadeIn();
  $('.overlay').fadeIn(1000);
};

$(function() {
  index.gMap = new GoogleMap();
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
