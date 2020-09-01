var margin = {top: 10, right: 30, bottom: 30, left: 40},
	width = 960 - margin.left  - margin.right;
	height = 500 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%d-%m-%Y");

var x = d3.scaleTime()
	.domain([new Date(2010, 6, 3), new Date(2012, 0, 0)])
	.rangeRound([0, width]);

var y = d3.scaleLinear()
	.range([height, 0]);

var histogram = d3.histogram()
	.value( d => d.date )
	.domain(x.domain())
	.thresholds(x.ticks(d3.timeMonth));

var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("https://gist.githubusercontent.com/d3noob/7ac0cfe24fcaacaee04ccbca018a58a6/raw/a0840ad694b4794480ddeed24c956baceab10ba8/earthquakes.csv").then(function(data) {

	data.forEach(function(d) {
		d.date = parseDate(d.dtg);
	});

	var bins = histogram(data);

	y.domain([0, d3.max(bins, d => d.length)]);

	svg.selectAll("rect")
		.data(bins)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", 1)
		.attr("transform", d => ("translate(" + x(d.x0) + "," + y(d.length) + ")"))
		.attr("width", d => x(d.x1) - x(d.x0) - 1)
		.attr("height", d => height - y(d.length))
	
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));
	svg.append("g")
		.call(d3.axisLeft(y));

});
