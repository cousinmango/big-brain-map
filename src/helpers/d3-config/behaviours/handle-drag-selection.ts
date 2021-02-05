import type * as d from 'd3';
import type { BrainLinkDatum } from 'src/models/d3-datum/brain-link-datum';
import type { BrainNodeDatum } from 'src/models/d3-datum/brain-node-datum';
import { getDragForSelectionCall } from '../behaviours/drag-element-event.js';

export function handleSelectionDrag(
  forceSim: d.Simulation<BrainNodeDatum, BrainLinkDatum>,
  d3: typeof d,
  _selection: d.Selection<Element, BrainNodeDatum, Element, BrainNodeDatum>,
  _args: any[],
): void {
  return getDragForSelectionCall(forceSim, d3)(_selection, _args);
}

export function selectionDragWrapperHandler(
  forceSim: d.Simulation<BrainNodeDatum, BrainLinkDatum>,
  d3: typeof d,
) {
  return getDragForSelectionCall(forceSim, d3);
}
