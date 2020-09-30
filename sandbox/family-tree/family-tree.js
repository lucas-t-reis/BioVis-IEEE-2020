var persons = []
var attrCount = {}

function processRelatives(id){
    d3.csv("../../dataset/TenFamiliesStructure.csv").then(function(data){
        
        persons = []
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

                if(data[i].personid == id){
                    parents[0] = (data[i].MaID == "0" ? -1 : data[i].MaID)
                    parents[1] = (data[i].PaID == "0" ? -1 : data[i].PaID)
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
                        }
                    }
                }
            }
        }

        for(var i = 0; i < persons.length; i++)
            for(var j = 0; j < persons[i].attributes.length; j++)
                attrCount[persons[i].attributes[j]]++
        
        generateCharts()
    });
}

function generateCharts(){
    console.log(persons)
    console.log(attrCount)
}
