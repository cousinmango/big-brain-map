import type { Force, Simulation, SimulationLinkDatum, SimulationNodeDatum } from 'd3';
import { HappyLink } from '../models/happy-link';
import { HappyNode } from '../models/happy-node';

/**
 * Use string literals to help autocomplete defined D3 usages rather than any string.
 */
type DefinedForce = 'link' | 'charge' | 'center' | 'collisionForce';

export function happyForceWrap(
  simulation: Simulation<HappyNode, HappyLink>,
  name: DefinedForce,
  force: Force<HappyNode, HappyLink>,
): Simulation<HappyNode, HappyLink> {
  return utilityUseTheForceWrapper(simulation, name, force);
}
/**
 * Use the force
 * the chained .force calls on force simulations
 */
export function utilityUseTheForceWrapper<
  N extends SimulationNodeDatum,
  L extends SimulationLinkDatum<N>
>(simulation: Simulation<N, L>,
  name: DefinedForce,
  force: Force<N, L>
): Simulation<N, L> {
  return simulation.force(name, force);
}

// Not sure of an easy way to extend and override *implementation* of D3 with TypeScript declared interface
// Ideally: have .forceWrapper as an in-place upgrade to .force
// force is a function defined in simulation return js
// interface only has interface declarations (no place to override implementation)
// Looking at source
// Var simulation return simulation...
//
// export interface WrapperSimulation<
//   NodeDatum extends SimulationNodeDatum,
//   LinkDatum extends SimulationLinkDatum<NodeDatum> | undefined
// > extends gg.Simulation<NodeDatum, LinkDatum> {

//   forceWrapper(name: DefinedForce, force: gg.Force<SimulationNodeDatum, SimulationLinkDatum<SimulationNodeDatum>>): any {
//     return this.force(name, force);
//   }
// }
// declare module extendedD3 {}
