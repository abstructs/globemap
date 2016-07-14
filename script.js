var createMap = function() {

}

var main = function() {
  var margin = {top: 30, bottom: 30, left: 30, right: 30},
  height = 800 - margin.top - margin.bottom,
  width = 1100 - margin.right - margin.left;

  var svg = d3.select('body').append('svg');

  svg.attr('height', height).attr('width', width);

  var projection = d3.geoEquirectangular()
      .scale(height / Math.PI)
      .translate([width / 2, height / 2]);

  var path = d3.geoPath()
      .projection(projection);

var graticule = d3.geoGraticule();

d3.json('https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json', function(json) {
  svg.selectAll('path')
    .data(topojson.feature(json, json.objects.countries).features)
    .enter()
    .append('path')
    .attr('fill', 'black')
    .attr('d', path)
  });

  d3.json('./meteorite-strike-data.json', function(error, data) {
    if (error) throw error;
  });
}
$(function(){
  main();
})
