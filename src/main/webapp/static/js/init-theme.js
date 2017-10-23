/** Start theme.js */

/**
 *  Editor support: Note that this relies on a global variable called toolbarSets
 *
 *  A default is defined in toolbars.js. You should override that file in your
 *  application to get the toolbars you want
 */

CKEDITOR_BASEPATH = "/static/ckeditor456/";
var ADDED_EXTRA_CSS = false;

// Templates should push theme css files into this array, so they will be included in the editor
var themeCssFiles = new Array();

Array.max = function (array) {
    return Math.max.apply(Math, array);
};

Array.min = function (array) {
    return Math.min.apply(Math, array);
};

function initTheme() {
    flog("initTheme: init-theme.js");
    
    // the login box in header is normally for logging in from a public page. So
    // in this case we want to navigate to the user's dashboard
    $(".header .Login").user({});
    // the login form appears in content when the requested page requires a login
    // so in this case we do not give a post-login url, we will just refresh the current page
    $("#content .Login").user();
    
    initEdify();
    initNav();
    initActiveNav(".initActive");
    initHelp();
    initTabPanel();
    initPlaceholder();
    initPseudoClasses();
    initPrintLink();
    initLoginDropDown();
    initVideos();
    
    flog("initTheme: run page init functions", pageInitFunctions.length);
    $.each(pageInitFunctions, function (i, f) {
        flog("run function" + i);
        pageInitFunctions[i]();
        flog("done run function", i);
        
    });
    
    $(".DropdownWrapper").click(function (e, node) {
        flog("initDropDown click", e);
        var div = $(e.target).closest("div.DropdownControl");
        flog("dropdown", $(".DropdownContent", div));
        $(".DropdownContent", div).toggle(300);
    });
    
    flog("finished init-theme");
}

function initLoginDropDown() {
    flog("init login", $(".Login"));
    var login = $(".Login");
    var dropdown = login.find(".dropBox");
    login.find("> a").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        log("hide1", e.target);
        dropdown.toggle(300);
    });
    dropdown.click(function (e) {
        e.stopPropagation();
    });
    $("body").click(function () {
        if (dropdown.is(":visible")) {
            log("hide2");
            dropdown.toggle(300);
        }
    });
}

function initHelp() {
    $(".helpIcon").click(function (e) {
        
        e.preventDefault();
        
        var page = $(document).find("meta[name=templateName]").attr("value");
        var href = "http://docs.fuselms.com/ref/screens";
        href += page;
        window.open(href);
    });
}

function initNav() {
    var bodyClasses = jQuery("body").attr("class");
    if (bodyClasses) {
        c = bodyClasses.split(" ");
        for (i = 0; i < c.length; i++) {
            jQuery(".nav-" + c[i]).addClass("active");
        }
    }
}

/**
 * Make sure you push any required css files into "themeCssFiles" before calling
 *
 * See /static/js/toolbars.js
 */
function initHtmlEditors(elements, height, width, extraPlugins, removePlugins, callback) {
    var fullUrl = false;
    if ($.isPlainObject(height)) {
        var options = $.extend({}, height);
        height = options.height;
        width = options.width;
        extraPlugins = options.extraPlugins;
        removePlugins = options.removePlugins;
        callback = options.callback;
        fullUrl = options.fullUrl;
    }
    
    flog('initHtmlEditors', elements, height, width, extraPlugins, removePlugins);
    
    $.getScriptOnce('/static/ckeditor456/ckeditor.js', function () {
        $.getScriptOnce('/static/ckeditor456/adapters/jquery.js', function () {
            $.getScriptOnce('/static/js/toolbars.js', function () {
                if (!elements) {
                    elements = $('.htmleditor');
                }
                if (!extraPlugins) {
                    extraPlugins = standardExtraPlugins;
                }
                if (!removePlugins) {
                    removePlugins = standardRemovePlugins;
                }
                
                flog('Prepare html editors using templates=' + templatesPath + ' and styles=' + stylesPath); // see toolbars.js for templatesPath
                elements.each(function () {
                    var element = $(this);
                    
                    // Add id for editor if dont have id
                    if (!element.attr('id')) {
                        element.attr('id', 'editor-' + Math.round(Math.random() * 123456789));
                    }
                    
                    var inputClasses = element.attr('class');
                    var toolbar = 'Default';
                    if (inputClasses) {
                        inputClasses = inputClasses.split(' ');
                        for (var i = 0; i < inputClasses.length; i++) {
                            var s = inputClasses[i];
                            if (s.startsWith('toolbar-')) {
                                s = s.substring(8);
                                toolbar = s;
                                break;
                            }
                        }
                    }
                    
                    flog('Using toolbar=' + toolbar + ' => ', toolbarSets[toolbar]);
                    
                    themeCssFiles.push('/static/bootstrap/3.3.7/css/bootstrap.min.css');
                    themeCssFiles.push('/static/bootstrap/ckeditor/bootstrap-ckeditor.css');
                    
                    var config = {
                        skin: editorSkin,
                        allowedContent: true, // DISABLES Advanced Content Filter. This is so templates with classes are allowed through
                        contentsCss: themeCssFiles, // mainCssFile,
                        bodyId: 'editor',
                        templates_files: [templatesPath],
                        templates_replaceContent: false,
                        toolbarGroups: toolbarSets[toolbar],
                        extraPlugins: extraPlugins,
                        removePlugins: removePlugins,
                        enterMode: 'P',
                        forceEnterMode: true,
                        filebrowserBrowseUrl: '/static/fckfilemanager/browser/default/browser.html?Type=Image&Connector=/fck_connector.html',
                        filebrowserUploadUrl: '/uploader/upload',
                        format_tags: 'p;h1;h2;h3;h4;h5;h6', // removed p2
                        format_p2: {
                            element: 'p',
                            attributes: {
                                'class': 'lessSpace'
                            }
                        },
                        minimumChangeMilliseconds: 100,
                        fullUrl: fullUrl
                    };
                    
                    if (height) {
                        if (height !== 'auto') {
                            config.height = height;
                        }
                    } else {
                        config.height = '300';
                    }
                    if (width) {
                        config.width = width;
                    }
                    
                    config.stylesSet = 'myStyles:' + stylesPath; // See toolbars.js, or overridden elsewhere
                    
                    flog('Create editor', element, config);
                    var editor = element.ckeditor(config).editor;
                    
                    editor.on('instanceReady', function () {
                        if (!ADDED_EXTRA_CSS) {
                            var cssCkeditorExtra = '/static/ckeditor456/skins/bootstrapck/editor_extra.css';
                            flog('Loading ckeditor extra css');
                            $('<link href="' + cssCkeditorExtra + '" rel="stylesheet">').appendTo('head');
                            
                            ADDED_EXTRA_CSS = true;
                        }
                        
                        if (typeof callback === 'function') {
                            callback.call(this, editor);
                        }
                    });
                });
                
                CKEDITOR.dtd.$removeEmpty['i'] = false;
            });
        });
    });
}

// Event for tab panel
function initTabPanel() {
    log("initTabPanel");
    $("nav.TabNav a").on("click", function (e) {
        //e.preventDefault();
        log("initTabPanel:click1", this);
        var href = $(this).attr("href");
        $(this).addClass("Active").siblings().removeClass("Active");
        $(".TabContent").hide().filter('[rel="' + href + '"]').show();
        
    });
    
    var tabLinks = $("body").find("nav.TabNav a");
    var url = window.location.href;
    if (url.contains("#")) {
        var tabId = url.substring(url.indexOf("#"));
        log("tabId", tabId);
        var selectedTab = tabLinks.filter('[href="' + tabId + '"]');
        log("selectedTab", selectedTab);
        if (selectedTab.length > 0) {
            selectedTab.first().click();
            return;
        }
    }
    var firstTab = $("body").find("nav.TabNav a").eq(0);
    log("select first tab", firstTab);
    firstTab.trigger("click");
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    };
}

// Function check/uncheck for checkbox
$.fn.check = function (is_check) {
    return $(this).attr('checked', is_check);
};

// Function disable/enable for form control
$.fn.disable = function (is_disable) {
    return $(this).attr('disabled', is_disable);
};

// Ensure support for toISOString in all browsers
if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function () {
        function pad(n) {
            return n < 10 ? '0' + n : n
        }
        
        return this.getUTCFullYear() + '-'
            + pad(this.getUTCMonth() + 1) + '-'
            + pad(this.getUTCDate()) + 'T'
            + pad(this.getUTCHours()) + ':'
            + pad(this.getUTCMinutes()) + ':'
            + pad(this.getUTCSeconds()) + 'Z';
    };
}

var typewatch = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    }
})();

function initPlaceholder() {
    if ($.placeholder) {
        $('input, textarea').placeholder();
    }
}

function initPseudoClasses() {
    $("table tr td:first-child").addClass("first");
    $("table tr td:last-child").addClass("last");
    $("table tr:nth-child(odd)").addClass("odd");
    $("table tr:nth-child(even)").addClass("even");
    $("ul li:nth-child(even)").addClass("even");
    $("ul li:nth-child(odd)").addClass("odd");
}

function initPrintLink() {
    $("a.print").click(function (e) {
        e.preventDefault();
        window.print();
    });
}

/**
 *  Although this function is defined here in the theme, it should be called
 *  from each page.
 *
 *  Each page should decide what url to pass as the pageUrl, as this can be used
 *  to share comments across pages (such as when the logical context is the folder
 *  the pages are in, rather then each page)
 *
 *  Eg initComments(window.location.pathname);
 */
function initComments(pageUrl) {
    log("initComments", pageUrl);
    $(".hideBtn").click(function () {
        var oldCommentsHidden = $("#comments:visible").length == 0;
        log("store new comments hidden", oldCommentsHidden);
        jQuery.cookie("commentsHidden", !oldCommentsHidden, {
            path: "/"
        });
        $("#comments").toggle(100, function () {
            if (!oldCommentsHidden) {
                $(".hideBtn a").text("Show comments");
                $(".hideBtn a").addClass("ishidden");
            } else {
                $(".hideBtn a").text("Hide comments");
                $(".hideBtn a").removeClass("ishidden");
            }
        });
        return false;
    });
    var commentsHidden = jQuery.cookie("commentsHidden", {
        path: "/"
    });
    log("comments hidden", commentsHidden);
    if (commentsHidden == "true") {
        $("#comments").hide();
        $(".hideBtn a").text("Show comments");
        $(".hideBtn a").addClass("ishidden");
    }
    
    $("body").on("click", ".commentContainer textarea", function (e) {
        $(e.target).closest("div").find(".commentControls").show();
    });
    $('.commentContainer textarea').autogrow()
    
    var currentUser = {
        name: userName,
        href: userUrl,
        photoHref: "/profile/pic"
    };
    
    // This is for deferred logins, ie someone logs in after going to a page with comments
    $('body').on('userLoggedIn', function (event, userUrl, userName) {
        currentUser.name = userName;
        currentUser.href = userUrl;
    });
    
    $("#comments").comments({
        currentUser: currentUser,
        pageUrl: pageUrl,
        renderCommentFn: function (user, date, comment) {
            log("renderCommentFn", user);
            if (user == null) {
                log("no user so dont render");
                return;
            }
            var profilePic = profileImg(user);
            var profLink = $("<a class='profilePic' href='" + user.href + "'>" + profilePic + "</a>");
            var nameLink = $("<a class='user' href='" + user.href + "'>" + user.name + "</a>");
            var commentPara = $("<p></p>");
            commentPara.html(comment);
            //var dateSpan = $("<span class='auxText'>" + toDisplayDateNoTime(date) + "<a href='#'>Reply to this comment</a></span>");
            
            var dateSpan = $("<abbr title='" + date.toISOString() + "' class='auxText'>" + toDisplayDateNoTime(date) + "</abbr>");
            var toolsDiv = $("<div></div>");
            /**
             var del = $("<a class='auxText' href='#'>Delete</a>");
             var abuse = $("<a class='auxText' href='#'>Report abuse</a>");
             toolsDiv.append(del);
             toolsDiv.append(abuse);
             **/
            var outerDiv = $("<div class='forumReply'></div>");
            outerDiv.append(profLink);
            outerDiv.append(nameLink);
            outerDiv.append(commentPara);
            outerDiv.append(dateSpan);
            outerDiv.append(toolsDiv);
            outerDiv.insertAfter($("#comments .fBox"));
            
            jQuery("abbr.auxText", outerDiv).timeago();
        }
    });
}

function initSelectAll() {
    flog("initSelectAll");
    $("body").on("click", ".selectAll", function (e) {
        var node = $(e.target);
        flog("selectall", node, node.is(":checked"));
        var chkName = node.attr("name");
        var checked = node.is(":checked");
        checkBoxes = node.closest("table").find("tbody td input[type=checkbox][name=" + chkName + "]");
        flog("check boxes", checkBoxes);
        if (checked) {
            checkBoxes.prop("checked", true);
        } else {
            checkBoxes.prop("checked", false);
        }
    });
}

/**
 *  Uses the new jwplayer and HLS. Replaces images with the video-jw class with a
 *  jwPlayer control, which loads the video from a path either derived from
 *  the image src, or from the data-video-src attribute if present
 */
function initVideos() {
    log("initVideos");
    doInitVideos();
    $(document).on("pjaxComplete", function () {
        doInitVideos();
    });
}

function doInitVideos() {
    var images = $(".video-jw");
    if (images.length === 0) {
        return;
    }
    $.getScript("/static/jwplayer/6.8/jwplayer.js", function () {
        $.getScript("/static/jwplayer/6.8/jwplayer.html5.js", function () {
            jwplayer.key = "cXefLoB9RQlBo/XvVncatU90OaeJMXMOY/lamKrzOi0=";
            replaceImagesWithJWPlayer(images);
        });
    });
}

function replaceImagesWithJWPlayer(images) {
    images.each(function (i, n) {
        var img = $(n);
        var src = img.attr("data-video-src");
        var posterUrl = img.attr("src");
        if (src == null) {
            flog("replaceImagesWithJWPlayer: derive video base path from src", posterUrl);
            src = getFolderPath(posterUrl);
        } else {
            flog("replaceImagesWithJWPlayer: Using data-video-src", src);
        }
        src += "/alt-hls.m3u8";
        flog("jwplayer item", img, i, src);
        buildJWPlayer(img, i + 10, src, posterUrl);
    });
}

function buildJWAudioPlayer(count, src, autostart) {
    var playerInstance = jwplayer("kaudio-player-" + count);
    var isHash = src.indexOf('/_hashes/files/') === 0;
    
    playerInstance.setup({
        file: src + (isHash ? '.mp3' : ''),
        width: '100%',
        height: 30,
        autostart: autostart,
        flashplayer: "/static/jwplayer/6.10/jwplayer.flash.swf",
        html5player: "/static/jwplayer/6.10/jwplayer.html5.js",
        primary: "flash"
    });
    playerInstance.onReady(function () {
        log('jwplayer init done');
    });
}

function buildJWPlayer(itemToReplace, count, src, posterHref) {
    var h = itemToReplace.height();
    if (h == 0) {
        h = 360;
    }
    var w = itemToReplace.width();
    if (w == 0) {
        w = 640;
    }
    
    var div = buildJWPlayerContainer(count);
    flog("buildJWPlayer", src, "size=", h, w);
    itemToReplace.replaceWith(div);
    var innerId = div.find(".jw-video").attr("id");
    var isHash = src.indexOf('/_hashes/files/') === 0;
    
    jwplayer(innerId).setup({
        file: src,
        flashplayer: "/static/jwplayer/6.8/jwplayer.flash.swf",
        height: h,
//        image: posterHref,
        width: w,
        playlist: [
            {
                image: posterHref,
                sources: [{
                    file: src
                }, {
                    file: src + isHash ? '/alt-640-360.webm' : '/../alt-640-360.webm'
                }, {
                    file: src + isHash ? '/alt-640-360.m4v' : '/../alt-640-360.m4v'
                }]
            }
        ]
        //,primary: "flash"
    });
    jwplayer(innerId).onReady(function () {
        var wrapperId = innerId + "_wrapper";
        var wrapper = $("#" + wrapperId);
        wrapper.addClass("jwplayer-wrapper");
    });
    
}

function buildJWPlayerContainer(count) {
    var c = "<div class='jw_container_outer'><div id='jw_container_" + count + "' class='jw-video'></div></div>";
    return $(c);
}

/** End init-theme.js */