function initMyLearning() {
    flog("initMyLearning");

    initCoursePjax();

    $("body").bind("pjax:end", function() {
        flog("pjax end");
        $("a.courseBox").removeClass("active");
        setActiveCourse();
        var programPath = getPathFromHref(getFolderPath(getFolderPath(window.location.href))) + "/";
        initPjax(programPath);
        limitCourseBrief();
    });
    flog("now do initPjax");
    initPjax("${curProgram.url}");
    limitCourseBrief();
}

function initCoursePjax() {
    var a = jQuery('a.course').not(".pjaxdone");
    flog("pjax11", a);
    jQuery('a.course').pjax('.modules', {
        fragment: ".modules"
    });
    a.addClass("pjaxdone");
}

function initPjax(programPath) {
    flog("initPjax", programPath);

    setActiveCourse();
    // Store current course in a cookie
    storeProgramCookie(programPath);
}

function storeProgramCookie(path) {
    flog("storeProgramCookie", path);
    jQuery.cookie("currentProgram", path, {
        path: "/"
    });
}

function setActiveCourse() {
    jQuery("a.courseBox").each(function(i, node) {
        flog("active?", window.location.pathname, $(node).attr("href"));
        if ($(node).attr("href") === window.location.pathname) {
            $(node).addClass("active");
        }
    });
}

function limitCourseBrief() {
    var limit = 200;
    var chars = $(".lead").text();
    flog("limitCourseBrief", chars);
    if (chars.length > limit) {
        flog("do limit");
        var visiblePart = $("<span> " + chars.substr(0, limit - 1) + "</span>");
        var dots = $("<span class='dots'>... </span>");
        var hiddenPart = $("<span class='more'>" + chars.substr(limit - 1) + "</span>");
        var readMore = $("<small class='read-more'>Read More >></small>");
        readMore.click(function() {
            $(this).prev().remove(); // remove dots
            $(this).next().show();
            $(this).remove(); // remove 'read more'
        });

        $(".lead").empty()
                .append(visiblePart)
                .append(dots)
                .append(readMore)
                .append(hiddenPart);
        flog("done", $(".lead"));
    }
}