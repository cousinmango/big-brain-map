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