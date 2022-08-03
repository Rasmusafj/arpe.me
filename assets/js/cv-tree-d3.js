import * as d3 from 'd3';
import { style } from 'd3';

var extraHeightSubtract = 200;
var margin = { top: 70, right: 70, bottom: 30, left: 70 };
var width = document.getElementById("chartId").clientWidth - margin.left - margin.right;
var height = 5000 - margin.top - margin.bottom - extraHeightSubtract;

// Screen width < 400

// Screen width < 1135


function isWidthSmall() {
    return innerWidth <= 768;
}

function isWidthMedium() {
    return innerWidth > 768 && innerWidth <= 1135;
}


function changeHeight(newHeight) {
    height = newHeight - margin.top - margin.bottom - extraHeightSubtract;
    d3.select("#inside-svg")
        .attr("height", height + margin.top + margin.bottom)
}

var svg = d3.select("div#chartId")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "inside-svg")
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    .attr("id", "g-inside-svg")


class NodeText {
    constructor(title, subtitle, bodyText, year, side, leftMargin, topMargin) {
        this.title = title;
        this.subtitle = subtitle;
        this.bodyText = bodyText;
        this.year = year;
        this.side = side;
        this.leftMargin = leftMargin;
        this.topMargin = topMargin;
    }

    getHtml() {
        if (this.subtitle == null) {
            return `<div class="card-body timeline-info">
            <h5 class="card-title">${this.title}</h5>
            <p class="card-text">${this.bodyText}</p>
          </div>`
        }
        return `<div class="card-bod timeline-info">
        <h5 class="card-title">${this.title}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${this.subtitle}</h6>
        <p class="card-text">${this.bodyText}</p>
      </div>`

    }

}

class NodeAttributes {
    constructor(cx, cy, radius, strokeColor, fillHexColor) {
        this.cx = cx;
        this.cy = cy;
        this.radius = radius;
        this.strokeColor = strokeColor;
        this.fillHexColor = fillHexColor;
    }
}

class TimelineNode {

    constructor(side, nodeText, nodeAttributes) {
        this.side = side;
        this.nodeText = nodeText;
        this.nodeAttributes = nodeAttributes;
    }
}

async function drawCvTree(includeList, numberOfNodesHeight) {

    function drawCircle(newNode) {
        // First we add the circle to the svg

        const circle = svg.append("circle")
            .attr('cx', newNode.nodeAttributes.cx)
            .attr("cy", newNode.nodeAttributes.cy)
            .attr('fill', newNode.nodeAttributes.fillHexColor)
            .style("fill-opacity", 1.0)

        circle.transition()
            .duration(1000)
            .attr('r', newNode.nodeAttributes.radius)


        const text = svg.append("text")
            .attr("class", "robo-bold")
            .attr("y", newNode.nodeAttributes.cy + 10)
            .style("font-size", "25px")
            .style("fill", "white")
            .text(newNode.nodeText.year)

        text.transition()
            .duration(1000)
            .attr("x", newNode.nodeAttributes.cx - 28)

        // Need to bind data to these if small screen for tooltip display
        if (isWidthSmall()) {
            circle
                .datum(newNode)

            text
                .datum(newNode)
        }
    }


    function drawTextBox(newNode) {

        // Next, we draw the textbox
        let tooltip = d3.select("div#chartId")
            .append("div")
            .attr("class", "tooltip-div")
            .html(newNode.nodeText.getHtml())


        const containerOffsetLeft = document.getElementById("chartId").offsetLeft;
        const containerOffsetTop = document.getElementById("chartId").offsetTop;

        let left = containerOffsetLeft;
        let top = containerOffsetTop;

        if (newNode.nodeText.side === "right") {
            left += newNode.nodeAttributes.cx + newNode.nodeAttributes.radius;
            top += newNode.nodeAttributes.cy;
        } else if (newNode.nodeText.side === "left") {
            left += newNode.nodeAttributes.cx - newNode.nodeAttributes.radius - 500;
            top += newNode.nodeAttributes.cy;
        }

        tooltip
            .style("left", `${left + 85 + newNode.nodeText.leftMargin}px`)
            .style("top", `${top + newNode.nodeText.topMargin}px`);

    }

    function drawPath(parentNode, newNode) {

        let source = [parentNode.nodeAttributes.cx, parentNode.nodeAttributes.cy]
        let target = [newNode.nodeAttributes.cx, newNode.nodeAttributes.cy - newNode.nodeAttributes.radius]
        if (newNode.side === "right") {
            source[0] += newNode.nodeAttributes.radius;
        } else if (newNode.side === "left") {
            source[0] -= newNode.nodeAttributes.radius;
        } else {
            source[1] += newNode.nodeAttributes.radius;
        }

        let links = d3.linkVertical()({
            source: source,
            target: target
        });

        svg
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('d', links)
            .style("opacity", 0)
            .transition()
            .duration(2000)
            .delay(400)
            .style("opacity", 1)

    }

    function drawNode(parentNode, newNode) {
        const textboxMargin = 15;

        drawCircle(newNode);
        if (!isWidthSmall()) {
            drawTextBox(newNode, textboxMargin);
        }

        // If parentNode is given, we need to draw links as well between parent and child
        if (parentNode !== undefined && parentNode !== null) {
            drawPath(parentNode, newNode);
        }
    }


    function nodeDataToTimelineNode(nodeData, height, widthRange) {

        let nodeTextPosition = nodeData.textPosition;
        let nodeTextMarginTop = nodeData.textMarginTop;
        let nodePosition = nodeData.nodePosition;
        let nodeTextMarginLeft = nodeData.textMarginLeft;
        if (isWidthMedium()) {
            if (nodeData.textPositionMedium !== null && nodeData.textPositionMedium !== undefined) {
                nodeTextPosition = nodeData.textPositionMedium
            }
            if (nodeData.textMarginTopMedium !== null && nodeData.textMarginTopMedium !== undefined) {
                nodeTextMarginTop = nodeData.textMarginTopMedium
            }
            if (nodeData.nodePositionMedium !== null && nodeData.nodePositionMedium !== undefined) {
                nodePosition = nodeData.nodePositionMedium
            }
            if (nodeData.textMarginLeftMedium !== null && nodeData.textMarginLeftMedium !== undefined) {
                nodeTextMarginLeft = nodeData.textMarginLeftMedium
            }
        };

        var nodeTextTop = new NodeText(nodeData.title,
            nodeData.subtitle, nodeData.description, nodeData.yearBegin, nodeTextPosition,
            nodeTextMarginLeft, nodeTextMarginTop)


        let cx = 0;
        if (nodePosition === "middle") {
            cx = widthRange[1];
        } else if (nodePosition === "right") {
            cx = widthRange[2];
        } else if (nodePosition === "left") {
            cx = widthRange[0];
        }

        let nodeColor = null;
        if (nodeData.type === "Personal") {
            nodeColor = "#F26419"
        } else if (nodeData.type === "Studies") {
            nodeColor = "#F6AE2D"
        } else if (nodeData.type === "Work") {
            nodeColor = "#33658A"
        }

        // Default
        let circleRadius = nodeData.significance * 7

        if (isWidthMedium()) {
            circleRadius = nodeData.significance * 5;
        } else if (isWidthSmall()) {
            circleRadius = nodeData.significance * 5;
        }

        var nodeAttributes = new NodeAttributes(cx, height, circleRadius, nodeData.nodeColor, nodeColor)
        var timelineNode = new TimelineNode("straight", nodeTextTop, nodeAttributes)
        return timelineNode;
    }


    function drawBranch(branch, parentNode, heightRange, widthRange, includeTypes) {
        branch
            .filter((nodeData) => includeTypes.includes("All") || includeTypes.includes(nodeData.type))
            .forEach((nodeData, index) => {

                let timelineNode = nodeDataToTimelineNode(nodeData, heightRange[index + 1], widthRange);
                drawNode(parentNode, timelineNode)
                parentNode = timelineNode;
            })

    }

    var data = null;
    await fetch("./assets/js/cv-tree-data.json")
        .then(fetchedData => fetchedData.json())
        .then(fetchedData => data = fetchedData);

    function drawCvTreeInside(numberNodesHeight) {
        var numberNodesWidth = 3

        var heightRange = d3.range(numberNodesHeight).map(rangeNumber => (rangeNumber) * (height / numberNodesHeight));

        var widthRange = [0]
        for (let i = (numberNodesWidth - 1); i > 0; i--) {
            widthRange.push(width / i);
        }

        // First we draw the initial node
        const timelineNode = nodeDataToTimelineNode(data.common[0], 0, widthRange)
        drawNode(null, timelineNode);
        drawBranch(data.professional, timelineNode, heightRange, widthRange, includeList);
    }

    if (isWidthSmall()) {
        var smallScreenTooltip = d3.select("div#chartId")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip tooltip-small-screen-id")
            .style("background-color", "white")
            .style("border", "solid")
            .style("max-width", "80%")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");

        var mouseover = function (d) {
            smallScreenTooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }

        const containerOffsetLeft = document.getElementById("chartId").offsetLeft;
        const containerOffsetTop = document.getElementById("chartId").offsetTop;

        var mousemove = function (d) {
            smallScreenTooltip
                .html(d.path[0].__data__.nodeText.getHtml())
                .style("left", `${containerOffsetLeft}px`)
                .style("top", `${containerOffsetTop + 100 + d3.pointer(d)[1]}px`)
        }

        var mouseleave = function (d) {
            smallScreenTooltip
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0);
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }
    }

    drawCvTreeInside(numberOfNodesHeight);

    if (isWidthSmall()) {
        svg.selectAll('circle')
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        svg.selectAll('text')
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
    }
}


// When number nodes == 14, height is 5000
// So 1 node equals height approx 357
// Hardcode values... 
var currentToggle = ['All']

var professionalNumberNodes = 8;
var personalNumberNodes = 3;
var studiesNumberNodes = 3;
var allNumberNodes = professionalNumberNodes + personalNumberNodes + studiesNumberNodes;

drawCvTree(currentToggle, allNumberNodes);

function clearDrawing() {
    d3.select("#g-inside-svg").selectAll("*").remove();
    const infoBoxes = document.querySelectorAll('.tooltip-div, .tooltip-small-screen-id');
    infoBoxes.forEach(box => {
        box.remove();
    });
    const tooltipSmallScreen = document.getElementById('tooltip-small-screen-id');
    if (tooltipSmallScreen !== null && tooltipSmallScreen !== undefined) {
        tooltipSmallScreen.remove();
    }
}

function buttonClickRedrawCvTree(event) {
    const button = event.target;
    const buttonValue = button.textContent || button.innerText;

    if (currentToggle.includes(buttonValue)) {
        currentToggle.splice(currentToggle.indexOf(buttonValue), 1);
        button.style.opacity = "0.3";

    } else {
        if (buttonValue === "All") {
            // Deactivate all buttons
            Array.from(document.getElementById("timeline-buttons").children).forEach((elem) => {
                elem.style.opacity = "0.3";
                let textButtonValue = elem.textContent || elem.innerText;
                currentToggle.splice(currentToggle.indexOf(textButtonValue), 1);
            });

        } else {
            // Deactivate the All button
            Array.from(document.getElementById("timeline-buttons").children).forEach((elem) => {
                let textButtonValue = elem.textContent || elem.innerText;
                if (textButtonValue === "All" && currentToggle.includes("All")) {
                    elem.style.opacity = "0.3";
                    currentToggle.splice(currentToggle.indexOf(textButtonValue), 1);
                }
            });
        }
        currentToggle.push(buttonValue);
        button.style.opacity = "1.0";
    }

    let numberNodes = 1;
    if (currentToggle.includes("All")) {
        numberNodes = allNumberNodes;
    };
    if (currentToggle.includes("Work")) {
        numberNodes += professionalNumberNodes;
    };
    if (currentToggle.includes("Studies")) {
        numberNodes += studiesNumberNodes;
    };
    if (currentToggle.includes("Personal")) {
        numberNodes += personalNumberNodes;
    };

    clearDrawing();
    changeHeight(357 * numberNodes)
    drawCvTree(currentToggle, numberNodes)

}

document.getElementById("timeline-buttons").addEventListener('click', buttonClickRedrawCvTree);

function doRedrawNotFilterEvent() {
    clearDrawing();

    let numberNodes = 1;
    if (currentToggle.includes("All")) {
        numberNodes = allNumberNodes;
    };
    if (currentToggle.includes("Work")) {
        numberNodes += professionalNumberNodes;
    };
    if (currentToggle.includes("Studies")) {
        numberNodes += studiesNumberNodes;
    };
    if (currentToggle.includes("Personal")) {
        numberNodes += personalNumberNodes;
    };
    drawCvTree(currentToggle, numberNodes);
}

if (isWidthSmall()) {
    const innerHtmlDesc = document.getElementById("timeline-text").innerHTML;
    document.getElementById("timeline-text").innerHTML = innerHtmlDesc + "Click on the circles to see more info about the event. However, switch to a larger screen for a much better experience! :-)"
}

if (!isWidthSmall()) {
    window.addEventListener("resize", doRedrawNotFilterEvent, false);
}

  