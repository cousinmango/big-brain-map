// Namespace to avoid HTML5 DOM API conflicts.
import type * as d from "d3";

import { drawChartFromData } from "./helpers/d3-config/charts/draw-mind-map.js";
import { AliasedLabelSelection } from "./models/d3-aliases/elements/element-selection.js";
import { BrainLinkDatum } from "./models/d3-datum/brain-link-datum.js";
import type { BrainMap } from "./models/d3-datum/brain-map.js";
import { BrainNodeDatum } from "./models/d3-datum/brain-node-datum.js";
// .js suffix for all tsc imports.
import { miserableData } from "./seed/miserables.js";

// Loaded via script src index.html
export const d3: typeof d = window.d3;

const seedData: BrainMap = miserableData;

const drawnSelections = drawChartFromData(seedData, d3);

const { brainSim, nodesSelection, linksSelection, labelsSelection } = drawnSelections;
// Mutate data array ? auto simulation tick nodes and links hopefully.
brainSim;
const newNode = { id: "Numba1", group: 1 };
const newLink: BrainLinkDatum = {
  source: "Numba1",
  target: "Myriel?@#$%(*@&%*(@#&^*(&(UHSD(FHS(*H#W*TU#(THn21u517591^*@#(%&!(#^)_&",
  value: 10000,
};

nodesSelection.data().push(newNode);
const nodesData: BrainNodeDatum[] = nodesSelection.data();
const linksData = linksSelection.data();
labelsSelection;

const selectedLabelGGroup = d3.select("body > svg > g > g:nth-child(3)");

const selectedTextLabels: AliasedLabelSelection = selectedLabelGGroup.selectAll(
  "text",
) as AliasedLabelSelection;
const newNodes = [...nodesData, newNode];
const newLinks = [...linksData, newLink];

selectedTextLabels
  .data(newNodes, (_node) => _node.id)
  .join("text")
  .text((node) => node.id)
  .attr("fill", "black")
  .attr("dy", "0em")
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle");
selectedLabelGGroup.data(newNodes).join("text");

nodesSelection
  .data(newNodes, (_node) => _node.id)
  .join("circle")
  .attr("id", (node) => node.id)
  .attr("r", (node) => node.id.length * 4);

linksSelection
  .append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6)
  .data(newLinks, (link: BrainLinkDatum) => link.source + "lolgglolid" + link.target)
  .join("line")
  .attr("stroke-width", (node) => Math.sqrt(node.value));

brainSim.tick();
