(function (w) {
    function initTotalPlays(totalPlays) {
        var elem = $('.totalPlays');
        elem.find('.values strong').text(totalPlays.doc_count);

        initTopViews(totalPlays.topViews.buckets);
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

    function initTopViews(buckets) {
        var topViews = $('.topViews');
        var topViewList = topViews.find('.topViewList');
        topViewList.empty();
        if (buckets.length > 0) {
            for (var i in buckets) {
                var b = buckets[i];
                var t = '<div class="row">'
                        + '    <div class="col-md-10">'
                        + '        <span>' + b.key + '</span>'
                        + '    </div>'
                        + '    <div class="col-md-2">'
                        + '        <span>' + b.doc_count + '</span>'
                        + '    </div>'
                        + '</div>';

                topViewList.append(t);
            }
        } else {
            var t = '<div class="row">'
                    + '    <div class="col-md-12">'
                    + '        <span>No videos have been viewed</span>'
                    + '    </div>'
                    + '</div>';

            topViewList.append(t);
        }
    }

    function initVideoTable(buckets) {
        var videoTable = $('#videoTable');
        var tbody = videoTable.find('tbody');
        tbody.empty();

        if (buckets.length > 0) {

            for (var i in buckets) {
                var b = buckets[i];
                var plays = b.plays.doc_count;
                var viewTime = b.viewTime.doc_count * 3;
                var t = '<tr data-url="' + b.key + '">'
                        + '    <td>' + b.key + '</td>'
                        + '    <td>' + plays + '</td>'
                        + '    <td class="viewTime">' + viewTime + ' seconds</td>'
                        + '</tr>';

                tbody.append(t);
            }
        }
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

            var views = {
                values: [],
                key: "View time",
                color: "#333"
            };
            for (var i = 0; i < viewHits.length; i++) {
                var bucket = viewHits[i];
                views.values.push(
                        {x: bucket.key, y: (bucket.doc_count * 3)});
            }

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

    function processData(resp) {
        var totalPlays = resp.totalPlays;
        var totalViewTime = resp.totalViewTime;
        var videos = resp.videos.videoUrls.buckets;

        initTotalPlays(totalPlays);
        initTotalViewTime(totalViewTime);
        initAvgViewTime(totalPlays, totalViewTime);
        initVideoTable(videos);
        initHistogram2(totalPlays.histogram, totalViewTime.histogram);
    }

    function loadData() {
        $.ajax({
            url: window.location.pathname + "?asJson",
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
        loadData();
    };
})(window);

$(function () {
    initVideoHitsReport();
});