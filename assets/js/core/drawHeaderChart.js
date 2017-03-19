function drawTotalKill(){

    var margin = {top: 10, right: 20, bottom: 10, left: 40},
    width = 910 - margin.left - margin.right,
    height = 120 - margin.top - margin.bottom;

    var x = d3.scale.linear()
    .domain([1971, 2013])
    .range([0, width-margin.left-margin.right-40]);


    var y = d3.scale.log()
    .domain([470, 11952])
    .range([5, height]);

    var totalCanvas = d3.select(".page-header").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    d3.csv("data/sumTable.csv", function(error, data) {


    totalCanvas.selectAll("bar")
    .data(data)
    .enter().append("rect")
    .style("fill", "#262900")
    .attr("x", function(d) { return x(d.Year) + 90; })
    .attr("width", 10)
    .attr("y", function(d) { return height - y(d.Totals - 40); })
    .attr("height", function(d) { return y(d.Totals); })
    .on("mouseover", function(d) {
      
          var coordinates = [0, 0];
          coordinates = d3.mouse(this);   // Get the mouse positions to show tooltip at.
            
          var xPosition = coordinates[0];
          var yPosition = coordinates[1];
           
          d3.select("#tooltip4")
                .style('left', xPosition + 'px')
                .style('top', yPosition + 'px')
                .text("Total Attacks: " + d.Totals + " | Year: " + d.Year);
            
  
          d3.select("#tooltip4").classed("hidden", false);
    })
  
    .on("mouseout", function() {
            d3.select("#tooltip4").classed("hidden", true);
    });

  
  }); 


}