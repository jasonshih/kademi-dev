/**
 *  Editor support: Note that this relies on a global variable called toolbarSets
 *
 *  A default is defined in toolbars.js. You should override that file in your
 *  application to get the toolbars you want
 */
CKEDITOR_BASEPATH = "/static/ckeditor456/";

// Templates should push theme css files into this array, so they will be included in the editor
var themeCssFiles = new Array();

function initCollapseListGroup() {
    flog('initCollapseListGroup');
    
    $(document.body).on({
        'hide.bs.collapse': function () {
            var id = this.id;
            var toggler = $('[data-toggle="collapse"][href="#' + id + '"]');
            var icon = toggler.find('.glyphicon');
            
            icon.addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down');
        },
        'show.bs.collapse': function () {
            var id = this.id;
            var toggler = $('[data-toggle="collapse"][href="#' + id + '"]');
            var icon = toggler.find('.glyphicon');
            
            icon.addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-right');
        }
    }, '.list-group.collapse');
}

function runPageInitFunctions() {
    flog('runPageInitFunctions');
    
    $.each(window.pageInitFunctions, function (i) {
        flog('runPageInitFunctions | Run function #' + i);
        pageInitFunctions[i]();
        flog('runPageInitFunctions | Done in run function #', i);
    });
}

function initTappyTable() {
    flog('initTappyTable');
    
    $(document.body).on('click', 'table.table-tappy tbody td', function (e) {
        var target = $(e.target);
        if (target.is('a')) {
            return;
        }
        
        var td = target.closest('td');
        var href = td.find('a').attr('href');
        flog('Click on table-tappy', td, href);
        window.location.href = href;
    });
}

function initTimeago() {
    if ($.timeago) {
        $.timeago.settings.allowFuture = true;
        $(".timeago").timeago();
    }
}

function initContentFeatures() {
    flog('initContentFeatures');
    
    // Add or remove collapsed class to panels, so we can use that to switch the glyphicon symbol
    $(document.body).on({
        'shown.bs.collapse': function (e) {
            var n = $(e.target);
            n.closest('.panel.dropdown-btn')
                .removeClass('collapsed')
                .find('.glyphicon').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
        },
        'hidden.bs.collapse': function (e) {
            var n = $(e.target);
            n.closest('.panel.dropdown-btn')
                .addClass('collapsed')
                .find('.glyphicon').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
            
        }
    });
    
    // Find any dropdown-btn and add appropriate classes and markup to allow dynamic dropdowns
    $('.dropdown-btn').each(function () {
        var dropdown = $(this);
        
        dropdown.addClass('collapsed');
        dropdown.find('.panel-body').wrap('<div class="panel-collapse collapse"></div>');
        dropdown.find('.panel-title').append('<span class="glyphicon glyphicon-chevron-right"></span>');
    });
    
    // dropdown-btn needs explicit collapse, because we dont want to use ID's, required for attributes usage
    $(document).on('click', '.dropdown-btn .panel-heading', function (e) {
        var n = $(e.target);
        
        n.closest('.panel').find('.panel-collapse').collapse('toggle');
    });
}

function initLogin() {
    flog('initLogin');
    
    // init the login form
    $(".login").user({});
    
    // the login box in header is normally for logging in from a public page. So
    // in this case we want to navigate to the user's dashboard
    $(".header .Login").user({});
    // the login form appears in content when the requested page requires a login
    // so in this case we do not give a post-login url, we will just refresh the current page
    $("#content .Login").user();
}

/**
 * Make sure you push any required css files into "themeCssFiles" before calling
 *
 * See /static/js/toolbars.js
 */
function initHtmlEditors(elements, height, width, extraPlugins, removePlugins) {
    flog("initHtmlEditors: height=", height, "removePlugins", removePlugins);
    
    $.getScriptOnce('/static/ckeditor456/ckeditor.js', function () {
        $.getScriptOnce('/static/ckeditor456/adapters/jquery.js', function () {
            $.getScriptOnce('/theme/js/toolbars.js', function () {
                if (!elements) {
                    elements = $(".htmleditor");
                }
                if (!extraPlugins) {
                    extraPlugins = standardExtraPlugins; // see toolbars.js
                }
                flog("extraPlugins", extraPlugins);
                if (!removePlugins) {
                    removePlugins = standardRemovePlugins;
                }
                flog("removePlugins", removePlugins);
                flog("prepare html editors", elements);
                
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
                    
                    flog("themeCssFiles", themeCssFiles);
                    flog("editorSkin", editorSkin);
                    var currentFolder = getFolderPath(window.location.pathname);
                    var config = {
                        skin: editorSkin,
                        allowedContent: true, // DISABLES Advanced Content Filter. This is so templates with classes are allowed through
                        contentsCss: themeCssFiles, // mainCssFile,
                        bodyId: "editor",
                        templates_files: [templatesPath],
                        templates_replaceContent: false,
                        toolbarGroups: toolbarSets[toolbar],
                        extraPlugins: extraPlugins,
                        removePlugins: removePlugins,
                        enterMode: "P",
                        forceEnterMode: true,
                        filebrowserBrowseUrl: '/static/fckfilemanager/browser/default/browser.html?Type=Image&Connector=/fck_connector.html',
                        // filebrowserBrowseUrl: currentFolder + '/_ckbrowser.html?Type=Image&Connector=/fck_connector.html', // TODO
                        filebrowserUploadUrl: '/fck_connector.html?CurrentFolder=' + currentFolder,
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
                    
                    //config.stylesSet = 'myStyles:/theme/styles.js'; // TODO: needs to be configurable, based on theme
                    config.stylesSet = "myStyles:" + stylesPath;
                    flog("create editor", inp, config);
                    var editor = inp.ckeditor(config).editor;
                    //var editor = CKEDITOR.instances["body"];
                    flog("editor instances", CKEDITOR.instances);
                    
                });
                
                CKEDITOR.dtd.$removeEmpty['i'] = false;
            });
        });
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

function initPrintLink() {
    var links = $("a.print2");
    flog("initPrintLink", links);
    links.off('click').on('click', function (e) {
        e.preventDefault();
        window.print();
        return false;
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
    flog("initComments", pageUrl);
    $(".hideBtn").click(function () {
        var oldCommentsHidden = $("#comments:visible").length == 0;
        flog("store new comments hidden", oldCommentsHidden);
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
    flog("comments hidden", commentsHidden);
    if (commentsHidden === "true") {
        $("#comments").hide();
        $(".hideBtn a").text("Show comments");
        $(".hideBtn a").addClass("ishidden");
    }
    
    $("body").on("click focus", ".commentContainer textarea", function (e) {
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
    
    var comments = $("#comments");
    if (comments.length > 0) {
        comments.comments({
            currentUser: currentUser,
            pageUrl: pageUrl
        });
    }
}

function initSelectAll() {
    $(document.body).on('click', '.selectAll', function (e) {
        var chkAll = $(this);
        var chkName = chkAll.attr('name');
        flog('SelectAll', chkAll, this.checked);
        
        chkAll.closest('table').find('tbody td input[type=checkbox][name=' + chkName + ']').prop('checked', this.checked);
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
    $.getScript("/static/jwplayer/6.10/jwplayer.js", function () {
        jwplayer.key = "cXefLoB9RQlBo/XvVncatU90OaeJMXMOY/lamKrzOi0=";
        replaceImagesWithJWPlayer(images);
    });
}

function replaceImagesWithJWPlayer(images) {
    // will not transform images which in /contenteditor page
    if ($(document.body).hasClass('content-editor-page'))
        return;
    
    images.each(function (i, n) {
        var img = $(n);
        var src = img.attr("data-video-src");
        var posterUrl = img.attr("src");
        var aspectratio = img.attr("data-aspectratio");
        var autostart = img.attr('data-autostart') === 'true';
        var repeat = img.attr('data-repeat') === 'true';
        var controls = true; // Force showing controls for now
        if (src == null) {
            flog("replaceImagesWithJWPlayer: derive video base path from src", posterUrl);
            src = getFolderPath(posterUrl);
        } else {
            flog("replaceImagesWithJWPlayer: Using data-video-src", src);
        }
        src += "/alt-hls.m3u8";
        flog("jwplayer item", img, i, src);
        buildJWPlayer(img, i + 10, src, posterUrl, aspectratio, autostart, repeat, controls);
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
        flog('jwplayer init done');
    });
}

function buildJWPlayer(itemToReplace, count, src, posterHref, aspectratio, autostart, repeat, controls) {
    flog("itemToReplace", itemToReplace);
    
    var h = itemToReplace.height();
    if (h < 100) {
        h = 360;
    }
    var w = itemToReplace.width();
    if (w < 100) {
        w = 640;
    }
    
    if (!aspectratio) {
        aspectratio = w + ":" + h;
    }
    
    var div = buildJWPlayerContainer(count);
    flog("buildJWPlayer", src, "size=", h, w);
    itemToReplace.replaceWith(div);
    var innerId = div.find(".jw-video").attr("id");
    var isHash = src.indexOf('/_hashes/files/') === 0;
    flog("HACK using src");
    jwplayer(innerId).setup({
//        file: src,
//        height: h,
//        image: posterHref,
        flashplayer: "/static/jwplayer/6.10/jwplayer.flash.swf",
        html5player: "/static/jwplayer/6.10/jwplayer.html5.js",
        width: "100%",
        aspectratio: aspectratio,
        autostart: autostart,
        repeat: repeat,
        controls: controls,
        androidhls: true, //enable hls on android 4.1+
        playlist: [{
            image: posterHref,
            sources: [{
                file: src
            }
                , {
                    file: src + isHash ? '/alt-640-360.webm' : '/../alt-640-360.webm'
                }, {
                    file: src + isHash ? '/alt-640-360.m4v' : '/../alt-640-360.m4v'
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

function doInitAudio() {
    var images = $('img[data-kaudio]');
    if (images.length === 0) {
        return;
    }
    $.getScript("/static/jwplayer/6.10/jwplayer.js", function () {
        jwplayer.key = "cXefLoB9RQlBo/XvVncatU90OaeJMXMOY/lamKrzOi0=";
        replaceImagesWithAudio(images);
    });
}

function initAudios() {
    flog('initAudios');
    doInitAudio();
    
    $(document).on('pjaxComplete', function () {
        doInitAudio();
    });
}

function replaceImagesWithAudio(images) {
    // will not transform images which in /contenteditor page
    if ($(document.body).hasClass('content-editor-page'))
        return;
    
    images.each(function (i, n) {
        var img = $(n);
        var src = img.attr('data-kaudio');
        var width = img.attr('data-width');
        if (!width) {
            width = 300;
        }
        var autostart = img.attr('data-autostart') === 'true';
        img.wrap('<div style="width: ' + width + 'px; max-width: 100%; margin-left: auto; margin-right: auto"></div>');
        if (src) {
            flog('replaceImagesWithAudio: Using data-kaudio', src);
            var audioWrap = $('<div id="kaudio-player-' + i + '" />');
            audioWrap.insertAfter(img);
            img.hide();
            buildJWAudioPlayer(i, src, autostart);
        } else {
            flog('replaceImagesWithAudio: audio not found', src);
        }
    });
}

function initTablesForCkeditor() {
    flog('Checking tables for cellpadding or cellspacing, if yes make a workaround since bootstrap doesnt support this');
    
    $('table').each(function () {
        var table = $(this);
        var cellPadding = table.attr('cellpadding');
        var cellSpacing = table.attr('cellspacing');
        
        if (cellSpacing) {
            // Support cellpadding and cellspacing in css way
            flog('cellspacing found', this, cellSpacing);
            table.css({
                'border-collapse': 'separate',
                'border-spacing': cellSpacing + 'px'
            });
            table.removeAttr('cellspacing');
        }
        
        if (cellPadding) {
            flog('cellpadding found', this, cellPadding);
            table.find('th, td').css('padding', cellPadding + 'px');
            table.removeAttr('cellpadding');
        }
    })
}


/**
 * Provided by each theme to integrate modals
 */
var lastOpenedModal;
function showModal(modal, title) {
    flog("showModal-bootstrap3", modal);
    modal.find(".close-modal").remove(); // added by old fuse theme, need to remove
    if (!modal.hasClass("modal")) {
        modal.addClass("modal fade");
    }
    if (modal.find(".modal-body").length === 0) {
        modal.wrapInner("<div class='modal-body'></div>");
        var headerHtml = "<div class='modal-header'>"
            + "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>";
        if (title) {
            headerHtml += "<h4 class='modal-title'>" + title + "</h4>"
        }
        headerHtml += "</div>";
        modal.prepend(headerHtml);
    }
    if (modal.find(".modal-content").length === 0) {
        modal.wrapInner("<div class='modal-content'></div>");
        flog("wrap inner", modal);
    }
    if (modal.find(".modal-dialog").length === 0) {
        modal.wrapInner("<div class='modal-dialog'></div>");
        flog("wrap inner", modal);
    }
    lastOpenedModal = modal;
    flog("showModal", "lastOpenedModal", lastOpenedModal);
    modal.modal();
}

function closeModals() {
    flog("closeModals", $(".modal"));
    if (lastOpenedModal) {
        lastOpenedModal.modal('hide');
    }
}

function closeMyPrompt() {
    closeModals();
}

function myPrompt(id, url, title, instructions, caption, buttonName, buttonText, inputClass, inputPlaceholder, callback) {
    flog("myPrompt: bootstrap-base", id, url);
    var body = $("body")
    var modal = body.find("div.myprompt");
    if (modal.length === 0) {
        modal = $(
            '<div class="modal fade" style="display: none">' +
            '    <div class="modal-dialog">' +
            '        <div class="modal-content">' +
            '            <div class="modal-header">' +
            '                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '                <h3>Modal header</h3>' +
            '            </div>' +
            '            <form method="POST" class="form-horizontal">' +
            '                <div class="modal-body">' +
            '                    <div class="form-message alert alert-danger" style="display: none;"></div>' +
            '                </div>' +
            '                <div class="modal-footer">' +
            '                    <a href="#" class="btn">Close</a>' +
            '                    <button type="submit" href="#" class="btn btn-primary">Save changes</button>' +
            '                </div>' +
            '            </form>' +
            '        </div>' +
            '    </div>' +
            '</div>'
        );
        modal.attr("id", id);
        body.append(modal);
    }
    modal.find(".modal-header").text(title);
    var form = modal.find("form");
    form.attr("action", url);
    form.find(".modal-body").append("<p class='notes'></p>");
    form.find(".notes").html(instructions);
    form.find(".modal-body").append("<div class='form-group'><label class='col-md-4 control-label' for='inputEmail'>label</label><div class='col-md-8'><input type='text' id='inputEmail' required='true' class='required form-control'></div></div>");
    
    var row1 = form.find(".form-group");
    var inputId = id + "_" + buttonName;
    row1.find("input").addClass(inputClass);
    row1.find("input").attr("name", buttonName).attr("id", inputId).attr("placeholder", inputPlaceholder);
    row1.find("label").attr("for", inputId).text(caption);
    form.find(".btn-primary").text(buttonText);
    
    form.submit(function (e) {
        flog("submit");
        e.preventDefault();
        resetValidation(form);
        if (checkRequiredFields(form)) {
            var newName = form.find("input").val();
            if (callback(newName, form)) {
                closeModals();
                modal.remove();
            }
        }
    });
    
    modal.find("a.btn").click(function () {
        closeModals();
    });
    
    showModal(modal);
}

$(function () {
    flog("init: bootstrap-base/js/theme.js");
    
    initLogin();
    initCollapseListGroup();
    runPageInitFunctions();
    initTappyTable();
    initPrintLink();
    initVideos();
    initAudios();
    initTablesForCkeditor();
    initContentFeatures();
    initTimeago();
    initEdify();
    initActiveNav(".initActive");
    initHelp();
});
