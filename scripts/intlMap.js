// World Map Model

IntlMap = function() {
  this.options = {
    colorAxis: {colors: ['#BABABA', '#FF0000']},
    backgroundColor: '#81d4fa',
    datalessRegionColor: '#f5f5f5',
    defaultColor: '#f5f5f5'
  };
};

IntlMap.prototype.model = function() {

};

IntlMap.prototype.view = function() {

};

IntlMap.prototype.controller = function() {

};

IntlMap.prototype.render = function(data) {
  var chart = new google.visualization.GeoChart($('#imap')[0]);
  chart.draw(data, this.options);
};
