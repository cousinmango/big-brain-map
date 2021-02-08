// Namespace to avoid HTML5 DOM API conflicts.
import type * as d from "d3";

import { drawChartFromData } from "./helpers/d3-config/charts/draw-mind-map.js";
import type { BrainMap } from "./models/d3-datum/brain-map.js";
// .js suffix for all tsc imports.
import { miserableData } from "./seed/miserables.js";

// Loaded via script src index.html
export const d3: typeof d = window.d3;

const seedData: BrainMap = miserableData;

const drawnSelections = drawChartFromData(seedData, d3);

drawnSelections.nodesSelection;
// Mutate data array ? auto simulation tick nodes and links hopefully.
