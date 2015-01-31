/**
 *
 *  jquery.forms.js
 *  
 *  Depends on common.js
 *  
 *  Takes a config object with the following properties:
 *  - callback(resp, form): called after successful processing with the response object and the form
 *  - validate(form) - return true if the form is valid
 *  - errorHandler(resp, form, valiationMessageSelector, errorCallback) - default displays messages and also calls errorCallback if provided
 *  - errorCallback() - a simpler error callback, is called after form UI is updated
 *  - doPostForm - defaults to true. If false, the form will not be submitted, although callbacks will still be called
 *  - confirmMessage - defaults to null, which suppresses confirmation display
 *  - valiationMessageSelector - defaults to ".pageMessage"
 *  - validationFailedMessage - defaults to "Some inputs are not valid."
 */

(function ($) {

    $.fn.forms = function (options) {

        $.getScriptOnce("/static/js/moment-with-langs.min.js");

        var form = $(this);
        if (form.data('formOPtions')) {
            return;
        }

        flog("init forms plugin", this);

        var config = $.extend({
            postUrl: null, // means to use the form action as url
            callback: function () {

            },
            errorHandler: function (resp, form, valiationMessageSelector, errorCallback) {
                try {
                    var messagesContainer = $(valiationMessageSelector, form);
                    flog("status indicates failure", resp);
                    if (resp) {
                        if (resp.messages && resp.messages.length > 0) {
                            for (i = 0; i < resp.messages.length; i++) {
                                var msg = resp.messages[i];
                                showMessage(msg, form);
                            }
                        } else {
                            showMessage("Sorry, we couldnt process your request", form);
                        }
                        showFieldMessages(resp.fieldMessages, form)
                    } else {
                        showMessage("Sorry, we couldnt process your request", form);
                    }
                    messagesContainer.show(100);
                } catch (e) {
                    flog("ex", e);
                }
                if (errorCallback) {
                    errorCallback();
                }
            },
            error: function () {

            },
            validate: function (form) {
                return true;
            },
            onValid: function (form) {

            },
            doPostForm: true,
            confirmMessage: null,
            valiationMessageSelector: ".pageMessage",
            validationFailedMessage: "Some inputs are not valid."
        }, options);

        flog("msgs", config.valiationMessageSelector, form, $(config.valiationMessageSelector, form));
        form.on('submit', function (e) {
            flog("submit");
            e.preventDefault();
            e.stopPropagation();
            var thisForm = $(this);

            resetValidation(thisForm);
            if (!config.validate(thisForm)) {
                flog("validate method returned false");
                return false;
            }
            thisForm.trigger("submitForm");
            flog("form submit", thisForm);
            if (checkRequiredFields(thisForm)) {
                if (typeof config.onValid === 'function') {
                    config.onValid(thisForm);
                }
                if (config.doPostForm) {
                    postForm(thisForm, config.valiationMessageSelector, config.validationFailedMessage, config.callback, config.confirmMessage, config.postUrl, config.error, config.errorHandler);
                }
            } else {
                showValidation(null, config.validationFailedMessage, thisForm);
                var messages = $(config.valiationMessageSelector, thisForm);
//                messages.append("<div class='alert alert-danger'>Some inputs are not valid. Please correct any highlighted fields.</div>");
//                messages.find(".alert")
//                        .prepend("<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>")
//                        .alert();
//                flog("show messages", messages);
//                messages.show(100);
                config.error(thisForm);
            }
            return false;
        });

        form.data('formOptions', config);
    };

    // http://stackoverflow.com/questions/5392344/sending-multipart-formdata-with-jquery-ajax
    $.fn.serializeWithFiles = function () {
        var form = $(this);
        flog("serializeWithFiles", form);
        /* ADD FILE TO PARAM AJAX */
        var formData = new FormData();
        $.each($(form).find("input[type='file']"), function (i, tag) {
            $.each($(tag)[0].files, function (i, file) {
                formData.append(tag.name, file);
            });
        });
        var params = $(form).serializeArray();
        $.each(params, function (i, val) {
            formData.append(val.name, val.value);
        });
        return formData;
    };

    // Version for jquery.forms
    $.fn.forms.version = '1.0.5';

})(jQuery);

function postForm(form, valiationMessageSelector, validationFailedMessage, callback, confirmMessage, postUrl, errorCallback, errorHandler) {
    var enc = form.attr("enctype");
    flog("postForm", "enc", enc, "form", form);
    var data;
    if (enc == "multipart/form-data") {
        data = form.serializeWithFiles();
    } else {
        data = form.serialize();
    }
    flog("data", data);

    form.trigger("preSubmitForm", data);
    var url = form.attr("action");
    if (postUrl) {
        flog("use supplied postUrl instead of form action", postUrl);
        url = postUrl;
    }
    flog("postForm", form, data, url);
    try {
        form.find("button").attr("disabled", "true");
        form.addClass("ajax-processing");
        var ajaxOpts = {
            type: 'POST',
            url: url,
            data: data,
            dataType: "json",
            success: function (resp) {
                form.find("button").removeAttr("disabled");
                ajaxLoadingOff();
                form.removeClass("ajax-processing");
                if (resp && resp.status) {
                    flog("save success", resp)
                    if (confirmMessage) {
                        showConfirmMessage(form, confirmMessage, valiationMessageSelector);
                    }
                    callback(resp, form)
                } else {
                    if (errorHandler) {
                        errorHandler(resp, form, valiationMessageSelector, errorCallback);
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                ajaxLoadingOff();
                form.removeClass("ajax-processing");
                form.find("button").removeAttr("disabled");
                flog("error posting form", form, jqXHR, textStatus, errorThrown);
                if (errorHandler) {
                    errorHandler(null, form, valiationMessageSelector, errorCallback);
                }
                $(valiationMessageSelector, form).text(validationFailedMessage);
                $(valiationMessageSelector, form).show(100);
            }
        };

        if (enc == "multipart/form-data") {
            ajaxOpts.processData = false;
            ajaxOpts.contentType = false;
        }

        $.ajax(ajaxOpts);
    } catch (e) {
        flog("exception submitting form", e);
        alert("Sorry, an error occured attempting to submit the form. Please contact the site administrator");
    }
}

function showConfirmMessage(form, confirmMessage) {
    form.prepend("<div class='alert alert-success'><button type='button' class='close' data-dismiss='alert'>&times;</button>" + confirmMessage + "</div>");
    window.setTimeout(function () {
        form.find(".alert").remove();
    }, 5000);
}

function showFieldMessages(fieldMessages, form) {
    if (fieldMessages) {
        $.each(fieldMessages, function (i, n) {
            flog("field message", n);
            var target = $("#" + n.field);
            showValidation(target, n.message, form);
        });
    }
}

function resetValidation(form) {
    $(".control-group", form).removeClass("error");
    $(".form-group", form).removeClass("has-error");
    $(".validationError", form).remove();
    $(".pageMessage", form).hide(300);
    $(".pageMessage", form).html("");
    $(".error > *", form).unwrap();
    $(".errorField", form).removeClass("errorField");
    $(".alert", form).remove();
}

function checkRequiredFields(form) {
    flog('checkRequiredFields', form);
    var isOk = true;

    // Check mandatory
    if (!checkRequiredRadios(form)) {
        flog("missing radios");
        isOk = false;
    }
    $(".required", form).not(".tt-hint").each(function (index, node) { // exclude tt-hint, thats a field created by the typeahead plugin which copies the required class
        var val = $(node).val();
        if (val !== null) {
            val = $.trim(val);
        } else {
            val = "";
        }

        var title = $(node).attr("title");
        if (val.length === 0 || (val === title)) { // note that the watermark can make the value == title
            flog('error field', node);
            showErrorField($(node));
            isOk = false;
        }
    });

    if (!checkRequiredChecks(form)) {
        flog('missing required checkboxs');
        isOk = false;
    }

    if (isOk) {
        isOk = checkValidEmailAddress(form);

        if (!checkDates(form)) {
            isOk = false;
        }
        if (!checkValidPasswords(form)) {
            isOk = false;
        }
        if (!checkSimpleChars(form)) {
            isOk = false;
        }
        if (!checkHrefs(form)) {
            isOk = false;
        }
        if (!checkNumbers(form)) {
            isOk = false;
        }
        if (!checkRegex(form)) {
            isOk = false;
        }
    } else {
        showMessage("Please enter all required values", form);
    }
    return isOk;
}

function checkRegex(form) {
    var isOk = true;
    $('input.regex', form).each(function () {
        var input = $(this);
        var value = input.val();
        var regex = new RegExp(input.attr('data-regex'));
        var message = input.attr('data-message');

        if (regex.test(value)) {
            isOk = true;
        } else {
            isOk = false;

            if (message) {
                showValidation(input, message, form);
            } else {
                showErrorField(input);
            }
        }

    });

    return isOk;
}

function checkRequiredChecks(form) {
    var isOk = true;
    $("input.required:checkbox", form).not(":checked").each(function (index, node) {
        node = $(node);
        node = $("label[for=" + node.attr("id") + "]");
        showErrorField($(node));
        isOk = false;
    });
    return isOk;
}
function checkRequiredRadios(form) {
    flog("checkRequiredRadios", form);
    var isOk = true;
    var radioNames = [];
    $("input.required:radio", form).each(function (index, node) {
        node = $(node);
        radioNames[node.attr("name")] = node;
    });
    for (name in radioNames) {
        var radios = form.find("input[name=" + name + "]");
        flog("radio name1", name, radios);
        var checked = radios.filter(":checked");
        flog("radio name2", name, checked);
        if (checked.length === 0) {
            showErrorField(radioNames[name]);
            isOk = false;
        }
    }
    return isOk;
}


function checkRadio(radioName, form) {
    flog('checkRadio', radioName, form);
    if ($("input:radio[name=" + radioName + "]:checked", form).length === 0) {
        var node = $("input:radio[name=" + radioName + "]", form)[0];
        node = $(node);
        node = $("label[for=" + node.attr("id") + "]");
        flog('apply error to label', node);
        showValidation(node, "Please select a value for " + radioName, form);
        return false;
    } else {
        return true;
    }
}

// depends on common.js
function checkDates(form) {
    isOk = true;
    $("input", form).each(function (index, node) {
        var id = $(node).attr("id");
        if (id && id.contains("Date")) {
            var val = $(node).val();
            if (val && val.length > 0) {
                var valid = moment(val, ["DD-MM-YYYY", "DD-MM-YYYY HH:mm"], true);
                if (!valid) {
                    flog("checkDates: not a valid date: ", val);
                    showValidation($(node), "Please enter a valid date", form);
                    isOk = false;
                }
            }
        }
    });
    return isOk;
}
/**
 *  If password is present, checks for validity
 */
function checkValidPasswords(form) {
    flog("checkValidPasswords");
    var target = $("#password, input.password", form);
    var p1 = target.val();
    if (p1) {
        var passed = true;
        if (!target.hasClass("allow-dodgy-password")) {
            passed = validatePassword(p1, {
                length: [6, Infinity],
                alpha: 1,
                numeric: 1,
                badWords: [],
                badSequenceLength: 6
            });
        }
        if (!passed) {
            showValidation(target, "Your password must be at least 6 characters and it must contain numbers and letters", form);
            return false;
        } else {
            return checkPasswordsMatch(form);
        }
    }
    return true;
}

function checkPasswordsMatch(form) {
    flog("checkPasswordsMatch");
    if ($("#confirmPassword").length == 0) {
        return true; // there is no confirmation field
    }
    var p1 = $("#password", form).val();
    var p2 = $("#confirmPassword", form).val();
    if (p1 != p2) {
        showValidation("password", "Your password's don't match. Please try again", form);
        return false;
    }
    return true;
}

/**
 * We assume the field to validate has an id of "email"
 */
function checkValidEmailAddress(form) {
    var target = $("#email, input.email", form); // either with id of email, or with class email
    var emailAddress = target.val();
    if (emailAddress) {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(emailAddress)) {
            showValidation(target, "Please check the format of your email address, it should read like ben@somewhere.com", form);
            return false;
        }
    }
    return true;
}

function checkSimpleChars(form) {
    flog("checkSimpleChars");
    var isOk = checkChars(form, ".simpleChars,.reallySimpleChars", "^[a-zA-Z0-9_\.\ -]+$");
    if (isOk) {
        var targets = $(".reallySimpleChars", form);
        targets.each(function (i, n) {
            var node = $(n);
            var val = node.val();
            if (val.length > 0) {
                if (val.contains(" ")) {
                    showValidation(node, "Spaces are not allowed", form);
                    isOk = false;
                }
                if (val.contains("+")) {
                    showValidation(node, "Plus signs are not allowed", form);
                    isOk = false;
                }
                if (val.contains(".")) {
                    showValidation(node, "Full stops are not allowed", form);
                    isOk = false;
                }
            }
        });
    }
    return isOk;
}

function checkChars(form, inpClass, reg) {
    flog("checkChars");
    var target = $(inpClass, form);
    flog("checkChars2", target, inpClass, form);
    var isOk = true;
    var pattern = new RegExp(reg);
    target.each(function (i, n) {
        var node = $(n);
        var val = node.val();
        flog("val", val);
        if (val.length > 0) {
            if (!pattern.test(val)) {
                flog("not valid");
                showValidation(node, "Please use only letters, numbers and underscores", form);
                isOk = false;
            } else {
                flog("is valid");
            }
        }
    });
    return isOk;
}

function checkReallySimple(val) {
    if (val.length > 0) {
        if (val.contains(" ")) {
            return false;
        }
        if (!pattern.test(val)) {
            return false;
        }
    }
    return true;
}

function checkNumbers(form) {
    var target = $(".numeric", form); // either with id of email, or with class email
    flog("checkNumbers", target);
    var isOk = true;
    target.each(function (i, n) {
        var node = $(n);
        var val = node.val();
        flog("checkNumeric", val);
        if (val.length > 0) {
            if (!isNumber(val)) {
                showValidation(node, "Please enter a number", form);
                isOk = false;
            } else {
                flog("  isok");
            }
        }
    });
    return isOk;
}

function checkHrefs(form) {
    var target = $(".href", form);
    var isOk = true;
    var pattern = new RegExp("^[a-zA-Z0-9_/%:/./-]+$");
    target.each(function (i, n) {
        var node = $(n);
        var val = node.val();
        if (val.length > 0) {
            if (!pattern.test(val)) {
                showValidation(node, "Not a valid web address", form);
                isOk = false;
            }
        }
    });
    return isOk;

}

function checkValueLength(target, minLength, maxLength, lbl, form) {
    //flog('checkValueLength', target, minLength, maxLength, lbl);
    target = ensureObject(target);
    if (target.length === 0) {
        return true;
    }
    var value = target.val();
    flog('length', value.length);
    if (minLength) {
        if (value.length < minLength) {
            showValidation(target, lbl + " must be at least " + minLength + " characters", form);
            return false;
        }
    }
    if (maxLength) {
        flog('check max length: ' + (value.length > maxLength));
        if (value.length > maxLength) {
            showValidation(target, lbl + " must be no more then " + maxLength + " characters", form);
            return false;
        } else {
            flog('check max length ok: ' + (value.length > maxLength));
        }

    }
    return true;
}

function checkExactLength(target, length) {
    target = ensureObject(target);
    var value = target.val();
    if (value.length != length) {
        showValidation(target, "Must be at " + length + " characters");
        return false;
    }
    return true;
}



// Passes if one of the targets has a non-empty value
function checkOneOf(target1, target2, message) {
    target1 = ensureObject(target1);
    target2 = ensureObject(target2);
    if (target1.val() || target2.val()) {
        return true;
    } else {
        showValidation(target1, message);
        return false
    }
}


// Passes if target's value is either empty or a number. Spaces etc are not allowed
function checkNumeric(target, form) {
    if (typeof target == "string") {
        target = $("#" + target);
    }
    var n = target.val();
    if (n) {
        if (!isNumber(n)) {
            showValidation(target, "Please enter only numeric digits", form);
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}


function checkTrue(target, message, form) {
    var n = $("#" + target + ":checked").val();
    if (n) {
        return true;
    } else {
        showValidation($("label[for='" + target + "']"), message, form);
        return false;
    }
}

/**
 * target can be id or a jquery object
 * text is the text to display
 */
function showValidation(target, text, form) {
    if (text) {
        flog("showValidation", target, text, form);
        showMessage(text, form);
        if (target) {
            var t = ensureObject(target);
            showErrorField(t);
        }
    }
}

function showMessage(text, form) {
    var messages = $(".pageMessage, .alert", form);
    if (messages.length === 0) {
        messages = $("<div class='pageMessage alert alert-error alert-danger'><a class='close' data-dismiss='alert' href='#'>&times;</a></div>");
        form.prepend(messages);
    }
    flog("showMessage", messages);
    messages.append("<p class='validationError'>" + text + "</p>");
    messages.show(500);
}

function showErrorField(target) {
    flog("showErrorField", target);
    target.addClass("errorField");
    target.closest(".form-group").addClass("has-error"); // for bootstrap3
    target.closest(".control-group").addClass("error"); // for bootstrap2
    if (typeof CKEDITOR != 'undefined') {
        if (CKEDITOR) {
            flog("check for editor1", target);
            var name = target.attr("name");
            if (!name) {
                name = target.attr("id");
            }
            editor = CKEDITOR.instances[name];
            flog("check for editor", name, editor);
            if (editor) {
                flog("add class", editor.form);
                editor.form.addClass("errorField");
            }
        }
    }
}

/*
 Password Validator 0.1
 (c) 2007 Steven Levithan <stevenlevithan.com>
 MIT License
 */

function validatePassword(pw, options) {
    // default options (allows any password)
    var o = {
        lower: 0,
        upper: 0,
        alpha: 0, /* lower + upper */
        numeric: 0,
        special: 0,
        length: [0, Infinity],
        custom: [/* regexes and/or functions */],
        badWords: [],
        badSequenceLength: 0,
        noQwertySequences: false,
        noSequential: false
    };

    for (var property in options) {
        o[property] = options[property];
    }

    var re = {
        lower: /[a-z]/g,
        upper: /[A-Z]/g,
        alpha: /[A-Z]/gi,
        numeric: /[0-9]/g,
        special: /[\W_]/g
    },
    rule, i;

    // enforce min/max length
    if (pw.length < o.length[0] || pw.length > o.length[1])
        return false;

    // enforce lower/upper/alpha/numeric/special rules
    for (rule in re) {
        if ((pw.match(re[rule]) || []).length < o[rule])
            return false;
    }

    // enforce word ban (case insensitive)
    for (i = 0; i < o.badWords.length; i++) {
        if (pw.toLowerCase().indexOf(o.badWords[i].toLowerCase()) > -1)
            return false;
    }

    // enforce the no sequential, identical characters rule
    if (o.noSequential && /([\S\s])\1/.test(pw))
        return false;

    // enforce alphanumeric/qwerty sequence ban rules
    if (o.badSequenceLength) {
        var lower = "abcdefghijklmnopqrstuvwxyz",
                upper = lower.toUpperCase(),
                numbers = "0123456789",
                qwerty = "qwertyuiopasdfghjklzxcvbnm",
                start = o.badSequenceLength - 1,
                seq = "_" + pw.slice(0, start);
        for (i = start; i < pw.length; i++) {
            seq = seq.slice(1) + pw.charAt(i);
            if (
                    lower.indexOf(seq) > -1 ||
                    upper.indexOf(seq) > -1 ||
                    numbers.indexOf(seq) > -1 ||
                    (o.noQwertySequences && qwerty.indexOf(seq) > -1)
                    ) {
                return false;
            }
        }
    }

    // enforce custom regex/function rules
    for (i = 0; i < o.custom.length; i++) {
        rule = o.custom[i];
        if (rule instanceof RegExp) {
            if (!rule.test(pw))
                return false;
        } else if (rule instanceof Function) {
            if (!rule(pw))
                return false;
        }
    }

    // great success!
    return true;
}

