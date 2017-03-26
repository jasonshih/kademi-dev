function init() {
    $(document.body).on('click', '#search', function (e) {
        e.preventDefault();

        doSearch();
    });
}

function doSearch() {
    flog('doSearch');
    
    Msg.info("Doing search...", 2000);

    var data = {
        searchStatementRewardId: $("#searchStatementRewardId").val(),
        searchStatementDateId: $("#searchStatementDateId").val()
    };

    flog("data", data);
    
    $('.btn-export-points').attr('href', 'points.csv?' + $.param(data));

    var target = $("#pointsTable");
    target.load();
    
    var serialize = function (obj, prefix) {
        var str = [], p;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
                str.push((v !== null && typeof v === "object") ?
                    serialize(v, k) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
        }
        return str.join("&");
    }
    
    var link = window.location.pathname + "?" + serialize(data);
    flog("new link", link);

    $.ajax({
        type: "GET",
        url: link,
        dataType: 'html',
        success: function (content) {
            flog('response', content);
            Msg.success("Search complete", 2000);
            var newBody = $(content).find("#pointsTable");
            target.replaceWith(newBody);
            history.pushState(null, null, link);
            $("abbr.timeago").timeago();
        }
    });
}