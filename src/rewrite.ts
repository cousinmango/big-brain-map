// import {
//   DraggedElementBaseType,
//   D3DragEvent,
//   Simulation,
//   SimulationLinkDatum,
//   SimulationNodeDatum,
//   D3ZoomEvent,
//   ZoomedElementBaseType,
//   EnterElement,
//   ZoomBehavior,
//   Transition,
//   Selection,
//   forceSimulation,
// } from 'd3';

import type * as gg from 'd3';
import { MiserableNodesLinks } from './models/miserable-nodes-links';
import { HappyLink } from './models/happy-link';
import { HappyNode } from './models/happy-node';
import { happyForceWrap } from './forces/collision-force-config.js';
import { miserableData } from './models/miserables-seed.js';
import { DraggedElementBaseType } from 'd3';

const d3: typeof gg = window.d3;

// TypeScript language server actually does a good job inferring types directly from json file
// add type anyway
// Oops now I remember why we didn't do this earlier.. Compatibility
// JavaScript MIME type of "application/json".
// Strict MIME type checking is enforced for module scripts per HTML spec.
const sampleData: MiserableNodesLinks = miserableData;

/**
 * Scales the data node .group value into arbitrary hexadecimal strings
 * (for colour values)
 * e.g 1 = #00000 2 = #1f1f1f 10 = #ffffff
 */
function getScaledColourValueFromNodeGroup(d: HappyNode): string {
  // An array of ten categorical colors represented as RGB hexadecimal strings.
  const scale = d3.scaleOrdinal(d3.schemeCategory10);

  return scale(`${d.group}`);
}

/**
 *
 * - FIXME: Remove this if node-radius function overrides this anyway.
 *
 * Radius is more predictable than physics force collision radius
 *
 * @returns a function that generates collision force based on node data
 * iterated within the simulation
 */
function getCollisionForce(): gg.ForceCollide<HappyNode> {
  // 0 radius or pass in a function that generates force per node.
  const nodeCollisionForceConfig = d3.forceCollide(getCollisionFactorFromNameLength);

  return nodeCollisionForceConfig;
}

/**
 * Arbitrarily create a collision radius force based on the node value (name length)
 * ?
 * Not sure if we need this
 *
 */
function getCollisionFactorFromNameLength({
  id: idNameForArbitraryLengthDerivedForce,
}: HappyNode): number {
  return idNameForArbitraryLengthDerivedForce.length * 5;
}
type SomeElementForSelection =
  | Window
  | Document
  | Element
  | gg.EnterElement
  | SVGCircleElement
  | null;

type AliasedLinkSelection = gg.Selection<
  // Selected element
  SomeElementForSelection,
  // Current datum
  HappyLink,
  // Parent group should all be the svg g
  SVGGElement,
  // Parent datum. I don't think we have parents here
  unknown
>;
type AliasedNodeSelection = gg.Selection<
  // Selected element
  SomeElementForSelection,
  // Current datum
  HappyNode,
  // Parent group should all be the svg g
  SVGGElement,
  // Parent datum. I don't think we have parents here
  unknown
>;

type AliasedNodeOrLinkSelection<D extends HappyNode | HappyLink> = gg.Selection<
  // Selected element
  SomeElementForSelection,
  // Current datum. Should be data model for either our node or our link.
  D,
  // Parent group should all be the svg g
  SVGGElement,
  // Parent datum. I don't think we have parents here
  unknown
>;

/**
 * Do things on each tick of the sim
 * Positions I think
 * may do other things though
 *
 */
function setupRepositioningTickHandler(
  simulation: gg.Simulation<HappyNode, HappyLink>,
  nodeSelection: AliasedNodeSelection | AliasedNodeOrLinkSelection<HappyNode>,
  linkSelection: AliasedLinkSelection,
): void {
  simulation.on('tick', () => {
    nodeSelection.attr('cx', (node) => node.x ?? 0);
    nodeSelection.attr('cy', (node) => node.y ?? 0);

    linkSelection.attr('x1', (node) => ((node.source as unknown) as HappyNode).x ?? 0);
    linkSelection.attr('y1', (node) => ((node.source as unknown) as HappyNode).y ?? 0);
    linkSelection.attr('x2', (node) => ((node.target as unknown) as HappyNode).x ?? 0);
    linkSelection.attr('y2', (node) => ((node.target as unknown) as HappyNode).y ?? 0);
  });
}
type SelectionHandler = (
  selection: gg.Selection<SomeElementForSelection, HappyNode, SVGGElement, unknown>,
  ...args: any[]
) => void;
let abc: SelectionHandler | undefined = undefined;
abc;

type HappySimulation = d3.Simulation<HappyNode, HappyLink>;

type HappyNodeDragEvent = d3.D3DragEvent<DraggedElementBaseType, HappyNode, HappyNode>;
// /**
//  * Setter mutator to reuse in the drag handlers
//  * As each function seems to replicate the same setting functionality
//  * @param nodeDragEvent drag event to get the drag positioning and current nodes
//  */
// function setDragSubjectPositionFromDragEvent(nodeDragEvent: HappyNodeDragEvent) {
//   const { x: dragEventX, y: dragEventY, subject }: HappyNodeDragEvent = nodeDragEvent;

//   // Setters
//   subject.fx = dragEventX;
//   subject.fy = dragEventY;
// }

// /**
//  * Hover doco doesn't explain null vs undefined vs not setting.
//  * @param param0 subject
//  */
// function setDragSubjectNullPosition({ subject }: HappyNodeDragEvent) {
//   subject.fx = null;
//   subject.fy = null;
// }

/**
 * Sets fixed positioning!
 * @param simulation sim
 * @param event uhh I think we used the datum together into the sim node
 * See HappyNode datum and HappyNode drag behaviour subject
 */
function handleDragStartEventSubjectNodePositioning(
  simulation: HappySimulation,
  event: HappyNodeDragEvent,
): void {
  const isEventInactive = !event.active;
  if (isEventInactive) {
    simulation.alphaTarget(0.3).restart();
    // Have not reproduced this behaviour.
    // Not sure if this should escape early or continue with start dragging
  }
  // Set new fixed position
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}
/**
 * Presumably while dragging.
 * @param event while dragging
 */
function handleDragDraggingEventSubjectNodePositioning(event: HappyNodeDragEvent) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

function handleDragEndStopRepositioning(simulation: HappySimulation, event: HappyNodeDragEvent) {
  const isEventInactive = !event.active;

  if (isEventInactive) {
    simulation.alphaTarget(0);
  }
  event.subject.fx = null;
  event.subject.fy = null;
}
/**
 * Drag handler
 * Handles the start, drag (continuous) and end
 *
 * Not sure if it needs explicit handling for all drag events
 * Null vs mutating subject position every time...
 * If it needs null, does that mean it keeps ticking the other events?
 * If it keeps ticking other events, does it need to be set every time?
 */
function dragHandler(
  simulation: HappySimulation,
  /* 
  draggedNodeSelection: AliasedNodeSelection 
  */
): gg.DragBehavior<Element, HappyNode, HappyNode | gg.SubjectPosition> {
  // Probably do not even need all of the handlers
  // it simply sets the positions to the event drag positions
  // so the lack of a setter is likely sufficient for end.
  // Not sure if special behaviour needed in the start condition. Otherwise looks identical to
  // the drag-drag

  return d3
    .drag<Element, HappyNode>()
    .on('start', (event, _d) => handleDragStartEventSubjectNodePositioning(simulation, event))
    .on('drag', handleDragDraggingEventSubjectNodePositioning)
    .on('end', (event, _d) => handleDragEndStopRepositioning(simulation, event));
}

function drawChartFromData(nodesLinksData: MiserableNodesLinks): void {
  const { nodes, links } = nodesLinksData;

  const forceNodeRadius = getCollisionForce();
  const forceSim: gg.Simulation<HappyNode, HappyLink> = d3.forceSimulation(nodes);

  // I don't think this wrapping made it clearer
  // Further wrapping could make it clearer but harder to customise...
  // Fixes typeing.
  const linked = happyForceWrap(
    forceSim,
    'link',
    d3
      .forceLink<HappyNode, HappyLink>(links)
      .id((node) => node.id)
      .distance(1),
  );
  const charged = happyForceWrap(forceSim, 'charge', d3.forceManyBody<HappyNode>().strength(-500));
  const centeredWithinViewport = happyForceWrap(
    forceSim,
    'center',
    d3.forceCenter(innerWidth / 2, innerHeight / 2),
  );
  const radiusForced = happyForceWrap(forceSim, 'collisionForce', getCollisionForce());
  linked;
  charged;
  centeredWithinViewport;
  forceNodeRadius;
  radiusForced;

  const svg = d3.select('body').append('svg').attr('viewBox', `0 0 ${innerWidth} ${innerHeight}`);
  const svgContainerGroupG = svg.append('g');

  const paintedNodes: gg.Selection<
    SomeElementForSelection,
    HappyNode,
    SVGGElement,
    unknown
  > = svgContainerGroupG
    .append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('id', (d) => d.id)
    .attr('r', (d) => d.id.length * 4)
    .attr('fill', getScaledColourValueFromNodeGroup)
    .call(
      /*
      Maybe it is missing the `this` context?
      */
      (_selection) => dragHandler(forceSim),
    )
    .on('click', (_event, _d) => {
      return (
        d3
          .zoom()
          .extent([
            [0, 0],
            [innerWidth, innerHeight],
          ])
          .scaleExtent([0.1, 8])
          // "start", "zoom", "end"
          .on('zoom', (zoomEvent) => {
            const { transform } = zoomEvent;

            svgContainerGroupG.attr('transform', transform.toString());
          })
      );
    });

  const paintedLinks: gg.Selection<
    SomeElementForSelection,
    HappyLink,
    SVGGElement,
    unknown
  > = svgContainerGroupG
    .append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', (d) => Math.sqrt(d.value));

  const paintedLabels = svgContainerGroupG
    .append('g')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .text((d) => d.id)
    .attr('fill', 'black')
    .attr('dy', '0em')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .call((_selection: any, ..._args: any[]) => {
      return d3.drag().on('start', function (this: Element, event: any, _d: any) {
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      });
    });
  paintedNodes;
  paintedLinks;
  paintedLabels;

  paintedNodes.append('title').text((d) => d.id);
  forceSim.on('tick');

  setupRepositioningTickHandler(forceSim, paintedNodes, paintedLinks);
}

drawChartFromData(sampleData);
