// global variables
var isIE8 = false;
var isIE9 = false;
var windowWidth;
var windowHeight;
var pageArea;

// Debounce Function
(function ($, sr) {
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;
        return function debounced() {
            var obj = this,
                args = arguments;

            function delayed() {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    };

    // smartresize
    jQuery.fn[sr] = function (fn) {
        return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
    };

})(jQuery, 'clipresize');

// Main Function
var Main = function () {
    // function to detect explorer browser and its version
    var runInit = function () {
        if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
            var ieversion = new Number(RegExp.$1);
            if (ieversion == 8) {
                isIE8 = true;
            } else if (ieversion == 9) {
                isIE9 = true;
            }
        }
    };

    var initPerfectScrollbar = function (target) {
        if (target.length > 0 && typeof $.fn.perfectScrollbar === 'function') {
            //target.niceScroll({
            //    cursorcolor: '#999',
            //    cursorwidth: 6,
            //    railpadding: {
            //        top: 0,
            //        right: 0,
            //        left: 0,
            //        bottom: 0
            //    },
            //    cursorborder: '',
            //    disablemutationobserver: true
            //});
            target.perfectScrollbar({
                wheelSpeed: 50,
                minScrollbarLength: 20,
                suppressScrollX: true
            });
        }
    };

    var updatePerfectScrollbar = function (target) {
        if($.fn.perfectScrollbar){
            //target.getNiceScroll().resize();
            target.perfectScrollbar('update');
        }
    };

    // function to adjust the template elements based on the window size
    var runElementsPosition = function () {
        windowWidth = $(window).width();
        windowHeight = $(window).height();
        pageArea = windowHeight - $('body > .navbar').outerHeight() - $('body > .footer').outerHeight();
        $('.sidebar-search input').removeAttr('style').removeClass('open');
        runContainerHeight();
    };

    // function to activate the ToDo list, if present
    var runToDoAction = function () {
        if ($(".todo-actions").length) {
            $(".todo-actions").click(function () {
                if ($(this).find("i").hasClass("fa-square-o") || $(this).find("i").hasClass("icon-check-empty")) {
                    if ($(this).find("i").hasClass("fa")) {
                        $(this).find("i").removeClass("fa-square-o").addClass("fa-check-square-o");
                    } else {
                        $(this).find("i").removeClass("icon-check-empty").addClass("fa fa-check-square-o");
                    }
                    $(this).parent().find("span").css({
                        opacity: .25
                    });
                    $(this).parent().find(".desc").css("text-decoration", "line-through");
                } else {
                    $(this).find("i").removeClass("fa-check-square-o").addClass("fa-square-o");
                    $(this).parent().find("span").css({
                        opacity: 1
                    });
                    $(this).parent().find(".desc").css("text-decoration", "none");
                }
                return !1;
            });
        }
    };

    // function to activate the Tooltips, if present
    var runTooltips = function () {
        if ($(".tooltips").length) {
            $('.tooltips').tooltip();
        }
    };

    // function to activate the Popovers, if present
    var runPopovers = function () {
        if ($(".popovers").length) {
            $('.popovers').popover();
        }
    };

    // function to allow a button or a link to open a tab
    var runShowTab = function () {
        if ($(".show-tab").length) {
            $('.show-tab').bind('click', function (e) {
                e.preventDefault();
                var tabToShow = $(this).attr("href");
                if ($(tabToShow).length) {
                    $('a[href="' + tabToShow + '"]').tab('show');
                }
            });
        }
        if (getParameterByName('tabId').length) {
            $('a[href="#' + getParameterByName('tabId') + '"]').tab('show');
        }
    };

    var runPanelScroll = function () {
        var scrollPanel = $(".panel-scroll");
        if (scrollPanel.length > 0) {
            initPerfectScrollbar(scrollPanel);
        }
    };

    // function to extend the default settings of the Accordion
    var runAccordionFeatures = function () {
        if ($('.accordion').length) {
            $('.accordion .panel-collapse').each(function () {
                if (!$(this).hasClass('in')) {
                    $(this).prev('.panel-heading').find('.accordion-toggle').addClass('collapsed');
                }
            });
        }
        $(".accordion").collapse().height('auto');

        $('.accordion .accordion-toggle').bind('click', function () {
            currentTab = $(this);
            $('html,body').animate({
                scrollTop: currentTab.offset().top - 100
            }, 1000);
        });
    };

    // function to reduce the size of the Main Menu
    var runNavigationToggler = function () {
        var kademiContainer = $('#kademi-container');
        $('.navigation-toggler').on('click', function (e) {
            e.preventDefault();

            if (!kademiContainer.hasClass('navigation-small')) {
                kademiContainer.addClass('navigation-small');
                $.cookie('admin-sidebar', 'collapsed', {
                    path: '/',
                    expires: 999
                });
            } else {
                kademiContainer.removeClass('navigation-small');
                $.cookie('admin-sidebar', 'expanded', {
                    path: '/',
                    expires: 999
                });
            }

            window.dispatchEvent(new Event('resize'));
        });
    };

    // function to activate the panel tools
    var runModuleTools = function () {
        $('.panel-tools .panel-expand').bind('click', function (e) {
            $('.panel-tools a').not(this).hide();
            $('body').append('<div class="full-white-backdrop"></div>');
            $('.main-container').removeAttr('style');
            backdrop = $('.full-white-backdrop');
            wbox = $(this).parents('.panel');
            wbox.removeAttr('style');
            if (wbox.hasClass('panel-full-screen')) {
                backdrop.fadeIn(200, function () {
                    $('.panel-tools a').show();
                    wbox.removeClass('panel-full-screen');
                    backdrop.fadeOut(200, function () {
                        backdrop.remove();
                    });
                });
            } else {
                $('body').append('<div class="full-white-backdrop"></div>');
                backdrop.fadeIn(200, function () {
                    $('.main-container').css({
                        'max-height': $(window).outerHeight() - $('header').outerHeight() - $('.footer').outerHeight() - 100,
                        'overflow': 'hidden'
                    });
                    backdrop.fadeOut(200);
                    backdrop.remove();
                    wbox.addClass('panel-full-screen').css({
                        'max-height': $(window).height(),
                        'overflow': 'auto'
                    });
                });
            }
        });
        $('.panel-tools .panel-close').bind('click', function (e) {
            $(this).parents(".panel").remove();
            e.preventDefault();
        });
        $('.panel-tools .panel-refresh').bind('click', function (e) {
            var el = $(this).parents(".panel");
            el.block({
                overlayCSS: {
                    backgroundColor: '#fff'
                },
                message: '<img src="/static/ContentBuilder/assets/images/loading.gif" /> Just a moment...',
                css: {
                    border: 'none',
                    color: '#333',
                    background: 'none'
                }
            });
            window.setTimeout(function () {
                el.unblock();
            }, 1000);
            e.preventDefault();
        });
        $('.panel-tools .panel-collapse').bind('click', function (e) {
            e.preventDefault();
            var el = jQuery(this).parent().closest(".panel").children(".panel-body");
            if ($(this).hasClass("collapses")) {
                $(this).addClass("expand").removeClass("collapses");
                el.slideUp(200);
            } else {
                $(this).addClass("collapses").removeClass("expand");
                el.slideDown(200);
            }
        });
    };

    // function to activate the 3rd and 4th level menus
    var runNavigationMenu = function () {
        var mainMenu = $('#main-navigation-menu');
        var callback = null;

        if (windowWidth >= 980) {
            initPerfectScrollbar(mainMenu);
            callback = function () {
                updatePerfectScrollbar(mainMenu);
            };
        }

        mainMenu.find('li.active').addClass('open');
        mainMenu.find('> li a').on('click', function () {

            var link = $(this);
            var li = link.parent();
            var ul = li.parent();

            if (li.children('ul').hasClass('sub-menu') && !$('body').hasClass('navigation-small')) {
                var activeItem = mainMenu.find('> li.active');

                if (li.hasClass('open')) {
                    if (li.hasClass('active')) {
                        ul.children('li.open').removeClass('open').children('ul').slideUp(200, callback);
                    } else {
                        ul.children('li.open').not(activeItem).removeClass('open').children('ul').slideUp(200, callback);
                    }
                } else {
                    li.addClass('open');
                    ul.children('li.open').not(li).not(activeItem).removeClass('open').children('ul').slideUp(200);
                    li.children('ul').slideDown(200, callback);
                }
            }
        });
    };

    // function to activate the Go-Top button
    var runGoTop = function () {
        $('.go-top').bind('click', function (e) {
            e.preventDefault();

            $("html, body").animate({
                scrollTop: 0
            }, "slow");
        });
    };

    // function to avoid closing the dropdown on click
    var runDropdownEnduring = function () {
        if ($('.dropdown-menu.dropdown-enduring').length) {
            $('.dropdown-menu.dropdown-enduring').click(function (event) {
                event.stopPropagation();
            });
        }
    };

    // function to return the querystring parameter with a given name.
    var getParameterByName = function (name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    initPerfectScrollbar($('.drop-down-wrapper'));

    $('.navbar-tools .dropdown').on('shown.bs.dropdown', function () {
        var dropdown = $(this).find('.drop-down-wrapper');
        dropdown.scrollTop(0);
        updatePerfectScrollbar(dropdown);
    });

    var runColorPalette = function () {
        if ($('.colorpalette').length) {
            $('.colorpalette').colorPalette().on('selectColor', function (e) {
                $(this).closest('ul').prev('a').children('i').css('background-color', e.color).end().closest('div').prev('input').val(e.color);
                runActivateLess();
            });
        }
    };

    // function to activate Less style
    var runActivateLess = function () {
        $('.icons-color img').removeClass('active');
        if ($('#skin_color').attr("rel") == "stylesheet") {
            $('#skin_color').attr("rel", "stylesheet/less").attr("href", "/static/ContentBuilder/assets/less/styles.less");
            less.sheets.push($('link#skin_color')[0]);
            less.refresh();
        }
        less.modifyVars({
            '@base': $('.color-base').val(),
            '@text': $('.color-text').val(),
            '@badge': $('.color-badge').val()
        });
    };

    // Window Resize Function
    var runWindowResize = function (func, threshold, execAsap) {
        // wait until the user is done resizing the window, then execute
        $(window).clipresize(function () {
            runElementsPosition();
        });
    };

    // function to adapt the Main Content height to the Main Navigation height
    var runContainerHeight = function () {
        var mainContainer = $('.main-content > .container');
        var mainNavigation = $('.main-navigation');
        var footer = $('.footer');
        var navbar = $('.navbar');
        mainContainer.css('min-height', windowHeight - footer.innerHeight() - navbar.innerHeight());

        if (windowWidth < 768) {
            mainNavigation.css('min-height', windowHeight - $('body > .navbar').outerHeight());
        }

        var sidebarWrapper = $('#page-sidebar .sidebar-wrapper');
        sidebarWrapper.css('height', windowHeight - $('body > .navbar').outerHeight()).scrollTop(0);
        if (windowWidth >= 768) {
            updatePerfectScrollbar(sidebarWrapper);
        }
    };

    return {
        // main function to initiate template pages
        init: function (orgId) {
            runNavigationToggler();
            runWindowResize();
            runInit();
            runElementsPosition();
            runToDoAction();
            runNavigationMenu();
            runGoTop();
            runModuleTools();
            runDropdownEnduring();
            runTooltips();
            runPopovers();
            runPanelScroll();
            runShowTab();
            runAccordionFeatures();
            runColorPalette();
            runContainerHeight();

            $(document).ajaxStart(function () {
                flog("ajax start");
                $("body").addClass("ajax-loading");
            });
            $(document).ajaxStop(function () {
                flog("ajax stop");
                $("body").removeClass("ajax-loading");
            });

            // Check for login tokens, if so reload the URL without them
            var s = window.location + "";
            if (s.indexOf("miltonUserUrl") > 1) {
                flog("Reloading without auth tokens");
                window.location = window.location.pathname;
            }
        }
    };
}();
