let data;

async function loadData(url){
    let d = await d3.csv(url, d3.autoType);
    return d;
}

async function main(){
    const url = "unemployment.csv";
    data = await loadData(url);

    //compute total
    data.forEach(function callbackFn(element, index){
        let total = 0;
        for (const [key, value] of Object.entries(element)) {
            if (key == "date") continue;
            total += value;
        }
        element.total = total;
    });

    //reusable chart template
    function AreaChart(container){
        
}
}

main();