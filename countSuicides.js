function countSuicides(){
	
	// SVG params
	var svg = d3.select("svg"),
	margin = 200,
	width = svg.attr("width") - margin,
	height = svg.attr("height") - margin;

	// Adjusting data to fit the SVG
	var xScale = d3.scaleBand().range([0, width]).padding(0.4),
		yScale = d3.scaleLinear().range([height, 0]);
		
	var g = svg.append("g")
		.attr("transform", "translate(" + 100 + "," + 100 + ")")
		
	// Loading data and building the bar chart	
	d3.csv("https://raw.githubusercontent.com/lucas-t-reis/BioVis-IEEE-2020/master/dataset/question3.csv?token=ADE4HTVC6Y2PBDNBEHJAT227KKKQU").then(function(data) {
		
		var numSuicides = {};
		
		data.forEach(function(d){
			if(!(d.KindredID in numSuicides))
				numSuicides[d.KindredID] = 0;
			numSuicides[d.KindredID]++
		});
			
		var xdata = Object.keys(numSuicides)
		var ydata = Object.values(numSuicides)

		// Transformation real data -> pixels
		xScale.domain(xdata.map(d => d));
		yScale.domain([0, d3.max(ydata, d => d)]);
		
		// Placing the x,y axes
		g.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(xScale));
		g.append("g")
			.call(d3.axisLeft(yScale).tickFormat(d => d).ticks(10))

		// Building rectangles
		g.selectAll(".bar")
			.data(ydata)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", (d, i) => xScale(xdata[i])) 
			.attr("y", d => yScale(d))
			.attr("width", xScale.bandwidth())
			.attr("height", d => height - yScale(d));
	});	
}
