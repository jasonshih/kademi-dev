// ================================================================
// Utilities
// ================================================================
/**
 * Fuse Log - renamed from 'log' to avoid name clash with less.js
 *
 * varargs function to output to console.log if console is available
 */
function flog() {
    if (typeof (console) != 'undefined') {
        // BM: Previous used JSON, but that crashed IE sometimes. So this is pretty crap, but at least safer
        if (arguments.length == 1) {
            console.log(arguments[0]);
        } else if (arguments.length == 2) {
            console.log(arguments[0], arguments[1]);
        } else if (arguments.length == 3) {
            console.log(arguments[0], arguments[1], arguments[2]);
        } else if (arguments.length == 4) {
            console.log(arguments[0], arguments[1], arguments[2], arguments[3]);
        } else if (arguments.length == 5) {
            console.log(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
        } else {
            if (navigator.appName == 'Microsoft Internet Explorer') {
                console.log(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
            } else {
                console.log(arguments);
            }
        }
    }
}

function log() {
    flog('"log" function is deprecated');
}

function endsWith(str, suffix) {
    return str.match(suffix + "$") == suffix;
}
function startsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}

var typewatch = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    }
})();

function ensureObject(target) {
    if (typeof target == "string") {
        target = $("#" + target);
    }
    return target;
}

function pad2(i) {
    var j = i - 0; // force to be a number
    if (j < 10) {
        return "0" + j;
    } else {
        return i;
    }
}


function toFileSize(num) {
    if (num > 1000000) {
        return Math.round(num / 1000000) + 'Mb';
    } else {
        return Math.round(num / 1000) + 'Kb';
    }
}

function toDisplayDateNoTime(dt) {
    var s = (dt.date) + "/" + (dt.month + 1) + "/" + (dt.year + 1900);
    if (dt.hour) {
        s += " " + dt.hour + ":" + dt.minute;
    }
    return s;
}

/**
 * Formats a numeric value as a date and time, or if already a string just returns it
 *
 * @param {type} l - the numeric value to format as a date/time or a string to return as is
 * @returns {String} - a formatted date
 */
function formatDateTime(l) {
    if (l) {
        if (typeof l === "string") {
            return l;
        } else {
            var dt = new Date(l);
            var m = dt.getMonth() + 1; // java dates are 1 indexed, but js is zero indexed
            return pad2(dt.getDate()) + "/" + pad2(m) + "/" + dt.getFullYear() + " " + pad2(dt.getHours()) + ":" + pad2(dt.getMinutes());
        }
    } else {
        return "";
    }
}

function now() {
    var dt = new Date();
    return {
        day: dt.getDay(),
        month: dt.getMonth(),
        year: dt.getYear()
    };
}

function reverseDateOrd(post1, post2) {
    return dateOrd(post1, post2) * -1;
}

function dateOrd(post1, post2) {
    var n = post1.date;
    if (n == null) {
        if (m == null) {
            return 0;
        } else {
            return -1;
        }
    }
    var m = post2.date;
    
    if (n.year < m.year) {
        return -1;
    } else if (n.year > m.year) {
        return 1;
    }
    if (n.month < m.month) {
        return -1;
    } else if (n.month > m.month) {
        return 1;
    }
    if (n.day < m.day) {
        return -1;
    } else if (n.day > m.day) {
        return 1;
    }
    if (n.hours < m.hours) {
        return -1;
    } else if (n.hours > m.hours) {
        return 1;
    }
    if (n.minutes < m.minutes) {
        return -1;
    } else if (n.minutes > m.minutes) {
        return 1;
    }
    if (n.seconds < m.seconds) {
        return -1;
    } else if (n.seconds > m.seconds) {
        return 1;
    }
    return 0;
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function ajaxLoadingOn(sel) {
    log('ajax ON', sel);
}

function ajaxLoadingOff(sel) {
    log('ajax OFF', sel);
}

function getFileName(path) {
    var arr = path.split('/');
    if (arr.length === 1) {
        return "";
    }
    var name = arr[arr.length - 1];
    if (name == null || name.length == 0) { // might be empty if trailing slash
        name = arr[arr.length - 2];
    }
    if (name.contains("#")) {
        var pos = name.lastIndexOf("#");
        name = name.substring(0, pos);
    }
    path = path.replaceAll(" ", "%20"); // safari bug. path is returned encoded from window.location.pathname
    return name;
}

/**
 *
 * Get the path of the resource which contains the given path
 *
 */
function getFolderPath(path) {
    path = stripFragment(path); // remove any fragment like #section
    if (path.endsWith("/")) {
        path = path.substring(0, path.length - 1);
    }
    var pos = path.lastIndexOf("/");
    return path.substring(0, pos);
}

/**
 *  If the given path is a folder (ie ends with a slash) return it. Otherwise,
 *  strip the file portion and remove the collection path
 */
function toFolderPath(path) {
    path = stripFragment(path); // remove any fragment like #section
    var pos = path.lastIndexOf("/");
    return path.substring(0, pos);
}

/**
 * just removed the server portion of the href
 */
function getPathFromHref(href) {
    // eg http://blah.com/a/b -->> /a/b
    var path = href.substring(8); // drop protocol
    var pos = path.indexOf("/");
    path = path.substring(pos);
    return path;
}


function suffixSlash(href) {
    if (href.endsWith("/")) {
        return href;
    }
    return href + "/";
}


function profileImg(user) {
    var profileHref;
    if (user.photoHref) {
        profileHref = user.photoHref;
    } else if (user.photoHash) {
        profileHref = "/_hashes/files/" + user.photoHash + "";
    } else {
        profileHref = "/templates/apps/user/profile.png";
    }
    var profilePic = "<img src='" + profileHref + "' alt='' />";
    return profilePic;
}

/**
 * Evaluate a relative path from an absolute path to get an absolute path to he relative path from the absolute path
 *
 */
function evaluateRelativePath(startFrom, relPath) {
    var arr = relPath.split("/");
    var href = startFrom;
    for (i = 0; i < arr.length; i++) {
        var part = arr[i];
        if (part == "..") {
            href = getFolderPath(href);
        } else if (part == ".") {
            // do nothing
        } else {
            href += "/" + part;
        }
    }
    return href;
}

function replaceSpecialChars(nameToUse) {
    nameToUse = nameToUse.replace("/", "");
    nameToUse = nameToUse.replace("'", "");
    nameToUse = nameToUse.replace("\"", "");
    nameToUse = nameToUse.replace("@", "-");
    nameToUse = nameToUse.replace(" ", "-");
    nameToUse = nameToUse.replace("?", "-");
    nameToUse = nameToUse.replace(":", "-");
    nameToUse = nameToUse.replace("--", "-");
    nameToUse = nameToUse.replace("--", "-");
    return nameToUse;
}

function pulseBorder(node) {
    node.animate({
        boxShadow: '0 0 30px #ED9DAE'
    }, 2000, function () {
        setTimeout(function () {
            node.animate({
                boxShadow: '0 0 0 #FFF'
            }, 1000);
        }, 5000);
    });
}

function stripFragment(href) {
    var i = href.indexOf("#");
    if (i > 0) {
        href = href.substring(0, i - 1);
    }
    return href;
}

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

/**
 *  jqExtras.js - this is for functions which work with jquery. Generally should be loaded
 *  after jquery
 */


function initEdify() {
    if (!$("body").hasClass("edifyIsEditMode")) {
        $("body").addClass("edifyIsViewMode");
    }
    $("body").on("click", ".edifyDelete", function() {
        var href = window.location.href;
        var name = getFileName(href);
        confirmDelete(href, name, function() {
            alert("Page deleted");
            var folderHref = getFolderPath(href);
            log("load", folderHref);
            window.location = folderHref + '/';
        });
    });
}

function resetForm($form) {
    $form.each(function() {
        this.reset();
    });
}

function clearForm(form) {
    form.each(function () {
        var currentForm = $(this);
        var inputs = currentForm.find('input');
        var selects = currentForm.find('select');
        var textareas = currentForm.find('textarea');
        
        inputs.each(function () {
            var input = $(this);
            
            if (input.is(':checkbox') || input.is(':radio')) {
                input.prop('checked', false);
            } else if (input.is(':reset') || input.is(':button') || input.is(':submit') || input.is(':image')) {
                // Do nothing
            } else {
                input.val('');
            }
        });
        
        selects.each(function () {
            var select = $(this);
            select.val('');
        });
        textareas.each(function () {
            var textarea = $(this);
            textarea.val('');
        });
    });
}

function edify(container, callback, validateCallback) {
    log("edify", container, callback);
    $("body").removeClass("edifyIsViewMode");
    $("body").addClass("edifyIsEditMode");
    
    if (!callback) {
        callback = function(resp) {
            if (resp.nextHref) {
                //window.location = resp.nextHref;
            } else {
                //window.location = window.location.pathname;
            }
        };
    }
    
    container.animate({
        opacity: 0
    }, 200, function() {
        //initHtmlEditors(cssFiles);
        initHtmlEditors();
        
        $(".inputTextEditor").each(function(i, n) {
            var $n = $(n);
            var s = $n.text();
            $n.replaceWith("<input name='" + $n.attr("id") + "' type='text' value='" + s + "' />");
        });
        container.wrap("<form id='edifyForm' action='" + window.location + "' method='POST'></form>");
        $("#edifyForm").append("<input type='hidden' name='body' value='' />");
        
        $("#edifyForm").submit(function(e) {
            log("edifyForm submit");
            e.preventDefault();
            e.stopPropagation();
            submitEdifiedForm(callback, validateCallback);
        });
        log("done hide, now show again");
        container.animate({
            opacity: 1
        }, 500);
    });
}


function confirmDelete(href, name, callback) {
    if (confirm("Are you sure you want to delete " + name + "?")) {
        deleteFile(href, callback);
    }
}
function deleteFile(href, callback) {
    ajaxLoadingOn();
    $.ajax({
        type: 'DELETE',
        url: href,
        dataType: "json",
        success: function(resp) {
            log('deleted', href);
            ajaxLoadingOff();
            if (callback) {
                callback();
            }
        },
        error: function(resp) {
            log("failed", resp);
            ajaxLoadingOff();
            alert("Sorry, an error occured deleting " + href + ". Please check your internet connection");
        }
    });
}

function proppatch(href, data, callback) {
    ajaxLoadingOn();
    href = suffixSlash(href);
    $.ajax({
        type: 'POST',
        url: href + "_DAV/PROPPATCH",
        data: data,
        dataType: "json",
        success: function(resp) {
            ajaxLoadingOff();
            if (callback) {
                callback();
            }
        },
        error: function(resp) {
            log("failed", resp);
            ajaxLoadingOff();
            alert("Sorry, an error occured deleting " + href + ". Please check your internet connection");
        }
    });
}

function suffixSlash(href) {
    if (href.endsWith("/")) {
        return href;
    }
    return href + "/";
}

function showCreateFolder(parentHref, title, text, callback, validatorFn) {
    log("showCreateFolder: bootstrap335");
    var s = text;
    if (!s) {
        s = "Please enter a name for the new folder";
    }
    myPrompt("createFolder", parentHref, title, text, "Enter a name", "newName", "Create", "", "Enter a name to create", function(newName, form) {
        log("create folder", form);
        var msg = null;
        if (validatorFn) {
            msg = validatorFn(newName);
        }
        if (msg == null) {
            createFolder(newName, parentHref, function() {
                callback(newName);
                closeMyPrompt();
            });
        } else {
            alert(msg);
        }
        return false;
    });
}

function createFolder(name, parentHref, callback) {
    var encodedName = name; //$.URLEncode(name);
    //    ajaxLoadingOn();
    var url = "_DAV/MKCOL";
    if (parentHref) {
        var s = parentHref;
        if (!s.endsWith("/")) {
            s += "/";
        }
        s += url;
        url = s;
    }
    $.ajax({
        type: 'POST',
        url: url,
        dataType: 'text',
        data: {
            name: encodedName
        },
        success: function(resp) {
            $("body").trigger("ajaxLoading", {
                loading: false
            });
            if (callback) {
                callback(name, resp);
            }
        },
        error: function(resp) {
            log("error", resp);
            $("body").trigger("ajaxLoading", {
                loading: false
            });
            if (resp.status == 200) {
                if (callback) {
                    callback(name, resp);
                }
                return;
            }
            
            alert('There was a problem creating the folder');
        }
    });
}

/**
 *  Prompts the user for a new name, and the does a rename (ie move)
 */
function promptRename(sourceHref, callback) {
    log("promptRename", sourceHref);
    var currentName = getFileName(sourceHref);
    var newName = prompt("Please enter a new name for " + currentName, currentName);
    if (newName) {
        newName = newName.trim();
        if (newName.length > 0 && currentName != newName) {
            var currentFolder = getFolderPath(sourceHref);
            var dest = currentFolder;
            if (!dest.endsWith("/")) {
                dest += "/";
            }
            dest += newName;
            move(sourceHref, dest, callback);
        }
    }
}

function move(sourceHref, destHref, callback) {
    //    ajaxLoadingOn();
    var url = "_DAV/MOVE";
    if (sourceHref) {
        var s = sourceHref;
        log("s", s);
        if (!s.endsWith("/")) {
            s += "/";
        }
        url = s + url;
    }
    log("move", sourceHref, destHref, "url=", url);
    $("body").trigger("ajaxLoading", {
        loading: true
    });
    $.ajax({
        type: 'POST',
        url: url,
        data: {
            destination: destHref
        },
        dataType: "json",
        success: function(resp) {
            $("body").trigger("ajaxLoading", {
                loading: false
            });
            if (callback) {
                callback(resp);
            }
        },
        error: function() {
            $("body").trigger("ajaxLoading", {
                loading: false
            });
            alert('There was a problem creating the folder');
        }
    });
}

/**
 * Find links which begin with the current url (or are equal) within the given
 * containerSelector, and add the 'active' class to them
 */
function initActiveNav(containerSelector) {
    var url = window.location.pathname;
    var container = $(containerSelector);
    log("initActiveNav", url, "container:", container);
    container.find("a").each(function(i, n) {
        var node = $(n);
        var href = node.attr("href");
        if (href) {
            log("initActiveNav, check", url, href);
            if (href.startsWith(url)) {
                node.addClass("active");
            }
        }
    });
}

// http://stackoverflow.com/questions/1134976/how-may-i-sort-a-list-alphabetically-using-jquery
function asc_sort(a, b) {
    return ($(b).text()) < ($(a).text());
}

// decending sort
function dec_sort(a, b) {
    return ($(b).text()) > ($(a).text());
}

function submitEdifiedForm(callback, validateCallback) {
    var form = $("#edifyForm");
    log("trigger event..");
    form.trigger("submitEdified");
    log("submit form", form);
    for (var key in CKEDITOR.instances) {
        var editor = CKEDITOR.instances[key];
        var content = editor.getData();
        var inp = $("input[name=" + key + "], textarea[name=" + key + "]");
        if (inp.length > 0) {
            inp.val(content);
        } else {
            inp = $("<input type='hidden' name='" + key + "/>");
            form.append(inp);
            inp.val(content);
        }
        log("copied html editor val to:", inp, "for", key);
    }
    
    resetValidation(form);
    if (!checkRequiredFields(form)) {
        return false;
    }
    
    if (validateCallback) {
        if (!validateCallback(form)) {
            log("validation callback reported false");
            return false;
        }
    }
    
    
    var data = form.serialize();
    log("serialied", data);
    
    try {
        //$("#edifyForm input[name=body]").attr("value", CKEDITOR.instances["editor1"].getData() );
        $.ajax({
            type: 'POST',
            url: $("#edifyForm").attr("action"),
            data: data,
            dataType: "json",
            success: function(resp) {
                ajaxLoadingOff();
                log("common.js: edify: save success", resp, window.location.path);
                if (callback) {
                    log("call callback", callback);
                    callback(resp);
                } else {
                    log("no callback");
                }
            },
            error: function(resp) {
                ajaxLoadingOff();
                Msg.error('err');
            }
        });
    } catch (e) {
        log("exception", e);
    }
    return false;
}

// ================================================================
// Extra prototypes for objects
// ================================================================
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    };
}

/**
 * ReplaceAll by Fagner Brack (MIT Licensed)
 * Replaces all occurrences of a substring in a string
 */
String.prototype.replaceAll = function (token, newToken, ignoreCase) {
    var str, i = -1, _token;
    if ((str = this.toString()) && typeof token === "string") {
        _token = ignoreCase === true ? token.toLowerCase() : undefined;
        while ((i = (
            _token !== undefined ?
                str.toLowerCase().indexOf(
                    _token,
                    i >= 0 ? i + newToken.length : 0
                ) : str.indexOf(
                token,
                i >= 0 ? i + newToken.length : 0
            )
        )) !== -1) {
            str = str.substring(0, i)
                .concat(newToken)
                .concat(str.substring(i + token.length));
        }
    }
    return str;
};

/**
 * Adds a contains function to String objects
 */
String.prototype.contains = function (it) {
    return this.indexOf(it) != -1;
};

String.prototype.startsWith = function (prefix) {
    return this.indexOf(prefix) === 0;
};
String.prototype.endsWith = function (suffix) {
    return this.match(suffix + "$") == suffix;
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

Date.prototype.formatMMDDYYYY = function () {
    return (this.getMonth() + 1) +
        "/" + this.getDate() +
        "/" + this.getFullYear();
};

Date.prototype.formatDDMMYYYY = function () {
    return this.getDate() +
        "/" + (this.getMonth() + 1) +
        "/" + this.getFullYear();
};

Array.max = function (array) {
    return Math.max.apply(Math, array);
};

Array.min = function (array) {
    return Math.min.apply(Math, array);
};

/*
 * http://javascriptbase64.googlecode.com/svn/trunk/base64.js
 *
 Copyright (c) 2008 Fred Palmer fred.palmer_at_gmail.com
 
 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:
 
 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 */
function StringBuffer() {
    this.buffer = [];
}

StringBuffer.prototype.append = function append(string) {
    this.buffer.push(string);
    return this;
};

StringBuffer.prototype.toString = function toString() {
    return this.buffer.join("");
};

var Base64 = {
    codex: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function (input) {
        var output = new StringBuffer();
        
        var enumerator = new Utf8EncodeEnumerator(input);
        while (enumerator.moveNext()) {
            var chr1 = enumerator.current;
            
            enumerator.moveNext();
            var chr2 = enumerator.current;
            
            enumerator.moveNext();
            var chr3 = enumerator.current;
            
            var enc1 = chr1 >> 2;
            var enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            var enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            var enc4 = chr3 & 63;
            
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            
            output.append(this.codex.charAt(enc1) + this.codex.charAt(enc2) + this.codex.charAt(enc3) + this.codex.charAt(enc4));
        }
        
        return output.toString();
    },
    decode: function (input) {
        var output = new StringBuffer();
        
        var enumerator = new Base64DecodeEnumerator(input);
        while (enumerator.moveNext()) {
            var charCode = enumerator.current;
            
            if (charCode < 128)
                output.append(String.fromCharCode(charCode));
            else if ((charCode > 191) && (charCode < 224)) {
                enumerator.moveNext();
                var charCode2 = enumerator.current;
                
                output.append(String.fromCharCode(((charCode & 31) << 6) | (charCode2 & 63)));
            } else {
                enumerator.moveNext();
                var charCode2 = enumerator.current;
                
                enumerator.moveNext();
                var charCode3 = enumerator.current;
                
                output.append(String.fromCharCode(((charCode & 15) << 12) | ((charCode2 & 63) << 6) | (charCode3 & 63)));
            }
        }
        
        return output.toString();
    }
};

function Utf8EncodeEnumerator(input) {
    this._input = input;
    this._index = -1;
    this._buffer = [];
}

Utf8EncodeEnumerator.prototype = {
    current: Number.NaN,
    moveNext: function () {
        if (this._buffer.length > 0) {
            this.current = this._buffer.shift();
            return true;
        } else if (this._index >= (this._input.length - 1)) {
            this.current = Number.NaN;
            return false;
        } else {
            var charCode = this._input.charCodeAt(++this._index);
            
            // "\r\n" -> "\n"
            //
            if ((charCode == 13) && (this._input.charCodeAt(this._index + 1) == 10)) {
                charCode = 10;
                this._index += 2;
            }
            
            if (charCode < 128) {
                this.current = charCode;
            } else if ((charCode > 127) && (charCode < 2048)) {
                this.current = (charCode >> 6) | 192;
                this._buffer.push((charCode & 63) | 128);
            } else {
                this.current = (charCode >> 12) | 224;
                this._buffer.push(((charCode >> 6) & 63) | 128);
                this._buffer.push((charCode & 63) | 128);
            }
            
            return true;
        }
    }
}

function Base64DecodeEnumerator(input) {
    this._input = input;
    this._index = -1;
    this._buffer = [];
}

Base64DecodeEnumerator.prototype = {
    current: 64,
    moveNext: function () {
        if (this._buffer.length > 0) {
            this.current = this._buffer.shift();
            return true;
        } else if (this._index >= (this._input.length - 1)) {
            this.current = 64;
            return false;
        } else {
            var enc1 = Base64.codex.indexOf(this._input.charAt(++this._index));
            var enc2 = Base64.codex.indexOf(this._input.charAt(++this._index));
            var enc3 = Base64.codex.indexOf(this._input.charAt(++this._index));
            var enc4 = Base64.codex.indexOf(this._input.charAt(++this._index));
            
            var chr1 = (enc1 << 2) | (enc2 >> 4);
            var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            var chr3 = ((enc3 & 3) << 6) | enc4;
            
            this.current = chr1;
            
            if (enc3 != 64)
                this._buffer.push(chr2);
            
            if (enc4 != 64)
                this._buffer.push(chr3);
            
            return true;
        }
    }
};
