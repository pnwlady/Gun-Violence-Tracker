$(function() {
  var googleMap = new GoogleMap();

  $('#continue').on('click', function(event){
    event.preventDefault();
    $('.container.textOver').hide();
    $('.overlay').fadeOut(1000);
  });

});
