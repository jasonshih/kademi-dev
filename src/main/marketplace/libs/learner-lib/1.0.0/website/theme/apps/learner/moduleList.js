// loaded from /templates/themes/bootstrap335/apps/learner/moduleList.js

function initMyLearning() {
    flog("initMyLearning");

    initCoursePjax();

    $(document).on("pjaxComplete", function() {
        flog("pjax end");
        $("a.courseBox").removeClass("active");
        storeCourseCookie(window.location.pathname);
        scrollProgress();
        initDropdownMix();
        initDotDotDot();

    });
    initDropdownMix();
    scrollProgress();
    initDotDotDot();

}

function initDropdownMix() {
    flog('initDropDown');

    var mixWrapper = $('.program-course-module-mix');
    var dropdown = mixWrapper.find('.dropdown-menu');
    var mainContent = $('.main-content').children('.container');
    var btnShowMix = $('.btn-show-mix');

    var adjustDropdownWidth = function() {
        dropdown.css('width', mainContent.width());
    };

    adjustDropdownWidth();

    $(window).resize(function() {
        adjustDropdownWidth();
    });

    $(document.body).on('click', function(e) {
        var target = $(e.target);

        if (!target.is(btnShowMix) && !target.parents().is(btnShowMix) && !target.parents().is(dropdown)) {
            mixWrapper.removeClass('open');
        }
    });

    btnShowMix.on('click', function(e) {
        e.preventDefault();

        mixWrapper[mixWrapper.hasClass('open') ? 'removeClass' : 'addClass']('open');
    });

    var programsList = $('#programs-wrapper').find('.programs-list');
    var coursesList = $('#courses-wrapper').find('.courses-list');

    // Add event for item of Program list
    programsList.on('click', 'a', function(e) {
        e.preventDefault();

        var a = $(this);
        flog('program click', a);

        if (!a.hasClass('active')) {
            flog("go get em");
            a.siblings('.active').removeClass('active');
            a.addClass('active');

            coursesList.html('').addClass('loading');

            var url = propfindHref(a.attr('href'));
            $.getJSON(url, function(data) {
                var courseStr = '';

                for (var i = 0; i < data.length; i++) {
                    var name = data[i]['name'];
                    if (!name.startsWith('.')) {
                        courseStr += '<a class="course" href="' + data[i]['href'] + '">' + data[i]['title'] + '</a>';
                    }
                }

                coursesList.append(courseStr).removeClass('loading');
            });
        } else {
            flog("already active");
        }
    });
}

function propfindHref(href) {
    return href + '_DAV/PROPFIND?fields=href,name,milton:title,milton:available&where=milton:available';
    //return href + '_DAV/PROPFIND?fields=href,name,milton:title,iscollection&where=iscollection';
}

function initCoursePjax() {
    var a = jQuery('a.course').not(".pjaxdone");
    flog("pjax11", a);
    jQuery('a.course').pjax('.my-learning-container', {
        fragment: ".my-learning-container"
    });

    a.addClass("pjaxdone");
}

function storeCourseCookie(path) {
    flog("storeCourseCookie", path);
    jQuery.cookie("currentCoursePath", path, {
        path: "/"
    });
}



function scrollProgress() {
    flog("scrollProgress");
    $(".module-progress").each(function(i, n) {
        var div = $(n);
        var perc = div.data("targetperc");
        if (perc && perc > 0) {
            div.attr("aria-valuenow", "");
            div.animate({
                width: perc + "%"
            }, 500);
        }
    });
}
function initDotDotDot() {
    $(".module-info").not(".module-info-hero").dotdotdot({
        height: 100
    });
    $(".module-info-hero").dotdotdot({
        height: 125
    });

    $(".module-info .module-description").on('click', function(event) {
        flog("click");
        event.preventDefault();
        var modInfo = $(this).closest(".module-info");
        modInfo.trigger("destroy");
    });
}