// SELECTION AND MANIPULATION

// d3.select();
// d3.selectAll();

// d3.select("h1")
//   .style("color", "red")
//   .attr("class", "heading")
//   .text("Updated h1 tag");

// d3.select("body").append("p").text("First Paragraph");
// d3.select("body").append("p").text("Second Paragraph");
// d3.select("body").append("p").text("Third Paragraph");

// d3.selectAll("p").style("color", "blue");

// DATA LOADING AND BINDING

// var dataset = [1, 2, 3, 4, 5];

// d3.select("body")
//   .selectAll("p")
//   .data(dataset)
//   .enter()
//   .append("p") // appends paragraph for each data element
//   .text("D3 is awesome!!")
//   .text(function (d) {
//     return d;
//   });

// BAR CHART, LABELS, SCALES

var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];

var svgWidth = 500,
  svgHeight = 300,
  barPadding = 5;
var barWidth = svgWidth / dataset.length;

var svg = d3.select("svg").attr("width", svgWidth).attr("height", svgHeight);

var yScale = d3
  .scaleLinear()
  .domain([0, d3.max(dataset)])
  .range([0, svgHeight]);

var barChart = svg
  .selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("y", function (d) {
    return svgHeight - yScale(d);
  })
  .attr("height", function (d) {
    return yScale(d);
  })
  .attr("width", barWidth - barPadding)
  .attr("transform", function (d, i) {
    var translate = [barWidth * i, 0];
    return "translate(" + translate + ")";
  });

var text = svg
  .selectAll("text")
  .data(dataset)
  .enter()
  .append("text")
  .text(function (d) {
    return d;
  })
  .attr("y", function (d, i) {
    return svgHeight - d - 2;
  })
  .attr("x", function (d, i) {
    return barWidth * i;
  })
  .attr("fill", "#A64C38");

// AXES

// var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];

// var svgWidth = 500,
//   svgHeight = 300;

// var svg = d3.select("svg").attr("width", svgWidth).attr("height", svgHeight);

// var yScale = d3
//   .scaleLinear()
//   .domain([0, d3.max(dataset)])
//   .range([svgHeight, 0]);

// var xScale = d3
//   .scaleLinear()
//   .domain([0, d3.max(dataset)])
//   .range([0, svgWidth]);

// var x_axis = d3.axisBottom().scale(xScale);
// var y_axis = d3.axisLeft().scale(yScale);

// svg.append("g").attr("transform", "translate(50, 10)").call(y_axis);

// var xAxisTranslate = svgHeight - 20;

// svg
//   .append("g")
//   .attr("transform", "translate(50, " + xAxisTranslate + ")")
//   .call(x_axis);

// SVG ELEMENTS

// var svgWidth = 600,
//   svgHeight = 500;
// var svg = d3
//   .select("svg")
//   .attr("width", svgWidth)
//   .attr("height", svgHeight)
//   .attr("class", "svg-container");

// var line = svg
//   .append("line")
//   .attr("x1", 100)
//   .attr("x2", 500)
//   .attr("y1", 50)
//   .attr("y2", 50)
//   .attr("stroke", "red")
//   .attr("stroke-width", 5);

// var rect = svg
//   .append("rect")
//   .attr("x", 100)
//   .attr("y", 100)
//   .attr("width", 200)
//   .attr("height", 100)
//   .attr("fill", "#9B95FF");

// var circle = svg
//   .append("circle")
//   .attr("cx", 200)
//   .attr("cy", 300)
//   .attr("r", 80)
//   .attr("fill", "#7CE8D5");
