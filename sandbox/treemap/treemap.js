// Setting the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
	width = 1000- margin.left - margin.right,
	height = 1000- margin.top - margin.bottom;

// Append the svg object to the body of the page
var svg = d3.select("#treemap")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform",
			  "translate(" + margin.left + "," + margin.top + ")");

// Read json data
d3.json("family_attributes.json", function(data) {

	// Give the data to this cluster layout:
	// Testar porcentagem:w
	// qe
	var root = d3.hierarchy(data).sum(d => d.value) 

	// Then d3.treemap computes the position of each element of the hierarchy
	d3.treemap()
		.size([width, height])
		.paddingTop(28)
		.paddingRight(7)
		.paddingInner(5) 
		(root)

	// Family colors
	var color = d3.scaleOrdinal()
		.domain(["38", "149","27251", "42623", "68939", "176860", "603481", "791533", "903988"])
		.range(["#d55e00","#cc79a7","#0072b2","#332288","#009e73", "#882255", "#CC6677", "#88CCEE", "#DDCC77"])

	// Heatmap opacity scale
	var opacity = d3.scaleLinear()
		.domain([1, 13])
		.range([.5,1])

	// Tooltip
	var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	// Add rectangles:
	svg.selectAll("rect")
		.data(root.leaves())
		.enter()
		.append("rect")
		  .attr("id", (d,i)=> i)
		  .attr('x', d => d.x0)
		  .attr('y', d => d.y0)
		  .attr('width', d => d.x1 - d.x0)
		  .attr('height', d => d.y1 - d.y0)
		  .style("stroke", "black")
		  .style("fill", d => color(d.parent.data.name) )
		  .style("opacity", d => opacity(d.data.value))
		  .on("mouseover", function(d) {
			  div.transition()
				.duration(200)		
				.style("opacity", .9);
			  div.html("Condition: " + d.data.name + "<p>Frequency: " + d.data.value)
				.style("left", (d3.event.pageX) + "px")		
				.style("top", (d3.event.pageY - 28) + "px");	
				
			})
		  .on("mouseout", function(d) {
			  div.transition()
				.duration(150)
				.style("opacity", 0);	
			});

	// Add title for the 10 families 
	svg.selectAll("titles")
		.data(root.descendants().filter( d => d.depth==1))
		.enter()
		.append("text")
		  .attr("x", d => d.x0)
		  .attr("y",d => d.y0+21)
		  .text((d,i) => i)//d.data.name)
		  .attr("font-size", "19px")
		  .attr("fill",  d => color(d.data.name) )
	// Add title for the 3 groups
	svg.append("text")
		.attr("x", 0)
		.attr("y", 14) 
		.text("Attributes of suicide cases among 10 families")
		.attr("font-size", "23px")
		.attr("fill",  "grey" )
/*
  // Text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d){ return d.x0+5})    
      .attr("y", function(d){ return d.y0+20})  
      .text(function(d){ return d.data.name })
      .attr("font-size", "15px")
      .attr("fill", "white")
*/
  // Value labels
  svg
    .selectAll("vals")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
      .attr("y", function(d){ return d.y0+35})    // +20 to adjust position (lower)
      .text(function(d){ return d.data.value })
      .attr("font-size", "15px")
      .attr("fill", "white")

	  
});
