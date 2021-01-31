import type { SimulationNodeDatum } from "d3";

/**
 * Contain node data for use in D3
 * Care should be taken as D3 adds and modifies object values downstream
 * 
 */
export interface HappyNode extends SimulationNodeDatum {
  /**
   * Currently uses name as the identifier
   * - TODO: Future should have proper UUID and separate name properties.
   * 
   */
  readonly id: string;
  /**
   * Ordinal scale conveniently used with D3 to generate colour groupings 
   * for the numbered groups
   */
  readonly group: number;
}
