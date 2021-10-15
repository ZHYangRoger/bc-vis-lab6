export default function AreaChart(container){
    //initialization

    let margin = {top: 20, right: 10, bottom: 20, left: 45};
    const width = 650 - margin.left - margin.right;
    const height = 150 - margin.top - margin.bottom;
    const svg = d3.select(container)
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    let xScale = d3.scaleTime()
                    .range([0, width]);

    let yScale = d3.scaleLinear()
                    .range([height, 0]);       

    
    svg.append("path").attr("class", "areaChart");

    //brush
    const brush = d3
                .brushX()
                .extent( [ [0,0], [width,height] ] )
                .on("brush", brushed)
                .on("end", brushend);

    svg.append("g").attr('class', 'brush').call(brush);

    function brushed(event) {
        if (event.selection) {
            listeners["brushed"](event.selection.map(xScale.invert));
        }
    }

    function brushend(event){
        if (!event.selection){
            svg.select(".brush").call(brush.move, xScale.range());
        }
    }

    const listeners = { brushed: null };

    function update(data){
        //update
        //console.log(data);
        xScale.domain(d3.extent(data, d=>d.date));
        yScale.domain([0, d3.max(data, d => d.total)]);

        let xAxis = d3.axisBottom()
                    .scale(xScale);

    let yAxis = d3.axisLeft()
                    .ticks(3)
                    .scale(yScale);

    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    
    svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(0, ${width}`)
        .call(yAxis);

        svg.select(".areaChart")
        .datum(data)
        .attr("fill", "#cce5df")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("d", d3
                    .area()
                    .x(d => xScale(d.date))
                    .y1(d => yScale(d.total))
                    .y0(yScale(0)));
    }
    function on(event, listener) {
	    listeners[event] = listener;
    }
    return{
        update,
        on
    };
}
