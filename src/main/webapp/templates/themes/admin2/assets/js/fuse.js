/**
 * Disable/enable form controls
 * @method disable
 * @param {Boolean} disable Be disabled or enabled
 * @return {jQuery} The disabled/enabled control
 */
$.fn.disable = function (disable) {
    return this.each(function () {
        this.disabled = disable;
    });
};

/**
 * Check/uncheck form controls
 * @method check
 * @param {Boolean} check Be checked or unchecked
 * @return {jQuery} The checked/unchecked control
 */
$.fn.check = function (check) {
    return this.each(function () {
        this.checked = check;
    });
};

/**
 * Make input be focused and set caret at end of value
 * @method focusAtEnd
 */
$.fn.focusAtEnd = function () {
    var value = this.val();

    return this.val('').focus().val(value);
};

/**
 * Check value or innerHTML of element is empty or not
 * @method isEmpty
 * @return {Boolean}
 */
$.fn.isEmpty = function () {
    return this[0].value === undefined ? this.text().trim() === '' : this[0].value.trim() === '';
};

/**
 * Check the available/existing of a object, if object is existing, the callback will be run
 * @method exist
 * @param {Function} callback_when_exist The callback is called when object is existed
 * @param {Function} callback_when_no_exist The callback is called when object is not existed
 * @return {jQuery}
 */
$.fn.exist = function (callback_when_exist, callback_when_no_exist) {
    if (this.length > 0) {
        if (typeof callback_when_exist === 'function') {
            callback_when_exist.call(this);
        }
    } else {
        if (typeof callback_when_no_exist === 'function') {
            callback_when_no_exist.call(this);
        }
    }
    return this;
};

function initToggled() {
    flog('initToggled');

    $('[data-toggled=display]').exist(function () {
        this.each(function () {
            var panel = $(this);
            var actor = $(panel.attr('data-actor'));
            var checkActor = function () {
                if (actor.is(':checked')) {
                    panel.show();
                    actor.trigger('checked.toggled', panel);
                } else {
                    panel.hide();
                    actor.trigger('unchecked.toggled', panel);
                }
            };

            actor.addClass('toggler');

            actor.on('click', function () {
                checkActor();
            });
            setTimeout(function () {
                checkActor();
            }, 100);
        });
    });
}

function doMasonryPanel() {
    flog('doMasonryPanel');

    $('.masonry-panel').each(function () {
        var panel = $(this);

        // Bind event listener
        panel.on('layoutComplete', function () {
            var items = panel.find(".masonry-item");

            flog("onlayout", items);

            items.animate({
                opacity: 1,
            }, 1000, function () {
                flog("complete");
            });
        });

        panel.masonry({
            columnWidth: ".masonry-sizer",
            percentPosition: true
        });
    });
}

function initMasonryPanel() {
    flog('initMasonryPanel');

    if (typeof window.Masonry === 'function') {
        doMasonryPanel();
    } else {
        $.getScriptOnce('/static/masonry/3.3.2/masonry.pkgd.min.js', function () {
            doMasonryPanel();
        });
    }
}

function initDatePicker() {
    flog('initDatePicker');

    $('.date-picker').exist(function () {
        var datePicker = this;

        datePicker.datepicker({
            autoclose: true,
            format: 'DD/MM/YYYY'
        });

        var impactedTargetSelector = datePicker.attr('data-impacted');

        if (impactedTargetSelector) {
            var changedOption = datePicker.attr('data-impact') === 'startDate' ? 'StartDate' : 'EndDate';

            datePicker.on('changeDate', function (ev) {
                flog(ev);
                var impactedTarget = $(impactedTargetSelector);
                var dataDatePicker = impactedTarget.data('datepicker');
                dataDatePicker['set' + changedOption](ev.date);
            });
        }
    });

    $(document.body).on('click', '[data-role="date-picker-trigger"]', function (e) {
        e.preventDefault();

        var trigger = $(this);
        var datePickerId = trigger.attr('href');
        var datePicker = $(datePickerId);

        datePicker.datepicker('show');
    });

    $('.date-time-picker').exist(function () {
        flog('Found date-time-picker', this);
        var options = {};
        if (this.data('format')) {
            options.format = this.data('format');
        }
        this.datetimepicker(options);
    });
}


function initTabbable() {
    flog('initTabbable');

    $('.tabbable').exist(function () {
        this.each(function () {
            var wrapper = $(this);
            var tabHeader = wrapper.find('.nav-tabs');
            var links = tabHeader.find('a');
            var hash = window.location.hash;

            links.each(function () {
                var link = $(this);
                link.on('click', function (e) {
                    e.preventDefault();

                    window.location.hash = $(this).attr('href') + '-tab';
                });
            });

            if (hash === '') {
                links.eq(0).trigger('click');
            }
        });

        $(window).on('hashchange', function () {
            var hash = window.location.hash.replace('-tab', '');
            flog('hashchanged', hash);

            var tabbable = $('.tabbable .nav-tabs a[href="' + hash + '"]');
            tabbable.trigger('click');
        }).trigger('hashchange');
    });
}

function initChkAll() {
    flog('initChkAll');

    $('.chk-all').exist(function () {
        this.each(function () {
            var chkAll = $(this);

            chkAll.on('click', function () {
                var table = chkAll.parents('table');
                var chks = table.find('tbody input:checkbox');
                chks.prop('checked', chkAll.is(':checked'));
            });
        });
    });
}

function initClearer() {
    flog('initClearer');

    var body = $(document.body);

    body.on('click', '[data-type=clearer]', function (e) {
        e.preventDefault();

        var target = $($(this).data('target'));
        flog("clearer click", target);
        target.val('');
        target.trigger('change');
        target.trigger('keyup');
    });
}

function initTable() {
    flog('initTable');

    $('.table.table-data').exist(function () {
        this.each(function () {
            var dataTable = $(this);
            var cols = dataTable.find('colgroup col');
            var ths = dataTable.find('thead th');

            var aoColumnsSetting = [];
            cols.each(function (i) {
                var col = $(this);
                var th = ths.eq(i);

                aoColumnsSetting.push({
                    "bSortable": !th.hasClass('action') && col.attr('data-sort') !== 'false'
                });
            });

            dataTable.dataTable({
                "aoColumnDefs": [{
                    "aTargets": [0]
                }],
                "oLanguage": {
                    "sLengthMenu": "Show _MENU_ Rows",
                    "sSearch": "",
                    "oPaginate": {
                        "sPrevious": "",
                        "sNext": ""
                    }
                },
                "aaSorting": [
                    [1, 'asc']
                ],
                "aoColumns": aoColumnsSetting,
                "aLengthMenu": [
                    [5, 10, 15, 20, -1],
                    [5, 10, 15, 20, "All"]
                ],
                "iDisplayLength": 10
            });

            var $wrapper = dataTable.parent();

            $wrapper.find('.dataTables_filter input').addClass("form-control input-sm").attr("placeholder", "Search");
            $wrapper.find('.dataTables_length select').addClass("m-wrap small");
            $wrapper.find('.dataTables_length select').select2();
        });
    });
}

function initSwitch() {
    flog("fuse.js: make switch");
    if ($(document).bootstrapSwitch) {

        $(".make-switch input[type=checkbox], input.make-switch").each(function () {
            var target = $(this);
            var dataHolder = target.is('.make-switch') ? target : target.closest('.make-switch');

            target.bootstrapSwitch({
                onColor: dataHolder.attr('data-on-color') || 'primary',
                offColor: dataHolder.attr('data-off-color') || 'default',
                size: dataHolder.attr('data-size') || 'normal',
                onText: dataHolder.attr('data-on-text') || 'ON',
                offText: dataHolder.attr('data-off-text') || 'OFF',
                labelText: dataHolder.attr('data-label-text') || '&nbsp;',
                handleWidth: +dataHolder.attr('data-handle-width') || 'auto',
                labelWidth: +dataHolder.attr('data-label-width') || 'auto'
            });
        });
    }
}

function validateFuseEmail(emailAddress) {
    var pattern = /^(("[\w-\s]+")|([\w-'']+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,66}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;

    if (pattern.test(emailAddress)) {
        return true;
    } else {
        emailAddress = emailAddress.replace(/^.*\<(.*)\>$/, '$1');

        return pattern.test(emailAddress);
    }
}

function initFuseModals() {
    flog("initFuseModal");

    $('.modal').each(function () {
        var target = $(this);
        var modalDialog = target.find('.modal-dialog');

        if (modalDialog.length === 0) {
            flog('Modal has old structure. Modifying structure...');

            var content = target.html();
            var sizeClass = '';
            if (target.hasClass('modal-lg')) {
                sizeClass = 'modal-lg';
                target.removeClass('modal-lg');
            } else if (target.hasClass('modal-sm')) {
                sizeClass = 'modal-sm';
                target.removeClass('modal-sm');
            } else if (target.hasClass('modal-md')) {
                sizeClass = 'modal-md';
                target.removeClass('modal-md');
            }

            target.html('<div class="modal-dialog ' + sizeClass + '"><div class="modal-content">' + content + '</div></div>');
            flog('Modifying structure is DONE');

            target.trigger('modal.bs.done');
        }
    });

    flog("init form submit");
    $(document.body).on('click', '[data-type=form-submit]', function (e) {
        e.preventDefault();
        flog("click submit");
        $(this).closest('.modal').find('form').not('.dz-clickable').trigger('submit');
    });
}

function initFuseModal(modal, callback) {
    flog('initFuseModal', modal, callback);

    //if (modal.hasClass('modal-fuse-editor')) {
    //    var id = modal.attr('id');
    //
    //    flog('Add wrapper for fuse modal');
    //    modal.wrap(
    //        '<div id="' + id + '-wrapper" class="modal-scrollable hide" style="z-index: 1030;"></div>'
    //    );
    //
    //    var wrapper = modal.parent();
    //    var backdrop = $('<div id="' + id + '-backdrop" class="modal-backdrop fade hide" style="z-index: 1020;"></div>');
    //    wrapper.after(backdrop);
    //
    //    modal.on('click', '[data-type=modal-dismiss], [data-dismiss=modal]', function (e) {
    //        e.preventDefault();
    //        e.stopPropagation();
    //
    //        closeFuseModal(modal);
    //    });
    //
    //    wrapper.on('click', function (e) {
    //        if ($(e.target).is(wrapper)) {
    //            closeFuseModal(modal);
    //        }
    //    });
    //
    //    if (typeof callback === 'function') {
    //        callback.apply(this);
    //    }
    //
    //    wrapper.removeClass('hide');
    //    wrapper.add(modal).addClass('invi');
    //    modal.addClass('calculating');
    //
    //    var calculate = function () {
    //        wrapper.add(modal).removeClass('invi');
    //        wrapper.addClass('hide');
    //        modal.removeClass('calculating');
    //    };
    //
    //    var editor = modal.find('.htmleditor').get(0);
    //    var ckEditor = null;
    //
    //    for (var key in CKEDITOR.instances) {
    //        if (CKEDITOR.instances[key].element.$ === editor) {
    //            ckEditor = CKEDITOR.instances[key];
    //            break;
    //        }
    //    }
    //
    //    if (ckEditor) {
    //        ckEditor.on('instanceReady', function (evt) {
    //            flog("instanceReady", ckEditor);
    //            calculate();
    //        });
    //    }
    //
    //    $(window).resize(function () {
    //        adjustModal(modal);
    //    });
    //} else {
    //    if (typeof callback === 'function') {
    //        callback.apply(this);
    //    }
    //}

    modal.modal({
        show: false
    });

    if (typeof callback === 'function') {
        callback.apply(this);
    }
}

function adjustModal(modal) {
    var height = +modal.attr('data-height');
    flog("adjustModal: height:", height);

    if ($(window).height() < height) {
        flog("zero top margin");
        modal.css('margin-top', 0).addClass('modal-overflow');
    } else {
        flog("margin top: ", (height / -2) - 20);
        modal.css('margin-top', (height / -2) - 20).removeClass('modal-overflow');
    }
    flog("finished adjust modal", modal);
}

function openFuseModal(modal, callback, time) {
    flog("openFuseModal");
    //var wrapper = modal.parent();
    //var backdrop = wrapper.next();
    //
    //if (modal.hasClass(('modal-fuse-editor'))) {
    //    flog("is modal-fuse-editor");
    //    var height = $(window).height() * 0.9; // 80% height of window
    //    modal.attr('data-height', height);
    //
    //    adjustModal(modal);
    //    $(document.body).addClass('modal-open');
    //    wrapper.removeClass('hide');
    //    backdrop.removeClass('hide');
    //    flog("modal", modal.show);
    //    modal.show();
    //
    //    setTimeout(function () {
    //        modal.addClass('in');
    //        backdrop.addClass('in');
    //    }, 0);
    //
    //    if (typeof callback === 'function') {
    //        callback.apply(this);
    //    }
    //
    //} else {
    //    modal.modal({
    //        backdrop: 'static'
    //    });
    //
    //    if (typeof callback === 'function') {
    //        callback.apply(this);
    //    }
    //}

    modal.modal('show');

    if (typeof callback === 'function') {
        callback.apply(this);
    }
}

function closeFuseModal(modal, callback) {
    //if (modal.hasClass(('modal-fuse-editor'))) {
    //    var wrapper = modal.parent();
    //    var backdrop = wrapper.next();
    //
    //    backdrop.add(modal).removeClass('in');
    //
    //    setTimeout(function () {
    //        backdrop.addClass('hide');
    //        modal.hide();
    //        wrapper.addClass('hide');
    //        $(document.body).removeClass('modal-open');
    //    }, 400);
    //} else {
    //    modal.modal('hide');
    //}
    //
    //modal.trigger('hidden.modal.fuse');

    modal.modal('hide');

    if (typeof callback === 'function') {
        callback.apply(this);
    }
}

function initLoadingOverlay() {
    if (!findLoadingOverlay()[0]) {
        $('.main-content').children('.container').prepend('<div class="loading-overlay hide"></div>');
    }
}

function findLoadingOverlay() {
    return $('.main-content').children('.container').find('.loading-overlay');
}

function showLoadingOverlay() {
    findLoadingOverlay().removeClass('hide');
}

function hideLoadingOverlay() {
    findLoadingOverlay().addClass('hide');
}

function getStandardEditorHeight() {
    return $(window).height() - 400;
}

function getStandardModalEditorHeight() {
    return getStandardEditorHeight() + 200;
}

function getStandardModalHeight() {
    return getStandardModalEditorHeight();
}

/**
 * Formats a numeric value as a date, or if already a string just returns it
 *
 * @param {type} l - the numeric value to format as a date or a string to return as is
 * @returns {String} - a formatted date
 */
function formatDate(l) {
    if (l) {
        if (typeof l === "string") {
            return l;
        } else {
            var dt = new Date(l);
            var m = dt.getMonth() + 1; // java dates are 1 indexed, but js is zero indexed
            return pad2(dt.getDate()) + "/" + pad2(m) + "/" + dt.getFullYear();
        }
    } else {
        return "";
    }
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

function initAjaxStatus() {
    var depth = 0;
    $(document).ajaxStart(function () {
        depth++;
        flog("ajax start", depth);
        $("#mainSpinner").show();
    });
    $(document).ajaxComplete(function () {
        depth--;
        flog("ajax stop", depth);
        if (depth < 0) {
            depth = 0;
        }
        if (depth == 0) {
            $("#mainSpinner").hide();
        }
    });
}

function initTopNavSearch() {
    flog('initTopNavSearch');

    var txt = $('#fuse-search-input');
    var suggestionsWrapper = $('#fuse-search-suggestions');
    var backdrop = $('<div />', {
        id: 'fuse-search-backdrop',
        class: 'hide'
    }).on('click', function () {
        backdrop.addClass('hide');
        suggestionsWrapper.addClass('hide');
    }).appendTo(document.body);

    txt.on({
        input: function () {
            typewatch(function () {
                var text = txt.val().trim();

                if (text.length > 0) {
                    doTopNavSearch(text, suggestionsWrapper, backdrop);
                } else {
                    suggestionsWrapper.addClass('hide');
                    backdrop.addClass('hide');
                }
            }, 500);
        },
        keydown: function (e) {
            switch (e.keyCode) {
                case keymap.ESC:
                    flog('Pressed ESC button');

                    suggestionsWrapper.addClass('hide');
                    backdrop.addClass('hide');

                    e.preventDefault();
                    break;

                case keymap.UP:
                    flog('Pressed UP button');

                    var suggestions = suggestionsWrapper.find('.suggestion');
                    if (suggestions.length > 0) {
                        var actived = suggestions.filter('.active');
                        var prev = actived.prev();

                        actived.removeClass('active');
                        if (prev.length > 0) {
                            prev.addClass('active');
                        } else {
                            suggestions.last().addClass('active');
                        }
                    }

                    e.preventDefault();
                    break;

                case keymap.DOWN:
                    flog('Pressed DOWN button');

                    var suggestions = suggestionsWrapper.find('.suggestion');
                    if (suggestions.length > 0) {
                        var actived = suggestions.filter('.active');
                        var next = actived.next();

                        actived.removeClass('active');
                        if (next.length > 0) {
                            next.addClass('active');
                        } else {
                            suggestions.first().addClass('active');
                        }
                    }

                    e.preventDefault();
                    break;

                case keymap.ENTER:
                    flog('Pressed DOWN button');

                    var actived = suggestionsWrapper.find('.suggestion').filter('.active');
                    if (actived.length > 0) {
                        var link = actived.find('a').attr('href');

                        window.location.href = link;
                    }

                    e.preventDefault();
                    break;

                default:
                // Nothing
            }
        }
    });

    suggestionsWrapper.on({
        mouseenter: function () {
            suggestionsWrapper.find('.suggestion').removeClass('active');
            $(this).addClass('active');
        },
        mouseleave: function () {
            $(this).removeClass('active');
        }
    }, '.suggestion');
}

function doTopNavSearch(query, suggestionsWrapper, backdrop) {
    flog('doTopNavSearch', query, suggestionsWrapper, backdrop);

    $.ajax({
        url: '/manageUsers',
        type: 'POST',
        data: {
            omni: query
        },
        dataType: 'JSON',
        success: function (resp) {
            flog('Got search response from server', resp);

            var suggestionStr = '';

            if (resp && resp.hits && resp.hits.total > 0) {
                for (var i = 0; i < resp.hits.hits.length; i++) {
                    var suggestion = resp.hits.hits[i];
                    suggestionStr += '<li class="suggestion">';
                    if (suggestion.fields.userId) {
                        var userId = suggestion.fields.userId[0];
                        var userName = suggestion.fields.userName[0];
                        var email;
                        if (suggestion.fields.email) {
                            var email = suggestion.fields.email[0];
                        } else {
                            email = "";
                        }
                        var firstName = suggestion.fields.firstName ? suggestion.fields.firstName[0] : '';
                        var surName = suggestion.fields.surName ? suggestion.fields.surName[0] : '';

                        suggestionStr += '    <a href="/manageUsers/' + userId + '">';
                        suggestionStr += '        <span>' + userName + '</span> &ndash; <span class="email">' + email + '</span>';
                        if (firstName || surName) {
                            suggestionStr += '    <br /><small class="text-muted">' + firstName + ' ' + surName + '</small>';
                        }
                        suggestionStr += '    </a>';
                    } else if (suggestion.fields.entityId) {
                        var id = suggestion.fields.entityId[0];
                        var orgId = suggestion.fields.orgId[0];
                        var orgTitle = suggestion.fields.title[0];

                        var href = "/organisations/" + id + "/edit";
                        suggestionStr += "    <a href='" + href + "'>";
                        suggestionStr += '        <span>' + orgTitle + '</span>';
                        suggestionStr += '    <br /><small class="text-muted">OrgID: ' + orgId + '</small>';
                        suggestionStr += '    </a>';

                    }
                    suggestionStr += '</li>';
                }
            } else {
                suggestionStr = '<li>No result.</li>';
            }

            suggestionsWrapper.html(suggestionStr).removeClass('hide');
            backdrop.removeClass('hide');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            flog('Error when doTopNavSearch with query: ' + query, jqXHR, textStatus, errorThrown);
        }
    });
}

function drawPieChart(chart, options, padding, isFirstTime) {
    flog('drawPieChart', chart, options, padding, isFirstTime);

    var wrapper = chart.closest('.col-sm-6');
    var canvas = chart.find('canvas');
    var sizeChart = wrapper.width() - padding;
    if (sizeChart < 0) {
        sizeChart = 100;
    }
    var currentSize = +chart.attr('data-size');
    flog("got size", sizeChart, chart);

    // Hide canvas
    canvas.hide();

    if (currentSize !== sizeChart || isFirstTime) {
        flog('Render new chart', sizeChart);

        // Clear data pf easyPieChart
        if (!isFirstTime) {
            chart.data('easy-pie-chart', null);
            chart.data('size', sizeChart);
        }

        // Remove the chart
        canvas.remove();

        // Render new chart
        options.size = sizeChart;
        flog("chart size", sizeChart);
        try {
            chart.easyPieChart(options);
        } catch (e) {
            flog('Error when rendering easyPieChart', e);
        }
    } else {
        flog('Re-show current chart');
        canvas.show();
    }
}

function initPieChart(target, options, padding) {
    drawPieChart(target, options, padding, true);

    var timer = null;
    $(window).on('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            drawPieChart(target, options, padding);
        }, 200);
    });
}

function initPageDatePicker() {
    flog('initPageDatePicker');

    var range = $('#commonControlsRange');
    if (range.length > 0) {
        var extraClass = range.attr('data-class') || '';
        var position = range.attr('data-position') || 'right';

        range.pageDatePicker({
            extraClass: extraClass,
            position: position
        });
    }
}

$(function () {
    flog("Fuse init");

    initLoadingOverlay();
    initTopNavSearch();
    initSwitch();
    initToggled();
    initDatePicker();
    initTabbable();
    initChkAll();
    initFuseModals();
    initClearer();
    initTable();
    initAjaxStatus();
    initMasonryPanel();

    $('.main-navigation-menu').children('li').children('a[href=#]').on('click', function (e) {
        e.preventDefault();
    });
});

$(window).load(function () {
    if ((typeof CKEDITOR != 'undefined')) {
        $('head link').last().after('<link rel="stylesheet" type="text/css" href="/theme/assets/plugins/jquery-ui/jquery-ui-1.10.3.full.css" />');
    }
});


function showLoginAs(profileId) {
    var modal = $("#modal-login-as");
    modal.find("ul").html("<li>Please wait...</li>");
    modal.modal('show');
    $.ajax({
        type: 'GET',
        url: profileId + "?availWebsites",
        dataType: "json",
        success: function (response) {
            flog("success", response.data);
            var newList = "";
            if (response.data.length > 0) {
                $.each(response.data, function (i, n) {
                    newList += "<li><a target='_blank' href='" + profileId + "?loginTo=" + n + "'>" + n + "</a></li>";
                });
            } else {
                newList += "<li>The user does not have access to any websites. Check the user's group memberships, and that those groups have been added to the right websites</li>";
            }
            modal.find("ul")
                .empty()
                .html(newList);
        },
        error: function (resp) {
            Msg.error("An error occured loading websites. Please try again");
        }
    });
}

function setRecentItem(title, url) {
    flog("setRecentItem", title, url);
    if (typeof(Storage) !== "undefined") {
        //localStorage.removeItem("recent");
        var recentList = JSON.parse(localStorage.getItem("recent"));  // an associative array, key is the url
        if (recentList == null) {
            recentList = new Array();
        } else {

        }
        flog("recent", recentList);
        var item = {
            title: title,
            url: url
        };
        recentList.push(item);
        localStorage.setItem("recent", JSON.stringify(recentList));
        flog("recent2", recentList);
    } else {
        return;
    }
}

function getRecentItems() {
    if (typeof(Storage) !== "undefined") {
        var recentList = JSON.parse(localStorage.getItem("recent"));  // an associative array, key is the url
        return recentList;
    } else {
        return null;
    }
}

function initBackgroundJobStatus(options) {
    // Find divs which need to reload to get job status. For each div get the current
    // job status and then apply data to the handlebars template in the div
    flog("initBackgroundJobStatus", options);

    options = $.extend({}, options);

    Handlebars.registerHelper('formatISODate', function (millis) {
        if (millis) {
            var m = millis;
            var date = new Date(m);

            return date.toISOString();
        } else {
            return "";
        }
    });

    Handlebars.registerHelper('formatDate', function (millis) {
        if (millis) {
            return moment(millis).format('DD/MM/YYYY');
        } else {
            return "";
        }
    });

    Handlebars.registerHelper('notRunning', function (data, options) {
        var b = (data == null || data.statusInfo.complete);
        var out = options.fn(data);

        return out;
    });

    $(".backgroundTask").each(function () {
        var div = $(this);
        var href = div.data("task-href");
        var templateHtml = div.siblings('.backgroundTaskTemplate').html();
        var template = Handlebars.compile(templateHtml);

        checkBackgroundJobStatus(href, div, template, options);
    });
}

function checkBackgroundJobStatus(href, div, template, options) {
    flog('checkBackgroundJobStatus', href, div, template, options);

    $.ajax({
        url: href,
        method: "GET",
        dataType: 'json',
        success: function (resp) {
            flog('Success in checking background task', resp);

            if (resp.status) {
                var htmlStr = template(resp);
                flog('Background task status HTML:', htmlStr);

                div.html(htmlStr);
                div.show(400);

                if (resp.data.statusInfo.complete) {
                    if (typeof options.onComplete === 'function') {
                        options.onComplete.call(this, resp);
                    }
                } else {
                    // Not complete, so update again
                    flog("Background task is not completed! Re-check status in next 3 seconds");
                    window.setTimeout(function () {
                        checkBackgroundJobStatus(href, div, template, options);
                    }, 3000);

                    if (typeof options.onRunning === 'function') {
                        options.onRunning.call(this, resp);
                    }
                }
            } else {
                var htmlStr = template(null);
                flog('Background task status HTML:', htmlStr);

                div.html(htmlStr);
                div.show(400);

                if (typeof options.onError === 'function') {
                    options.onError.call(this, resp);
                }
            }

            div.find('.timeago').timeago();
        },
        error: function (jqXHR) {
            // probably a 404, which is fine, show the template with no data so it can render a run form
            flog("No task resource, thats cool, means not running and hasnt been run");

            var htmlStr = template(null);
            flog('Background task status HTML:', htmlStr);

            div.html(htmlStr);
            div.show(400);
            div.find('.timeago').timeago();

            if (typeof options.onError === 'function') {
                options.onError.call(this, jqXHR);
            }
        }
    });
}

function getParam(name) {
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var value = regex.exec(window.location.href) || '';
    value = decodeURIComponent(value[1]);

    return value;
}
