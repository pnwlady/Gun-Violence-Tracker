var index = {};

index.modal = function() {
  $('.container.textOver').fadeIn();
  $('.overlay').fadeIn(1000);
};

index.unitedStatesMap = function() {
  $('#international_map').hide();
  $('#united_states_map').show();
  $('#united_states_map_filters').show();
};
index.internationalMap = function() {
  $('#international_map').show();
  $('#united_states_map').hide();
  $('#united_states_map_filters').hide();
};
index.takeAction = function() {
  $('#takeActionModal').modal('show');
  $('#international_map').hide();
  $('#united_states_map').hide();
  $('#united_states_map_filters').hide();
};
$(function() {
  index.unitedStatesGoogleMap = new GoogleMap('united_states_map','../data/gunViolenceArchive.json');
  $('#continue').on('click', function(event){
    event.preventDefault;
    $('.container.textOver').hide();
    $('.overlay').fadeOut(1000);
  });
});
