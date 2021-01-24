import { HappyLink } from './happy-link';
import { HappyNode } from './happy-node';


/**
 * Helper to represent our example json data format
 */
export interface MiserableNodesLinks {
  /**
   * The nodes
   * Currently uses name as identifier
   */
  readonly nodes: HappyNode[];
  
  /**
   * The links between nodes
   * Source and target are expected to be valid node identifiers (otherwise raises an error on chart generation)
   */
  readonly links: HappyLink[];
}
