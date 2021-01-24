import type { Force, Simulation, SimulationLinkDatum, SimulationNodeDatum } from "d3";

/// Use string literals to help autocomplete defined D3 usages rather than any string.
type DefinedForce = 'link' | 'charge' | 'center' | 'collisionForce';

/**
 * Use the force
 * the chained .force calls on force simulations
 */
function utilityUseTheForceWrapper<N extends SimulationNodeDatum, L extends SimulationLinkDatum<N> >(
  simulation: Simulation<N, L>,
  name: DefinedForce,
  force: Force<N, L>,
): Simulation<N, L>  {
  
  return simulation.force(name, force);
}
