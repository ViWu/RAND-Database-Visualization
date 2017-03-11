var svg = d3.select("#chart1");

var path = d3.geoPath();

d3.json("us-10m.v1.json", function(error, us) {
  if (error) throw error;

  svg.append("g")
      .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path);

  svg.append("path")
      .attr("class", "state-borders")
      .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));


d3.csv("mapCondensed.csv", function(error, data) {
  if (error) throw error;



  svg.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", function(d) {
		return d.X;
	})
	.attr("cy", function(d) {
		return d.Y;
	})
	.attr("r", function(d) {
		return 8;
	})
		.style("fill", "gray")	
		.style("opacity", 0.75)	


	//tooltip
	  svg.selectAll("circle").append("svg:title")
        .text(function(d) { 
                return ( "City: "+ d.City + ", Fatalities: " + d.Fatalities + ", Injuries: " + d.Injuries); 
        });


});


});









    






