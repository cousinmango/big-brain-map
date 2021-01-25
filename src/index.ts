import type {
  DraggedElementBaseType,
  D3DragEvent,
  Simulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
  D3ZoomEvent,
  ZoomedElementBaseType,
  EnterElement,
  ZoomBehavior,
  Transition,
  Selection,
} from 'd3';
import { MiserableNodesLinks } from './models/miserable-nodes-links';
import { HappyLink } from './models/happy-link';
import { HappyNode } from './models/happy-node';

const d3 = window.d3;

/**
 * Text
 *
 * @param dataPath path to assets json file
 */
async function getData(dataPath = './assets/miserables.json'): Promise<MiserableNodesLinks> {
  const responseData = fetch(dataPath).then((response) => response.json());
  const jsonData = responseData;

  return jsonData;
}

/* eslint no-undef: ["error"] */
// interface Something extends DraggedElementBaseType, SimulationNodeDatum, Subject {
// # drag.subject([subject]) · Source, Examples

// If subject is specified, sets the subject accessor to the specified object or function and returns the drag behavior. If subject is not specified, returns the current subject accessor, which defaults to:

// function subject(event, d) {
//   return d == null ? {x: event.x, y: event.y} : d;
// }

interface SomeElement extends DraggedElementBaseType {}

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
 *
 *
 */
function getDragBehaviour(
  simulation: Simulation<SimulationNodeDatum, SimulationLinkDatum<SimulationNodeDatum>>,
): (
  selection: d3.Selection<
    Window | Document | Element | EnterElement | SVGCircleElement | null,
    HappyNode,
    SVGGElement,
    unknown
  >,
  ...args: any[]
) => void /* d3.DragBehavior<Element & (Window | Document | EnterElement | SVGCircleElement), any, any> */ {
  function dragStarted(event: d3.D3DragEvent<DraggedElementBaseType, SimulationNodeDatum, any>) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   *
   * @param {import("d3").D3DragEvent} event
   */
  function dragged(event: D3DragEvent<DraggedElementBaseType, SimulationNodeDatum, any>) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   *
   * @param {import("d3").D3DragEvent} event
   */
  function dragEnded(event: D3DragEvent<DraggedElementBaseType, SimulationNodeDatum, any>) {
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
function color(): (d: SimulationNodeDatum & HappyNode) => string {
  // An array of ten categorical colors represented as RGB hexadecimal strings.
  const scale = d3.scaleOrdinal(d3.schemeCategory10);

  return (d: SimulationNodeDatum & HappyNode) => scale(`${d.group}`);
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
function zoomed(
  gSelection: d3.Selection<SVGGElement, any, HTMLElement, any>,
  zoomEvent: D3ZoomEvent<ZoomedElementBaseType, SimulationNodeDatum>,
) {
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
function getSuperZoomScrollBehaviour(
  selectionToZoomRescale: d3.Selection<SVGGElement, any, HTMLElement, any>,
) {
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
function useTheForceOnNodeLink(
  links: Array<d3.SimulationLinkDatum<d3.SimulationNodeDatum & HappyLink>>,
): d3.SimulationLinkDatum<d3.SimulationNodeDatum & HappyLink> {
  // eslint-disable-next-line valid-jsdoc

  function getForceLinkHappyNode(): d3.ForceLink<
    SimulationNodeDatum & HappyLink,
    SimulationLinkDatum<SimulationNodeDatum & HappyLink>
  > {
    return d3.forceLink<
      SimulationNodeDatum & HappyLink,
      SimulationLinkDatum<SimulationNodeDatum & HappyLink>
    >(links);
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

function getCollisionFactorHappyNode(
  collisionNode: SimulationNodeDatum & HappyNode,
  i: number,
  collisionNodes: Array<SimulationNodeDatum & HappyNode>,
) {
  const { id } = collisionNode;

  return id.length * 5;
}

// eslint-disable-next-line valid-jsdoc
/**
 * To enforce compile-time JSDoc types for custom node data model.
 *
 * Works in runtime anyway.
 */
function getForceCollideDatumModelCoerced(
  collisionation: d3.ForceCollide<d3.SimulationNodeDatum & HappyNode>,
): d3.ForceCollide<d3.SimulationNodeDatum & HappyNode> {
  return collisionation.radius(getCollisionFactorHappyNode);
}

/*
--------------------------------------------------------------------------------
--------------------- Big function below----------------------------------------
--------------------------------------------------------------------------------
*/

/**
 * Do the chart!
 * @param data give the fetched json data ez plug in for flat webpage
 *
 * @return This is a weird element.
 */
function chart(data: MiserableNodesLinks): SVGSVGElement {
  const links: HappyLink[] = data.links.map((d) => Object.create(d));
  const nodes: HappyNode[] = data.nodes.map((d) => Object.create(d));

  // Mutato potato
  // Any number here as it is unused, overridden by the node-radius function
  const nodeCollisionConfig: d3.ForceCollide<d3.SimulationNodeDatum & HappyNode> = d3.forceCollide(
    0,
  );

  // eslint-disable-next-line valid-jsdoc
  const raddddd: d3.ForceCollide<
    d3.SimulationNodeDatum & HappyNode
  > = getForceCollideDatumModelCoerced(nodeCollisionConfig);

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
    .attr('stroke-width', (d) =>
      Math.sqrt((d as SimulationLinkDatum<SimulationNodeDatum & HappyNode> & HappyLink).value),
    );

  const node = svgContainerGroupG
    .append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(nodes as HappyNode[])
    .join('circle')
    .attr('id', (d) => d.id)
    .attr('r', (d) => d.id.length * 4)
    .attr('fill', color())
    .call(
      // - FIXME: This return is required
      // but it works
      getDragBehaviour(simulation),
    )
    .on('click', (event, d) =>
      clicked(
        event,
        d as SimulationNodeDatum & HappyNode,
        getSuperZoomScrollBehaviour(svgContainerGroupG),
      ),
    );

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
    type ReallyBadTypeAliasSelectionCoerceDatumType = Selection<
      Element | Window | Document | EnterElement | SVGLineElement | null,
      HappyLink & {
        source: SimulationNodeDatum;
      },
      SVGGElement,
      unknown
    >;

    (link as ReallyBadTypeAliasSelectionCoerceDatumType)
      /* overlapping keys break things */
      .attr('x1', (d: Pick<HappyLink, 'value'> & { source: SimulationNodeDatum }) => d.source.x!) // d3 d.source as string ID and somehow references the source ID as the node object for the .x? weird
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y);

    ((node as d3.Selection<any, HappyNode & SimulationNodeDatum, any, any>).attr(
      'cx',
      (d: HappyNode & SimulationNodeDatum) => d?.x,
    ) as d3.Selection<any, any, any, any>).attr('cy', (d) => d.y);
    label.attr('x', (d) => d.x).attr('y', (d) => d.y);
  });

  /**
   *
   * @param {*} event
   * @param {*} d
   * @param {*} theD3Zoom
   */
  function clicked(
    event: MouseEvent,
    d: SimulationNodeDatum & HappyNode,
    theD3Zoom: (
      transition: d3.Transition<SVGSVGElement, unknown, HTMLElement, any>,
      ...args: any[]
    ) => any,
  ) {
    const escapedID = `#${CSS.escape(d.id)}`;

    console.log(`clicked: ${d3.select(escapedID).attr('id')}`);
    const translate = [width / 2, height / 2];

    svg
      .transition()
      .duration(750)
      .call(
        ((theD3Zoom as unknown) as d3.ZoomBehavior<any, any>).transform,
        d3.zoomIdentity.translate(
          // Why are we subtracting a Selection object from a number
          // @ts-ignore
          translate[0] - d3.select(escapedID).attr('cx'),
          // @ts-ignore
          translate[1] - d3.select(escapedID).attr('cy'),
        ),
      ); // updated for d3 v4
  }

  // Returns null if selection is empty
  return svg.node()!;
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
const newLink: HappyLink = { source: 'Combeferre', target: 'id', value: 1000 };

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
