import type * as d from "d3";
import { BrainSimulation } from "src/models/brain-simulation";
import { BrainNodeDatum } from "src/models/d3-datum/brain-node-datum";
import { BrainNodeDragEvent } from "src/models/d3-events/brain-drag-event";

/**
 * Sets fixed positioning!
 * @param simulation sim
 * @param event uhh I think we used the datum together into the sim node
 * See BrainNodeDatum datum and BrainNodeDatum drag behaviour subject
 */
export function handleDragStartEventSubjectNodePositioning(
  simulation: BrainSimulation,
  event: BrainNodeDragEvent,
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
export function handleDragDraggingEventSubjectNodePositioning(event: BrainNodeDragEvent) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}
export function handleDragEndStopRepositioning(
  simulation: BrainSimulation,
  event: BrainNodeDragEvent,
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
export function getDragBehaviourConfig(
  simulation: BrainSimulation,
  d3: typeof d,
): d.DragBehavior<Element, BrainNodeDatum, BrainNodeDatum | d.SubjectPosition> {
  // Probably do not even need all of the handlers
  // it simply sets the positions to the event drag positions
  // so the lack of a setter is likely sufficient for end.
  // Not sure if special behaviour needed in the start condition. Otherwise looks identical to
  // the drag-drag
  return d3
    .drag<Element, BrainNodeDatum>()
    .on('start', (event, _d) => handleDragStartEventSubjectNodePositioning(simulation, event))
    .on('drag', handleDragDraggingEventSubjectNodePositioning)
    .on('end', (event, _d) => handleDragEndStopRepositioning(simulation, event));
}
