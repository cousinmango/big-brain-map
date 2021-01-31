import type * as d from 'd3';
import type { AliasedLabelSelection, AliasedLinkSelection, AliasedNodeOrLinkSelection, AliasedNodeSelection } from 'src/models/d3-aliases/elements/element-selection';
import type { BrainLinkDatum } from 'src/models/d3-datum/brain-link-datum';
import type { BrainNodeDatum } from 'src/models/d3-datum/brain-node-datum';

/**
 * Reposition nodes links labels on each
 * simulation tick
 *
 */
function setupRepositioningTickHandler(
  simulation: d.Simulation<BrainNodeDatum, BrainLinkDatum>,
  nodeSelection: AliasedNodeSelection | AliasedNodeOrLinkSelection<BrainNodeDatum>,
  linkSelection: AliasedLinkSelection,
  labelSelection: AliasedLabelSelection,
): void {
  // - TODO: extract this as the callback only
  // Rather than taking in the simulation and add listener
  // Complexity 9
  simulation.on('tick', () => {
    /* 
    Redundant `this` reference to 
    d.Simulation<BrainNodeDatum, BrainLinkDatum> 
    is passed into the handling function in simulation.on
    */
    nodeSelection.attr('cx', (node) => node.x ?? 0);
    nodeSelection.attr('cy', (node) => node.y ?? 0);

    linkSelection
      .attr('x1', (node) => ((node.source as unknown) as BrainNodeDatum).x ?? 0)
      .attr('y1', (node) => ((node.source as unknown) as BrainNodeDatum).y ?? 0)
      .attr('x2', (node) => ((node.target as unknown) as BrainNodeDatum).x ?? 0)
      .attr('y2', (node) => ((node.target as unknown) as BrainNodeDatum).y ?? 0);

    labelSelection.attr('x', (d) => d.x ?? 0);
    labelSelection.attr('y', (d) => d.y ?? 0);
  });
}