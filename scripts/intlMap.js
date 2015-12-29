// World Map Model
IntlMap = function() {
  this.options = {
    colorAxis: {colors: ['#BABABA', '#AA0000', '#BB0000', '#CC0000', '#DD0000', '#EE0000', '#FF0000']},
    backgroundColor: '#81d4fa',
    datalessRegionColor: '#f5f5f5',
    defaultColor: '#f5f5f5'
  };
  this.filters = ['rate per 100,000', 'number'];
  this.currentFilter = 0;
  $.getJSON('data/intlData.json', function(data) {
    var arr = [['location_name', 'mean']];
    var arr2 = [['location_name', 'mean']];
    var options = {
      colorAxis: {colors: ['#BABABA', '#AA0000', '#BB0000', '#CC0000', '#DD0000', '#EE0000', '#FF0000']},
      backgroundColor: '#81d4fa',
      datalessRegionColor: '#f5f5f5',
      defaultColor: '#f5f5f5'
    };
    data.forEach(function(element) {
      if(element['unit'] == 'rate per 100,000')
        arr.push([element['location_name'], Number(element['mean'])]);
      if(element['unit'] == 'number')
        arr2.push([element['location_name'], Number(element['mean'])]);
    });
    var chart = new google.visualization.GeoChart($('#imap')[0]);
    var chart2 = new google.visualization.GeoChart($('#imap2')[0]);
    chart.draw(google.visualization.arrayToDataTable(arr), options);
    chart2.draw(google.visualization.arrayToDataTable(arr2), options);
  });
};
IntlMap.prototype.changeFilter = function() {
  this.currentFilter = (this.currentFilter + 1) % 2;
};
IntlMap.prototype.render = function() {
  $('#toggleText').text('Map filtered by: ' + this.filters[this.currentFilter]);
  if(this.currentFilter) {
    $('#imap').hide();
    $('#imap2').show();
    $('#filterRate').hide();
    $('#filterNum').show();
  } else {
    $('#imap').show();
    $('#imap2').hide();
    $('#filterRate').show();
    $('#filterNum').hide();
  }
};
