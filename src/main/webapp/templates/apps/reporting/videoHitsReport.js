(function (w) {
    var searchData = {
        startDate: null,
        endDate: null
    };

    function initTotalPlays(totalPlays) {
        var elem = $('.totalPlays');
        elem.find('.values strong').text(totalPlays.doc_count);
    }

    function initTotalViewTime(data) {
        var elem = $('.totalViewTime');
        elem.find('.values strong').text((data.doc_count * 3) + " seconds");
    }

    function initAvgViewTime(totalPlays, totalViewTime) {
        var a = totalPlays.doc_count;
        var b = totalViewTime.doc_count * 3;
        var elem = $('.avgViewTime');
        elem.find('.values strong').text(round(b / a, 2) + " seconds");
    }

    function initVideoTable(buckets) {
        $('#videoTableDiv').show();
        var videoTable = $('#videoTable');
        var tbody = videoTable.find('tbody');
        tbody.empty();

        if (buckets.length > 0) {
            for (var i in buckets) {
                var b = buckets[i];
                var plays = b.plays.doc_count;
                var viewTime = b.viewTime && b.viewTime.doc_count ? b.viewTime.doc_count : 0
                viewTime = viewTime * 3;
                var t = '<tr data-url="' + b.key + '" class="clickable">'
                        + '    <td>' + b.key + '</td>'
                        + '    <td>' + plays + '</td>'
                        + '    <td class="viewTime">' + viewTime + ' seconds</td>'
                        + '</tr>';

                tbody.append(t);
            }
        }

        tbody.on('click', 'tr.clickable', function (e) {
            var btn = $(this);
            var url = btn.data('url');
            window.location.search = '?video=' + encodeURIComponent(url);
        });
    }

    function initAgentDonut(buckets) {
        $("#agentDonut").empty();

        nv.addGraph(function () {
            var chart = nv.models.pieChart()
                    .x(function (d) {
                        return d.key;
                    })
                    .y(function (d) {
                        return d.doc_count;
                    })
                    .showLabels(true)     //Display pie labels
                    .showLegend(false)     //Display pie labels
                    .labelThreshold(.04)  //Configure the minimum slice size for labels to show up
                    .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                    .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                    .donutRatio(0.5)     //Configure how big you want the donut hole size to be.
                    .title("Browsers")
                    .margin({"left": 0, "right": 0, "top": 0, "bottom": 0})
                    ;

            d3.select("#agentDonut")
                    .datum(buckets)
                    .transition().duration(350)
                    .call(chart);

            return chart;
        });
    }

    function initDeviceDonut(buckets) {
        $("#deviceDonut").empty();

        nv.addGraph(function () {
            var chart = nv.models.pieChart()
                    .x(function (d) {
                        return d.key;
                    })
                    .y(function (d) {
                        return d.doc_count;
                    })
                    .showLabels(true)     //Display pie labels
                    .showLegend(false)     //Display pie labels
                    .labelThreshold(.04)  //Configure the minimum slice size for labels to show up
                    .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                    .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                    .donutRatio(0.5)     //Configure how big you want the donut hole size to be.
                    .title("Devices")
                    .margin({"left": 0, "right": 0, "top": 0, "bottom": 0})
                    ;

            d3.select("#deviceDonut")
                    .datum(buckets)
                    .transition().duration(350)
                    .call(chart);

            return chart;
        });
    }

    function initSegsDisplay(playlist) {
        $('#videoSegmentsDiv').show();
        $('#segmentHistogram').empty();

        nv.addGraph(function () {
            var chart = nv.models.lineChart()
                    .margin({top: 30, right: 90, bottom: 60, left: 80}) //Adjust chart margins to give the x-axis some breathing room.
                    .showLegend(true)                                   //Show the legend, allowing users to turn on/off line series.
                    .showYAxis(true)                                    //Show the y-axis
                    .showXAxis(true)                                    //Show the x-axis
                    ;

            chart.xAxis
                    .axisLabel('Time')
                    .tickFormat(function (d) {
                        return msToTime(d);
                    });

            chart.yAxis
                    .axisLabel('Plays')
                    .tickFormat(d3.format(',f'));

            var myData = [];
            for (var i in playlist) {
                var p = playlist[i];
                var s = {
                    values: [],
                    key: i
                };
                var startTime = 0;
                for (var i in p) {
                    var b = p[i];
                    var plays = b.count;
                    var endTime = startTime + (b.duration * 1000);
                    startTime = endTime;

                    s.values.push({
                        x: endTime,
                        y: plays

                    });
                }
                myData.push(s);
            }

            d3.select('#segmentHistogram') //Select the <svg> element you want to render the chart in.
                    .datum(myData)         //Populate the <svg> element with chart data...
                    .call(chart);          //Finally, render the chart!

            //Update the chart when window resizes.
            nv.utils.windowResize(function () {
                chart.update()
            });
            return chart;
        });
    }

    function initHistogram2(playHits, viewHits) {
        $('#visualisation').empty();
        nv.addGraph(function () {
            var chart = nv.models.linePlusBarChart()
                    .focusEnable(false)
                    .margin({top: 30, right: 90, bottom: 60, left: 80});

            chart.brush = null;

            chart.xAxis
                    .axisLabel("Date")
                    .tickFormat(function (d) {
                        return moment(d).format("DD MMM");
                    })
                    .rotateLabels(-45);

            chart.y1Axis
                    .tickFormat(function (d) {
                        return d3.format(',f')(d) + " Plays";
                    });

            chart.y2Axis
                    .tickFormat(function (d) {
                        return d3.format(',f')(d) + " Seconds";
                    });

            var myData = [];
            var plays = {
                values: [],
                key: "Plays",
                bar: true,
                color: "#7777ff"
            };
            for (var i = 0; i < playHits.length; i++) {
                var bucket = playHits[i];
                plays.values.push(
                        {x: bucket.key, y: bucket.doc_count});
            }

            plays.values.sort(dynamicSort('x'));

            var views = {
                values: [],
                key: "View time",
                color: "#333"
            };
            for (var i = 0; i < viewHits.length; i++) {
                var bucket = viewHits[i];
                var s = bucket.doc_count > 0 ? bucket.doc_count * 3 : 0;
                views.values.push(
                        {x: bucket.key, y: s});
            }

            views.values.sort(dynamicSort('x'));

            myData.push(plays);
            myData.push(views);

            flog('mydata', myData);

            d3.select('#visualisation')
                    .datum(myData)
                    .transition()
                    .duration(0)
                    .call(chart);

            nv.utils.windowResize(chart.update);
            return chart;
        });
    }

    function initReportDateRange() {
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
                        searchData.startDate = start.format('DD/MM/YYYY');
                        searchData.endDate = end.format('DD/MM/YYYY');
                        loadData();
                    }
            );
        });
    }

    function initVideos(hash) {
        $('#videoDiv').html('<img class="video-jw" src="/_hashes/files/' + hash + '/alt-640-360.png" />');
        doInitVideos();
    }

    function processData(resp) {
        var totalPlays = resp.aggr.totalPlays;
        var totalViewTime = resp.aggr.totalViewTime;
        var videos = resp.aggr.videos.videoUrls.buckets;
        var deviceCategory = resp.aggr.deviceCategory.buckets;
        var userAgent = resp.aggr.userAgent.buckets;

        var playlist = resp.playlist;
        if (playlist !== null && typeof playlist !== 'undefined') {
            $('#vidStats').show();
            initSegsDisplay(playlist);
            initDeviceDonut(deviceCategory);
            initAgentDonut(userAgent);
            initVideos(resp.fileHash);
        } else {
            initVideoTable(videos);
        }

        initTotalPlays(totalPlays);
        initTotalViewTime(totalViewTime);
        initAvgViewTime(totalPlays, totalViewTime);
        initHistogram2(totalPlays.histogram.buckets, totalViewTime.histogram.buckets);
    }

    function loadData() {
        $.ajax({
            url: window.location.pathname + "?asJson&" + $.param(searchData) + "&" + window.location.search.substr(1),
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                flog('success', data, textStatus);
                processData(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                flog('error', jqXHR, textStatus, errorThrown);
            }
        });
    }

    w.initVideoHitsReport = function () {
        initReportDateRange();
        loadData();
    };
})(window);

$(function () {
    initVideoHitsReport();
});

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100)
            , seconds = parseInt((duration / 1000) % 60)
            , minutes = parseInt((duration / (1000 * 60)) % 60)
            , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return minutes + ":" + seconds + "." + milliseconds;
}

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    };
}