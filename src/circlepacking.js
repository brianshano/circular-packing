// set the dimensions and margins of the graph
var width = 450;
var height = 450;

// append the svg object to the body of the page
var svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", 450)
  .attr("height", 450)
  .style("font", "10px sans-serif")
  .style("overflow", "visible")
  .attr("text-anchor", "middle");

// Read data
d3.csv("../data.csv", function(data) {
  console.log("data", data);

  const size = d3
    .scaleLinear()
    .domain([0, 1000])
    .range([9, 150]);

  const Tooltip = d3
    .select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  const mouseover = d => {
    Tooltip.style("opacity", 1);
  };

  const mousemove = d => {
    Tooltip.html(`<u>${d.appliance}</u><br>${d.value} W`)
      .style("left", d3.event.pageX + 20 + "px")
      .style("top", d3.event.pageY - 30 + "px");
  };

  const mouseleave = d => {
    Tooltip.style("opacity", 0);
  };
  // Initialize the circle: all located at the center of the svg area
  const node = svg
    .append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", d => {
      return size(d.value);
    })
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .style("fill", "#69b3a2")
    .style("fill-opacity", 0.3)
    .attr("stroke", "#69a2b2")
    .style("stroke-width", 4)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
  // .call(
  //   d3
  //     .drag() // call specific function when circle is dragged
  //     .on("start", dragstarted)
  //     .on("drag", dragged)
  //     .on("end", dragended)
  // );
  node
    .append("title")
    //     .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}
    // ${d.value.toLocaleString()}`);
    .text("test");
  // Features of the forces applied to the nodes:
  const simulation = d3
    .forceSimulation()
    .force(
      "center",
      d3
        .forceCenter()
        .x(width / 2)
        .y(height / 2)
    ) // Attraction to the center of the svg area
    .force("charge", d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
    .force(
      "collide",
      d3
        .forceCollide()
        .strength(0.01)
        .radius(30)
        .iterations(1)
    ); // Force that avoids circle overlapping

  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
  simulation.nodes(data).on("tick", function(d) {
    node
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      });
  });
});
