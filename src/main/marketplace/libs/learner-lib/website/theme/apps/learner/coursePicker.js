(function ($, global) {
    $(function () {
        var picker = $('.course-picker-wrapper');
        if (picker.length > 0) {
            initCoursePjax();
            initCoursePicker();
            storeCourseCookie(picker.attr('data-course-href'));
        }
    });
    
    function initCoursePicker() {
        flog('initCoursePicker');
        
        var wrapper = $('.course-picker-wrapper');
        var toggler = wrapper.find('.course-picker-toggler');
        
        $(document.body).on('click', function (e) {
            var target = $(e.target);
            
            if (target.closest('.course-picker-toggler').length === 0 && target.closest('.course-picker-dropdown').length === 0) {
                wrapper.removeClass('open');
            }
        });
        
        toggler.on('click', function (e) {
            e.preventDefault();
            
            wrapper[wrapper.hasClass('open') ? 'removeClass' : 'addClass']('open');
        });
        
        var programsList = wrapper.find('#programs-wrapper').find('.programs-list');
        var coursesList = wrapper.find('#courses-wrapper').find('.courses-list');
        
        // Add event for item of Program list
        programsList.on('click', 'a', function (e) {
            e.preventDefault();
            
            var a = $(this);
            flog('program click', a);
            
            if (!a.hasClass('active')) {
                a.siblings('.active').removeClass('active');
                a.addClass('active');
                
                coursesList.html('').addClass('loading');
                
                var url = propfindHref(a.attr('href'));
                $.getJSON(url, function (data) {
                    var courseStr = '';
                    
                    for (var i = 0; i < data.length; i++) {
                        var name = data[i]['name'];
                        var href = data[i]['href'];
                        var title = data[i]['title'];
                        
                        if (!name.startsWith('.')) {
                            courseStr += '<a class="course" href="' + href + '">' + title + '</a>';
                        }
                    }
                    
                    coursesList.append(courseStr).removeClass('loading');
                });
            }
        });
    }
    
    function propfindHref(href) {
        return href + '_DAV/PROPFIND?fields=href,name,milton:title,milton:available&where=milton:available';
    }
    
    function initCoursePjax() {
        flog('initCoursePjax');
        
        var wrapper = $('.course-picker-wrapper');
        wrapper.on('click', 'a.course', function (e) {
            e.preventDefault();
            
            var a = $(this);
            if (!a.hasClass('active')) {
                var href = a.attr('href');
                
                $.pjax({
                    selector: 'a.course:not(.pjaxdone)',
                    fragment: '.container-my-learning',
                    container: '.container-my-learning',
                    timeout: 5000,
                    url: href,
                    debug: true
                });
                
                wrapper.find('a.course.active').removeClass('active');
                a.addClass('active');
                wrapper.removeClass('open');
            }
        });
    }
    
    global.storeCourseCookie = function (path) {
        flog('storeCourseCookie', path);
        
        $.cookie('currentCoursePath', path, {
            path: '/'
        });
    };
    
})(jQuery, window);