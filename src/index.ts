// @ts-check

export interface HappyNode {
  id: string;
  group: number;
}

export interface HappyLink {
  source: string;
  target: string;
  value: number;
}

/* eslint-enable no-unused-vars */

/**
 * @param {MiserableNodesLinks} theMiserableDataNodesLinks
 * Assumed not undefined null
 *
 * @param {HappyNode} newNode
 * @param {HappyLink} newLink
 *
 * @return {{
 *  nodes:
 *    {
 *      id: string,
 *      group: number
 *    }[]
 *  ,
 *  links:
 *    {
 *      source: string,
 *      target: string,
 *      value: number,
 *    }[]
 *
 * }} the new object with nodes array and links array properties
 */

export interface MiserableNodesLinks {
  nodes: HappyNode[];
  links: HappyLink[];
}

/*
- FIXME: Remember to enable this later
*/
/* global d3 */

/**
 *
 * @param {string} dataPath
 * @return {Promise<MiserableNodesLinks>}
 */
async function getData(dataPath = './seed/miserables.json') {
  const responseData = fetch(dataPath).then((response) => response.json());
  const jsonData = responseData;

  return jsonData;
}

/* eslint no-undef: ["error"] */

// eslint-disable-next-line valid-jsdoc
/**
 *
 * @param {d3.Simulation<d3.SimulationNodeDatum>} simulation
 * @return {d3.DragBehavior<
 *  Element | Window | Document | import("d3").EnterElement | SVGCircleElement,
 *  any,
 *  any
 * >
 * }
 */
function getDragBehaviour(simulation) {
  // eslint-disable-next-line valid-jsdoc
  /**
   * a
   * @param {import("d3").D3DragEvent} event a
   */
  function dragStarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   *
   * @param {import("d3").D3DragEvent} event
   */
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   *
   * @param {import("d3").D3DragEvent} event
   */
  function dragEnded(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  // It works
  // - FIXME: This works but clashes with d3 typing expected svg.call return
  // @ts-ignore
  return d3.drag().on('start', dragStarted).on('drag', dragged).on('end', dragEnded);
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

// eslint-disable-next-line valid-jsdoc
/**
 * Does something to the selection using
 * (should be triggered on the zoom event)
 * @param {d3.Selection<
 *  SVGGElement, any, HTMLElement, any
 *  >} gSelection overall viewbox group
 * @param {import("d3").D3ZoomEvent} zoomEvent hmm
 */
function zoomed(gSelection, zoomEvent) {
  const { transform } = zoomEvent;

  gSelection.attr('transform', transform.toString());
}

/**
 * Gets zoom behaviour?
 * Sets limits
 * @param {d3.Selection<
 *  SVGGElement, any, HTMLElement, any
 * >
 * } selectionToZoomRescale
 * @return {d3.ZoomBehavior<Element, any>}
 */
function getSuperZoomScrollBehaviour(selectionToZoomRescale) {
  return (
    d3
      .zoom()
      .extent([
        [0, 0],
        [width, height],
      ])
      .scaleExtent([0.1, 8])
      // "start", "zoom", "end"
      .on('zoom', (zoomEvent) => zoomed(selectionToZoomRescale, zoomEvent))
  );
}

// eslint-disable-next-line valid-jsdoc
/**
 *
 * @param {*} links
 * @return {d3.ForceLink<
 *   any,
 *   d3.SimulationLinkDatum<
 *     d3.SimulationNodeDatum & HappyNode
 *   >
 * >} force link for simulation
 */
function useTheForceOnNodeLink(links) {
  // eslint-disable-next-line valid-jsdoc
  /**
   *
   * @return {d3.ForceLink<
   *  d3.SimulationNodeDatum & HappyNode,
   *  d3.SimulationLinkDatum<
   *    d3.SimulationNodeDatum & HappyNode
   *  >
   * >} z
   */
  function getForceLinkHappyNode() {
    return d3.forceLink(links);
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   *
   * @param {() =>
   *  d3.ForceLink<
   *    d3.SimulationNodeDatum & HappyNode,
   *    d3.SimulationLinkDatum<d3.SimulationNodeDatum & HappyNode
   *  >
   * >} zz
   * @return {d3.ForceLink<
   *  any,
   *  d3.SimulationLinkDatum<
   *    d3.SimulationNodeDatum & HappyNode
   *  >
   * >}
   */
  function extractedFnForJsDocCustomDataModel(zz = getForceLinkHappyNode) {
    return zz().id((d) => d.id);
  }

  /*
   d3
   .forceLink(links)
   .id((d) => d.id)
   .distance(1);
   */
  return extractedFnForJsDocCustomDataModel(getForceLinkHappyNode).distance(1);
}

// eslint-disable-next-line valid-jsdoc
/**
 *
 * @param {(d3.SimulationNodeDatum & HappyNode)} collisionNode
 * @param {number} i
 * @param {(d3.SimulationNodeDatum & HappyNode)[]} collisionNodes
 *
 *
 */
function getCollisionFactorHappyNode(collisionNode, i, collisionNodes) {
  const { id } = collisionNode;

  return id.length * 5;
}
/**
 *
 * @type {(node: (d3.SimulationNodeDatum & HappyNode),
 * i: number,
 * nodes: (d3.SimulationNodeDatum & HappyNode)[]) => number}
 */
const unusedVar = getCollisionFactorHappyNode;
unusedVar;
// eslint-disable-next-line valid-jsdoc
/**
 * To enforce compile-time JSDoc types for custom node data model.
 *
 * Works in runtime anyway.
 *
 * @param {d3.ForceCollide<d3.SimulationNodeDatum & HappyNode>} collisionation
 * @return {d3.ForceCollide<d3.SimulationNodeDatum & HappyNode>}
 */
function getForceCollideDatumModelCoerced(collisionation) {
  return collisionation.radius(getCollisionFactorHappyNode);
}

/*
--------------------------------------------------------------------------------
--------------------- Big function below----------------------------------------
--------------------------------------------------------------------------------
*/

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
  /**
   * @type {d3.ForceCollide<d3.SimulationNodeDatum & HappyNode>}
   */
  const nodeCollisionConfig = d3.forceCollide(0);

  // eslint-disable-next-line valid-jsdoc

  /**
   *  @type {d3.ForceCollide<d3.SimulationNodeDatum & HappyNode>}
   */
  const raddddd = getForceCollideDatumModelCoerced(nodeCollisionConfig);

  const simulation = d3
    .forceSimulation(nodes)
    .force('link', useTheForceOnNodeLink(links))
    .force('charge', d3.forceManyBody().strength(-500))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collisionForce', raddddd);

  /*
    Remember to append the generated svg onto a page element
    (
      Observable HQ notebook depends cells and other auto-handling for
      visualisation
    )
  */
  const svg = d3.select('body').append('svg').attr('viewBox', `0 0 ${width} ${height}`);

  const svgContainerGroupG = svg.append('g');

  const link = svgContainerGroupG
    .append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', (d) => Math.sqrt(d.value));

  const node = svgContainerGroupG
    .append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('id', (d) => d.id)
    .attr('r', (d) => d.id.length * 4)
    .attr('fill', color())
    .call(
      // - FIXME: This return is required

      getDragBehaviour(simulation),
    )
    .on('click', (event, d) => clicked(event, d, getSuperZoomScrollBehaviour(svgContainerGroupG)));

  const label = svgContainerGroupG
    .append('g')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .text((d) => d.id)
    .attr('fill', 'black')
    .attr('dy', '0em')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .call(getDragBehaviour(simulation));

  node.append('title').text((d) => d.id);

  // allow free zooming/panning
  // @ts-ignore
  svg.call(getSuperZoomScrollBehaviour(svgContainerGroupG));

  simulation.on('tick', () => {
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    label.attr('x', (d) => d.x).attr('y', (d) => d.y);
  });

  /**
   *
   * @param {*} event
   * @param {*} d
   * @param {*} theD3Zoom
   */
  function clicked(event, d, theD3Zoom) {
    const escapedID = `#${CSS.escape(d.id)}`;

    console.log(`clicked: ${d3.select(escapedID).attr('id')}`);
    const translate = [width / 2, height / 2];

    svg
      .transition()
      .duration(750)
      .call(
        theD3Zoom.transform,
        d3.zoomIdentity.translate(
          // Why are we subtracting a Selection object from a number
          // @ts-ignore
          translate[0] - d3.select(escapedID).attr('cx'),
          // @ts-ignore
          translate[1] - d3.select(escapedID).attr('cy'),
        ),
      ); // updated for d3 v4
  }

  return svg.node();
}

/* eslint-disable no-unused-vars */

/**
 * Node definition
 * @example {id: 1, group: 1}
 *
 * - TODO: Move these to another file and use some jsdoc comments to find
 * the path resolution of type???? or make a @types file
 * Nodes positions are defined dynamically through physic simulation
 * downstream with relation to link strength
 */
/**
 * @member
 * @type {string}
 * naive key
 *
 * The name of the node
 * Also should be unique
 * This will break if someone wants to add another node
 *
 * - TODO: This should eventually be migrated to a standard unique ID integer
 *  or UUID
 */

/**
 * @type {number}
 *
 * Group number
 *  Also being used as naive key
 *  Colour groupings
 */

/**
 * Link definition for plotting D3 strokes
 * The positive strength of `value` determines how nodes are positioned in
 * relation to each other
 * when warmed up in the physics simulation
 *
 */

function addSomeJsonNode(
  theMiserableDataNodesLinks: MiserableNodesLinks,
  newNode: HappyNode,
  newLink: HappyLink,
): MiserableNodesLinks {
  theMiserableDataNodesLinks.nodes.push(newNode);
  theMiserableDataNodesLinks.links.push(newLink);

  return theMiserableDataNodesLinks;
}

const newNode: HappyNode = { id: 'id', group: 1 };
const newLink : HappyLink = { source: 'Combeferre', target: 'id', value: 1000 };

getData()
  .then((data) => addSomeJsonNode(data, newNode, newLink))
  .then(chart)
  .catch((reason) => console.error(`Something went horribly wrong`, reason));

// let mutableCounterOhNo = 1;

// const recurseThisForeverTestAddStuffChart = setInterval(() => {
//   getData()
//     .then((data) => {
//       const someNumberOfElementsToDoThings = Array.from({
//         length: mutableCounterOhNo,
//       });

//       someNumberOfElementsToDoThings.forEach(() => addSomeJsonNode(
//         data,
//         newNode,
//         newLink,
//       ));

//       mutableCounterOhNo += 1;

//       return data;
//     })
//     .then(chart)
//     .catch((reason) => console.error(`Something went horribly wrong`,
// reason));
// }, 2000,
// );

// recurseThisForeverTestAddStuffChart;
