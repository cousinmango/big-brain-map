import {
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
  forceSimulation,
} from 'd3';

import type * as gg from 'd3';
import { MiserableNodesLinks } from './models/miserable-nodes-links';
import { HappyLink } from './models/happy-link';
import { HappyNode } from './models/happy-node';
import { utilityUseTheForceWrapper } from './forces/collision-force-config';
import sampleMiserablesDataJson from './models/miserables.json';

const d3: typeof gg = window.d3;

// TypeScript language server actually does a good job inferring types directly from json file
// add type anyway
const sampleData: MiserableNodesLinks = sampleMiserablesDataJson;

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

function getForceLink(links: HappyLink[]) {
  return d3.forceLink(links);
}
function drawChartFromData(nodesLinksData: MiserableNodesLinks): void {
  const { nodes, links } = nodesLinksData;

  const forceNodeRadius = getCollisionForce();
  const forceSim: gg.Simulation<HappyNode, HappyLink> = d3.forceSimulation(nodes);

  const chargedPhysicsForceSimulation = forceSim.force('link');
  const linked = utilityUseTheForceWrapper<HappyNode, HappyLink>(
    forceSim,
    'link',
    d3
      .forceLink<HappyNode, HappyLink>(links)
      .id((node) => node.id)
      .distance(1),
  );
  const charged = utilityUseTheForceWrapper<HappyNode, HappyLink>(
    linked,
    'charge',
    d3.forceManyBody<HappyNode>().strength(-500),
  );
  const centeredWithinViewport = utilityUseTheForceWrapper<HappyNode, HappyLink>(
    charged,
    'center',
    d3.forceCenter(innerWidth / 2, innerHeight / 2),
  );
  const radiusForced = utilityUseTheForceWrapper<HappyNode, HappyLink>( 
    centeredWithinViewport,
    'collisionForce',
    getCollisionForce()
  )
}
