import {
  DraggedElementBaseType,
  D3DragEvent,
  Simulation,
  SimulationLinkDatum,
  SimulationNodeDatum,


  EnterElement
} from 'd3';
import { HappyNode } from '../models/happy-node';

// eslint-disable-next-line valid-jsdoc
/**
 *
 * @param {d3.Simulation<d3.SimulationNodeDatum>} simulation
 * @return {d3.DragBehavior<
 *  Element | Window | Document | import("d3").EnterElement | SVGCircleElement,
 *  any,
 *  any
 * >
 * }
 *
 *
 */
export function getDragBehaviour(
  simulation: Simulation<SimulationNodeDatum, SimulationLinkDatum<SimulationNodeDatum>>): (
    selection: d3.Selection<
      Window | Document | Element | EnterElement | SVGCircleElement | null,
      HappyNode,
      SVGGElement,
      unknown
    >,
    ...args: any[]
  ) => void /* d3.DragBehavior<Element & (Window | Document | EnterElement | SVGCircleElement), any, any> */ {
  function dragStarted(event: d3.D3DragEvent<DraggedElementBaseType, SimulationNodeDatum, any>) {
    if (!event.active)
      simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   *
   * @param {import("d3").D3DragEvent} event
   */
  function dragged(event: D3DragEvent<DraggedElementBaseType, SimulationNodeDatum, any>) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   *
   * @param {import("d3").D3DragEvent} event
   */
  function dragEnded(event: D3DragEvent<DraggedElementBaseType, SimulationNodeDatum, any>) {
    if (!event.active)
      simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  // It works
  // - FIXME: This works but clashes with d3 typing expected svg.call return
  // @ts-ignore
  return d3.drag().on('start', dragStarted).on('drag', dragged).on('end', dragEnded);
}
