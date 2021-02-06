import type * as d from 'd3';
import type {
  BrainNodeElementSelection,
  ParentSvgGroupSelectionForWholeBrainMap,
  ParentSvgGGroupSelectionForMappedNodesLinksLabels,
  SomeElementForSelection,
} from 'src/models/d3-aliases/elements/element-selection';
import type { BrainLinkDatum } from 'src/models/d3-datum/brain-link-datum';
import type { BrainMap } from 'src/models/d3-datum/brain-map';
import type { BrainNodeDatum } from 'src/models/d3-datum/brain-node-datum';
// import { handleSelectionDrag } from '../behaviours/handle-drag-selection.js';
import type { BrainColourScale } from '../colours/brain-colour-scale';
import { setupRepositioningTickHandler } from '../simulation/simulation-positioning.js';
import { getDragBehaviourConfigForSelectionCall } from '../behaviours/drag-element-event.js';

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

  const forceNodeRadius = d3.forceCollide<BrainNodeDatum>((node) => node.id.length * 5);
  const forceSim: d.Simulation<BrainNodeDatum, BrainLinkDatum> = d3.forceSimulation(nodes);

  const collisionForceLink = d3
    .forceLink<BrainNodeDatum, BrainLinkDatum>(links)
    .id((node) => node.id)
    .distance(1);

  simForceLink(forceSim, collisionForceLink);
  simForceCharge(forceSim, d3);
  simCenterWithinViewport(forceSim, d3);
  simCollisionForceRadius(forceSim, forceNodeRadius);

  const viewboxedParentSvg: ParentSvgGroupSelectionForWholeBrainMap = getCreateAppendedSvgToBodyWithViewBoxDimensions(
    d3,
  );

  const svgContainerGroupG: ParentSvgGGroupSelectionForMappedNodesLinksLabels = getAppendedGGroup(
    viewboxedParentSvg,
  );

  // Call the zoomability handler on the overarching svg group
  // Even though the zoom handler mutates the g group one level down

  viewboxedParentSvg.call(
    d3
      .zoom()
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ])
      .scaleExtent([0.1, 8])
      // Zoom event listener and handler
      .on('zoom', (zoomEvent, node) => {
        const parentGGroupToTransform = svgContainerGroupG;
        const transform = zoomEvent.transform;
        parentGGroupToTransform.attr('transform', transform);
      }),
  );
  // viewboxedParentSvg.call(() => {
  //   return (
  //     d3
  //       .zoom()
  //       .extent([
  //         [0, 0],
  //         [innerWidth, innerHeight],
  //       ])
  //       .scaleExtent([0.1, 8])
  //       // "start", "zoom", "end"
  //       .on('zoom', (zoomEvent: d.D3ZoomEvent<Element, BrainNodeDatum>, _node) => {
  //         const { transform } = zoomEvent;

  //         svgContainerGroupG.attr('transform', transform.toString());
  //       })
  //   );
  // });

  const circleNodes: d.Selection<
    d.BaseType,
    unknown,
    SVGGElement,
    unknown
  > = svgContainerGroupG
    .append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('circle');

  const paintedNodes: BrainNodeElementSelection = (circleNodes
    .data(nodes)
    .join('circle')
    .attr('id', (node) => node.id)
    .attr('r', (node) => node.id.length * 4)
    .attr('fill', (node, _index, _groups) =>
      getScaledColourValueFromNodeGroup(node, initedColourScale),
    ) as BrainNodeElementSelection)
    .call(getDragBehaviourConfigForSelectionCall(forceSim, d3))
    .on('click', (_event, _d) => {
      return (
        d3
          .zoom()
          .extent([
            [0, 0],
            [innerWidth, innerHeight],
          ])
          .scaleExtent([0.1, 8])
          // "start", "zoom", "end"
          .on('zoom', (zoomEvent: d.D3ZoomEvent<Element, BrainNodeDatum>, _node: unknown) => {
            const { transform } = zoomEvent;

            svgContainerGroupG.attr('transform', transform.toString());
          })
      );
    });

  const paintedLinks = getSelectedJoinedStrokeLinks(svgContainerGroupG, links);

  const paintedLabels = svgContainerGroupG
    .append('g')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .text((node) => node.id)
    .attr('fill', 'black')
    .attr('dy', '0em')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .call((_selection: any, ..._args: any[]) => {
      /**
       * The verbose way of the one-liner. Do not need to explicitly pass in these parameters
       * Shown here for clarity future maintainability of the types, how the DragBehaviour selection trigger works
       */
      return getDragBehaviourConfigForSelectionCall(forceSim, d3)(_selection, _args);
    });

  paintedNodes.append('title').text((node) => node.id);
  forceSim.on('tick');

  setupRepositioningTickHandler(forceSim, paintedNodes, paintedLinks, paintedLabels);
}
function getSelectedJoinedStrokeLinks(
  svgContainerGroupG: d.Selection<SVGGElement, unknown, HTMLElement, any>,
  links: BrainLinkDatum[],
): d.Selection<SomeElementForSelection, BrainLinkDatum, SVGGElement, unknown> {
  return svgContainerGroupG
    .append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', (node) => Math.sqrt(node.value));
}

function getAppendedGGroup(svg: d.Selection<SVGSVGElement, unknown, HTMLElement, any>) {
  return svg.append('g');
}

function getCreateAppendedSvgToBodyWithViewBoxDimensions(
  d3: typeof d,
  width: number = innerWidth,
  height: number = innerHeight,
) {
  return d3.select('body').append('svg').attr('viewBox', `0 0 ${width} ${height}`);
}

function simCollisionForceRadius(
  forceSim: d.Simulation<BrainNodeDatum, BrainLinkDatum>,
  forceNodeRadius: d.ForceCollide<BrainNodeDatum>,
) {
  return forceSim.force('collisionForce', forceNodeRadius);
}

function simCenterWithinViewport(
  forceSim: d.Simulation<BrainNodeDatum, BrainLinkDatum>,
  d3: typeof d,
) {
  return forceSim.force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2));
}

function simForceCharge(forceSim: d.Simulation<BrainNodeDatum, BrainLinkDatum>, d3: typeof d) {
  return forceSim.force('charge', d3.forceManyBody<BrainNodeDatum>().strength(-500));
}

function simForceLink(
  forceSim: d.Simulation<BrainNodeDatum, BrainLinkDatum>,
  collisionForceLink: d.ForceLink<BrainNodeDatum, BrainLinkDatum>,
) {
  return forceSim.force('link', collisionForceLink);
}
