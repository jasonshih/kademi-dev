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
        if (buckets.length > 0) {
            topViews.find('div.row').remove();

            for (var i in buckets) {
                var b = buckets[i];
                var url = decodeURIComponent(b.key);
                var uri = URI(url);
                flog('URI', uri);
                var t = '<div class="row">'
                        + '    <div class="col-md-10">'
                        + '        <span>' + uri.directory() + '</span>'
                        + '    </div>'
                        + '    <div class="col-md-2">'
                        + '        <span>' + b.doc_count + '</span>'
                        + '    </div>'
                        + '</div>';

                topViews.prepend(t);
            }
        }
    }

    function processData(resp) {
        var totalPlays = resp.aggregations.totalPlays;
        var totalViewTime = resp.aggregations.totalViewTime;

        initTotalPlays(totalPlays);
        initTotalViewTime(totalViewTime);
        initAvgViewTime(totalPlays, totalViewTime);
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