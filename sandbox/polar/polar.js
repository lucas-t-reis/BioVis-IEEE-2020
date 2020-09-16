var globalData
var numCircles = 5

processData(47434)

//TODO:
// Cores nas familias
// Adicionar limite de similaridade

function processData(id){
    d3.csv("../../dataset/question3.csv").then(function(rows){
        
        var person, data = [], columns = rows.columns, level = 0, last = 0

        for(var i = 0; i < rows.length; i++){
            if(rows[i].personid == id){
                person = rows[i];
                break;
            }
        }

        for(var i = 0; i < rows.length; i++){
            
            var commonAttr = 0, totalAttr = 0
            data.push([0, 0, 5, rows[i].personid]);

            for(var j in columns){
                if(columns[j] == 'suicide' || columns[j] == 'Age')
                    continue
                else if(columns[j] == 'personid' || columns[j] == 'kindredId' || columns[j] == 'sex'){
                    if(rows[i][columns[j]] == person[columns[j]])
                        commonAttr++;
                    totalAttr++;
                }
                else if(rows[i][columns[j]] == 'True'){
                    if(person[columns[j]] == 'True')
                        commonAttr++;
                    totalAttr++;
                }
            }

            data[i][1] = 1 - commonAttr/totalAttr
        }

        data.sort(function(a, b){ return a[1] - b[1]})

        for(var i = 0; i < data.length; i++){
            if(data[i][1] > level/numCircles){
                
                var deg = 2 * Math.PI/(i - last)
                
                for(var j = last + 1; j < i; j++)
                    data[j][0] = data[j - 1][0] + deg 
                
                last = i
                level++
            }
        }

        var deg = 2 * Math.PI/(data.length - last)
                
        for(var j = last + 1; j < data.length; j++)
            data[j][0] = data[j - 1][0] + deg 

        //data = data.slice(0, last)
        
        console.log(data)

        globalData = data
        drawChart(data)
    })
}

function drawChart(data){
    
    var reMap = function(oldValue) {
        var oldMin = 0,
            oldMax = -359,
            newMin = 0,
            newMax = (Math.PI * 2),
            newValue = (((oldValue - 90 - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
        
        return newValue;
        
    }
  
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
        .data(r.ticks(numCircles).slice(1))
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
      return 'red';
    }).on("click", function(d){
      //console.log(d);
      
      //return tooltip.style("visibility", "visible");
    });
  
  
  
//   // adding labels
//   svg.selectAll('point')
//     .data(data)
//     .enter().append("text")
//         .attr('transform', function(d) {
//       //console.log(d);
  
//       var coors = line([d]).slice(1).slice(0, -1); // removes 'M' and 'Z' from string
//       return 'translate(' + coors + ')'
//     })
//         .text(function(d) {         
//           return d[3]; 
//         });   
}