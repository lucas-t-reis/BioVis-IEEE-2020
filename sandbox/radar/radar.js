var radarChart

function renderChart(attributes, families) {
    var ctx = document.getElementById("radarChart").getContext('2d');
    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: attributes,
            datasets: families
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                enabled: true,
                callbacks:{
                    label: function (tooltipItems, data) {
                        return  tooltipItems.yLabel.toFixed(2) + " %";
                    }
                }
            },
        }
    });
}

function processData(data){

        var attributes = Object.keys(data[0]).filter(function(key){ return !['personid', 'KindredID', 'suicide', 'sex', 'Age'].includes(key) })
        var families = []
        
        var familyAttributes = {}
        var familySuicideCont = {}

        var color = []

        for(var i = 0; i < data.length; i++){    
            familyAttributes[data[i].KindredID] = Array(attributes.length).fill(0)
            familySuicideCont[data[i].KindredID] = 0
        }

        color = palette('mpn65', Object.keys(familyAttributes).length).map(function(hex){ return '#' + hex })
        console.log(color)

        for(var i = 0; i < data.length; i++){
            for(var j = 0; j < attributes.length; j++){
                if(data[i][attributes[j]] == 'True')
                    familyAttributes[data[i].KindredID][j]++;
            }
            familySuicideCont[data[i].KindredID]++
        }


        var c = 0

        for(var id in familyAttributes){
            
            var obj = {
                label: id,
                data: [],
                borderColor: color[c],
                pointBackgroundColor: color[c],
                backgroundColor: "transparent",
                fill: false,
                radius: 4,
                pointRadius: 4,
                pointBorderWidth: 3,
            }

            for(var i = 0; i < attributes.length; i++)
                obj.data.push((100 * familyAttributes[id][i] / familySuicideCont[id]).toFixed(2))

            families.push(obj)
            c++
        }

        renderChart(attributes, families);
}

$("#renderBtn").click(
    Papa.parse('../../dataset/question3.csv', {
        header: true,
        download: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            processData(results.data)
        }
    })
);