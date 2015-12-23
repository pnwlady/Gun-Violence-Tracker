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
};

IntlMap.prototype.changeFilter = function() {
  this.currentFilter = (this.currentFilter + 1) % 2;
};

IntlMap.prototype.render = function(data) {
  $('#toggleText').text('Filter by: ' + this.filters[this.currentFilter]);
  var chart = new google.visualization.GeoChart($('#imap')[0]);
  chart.draw(data, this.options);
};
