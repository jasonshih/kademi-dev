/**
 *  jquery.comments-1.0.4.js
 */

(function ($) {
    var DEFAULT_OPTIONS = {
        startDate: null,
        endDate: null,
        interval: "day",
        levelClassPrefix: null, // if provided, will add a class like label-success for levels called "success"
        levelClassSelector: null,
        levelClasses: null
    };

    $.fn.pointsVis = function (options) {
        var container = this;

        container.each(function (i, n) {
            var cont = $(n);
            var config = $.extend({}, DEFAULT_OPTIONS, options);

            var opts = {
                startDate: config.startDate,
                endDate: config.endDate
            };

            var pointsHref = cont.data("href");

            loadData(pointsHref, opts, cont, null, config);
        });
    };


    function loadData(href, opts, container, visType, config) {
        var href = href + "?leaderboard&" + $.param(opts);
        flog("points: loadData", href, container);
        $.ajax({
            type: "GET",
            url: href,
            dataType: 'json',
            success: function (json) {
                if (json.status) {
                    showData(json.data, container, visType, config);
                } else {

                }
            }
        });
    }


    function showData(resp, container, visType, config) {
        if (resp.myRank) {
            var rank = resp.myRank.rank;
            var points = resp.myRank.points.numPoints;

            flog("points: showData", resp, container, rank, points);
            var sRank;
            if( rank == 1) {
                sRank = "1st";
            } else if( rank == 2) {
                sRank = "2nd";
            } else if( rank == 3) {
                sRank = "3rd";
            } else {
                sRank = rank + "th";
            }
            container.find(".rewards-rank").text(sRank + " place");

            container.find(".rewards-points").text(points);
        }else {
            flog("points: showData - no data");
        }
    }
})(jQuery);

