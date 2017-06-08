$(function () {
    //flog("init kpis", $(".kpiVis"));
    $(".kpiVis").kpiVis(); // initialise kpi visualisation components
    $(".salesVis").seriesVis(); // initialise kpi visualisation components
    $(".kpi-circle").each(function (i, n) {
        var div = $(n);
        var val = div.data("value");
        var height = div.data("height");
        flog("height", height);
        var size = height * 0.8;
        
        div.circleProgress({
            value: val,
            size: size,
            fill: {
                gradient: ["red", "orange"]
            }
        });
    });
});