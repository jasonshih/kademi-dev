/** Start theme.js */

/**
 *  Editor support: Note that this relies on a global variable called toolbarSets
 *  
 *  A default is defined in toolbars.js. You should override that file in your
 *  application to get the toolbars you want
 */

CKEDITOR_BASEPATH = "/static/ckeditor440/";


// Templates should push theme css files into this array, so they will be included in the editor
var themeCssFiles = new Array();



function initTheme() {
    flog("initTheme-bootstrap300: init-theme.js");

    // the login box in header is normally for logging in from a public page. So
    // in this case we want to navigate to the user's dashboard
    $(".header .Login").user({
    });
    // the login form appears in content when the requested page requires a login
    // so in this case we do not give a post-login url, we will just refresh the current page
    $("#content .Login").user();

    initEdify();
    initActiveNav(".initActive");
    initHelp();
    initRotation();
    initPrintLink();
    initVideos();

    flog("initTheme: run page init functions", pageInitFunctions.length);
    $.each(pageInitFunctions, function (i, f) {
        log("run function" + i);
        pageInitFunctions[i]();
        log("done run function", i);

    });

    flog("finished init-theme");
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




/**
 * Make sure you push any required css files into "themeCssFiles" before calling
 * 
 * See /static/js/toolbars.js
 */
function initHtmlEditors(elements, height, width, extraPlugins, removePlugins) {
    flog("initHtmlEditors: height=", height);
//    if (!$('.htmleditor').ckeditor) {
//        log("ckeditor jquery adapter is not loaded");
//        return;/
//    }
    if (!elements) {
        elements = $(".htmleditor");
    }
    if (!extraPlugins) {
        extraPlugins = standardExtraPlugins; // see toolbars.js
    }
    if (!removePlugins) {
        removePlugins = standardRemovePlugins;
    }
    log("prepare html editors", elements);
    elements.each(function (i, n) {
        var inp = $(n);

        var inputClasses = inp.attr("class");
        var id = inp.attr("id");
        var toolbar = "Default";
        if (inputClasses) {
            c = inputClasses.split(" ");
            for (i = 0; i < c.length; i++) {
                var s = c[i];
                if (s.startsWith("toolbar-")) {
                    s = s.substring(8);
                    toolbar = s;
                    break;
                }
            }
        }

        toolbar = "Default"; // HACK!!
        flog("using toolbar", toolbar, "=>", toolbarSets[toolbar]);
        var config = {
            skin: editorSkin,
            allowedContent: true, // DISABLES Advanced Content Filter. This is so templates with classes are allowed through
            contentsCss: themeCssFiles, // mainCssFile,
            bodyId: "editor",
            templates_files: ['/static/editor/templates.js'],
            templates_replaceContent: false,
            toolbarGroups: toolbarSets[toolbar],
            extraPlugins: extraPlugins,
            removePlugins: removePlugins,
            enterMode: "P",
            forceEnterMode: true,
            filebrowserBrowseUrl: '/static/fckfilemanager/browser/default/browser.html?Type=Image&Connector=/fck_connector.html',
            filebrowserUploadUrl: '/uploader/upload',
            format_tags: 'p;h1;h2;h3;h4;h5;h6', // removed p2
            format_p2: {
                element: 'p',
                attributes: {
                    'class': 'lessSpace'
                }
            }
        };

        if (height) {
            config.height = height;
        } else {
            config.height = "300";
        }
        if (width) {
            config.width = width;
        }

        config.stylesSet = 'myStyles:/templates/themes/admin2/styles.js'; // TODO: needs to be configurable, based on theme
        log("create editor", inp, config);
        //var editor = CKEDITOR.instances["body"];
        flog("editor", CKEDITOR.instances);

    });

    CKEDITOR.dtd.$removeEmpty['i'] = false;
}


function initRotation() {
    $(function () {
        flog("initRotation");
        var rotaters = $(".rotate");
        if (rotaters.length === 0) {
            return;
        }
        try {
            var rotateDegrees = 0;

            setInterval(function () {
                if (rotateDegrees === 360) {
                    rotateDegrees = 0;
                } else {
                    rotateDegrees += 2;
                }

                $('.rotate.anticlockwise').rotate(-rotateDegrees);
                $('.rotate.clockwise').rotate(rotateDegrees);
            }, 50);
        } catch (e) {
            flog("initRotation - exception: " + e);
            alert("exception in init rotation");
        }
    });
}


function initPrintLink() {
    var links = $("a.print2");
    flog("initPrintLink", links);
    links.click(function (e) {
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
    if (commentsHidden === "true") {
        $("#comments").hide();
        $(".hideBtn a").text("Show comments");
        $(".hideBtn a").addClass("ishidden");
    }

    $("body").on("click focus", ".commentContainer textarea", function (e) {
        $(e.target).closest("div").find(".commentControls").show();
    });
    $('.commentContainer textarea').css('overflow', 'hidden').autogrow()

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
        pageUrl: pageUrl
    });
}


function initSelectAll() {
    $("body").on("click", ".selectAll", function (e) {
        var node = $(e.target);
        log("selectall", node, node.is(":checked"));
        var chkName = node.attr("name");
        var checked = node.is(":checked");
        checkBoxes = node.closest("table").find("tbody td input:[type=checkbox]:[name=" + chkName + "]");
        if (checked) {
            checkBoxes.attr("checked", "true");
        } else {
            checkBoxes.removeAttr("checked");
        }
    });
}


/**
 *  Uses the new jwplayer and HLS. Replaces images with the video-jw class with a 
 *  jwPlayer control, which loads the video from a path either derived from 
 *  the image src, or from the data-video-src attribute if present
 */
function initVideos() {
    flog("initVideos");
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
        jwplayer.key = "cXefLoB9RQlBo/XvVncatU90OaeJMXMOY/lamKrzOi0=";
        replaceImagesWithJWPlayer(images);
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


function buildJWPlayer(itemToReplace, count, src, posterHref) {
    var h = itemToReplace.height();
    if (h === 0) {
        h = 360;
    }
    var w = itemToReplace.width();
    if (w === 0) {
        w = 640;
    }

    var div = buildJWPlayerContainer(count);
    log("buildJWPlayer", src, "size=", h, w);
    itemToReplace.replaceWith(div);
    var innerId = div.find(".jw-video").attr("id");
    flog("HACK using src");
    jwplayer(innerId).setup({
//        file: src,
        height: h,
//        image: posterHref,
        width: w,
        playlist: [{
                image: posterHref,
                sources: [{
                        file: src
                    }
                    , {
                        file: src + "/../alt-640-360.webm"
                    }, {
                        file: src + "/../alt-640-360.m4v"
                    }]
            }]
        , primary: "flash"
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