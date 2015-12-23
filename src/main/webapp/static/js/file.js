// Turns a href like /files/Pictures/abc/ into Pictures/abc
function toDisplayFolder(href) {
    var s = href;
    s = s.substring(0, s.length - 1); // lose trailing slash
    return s;
}

/**
 * Will callback to function(newUrl, newName)
 */
function showRename(href, oldName, callback) {
    var newName = prompt("Please enter a new name for " + oldName);
    if (newName) {
        if (newName.length > 0 && newName != oldName) {
            renameFile(href, newName, function (newUrl, newName) {
                if (callback) {
                    log("callback2")
                    callback(newUrl, newName);
                }
            });
        }
    }
}

/**
 * Will callback to function(newUrl, newName)
 */
function renameFile(href, newName, callback) {
    ajaxLoadingOn();
    var newUrl = getParentHref(href) + "/" + newName;
    var targetUrl = href;
    if (!targetUrl.endsWith("/")) {
        targetUrl += "/";
    }
    targetUrl += "_DAV/MOVE";
    log("renameFile2", newUrl);
    $.ajax({
        type: 'POST',
        url: targetUrl,
        data: "destination=" + newUrl,
        dataType: "json",
        success: function () {
            log('success');
            ajaxLoadingOff();
            log('success - show confirmation');
            showThankyou("Rename", "The file has been renamed to " + newName);
            if (callback) {
                log("callback1");
                callback(newUrl, newName);
            }
        },
        error: function (resp) {
            log("failed", resp);
            ajaxLoadingOff();
            showThankyou("Error", "Sorry, the file could not be renamed.");
        }
    });
}

function ajaxLoadingOn(sel) {
    log('ajax ON', sel);
//    $("#ajaxLoading").dialog({
//        modal: true,
//        width: "400px",
//        resizable: false,
//        dialogClass: "noTitle"
//    });
}

function ajaxLoadingOff(sel) {
    log('ajax OFF', sel);
    //$("#ajaxLoading").dialog('close');
}
function initFolderUpload() {
    var button = $('#filemanUpload');
    log('initFolderUpload', button);
    if (button.length > 0) {
        new AjaxUpload(button, {
            action: currentFolderUrl + '_DAV/PUT?_autoname=true',
            name: 'upload',
            autoSubmit: true,
            responseType: 'json',
            onSubmit: function (file, ext) {
                ajaxLoadingOn();
                this.disable();
            },
            onComplete: function (file, response) {
                ajaxLoadingOff();
                this.enable();
                refreshCurrentFolder();
            }
        });
    }
}

/**
 * Returns the path of the parent item, without a trailing slash
 *
 * Eg getParentHref("a/b/c") == "a/b"
 */
function getParentHref(href) {
    log('getParentHref', href);
    while (href.endsWith("/")) {
        href = href.substring(0, href.length - 1);
        log(' - stripped to: ', href);
    }
    var pos = href.lastIndexOf("/");
    href = href.substring(0, pos);
    log(' - result: ', href);
    return href;
}

function isExcluded(href) {
    log("isExcluded", href, excludedPaths);
    for (i = 0; i < excludedPaths.length; i++) {
        var p = accountRootPathNoSlash() + excludedPaths[i];
        log("starts with", href, p);
        if (href.startsWith(p)) {
            log("yep");
            return true;
        }
        log("nup");
    }
    return false;
}

function isDisplayable(href) {
    if (isExcluded(href)) {
        return false;
    } else if (!isDisplayableFileHref(href)) {
        return false;
    }
    return true;
}
