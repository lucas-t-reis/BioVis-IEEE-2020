var target
var persons = []
var attrCount = {}
var similarAttr = {}
var maxSim = 0
var tooltip = d3.select("#tooltip")

function processRelatives(id){
    d3.csv("../../dataset/TenFamiliesStructure.csv").then(function(data){
        
        parents = [-1, -1]
        
        for(var i = 0; i < data.length; i++){
            if(data[i].personid == id || data[i].MaID == id || data[i].PaID == id){

                var type = (data[i].personid == id ? "target" : "child")

                persons.push(
                    {
                        personid: data[i].personid,
                        mother: data[i].MaID,
                        father: data[i].PaID,
                        sex: data[i].sex,
                        suicide: data[i].suicide,
                        age: data[i].Age,
                        attributes: [],
                        type: type
                    }
                )

                similarAttr[data[i].personid] = 0

                if(data[i].personid == id){
                    parents[0] = (data[i].MaID == "0" ? -1 : data[i].MaID)
                    parents[1] = (data[i].PaID == "0" ? -1 : data[i].PaID)
                    target = persons[persons.length - 1]
                }
            }
        }

        for(var i = 0; i < data.length; i++){
            
            if(data[i].personid == parents[0] || data[i].personid == parents[1] || data[i].MaID == parents[0] || data[i].PaID == parents[1]){

                if(data[i].personid == id)
                    continue
                
                var type = (data[i].personid == parents[0] || data[i].personid == parents[1] ? "parent" : "sibling")

                persons.push(
                    {
                        personid: data[i].personid,
                        mother: data[i].MaID,
                        father: data[i].PaID,
                        sex: data[i].sex,
                        suicide: data[i].suicide,
                        age: data[i].Age,
                        attributes: [],
                        type: type
                    }
                )

                similarAttr[data[i].personid] = 0
            }
        }

        processAttributes()
    });
}

function processAttributes(){
    d3.csv("../../dataset/question3.csv").then(function(data){
        
        for(var i = 0; i < data.length; i++){
            for(var j = 0; j < persons.length; j++){
                if(data[i].personid == persons[j].personid){
                    for(var key in data[i]){
                        if(key != "suicide" && data[i][key] == "True"){
                            persons[j].attributes.push(key)
                            attrCount[key] = 0
                            if(data[i].personid == target.personid)
                                target.attributes.push(key)
                        }
                    }
                }
            }
        }

        for(var i = 0; i < persons.length; i++)
            for(var j = 0; j < persons[i].attributes.length; j++)
                attrCount[persons[i].attributes[j]]++
        
        for(var i = 0; i < persons.length; i++){
            for(var j = 0; j < persons[i].attributes.length; j++){
                if(target.attributes.includes(persons[i].attributes[j]))
                    similarAttr[persons[i].personid]++
            }
            if(target.sex == persons[i].sex)
                similarAttr[persons[i].personid]++
            if(target.personid != persons[i].personid)
                maxSim = (maxSim < similarAttr[persons[i].personid] ? similarAttr[persons[i].personid] : maxSim)
        }

        generateCharts()
    });
}

function generateCharts(){
    var divPar = d3.select('#parents-container')
    var divSib = d3.select('#siblings-container')
    var divChi = d3.select('#children-container')

    var cntPar = 0
    var cntSib = 0
    var cntChi = 0

    var colors = ["#C62017", "#A9CCD1", "#EAD833"]

    for(var i = 0; i < persons.length; i++){
        
        var fig = {}

        fig.idx = i

        fig.shape = (persons[i].sex == 'M' ? 'rect' : 'circle')
        fig.fill = (persons[i].suicide == 'Y' ? colors[0] : colors[1])
        fig.opacity = 1
        fig.width = 100

        if(maxSim != 0)
            fig.opacity = 0.25 + (similarAttr[persons[i].personid] + 1)/(maxSim + 1) * 0.75

        if(persons[i].type == 'parent'){
            fig.x = (fig.width + 20) * cntPar
            cntPar++
            add(divPar, fig)
        }
        else if(persons[i].type == 'sibling'){
            fig.x = (fig.width + 20) * cntSib
            cntSib++
            add(divSib, fig)
        }
        else if(persons[i].type == 'child'){
            fig.x = (fig.width + 20) * cntChi
            cntChi++
            add(divChi, fig)
        }
        else if(persons[i].type == 'target'){
            fig.fill = colors[2]
            fig.x = (fig.width + 20) * cntSib
            cntSib++
            add(divSib, fig)
        } 
    }

    if(cntPar > 0) 
        divPar.selectAll("svg").attr("width", (fig.width + 20) * cntPar - 20).attr("height", fig.width)
    if(cntSib > 0) 
        divSib.selectAll("svg").attr("width", (fig.width + 20) * cntSib - 20).attr("height", fig.width)
    if(cntChi > 0)
        divChi.selectAll("svg").attr("width", (fig.width + 20) * cntChi - 20).attr("height", fig.width)
}

function add(div, fig){
    if(fig.shape == 'rect'){
        div.selectAll("svg")
        .append("g")
        .append("rect")
        .attr("x", fig.x)
        .attr("y", 0)
        .attr("width", fig.width)
        .attr("height", fig.width)
        .attr("fill", fig.fill)
        .attr("opacity", fig.opacity)
        .on("mouseover", function(){ setTooltip(fig.idx, d3.event)})
        .on("mouseout", function(){ tooltip.style("visibility", "hidden")})
    }
    else{
        div.selectAll("svg")
        .append("g")
        .append("circle")
        .attr("cx", fig.x + fig.width/2)
        .attr("cy", fig.width/2)
        .attr("r", fig.width/2)
        .attr("fill", fig.fill)
        .attr("opacity", fig.opacity)
        .on("mouseover", function(){ setTooltip(fig.idx, d3.event)})
        .on("mouseout", function(){ tooltip.style("visibility", "hidden")})
    }
}

function setTooltip(idx, event){
    
    tooltip.html("")
    
    var table = tooltip.append('table')
    var thead = table.append('thead')
    var tbody = table.append('tbody')

    thead.append('th').html('Person ' + persons[idx].personid + ' Attributes')
    thead.append('th').html('Target (' + target.personid + ') Attributes')
    thead.append('th').html('Common Attributes')

    var tr = tbody.append('tr')
    
    var td1 = tr.append('td')
    var ul1 = td1.append('ul')

    ul1.append('li').html(persons[idx].sex == 'M' ? 'Male' : 'Female')

    for(var i = 0; i < persons[idx].attributes.length; i++)
        ul1.append('li').html(persons[idx].attributes[i])

    var td2 = tr.append('td')
    var ul2 = td2.append('ul')

    ul2.append('li').html(target.sex == 'M' ? 'Male' : 'Female')

    for(var i = 0; i < target.attributes.length; i++)
        ul2.append('li').html(target.attributes[i])

    var td3 = tr.append('td')
    var ul3 = td3.append('ul')

    if(persons[idx].sex == target.sex)
        ul3.append('li').html(target.sex == 'M' ? 'Male' : 'Female')

    for(var i = 0; i < persons[idx].attributes.length; i++)
        if(target.attributes.includes(persons[idx].attributes[i]))
            ul3.append('li').html(persons[idx].attributes[i])
    
    tooltip
    .style('left', (event.pageX - 34) + 'px')
    .style('top', (event.pageY - 12) + 'px')
    .style('background-color', 'white')
    .style('visibility', 'visible');
}