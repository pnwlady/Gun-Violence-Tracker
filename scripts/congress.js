var cleanData = {};
cleanData.contactInfo = [];
cleanData.state = [];

var filter = function (stateAbbrv) {
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
    filter(stateName);
  });
};

var getState = function () {
  $.getJSON('data/states.json', function (data) {
    cleanData.state = data;
    replaceState();
    fillDataBase();
    $('input.typeahead').typeahead({
      source: cleanData.state
    });
  });
};

$.getJSON('data/congress.json', function (data) {
  cleanData.contactInfo = data;
}).done(getState);

function fillStateAbrreviations (results) {
  if(results.length <= 0){
    cleanData.state.forEach(function(object) {
      webDB.execute([{
        'sql': 'INSERT INTO stateAbbreviations (name, abbreviation) VALUES (?, ?);',
        'data': [object.name, object.abbreviation],
      }]);
    });
  };
};

var fillContactInfo = function (results) {
  if(results.length <= 0){
    cleanData.contactInfo.forEach(function(object) {
      webDB.execute([{
        'sql': 'INSERT INTO congressContact (sortname, firstname, lastname, link) VALUES (?, ?, ?, ?);',
        'data': [object.sortname, object.firstname, object.lastname, object.link]
      }]);
    });
  };
};

var fillDataBase = function () {
  webDB.execute('SELECT * FROM congressContact;', function(results) {
    fillContactInfo(results);
  });
  webDB.execute('SELECT * FROM stateAbbreviations;', function(results) {
    fillStateAbrreviations(results);
  });
};

var getSenator = function () {
  var state = $('#statesTypeahead').val();
  webDB.execute(
    'SELECT sortname, firstname, lastname, link FROM congressContact INNER JOIN stateAbbreviations ON abbreviation = sortname WHERE name = "' + state + '";',
    function(rows) {
      // on success
      var senatorArray = rows;
      senatorArray.forEach(function (cE, index, array){
        $('.senators').append("<a class='senatorContact' href='" + array[index].link + "' target='_blank'>" + array[index].firstname +" " + array[index].lastname + "</a>");
      });
    });
};
