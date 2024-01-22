// Read in samples.json from the URL
const samples = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Declare the global variables used to represent the data needed for the charts

let sampleInfo;
let sampleMetadata;
let sampleData;
let otu_ids;
let otu_labels;
let sample_values;
let firstTime;


// Promise Pending
const dataPromise = d3.json(samples);

dataPromise.then(function(data) {
    console.log("Loaded Data: ", data); 
    })
  .catch(function(error) {
    console.error('Error fetching JSON:', error);
  });

// Initialize the dashboard and create dropdown menu options
// Create a function to initiate the dashboard and fill the drop down menu values
function init() {
    // Select and populate the dropdown menu 
    let dropdownMenu = d3.select("#selDataset");

    //Retrieve the data 
    d3.json(samples).then((data) => {
        // Set variable to sample names
        let names = data.names

        // Iterate through the name ids and log the id, append each id to the dropdown menu
        names.forEach((id) => {
            console.log(id);
            dropdownMenu.append("option").text(id).property("value", id);
        });

        // Retrieve first dropdown value data for default charts (sampleData) and for metadata
      
        sampleInfo = data.samples;
        sampleMetadata = data.metadata;

        let sampleData =sampleInfo[0];
        let sampleDataMetadata = sampleMetadata[0];
        console.log(sampleData);
        console.log(sampleDataMetadata);

        // Create default plots during initiation (these functions will be created below)

        // Get the otu_ids, lables, and sample values
        otu_ids = sampleData.otu_ids;
        otu_labels = sampleData.otu_labels;
        sample_values = sampleData.sample_values;

        displayMetadata(sampleDataMetadata);
        barChart();
        bubbleChart();
        //gaugeChart(data);


        console.log(otu_ids,otu_labels,sample_values);
    
})};

// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", optionChanged);

// This function is called when a dropdown menu item is selected
function optionChanged() {
  // Use D3 to select the dropdown menu
  let dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  let sampleId = dropdownMenu.property("value");

  let value = sampleInfo.filter(result => result.id == sampleId);
  sampleData = value[0];
  let metaValue = sampleMetadata.filter(result => result.id == sampleId);
  sampleDataMetadata = metaValue[0];
 
  // Get the otu_ids, lables, and sample values
  otu_ids = sampleData.otu_ids;
  otu_labels = sampleData.otu_labels;
  sample_values = sampleData.sample_values;

  displayMetadata(sampleDataMetadata);
  barChart();
  bubbleChart();
  //gaugeChart(data);

  console.log(otu_ids,otu_labels,sample_values);
};

// Create a function to display the metadata

function displayMetadata(sampleDataMetadata) {

  // Define the variable metadata
  d3.select("#sample-metadata").html("");

  // Add each key/value pair to the display
  Object.entries(sampleDataMetadata).forEach(([key,value]) => {  
    d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
  });

};

// Create a function to create the bar chart 
function barChart() {
    //Set the top ten items to be displayed in descending order
    let yAxis = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
    let xAxis = sample_values.slice(0,10).reverse();
    let labels = otu_labels.slice(0,10).reverse();
    
    var data = [{
        type: 'bar',
        x: xAxis,
        y: yAxis,
        text: labels,
        orientation: 'h'
      }];
    let layout = {
        title: "Top 10 OTUs Present"
    };
      
      Plotly.newPlot('bar', data, layout);
};

// Create a function to create the bubble chart
function bubbleChart() {
  //Set the top ten items to be displayed in descending order
  let xAxis = otu_ids;
  let yAxis = sample_values;
  let labels = otu_labels;
  
  var data = [{
      type: 'scatter',
      mode: 'markers',
      x: xAxis,
      y: yAxis,
      text: labels,
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];
  var layout = {
      title: "Bacteria Per Sample",
      hovermode: "closest",
      height: 600,
      width: 1000,
      xaxis: {title: "OTU ID"}
  };
    
    Plotly.newPlot('bubble', data, layout);
};

init();
