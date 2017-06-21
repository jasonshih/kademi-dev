var win = $(window);

function initNavbar() {
    flog('initNavbar');
    var navbar = $('#kademi-navbar');
    var menu = $('#kademi-navbar-collapse');
    var menuFeature = $('#kademi-feature-menu');
    var body = $(document.body);
    
    if (body.hasClass('has-navbar-white')) {
    	navbar.addClass('navbar-white');
    }
    
    win.on('scroll', function () {
        navbar[win.scrollTop() > 0 ? 'addClass': 'removeClass']('docked');
    }).trigger('scroll');
    
    $('.navbar-toggle').on('click', function (e) {
        if (menu.hasClass('in')) {
            navbar.removeClass('opened-menu');
            body.removeClass('opened-navbar-menu');
        } else {
            navbar.addClass('opened-menu');
            body.addClass('opened-navbar-menu');
        }
    });
    
    navbar.after('<div id="kademi-feature-menu-backdrop"></div>');
    var backdrop = $('#kademi-feature-menu-backdrop');
    var toggler = $('#feature-menu-toggler');
    
    toggler.on('click', function (e) {
        e.preventDefault();
        
        if (menuFeature.hasClass('in')) {
            navbar.removeClass('opened-feature');
            backdrop.hide();
        } else {
            navbar.addClass('opened-feature');
            backdrop.show();
        }
    });
    
    backdrop.on('click', function () {
        toggler.trigger('click');
    });
}

function initValignCenter() {
    flog('initValignCenter');
    
    win.on('resizestop', function () {
        $('.valign-center-container').each(function () {
            var container = $(this);
            var panels = container.find('.valign-center');
            var heights = [];
            
            container.css('min-height', '');
            
            if (win.width() >= 768) {
                flog('Width >= 768');
                panels.each(function () {
                    var panel = $(this);
                    
                    heights.push(panel.height());
                });
                
                var maxHeight = Math.max.apply(this, heights);
                container.css('min-height', maxHeight);
            }
        });
    }).trigger('resizestop');
}

function initHomeBanner() {
    flog('initHomeBanner');
    var banner = $('section.banner');
    
    win.on('resize', function () {
        banner.css('height', win.height());
    }).trigger('resize');
}

function initHomeVideos() {
    flog('initHomeVideos');
    var videos = $('.screen-video video');
    
    win.on('scrollstop', function () {
        var windowTop = win.scrollTop() + $('#kademi-navbar').height();
        var windowBottom = windowTop + win.height();
        
        videos.each(function (i) {
            var video = $(this) ;
            var videoObj = video.get(0);
            var videoTop = video.offset().top;
            var videoHeight = video.height();
            var videoBottom = videoTop + videoHeight;
            
            if (windowBottom + (videoHeight / 4) >= videoBottom) {
                if (videoObj.paused) {
                    videoObj.play();
                    flog('Play video #' + (i + 1), video);
                }
            }
        });
    }).trigger('scrollstop');
}

function initHomepage() {
    flog('initHomepage');
    initHomeBanner();
    initHomeVideos();
}

function initParallax() {
    flog('initParallax');
    var s = skrollr.init({
        constants: {
            endheader: function () {
                return $('header.banner').height() - 110;
            }
        }
    });
    
    if (s.isMobile()) {
        s.destroy();
    }
}

function initSameRow() {
    flog('initSameRow');
    
    var adjustElements = function (tagName, panel) {
        var elements = panel.find('.row > div ' + tagName);
        var heights = [];
        
        elements.css('min-height', '');
        
        if (win.width() >= 768) {
            flog('Width >= 768');
            elements.each(function () {
                var element = $(this);
                
                heights.push(element.height());
            });
            
            var maxHeight = Math.max.apply(this, heights);
            elements.css('min-height', maxHeight);
        }
    }
    
    win.on('resizestop', function () {
        $('.same-row').each(function () {
            var panel = $(this);
            
            adjustElements('h4', panel);
            adjustElements('p', panel);
        });
    }).trigger('resizestop');
}

function initHeader() {
    flog('initHeader');
    var banner = $('header.banner');
    var innerBanner = banner.find('.header-inner');
    
    win.on('resize', function () {
        var height = banner.height();
        innerBanner.css('background-size', 'auto ' + (height + 200) + 'px');
    }).trigger('resize');
}

function initFeaturePage() {
    flog('initFeaturePage');
    initSameRow();
    initHeader();
    initParallax();
}

function initBlogPage() {
    flog('initBlogPage');
    $('.timeago').timeago();
}

function initBlogHomeContent() {
    flog('initBlogHomeContent');
    
     $('.blog-wrapper').find('.row').children().filter(':even').addClass('even');
    
    win.on('resizestop', function () {
        var width = win.width();
        var title = $('.blog-title');
        var brief = $('.blog-brief');
        var briefLead = brief.filter('.lead');
        brief = brief.not('.lead');
        
        if (width >= 768)  {
            title.dotdotdot({
                height: 74
            });
            
            brief.dotdotdot({
                height: 51
            });
            
            briefLead.dotdotdot({
                height: 109
            });
        } else {
            flog('win <= 767');
            title.dotdotdot({
                height: 79
            });
            
            brief.dotdotdot({
                height: 100
            });
            
            briefLead.dotdotdot({
                height: 109
            });
        }
    }).trigger('resizestop');
}

function doBlogHomeFilter() {
    flog('doBlogHomeFilter');
    var blogs = $('.blog-wrapper').find('.row').children();
    var activeItem = $('#kademi-blog-sidebar').find('li.active');
    
    blogs.removeClass('even');
    
    if (activeItem.length === 0) {
        flog('Filter OFF');
        blogs.removeClass('hide').addClass('showed');
    } else {
        var tagNames = [];
        blogs.addClass('hide').removeClass('showed');
        
        activeItem.each(function () {
            var item = $(this);
            var tagName = item.find('.label').text();
            
            tagNames.push(tagName);
        });
        
        flog('Filter ON', tagNames.join(', '));
        
        blogs.each(function () {
            var blog = $(this);
            var tags = blog.find('.blog-tags .hide').text();
            var isMatch = 0;
            
            for (var i = 0; i < tagNames.length; i++) {
                if (tags.indexOf('|' + tagNames[i] + '|') !== -1) {
                    isMatch++;
                }
            }
            
            if (isMatch > 0) {
                blog.removeClass('hide').addClass('showed');
            }
        });
    }
    
    blogs.filter('.showed:even').addClass('even');
}

function initBlogSideBar() {
    flog('initSideBar');
    var blogs = $('.blog-wrapper').find('.row').children();
    var sidebar = $('#kademi-blog-sidebar');
    
    sidebar.find('li').on('click', function (e) {
        e.preventDefault();
        
        var item = $(this);
        item[item.hasClass('active') ? 'removeClass' : 'addClass']('active');
        doBlogHomeFilter();
    });
}

function initBlogHome() {
    flog('initBlogHome');
    initBlogSideBar();
    initBlogHomeContent();
}

function initContactForms(){
    $('form[action="/contactus"]').each(function(){
        $(this).prepend('<input name="site_referral" type="hidden" value="'+siteSource+'" />');
    })
}

$(function () {
    initNavbar();
    initValignCenter();
    initContactForms();
});