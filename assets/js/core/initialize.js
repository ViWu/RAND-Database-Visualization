function initialize(){

	var myyear;

	$(document).ready(function(){
	    $(".dropdown-menu").on("click", function(e){
	        var linkText = $(e.target).text(); 
	        handleChange(linkText);

	    });
	});

	function handleChange(selectText){
		console.log("printing from handleChange " + selectText);
		view = selectText;
	 	drawPanel(false);

	}
	drawComponents();	
}