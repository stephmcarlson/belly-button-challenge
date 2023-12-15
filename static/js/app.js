// Get the JSON
const study = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Create drop down to allow selection of participant

function init() {

    const dropDown = d3.selectAll("#selDataset")
    d3.json(study).then(function (data) {
        const names = data.names;
        for (let i = 0; i < names.length; i++) {
            dropDown.append('option').text(names[i]).property('value', names[i]);
        }
        buildCharts(names[0])
        buildMetadata(names[0])
    });
}


// Creating charts based on selected data

function buildCharts(sample_id) {
    d3.json(study).then(function (data) {


        const samples = data.samples;
        const sample = samples.filter(element => element.id == sample_id)[0];
        let final = sample.sample_values.slice(0, 10).reverse()
        let otuIds = sample.otu_ids.slice(0, 10).map(row => `OTU ${row}`).reverse()
        let otuLabel = sample.otu_labels.slice(0, 10).reverse()

        plot = [{
            x: final,
            y: otuIds,
            text: otuLabel,
            type: 'bar',
            orientation: 'h'
        }];

        Plotly.newPlot("bar", plot);

        var trace1 = {
            x: sample.otu_ids,
            y: sample.sample_values,
            text: sample.otu_labels,
            mode: 'markers',
            marker: {
              color: sample.otu_ids,
              size: sample.sample_values,
              colorscale: 'Earth'
            }
          };
          
          var data = [trace1];
          
          var layout = {
            title: 'Bacteria Cultures',
            showlegend: false
            };
          
          Plotly.newPlot('bubble', data, layout);



    });


}

// Create demographic card with participant information

function buildMetadata (sample_id){
    d3.json(study).then(function (data) {


        const demographicdata = data.metadata;
        const metadata = demographicdata.filter(element => element.id == sample_id)[0];
        const panel = d3.select('#sample-metadata')
        panel.html("")
        for (key in metadata){
            panel.append('h5').text(`${key.toUpperCase()}: ${metadata[key]}`)
        }
    });

}

//Initialize page and call functions to build charts and information

init();
function optionChanged(newsample) {
    buildCharts(newsample)
    buildMetadata(newsample)
}