var margin = {top:90 ,right:10, bottom:10, left:0}
	width = 800- margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;


var svg = d3.select("#parallel")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top +")")

var skipAttributes = ["personid", "KindredID", "suicide", "sex", "Age"]


d3.csv("https://raw.githubusercontent.com/lucas-t-reis/BioVis-IEEE-2020/master/dataset/question3.csv?token=ADE4HTUGICGJEZUXP5ZC4H27OCPKS", function(data) {

	// Suicides per family according to attribute
	let families = new Map()

	// Processing each family suicide count per attribute
	for(row of data){

		let f = row["KindredID"]

		if(!families.has(f))
			families.set(f, {
				"id":f,
				"suicides":0,
				"alcohol":0,
				"psychosis":0,
				"anxiety-non-trauma":0,
				"somatic disorder":0,
				"eating":0,
				"bipolar spectrum illness":0,
				"depression":0,
				"interpersonal trauma":0,
				"PD-Cluster C-anxiety":0,
				"PD-Cluster B-emotional":0,
				"PD":0,
				"Impulse control disorder":0,
				"obesity":0,
				"cardiovascular":0,
				"COPD":0,
				"asthma":0,
				"immune-autoimmune":0
			})
		
		let obj  = families.get(f)
		obj["suicides"]++

		for(attribute in row){
			
			if(skipAttributes.includes(attribute)) continue
			if(row[attribute] == "False") continue
			
			obj[attribute]++
		}

		// Updating family object
		families.set(f, obj)
	}

	// Data to feed D3 with	
	let family_suicides = [...families.values()]

	// Getting dimensions for the various y axes
	let dimensions = d3.keys(data[0]).filter(d => !skipAttributes.includes(d))
	
	
	/* ---------- AXIS ---------- */ 
	var y = {}
	dimensions.forEach(function(attr) {
		// One axis for each attribute, ranging from 0 to 100%
		y[attr] = d3.scaleLinear()
					.domain([0.0,0.5])
					.range([height, 0])
	})
	var x = d3.scalePoint()
			.range([0,width])
			.padding(1)
			.domain(dimensions)

	// Creates a line following a sequence of points as second args
	function path(d) {
		return d3.line()(dimensions.map(function (elem) {
			return [x(elem),y[elem](d[elem]/d["suicides"])]})
		)
	}

	// Drawing the lines
	svg.selectAll("line_paths")
		.data(family_suicides)
		.enter().append("path")
		.attr("d", path)
		.style("fill", "none")
		.style("stroke", "#69b3a2")
		.style("opacity", 0.5)
	
	svg.selectAll("attr_axes")
		.data(dimensions)
		.enter()
		.append("g")
			.attr("transform", d => "translate("+ x(d) + ")")
			.each(function(d) {
				d3.select(this)
					.call(d3.axisLeft()
					.scale(y[d]).ticks(4))
				})
			.append("text")
				.style("text-anchor", "start")
				.attr("y", -9)
				.text(d=>d)
				.style("fill", "black")
				.attr("transform", "rotate(-45)")

})


	


