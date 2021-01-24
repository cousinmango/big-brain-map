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

import type * as gg from 'd3';
import { MiserableNodesLinks } from './models/miserable-nodes-links';
import { HappyLink } from './models/happy-link';
import { HappyNode } from './models/happy-node';
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
 */
function getCollisionForce() {

  // 0 radius or pass in a function that generates force per node.
  const nodeCollisionForceConfig = d3.forceCollide();
}

function drawChartFromData(nodesLinksData: MiserableNodesLinks): void {
  

} 