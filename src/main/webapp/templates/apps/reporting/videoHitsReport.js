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
        elem.find('.values strong').text((b / a) + " seconds");
    }

    function initTopViews(buckets) {
        var topViews = $('.topViews');
        var topViewList = topViews.find('.topViewList');
        topViewList.empty();
        if (buckets.length > 0) {
            for (var i in buckets) {
                var b = buckets[i];
                var url = decodeURIComponent(b.key);
                var uri = URI(url);
                var t = '<div class="row">'
                        + '    <div class="col-md-10">'
                        + '        <span>' + uri.directory() + '</span>'
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
                var url = decodeURIComponent(b.key);
                var uri = URI(url);
                var dir = uri.directory();
                var t = '<tr data-url="' + dir + '">'
                        + '    <td>' + dir + '</td>'
                        + '    <td>' + b.doc_count + '</td>'
                        + '    <td class="viewTime">Loading...</td>'
                        + '</tr>';

                tbody.append(t);
            }
        }
    }

    function processData(resp) {
        var totalPlays = resp.aggregations.totalPlays;
        var totalViewTime = resp.aggregations.totalViewTime;
        var videos = resp.aggregations.videos.videoUrls.buckets;

        initTotalPlays(totalPlays);
        initTotalViewTime(totalViewTime);
        initAvgViewTime(totalPlays, totalViewTime);
        initVideoTable(videos);
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