import type { SimulationLinkDatum } from "d3";
import type { BrainNodeDatum } from "./brain-node-datum";

/**
 *
 * Source and target are expected to be valid node identifiers
 * (otherwise raises an error on chart generation)
 */
export interface BrainLinkDatum extends SimulationLinkDatum<BrainNodeDatum> {
  /**
   * This may be used to identify/coerce
   * the linked source node datum
   */
  readonly source: string;
  /**
   * This may be used to identify/coerce
   * the linked target node datum
   */
  readonly target: string;
  /**
   * Relative strength of the relationship link.
   *
   */
  readonly value: number;
}
