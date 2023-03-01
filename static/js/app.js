// Define a global variable to hold the loaded data
var data;

// Use D3 library to read in samples.json
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(jsonData) {
  // Assign the loaded data to the global variable
  data = jsonData;

function init() {

  // Get a reference to the dropdown select element
  var dropdown = d3.select("#selDataset");
  
  // Loop through the samples array and append an option for each id
  data.samples.forEach(function(sample) {
    dropdown.append("option")
      .text(sample.id)
      .property("value", sample.id);
  });
  var firstSample = data.samples[0].id;
  optionChanged(firstSample);
}
init();
});

function optionChanged(selectedID) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(jsonData) {

data = jsonData

    // Filter the samples array to find the object with the selected ID
    var selectedSample = data.samples.filter(sample => sample.id === selectedID)[0];
    
    // Filter the metadata array to find the object with the selected ID
    var selectedMetadata = data.metadata.filter(metadata => metadata.id === parseInt(selectedID))[0];

    // Select the "sample-metadata" div
    var sampleMetadata = d3.select("#sample-metadata");

    // Clear the existing content
    sampleMetadata.html("");

    // Append a new paragraph for each key-value pair in the selected metadata object
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      sampleMetadata.append("p").text(`${key}: ${value}`);
    });

    // Get the top ten otu_ids and sample_values
    var topTenIDs = selectedSample.otu_ids.slice(0, 10).reverse();
    var topTenValues = selectedSample.sample_values.slice(0, 10).reverse();
    var topTenLabels = selectedSample.otu_labels.slice(0, 10).reverse();
  
    // Create a trace for the horizontal bar chart
    var trace1 = {
      x: topTenValues,
      y: topTenIDs.map(id => `OTU ${id}`),
      text: topTenLabels,
      type: "bar",
      orientation: "h"
    };
  
    // Create the data array for the plot
    var data = [trace1];
  
    // Define the layout for the plot
    var layout = {
      title: `Top Ten OTUs for Subject ${selectedID}`,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };

    // Create the horizontal bar chart using Plotly
    Plotly.newPlot("bar", data, layout);

    // Create a trace for the bubble chart
    var trace2 = {
      x: topTenIDs,
      y: topTenValues,
      text: topTenLabels,
      mode: 'markers',
      marker: {
        size: topTenValues,
        color: topTenIDs,
        colorscale: 'Earth'
      }
    };

    // Create the data array for the plot
    var data2 = [trace2];

    // Define the layout for the plot
    var layout2 = {
      title: `OTUs for Subject ${selectedID}`,
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };

    // Create the bubble chart using Plotly
    Plotly.newPlot("bubble", data2, layout2);

  })
};
  