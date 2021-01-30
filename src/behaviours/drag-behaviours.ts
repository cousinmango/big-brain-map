import type {
  DraggedElementBaseType,
  D3DragEvent,
  Simulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
  EnterElement,
  DragBehavior,
  SubjectPosition,
} from 'd3';
import * as d3 from 'd3';
import type { HappySimulation } from '..//models/happy-simulation';
import type { HappyNodeDragEvent } from '../rewrite';
import type { HappyNode } from '../models/happy-node';

// eslint-disable-next-line valid-jsdoc
/**
 *
 * @param {d3.Simulation<d3.SimulationNodeDatum>} simulation
 * @returns some mutable(?) drag event listeners?
 *
 */
export function getDragBehaviour<
  ND extends SimulationNodeDatum,
  LD extends SimulationLinkDatum<ND>
>(
  simulation: Simulation<ND, LD>,
): (
  selection: d3.Selection<
    Window | Document | Element | EnterElement | SVGCircleElement | null,
    HappyNode,
    SVGGElement,
    unknown
  >,
  ...args: any[]
) => void {
  function dragStarted(event: d3.D3DragEvent<DraggedElementBaseType, ND, any>) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event: D3DragEvent<DraggedElementBaseType, ND, any>) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragEnded(event: D3DragEvent<DraggedElementBaseType, ND, any>) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  // It works
  // - FIXME: This works but clashes with d3 typing expected svg.call return
  // @ts-ignore
  return d3.drag().on('start', dragStarted).on('drag', dragged).on('end', dragEnded);
}

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
export function handleDragStartEventSubjectNodePositioning(
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
export function handleDragDraggingEventSubjectNodePositioning(event: HappyNodeDragEvent) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}
export function handleDragEndStopRepositioning(
  simulation: HappySimulation,
  event: HappyNodeDragEvent,
) {
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
export function dragHandler(
  simulation: HappySimulation,
): DragBehavior<Element, HappyNode, HappyNode | SubjectPosition> {
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
