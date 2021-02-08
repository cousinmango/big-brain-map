import type * as d from "d3";
import type {
  BrainNodeElementSelection,
  ParentSvgGroupSelectionForWholeBrainMap,
  ParentSvgGGroupSelectionForMappedNodesLinksLabels,
  SomeElementForSelection,
} from "src/models/d3-aliases/elements/element-selection";
import type { BrainLinkDatum } from "src/models/d3-datum/brain-link-datum";
import type { BrainMap } from "src/models/d3-datum/brain-map";
import type { BrainNodeDatum } from "src/models/d3-datum/brain-node-datum";
// import { handleSelectionDrag } from '../behaviours/handle-drag-selection.js';
import type { BrainColourScale } from "../colours/brain-colour-scale";
import { setupRepositioningTickHandler } from "../simulation/simulation-positioning.js";
import { getDragBehaviourConfigForSelectionCall } from "../behaviours/drag-element-event.js";

export function getScaledColourValueFromNodeGroup(
  node: BrainNodeDatum,
  scale: BrainColourScale,
): string {
  return scale(`${node.group}`);
}

export function drawChartFromData(
  nodesLinksData: BrainMap,
  d3: typeof d,
  initedColourScale: BrainColourScale = d3.scaleOrdinal(d3.schemeCategory10),
): void {
  const { nodes, links } = nodesLinksData;

  const forceSim: d.Simulation<BrainNodeDatum, BrainLinkDatum> = d3.forceSimulation(nodes);

  const collisionForceLink = d3
    .forceLink<BrainNodeDatum, BrainLinkDatum>(links)
    .id((node) => node.id)
    .distance(1);

  /**
   * Wrapping these chained calls into separate functions mainly for self-descriptive benefit
   *
   * Also doco and default parameters inside.
   *
   * Mutations on the force simulation configuration
   *
   * May obscure maintainability for D3 pros.
   */
  simForceLink(forceSim, collisionForceLink);
  simForceCharge(forceSim, d3);
  simCenterWithinViewport(forceSim, d3);
  simCollisionForceRadius(forceSim, d3);

  const viewboxedParentSvg: ParentSvgGroupSelectionForWholeBrainMap = getCreateAppendedSvgToBodyWithViewBoxDimensions(
    d3,
  );
  const svgContainerGroupG: ParentSvgGGroupSelectionForMappedNodesLinksLabels = getAppendedGGroup(
    viewboxedParentSvg,
  );

  // Call the zoomability handler on the overarching svg group
  // Even though the zoom handler mutates the g group one level down

  viewboxedParentSvg.call(
    (d3.zoom() as d.ZoomBehavior<SVGSVGElement, unknown>)
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ])
      .scaleExtent([0.1, 8])
      // Zoom event listener and handler
      .on("zoom", (zoomEvent, _node) => {
        const parentGGroupToTransform = svgContainerGroupG;
        const transform = zoomEvent.transform;
        parentGGroupToTransform.attr("transform", transform);
      }),
  );

  const circleNodes: d.Selection<
    Element,
    unknown,
    SVGGElement,
    unknown
  > = svgContainerGroupG
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle");

  const paintedNodes: BrainNodeElementSelection = (circleNodes
    .data(nodes)
    .join("circle")
    .attr("id", (node) => node.id)
    .attr("r", (node) => node.id.length * 4)
    .attr("fill", (node, _index, _groups) =>
      getScaledColourValueFromNodeGroup(node, initedColourScale),
    ) as BrainNodeElementSelection)
    .call(getDragBehaviourConfigForSelectionCall(forceSim, d3))
    .on(
      "click",
      (_zoomEvent, _node) => {
        // Do we really need to pass in the node
        // Just to get the node id
        // and then mutate/select the DOM based on the passed in node ID?
        // Can we pass in just the selection instead

        // We can access the attributes directly...
        // Doesn't need another d3.select each time.
        // The examples have a mishmash of styles and conventions

        // Benefit of typings.
        // Can see the properties available conforming to the library functions
        // - TODO: Confirm the d3 documentation sim sets the x y similarly to cx cy
        const nodeX = _node.x ?? 0;
        const nodeY = _node.y ?? 0;
        const width = innerWidth;
        const height = innerHeight;
        const viewCentreX = width / 2;
        const viewCentreY = height / 2;

        const selectedWholeViewboxToRezoomPan: ParentSvgGroupSelectionForWholeBrainMap = viewboxedParentSvg;

        /**
         * Pan zoom the whole rendered SVG
         */
        type TopLevelPanZoomTransition = d.Transition<SVGSVGElement, unknown, HTMLElement, unknown>;

        const baseTransform = d3.zoomIdentity;
        // No datum model for typing here. General top-level SVG and HTML
        const panZoomTransitionToBuild: TopLevelPanZoomTransition = selectedWholeViewboxToRezoomPan.transition();
        const transitionDurationMilliseconds = 750;

        const translationX = viewCentreX - nodeX;
        const translationY = viewCentreY - nodeY;

        const translatedTransform: d.ZoomTransform = baseTransform.translate(
          translationX,
          translationY,
        );

        const zoomTransform = d3
          .zoom()
          .extent([
            [0, 0],
            [width, height],
          ])
          .scaleExtent([0.1, 8])
          .on("zoom", (zoomEvent, __node) => {
            // The end state of the zoom which would potentially be a reusable function
            const parentGGroupToTransform = svgContainerGroupG;
            const transform = zoomEvent.transform;
            parentGGroupToTransform.attr("transform", transform);
          });

        const builtPanZoomTransition: TopLevelPanZoomTransition = panZoomTransitionToBuild
          .duration(transitionDurationMilliseconds)
          .call(
            // - FIXME: Maybe there's an alternate way to set this up without using .call
            // Coerced into a random type even though d3.Selection or d3.Transform should be callable
            (zoomTransform.transform as unknown) as (
              // bug eslint does not realise this is type annotation TS vs JS.
              // eslint-disable-next-line no-unused-vars
              _transition: d.Transition<SVGSVGElement, unknown, HTMLElement, unknown>,
              ..._args: any[]
            ) => any,
            translatedTransform,
          );

        return builtPanZoomTransition;
      },
      // (_event: d.D3ZoomEvent<Element, unknown>, _d): d.ZoomBehavior<Element, unknown> => {

      // return (
      //   d3
      //     .zoom()
      //     .extent([
      //       [0, 0],
      //       [innerWidth, innerHeight],
      //     ])
      //     .scaleExtent([0.1, 8])
      //     // "start", "zoom", "end"
      //     .on(
      //       'zoom',
      //       (
      //         zoomEvent: d.D3ZoomEvent<Element, BrainNodeDatum>,
      //         _node: unknown | BrainNodeDatum,
      //       ) => {
      //         const { transform } = zoomEvent;

      //         svgContainerGroupG.attr('transform', transform.toString());
      //       },
      //     )
    );

  const paintedLinks = getSelectedJoinedStrokeLinks(svgContainerGroupG, links);

  const selectedLabelGGroup = svgContainerGroupG.append("g");
  const selectedTextLabels = selectedLabelGGroup.selectAll("text");

  const paintedLabels = selectedTextLabels
    .data(nodes)
    .join("text")
    .text((node) => node.id)
    .attr("fill", "black")
    .attr("dy", "0em")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .call((_selection: any, ..._args: any[]) => {
      /**
       * The verbose way of the one-liner. Do not need to explicitly pass in these parameters
       * Shown here for clarity future maintainability of the types, how the DragBehaviour selection trigger works
       */
      return getDragBehaviourConfigForSelectionCall(forceSim, d3)(_selection, _args);
    });

  /**
   * selection.call(dragBehaviour)
   * is apparently synonymous to
   * dragBehaviour(selection)
   * Code documentation seems to prefer the trigger via selection.call()
   */

  paintedNodes.append("title").text((node) => node.id);

  setupRepositioningTickHandler(forceSim, paintedNodes, paintedLinks, paintedLabels);
}
function getSelectedJoinedStrokeLinks(
  svgContainerGroupG: d.Selection<SVGGElement, unknown, HTMLElement, any>,
  links: BrainLinkDatum[],
): d.Selection<SomeElementForSelection, BrainLinkDatum, SVGGElement, unknown> {
  return svgContainerGroupG
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (node) => Math.sqrt(node.value));
}

function getAppendedGGroup(
  svg: d.Selection<SVGSVGElement, unknown, HTMLElement, any>,
): d.Selection<SVGGElement, unknown, HTMLElement, any> {
  return svg.append("g");
}

function getCreateAppendedSvgToBodyWithViewBoxDimensions(
  d3: typeof d,
  width: number = innerWidth,
  height: number = innerHeight,
): d.Selection<SVGSVGElement, unknown, HTMLElement, any> {
  return d3.select("body").append("svg").attr("viewBox", `0 0 ${width} ${height}`);
}

function simCollisionForceRadius(
  forceSim: d.Simulation<BrainNodeDatum, BrainLinkDatum>,
  d3: typeof d,
  forceNodeRadius: d.ForceCollide<BrainNodeDatum> = d3.forceCollide<BrainNodeDatum>(
    (node) => node.id.length * 5,
  ),
): d.Simulation<BrainNodeDatum, BrainLinkDatum> {
  return forceSim.force("collisionForce", forceNodeRadius);
}

/**
 *
 * @param forceSim simulation which handles positioning of elements nodes links labels on tick
 * @param d3 loaded/imported window d3
 * @param width Used to calculate the midpoint for centre along x axis. Defaults to window innerWidth DOM js global var
 * @param height Used to calculate the midpoint for centre along y axis. Defaults to window innerWidth DOM js global var
 */
function simCenterWithinViewport(
  forceSim: d.Simulation<BrainNodeDatum, BrainLinkDatum>,
  d3: typeof d,
  width = innerWidth / 2,
  height = innerHeight / 2,
): d.Simulation<BrainNodeDatum, BrainLinkDatum> {
  return forceSim.force("center", d3.forceCenter(width, height));
}

function simForceCharge(
  forceSim: d.Simulation<BrainNodeDatum, BrainLinkDatum>,
  d3: typeof d,
): d.Simulation<BrainNodeDatum, BrainLinkDatum> {
  return forceSim.force("charge", d3.forceManyBody<BrainNodeDatum>().strength(-500));
}

function simForceLink(
  forceSim: d.Simulation<BrainNodeDatum, BrainLinkDatum>,
  collisionForceLink: d.ForceLink<BrainNodeDatum, BrainLinkDatum>,
): d.Simulation<BrainNodeDatum, BrainLinkDatum> {
  return forceSim.force("link", collisionForceLink);
}
