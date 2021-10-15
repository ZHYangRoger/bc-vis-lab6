export default function AreaChart(container){
    //initialization

    let margin = {top: 20, right: 10, bottom: 20, left: 45};
    const width = 650 - margin.left - margin.right;
    const height = 650 - margin.top - margin.bottom;
    const svg = d3.select(".bar-chart")
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let xScale = d3.scaleTime()
                    .range([0, width]);

    let yScale = d3.scaleLinear()
                    .range([height, 0]);

    let xAxis = d3.axisBottom()
                    .scale(xScale);

    let yAxis = d3.axisLeft()
                    .scale(yScale);

function update(data){
    //update
    xScale.domain(data.map(d=>d.date));
    yScale.domain([0, ])
    let area = d3.area()
                .x(d => x(d.date))
                .y1(d => y(d.total))
                .y0(y(0));
}
return{
    update
};
}
