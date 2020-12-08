
/**
 * 
 * @param {string} dataPath 
 */
async function getData(dataPath = "./seed/miserables.json") {
    const responseData = fetch(dataPath).then(response => response.json());
    const jsonData = responseData;

    return jsonData
}

/**
 * 
 * @param {d3.Simulation<d3.SimulationNodeDatum>} simulation 
 */
function drag(simulation) {

    function dragStarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragEnded(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);
}

const height = window.innerHeight;
const width = window.innerWidth;

/**
 * Scales the data node .group value into arbitrary hexadecimal strings (for colour values)
 * e.g 1 = #00000 2 = #1f1f1f 10 = #ffffff
 */
function color() {
    const scale = d3.scaleOrdinal(d3.schemeCategory10);
    return d => scale(d.group);
}

function chart(data) {
    const links = data.links.map(d => Object.create(d));
    const nodes = data.nodes.map(d => Object.create(d));

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(1))
        .force("charge", d3.forceManyBody().strength(-500))
        .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3
        /*
            Remember to append the generated svg onto a page element
            (observablehq notebook depends cells and other auto-handling for visualisation)
        */
        .select("body")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 25)
        .attr("fill", color())
        .call(drag(simulation));

    node.append("title")
        .text(d => d.id);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    /*
        - NOTE: Some of there are observablehq-only definitions.
        Invalidation is for cell resource disposal (not relevant outside the observablehq notebook) 
        main.variable(observer("chart")).define("chart", ["data","d3","width","height","color","drag","invalidation"]
    */
    // invalidation.then(() => simulation.stop());

    return svg.node();
}

getData()
    .then(chart)
    .catch(
        reason =>
            console.error(`${reason}: Something went horribly wrong`)
    )
    ;
