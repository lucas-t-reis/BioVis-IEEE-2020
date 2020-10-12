var margin = {top:150 ,right:10, bottom:10, left:0}
	width = 900- margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;

var svg = d3.select("#parallel")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top +")")

var skipAttributes = ["personid", "KindredID", "suicide", "sex", "Age"]

d3.csv("../../dataset/filtered_data.csv", function(data) {
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
	let color = d3.scaleOrdinal()
		.domain([...families.keys()])
		.range(d3.schemeCategory10) // Plugin in index.html provides this pallete
	
	
	/* ---------- AXIS ---------- */ 
	var y = {}
	dimensions.forEach(function(attr) {
		// One axis for each attribute, ranging from 0 to 100%
		y[attr] = d3.scaleLinear()
					.domain([0.0,0.43])
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

	let options = document.getElementsByTagName("p")
	for(element of options) {
		console.log(element.id)
		element.onmouseover = function wrapper() { mouseover(element.id) }
		element.onmouseout = function wrapper() { highlight(element.id) }
	}
	/*---------- ON DEMAND HIGHLIGHT----------*/
	var highlight = function(d) {

		selected_family = d.id

		// Grey out all families
		d3.selectAll(".line")
			.transition().duration(200)
			.style("stroke", "grey")
			.style("opacity", "0.60")

		// Color the hovered one
		d3.selectAll("." + "family_" + selected_family)
			.transition().duration(200)
			.style("stroke-width", "0.6%")
			.style("stroke", (d) => {
				if (selected_family == 68939) // Quickfix to remove RED from the pallete...
					return "#2f0000"
				else 
					return color(d.id)
			})
			.style("opacity", "1")
			.style("position", "absolute")
			.style("z-index", "2")

	}

	var noHighlight = function(d) {

		d3.selectAll(".line")
			.transition().duration(200).delay(500)
			.style("stroke-width", "0.3%")
			.style("stroke", (d) => {
				if (d.id == 68939)
					return "#2f0000"
				else 
					return color(d.id)
			})
			.style("opacity", "1")
	}
	
	/* ---------- TOOLTIP ----------*/
	var tooltip = d3.select("#parallel")
		.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")

	var mouseover = function(d) {
		console.log("Got called by " + d)
		if(typeof(d) == "string")
			console.log("d type:" + typeof(d) + " " + d)
			for(const i in family_suicides){
				console.log(typeof(family_suicides[i].id) + " has " + family_suicides
				[i].id)
				if(family_suicides[i].id == d) {
					console.log("Printing stuff...")
					for(const a of family_suicides[i])
						console.log(a)
					console.log("Type:" + typeof(family_suicides[i]))
					console.log(family_suicides[i].id)
					console.log("Type:" + typeof(d))
					console.log(d)
					d = new Object(family_suicides[i])
					break
				}
			}
		console.log("Calling high to " +  d)
		highlight(d);
		tooltip.style("opacity", 1)
	}
	var mousemove = function(d) {
		
		if(typeof(d) == "number")
			for(const family of family_suicides)
				if(family.id == d.toString()) {
					d = family
					break;
				}
		tooltip
			.html("<p><b>Family:</b>" + d.id 
					+ "<p><b>Suicides:</b>" 
					+ families.get(d.id).suicides)
			// Currently bugged if you resize screen.
			// Works well on 1366x768 (16:9)
			.style("left", ((d3.mouse(this)[0])+350) +"px") 
			.style("top", ((d3.mouse(this)[1])+130) +"px")
			.style("position", "absolute")
	}
	var mouseleave = function(d) {
		noHighlight(d)
		tooltip.style("opacity", 0) 
	}

	// Drawing the lines
	svg.selectAll("line_paths")
		.data(family_suicides)
		.enter().append("path")
		.attr("class", d => "line " + "family_" + d.id) // CSS selector cant handle class id beginning with integer, hence family_+id
		.attr("d", path)
		.style("fill", "none")
		.style("stroke", (d)=> {
			if (d.id == 68939)
				return "#2f0000"
			else 
				return color(d.id)
		})
		.style("stroke-width", "0.3%")
		.style("opacity", 1)
		.on("mouseover", mouseover)
		.on("mousemove", mousemove)
		.on("mouseleave", mouseleave)
	
	svg.selectAll("attr_axes")
		.data(dimensions)
		.enter()
		.append("g")
			.attr("class", "axis")
			.attr("transform", d => "translate("+ x(d) + ")")
			.each(function(d) {
				d3.select(this)
					.call(d3.axisLeft()
					.scale(y[d]).ticks(4))
				})
			.append("text")
				.style("text-anchor", "start")
				.attr("font-size", "12px")
				.attr("y", -9)
				.text(d=>d)
				.style("fill", "black")
				.attr("transform", "rotate(-45)")
	
	// Graph title
	svg.append("text")
		.attr("x", 0)
		.attr("y", -118)
		.text("Prevalence of suicide attributes in each family")
		.attr("font-size", "32px")
		.attr("fill", "grey")

})
