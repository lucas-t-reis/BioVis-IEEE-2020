// Setting the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 800- margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// Append the svg object to the body of the page
var svg = d3.select("#treemap")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// read json data
d3.json("family_attributes.json", function(data) {

  // Give the data to this cluster layout:
  var root = d3.hierarchy(data).sum(d => d.value) // Here the size of each leave is given in the 'value' field in input data

  // Then d3.treemap computes the position of each element of the hierarchy
  d3.treemap()
    .size([width, height])
    .paddingTop(28)
    .paddingRight(7)
    .paddingInner(3) 
    (root)

  // prepare a color scale
  var color = d3.scaleOrdinal()
	.domain(["38", "149","27251", "42623", "68939", "176860", "603481", "791533", "903988"])
	.range(["#d55e00","#cc79a7","#0072b2","#332288","#009e73", "#882255", "#CC6677", "#88CCEE", "#DDCC77"])

  // And a opacity scale
  var opacity = d3.scaleLinear()
    .domain([1, 13])
    .range([.5,1])

  // Add rectangles:
  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .style("stroke", "black")
      .style("fill", d => color(d.parent.data.name) )
      .style("opacity", d => opacity(d.data.value))

  // Text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d){ return d.x0+5})    
      .attr("y", function(d){ return d.y0+20})  
      .text(function(d){ return d.data.name })
      .attr("font-size", "15px")
      .attr("fill", "white")

  // Value labels
  svg
    .selectAll("vals")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
      .attr("y", function(d){ return d.y0+35})    // +20 to adjust position (lower)
      .text(function(d){ return d.data.value })
      .attr("font-size", "15px")
      .attr("fill", "white")

  // Add title for the 3 groups
  svg
    .selectAll("titles")
    .data(root.descendants().filter( d => d.depth==1))
    .enter()
    .append("text")
      .attr("x", d => d.x0)
      .attr("y",d => d.y0+21)
      .text(d => d.data.name)
      .attr("font-size", "19px")
      .attr("fill",  d => color(d.data.name) )

  // Add title for the 3 groups
  svg
    .append("text")
      .attr("x", 0)
      .attr("y", 14)    // +20 to adjust position (lower)
      .text("Attributes of suicide cases among 10 families")
      .attr("font-size", "23px")
      .attr("fill",  "grey" )

})
