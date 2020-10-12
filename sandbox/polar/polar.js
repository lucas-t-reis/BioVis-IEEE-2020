var globalData
var numCircles = 5

var urlString = window.location.href
var url = new URL(urlString)
var urlId = url.searchParams.get('id')
var urlLimit = parseFloat(url.searchParams.get('limit'))

processData(urlId, urlLimit)

function processData(id, limit){
    d3.csv("../../dataset/filtered_data.csv").then(function(rows){
        
        var person, data = [], columns = rows.columns

        for(var i = 0; i < rows.length; i++){
            if(rows[i].personid == id){
                person = rows[i];
                break;
            }
        }

        for(var i = 0; i < rows.length; i++){
            
            var commonAttr = 0, totalAttr = 0, pos = data.length;
            data.push([0, 0, 5, rows[i].personid, '#ff0000', [], []]);

            for(var j in columns){
                if(columns[j] == 'suicide' || columns[j] == 'Age')
                    continue
                else if(columns[j] == 'personid' || columns[j] == 'sex'){
                    if(rows[i][columns[j]] == person[columns[j]]){
                        commonAttr++;
                        data[pos][5].push(columns[j]);
                    }
                    totalAttr++;
                }
                else if(rows[i][columns[j]] == 'True' || person[columns[j]] == 'True'){
                    if(rows[i][columns[j]] == person[columns[j]]){
                        commonAttr++;
                        data[pos][5].push(columns[j]);
                    }
                    else{
                        data[pos][6].push(columns[j]);
                    }
                    totalAttr++;
                }
            }

            if(rows[i].personid == person.personid)
                data[pos][4] = '#00bbbb';

            data[pos][1] = 1 - commonAttr/totalAttr

            if(1 - data[pos][1] < limit)
                data.pop()

            if(data.length > 0 && data[pos][3] == person.personid){
                for(var j = 0; j < data[pos][5].length; j++)
                    if(data[pos][5][j] != "personid")
                        d3.select("#attrSelect").append("option").html(data[pos][5][j]).attr("value", data[pos][5][j]);
            }
        }

        data.sort(function(a, b){ return a[1] - b[1]})

        var level = 0, idx = 0, levels = []

        while(level <= numCircles){
            
            levels.push([])
            
            while(idx < data.length && data[idx][1] <= level/numCircles){
                levels[level].push(idx)
                idx++
            }

            level++
        }

        for(var i = 0; i <= numCircles; i++){
            
            if(levels[i].length == 0)
                continue;
            
            var deg = 2 * Math.PI / levels[i].length

            for(var j = 1; j < levels[i].length; j++){
                
                var now = levels[i][j], last = levels[i][j - 1]
                
                data[now][0] = data[last][0] + deg
            }
        }

        //data = data.slice(0, last)
        
        globalData = data
        drawChart(data)
    })
}

function drawChart(data){

    //console.log(data);
    
    var reMap = function(oldValue) {
        var oldMin = 0,
            oldMax = -359,
            newMin = 0,
            newMax = (Math.PI * 2),
            newValue = (((oldValue - 90 - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
        
        return newValue;
        
    }
  
    // var zoom = d3.zoom()
    //     .scaleExtent([1, 10])
    //     .on("zoom", zoomed);

    // function zoomed() {
    //     svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    // }

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
  
    //svg.call(zoom)

    var svg = d3.select('.polar-chart').append('svg')
        .attr('id', 'polar-svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    var tip = d3.select('#tooltip');

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

    // var tooltip = d3.select("body")
    //     .append("div")
    //     .style("position", "absolute")
    //     .style("z-index", "10")
    //     .style("visibility", "hidden")
    //     .text("a simple tooltip");

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
        return d[4];
    }).on("click", function(d){

        tip.html("");

        tip.style('visibility', 'visible');

        tip.append('div')
        .html('Pessoa ' + d[3])
        .style('text-align', 'center')
        .style('font-weight', 'bold')
        .style('font-family', 'Arial')
        .style('margin-left', '10px')
        .style('margin-right', '10px');

        tip.append('div')
        .html('Similaridade: ' + (100 * (1 - d[1])).toFixed(2) + '%')
        .style('font-family', 'Arial')
        .style('margin-top', '10px')
        .style('margin-left', '10px')
        .style('margin-right', '10px');

        tip.append('div')
        .html('Atributos similares: ')
        .style('font-family', 'Arial')
        .style('margin-top', '10px')
        .style('margin-left', '10px')
        .style('margin-right', '10px');

        var similar = tip.append('ul');

        for(var i = 0; i < d[5].length; i++)
            similar.append('li')
            .html(d[5][i]);

        tip.append('div')
        .html('Atributos diferentes: ')
        .style('font-family', 'Arial')
        .style('margin-top', '10px')
        .style('margin-left', '10px')
        .style('margin-right', '10px');

        var similar = tip.append('ul');

        for(var i = 0; i < d[6].length; i++)
            similar.append('li')
            .html(d[6][i]);

        tip.append('div')
        .style('text-align', 'center')
        .append('a')
        .html('Analisar essa pessoa')
        .attr('href', url.pathname + '?id=' + d[3] + '&limit=' + urlLimit)
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

function changeLimit(){
    
    var limit = d3.select('#limitInput').property('value');
    var svg = d3.select('#polar-svg');

    if(limit < 0)
        limit = 0
    if(limit > 100)
        limit = 100

    document.getElementById('limitInput').value = limit;

    svg.selectAll('.point')
    .data(globalData)
    .attr('visibility', function(d){
        return ((1 - d[1]) < (limit/100.0) ? 'hidden' : 'visible');
    });
}

function changeAttr(){
    
    var option = d3.select('#attrSelect').property('value');
    var svg = d3.select('#polar-svg');

    svg.selectAll('.point')
    .data(globalData)
    .attr('fill', function(d){
        if(option == 'none')
            return '#ff0000';
        return (d[5].includes(option) ? '#ff0000' : '#cccccc');
    })
    .attr('z-index', function(d){
        if(option == 'none')
            return '100';
        return (d[5].includes(option) ? '100' : '99');
    });
}