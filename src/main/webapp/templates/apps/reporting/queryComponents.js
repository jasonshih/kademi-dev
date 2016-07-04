$(function() {
    flog("init query components", $(".query-data-histogram, .query-pie-chart"));

    $(".query-data-histogram").dateAgg();
    $(".query-pie-chart").pieChartAgg();
});