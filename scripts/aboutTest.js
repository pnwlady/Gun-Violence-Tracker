congress = {};
states = {};

congress.stateFilterOptions = function () {
  for (var = i; states.data.length; i++) {
    var currentState = states.data[i].name;
    var $popState = ('#filterByState').clone();
    $popState.removeAttr('id').text(currentState);
    ('#state').append($popState)
  }
}

congress.stateFilterSelect = function () {
  //dropdown filtering trigger here
}

$.getJSON("data/congress.json", function(data, message, xhr) {
  congress.data = data;
})
  .done(function() {
    congress.data.object.forEach(function(congressPerson) {
      //retrieve sortname state abbrv. from filter
      if (congressPerson.sortname.search(/HI/) = 0) {
        console.log(congressPerson.sortname);
      };
    });
  });

  $.getJSON("data/states.json", function(data, message, xhr) {
    states.data = data;
  })
    .done(function (callback) {
      callback
    }
