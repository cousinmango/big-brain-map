import type { BrainLinkDatum } from "./brain-link-datum";
import type { BrainNodeDatum } from "./brain-node-datum";

/**
 * Helper to represent our
 * seed data format
 *
 * BrainMap consists of our nodes and links
 */
export interface BrainMap {
  /**
   * The nodes
   * Currently uses name as identifier
   */
  readonly nodes: BrainNodeDatum[];

  /**
   * The links between nodes
   * Source and target are expected to be valid node identifiers (otherwise raises an error on chart generation)
   */
  readonly links: BrainLinkDatum[];
}
