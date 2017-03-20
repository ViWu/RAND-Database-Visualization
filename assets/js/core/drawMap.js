
function drawMap(margin,projection){


  var svg = d3.select(".margin-b-2").append("svg")
      .attr("width", 750)
      .attr("height", 450)
      .call(d3.behavior.zoom().on("zoom", redraw));

  var path = d3.geo.path()
      .projection(projection);

  var g = svg.append("g")
  		.attr("transform", "translate(" + (-50) + "," + (-50) + ")");

// load and display the World
  d3.json("data/world-110m2.json", function(error, dataset) {

      var countries=topojson.object(dataset, dataset.objects.countries).geometries;
      d3.tsv("data/world-country-names.tsv",function(error,name){
          var names=name;
          countries.forEach(function(d) {
          d.name = names.filter(function(n) { return d.id == n.id; })[0].name;
    });

	// ocean
	g.append( "rect" )
	.attr("width",750)
	.attr("height",450)
	.attr("transform", "translate(" + (50) + "," + (50) + ")")
	  .attr("fill","#9fcdcd")
	  .attr("opacity",100)
	  .on("mouseover",function(){
		hoverData = null;
		if ( probe ) probe.style("display","none");
	});

      g.selectAll("path")
      .data(countries)
      .enter()
      .append("path")
      .attr("class","country")
      .attr("d", path)
      .on("mouseover", function(d) {
          var coordinates = [0, 0];
          coordinates = d3.mouse(this);   // Get the mouse positions to show tooltip at.
          var xPosition = coordinates[0];
          var yPosition = coordinates[1];

          d3.select("#tooltip")
            .style('left', xPosition + 'px')
            .style('top', yPosition + 'px')
            .html("<b>"+d.name+"</b>");

          d3.select("#tooltip").classed("hidden", false);
      })
      .on("mouseout", function() {
            d3.select("#tooltip").classed("hidden", true);

      });



     d3.csv("data/attackData.csv",function(error,data){

           terror_year=data;

            for(var i=0;i<terror_year.length;i++)
            {
                if(terror_year[i].iyear=="1970")
                {
                filteredArrayByYear[i]=terror_year[i];

                }
            }

            drawPanel(true);

            g.selectAll("circle")
               .data(filteredArrayByYear)
               .enter()
               .append("circle")
               .attr("class","loc")
               .attr("cx", function(d) {
                           return projection([d.longitude, d.latitude])[0];
                   })
                   .attr("cy", function(d) {
                           return projection([d.longitude, d.latitude])[1];
                   })
              .attr("r", 5)
              .style("fill", function(d){
				  if(d.weaptype1_txt == "Biological"){
					  return "#00b2e4"; // blue
				  }
				  else if(d.weaptype1_txt  == "Chemical"){
					  return "#ff8800"; // orange
				  }
				  else if(d.weaptype1_txt  == "Explosives/Bombs/Dynamite"){
					  return "#ff3f4f"; // red
				  }
				  else if(d.weaptype1_txt  == "Fake Weapons"){
					  return "#61d04f"; // green// red
				  }
				  else if(d.weaptype1_txt  == "Fire Arms"){
					  return "#da36d7"; // purple
				  }
				  else if(d.weaptype1_txt  == "Incendiary"){
					  return "#f0ee2e"; //yellow
				  }
				  else if(d.weaptype1_txt  == "Melee"){
					  return "#05da9e"; // aqua
				  }
				  else if(d.weaptype1_txt  == "Hostage Taking"){
					  return "white"; // white unused
				  }
				  else {
					  return "#ff7af0"; // pink
				  }
			  })
            .style("stroke","black")
            .style("stroke-width","0.3")
            .on("mouseover", function(d) {

                var coordinates = [0, 0];
                coordinates = d3.mouse(this);   // Get the mouse positions to show tooltip at.

                var xPosition = coordinates[0]+20;
                var yPosition = coordinates[1]+20;


                d3.select(this).attr("r",7);

                d3.select("#tooltip2")
                    .style('left', xPosition + 'px')
                    .style('top', yPosition + 'px')
                    .html("Location: "+d.city+"<br>Target: "+d.targsubtype1_txt+"<br>Attack Type: "+d.attacktype1_txt + "<br>Group: " + d.gname
                    	+ "<br>Weapon Type: " + d.weaptype1_txt );

                d3.select("#tooltip2").classed("hidden", false);
            })

//Update scatterplot by clicking on a city==================================================================
		.on("click", function(d) {
		console.log("City: " + d.city + ", Group: " + d.gname);

		d3.csv("data/scatterPlot.csv", function(error, data) {

			transition(data, svg2, d.city);
		});

	})
//====================================================================================================

            .on("mouseout", function() {
                d3.select("#tooltip2").classed("hidden", true);
                d3.select(this).attr("r",5);
            });

        });

    });
});

var t = projection.translate();
var scalar;
var s = projection.scale();

//ZOOMMMMMM//
function redraw() {
  var tx = t[0] * d3.event.scale + d3.event.translate[0];
  var ty = t[1] * d3.event.scale + d3.event.translate[1];
  projection.translate([tx, ty]);
  scaler = d3.event.scale

  // determine the projection's new scale
  projection.scale(s * scaler);
  // redraw the map
  svg.selectAll("path").attr("d", path);

  svg.selectAll("circle")
	  .attr("cx", function(d) { return projection([d.longitude, d.latitude])[0];})
	  .attr("cy", function(d) { return projection([d.longitude, d.latitude])[1];});

}

}



//=============================Scatter Plot============================================================




// Setup settings for graphic
            var canvas_width = 500;
            var canvas_height = 350;
            var padding = 45;  // for chart edges

		// Create SVG element
            var svg2 = d3.select("#scatter")  // This is where we put our vis
                .append("svg")
                .attr("width", canvas_width)
                .attr("height", canvas_height)

		var xScale;
		var yScale;
		var xAxis;
		var yAxis


            var dataset = [];  // Initialize empty array
	    var total = 0;
	    var prevTotal = 0;

		var counter = 0;




initPlot(" ");


function transition(data, svg2, city){
	 
	var attack;
	var target;

	update(city, data);


		//deletes extra points if new dataset is smaller
			if(prevTotal - total > 0){
				//console.log("Need to delete");
				for(i=0; i < (prevTotal - total); i++){
					svg2.select("circle").remove();

				}
			}

		//adds extra points if new dataset is larger
			else if (total - prevTotal > 0){

				svg2.selectAll("circle")
                		.data(dataset)
                		.enter()
                		.append("circle")  // Add circle svg
                		.attr("cx", function(d) {
                    			return xScale(d[0]);  // Circle's X
                		})
               			 .attr("cy", function(d) {  // Circle's Y
                   			 return yScale(d[1]);
               			 })
				.append("svg:title")
        				.text(function(d) { 


				if(d[1] == 1)
					attack = "Assasination"; // orange	//assasination					
				else if(d[1] == 2)
					attack = "Armed Assault";	// blue	//armed assault
				else if(d[1] == 3)
					attack = "Bombing/Explosion";	// green //bombing/explosion
				else if(d[1] == 4)
					attack = "Hijacking";	// purple //hijacking
				else if(d[1] == 5)
					attack = "Hostage Taking (Barricade Incident)"; //yellow	//hostage taking
				else if(d[1] == 6)
					attack = "Hostage Taking (Kidnapping)";	// yellow //hostage taking
				else if(d[1] == 7)
					attack = "Infrastructure attack";	//red	//infrastructure attack
				else if(d[1] == 8)
					attack = "Unarmed Assault";	//cyan/aqua	//unarmed assault
				else
					attack = "Unknown";		//unknown



				if(d[0] == 1)
					target= "Business";
				else if(d[0] == 2)
					target= "Government (General)";
				else if(d[0] == 3)
					target= "Police";
				else if(d[0] == 4)
					target= "Military";
				else if(d[0] == 5)
					target= "Abortion Related";
				else if(d[0] == 6)
					target= "Airports & Airlines";
				else if(d[0] == 7)
					target= "Government (Diplomatic)";
				else if(d[0] == 8)
					target= "Police";
				else if(d[0] == 9)
					target= "Food and Water Supply";
				else if(d[0] == 10)
					target= "Police";
				else if(d[0] == 11)
					target= "Journalists & Media";
				else if(d[0] == 12)
					target= "Maritime";
				else if(d[0] == 13)
					target= "Other";
				else if(d[0] == 14)
					target= "Private Citizens & Property";
				else if(d[0] == 15)
					target= "Religious Figures/Institutions";
				else if(d[0] == 16)
					target= "Telecommunication";
				else if(d[0] == 17)
					target= "Terrorists";
				else if(d[0] == 18)
					target= "Tourists";
				else if(d[0] == 19)
					target= "Transportation";
				else if(d[0] == 20)
					target= "Unknown";
				else if(d[0] == 21)
					target= "Utilities";
				else if(d[0] == 22)
					target= "Violent Political Party";
				

               			return ( "Attack: " + attack + "\nTarget: " + target); 
       				 	})
                		.attr("r", 5);  // radius

			}

		var color="brown";



                    // Update scale domains
                    xScale.domain([0, d3.max(dataset, function(d) {
                        return d[0]; })]);
                    yScale.domain([0, d3.max(dataset, function(d) {
                        return d[1]; })]);

                    // Update circles
                    svg2.selectAll("circle")
                        .data(dataset)  // Update with new data
                        .transition()  // Transition from old to new
                        .duration(1000)  // Length of animation
                        .each("start", function() {  // Start animation
                            d3.select(this)  // 'this' means the current element
                                .attr("fill", "brown")  // Change color
                                .attr("r", 10);  // Change size
                        })
                        .delay(function(d, i) {
                            return i / dataset.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
                        })
                        //.ease("linear")  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
                        .attr("cx", function(d) {
                            return xScale(d[0]);  // Circle's X
                        })
                        .attr("cy", function(d) {
                            return yScale(d[1]);  // Circle's Y
                        })
                        .each("end", function(d) {  // End animation


				if(d[1] == 1)
					color = "#ff8800"; // orange	//assasination					
				else if(d[1] == 2)
					color = "#00b2e4";	// blue	//armed assault
				else if(d[1] == 3)
					color = "#61d04f";	// green //bombing/explosion
				else if(d[1] == 4)
					color = "#da36d7";	// purple //hijacking
				else if(d[1] == 5)
					color = "#f0ee2e"; //yellow	//hostage taking
				else if(d[1] == 6)
					color = "#f0ee2e";	// yellow //hostage taking
				else if(d[1] == 7)
					color = "#ff3f4f";	//red	//infrastructure attack
				else if(d[1] == 8)
					color = "#05da9e";	//cyan/aqua	//unarmed assault
				else
					color = "#ff7af0";		//unknown

                            d3.select(this)  // 'this' means the current element
                                .transition()
                                .duration(500)
                                .attr("fill", color)  // Change color
                                .attr("r", 5);  // Change radius
                        });

                        // Update X Axis
                        svg2.select(".x.axis")
                            .transition()
                            .duration(1000)
                            .call(xAxis);

                        // Update Y Axis
                        svg2.select(".y.axis")
                            .transition()
                            .duration(100)
                            .call(yAxis);
}

//updates dataset to be displayed on scatter plot
function update(cityName, data){
	prevTotal = dataset.length;
	dataset=[];
	data.forEach(function(d){
				if (d.City == cityName){
					var target = parseInt(d.Target);
					var attack = parseInt(d.Attack);
					//console.log("Target: " + target + ", attack: " + attack);
					dataset.push([target, attack]);
				}
		});

	total = dataset.length;

	console.log("city: " + cityName);
	console.log("old size: " + prevTotal);
	console.log("size: " + dataset.length);
	console.log("new size: " + total);
}



function initPlot(cityName){

d3.csv("data/scatterPlot.csv", function(error, data) {
  if (error) throw error;

	update(cityName, data);



            // Create scale functions
             xScale = d3.scale.linear()  // xScale is width of graphic
                            .domain([0, d3.max(dataset, function(d) {
                                return d[0];  // input domain
                            })])
                            .range([padding, canvas_width - padding * 2]); // output range

             yScale = d3.scale.linear()  // yScale is height of graphic
                            .domain([0, d3.max(dataset, function(d) {
                                return d[1];  // input domain
                            })])
                            .range([canvas_height - padding, padding]);  // remember y starts on top going down so we flip

            // Define X axis
             xAxis = d3.svg.axis()
                            .scale(xScale)
                            .orient("bottom")
                            .ticks(5);

            // Define Y axis
             yAxis = d3.svg.axis()
                            .scale(yScale)
                            .orient("left")
                            .ticks(5);


            // Create Circles
            svg2.selectAll("circle")
                .data(dataset)
                .enter()
                .append("circle")  // Add circle svg
                .attr("cx", function(d) {
                    return xScale(d[0]);  // Circle's X
                })
                .attr("cy", function(d) {  // Circle's Y
                    return yScale(d[1]);
                })
                .attr("r", 5);  // radius


            // Add to X axis
            svg2.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (canvas_height - padding) +")")
                .call(xAxis);

            // Add to Y axis
            svg2.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + padding +",0)")
                .call(yAxis);

          svg2.append("text")      // text label for the x axis
        .attr("x", 235 )
        .attr("y",  340 )
        .style("text-anchor", "middle")
        .text("Target Type");

	svg2.append("text")
         .attr("x", -200 )
        .attr("y",  5 )
        .style("text-anchor", "start")
	.attr("dy", ".35em")
    .attr("transform", "rotate(-90)")
        .text("Attack Type");


});

}
//====================================================================
