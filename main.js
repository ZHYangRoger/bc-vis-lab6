import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

let data;

async function loadData(url){
    let d = await d3.csv(url, d3.autoType);
    return d;
}

async function main(){
    const url = "unemployment.csv";
    data = await loadData(url);

    //compute total
    let total_arr = [];
    data.forEach(function callbackFn(element, index){
        let total = 0;
        for (const [key, value] of Object.entries(element)) {
            if (key == "date") continue;
            total += value;
        }
        element.total = total;
        total_arr.push(total);
    });

    const areaChart = AreaChart(".areaChart");
    areaChart.update(data);

    const stackedAreaChart = StackedAreaChart(".stackedAreaChart");
    stackedAreaChart.update(data);

    areaChart.on("brushed", (range)=>{
        stackedAreaChart.filterByDate(range); // coordinating with stackedAreaChart
    })
}

main();