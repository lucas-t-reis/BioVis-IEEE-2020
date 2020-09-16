var margin = {top:30, right:30, bottom:30, left:30},
	width = 450 - margin.right - margin.left,
	height = 450 - margin.top - margin.bottom

var svg = d3.select("#heatmap")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// Sort por rank
// Familia conta como ponto
// Sexo conta como ponto
// tooltip mostra o que eles tem em comum
// Inverter o eixo
//


// Convenience for acessing each personid index in the @data Object list
function mapify(dataset) {

	var mapping = new Map()
	for(const [i,data] of dataset.entries())
		mapping.set(data.personid, i)

	return mapping

}

var skipAttributes = ["personid", "KindredID", "suicide", "sex", "Age"]
var tenFamilies = ["38", "149","27251", "42623", 
				   "68939", "176860", "603481", "791533", "903988"]
d3.csv("q3.csv", function(data) { 

	let referencePerson = 47434
	let indexOf = mapify(data)
	let person = indexOf.get(String(referencePerson)) // given an individual
	let personAttributes = {}
	let idx = 0
	
	// Getting each attribute of the reference person
	Object.keys(data[person]).forEach(key => {

		if(skipAttributes.includes(key)) return	
		personAttributes[key] = data[person][key]

	})


	// Computing number of equal attributes between @person and @neighbors
	var closest_neighbors = {}
	for(const neighbor of data) {
		
		let id = neighbor["personid"]
		Object.keys(neighbor).forEach(key => {
			
			if(skipAttributes.includes(key)) return
			
			if(isNaN(closest_neighbors[id]))
				closest_neighbors[id] = 0
			
			// Incrementing count for same conditions as @person in each @neighbor
			if(personAttributes[key]=="True")
				closest_neighbors[id] += (neighbor[key] == personAttributes[key])
		})
	}

	// Sorting in descending order and mapping to a rank
	closest_neighbors = Array.from(Object.entries(closest_neighbors).map(e=>e))
	closest_neighbors.sort( (a,b) => (a[1] < b[1])?1:-1 )

	var rank = new Map()
	var max_rank = 0
	var n = 0
	
	for(const i of closest_neighbors) { 

		// Counting only the ones who have  attributes in common
		if(i[1] > 0) n++

		max_rank = (max_rank < i[1])?i[1]:max_rank
		rank.set(i[0], i[1]) 
	}
	
	let gridSize = n	// Virtual matrix containing the non-zero ranked elements
	n = Math.floor(Math.sqrt(n)) + 1 // Smallest possible square matrix

	// ---------- DRAWING THE GRAPH ---------- //
	var labels = [...Array(n).keys()]
	var x = d3.scaleBand()
		.range([0, width])
		.domain(labels)
		.padding(0.01)
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))

	var y = d3.scaleBand()
		.range([0, height])
		.domain(labels)
		.padding(0.01)
	svg.append("g")
		.call(d3.axisLeft(y))
	
	var tooltip = d3.select("#heatmap")
		.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")
			.style("background-color", "white")
			.style("border", "solid")
			.style("border-width", "2px")
			.style("border-radius", "5px")
			.style("padding", "5px")

	var mouseover = d => tooltip.style("opacity", 1)
	var mousemove = function(d) {
		tooltip
			.html("Value:" + rank.get(d.personid) + "<br>Family:"+ d.KindredID)
			.style("left", (d3.mouse(this)[0]) + "px")
			.style("top", (d3.mouse(this)[1]) + "px")
	}
	var mouseleave = d => tooltip.style("opacity", 0)

	/*
	var color = d3.scaleLinear()
		.range(["white", "#69b3a2"])
		.domain([0.0, 1.0])
	*/

	var familyColor= d3.scaleOrdinal(d3.schemeCategory10)
		.domain(tenFamilies)

	// Filtrar
	svg.selectAll()
		.data(data)
		.enter()
		.append("rect")
			.attr("x", (d,i) => x((i%gridSize)/n>>0))
			.attr("y", (d,i) => y((i%gridSize)%n>>0))
			.attr("width", x.bandwidth)
			.attr("height", y.bandwidth)
			//.style("fill", d => color(rank.get(d.personid)/max_rank + 0.1))
			.style("fill", d=>familyColor(d.KindredID)) // A color for each family
			.style("opacity", d=>rank.get(d.personid)/max_rank) // Opacity controlled by ranking
			.style("stroke", d=> d.personid==String(referencePerson)?"black":"")
		.on("mouseover", mouseover)
		.on("mousemove", mousemove)
		.on("mouseleave", mouseleave)

	// Removing 0 ranked elements
	svg.selectAll("rect").filter((d,i)=> (rank.get(d.personid)==0)).remove();
	

});
