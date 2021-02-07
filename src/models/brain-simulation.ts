import type * as d from "d3";
import type { BrainLinkDatum } from "./d3-datum/brain-link-datum";
import type { BrainNodeDatum } from "./d3-datum/brain-node-datum";

export type BrainSimulation = d.Simulation<BrainNodeDatum, BrainLinkDatum>;
