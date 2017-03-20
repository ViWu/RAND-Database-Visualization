

function drawBrush(projection,brushMargin, width, height){

    var svg6 = d3.select(".page-header").append("svg")
      .attr("width", width + brushMargin.left + brushMargin.right+300)
      .attr("height", 60);

    var x = d3.scale.linear()
      .domain([1971, 2013])
      .range([0, width-55])
      .clamp(true);

    var brush = d3.svg.brush()
      .x(x)
      .extent([0,0])
      .on("brush", change);

    svg6.append("g")
      .attr("transform", "translate(" + brushMargin.left + "," + brushMargin.top + ")");

    svg6.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(18," + height  + ")")
      .call(d3.svg.axis()
        .scale(x)
        .tickValues(d3.range(1971, 2014, 3))
        .tickFormat(d3.format(".0f"))
        .orient("bottom")
        .tickSize(10)
        .tickPadding(12));

    var slider = svg6.append("g")
      .attr("class", "slider")
      .append("circle")
      .style("fill","#E95151")
      .attr("transform", "translate(20," + height + ")")
      .attr("r", 8)
      .call(brush);



        function change() {

                  var value = brush.extent()[0];

                    if (d3.event.sourceEvent) {
                      value = x.invert(d3.mouse(this)[0]);
                      brush.extent([value, value]);
                    }

                    value=parseInt(value);


                    filteredArrayByYear.length=0;


                   for(i=0;i<terror_year.length;i++){
                      if(terror_year[i].iyear == value){
                        filteredArrayByYear.push(terror_year[i]);
                      }
                    }


                    slider.attr("cx", x(value));
                    myyear = value;
                    drawPanel(false);


                    d3.selectAll(".loc")
                      .data(filteredArrayByYear)
                      .transition()
                      .duration(1500)
                      .ease("linear")
                      .attr("cx", function(d) {
                                   return projection([d.longitude, d.latitude])[0];
                           })
                           .attr("cy", function(d) {
                                   return projection([d.longitude, d.latitude])[1];
                           })



        }




}
