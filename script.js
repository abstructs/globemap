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
      .scale(height / Math.PI)
      .translate([width / 2, height / 2]);

  var path = d3.geoPath()
      .projection(projection);

  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

d3.json('https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json', function(err, json) {
  if (err) throw err;
  svg.append('g').selectAll('path')
    .data(topojson.feature(json, json.objects.countries).features)
    .enter()
    .append('path')
    .attr('fill', 'black')
    .style('stroke-width', .2)
    .attr('stroke', 'red')
    .attr('d', path)
    d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json', function(error, data) {
      if (error) throw error;
      var dataScale = d3.scaleLinear()
          .domain([0, 23000000])
          .range([1, 50]);
      var rScale = d3.scaleLinear()
          .domain([1, 50])
          .range([5, 55]);

      svg.append('g').selectAll('circle')
      .data(data.features)
      .enter()
      .append('circle')
      .attr('r', function(d){
        if (d.properties.mass !== null) {
          return dataScale(d.properties.mass)
        }
      })
      .attr('cx', function(d){
        if (d.geometry !== null) {
          return projection(d.geometry.coordinates)[0]; // x
        }
      })
      .attr('cy', function(d){
        if (d.geometry !== null) {
          return projection(d.geometry.coordinates)[1]; // y
        }
      })
      .attr('fill', 'red')
      .style('stroke-width', .2)
      .attr('stroke', 'black')
      .attr('d', path)
      .on('mouseover', function(d){
        d3.select(this).attr('r', function(d){ return rScale(this.getAttribute('r')) })
        d3.select(this).attr('fill', '#3399ff')
        d3.select(this).style('stroke-width', 1)

        div.transition()
            .duration(200)
            .style("opacity", .9);
            div.html('Name: ' + d.properties.name + '</br>' +
                     'Mass: ' + d.properties.mass + '</br>' +
                     'Longitude: ' + d.geometry.coordinates[0] + '</br>' +
                     'Latitude: ' + d.geometry.coordinates[1]
            )
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 20) + "px");

      })
      .on('mouseout', function(){
        d3.select(this).attr('r', function(d){ return dataScale(d.properties.mass) })
        d3.select(this).attr('fill', 'red')
        d3.select(this).style('stroke-width', .2)

        div.transition()
            .duration(500)
            .style("opacity", 0);
      });
    });
  });
}
$(function(){
  main();
})
