var createMap = function() {

}

var main = function() {
  var margin = {top: 30, bottom: 30, left: 30, right: 30},
  height = 800 - margin.top - margin.bottom,
  width = 1300 - margin.right - margin.left;

  var svg = d3.select("body")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .call(d3.zoom().on("zoom", function () {
      svg.attr("transform", "translate(" + d3.event.transform.x + ", " + d3.event.transform.y + ")" + " scale(" + d3.event.transform.k + ")")
    }))
    .append('g')

  var projection = d3.geoMercator()
      .scale(height / 3.14)
      .translate([width / 2, height / 2]);

  var path = d3.geoPath()
      .projection(projection);

d3.json('https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json', function(json) {
  svg.append('g').selectAll('path')
    .data(topojson.feature(json, json.objects.countries).features)
    .enter()
    .append('path')
    .attr('fill', 'black')
    .attr('d', path)
    d3.json('./meteorite-strike-data.json', function(error, data) {
      if (error) throw error;
      svg.append('g').selectAll('path')
      .data(data.features)
      .enter()
      .append('path')
      .attr('fill', 'red')
      .style('stroke-width', -1)
      .attr('d', path)
    });
  });
}
$(function(){
  main();
})
