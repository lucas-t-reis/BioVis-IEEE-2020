function countAttributes(familyID){
	
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
		
		var numAttributes = {};
		var totalSuicides = 0;
		var forbidden = ['personid','KindredID', 'suicide', 'Age', 'sex']

		data.forEach(function(d){
			if(d.KindredID == familyID){
				for(var key in d){
					if(!forbidden.includes(key)){
						if(d[key] == 'True'){
							if(!(key in numAttributes))
								numAttributes[key] = 0;
							numAttributes[key]++
						}
					}
				}
				totalSuicides++;
			}
		});
		
		var sorted = Object.entries(numAttributes).sort((a, b) => b[1] - a[1])
		
		var xdata = sorted.map(x => x[0])
		var ydata = sorted.map(x => x[1])

		for(var i = 0; i < ydata.length; i++)
			ydata[i] = 100.0 * ydata[i] / totalSuicides 

		console.log(xdata)
		console.log(ydata)

		// Transformation real data -> pixels
		xScale.domain(xdata.map(d => d));
		yScale.domain([0, 100]);
		
		// Placing the x,y axes
		g.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(xScale))
			// .selectAll("text")
			// .attr("y", 0)
			// .attr("x", 9)
			// .attr("dy", ".35em")
			// .attr("transform", "rotate(0)")
			// .style("text-anchor", "start");
		g.append("g")
			.call(d3.axisLeft(yScale).tickFormat(d => d).ticks(5))

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
