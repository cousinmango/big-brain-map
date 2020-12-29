/*
- FIXME: Remember to enable this later 
// @ts-check
*/
/* global d3 */

"use strict";

/**
 *
 * @param {string} dataPath
 * @return {MiserableNodesLinks}
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
    .call(getDragBehaviour(simulation))
    .on("click", clicked);

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
  const zoom = d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([0.1, 8])
    // "start", "zoom", "end"
    .on("zoom", zoomie);

  // allow free zooming/panning
  svg.call(zoom);

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    label.attr("x", (d) => d.x).attr("y", (d) => d.y);
  });

  /**
   * @param event
   * @param d
   */
  function clicked(event, d) {

    /**
     * @type {string}
     */
    const escapedID = '#' + CSS.escape(d.id);

    console.log(`clicked: ${d3.select(escapedID).attr("id")}`);
    const translate = [width / 2, height / 2];

    svg.transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(
          translate[0] -
          d3.select(escapedID)
            .attr("cx")
          ,
          translate[1] -
          d3.select(escapedID)
            .attr("cy")
        )
      ); // updated for d3 v4
  }

  return svg.node();
}


/**
 * Node definition
 * @example {id: 1, group: 1}
 * 
 * - TODO: Move these to another file and use some jsdoc comments to find the path resolution of type???? or make a @types file
 * Nodes positions are defined dynamically through physic simulation downstream with relation to link strength
 */
class HappyNode {
  /**
   * @member
   * @type {string} 
   * naive key
   * 
   * The name of the node
   * Also should be unique
   * This will break if someone wants to add another node 
   * 
   * - TODO: This should eventually be migrated to a standard unique ID integer or UUID
   */
  id;

  /**
   * @type {number} 
   * 
   * Group number
   *  Also being used as naive key
   *  Colour groupings
   */
  group;
}

/**
 * Link definition for plotting D3 strokes
 * The positive strength of `value` determines how nodes are positioned in relation to each other
 * when warmed up in the physics simulation
 * 
 */
class HappyLink {
    /**
     * The id name of the linked source node
     * @member
     * @type {string}
     **/
    source;
    /**
     * The target that the source is linked to
     * @member {string}
     * @type {string}
     */
    target;

    /**
     * The strength of the relationship.
     * @member {number}
     * @type {number} 
     * 
     */
    value;
}
/** @type {HappyNode} */

class MiserableNodesLinks {
  
  /**
   * @member {number}
   */

  /**
   * constructor description
   * @param  {[number} config [description]
   */
  constructor(config) {
    // class members. Should be private. 
    /** @private 
     * @type {number}
     **/
    this.nodes = config;
    /** @private */
    this.links = "bananas";
  }
}
/**
 * @param {{
 *  nodes: [
 *    {
 *      id: string,
 *      group: string
 *    }
 *  ],
 *  links: [
 *    {
 *      source: string,
 *      target: string,
 *      value: string,   
 *    }
 *  ]
 * }} theMiserableDataNodesLinks Assumed not undefined null
 * 
 * @param {HappyNode} newNode
 * @param {HappyLink} newLink
 * 
 * @return {{
 *  nodes: [
  *    {
  *      id: string,
  *      group: string
  *    }
  *  ],
  *  links: [
  *    {
  *      source: string,
  *      target: string,
  *      value: string,   
  *    }
  *  ]
  * }} the new object with nodes array and links array properties
 */
function addSomeJsonNode(theMiserableDataNodesLinks, newNode, newLink) {
  theMiserableDataNodesLinks.nodes.push(newNode);
  theMiserableDataNodesLinks.links.push(newLink);
  
  return theMiserableDataNodesLinks;
}



/** @type {HappyNode} */
const newNode = {id: "id", group: 1};
/** @type {HappyLink} */
const newLink = {source: "Combeferre", target: "id", value: 1000};

getData()
  .then((data) => addSomeJsonNode(data, newNode, newLink))
  .then(chart)
  .catch((reason) => console.error(`Something went horribly wrong`, reason));


/* 
  var mutableCounterOhNo = 1;

  const recurseThisForeverTestAddStuffChart = setInterval(() => {
    getData()
    .then((data) => { 

      const someNumberOfElementsToDoThings = Array.from({length: mutableCounterOhNo});

      someNumberOfElementsToDoThings.forEach(() => addSomeJsonNode(data, newNode, newLink));


      mutableCounterOhNo += 1;

      return data;
    })
    .then(chart)
    .catch((reason) => console.error(`Something went horribly wrong`, reason));
  },
  2000
  )
*/