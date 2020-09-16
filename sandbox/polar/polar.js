function init(){
    drawChart()
}

function drawChart(){
    
    var reMap = function(oldValue) {
        var oldMin = 0,
            oldMax = -359,
            newMin = 0,
            newMax = (Math.PI * 2),
            newValue = (((oldValue - 90 - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
        
        return newValue;
        
    }
  
    var data = [
    [reMap(25), 1, 10, 'label 1'],
    [reMap(105), 0.8, 10, 'label 2'],
    [reMap(266), 1, 10, 'label 3'],
    [reMap(8), 0.2, 10, 'label 4'],
    [reMap(189), 1, 10, 'label 5'],
    [reMap(350), 0.6, 10, 'label 6'],
    [reMap(119), 0.4, 10, 'label 7'],
    [reMap(305), 0.8, 10, 'label 8'],
    [reMap(0), 0, 10, 'center']
    ];
  
    var zoom = d3.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);

    function zoomed() {
        svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed("dragging", true);
    }

    function dragged(d) {
        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    }

    function dragended(d) {
        d3.select(this).classed("dragging", false);
    }


    var width = 600,
        height = 600,
        radius = Math.min(width, height) / 2 - 30; // radius of the whole chart

    var r = d3.scaleLinear()
        .domain([0, 1])
        .range([0, radius]);
  
    var svg = d3.select('.polar-chart').append('svg')
        .call(zoom)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    var gr = svg.append('g')
        .attr('class', 'r axis')
        .selectAll('g')
        .data(r.ticks(5).slice(1))
        .enter().append('g');

    gr.append('circle')
        .attr('r', r);

    var ga = svg.append('g')
        .attr('class', 'a axis')
        .selectAll('g')
        .data(d3.range(0, 360, 30)) // line density
        .enter().append('g')
        .attr('transform', function(d) {
            return 'rotate(' + -d + ')';
        });

    ga.append('line')
        .attr('x2', radius);
    
    var color = d3.schemeCategory10;

    var line = d3.lineRadial()
        .radius(function(d) {
            return r(d[1]);
        })
        .angle(function(d) {
            return -d[0] + Math.PI / 2;
        });

  var tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .text("a simple tooltip");
  
  svg.selectAll('point')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'point')
    .attr('transform', function(d) {
      //console.log(d);
  
      var coors = line([d]).slice(1).slice(0, -1); // removes 'M' and 'Z' from string
      return 'translate(' + coors + ')'
    })
    .attr('r', function(d) {
      return d[2];
    })
    .attr('fill',function(d,i){
      return color[i];
    }).on("click", function(d){
      console.log(d);
      
      //return tooltip.style("visibility", "visible");
    });
  
  
  
  // adding labels
  svg.selectAll('point')
    .data(data)
    .enter().append("text")
        .attr('transform', function(d) {
      //console.log(d);
  
      var coors = line([d]).slice(1).slice(0, -1); // removes 'M' and 'Z' from string
      return 'translate(' + coors + ')'
    })
        .text(function(d) {         
          return d[3]; 
        });   
}

init()