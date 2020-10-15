var margin = {top:40, right:30, bottom:30, left:30},
	width = 800- margin.right - margin.left,
	height = 700- margin.top - margin.bottom

// Convenience for acessing each personid index in the @data Object list
function mapify(dataset) {

	var mapping = new Map()
	for(const [i,data] of dataset.entries())
		mapping.set(data.personid, i)

	return mapping

}

var skipAttributes = ["personid", "suicide"]
var tenFamilies = ["38", "149","27251", "42623", 
				   "68939", "176860", "603481", "791533", "903988"]

// Building <select> options
d3.csv("../../dataset/filtered_data.csv", function(data) { 
	buildSelect(data)
})

function buildSelect(data) {
	
	var sorted = []
    
	for(var i = 0; i < data.length; i++) 
		sorted.push(data[i].personid);
	
	sorted.sort(function(a, b){
		return a - b;
	})

	for(var i = 0; i < sorted.length; i++)
		d3.select("#refPerson").append('option').html(sorted[i]).attr('value', sorted[i])

	url = new URL(window.location.href)
	urlId = url.searchParams.get('id')

	if(urlId == null)
		urlId = 11605;
	
	d3.select('#refPerson').property('value', urlId)
	d3.select('#polar-link').attr('href', '../polar/?id=' + urlId)

	buildGraph(urlId)
}

function updateGraph() {
	
	d3.select("#heatmap").html("")
	refPerson = d3.select("#refPerson").property("value")
	d3.select('#polar-link').attr('href', '../polar/?id=' + refPerson)
	buildGraph(refPerson)

}


function buildGraph(pid) {

	var svg = d3.select("#heatmap")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	d3.csv("../../dataset/filtered_data.csv", function(data) { 

		let referencePerson = pid 
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
				if(personAttributes[key]=="False") return 
				
				if(isNaN(closest_neighbors[id]))
					closest_neighbors[id] = 0
				// Incrementing count for same conditions as @person in each @neighbor
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

			// Counting only the ones who have at least 2 attributes in common
			if(i[1] > 1) n++

			max_rank = (max_rank < i[1])?i[1]:max_rank
			rank.set(i[0], i[1]) 
		}
		
		let gridSize = n	// Virtual matrix containing the non-zero ranked elements
		n = Math.floor(Math.sqrt(n)) + 1 // Smallest possible square matrix

		// ---------- DRAWING THE GRAPH ---------- //
		var labels = [...Array(n).keys()]



		// ---------- AXIS & TITLE ---------- //
		var x = d3.scaleBand()
			.range([0, width])
			.domain(labels)
			.padding(0.01)
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x))

		var y = d3.scaleBand()
			.range([height, 0])
			.domain(labels)
			.padding(0.01)
		svg.append("g")
			.call(d3.axisLeft(y))
		
		svg.append("text")
			.attr("x", 0)
			.attr("y", -10)
			.text("Heatmap com indivíduos similares a " + referencePerson)
			.attr("font-size", "23px")
			.attr("fill", "grey")

		// ---------- TOOLTIP ---------- //
		var tooltip = d3.select("body")
			.append("div")
				.attr("class", "tooltip")
				.style("opacity", 0)

		var mouseover = function(d) {
			
			// Building common attributes string
			let commonAttr = ""
			for(const [key, value] of Object.entries(d)) {

				if(d[key]=="False") continue;
				if(d[key] == personAttributes[key]) 
					commonAttr += "<p>	- " + key
			}


			tooltip
				.html(
				'<br><p>Family: '+ d.KindredID + '</p>'
				+ '<p>Common attributes: ' + rank.get(d.personid) + '</p>' 	
				+ '<p></p>' + commonAttr
				)
				.style("left", (d3.mouse(this)[0] + 400) + "px")
				.style("top", (d3.mouse(this)[1] + 10) +"px")
				.style("opacity", 1)
		}
		var mouseleave = function(d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", 0)
		}


		var familyColor= d3.scaleOrdinal(d3.schemeCategory10)
			.domain(tenFamilies)
		
		
		// ---------- DRAWING GRAPH ---------- //
		svg.selectAll()
			.data(data)
			.enter()
			.append("rect")
				.attr("x", (d,i) => x(((i%gridSize)/n)>>0))
				.attr("y", (d,i) => y(((i%gridSize)%n)>>0))
				.attr("width", x.bandwidth)
				.attr("height", y.bandwidth)
				.style("fill", d=>familyColor(d.KindredID)) // A color for each family
				.style("opacity", d=> rank.get(d.personid)/max_rank * 1.5 ) // Opacity controlled by ranking
				.style("stroke", d=> d.personid==String(referencePerson)?"black":"")
				.style("stroke-width", 3)
			.on("mouseover", mouseover)
			.on("mousemove", mouseover)
			.on("mouseleave", mouseleave)

		// Removing 0 ranked elements
		svg.selectAll("rect").filter((d,i)=> (rank.get(d.personid)<=1)).remove();
	});
}
