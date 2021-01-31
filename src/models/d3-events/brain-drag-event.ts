import type * as d from 'd3';
import { BrainNodeDatum } from '../d3-datum/brain-node-datum';

export type BrainNodeDragEvent = d.D3DragEvent<d.DraggedElementBaseType, BrainNodeDatum, BrainNodeDatum>;
