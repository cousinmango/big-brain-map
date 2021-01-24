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

