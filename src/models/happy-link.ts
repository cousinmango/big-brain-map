
/**
 * 
 * Source and target are expected to be valid node identifiers (otherwise raises an error on chart generation)
 */
export interface HappyLink {
  readonly source: string;
  readonly target: string;
  /**
   * Relative strength of the relationship link.
   * 
   */
  readonly value: number;
}
