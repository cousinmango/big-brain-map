import type * as d from 'd3';
import type { BrainLinkDatum } from 'src/models/d3-datum/brain-link-datum';
import type { BrainNodeDatum } from 'src/models/d3-datum/brain-node-datum';

export type SomeElementForSelection =
  | Window
  | Document
  | Element
  | d.EnterElement
  | SVGCircleElement
  | null;

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
