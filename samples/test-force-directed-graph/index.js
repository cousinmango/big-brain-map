/* global d3 */


"use strict";

/**
 *
 * @param {string} dataPath
 */
async function getData(dataPath = "./seed/miserables.json") {
  const responseData = fetch(dataPath).then((response) => response.json());
  const jsonData = responseData;

  return jsonData;
}

/* eslint no-undef: ["error"] */

/**
 *
 * @param {d3.Simulation<d3.SimulationNodeDatum>} simulation
 * @return {d3.DragBehavior<Element, any, any>} drag configuration
 */
function getDragBehaviour(simulation) {
  /**
   *
   * @param {MouseEvent} event
   */
  function dragStarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  /**
   *
   * @param {MouseEvent} event
   */
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  /**
   *
   * @param {MouseEvent} event
   */
  function dragEnded(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3
    .drag()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded);
}

const height = window.innerHeight;
const width = window.innerWidth;
/**
 * Scales the data node .group value into arbitrary hexadecimal strings 
 * (for colour values)
 * e.g 1 = #00000 2 = #1f1f1f 10 = #ffffff
 * @return {d3.ValueFn<
 * Element | Window | Document | d3.EnterElement | SVGCircleElement,
 * any,
 * string | number | boolean
 * >}
 */
function color() {
  // An array of ten categorical colors represented as RGB hexadecimal strings.
  const scale = d3.scaleOrdinal(d3.schemeCategory10);

  return (d) => scale(d.group);
}


/**
 * Does something to the selection using 
 * (should be triggered on the zoom event)
 * @param {d3.Selection<
 *  SVGSVGElement, any, HTMLElement, any
 *  >} gSelection overall viewbox group
 * @param {Element} elementToTransform hmm
 * @param {d3.ValueFn<GElement, Datum, string | number | boolean>} param1 not
 *  sure what this is yet.
 */
function zoomed(gSelection, { transform }) {
  gSelection.attr("transform", transform);
}

/**
 * Do the chart!
 * @param {*} data give the fetched json data ez plug in for flat webpage
 *
 * @return {SVGSVGElement} This is a weird element.
 */
function chart(data) {
  const links = data.links.map((d) => Object.create(d));
  const nodes = data.nodes.map((d) => Object.create(d));

  // Mutato potato
  // Any number here as it is unused, overridden by the node-radius function
  const collisionation = d3.forceCollide(0);
  const raddddd = collisionation.radius(({ id }) => id.length * 5)

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(1)

    )
    .force("charge", d3.forceManyBody().strength(-500))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collisionForce", raddddd);

  /*
    Remember to append the generated svg onto a page element
    (
      Observable HQ notebook depends cells and other auto-handling for
      visualisation
    )
  */
  const svg = d3
    .select("body")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const g = svg.append("g");

  const link = g
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (d) => Math.sqrt(d.value));

  const node = g
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("id", (d) => d.id)
    .attr("r", (d) => d.id.length * 4)
    .attr("fill", color())
    .call(getDragBehaviour(simulation));

  const label = g
    .append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .text((d) => d.id)
    .attr("fill", "black")
    .attr("dy", "0em")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .call(getDragBehaviour(simulation));

  node.append("title").text((d) => d.id);


  /**
   * Do something on the zoom event
   * @param {Element} elementToTransform element to attr
   * @param {Event} event uhh
   * @param {Datum} d d3 datum?
   * @return {void} not sure
   */
  const zoomie = (elementToTransform) => zoomed(g, elementToTransform);

  /**
   * @type {d3.ZoomBehavior<Element, any>}
   */
  const zoomBehaviour = svg.call(d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([0.1, 8])
    // "start", "zoom", "end"
    .on("zoom", zoomie));

  zoomBehaviour;

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    label.attr("x", (d) => d.x).attr("y", (d) => d.y);
  });

  return svg.node();
}

getData()
  .then(chart)
  .catch((reason) => console.error(`Something went horribly wrong`, reason));
