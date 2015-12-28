/**
 *
 *  jquery.forms.js
 *  version: 1.1.0
 *
 *  Depends on common.js, moment.js
 */

(function ($) {
    flog('[jquery.forms] DEPRECATED options of 1.1.0 which will be removed 1.2.0:');
    flog('********************************************');
    flog('- "doPostForm" is DEPRECATED and removed. Use "allowPostForm" instead');
    flog('- "error" is DEPRECATED. Use "onInvalid" instead');
    flog('- "callback" is DEPRECATED. Use "onSuccess" instead');
    flog('- "errorHandler" is DEPRECATED. Use "onError" instead');
    flog('- "valiationMessageSelector" is DEPRECATED. Use "validationMessageSelector" instead');
    flog('********************************************');
    flog('- "showMessage" is removed. Use "showFormMessage" instead');
    flog('- "showValidation" is removed. Use "showFieldMessages" instead');
    flog('********************************************');

    /**
     * Configuration of jquery.forms
     * @param {String} [postUrl=null] Url which will post form data to. If null, will use 'action' attribute of form
     * @param {Function} validate Custom validation method. Arguments are 'form' and 'config'. 'form' is jQuery object form and 'config' is configuration of current form. Can return 'boolean' for result of validation or return object contains total error, list of error fields and list of error messages with format '{{error: Number, errorFields: Array, errorMessages: Array}}'
     * @param {Function} onValid Callback will be called when all fields are valid. Arguments are 'form' and 'config'. 'form' is jQuery object form and 'config' is configuration of current form
     * @param {Function} onInvalid Callback will be called when all fields are invalid. Arguments are 'form' and 'config'. 'form' is jQuery object form and 'config' is configuration of current form
     * @param {Boolean} [allowPostForm=true] Allow post form data via AJAX automatically or not
     * @param {Function} beforePostForm Callback will be called before posting form data to server. Arguments are 'form', 'config', 'data'. 'form' is jQuery object form, 'config' is configuration of current form and 'data' is form data. This callback MUST return the data for posting to server
     * @param {Function} onSuccess Callback will be called when post data form to server successfully. Arguments are 'resp', 'form' and 'config'. 'resp' is response data from server, 'form' is jQuery object form and 'config' is configuration of current form
     * @param {Function} onError Callback will be called when post data form to server failed. Arguments are 'resp', 'form' and 'config'. 'resp' is response data from server, 'form' is jQuery object form and 'config' is configuration of current form
     * @param {String} [confirmMessage=null] The confirmation message after posting data fom to server successfully
     * @param {Numeric} [confirmMessageDuration=5000] The displaying time of confirm message before it's hidden
     * @param {String|Function} validationMessageSelector Selector of validation message. It's can be function which will return jQuery object of validation message
     * @param {String} networkErrorMessage The error network message
     * @param {String} emailErrorMessage The error message when email fields are invalid
     * @param {String} requiredErrorMessage The error message when required fields are invalid
     * @param {String} dateErrorMessage The error message when date fields are invalid
     * @param {String} passwordErrorMessage The error message when password fields are invalid
     * @param {String} confirmPasswordErrorMessage The error message when confirmPassword fields are invalid
     * @param {String} simpleCharsErrorMessage The error message when simpleChars fields are invalid
     * @param {String} numericErrorMessage The error message when numeric fields are invalid
     * @param {String} urlErrorMessage The error message when url fields are invalid
     * @param {Numeric} [animationDuration=300] The speed of all animations in jquery.forms
     * @param {Function} renderMessageWrapper The render method for message wrapper in jquery.forms. Arguments are 'messageContent' and 'type'. 'messageContent' is message content. 'type' can be 'danger', 'success', 'info' and 'warning'.
     * @param {Function} renderErrorMessage The render method for error messages in jquery.forms. Arguments are 'message'. 'message' is message content, can be string or array.
     */
    var DEFAULTS = {
        postUrl: null, // means to use the form action as url
        validate: function (form, config) {
            flog('[jquery.forms] Default validate of v1.1.0', form, config);

            return {
                error: 0,
                errorFields: [],
                errorMessages: []
            }
        },
        onValid: function (form, config) {
            flog('[jquery.forms] Default onValid of v1.1.0', form, config);
        },
        onInvalid: function (form, config) {
            flog('[jquery.forms] Default onInvalid of v1.1.0', form, config);
        },
        allowPostForm: true,
        beforePostForm: function (form, config, data) {
            flog('[jquery.forms] Default beforePostForm of v1.1.0', form, config, data);

            return data;
        },
        onSuccess: function (resp, form, config) {
            flog('[jquery.forms] Default onSuccess of v1.1.0', resp, form, config);
        },
        onError: function (resp, form, config) {
            try {
                flog('[jquery.forms] Status indicates failure', resp);

                if (resp) {
                    if (resp.messages && resp.messages.length > 0) {
                        showErrorMessage(form, config, resp.messages);
                    } else {
                        showErrorMessage(form, config, 'Sorry, we could not process your request');
                    }

                    showFieldMessages(resp.fieldMessages, form, config);
                } else {
                    showErrorMessage(form, config, 'Sorry, we could not process your request');
                }
            } catch (e) {
                flog('[jquery.forms] Error!', e);
            }
        },
        confirmMessage: null,
        confirmMessageDuration: 5000,
        validationMessageSelector: '.form-message',
        networkErrorMessage: 'Sorry, there appears to be a problem with the network or server. Please check your internet connection. If you\'re connected ok this might be a glitch in the system.',
        emailErrorMessage: 'Please check the format of your email address, it should read like ben@somewhere.com',
        requiredErrorMessage: 'Please enter all required fields',
        dateErrorMessage: 'Please enter valid date',
        passwordErrorMessage: 'Your password must be at least 6 characters and it must contain numbers and letters',
        confirmPasswordErrorMessage: 'Please confirm your password',
        simpleCharsErrorMessage: 'Please use only letters, numbers and underscores',
        numericErrorMessage: 'Please enter digits',
        hrefErrorMessage: 'Please enter valid website address',
        animationDuration: 150,
        renderMessageWrapper: function (messageContent, type) {
            return '<div class="form-message alert alert-' + type + '" style="display: none"><a class="close" data-dismiss="alert">&times;</a>' + messageContent + '</div>';
        },
        renderErrorMessage: function (message) {
            if (typeof message === 'string') {
                message = [message];
            }

            var htmlMessages = '';
            for (var i = 0; i < message.length; i++) {
                htmlMessages += '<li>' + message[i] + '</li>';
            }

            return '<ul class="error-message">' + htmlMessages + '</ul>';
        }
    };

    var methods = {
        init: function (options) {
            return $(this).each(function () {
                var form = $(this);
                var config = $.extend({}, DEFAULTS, options);
                flog('[jquery.forms] Configuration:', config);

                // ==============================================================================
                // Start of DEPRECATED migration
                // ==============================================================================
                if (typeof config.callback === 'function') {
                    config.onSuccess = config.callback;
                }

                if (typeof config.error === 'function') {
                    config.onInvalid = config.error;
                }

                if (typeof config.errorHandler === 'function') {
                    config.onError = config.errorHandler;
                }

                if (typeof config.valiationMessageSelector === 'string') {
                    config.validationMessageSelector = config.valiationMessageSelector;
                }
                // ==============================================================================
                // End of DEPRECATED migration
                // ==============================================================================

                if (form.data('formOptions')) {
                    flog('[jquery.forms] Is ready initialized');
                    return;
                } else {
                    // Add config to 'formOptions' data
                    form.data('formOptions', config);
                }

                $.getScriptOnce('/static/js/moment-with-langs.min.js');
                flog('[jquery.forms] Initializing forms plugin...', form);

                form.off('submit').on('submit', function (e) {
                    e.preventDefault();

                    flog('[jquery.forms] On form submit', form, e);
                    resetValidation(form, config);

                    form.find('input[type=text]').each(function () {
                        var input = $(this);
                        var val = input.val().trim();

                        input.val(val);
                    });

                    var isValid = validateFormFields(form, config);
                    flog('[jquery.forms] Form is valid: ' + isValid);

                    if (isValid) {
                        if (typeof config.onValid === 'function') {
                            config.onValid.call(this, form, config);
                        }

                        if (config.allowPostForm === true) {
                            doPostForm(form, config, e);
                        }
                    } else {
                        var alertMsg = getValidationMessage(form, config);
                        if (alertMsg.length > 0) {
                            $('body, html').animate({
                                scrollTop: alertMsg.offset().top - 140
                            }, config.animationDuration);
                        }

                        if (typeof config.onInvalid === 'function') {
                            config.onInvalid.call(this, form, config);
                        }
                    }
                });
            });
        },
        getOptions: function () {
            return $(this).data('formOptions');
        },
        getDefaultOptions: function () {
            return $.extend({}, DEFAULTS);
        },
        disable: function (callback) {
            return $(this).each(function () {
                var form = $(this);
                form.find('input, button, select, textarea').prop('disabled', true);

                if (typeof callback === 'function') {
                    callback.call(this, form);
                }
            });
        },
        enable: function (callback) {
            return $(this).each(function () {
                var form = $(this);
                form.find('input, button, select, textarea').prop('disabled', false);

                if (typeof callback === 'function') {
                    callback.call(this, form);
                }
            });
        },
        showElement: function (element, options, callback) {
            return $(this).each(function () {
                var form = $(this);
                var config = form.forms('getOptions');
                options = $.extend({}, {
                    'opacity': 1,
                    'height': 'show'
                }, options);

                element.stop().animate(options, config.animationDuration, callback);
            });
        },
        hideElement: function (element, options, callback) {
            return $(this).each(function () {
                var form = $(this);
                var config = form.forms('getOptions');
                options = $.extend({}, {
                    'opacity': 0,
                    'height': 'hide'
                }, options);

                element.stop().animate(options, config.animationDuration, callback);
            });
        }
    };

    $.fn.forms = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('[jquery.forms] Method ' + method + ' does not exist on jquery.forms');
        }
    };

    // Version for jquery.forms
    $.fn.forms.version = '1.1.0';

})(jQuery);

/**
 * Get validation message
 * @param {jQuery} form
 * @param {Object} config
 * @returns {jQuery}
 */
function getValidationMessage(form, config) {
    if (config && config.validationMessageSelector) {
        if (typeof config.validationMessageSelector === 'string') {
            return form.find(config.validationMessageSelector);
        } else if (typeof config.validationMessageSelector === 'object' && config.validationMessageSelector.jquery) {
            return config.validationMessageSelector;
        } else {
            return $('');
        }
    } else {
        return $('');
    }
}

/**
 * Post all form data to Kademi server
 * @param {jQuery} form
 * @param {Object} config
 * @param {Object} event - optional, the event which caused the submit
 */
function doPostForm(form, config, event) {
    // Trim all inputs
    var enc = form.attr('enctype');
    flog('[jquery.forms] Preparing doPostForm...', 'enctype: ' + enc, form);

    var data;
    if (enc == 'multipart/form-data') {
        data = form.serializeWithFiles();
    } else {
        data = form.serialize();
    }
    flog('[jquery.forms] Data:', data);

    if (typeof config.beforePostForm === 'function') {
        data = config.beforePostForm.call(this, form, config, data);
    }

    var url = form.attr('action');
    if (config.postUrl) {
        flog('[jquery.forms] Use supplied postUrl instead of form action', config.postUrl);
        url = config.postUrl;
    }
    if (!url) {
        flog('[jquery.forms] Url is empty. Will use "window.location.pathname" for posting');
        url = window.location.pathname;
    }
    flog('[jquery.forms] doPostForm', form, data, url);

    try {
        form.forms('disable');
        form.addClass('ajax-processing');

        var ajaxOpts = {
            type: 'POST',
            url: url,
            data: data,
            dataType: 'JSON',
            success: function (resp) {
                form.forms('enable');
                form.removeClass('ajax-processing');

                if (resp && resp.status) {
                    flog('[jquery.forms] Post form successfully', resp)

                    if (config.confirmMessage) {
                        showConfirmMessage(form, config);
                    }

                    if (typeof config.onSuccess === 'function') {
                        config.onSuccess.call(this, resp, form, config, event);
                    }
                } else {
                    flog('[jquery.forms] Posting form failed', resp)

                    if (typeof config.onError === 'function') {
                        config.onError.call(this, resp, form, config);
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                form.forms('enable');
                form.removeClass('ajax-processing');

                flog('[jquery.forms] Error on posting form', form, jqXHR, textStatus, errorThrown);

                if (typeof config.onError === 'function') {
                    config.onError.call(this, jqXHR, form, config);
                }

                if (config.networkErrorMessage) {
                    showErrorMessage(form, config, config.networkErrorMessage + ' - ' + textStatus);
                }
            }
        };
        if (enc == 'multipart/form-data') {
            ajaxOpts.processData = false;
            ajaxOpts.contentType = false;
        }
        ajaxOpts.beforeSend = function (xhr, options) { // et toc !
            options.data = data;

            /**
             * You can use https://github.com/francois2metz/html5-formdata for a fake FormData object
             * Only work with Firefox 3.6
             */
            if (data.fake) {
                xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + data.boundary);
                // with fake FormData object, we must use sendAsBinary
                xhr.send = function (data) {
                    xhr.sendAsBinary(data.toString());
                }
            }
        }

        $.ajax(ajaxOpts);
    } catch (e) {
        if (typeof config.onError === 'function') {
            config.onError.call(this, null, form, config);
        } else {
            flog('exception submitting form', e);
            alert('Sorry, an error occured attempting to submit the form. Please contact the site administrator');
        }
    }
}

/**
 * Show form message with specified type
 * @param {jQuery} form
 * @param {Object} config
 * @param {String} message
 * @param {String} title
 * @param {String} type
 * @param {Function} callback
 */
function showFormMessage(form, config, message, title, type, callback) {
    var alertMsg = getValidationMessage(form, config);
    if (alertMsg.length === 0) {
        alertMsg = $(config.renderMessageWrapper(message, type));
        form.prepend(alertMsg);
    } else {
        alertMsg.append(message);
        alertMsg.attr('class', 'form-message alert alert-' + type);
    }

    if (title) {
        var messageTitle = alertMsg.find('.form-message-title');
        if (messageTitle.length === 0) {
            alertMsg.prepend('<p class="form-message-title"><b>' + title + '</b></p>');
        } else {
            messageTitle.html(title);
        }
    }

    if (alertMsg.is(':hidden')) {
        form.forms('showElement', alertMsg);
    }

    if (typeof callback === 'function') {
        callback.call(this, form, config, message, type);
    }
}
/**
 * Show error message
 * @param {jQuery} form
 * @param {Object} config
 * @param {String} message
 */
function showErrorMessage(form, config, message) {
    var messageHtml = config.renderErrorMessage(message);

    showFormMessage(form, config, messageHtml, 'Errors', 'danger', null);
}

/**
 * Show confirmation message after post form successfully
 * @param {jQuery} form
 * @param {Object} config
 */
function showConfirmMessage(form, config) {
    showFormMessage(form, config, config.confirmMessage, null, 'success', function () {
        window.setTimeout(function () {
            var alertMsg = getValidationMessage(form, config);
            form.forms('hideElement', alertMsg)
        }, config.confirmMessageDuration);
    });
}

/**
 * Show error fields with messages
 * @param {Array} fieldMessages
 * @param {jQuery} form
 * @param {Object} config
 */
function showFieldMessages(fieldMessages, form, config) {
    if (fieldMessages && fieldMessages.length > 0 && fieldMessages[0].length > 0) {
        $.each(fieldMessages, function (i, message) {
            flog('[jquery.forms] Show field message', message);

            var target = $('#' + message.field);
            var parent = target.parent();

            var errorMessage = parent.find('.help-block.error-message');
            if (errorMessage.length > 0) {
                errorMessage.html(message.message);
            } else {
                parent.append(
                    '<p class="help-block error-message">' + message.message + '</p>'
                );
            }

            showErrorField(target);
        });
    }
}

/**
 * Clear all error messages and remove all error classes
 * @param {jQuery} form
 * @param {Object} config
 */
function resetValidation(form, config) {
    form.find('.form-group').removeClass('has-error');
    form.find('.error-field').removeClass('error-field').removeAttr('error-message');
    form.find('.error-message').remove();
    form.find('.form-message-title').remove();

    var alertMsg = getValidationMessage(form, config);
    if (alertMsg.length > 0) {
        form.forms('hideElement', alertMsg, {}, function () {
            alertMsg.html('');
        });
    }
}

/**
 * Validate all form fields
 * @param {jQuery} form
 * @param {Object} config
 * @returns {Boolean}
 */
function validateFormFields(form, config) {
    var resultRequired = checkRequiredFields(form, config);
    if (resultRequired.error > 0) {
        for (var i = 0; i < resultRequired.errorFields.length; i++) {
            var errorField = resultRequired.errorFields[i];
            showErrorField(errorField);
        }

        showErrorMessage(form, config, config.requiredErrorMessage);

        return false;
    } else {
        var error = 0;
        var errorFields = [];
        var errorMessages = [];

        var resultEmails = checkValidEmailAddress(form, config);
        if (resultEmails.error > 0) {
            error += resultEmails.error;
            errorFields = errorFields.concat(resultEmails.errorFields);
            errorMessages.push(config.emailErrorMessage);
        }

        var resultDates = checkDates(form, config);
        if (resultDates.error > 0) {
            error += resultDates.error;
            errorFields = errorFields.concat(resultDates.errorFields);
            errorMessages.push(config.dateErrorMessage);
        }

        var resultPasswords = checkValidPasswords(form, config);
        if (!resultPasswords.password || !resultPasswords.confirmPassword) {
            error++;
            errorFields = errorFields.concat(resultPasswords.errorFields);

            if (!resultPasswords.password) {
                errorMessages.push(config.passwordErrorMessage);
            } else if (!resultPasswords.confirmPassword) {
                errorMessages.push(config.confirmPasswordErrorMessage);
            }
        }

        var resultSimpleChars = checkSimpleChars(form, config);
        if (resultSimpleChars.error > 0) {
            error += resultSimpleChars.error;
            errorFields = errorFields.concat(resultSimpleChars.errorFields);
            errorMessages.push(config.simpleCharsErrorMessage);
        }

        var resultHrefs = checkHrefs(form, config);
        if (resultHrefs.error > 0) {
            error += resultHrefs.error;
            errorFields = errorFields.concat(resultHrefs.errorFields);
            errorMessages.push(config.hrefErrorMessage);
        }

        var resultNumerics = checkNumerics(form, config);
        if (resultNumerics.error > 0) {
            error += resultNumerics.error;
            errorFields = errorFields.concat(resultNumerics.errorFields);
            errorMessages.push(config.numericErrorMessage);
        }

        var resultRegexes = checkRegexes(form, config);
        if (resultRegexes.error > 0) {
            error += resultRegexes.error;
            errorFields = errorFields.concat(resultRegexes.errorFields);
            errorMessages = errorMessages.concat(resultRegexes.errorMessages);
        }

        if (typeof config.validate === 'function') {
            var resultCustomValidate = config.validate.call(this, form, config);
            flog('[jquery.forms] Validate method return: ' + resultCustomValidate);

            if (typeof resultCustomValidate === 'boolean') {
                if (!resultCustomValidate) {
                    error++;
                }
            } else {
                if (resultCustomValidate && resultCustomValidate.error) {
                    if (resultCustomValidate.error > 0) {
                        error += resultCustomValidate.error;

                        if ($.isArray(resultCustomValidate.errorFields)) {
                            errorFields = errorFields.concat(resultCustomValidate.errorFields);
                        }

                        if ($.isArray(resultCustomValidate.errorMessages)) {
                            errorMessages = errorMessages.concat(resultCustomValidate.errorMessages);
                        }
                    }
                }
            }
        }

        if (error > 0) {
            showErrorMessage(form, config, errorMessages);
            for (var i = 0; i < errorFields.length; i++) {
                var errorField = errorFields[i];
                showErrorField(errorField);
            }

            return false;
        } else {
            return true;
        }
    }
}

/**
 * Check required checkboxes
 * @param {jQuery} form
 * @param {Object} config
 * @returns {{error: Number, errorFields: Array}}
 */
function checkRequiredCheckboxes(form, config) {
    var error = 0;
    var errorFields = [];

    form.find('input.required:checkbox').not(':checked').each(function () {
        var input = $(this);
        flog('[jquery.forms] Field is required', input);

        errorFields.push(input);
        error++;
        input.attr('error-message', config.requiredErrorMessage);
    });

    return {
        error: error,
        errorFields: errorFields
    };
}

/**
 * Check required radio buttons
 * @param {jQuery} form
 * @param {Object} config
 * @returns {{error: Number, errorFields: Array}}
 */
function checkRequiredRadios(form, config) {
    var error = 0;
    var errorFields = [];
    var radioNames = {};

    form.find('input.required:radio').each(function () {
        var input = $(this);
        var name = input.attr('name');

        if (!radioNames[name]) {
            radioNames[name] = input;
        }
    });

    for (var name in radioNames) {
        var radios = form.find('input[name=' + name + ']');
        flog('[jquery.forms] Radio name: ' + name, radios);

        var checked = radios.filter(':checked');
        flog('[jquery.forms] Radio checked:', checked);

        if (checked.length === 0) {
            flog('[jquery.forms] Fields are required', radios);
            errorFields.push(radios);
            error++;
            radios.attr('error-message', config.requiredErrorMessage);
        }
    }

    return {
        error: error,
        errorFields: errorFields
    };
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

/**
 * Check required fields
 * @param {jQuery} form
 * @param {Object} config
 * @returns {{error: Number, errorFields: Array}}
 */
function checkRequiredFields(form, config) {
    flog('[jquery.forms] checkRequiredFields', form);
    var error = 0;
    var errorFields = [];

    var resultRadios = checkRequiredRadios(form, config);
    if (resultRadios.error > 0) {
        flog('[jquery.forms] checkRequiredRadios is false');
        errorFields = errorFields.concat(resultRadios.errorFields);
        error++;
    }

    var resultCheckboxes = checkRequiredCheckboxes(form, config);
    if (resultCheckboxes.error > 0) {
        flog('[jquery.forms] checkRequiredCheckboxes is false');
        errorFields = errorFields.concat(resultCheckboxes.errorFields);
        error++;
    }

    // Exclude tt-hint, that is a field created by the typeahead plugin which copies the required class
    form.find('.required').not('.tt-hint').each(function () {
        var input = $(this);
        var val = input.val();
        if (val !== null) {
            val = val.trim();
        } else {
            val = '';
        }

        var placeholder = input.attr('placeholder');
        // note that the watermark can make the value == title
        if (val.length === 0 || val === placeholder) {
            flog('[jquery.forms] Field is required', input);

            errorFields.push(input);
            error++;
            input.attr('error-message', config.requiredErrorMessage);
        }
    });

    return {
        error: error,
        errorFields: errorFields
    };
}

/**
 * Check regex fields
 * @param {jQuery} form
 * @param {Object} config
 * @returns {{error: Number, errorFields: Array, errorMessages: Array}}
 */
function checkRegexes(form, config) {
    var error = 0;
    var errorFields = [];
    var errorMessages = [];

    form.find('input.regex').each(function () {
        var input = $(this);
        var shouldCheck = shouldCheckValue(input);

        if (shouldCheck) {
            var val = input.val();
            var regexStr = input.attr('data-regex');
            var regex = new RegExp(regexStr);
            var message = input.attr('data-message');

            if (!regex.test(val)) {
                flog('[jquery.forms] Regex field is invalid: ' + regexStr, input);

                errorFields.push(input);
                if ($.inArray(message, errorMessages) === -1) {
                    errorMessages.push(message);
                }
                error++;
                input.attr('error-message', message);
            }
        }
    });

    return {
        error: error,
        errorFields: errorFields,
        errorMessages: errorMessages
    };
}

/**
 * Input should be check value or not?
 * @param {jQuery} input
 * @returns {Boolean}
 */
function shouldCheckValue(input) {
    var shouldCheck = false;
    var isRequiredIf = input.hasClass('required-if');
    var isRequiredIfShown = input.hasClass('required-if-shown');

    if (isRequiredIf) {
        var val = input.val().trim();
        if (val.length > 0) {
            shouldCheck = true;
        }
    } else if (isRequiredIfShown) {
        var isShown = input.is(':visible');
        if (isShown) {
            shouldCheck = true;
        }
    } else {
        shouldCheck = true;
    }

    return shouldCheck;
}

/**
 * Check date input
 * @depends: common.js, moment.js
 * @param {jQuery} form
 * @param {Object} config
 * @returns {{error: Number, errorFields: Array}}
 */
function checkDates(form, config) {
    var error = 0;
    var errorFields = [];

    form.find('input.date, input.datetime').each(function () {
        var input = $(this);
        var shouldCheck = shouldCheckValue(input);

        if (shouldCheck) {
            var val = input.val().trim();
            var valid = moment(val, ['DD-MM-YYYY', 'DD-MM-YYYY HH:mm'], true);

            if (val.length === 0 || !valid) {
                flog('[jquery.forms] Date field is invalid', input);

                errorFields.push(input);
                error++;
                input.attr('error-message', config.dateErrorMessage);
            }
        }
    });

    return {
        error: error,
        errorFields: errorFields
    };
}

/**
 * Check password fields
 * @param {jQuery} form
 * @param {Object} config
 * @returns {{password: Boolean, confirmPassword: Boolean, errorFields: Array}}
 */
function checkValidPasswords(form, config) {
    var input = form.find('input#password, input.password');

    if (input.length > 0) {
        var value = input.val();

        if (value.length > 0) {
            var passed = true;
            if (!input.hasClass('allow-dodgy-password')) {
                passed = validatePassword(value, {
                    length: [6, Infinity],
                    alpha: 1,
                    numeric: 1,
                    badWords: [],
                    badSequenceLength: 6
                });
            }

            if (!passed) {
                flog('[jquery.forms] Password field is invalid');
                input.attr('error-message', config.passwordErrorMessage);

                return {
                    password: false,
                    confirmPassword: false,
                    errorFields: [input]
                };
            } else {
                return checkPasswordsMatch(form, config, input);
            }
        } else {
            flog('[jquery.forms] Password field is invalid');
            input.attr('error-message', config.passwordErrorMessage);

            return {
                password: false,
                confirmPassword: false,
                errorFields: [input]
            };
        }
    } else {
        return {
            password: true,
            confirmPassword: true,
            errorFields: []
        }
    }
}

/**
 * Check confirm password
 * @param {jQuery} form
 * @param {Object} config
 * @param {jQuery} passwordInputs
 * @returns {{password: Boolean, confirmPassword: Boolean, errorFields: Array}}
 */
function checkPasswordsMatch(form, config, passwordInputs) {
    var confirmPasswordInputs = form.find('input#confirmPassword, input.confirm-password');

    if (confirmPasswordInputs.length === 0) {
        flog('[jquery.forms] There is no confirmation password field');

        return {
            password: true,
            confirmPassword: true,
            errorFields: []
        };
    }

    var password = passwordInputs.val();
    var confirmPassword = confirmPasswordInputs.val();

    if (password !== confirmPassword) {
        flog('[jquery.forms] Confirm password is not matched');
        confirmPasswordInputs.attr('error-message', config.confirmPasswordErrorMessage);

        return {
            password: true,
            confirmPassword: false,
            errorFields: [
                confirmPasswordInputs
            ]
        };
    }

    return {
        password: true,
        confirmPassword: true,
        errorFields: []
    };
}

/**
 * Check email inputs which has id or class is 'email'
 * @depends: common.js, moment.js
 * @param {jQuery} form
 * @param {Object} config
 * @returns {{error: Number, errorFields: Array}}
 */
function checkValidEmailAddress(form, config) {
    var error = 0;
    var errorFields = [];
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-'']+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

    form.find('#email, input.email').each(function () {
        var input = $(this);
        var shouldCheck = shouldCheckValue(input);

        if (shouldCheck) {
            var val = input.val();

            if (val.length === 0 || !pattern.test(val)) {
                flog('[jquery.forms] Email field is invalid', input);

                errorFields.push(input);
                error++;
                input.attr('error-message', config.emailErrorMessage);
            }
        }
    });

    return {
        error: error,
        errorFields: errorFields
    };
}

/**
 * Check simple characters fields
 * @param {jQuery} form
 * @param {Object} config
 * @returns {{error: Number, errorFields: Array}}
 */
function checkSimpleChars(form, config) {
    var error = 0;
    var errorFields = [];
    var simpleCharsPattern = /^[a-zA-Z0-9_]+$/;

    form.find('.simpleChars, .simple-chars, .reallySimpleChars, .really-simple-chars').each(function () {
        var input = $(this);
        var shouldCheck = shouldCheckValue(input);

        if (shouldCheck) {
            var val = input.val();

            if (val.length === 0 || !simpleCharsPattern.test(val)) {
                flog('[jquery.forms] Simple chars field is invalid', input);

                errorFields.push(input);
                error++;
                input.attr('error-message', config.simpleCharsErrorMessage);
            }
        }
    });

    return {
        error: error,
        errorFields: errorFields
    };
}

/**
 * Check numeric fields
 * @param {jQuery} form
 * @param {Object} config
 * @returns {{error: Number, errorFields: Array}}
 */
function checkNumerics(form, config) {
    var error = 0;
    var errorFields = [];

    form.find('input.numeric').each(function () {
        var input = $(this);
        var shouldCheck = shouldCheckValue(input);

        if (shouldCheck) {
            var val = input.val();

            if (val.length === 0 || !isNumber(val)) {
                flog('[jquery.forms] Numeric field is invalid', input);

                errorFields.push(input);
                error++;
                input.attr('error-message', config.numericErrorMessage);
            }
        }
    });

    return {
        error: error,
        errorFields: errorFields
    };
}

/**
 * Check hrefs fields
 * @param {jQuery} form
 * @param {Object} config
 * @returns {{error: Number, errorFields: Array}}
 */
function checkHrefs(form, config) {
    var error = 0;
    var errorFields = [];
    var pattern = new RegExp('^[a-zA-Z0-9_/%:/./-]+$');

    form.find('input.href').each(function () {
        var input = $(this);
        var shouldCheck = shouldCheckValue(input);

        if (shouldCheck) {
            var val = input.val();

            if (val.length === 0 || !pattern.test(val)) {
                flog('[jquery.forms] Href field is invalid', input);

                errorFields.push(input);
                error++;
                input.attr('error-message', config.hrefErrorMessage);
            }
        }
    });

    return {
        error: error,
        errorFields: errorFields
    };
}

/**
 * Show error field
 * @param {jQuery} target
 */
function showErrorField(target) {
    flog('[jquery.forms] showErrorField', target);

    target.addClass('error-field');
    target.closest('.form-group').addClass('has-error');

    if (typeof CKEDITOR !== 'undefined') {
        if (CKEDITOR) {
            var name = target.attr('name');
            if (!name) {
                name = target.attr('id');
            }

            editor = CKEDITOR.instances[name];
            flog('[jquery.forms] Check for CKEditor', name, editor);

            if (editor) {
                flog('[jquery.forms] Add "error-field" class', editor.form);
                editor.form.addClass('error-field');
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
    };
    var rule;
    var i;

    // enforce min/max length
    if (pw.length < o.length[0] || pw.length > o.length[1]) {
        return false;
    }

    // enforce lower/upper/alpha/numeric/special rules
    for (rule in re) {
        if ((pw.match(re[rule]) || []).length < o[rule]) {
            return false;
        }
    }

    // enforce word ban (case insensitive)
    for (i = 0; i < o.badWords.length; i++) {
        if (pw.toLowerCase().indexOf(o.badWords[i].toLowerCase()) > -1) {
            return false;
        }
    }

    // enforce the no sequential, identical characters rule
    if (o.noSequential && /([\S\s])\1/.test(pw)) {
        return false;
    }

    // enforce alphanumeric/qwerty sequence ban rules
    if (o.badSequenceLength) {
        var lower = 'abcdefghijklmnopqrstuvwxyz';
        var upper = lower.toUpperCase();
        var numbers = '0123456789';
        var qwerty = 'qwertyuiopasdfghjklzxcvbnm';
        var start = o.badSequenceLength - 1;
        var seq = '_' + pw.slice(0, start);

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
            if (!rule.test(pw)) {
                return false;
            }
        } else if (rule instanceof Function) {
            if (!rule(pw)) {
                return false;
            }
        }
    }

    // great success!
    return true;
}

// http://stackoverflow.com/questions/5392344/sending-multipart-formdata-with-jquery-ajax
(function ($) {
    $.fn.serializeWithFiles = function () {
        var form = $(this);

        flog('[jquery.forms] Initializing serializeWithFiles...', form);

        // ADD FILE TO PARAM AJAX
        var formData = new FormData()
        form.find('input[type=file]').each(function (index, input) {
            $.each(input.files, function (i, file) {
                formData.append(input.name, file);
            });
        });

        var params = form.serializeArray();
        $.each(params, function (i, val) {
            formData.append(val.name, val.value);
        });

        return formData;
    };

})(jQuery);

/**
 * Emulate FormData for some browsers
 * MIT License
 * (c) 2010 François de Metz
 */
(function (w) {
    if (w.FormData) {
        return;
    }

    function FormData() {
        this.fake = true;
        this.boundary = '--------FormData' + Math.random();
        this._fields = [];
    }

    FormData.prototype.append = function (key, value) {
        this._fields.push([key, value]);
    };

    FormData.prototype.toString = function () {
        var boundary = this.boundary;
        var body = '';
        this._fields.forEach(function (field) {
            body += '--' + boundary + '\r\n';
            // file upload
            if (field[1].name) {
                var file = field[1];
                body += 'Content-Disposition: form-data; name=\'' + field[0] + '\'; filename=\'' + file.name + '\'\r\n';
                body += 'Content-Type: ' + file.type + '\r\n\r\n';
                body += file.getAsBinary() + '\r\n';
            } else {
                body += 'Content-Disposition: form-data; name=\'' + field[0] + '\';\r\n\r\n';
                body += field[1] + '\r\n';
            }
        });
        body += '--' + boundary + '--';
        return body;
    };

    w.FormData = FormData;

})(window);
