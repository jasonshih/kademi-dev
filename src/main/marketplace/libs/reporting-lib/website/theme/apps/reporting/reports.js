$(function () {
    flog("Init reports");
    var reportContainer = $('#annual');
    var itemsContainer = $('#items');

    $(document.body).on('pageDateChanged', function (e, startDate, endDate) {
        updateHref(startDate, endDate);
        flog("relod results", window.location);

        $("#reportResult").reloadFragment({
            url: window.location, // need to give explicitly, because otherwise querystring gets stripped
            whenComplete: function () {
                runReportWithDateRange(reportContainer, itemsContainer);
            }
        });
    });

    $(".report").on("click", ".term-select", function (e) {
        flog("click select toggle org");
        e.preventDefault();
        var target = $(e.target).closest("a");
        var newHref = target.attr("href");
        history.pushState(null, null, newHref);
        updateLinksWithParameters();

        $("#reportResult").reloadFragment({
            url: window.location, // need to give explicitly, because otherwise querystring gets stripped
            whenComplete: function () {
                runReportWithDateRange(reportContainer, itemsContainer);
            }
        });
    });


    $('.report').on('hide.bs.dropdown', function () {
        return false;
    });

    $(".report").on("change", ".agg-filter", function (e) {
        e.preventDefault();
        var input = $(e.target);
        var tbody = input.closest("tbody");
        var name = input.attr("name");
        var value = input.val();
        var uri = URI(window.location);
        uri.setSearch("filter-".concat(name), value);

        history.pushState(null, null, uri.toString());
        updateLinksWithParameters();

        $("#reportResult").reloadFragment({
            url: window.location,
            whenComplete: function () {
                runReportWithDateRange(reportContainer, itemsContainer);
            }
        });
    });
});

function updateHref(startDate, endDate) {
    var uri = URI(window.location);

    uri.setSearch("startDate", startDate);
    uri.setSearch("finishDate", endDate);

    flog("New dated uri", uri.toString());
    history.pushState(null, null, uri.toString());
    updateLinksWithParameters();
}

function updateLinksWithParameters() {
    var uri = URI(window.location);
    $('a.dated').each(function (i, n) {
        var target = $(n);
        var href = target.attr('href');
        var datedUri = URI(href);
        var newDatedHref = datedUri.search(uri.search()).toString();
        flog('new href', href, newDatedHref, target);
        target.attr('href', newDatedHref);
    });
}

function runReport(startDate, reportContainer, itemsContainer, href) {
    flog("runReport");
    $('.pageMessage').hide(100);
    var data = {
        startDate: formatDate(startDate)
    };
    $.ajax({
        type: "GET",
        url: href,
        dataType: 'json',
        data: data,
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

function runReportWithDateRange() {
    flog("runReportWithDateRange", window.location);
    $('.pageMessage').hide(100);
    var reportContainer = $('#annual');
    var itemsContainer = $('#items');

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
