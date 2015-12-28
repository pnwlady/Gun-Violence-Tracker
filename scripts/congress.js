var cleanData = {};
cleanData.contactInfo = [];
cleanData.state = [];

var filter = function (stateAbbrv) {
  //to string or not to string?
  var abbreviation = stateAbbrv;
  var searchRegex = new RegExp(abbreviation);
  cleanData.contactInfo.forEach(function(cV, index, cdArray) {
    var resultArray = (cdArray[index].sortname).match(searchRegex);
    if (resultArray) {
      cdArray[index].sortname = stateAbbrv;
    }
  });
};

var replaceState = function() {
  cleanData.state.forEach(function(currentValue, index, cdsArray) {
    var stateName = cdsArray[index].abbreviation;
    // console.log("this is statename " + stateName);
    filter(stateName);
  });
};

var getState = function () {
  $.getJSON('data/states.json', function (data) {
    cleanData.state = data;
    replaceState();
    fillStateAbrreviations();
    fillContactInfo();
    $('input.typeahead').typeahead({
      source: cleanData.state
    });
  });
};

$.getJSON('data/congress.json', function (data) {
  cleanData.contactInfo = data;
}).done(getState);

function fillStateAbrreviations () {
  cleanData.state.forEach(function(object) {
    webDB.execute([{
      'sql': 'INSERT INTO stateAbbreviations (name, abbreviation) VALUES (?, ?);',
      'data': [object.name, object.abbreviation],
    }]);
  });
};

var fillContactInfo = function  () {
  cleanData.contactInfo.forEach(function(object) {
    webDB.execute([{
      'sql': 'INSERT INTO congressContact (sortname, firstname, lastname, link) VALUES (?, ?, ?, ?);',
      'data': [object.sortname, object.firstname, object.lastname, object.link]
    }]);
  });
};
