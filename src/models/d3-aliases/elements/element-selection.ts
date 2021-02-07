import type * as d from "d3";
import type { BrainLinkDatum } from "src/models/d3-datum/brain-link-datum";
import type { BrainNodeDatum } from "src/models/d3-datum/brain-node-datum";

/**
 * Should use BrainNodeElementSelection where possible
 */
export type SomeElementForSelection =
  | Window
  | Document
  | Element
  | d.EnterElement
  | SVGCircleElement
  | null;

/**
 * Helper type for the parent svg element
 *
 * the svg in the DOM hierarchy
 * svg
 *  g
 *    g (nodes)
 *      circle
 *      circle
 *    g (lines)
 *      line
 *      line
 *    g (labels)
 *      text
 *      text
 *
 * Do we need these separate g groups? Or should they be co-located at the lower levels?
 * e.g. Treat each node and label together same model
 * Links probably still separate.
 *
 */
export type ParentSvgGroupSelectionForWholeBrainMap = d.Selection<
  SVGSVGElement,
  unknown,
  HTMLElement,
  unknown
>;

/**
 * The overarching g group that subsequently holds the child g groups for the:
 * * nodes
 * * lines
 * * label
 */
export type ParentSvgGGroupSelectionForMappedNodesLinksLabels = d.Selection<
  SVGGElement,
  unknown,
  HTMLElement,
  any
>;

/**
 * Narrow type for drag behaviour function expectations
 */
export type BrainNodeElementSelection = d.Selection<Element, BrainNodeDatum, SVGGElement, unknown>;

export type AliasedLinkSelection = d.Selection<
  // Selected element
  // Add separate | Element here (even though SomeElementForSelection includes Element) because
  // another functionality does not accept null type.
  SomeElementForSelection | Element,
  // Current datum
  BrainLinkDatum,
  // Parent group should all be the svg g
  SVGGElement,
  // Parent datum. I don't think we have parents here
  unknown
>;

export type AliasedNodeSelection =
  | d.Selection<
      // Selected element
      // Add separate | Element here (even though SomeElementForSelection includes Element) because
      // another functionality does not accept null type.
      SomeElementForSelection | Element,
      // Current datum
      BrainNodeDatum,
      // Parent group should all be the svg g
      SVGGElement,
      // Parent datum. I don't think we have parents here
      unknown
    >
  // The above fix did not work for some reason. Add separately here again for DOM HTML5 std lib Element
  | d.Selection<
      // Selected element
      Element,
      // Current datum
      BrainNodeDatum,
      // Parent group should all be the svg g
      SVGGElement,
      // Parent datum. I don't think we have parents here
      unknown
    >;

export type AliasedNodeOrLinkSelection<D extends BrainNodeDatum | BrainLinkDatum> = d.Selection<
  // Selected element
  SomeElementForSelection,
  // Current datum. Should be data model for either our node or our link.
  D,
  // Parent group should all be the svg g
  SVGGElement,
  // Parent datum. I don't think we have parents here
  unknown
>;

export type AliasedLabelSelection = d.Selection<
  Element | d.EnterElement | Document | Window | SVGTextElement | null,
  BrainNodeDatum,
  SVGGElement,
  unknown
>;
