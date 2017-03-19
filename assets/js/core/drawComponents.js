
function drawComponents(){

	var margin = {top: 200, right: 50, bottom: 200, left: 10},
	    width = 860 - margin.left - margin.right,
	    height = 410 - margin.bottom - margin.top;


	var projection = d3.geo.mercator()
	    .center([3,40])
	    .scale(100)
	    .rotate([-10,0]);  

	var terror_year;



	drawTotalKill();  
	drawMap(margin,projection);
	drawBrush(projection,margin, width,height);
	
}

