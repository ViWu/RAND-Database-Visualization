

function drawPanel(firstLoad){


	if(firstLoad){
	view = "View By Attack Type";
	myyear = 1971;
	}


	document.getElementById("panel-head").innerHTML = "Year " + myyear + " | " + view;

  var attackCategories = ['Armed Assault', 'Assassination', 'Bombing/Explosion', 'Infrastructure Attack', 'Hijacking', 'Hostage Taking','Unarmed Assault','Unknown'];
	var targetCategories = ['Business', 'Educational Institution', 'Government','Maritime', 'Military', 'NGO', 'Police', 'Telecommunication'];
	var weaponCategories= ['Biological', 'Chemical', 'Explosives/Bombs', 'Fire Arms','Incendiary','Melee','Radiological','Other'];

	var attackCategoriesData = ['Armed Assault', 'Assassination', 'Bombing/Explosion', 'Facility/Infrastructure Attack', 'Hijacking', 'Hostage Taking (Kidnapping)','Unarmed Assault','Unknown'];
	var targetCategoriesData = ['Business', 'Educational Institution', 'Government (General)','Maritime', 'Military', 'NGO', 'Police', 'Telecommunication'];
	var weaponCategoriesData= ['Biological', 'Chemical', 'Explosives/Bombs/Dynamite', 'Firearms','Incendiary','Melee','Radiological','Other'];

			if(view == "View By Attack Type"){
				var returnedArray = countTotalsByCategories(attackCategoriesData);
				drawPanelCanvas(myyear,attackCategories,attackCategoriesData,returnedArray);
			}
			else if(view == "View By Weapon Type"){
				var returnedArray = countTotalsByCategories(weaponCategoriesData);
				drawPanelCanvas(myyear,weaponCategories,weaponCategoriesData,returnedArray);
			}
			else if(view == "View By Target Type"){
				var returnedArray = countTotalsByCategories(targetCategoriesData);
				drawPanelCanvas(myyear,targetCategories,targetCategoriesData,returnedArray);
			}

}


function countTotalsByCategories(inputCategories){

	var dataArray = filteredArrayByYear;
	var storeTotals = [0,0,0,0,0,0,0,0];
	var myString;
	var categories = inputCategories;

	for(i=0;i<dataArray.length;i++)
    {

    	if(view == "View By Weapon Type"){
    		myString = dataArray[i].weaptype1_txt;

    	}
    	else if(view == "View By Attack Type"){
    		myString = dataArray[i].attacktype1_txt;
    	}
    	else if(view == "View By Target Type"){
    		myString = dataArray[i].targtype1_txt;

    	}

      if(myString == categories[0])
      {storeTotals[0]++;}
      else if(myString == categories[1])
      {storeTotals[1]++;}
      else if(myString  == categories[2])
      {storeTotals[2]++;}
      else if(myString  == categories[3])
      {storeTotals[3]++;}
      else if(myString  == categories[4])
      {storeTotals[4]++;}
      else if(myString  == categories[5])
      {storeTotals[5]++;}
      else if(myString  == categories[6])
      {storeTotals[6]++;}
      else
      {storeTotals[7]++;}
  }

  return storeTotals;

}


//draw bar charts on panel
function drawPanelCanvas(Year,viewCategories,viewCatsData,totalsForEachCategory){

 d3.select(".panel-body").select("svg").remove();
 d3.select("#chart").select('text').remove();
 var catName;

d3.selectAll(".loc")
      .data(filteredArrayByYear)
      .style("fill", function(d){

        if(view == "View By Weapon Type"){
        catName = d.weaptype1_txt;

        }
        else if(view == "View By Attack Type"){
          catName = d.attacktype1_txt;
        }
        else if(view == "View By Target Type"){
          catName = d.targtype1_txt;
        }

            	if(catName == viewCatsData[0]){
            		return "#00b2e4"; // blue
            	}
            	if(catName == viewCatsData[1]){
            		return "#ff8800"; // orange
            	}
            	if(catName == viewCatsData[2]){
            		return "#61d04f"; // green
            	}
            	if(catName == viewCatsData[3]){
            		return "#ff3f4f"; // red
            	}
            	if(catName == viewCatsData[4]){
            		return "#da36d7"; // purple
            	}
            	if(catName == viewCatsData[5]){
            		return "#f0ee2e"; // yellow
            	}
            	if(catName == viewCatsData[6]){
            		return "#05da9e"; // aqua
            	}
            	if(catName== viewCatsData[7]){
            		return "#ff7af0"; // pink
            	}
      });


    var grid = d3.range(25).map(function(i){
      return {'x1':0,'y1':0,'x2':0,'y2':480};
    });

    var tickVals = grid.map(function(d,i){
      if(i>0){ return i*10; }
      else if(i===0){ return "100";}
    });

    var xscale = d3.scale.linear()
            .domain([0,40000])
            .range([0,1000]);

    var yscale = d3.scale.linear()
            .domain([0,viewCategories.length])
            .range([0,200]);


    var canvas = d3.select('.panel-body')
            .append('svg')
            .attr({'width':350,'height':220});


    var xAxis = d3.svg.axis();
      xAxis
        .orient('bottom')
        .scale(xscale)
        .tickValues(tickVals);

    var yAxis = d3.svg.axis();
      yAxis
        .orient('left')
        .scale(yscale)
        .tickSize(2)
        .tickFormat(function(d,i){ return viewCategories[i]; })
        .tickValues(d3.range(17));

    var y_xis = canvas.append('g')
              .attr("transform", "translate(125,20)")
              .attr('id','yaxis')
              .call(yAxis);


    var c10 = d3.scale.ordinal().range(["#00b2e4","#ff8800","#61d04f","#ff3f4f","#da36d7","#f0ee2e","#05da9e","#ff7af0","#ffffff","ffffff"]);

// bar chart
    var chart = canvas.append('g')
              .attr("transform", "translate(125,7)")
              .attr('id','bars')
              .selectAll('rect')
              .data(totalsForEachCategory)
              .enter()
              .append('rect')
              .attr('height',10)
              .attr({'x':0,'y':function(d,i){ return yscale(i)+10; }})
              .style('fill',c10)
              .attr('width',function(d){ return 0; });


    var transit = d3.select(".panel-body").select("svg").selectAll("rect")
                .data(totalsForEachCategory)
                .transition()
                .duration(1000)
                .attr("width", function(d) {return xscale(d); });

    var transitext = d3.select(".panel-body").select("svg").select('#bars')
              .selectAll('text')
              .data(totalsForEachCategory)
              .enter()
              .append('text')
              .attr({'x':function(d) {return xscale(d)+15; },'y':function(d,i){ return yscale(i)+18; }})
              .text(function(d){ return d; }).style({'fill':'blue','font-size':'10px'});

}
