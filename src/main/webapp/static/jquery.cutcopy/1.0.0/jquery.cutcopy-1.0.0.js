(function ($) {
    /**
     */
    var defaultConfig = {
        clipboardName: "default",
        copyClass: ".btn-copy",
        cutClass: ".btn-cut",
        pasteClass: ".btn-paste",
        duplicateClass: ".btn-duplicate",
        reload: true, // will attempt to reload
        reloadId: null, // will look for an id on the container, and reload if present
        afterReload: null, // called after reload
        success: function (sourceHref, newUrl, isCut) {
            var msg = (isCut ? 'Cut' : 'Copied');
            msg += ' successfully'
            Msg.success(msg);
        }
    };

    /**
     * See (http://jquery.com/).
     * @name $
     * @class
     * See the jQuery Library (http://jquery.com/) for full details. This just
     * documents the function and classes that are added to jQuery by this plug-in.
     */

    /**
     * See (http://jquery.com/)
     * @name fn
     * @class
     * See the jQuery Library (http://jquery.com/) for full details. This just
     * documents the function and classes that are added to jQuery by this plug-in.
     * @memberOf $
     */

    /**
     * Enabled cut/copy/paste functionality
     * @name cutcopy
     * @class
     * @memberOf $.fn
     * @version 1.0.0
     * @param {Config} options Configuration of comment
     */
    $.fn.cutcopy = function (options) {
        var container = this;
        var config = $.extend({}, defaultConfig, options);

        container.on('click', config.duplicateClass, function (e) {
            e.preventDefault();

            var link = $(this).closest('a');
            var href = link.attr("href");
            var folder = href.substring(0, href.lastIndexOf('/'));

            flog("Duplicate", href);

            setClipboard(config.clipboardName, href, false);
            doClipboardAction(href, folder, false, function () {
                clearClipboard(config.clipboardName);
                if (config.success) {
                    config.success(href, folder, false);
                }
                if (config.reload) {
                    var id = config.reloadId;
                    if (id === null) {
                        id = container.attr("id");
                    }
                    if (id !== null) {
                        $('#' + id).reloadFragment({
                            whenComplete: function () {
                                checkRequiresClipboard(config.clipboardName);
                                if (config.afterReload) {
                                    config.afterReload(sourceHref, newHref, isCut);
                                }
                            }
                        });
                    } else {
                        checkRequiresClipboard(config.clipboardName);
                    }
                }
            });
        });

        container.on('click', config.copyClass, function (e) {
            e.preventDefault();

            var link = $(this).closest('a');
            var href = link.attr("href");

            setClipboard(config.clipboardName, href, false);
            flog("Placed on clipboard (copy)", href);
            checkRequiresClipboard(config.clipboardName);
        });

        container.on('click', config.cutClass, function (e) {
            e.preventDefault();

            var link = $(this).closest('a');
            var href = link.attr("href");

            setClipboard(config.clipboardName, href, true);
            flog("Placed on clipboard (cut)", href);
            checkRequiresClipboard(config.clipboardName);
        });

        container.on('click', config.pasteClass, function (e) {
            e.preventDefault();
            var newHref = $(e.target).closest("a").attr("href");
            var sourceHref = getClipboardHref(config.clipboardName);
            var isCut = isClipboardCut(config.clipboardName);

            flog("Paste from clipboard source", sourceHref, isCut, "newHref=", newHref);

            doClipboardAction(sourceHref, newHref, isCut, function () {
                clearClipboard(config.clipboardName);
                if (config.success) {
                    config.success(sourceHref, newHref, isCut);
                }
                if (config.reload) {
                    var id = config.reloadId;
                    if (id === null) {
                        id = container.attr("id");
                    }
                    if (id !== null) {
                        $('#' + id).reloadFragment({
                            whenComplete: function () {
                                checkRequiresClipboard(config.clipboardName);
                                if (config.afterReload) {
                                    config.afterReload(sourceHref, newHref, isCut);
                                }
                            }
                        });
                    } else {
                        checkRequiresClipboard(config.clipboardName);
                    }
                }
            });
        });
        checkRequiresClipboard(config.clipboardName);
    };

})(jQuery);

function checkRequiresClipboard(clipboardName) {
    var href = getClipboardHref(clipboardName);
    var items = $(".requires-clipboard").filter('[data-clipboard="' + clipboardName + '"]');
    flog("checkRequiresClipboard", items, "href", href);
    if (href === null || href === "") {
        flog("hide");
        items.hide();
    } else {
        flog("show");
        items.show(300);
    }
}

function setClipboard(clipboardName, href, isCut) {
    var cookieName = 'clipboard-' + clipboardName;
    var val = href;
    if (isCut) {
        href += "|cut";
    }
    $.cookie(cookieName, val, {
        path: '/',
        expires: 30
    });
}

function clearClipboard(clipboardName) {
    var cookieName = 'clipboard-' + clipboardName;
    $.cookie(cookieName, "", {
        path: '/',
        expires: 30
    });
}

function getClipboardHref(clipboardName) {
    var cookieName = 'clipboard-' + clipboardName;
    var cookieVal = $.cookie(cookieName) || '';
    if (cookieVal.indexOf('|cut') !== -1) {
        cookieVal = cookieVal.split('|cut')[0];
    }
    return cookieVal;
}

function isClipboardCut(clipboardName) {
    var cookieName = 'clipboard-' + clipboardName;
    var cookieVal = $.cookie(cookieName) || '';
    return cookieVal.indexOf('|cut') !== -1;
}

function doClipboardAction(oldUrl, newUrl, isCut, ondone) {
    // newUrl will always be a folder path, should always end with a slash
    if (!newUrl.endsWith("/")) {
        newUrl += "/";
    }

    // Check if the target resource exists, and if so rename
    var targetFileName = getFileName(oldUrl);
    flog("doClipboardAction. newUrl=", newUrl);
    doClipboardActionWithName(oldUrl, newUrl, targetFileName, isCut, ondone, 0);
}

function doClipboardActionWithName(oldUrl, destFolder, destName, isCut, ondone, cnt) {
    flog('doClipboardActionWithName', oldUrl, destFolder, destName, isCut, cnt);

    var candidateNewUrl = destFolder + destName;
    if (cnt > 0) {
        if (destName.indexOf('.') !== -1) {
            var lastDotIndex = candidateNewUrl.lastIndexOf('.');
            candidateNewUrl = candidateNewUrl.substring(0, lastDotIndex) + '.' + cnt + candidateNewUrl.substring(lastDotIndex, candidateNewUrl.length);
        } else {
            candidateNewUrl += "." + cnt;
        }
    }
    checkExists(candidateNewUrl, {
        exists: function () {
            flog("Target href does exist, so try with a different name", candidateNewUrl);
            doClipboardActionWithName(oldUrl, destFolder, destName, isCut, ondone, cnt + 1);
        },
        notExists: function () {
            flog("target href does not exist, so carry on", candidateNewUrl);
            if (isCut) {
                moveFolder(oldUrl, candidateNewUrl, ondone);
            } else {
                copyFolder(oldUrl, candidateNewUrl, ondone);
            }
        }
    });
}

function checkExists(href, config) {
    $.ajax({
        type: 'HEAD',
        url: href,
        success: function (resp) {
            flog("success", resp);
            config.exists();
        },
        error: function (resp) {
            flog("error", resp);
            config.notExists();
        }
    });
}
