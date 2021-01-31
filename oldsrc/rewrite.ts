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
// Types are not transpiled in tsc -> .js
import { MiserableNodesLinks } from './models/miserable-nodes-links';
import { HappyLink } from './models/happy-link';
import { HappyNode } from './models/happy-node';
// - NOTE: import with file extensions .js for any functional imports when using tsc transpiler.
import { happyForceWrap } from './forces/collision-force-config.js';
import { miserableData } from './models/miserables-seed.js';
import type { DraggedElementBaseType } from 'd3';
import { getDragBehaviour } from './behaviours/drag-behaviours.js';

export const d3: typeof gg = window.d3;

// TypeScript language server actually does a good job inferring types directly from json file
// add type anyway
// Oops now I remember why we didn't do this earlier.. Compatibility
// JavaScript MIME type of "application/json".
// Strict MIME type checking is enforced for module scripts per HTML spec.
const sampleData: MiserableNodesLinks = miserableData;

/**
 * It is a bit weird that it is not deterministic when
 * The typings show readonlyarray
 * Strange domain mutable behaviour
 */
const initialisedImmutableColourScale: gg.ScaleOrdinal<string, string, never> = d3.scaleOrdinal(
  d3.schemeCategory10,
);
/**
 * Scales the data node .group value into arbitrary hexadecimal strings
 * (for colour values)
 * e.g 1 = #00000 2 = #1f1f1f 10 = #ffffff
 */
function getScaledColourValueFromNodeGroup(
  d: HappyNode,
  scale: gg.ScaleOrdinal<string, string, string> = initialisedImmutableColourScale,
): string {
  // An array of ten categorical colors represented as RGB hexadecimal strings.
  console.log(d.group, `${d.group}`, scale(`${d.group}`), scale(`1`), scale(`${d.group}`));
  // "#1f77b4"
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

type AliasedLabelSelection = gg.Selection<
  Element | gg.EnterElement | Document | Window | SVGTextElement | null,
  HappyNode,
  SVGGElement,
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
  labelSelection: AliasedLabelSelection,
): void {
  simulation.on('tick', () => {
    nodeSelection.attr('cx', (node) => node.x ?? 0);
    nodeSelection.attr('cy', (node) => node.y ?? 0);

    linkSelection
      .attr('x1', (node) => ((node.source as unknown) as HappyNode).x ?? 0)
      .attr('y1', (node) => ((node.source as unknown) as HappyNode).y ?? 0)
      .attr('x2', (node) => ((node.target as unknown) as HappyNode).x ?? 0)
      .attr('y2', (node) => ((node.target as unknown) as HappyNode).y ?? 0);

    labelSelection.attr('x', (d) => d.x ?? 0);
    labelSelection.attr('y', (d) => d.y ?? 0);
  });
}
type SelectionHandler = (
  selection: gg.Selection<SomeElementForSelection, HappyNode, SVGGElement, unknown>,
  ...args: any[]
) => void;
let abc: SelectionHandler | undefined = undefined;
abc;

export type HappyNodeDragEvent = d3.D3DragEvent<DraggedElementBaseType, HappyNode, HappyNode>;
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

  const colourScale: gg.ScaleOrdinal<string, string, never> = d3.scaleOrdinal(d3.schemeCategory10);
  colourScale;
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
    .attr('fill', (d, _index, _groups) => getScaledColourValueFromNodeGroup(d))

    .call(getDragBehaviour(forceSim))

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
      return getDragBehaviour(forceSim)(_selection, _args);
    });
  paintedNodes;
  paintedLinks;
  paintedLabels;

  paintedNodes.append('title').text((d) => d.id);
  forceSim.on('tick');

  setupRepositioningTickHandler(forceSim, paintedNodes, paintedLinks, paintedLabels);
}

drawChartFromData(sampleData);
