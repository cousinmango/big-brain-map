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

const d3: typeof gg = window.d3;

// TypeScript language server actually does a good job inferring types directly from json file
// add type anyway
// Oops now I remember why we didn't do this earlier.. Compatibility
// JavaScript MIME type of "application/json".
// Strict MIME type checking is enforced for module scripts per HTML spec.
const sampleData: MiserableNodesLinks = miserableData;

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
    nodeSelection.attr('cx', (node) => node.x ?? 0)
    nodeSelection.attr('cy', (node) => node.y ?? 0)
    
    linkSelection.attr('x1', (node) => (node.source as unknown as HappyNode).x ?? 0)
    linkSelection.attr('y1', (node) => (node.source as unknown as HappyNode).y ?? 0)
    linkSelection.attr('x2', (node) => (node.target as unknown as HappyNode).x ?? 0)
    linkSelection.attr('y2', (node) => (node.target as unknown as HappyNode).y ?? 0)


    ;
  });
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
    .attr('r', (d) => d.id.length * 4);

  paintedLinks;
  paintedNodes;

  forceSim.on('tick');

  setupRepositioningTickHandler(forceSim, paintedNodes, paintedLinks);
}

drawChartFromData(sampleData);
