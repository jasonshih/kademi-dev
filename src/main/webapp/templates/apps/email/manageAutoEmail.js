var c = {};
var options = {
    startDate: null,
    endDate: null,
    interval: "day"
};

function initEnableSwitcher() {
    flog('initEnableSwitcher');

    $('.enabledSwitchContainer input').on('switchChange.bootstrapSwitch', function (e, state) {
        flog('enabled', state.value);
        var v = state.value;
        flog('enabled', v);
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: 'enabled=' + v,
            dataType: 'json',
            success: function (content) {
                flog('response', content);
            }
        });
    });
}

function initSmsField() {
    var sms_txt_max = 160;
    $('.refresh-sms').click(function (e) {
        e.preventDefault();
        $('#smsprovider-list').reloadFragment();
    });

    var ln = sms_txt_max - $('#smsMessage').val().length;
    if (ln < 0) {
        $('#sms-char-remaining').text(Math.abs(ln) + ' characters over');
        $('#sms-char-remaining').css('color', 'red');
    } else {
        $('#sms-char-remaining').text(ln + ' characters remaining');
        $('#sms-char-remaining').css('color', '');
    }

    $('#smsMessage').keyup(function () {
        var ln = sms_txt_max - $('#smsMessage').val().length;
        if (ln < 0) {
            $('#sms-char-remaining').text(Math.abs(ln) + ' characters over');
            $('#sms-char-remaining').css('color', 'red');
        } else {
            $('#sms-char-remaining').text(ln + ' characters remaining');
            $('#sms-char-remaining').css('color', '');
        }
    });
}

function initHistorySearch() {
    var reportRange = $('#report-range');

    reportRange.exist(function () {
        flog("init report range");
        reportRange.daterangepicker({
                format: 'DD/MM/YYYY', // YYYY-MM-DD
                ranges: {
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
                    'This Year': [moment().startOf('year'), moment()],
                },
            },
            function (start, end) {
                flog('onChange', start, end);
                doHistorySearch(start, end);
            });
    });
}

function doHistorySearch(startDate, endDate) {
    flog('doHistorySearch', startDate, endDate);

    var data = {
        startDate: formatDate(startDate),
        finishDate: formatDate(endDate)
    };
    flog("data", data);

    var target = $("#history-table-body");
    //target.load();

    var dates = "startDate=" + formatDate(startDate) + "&finishDate=" + formatDate(endDate);
    var baseHref = window.location.pathname + "?" + dates;
    var href = baseHref + "#history-tab";
    $("a.history-csv").attr("href", "email-history.csv?" + dates);

    $.ajax({
        type: "GET",
        url: href,
        dataType: 'html',
        success: function (content) {
            flog('response', content);
            var newBody = $(content).find("#history-table-body");
            flog("newBody", newBody);
            target.replaceWith(newBody);
            jQuery("abbr.timeago").timeago();
            window.history.pushState(null, "Email History", href);
        }
    });

}

function initSmsHistorySearch() {
    var smsReportRange = $('#sms-report-range');

    smsReportRange.exist(function () {
        flog("init sms report range");
        smsReportRange.daterangepicker({
                format: 'DD/MM/YYYY', // YYYY-MM-DD
                ranges: {
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
                    'This Year': [moment().startOf('year'), moment()],
                },
            },
            function (start, end) {
                flog('onChange', start, end);
                doSMSHistorySearch(start, end);
            });
    });
}

function doSMSHistorySearch(startDate, endDate) {
    flog('doSMSHistorySearch', startDate, endDate);

    var data = {
        startDate: formatDate(startDate),
        finishDate: formatDate(endDate)
    };
    flog("data", data);

    var target = $("#sms-history-table-body");

    var dates = "smsStartDate=" + formatDate(startDate) + "&smsFinishDate=" + formatDate(endDate);
    var baseHref = window.location.pathname + "?" + dates;
    var href = baseHref + "#history-tab";
    $("a.sms-history-csv").attr("href", "sms-history.csv?" + dates);

    $.ajax({
        type: "GET",
        url: href,
        dataType: 'html',
        success: function (content) {
            flog('response', content);
            var newBody = $(content).find("#sms-history-table-body");
            target.replaceWith(newBody);
            $('#sms-history-table').find("abbr.timeago").timeago();
            window.history.pushState(null, "SMS History", href);
        }
    });
}

function initRefresher() {
    flog('initRefresher');

    $('.refresh-history').click(function (e) {
        e.preventDefault();

        $('#history-table').reloadFragment();
    });

    $('.refresh-sms-history').click(function (e) {
        e.preventDefault();

        $('#sms-history-table').reloadFragment({
            whenComplete: function () {
                $('#sms-history-table').find('abbr.timeago').timeago();
            }
        });
    });

    $('.refresh-alerts').click(function () {
        $('#alerts-list').reloadFragment();
    });

    $('.refresh-rewards').click(function () {
        $('#rewards-container').reloadFragment();
    });

    $('.refresh-dataseries').click(function () {
        $('#dataseries-list').reloadFragment();
    });
}

function loadData() {
    var href = "?triggerHistory&" + $.param(options);
    $.ajax({
        type: "GET",
        url: href,
        dataType: 'html',
        success: function (resp) {
            var json = null;

            if (resp !== null && resp.length > 0) {
                json = JSON.parse(resp);
            }

            flog('response', json);
            handleData(json);
        }
    });
}

function handleData(resp) {
    var aggr = (resp !== null ? resp.aggregations : null);

    initHistogram(aggr);
}

function initEmailStats() {
    initChart($('.emailsMainPie'), {
        trackColor: 'rgba(255,255,255,0.2)',
        scaleColor: 'rgba(255,255,255,0.5)',
        barColor: 'rgba(255,255,255,0.7)',
        lineWidth: 7,
        lineCap: 'butt'
    }, 90);

    initChart($('.emailsSubPie.bluePie'), {
        trackColor: '#eee',
        scaleColor: '#ccc',
        barColor: '#2196F3',
        lineWidth: 7,
        lineCap: 'butt'
    }, 8);

    initChart($('.emailsSubPie.orangePie'), {
        trackColor: '#eee',
        scaleColor: '#ccc',
        barColor: '#FFC107',
        lineWidth: 7,
        lineCap: 'butt'
    }, 8);
}

function initHistogram(aggr) {
    $('#chart_histogram svg').empty();
    nv.addGraph(function () {
        var chart = nv.models.multiBarChart()
            .options({
                showLegend: true,
                showControls: false,
                noData: "No Data available for histogram",
                margin: {
                    left: 40,
                    bottom: 60
                }
            });

        chart.xAxis
            .axisLabel("Date")
            .rotateLabels(-45)
            .tickFormat(function (d) {
                return moment(d).format("DD MMM");
            });

        chart.yAxis
            .axisLabel("Triggered")
            .tickFormat(d3.format('d'));

        var myData = [];
        var conditionsTrue = {
            values: [],
            key: "Trigger",
            color: "#7777ff",
            area: true
        };

        var conditionsFalse = {
            values: [],
            key: "Failed Trigger",
            color: "#d9534f",
            area: true
        };

        var delayedTriggers = {
            values: [],
            key: "Delayed Trigger",
            color: "#5bc0de",
            area: true
        };

        myData.push(conditionsTrue);
        myData.push(conditionsFalse);
        myData.push(delayedTriggers);

        var trueHits = (aggr !== null ? aggr.triggerTrue.firedAt.buckets : []);
        var falseHits = (aggr !== null ? aggr.triggerFalse.firedAt.buckets : []);
        var delayedHits = (aggr !== null ? aggr.delayedTriggers.createdAt.buckets : []);

        for (var i = 0; i < trueHits.length; i++) {
            var bucket = trueHits[i];
            conditionsTrue.values.push(
                {x: bucket.key, y: bucket.doc_count});
        }

        for (var i = 0; i < falseHits.length; i++) {
            var bucket = falseHits[i];
            conditionsFalse.values.push(
                {x: bucket.key, y: bucket.doc_count});
        }

        for (var i = 0; i < delayedHits.length; i++) {
            var bucket = delayedHits[i];
            delayedTriggers.values.push(
                {x: bucket.key, y: bucket.doc_count});
        }

        d3.select('#chart_histogram svg')
            .datum(myData)
            .transition().duration(500)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}

function drawChart(chart, options, padding, isFirstTime) {
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
        chart.easyPieChart(options);
    } else {
        flog('Re-show current chart');
        canvas.show();
    }

}

function initChart(target, options, padding) {
    drawChart(target, options, padding, true);

    $(window).on('resize', function () {
        drawChart(target, options, padding);
    });
}

function initControls() {
    flog("initControls");
    var reportRange = $('#analytics-range');

    function cb(start, end) {
        options.startDate = start.format('DD/MM/YYYY');
        options.endDate = end.format('DD/MM/YYYY');
        loadData();
    }

    reportRange.exist(function () {
        flog("init analytics range");
        reportRange.daterangepicker({
            format: 'DD/MM/YYYY',
            startDate: moment().subtract('days', 6),
            endDate: moment(),
            ranges: {
                'Today': [
                    moment().toISOString(),
                    moment().toISOString()
                ],
                'Last 7 Days': [
                    moment().subtract('days', 6).toISOString(),
                    moment().toISOString()
                ],
                'Last 30 Days': [
                    moment().subtract('days', 29).toISOString(),
                    moment().toISOString()],
                'This Month': [
                    moment().startOf('month').toISOString(),
                    moment().endOf('month').toISOString()],
                'Last Month': [
                    moment().subtract('month', 1).startOf('month').toISOString(),
                    moment().subtract('month', 1).endOf('month').toISOString()],
                'This Year': [
                    moment().startOf('year').toISOString(),
                    moment().toISOString()],
            },
        }, cb);
    });
}

function initTitleEditor() {
    $('#emailTitle').editable({
        url: window.location.pathname,
        name: 'title',
        validate: function (value) {
            if ($.trim(value) == '')
                return 'This field is required';
        },
        success: function (response, newValue) {
            flog(response, newValue);
            if (response.status) {
                Msg.info('Successfully saved title');
            }
        },
        params: function (params) {
            params.title = params.value;
            return params;
        }
    });
}

function initJavascriptEditor() {
    flog('initJavascriptEditor');

    var javascriptEditor = ace.edit('javascriptEditor');
    javascriptEditor.getSession().setMode('ace/mode/javascript');
    javascriptEditor.setOptions({
        minLines: javascriptEditor.getSession().$rowLengthCache.length
    });
    $('#javascriptEditor').show();

    javascriptEditor.on('input', function () {
        var javascriptVal = javascriptEditor.getValue();
        $('textarea[name=javascript]').val(javascriptVal);
    });
}

function initAddGroup() {
    flog('initAddGroup');

    var modal = $('#modal-choose-group');

    $('.btn-add-recipient-group').on('click', function (e) {
        e.preventDefault();

        modal.removeClass('excluded-group').addClass('recipient-group');
    });


    $('.btn-add-excluded-group').on('click', function (e) {
        e.preventDefault();

        modal.removeClass('recipient-group').addClass('excluded-group');
    });

    modal.on('hidden.bs.modal', function () {
        modal.removeClass('recipient-group').removeClass('excluded-group');
    });
}

var p;
function initManageAutoEmail(emailEnabled, smsEnabled) {
    flog('initManageAutoEmail', emailEnabled, smsEnabled);
    initHtmlEditors($('.htmleditor'), getStandardEditorHeight(), null, null, 'autogrow');
    initAttachment();
    initFormDetailEmail();
    initIncludeUser();
    initEventType();
    initAdvanceRecipients();
    initSendTest();
    initChooseGroup();
    initEnableSwitcher();
    setRecentItem(document.title, window.location.pathname);
    initSmsField();
    initEmailStats();
    initControls();
    initTitleEditor();
    initHistorySearch();
    initSmsHistorySearch();
    initRefresher();
    loadData();
    initJavascriptEditor();
    initAddGroup();

    $('#action .toggler').on({
        'checked.toggled': function (e, panel) {
            $(panel).find('.required-if-shown').not(':hidden').addClass('required');
        },
        'unchecked.toggled': function (e, panel) {
            $(panel).find('.required-if-shown').removeClass('required');
        }
    });

    var toggledPanel = $('.panel-toggled');
    toggledPanel.each(function () {
        var panel = $(this);
        if (panel.is(':hidden')) {
            panel.find('.required-if-shown').not(':hidden').removeClass('required');
        } else {
            panel.find('.required-if-shown').not(':hidden').addClass('required');
        }
    });

    $('.timer-units li').click(function (e) {
        e.preventDefault();
        var unit = $(e.target).text();
        $('.timer-unit').text(unit).val(unit).change();
    });

    $('abbr.timeago').timeago();
    var body = $(document.body);

    body.on('click', '.email-item', function (e) {
        e.preventDefault();

        var item = $(this);
        var href = item.attr('href')
        var win = window.open(href, '_blank');

        if (win) {
            // Browser has allowed it to be opened
            win.focus();
        } else {
            // Browser has blocked it
            alert('Please allow popups for this site');
        }
    });

    body.on('click', '.sms-item', function (e) {
        e.preventDefault();

        var item = $(this);
        var href = item.attr('href')
        var win = window.open(href, '_blank');

        if (win) {
            // Browser has allowed it to be opened
            win.focus();
        } else {
            // Browser has blocked it
            alert('Please allow popups for this site');
        }
    });

    body.on('change', '#smsEnabled', function (e) {
        e.preventDefault();

        var chk = $(this);
        smsEnabled = chk.is(':checked');

        if (emailEnabled && smsEnabled) {
            $('#send-preference').show();
        } else {
            $('#send-preference').hide();
        }
    });

    body.on('change', '#emailEnabled', function (e) {
        e.preventDefault();

        var chk = $(this);
        emailEnabled = chk.is(':checked');

        if (emailEnabled && smsEnabled) {
            $('#send-preference').show();
        } else {
            $('#send-preference').hide();
        }
    });

    $('.time-picker').timepicker();
    body.on('change', '#useTimerTime', function (e) {

        var btn = $(this);
        var isChecked = btn.is(':checked');

        flog(isChecked);
        if (isChecked) {
            $('#fireAtTime').show();
        } else {
            $('#fireAtTime').hide();
            $('input[name=timerTime]').val('');
        }
    });

    flog("initManageAutoEmail - DONE");
}

function initEventType() {
    var eventType = $('.event-type');
    var chkEventId = $('#eventId');
    var checkEventId = function () {
        flog('checkEventId');
        var eventId = chkEventId.val();
        flog('changed', eventId);
        eventType.hide().find('select, input').attr('disabled', true);
        eventType.filter('.' + eventId).show().find('select, input').attr('disabled', false);
    };

    checkEventId();
    chkEventId.on('change', function () {
        checkEventId();
    });
}

function initIncludeUser() {
    var chkIncludeUser = $('#includeUser');

    chkIncludeUser.on('change', function () {
        var isIncludeUser = chkIncludeUser.is(':checked');
        flog('includeUser', includeUser);
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: {
                includeUser: isIncludeUser
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('err');
            }
        });
    });
}

function initAttachment() {
    var attachmentsList = $('.attachments-list');

    $('.add-attachment').mupload({
        buttonText: '<i class="clip-folder"></i> Upload attachment',
        useJsonPut: false,
        oncomplete: function (data, name) {
            flog('oncomplete. name=', name, 'data=', data);
            showAttachment(data, attachmentsList);
        }
    });

    attachmentsList.on('click', '.btn-delete-attachment', function (e) {
        e.preventDefault();

        var btn = $(this);
        var href = btn.attr('href');

        doRemoveAttachment(href, function () {
            btn.closest('article').remove();
        });
    });
}

function showAttachment(data, attachmentsList) {
    flog('attach', data);

    var name = data.name;
    var hash = data.result.nextHref;

    attachmentsList.append(
        '<article>' +
        '   <span class="article-name">' +
        '       <a target="_blank" href="/_hashes/files/' + hash + '">' + name + '</a>' +
        '   </span>' +
        '   <aside class="article-action">' +
        '       <a class="btn btn-xs btn-danger btn-delete-attachment" href="' + name + '" title="Remove"><i class="clip-minus-circle"></i></a>' +
        '   </aside>' +
        '</article>'
    );
}

function doRemoveAttachment(name, callback) {
    if (confirm("Are you sure you want to delete attachment " + name + "?")) {
        try {
            $.ajax({
                type: 'POST',
                url: window.location.pathname,
                data: {
                    removeAttachment: name
                },
                success: function (data) {
                    flog('saved ok', data);
                    callback();
                },
                error: function (resp) {
                    flog('error', resp);
                    Msg.error('Sorry, we couldnt remove the attachment. Please refresh the page and try again');
                }
            });
        } catch (e) {
            Msg.error('Sorry, we couldnt remove the attachment. Please refresh the page and try again');
        }
    }
}
