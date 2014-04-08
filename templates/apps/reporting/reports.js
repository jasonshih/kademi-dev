Bob.onDOMReady(function() {
    flog("Init reports");
    var reportContainer = $('#annual');
    var itemsContainer = $('#items');
    var reportRange = $('#report-range');

    reportRange.exist(function() {
        flog("init report range");
        reportRange.daterangepicker({
            format: 'DD/MM/YYYY', // YYYY-MM-DD
            ranges: {
                'Last 7 Days': [moment().subtract('days', 6), moment()],
                'Last 30 Days': [moment().subtract('days', 29), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
                'This Year': [moment().startOf('year'), moment()],
            },
        },
                function(start, end) {
                    flog('onChange', start, end);
                    // Eg http://admin.milton.olhub.com/reporting/org-websiteAccess?startDate=20%2F02%2F2014+&finishDate=+27%2F02%2F2014
                    // http://localhost:8080/reporting/org-websiteAccess?startDate=02%2F06%2F2014+&finishDate=+02%2F28%2F2014

                    //var rangeText = formatDate(start) + " " + formatDate(end);
                    //flog("rangeText", rangeText);
                    runReportWithDateRange(start, end, reportContainer, itemsContainer, window.location.pathname);
                    updateDatedLinks();
                }
        );

        //runReport(reportRange.val(), reportContainer, itemsContainer, window.location.pathname);
        //updateDatedLinks();
    });
});



function updateDatedLinks() {
    var reportRange = $('#report-range');

    $('a.dated').each(function(i, n) {
        var target = $(n);
        var href = target.attr('href');
        log('href', href);

        var pos = href.indexOf('?');
        if (pos > 0) {
            href = href.substring(0, pos);
        }
        log('href2', href);

        var arr = reportRange.val().split('-');
        var data = {};
        var startDate = '';
        var finishDate = '';
        if (arr.length > 0) {
            startDate = arr[0].trim();
        }
        if (arr.length > 1) {
            finishDate = arr[1];
        }

        href += '?startDate=' + startDate + '&finishDate=' + finishDate;
        target.attr('href', href);
    });
}

function runReport(startDate, reportContainer, itemsContainer, href) {
    runReportWithDateRange(startDate, null, reportContainer, itemsContainer, href);
}

function runReportWithDateRange(startDate, endDate, reportContainer, itemsContainer, href) {
    flog('runReport', startDate, endDate);
    $('.pageMessage').hide(100);

    var data = {
        startDate: formatDate(startDate),
        finishDate: formatDate(endDate)
    };
    flog("data", data);

    $.ajax({
        type: "GET",
        url: href,
        dataType: 'json',
        data: data,
        success: function(resp) {
            flog('response', resp.data);

            if (resp.data !== null && resp.data.data.length === 0) {
                $('.pageMessage').html('No data was found for the given criteria').show(300);
                $(".details-items-wrapper").hide();
            } else {
                showGraph(resp.data, reportContainer, itemsContainer);
                $(".details-items-wrapper").show();
            }

        }
    });

}

function showGraph(graphData, reportContainer, itemsContainer) {
    flog('showGraph', reportContainer, graphData);

    if (graphData) {
        reportContainer.removeClass('nodata');
        reportContainer.html('');
        if (itemsContainer) {
            itemsContainer.html('');
        }
        if (graphData.data.length > 0) {
            if (graphData.graphType == 'Line') {
                showLine(reportContainer, graphData);
            } else if (graphData.graphType == 'Bar') {
                showBar(reportContainer, graphData);
            }
            if (itemsContainer) {
                if (graphData.itemFields) {
                    var table = $('<div class="table-responsive"><table class="table table-bordered table-striped table-hover table-condensed"><thead><tr></tr></thead><tbody><tr></tr></tbody></table></div>');
                    var trHeader = table.find('thead tr');
                    $.each(graphData.itemFields, function(i, f) {
                        var td = $('<th>');
                        td.text(f);
                        trHeader.append(td);
                    });

                    if (graphData.items) {
                        var tbody = table.find('tbody');
                        $.each(graphData.items, function(i, item) {
                            var tr = $('<tr>');
//                            log('item', item);
                            $.each(graphData.itemFields, function(i, f) {
//                                log('field', f);
                                var td = $('<td>');
                                td.text(item[f]);
                                tr.append(td);
                            });
                            tbody.append(tr);
                        });
                    }
                    itemsContainer.append(table);
                } else {
                    reportContainer.addClass('nodata');
                    reportContainer.html('<p class="nodata alert alert-info">No data</p>');
                }
            }
        }
    }
}

function showLine(reportContainer, graphData) {
    Morris.Line({
        element: reportContainer,
        data: graphData.data,
        xkey: graphData.xkey,
        ykeys: graphData.ykeys,
        labels: graphData.labels,
        hideHover: true,
        xLabels: 'day',
        dateFormat: function(x) {
            var dt = new Date(x).formatDDMMYYYY();
            //var dt = new Date(x).toString();
            //log('formatted date', x, dt, new Date(x).formatDDMMYYYY());
            return dt;
        } // see common.js
    });
}

function showBar(reportContainer, graphData) {
    Morris.Bar({
        element: reportContainer,
        data: graphData.data,
        xkey: graphData.xkey,
        ykeys: graphData.ykeys,
        labels: graphData.labels
    });
}