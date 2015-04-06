$(function () {
    flog("Init reports");
    var reportContainer = $('#annual');
    var itemsContainer = $('#items');
    var reportRange = $('#report-range');

    reportRange.exist(function () {
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
                function (start, end) {
                    flog('onChange', start, end);
                    updateHref();
                    runReportWithDateRange( reportContainer, itemsContainer);
                }
        );
    });

    $(".report").on("click", ".toggle-select-org", function (e) {
        flog("click select toggle org");
        e.preventDefault();
        var a = $(e.target);
        var id = a.attr("href");
        if (a.hasClass("active")) {
            a.removeClass("active");
        } else {
            a.addClass("active");
        }
        flog("toggle org", id, a);
        updateHref();
        runReportWithDateRange( reportContainer, itemsContainer);
    });

    var sIds = getParameterByName("ids");
    var ids = sIds.split(",");
    $.each(ids, function (i, n) {
        if (n != "") {
            flog("select active", $(".report a.toggle-select-org[href=" + n + "]"));
            $(".report a.toggle-select-org[href=" + n + "]").addClass("active");
        }
    });

    $('.report').on('hide.bs.dropdown', function () {
        return false;
    });
});

function updateHref() {
    var href = window.location.pathname + "?";
    var ids = "";
    $(".report .toggle-select-org.active").each(function (i, n) {
        ids += $(n).attr("href") + ",";
    });
    href += "ids=" + ids;
    var reportRange = $('#report-range');
    var arr = reportRange.val().split('-');
    var startDate = '';
    var finishDate = '';
    if (arr.length > 0) {
        startDate = arr[0].trim();
    }
    if (arr.length > 1) {
        finishDate = arr[1];
    }

    href += '&startDate=' + startDate + '&finishDate=' + finishDate;
    history.pushState(null, null, href);

    $('a.dated').each(function (i, n) {
        var target = $(n);
        var href = target.attr('href');
        log('href', href);

        var pos = href.indexOf('?');
        if (pos > 0) {
            href = href.substring(0, pos);
        }

        href += '?startDate=' + startDate + '&finishDate=' + finishDate + "&ids=" + ids;
        target.attr('href', href);
    });
}

function arrayContains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] == obj) {
            return true;
        }
    }
    return false;
}

function removeFromArray(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function runReport(startDate, reportContainer, itemsContainer, href) {
    runReportWithDateRange(startDate, null, reportContainer, itemsContainer, href);
}

function runReportWithDateRange(reportContainer, itemsContainer) {
    flog("runReportWithDateRange");
    $('.pageMessage').hide(100);

    $.ajax({
        type: "GET",
        url: window.location,
        dataType: 'json',
        success: function (resp) {
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
                    $.each(graphData.itemFields, function (i, f) {
                        var td = $('<th>');
                        td.text(f);
                        trHeader.append(td);
                    });

                    if (graphData.items) {
                        var tbody = table.find('tbody');
                        $.each(graphData.items, function (i, item) {
                            var tr = $('<tr>');
//                            log('item', item);
                            $.each(graphData.itemFields, function (i, f) {
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
        dateFormat: function (x) {
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