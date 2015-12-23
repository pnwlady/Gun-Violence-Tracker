// World Map Model

IntlMap = function() {
  this.options = {
    colorAxis: {colors: ['#BABABA', '#AA0000', '#BB0000', '#CC0000', '#DD0000', '#EE0000', '#FF0000']},
    backgroundColor: '#81d4fa',
    datalessRegionColor: '#f5f5f5',
    defaultColor: '#f5f5f5'
  };
};

IntlMap.prototype.render = function(data) {
  var chart = new google.visualization.GeoChart($('#imap')[0]);
  chart.draw(data, this.options);
};
