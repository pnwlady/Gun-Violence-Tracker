var index = {};

index.modal = function() {
  $('.container.textOver').fadeIn();
  $('.overlay').fadeIn(1000);
};

index.googleMap = function() {
  $('#imap').empty();
  if(index.gMap) {
    index.gMap.render();
  } else {
    index.gMap = new GoogleMap();
  }
};

index.intlMap = function() {
  $('#gmap').empty();
};

index.takeAction = function() {
  $('#takeActionModal').modal('show');
};

$(function() {
  index.gMap = new GoogleMap();
  $('#continue').on('click', function(event){
    event.preventDefault();
    $('.container.textOver').hide();
    $('.overlay').fadeOut(1000);
  });


});
