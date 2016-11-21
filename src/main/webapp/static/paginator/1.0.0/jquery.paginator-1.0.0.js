(function($) {
    $.fn.paginator = function(options) {
        var pag = $(this);

        flog("init paginator plugin", this);

        var config = $.extend({
        }, options);

        pag.on("click", "a", function(e) {
            e.preventDefault();
            var target = $(e.target);
            target.closest(".pagination").find(".active").removeClass("active");
            target.closest("li").addClass("active");
            var link = target.attr("href");
            flog("target", target, target.closest(".pagination-container"));
            var results = target.closest(".pagination-container").find(".pagination-results");
            flog("reload page in", results);
            history.pushState(null, null, link);
            results.reloadFragment({
                url : link
            });
        });
    };
})(jQuery);
