var width = 760, height = 250, margin = 50;

var suicides = {}
var attr = {}
var total = {}

var cols = []
var order= []

var tooltip
var mainAttr = "none"

processSuicides()

function updateAttr(){
    
    //Set main attr
    mainAttr = d3.select("#mainAttr").property("value")
    
    //clear charts
    d3.select('#main-chart').html("")
    d3.select('#attr-charts').html("")

    //reset order
    order = []

    //build everything again
    buildMainChart()
}

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

        tooltip = d3.select('body').append('div').attr('class', 'tooltip')

        processAttr()
    });
}

function processAttr(){
    d3.csv("../../dataset/question3.csv").then(function(rows){
        
        for(var i in rows[0]){
            if(!['personid','KindredID','suicide','sex','Age'].includes(i)){
                cols.push(i)
                d3.selectAll('select').append('option').html(i).attr('value', i)
            }
        }

        if(mainAttr == 'none')
            mainAttr = cols[0]

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

        buildMainChart()
    });
}

function buildMainChart(){

    //Create data array
    var data = []

    for(var i in suicides)
        data.push({'family' : i, 'rate' : parseFloat((100.0 * attr[i][mainAttr]/suicides[i]).toFixed(2)), 'chart' : mainAttr})

    data.sort(function(a, b){ return b.rate - a.rate;})

    for(var i = 0; i < data.length; i++)
        order.push(data[i].family)

    //Select objects
    var div = d3.select("#main-chart")
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
        .text(mainAttr + " rate by family")
    
    var g = svg.append("g")
        .attr("height", height - margin)
        .attr("width", width - margin)
        .attr("transform", "translate(" + 50 + "," + 30 + ")");
        
    
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
        .attr("height", d=>height - margin - yScale(d.rate))
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);
    
    for(var i = 0; i < cols.length; i++)
        if(cols[i] != mainAttr)
            buildAttrChart(cols[i])
}

function buildAttrChart(col){
    //Create data array
    var data = []

    for(var i = 0; i < order.length; i++)
        data.push({'family' : order[i], 'rate' : parseFloat((100.0 * attr[order[i]][col]/suicides[order[i]]).toFixed(2)), 'chart' : col})

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
        .text(col + " rate by family")
    
    var g = svg.append("g")
        .attr("height", height - margin)
        .attr("width", width - margin)
        .attr("transform", "translate(" + 50 + "," + 30 + ")");
        
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
        .attr("height", d=>height - margin - yScale(d.rate))
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);
}

function mouseover(){
    tooltip.style('display', 'inline');
}
function mousemove(){
    var d = d3.select(this).data()[0]
    tooltip
        .html("Família " + d.family + '<br>' + d.chart + ': ' + d.rate + '%')
        .style('left', (d3.event.pageX - 34) + 'px')
        .style('top', (d3.event.pageY - 12) + 'px');
}
function mouseout(){
    tooltip.style('display', 'none');
}