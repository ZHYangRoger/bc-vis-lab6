export default function StackedAreaChart(container){
    //initialization
    let margin = {top: 20, right: 10, bottom: 20, left: 45};
    const width = 650 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
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

    const color = d3.scaleOrdinal()
                    .range(d3.schemeSet3);

    const tooltip = svg.append("text")
                        .attr("class", "y-axis-title")
                        .attr('x', -15)
                        .attr('y', -5)
    
    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    let selected = null, xDomain, data;
    //update                
    function update(_data){
        //const keys = ["Wholesale and Retail Trade", "Manufacturing", "Leisure and hospitality", "Business services", "Construction", "Education and Health", "Government", "Finance", "Self-employed", "Other", "Transportation and Utilities", "Information", "Agriculture", "Mining and Extraction"];
        data = _data;
        console.log(data.columns.slice(1));
        const keys = selected ? [selected] : data.columns.slice(1);
        //console.log(new_data);
        xScale.domain(xDomain? xDomain: d3.extent(data, d=>d.date));
        //console.log(keys);
        //scales
        //xScale.domain(d3.extent(data, d=>d.date));
        
        color.domain(keys);

        //stack
        const stack = d3.stack()
                .keys(keys)
                // .order(d3.stackOrderNone)
                // .offset(d3.stackOffsetNone);

        const series = stack(data);
        //console.log(series);
        yScale.domain([0, d3.max(series, d => d3.max(d, d => d[1]))]);
        //axes
       

        //area
            const area = d3.area()
            .x(d => xScale(d.data.date))
            .y1(d => yScale(d[1]))
            .y0(d => yScale(d[0]));

        const areas = svg.selectAll(".area")
                        .data(series);

        areas.enter()
            .append("path")
            .attr('stroke', "black")
            .attr("clip-path", "url(#clip)")
            .attr("fill", function(d){
                return color(d.key)
            })
            .merge(areas)
            .attr("d", area)
            .on("mouseover", (event, d, i) => tooltip.text(d.key))
            .on("mouseout", () => tooltip.text(""))
            .on("click", (event, d) => {
                if (selected === d.key){
                    selected = null;
                }
                else{
                    selected = d.key;
                }
                update(data);
            }
            );

        areas.exit().remove();

        const xAxis = d3.axisBottom(xScale)
                    

        const yAxis = d3.axisLeft(yScale)

        svg.select(".x-axis")
            .call(xAxis);
        
        svg.select(".y-axis")
            .call(yAxis);     
    }
    function filterByDate(range){
		xDomain = range;  // -- (3)
		update(data); // -- (4)
	}
    return{
        update,
        filterByDate
    };
}