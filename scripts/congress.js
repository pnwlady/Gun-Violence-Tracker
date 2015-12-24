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
    console.log(cleanData.state);
    console.log(cleanData.contactInfo);
  });
};

$.getJSON('data/congress.json', function (data) {
  cleanData.contactInfo = data;
}).done(getState);






// $.getJSON("data/congress.json", function(data, message, xhr) {
//   var items = [];
// })
//   .each(data, function (key, value) {
//     items.push("<option id='" + key + "'>" + value + "</option>")
//   })
//
//
//
//   .done(function() {
//     congress.data.object.forEach(function(congressPerson) {
//       //retrieve sortname state abbrv. from filter
//       if (congressPerson.sortname.search(/HI/) = 0) {
//         console.log(congressPerson.sortname);
//       };
//     });
//   });
//
//
//
// //import state names and abbreviation from json
// congress.importStates = function() {
//   var rawDataCache = localStorage.getItem('raw-data');
//   rawDataCache.append
// }
//
// congress.stateFilterOptions = function () {
//   for (var = i; congress.data.length; i++) {
//     var currentState = states.data[i].name;
//     var $popState = ('#filterByState').clone();
//     $popState.removeAttr('id').text(currentState);
//     ('#state').append($popState)
//   }
// }
//
// congress.stateFilterSelect = function () {
//   //dropdown filtering trigger here
//   $('select[id="states"]').change(function() {
//     $('#states').find('option:first').attr('selected', 'selected');
//   })
// }
//
//
//
//   $.getJSON("data/states.json", function(data, message, xhr) {
//     states.data = data;
//   })
//     .done(function (callback) {
//       callback
//     }
// };
