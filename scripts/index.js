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
