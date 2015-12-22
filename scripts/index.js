var index = {};

index.modal = function() {
  $('#modal').modal('show');
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

  var data = {
    modalName: '',
    modalLabel: '',
    title: '',
    body: ''
  };
  $.get('templates/modal.html').done(function(template) {
    var compiledTemplate = Handlebars.compile(template);
    var html = compiledTemplate(data);
    $('#modal').append(html);
  });

});
