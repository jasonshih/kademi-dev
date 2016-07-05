$(function () {
    flog("init query components", $(".query-data-histogram, .query-pie-chart"));

    $(".query-data-histogram").dateAgg();
    $(".query-pie-chart").pieChartAgg();

    window.setTimeout(function () {
        var selDate = $.cookie("selectedDate") || '';
        selDate = selDate.trim();

        if (selDate === null || selDate === undefined || selDate === '') {
            selDate = "7-days"; // default
        }
        selectDate(selDate);
    }, 500);
    
    $("body").on("click", ".pageDatePicker", function(e) {
        e.preventDefault();
        var s = $(e.target).closest("a").attr("href");
        selectDate(s);
    });
    


    function selectDate(selDate) {
        $.cookie("selectedDate", selDate);
        $(".pageDatePicker li").removeClass("active");
        $(".pageDatePicker a[href='" + selDate + "']").closest("li").addClass("active");
        var dateOptions = calcDates(selDate);        
        $(document).trigger("pageDateChange", dateOptions);
        flog("new date selection", dateOptions);
    }

    function calcDates(sel) {
        var arr = sel.split("-");
        var num = parseInt(arr[0]);
        var units = arr[1];
        var now = moment();
        var from = moment().subtract(num, units);
        $(".pageSelectedDate").text(num + " " + units + " before now");

        var opts = {
            startDate: from.format('DD/MM/YYYY'),
            endDate: now.format('DD/MM/YYYY')
        };
        return opts;
    }
});