var width = 760, height = 250, margin = 50;

var suicides = {}
var attr = {}
var total = {}

var cols = []

var order= []

processSuicides()

function processSuicides(){
    d3.csv("../../dataset/TenFamiliesStructure.csv").then(function(rows){
        for(var i = 0; i < rows.length; i++){
            suicides[rows[i].KindredID] = 0
            attr[rows[i].KindredID] = {}
            total[rows[i].KindredID] = 0
        }

        for(var i = 0; i < rows.length; i++){
            if(rows[i].suicide == 'Y')
                suicides[rows[i].KindredID]++
            total[rows[i].KindredID]++
        }

        processAttr()
    });
}

function processAttr(){
    d3.csv("../../dataset/question3.csv").then(function(rows){
        
        for(var i in rows[0])
            if(!['personid','KindredID','suicide','sex','Age'].includes(i))
                cols.push(i)

        for(var i in attr){
            for(var j = 0; j < cols.length; j++){
                attr[i][cols[j]] = 0
            }
        }
        
        for(var i = 0; i < rows.length; i++){
            for(var j = 0; j < cols.length; j++){
                if(rows[i][cols[j]] == 'True')
                    attr[rows[i].KindredID][cols[j]]++
            }
        }

        buildSuicideChart()
    });
}

function buildSuicideChart(){

    //Create data array
    var data = []

    for(var i in suicides)
        data.push({'family' : i, 'rate' : parseFloat((100.0 * suicides[i]/total[i]).toFixed(2))})

    data.sort(function(a, b){ return b.rate - a.rate;})

    for(var i = 0; i < data.length; i++)
        order.push(data[i].family)

    //Select objects
    var div = d3.select("#suicides-chart")
    var svg = div.append("svg")
        .attr("height", height)
        .attr("width", width)
        .attr("transform", "translate(" + 200 + "," + 30 + ")");

    svg.append("text")
        .attr("x", width/2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px") 
        .style("text-decoration", "underline")
        .style("font-family", "Arial")
        .text("Taxa de suicídios por família")
    
    var g = svg.append("g")
        .attr("height", height - margin)
        .attr("width", width - margin)
        .attr("transform", "translate(" + 50 + "," + 30 + ")");
        
    
    console.log(data)

    //Set scales
    var xScale = d3.scaleBand().range([0, width - margin]).padding(0.4),
    yScale = d3.scaleLinear().range([height - margin, 0]);

    xScale.domain(data.map(d => d.family));
    yScale.domain([0, d3.max(data, d => d.rate)]);

    //Append axis
    g.append("g")
		.attr("transform", "translate(0," + (height - margin) + ")")
		.call(d3.axisBottom(xScale));

	g.append("g")
		.call(d3.axisLeft(yScale).tickFormat(function(d) { 
			return d.toFixed(2) + ' %';
        }).ticks(10))
        
    //Append bars
    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar red-bar")
        .attr("x", d=>xScale(d.family))
        .attr("y", d=>yScale(d.rate))
        .attr("width", xScale.bandwidth() )
        .attr("height", d=>height - margin - yScale(d.rate));
    
    for(var i = 0; i < cols.length; i++)
        buildAttrChart(cols[i])
}

function buildAttrChart(col){
    //Create data array
    var data = []

    for(var i = 0; i < order.length; i++)
        data.push({'family' : order[i], 'rate' : parseFloat((100.0 * attr[order[i]][col]/suicides[order[i]]).toFixed(2))})

    //Select objects
    var div = d3.select("#attr-charts")
    var svg = div.append("svg")
        .attr("height", height)
        .attr("width", width)
        .attr("transform", "translate(" + 200 + "," + 30 + ")");

    svg.append("text")
        .attr("x", width/2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px") 
        .style("text-decoration", "underline")
        .style("font-family", "Arial")
        .text("Taxa de " + col + " por suicídio")
    
    var g = svg.append("g")
        .attr("height", height - margin)
        .attr("width", width - margin)
        .attr("transform", "translate(" + 50 + "," + 30 + ")");
        
    
    console.log(data)

    //Set scales
    var xScale = d3.scaleBand().range([0, width - margin]).padding(0.4),
    yScale = d3.scaleLinear().range([height - margin, 0]);

    xScale.domain(data.map(d => d.family));
    yScale.domain([0, d3.max(data, d => d.rate)]);

    //Append axis
    g.append("g")
		.attr("transform", "translate(0," + (height - margin) + ")")
		.call(d3.axisBottom(xScale));

	g.append("g")
		.call(d3.axisLeft(yScale).tickFormat(function(d) { 
			return d.toFixed(2) + ' %';
        }).ticks(10))
        
    //Append bars
    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar blue-bar")
        .attr("x", d=>xScale(d.family))
        .attr("y", d=>yScale(d.rate))
        .attr("width", xScale.bandwidth() )
        .attr("height", d=>height - margin - yScale(d.rate));
}