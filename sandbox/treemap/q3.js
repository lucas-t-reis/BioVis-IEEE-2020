var margin = {top: 10, right: 10, bottom: 10, left: 10},
	width = 445 - margin.left - margin.right,
	height = 445 - margin.top - margin.bottom;

var svg = d3.select("#treemap")
.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// Reading input data
d3.csv("https://raw.githubusercontent.com/lucas-t-reis/BioVis-IEEE-2020/master/sandbox/treemap/data.csv?token=ADE4HTVDBYPB2YZBXEAB2ES7LZVR2").then( function(data) {


	var root = d3.stratify()
		.id(d => d.name)
		.parentId(d => d.parent)
		(data);
	root.sum( d => +d.value );

	d3.treemap()
		.size([width, height])
		.padding(4)
		(root)

	console.log(root.leaves())
	svg.selectAll("rect")
		.data(root.leaves())
		.enter()
		.append("rect")
			.attr("x", d => d.x0)
			.attr("y", d => d.y0)
			.attr("width", d => (d.x1 - d.x0))
			.attr("height", d => (d.y1 - d.y0))
			.style("stroke", "black")
			.style("fill", "#693a2");
	// Add labels
	svg.selectAll("text")
		.data(root.leaves())
		.enter()
		.append("text")
			.attr("x", d => d.x0+10)
			.attr("y", d => d.y0+20)
			.text( d => d.data.name)
			.attr("font-size", "15px")
			.attr("fill", "white")

});
