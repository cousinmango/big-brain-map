import { HappyLink } from './HappyLink';
import { HappyNode } from './HappyNode';

/* eslint-enable no-unused-vars */
/**
 * @param {MiserableNodesLinks} theMiserableDataNodesLinks
 * Assumed not undefined null
 *
 * @param {HappyNode} newNode
 * @param {HappyLink} newLink
 *
 * @return {{
 *  nodes:
 *    {
 *      id: string,
 *      group: number
 *    }[]
 *  ,
 *  links:
 *    {
 *      source: string,
 *      target: string,
 *      value: number,
 *    }[]
 *
 * }} the new object with nodes array and links array properties
 */

export interface MiserableNodesLinks {
  nodes: HappyNode[];
  links: HappyLink[];
}
