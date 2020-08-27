var svg = d3.select("svg"),
	margin = 200,
	width = svg.attr("width") - margin,
	height = svg.attr("height") - margin;

var xScale = d3.scaleBand().range([0, width]).padding(0.4),
	yScale = d3.scaleLinear().range([height, 0]);

var g = svg.append("g")
	.attr("transform", "translate(" + 100 + "," + 100 + ")")

// Loading data
d3.csv("https://raw.githubusercontent.com/lucas-t-reis/BioVis-IEEE-2020/master/sandbox/XYZ.csv?token=ADE4HTQ3RB7WVNNS2XYRFGS7KFQTI").then(function(data) { 

	xScale.domain(data.map( d => d.year));
	yScale.domain([0, d3.max(data, d => d.value)]);
	g.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(xScale));

	g.append("g")
		.call(d3.axisLeft(yScale).tickFormat(function(d) { 
			return "$" + d;
		}).ticks(10))

	g.selectAll(".bar")
		.data(data)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", d=>xScale(d.year))
		.attr("y", d=>yScale(d.value))
		.attr("width", xScale.bandwidth() )
		.attr("height", d=>height - yScale(d.value));
});


	
