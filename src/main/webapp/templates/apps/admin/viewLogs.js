var itemsToAppend = [];
var appendTimer = null;
var maxLimit;

function initWebsockets(orgId, txtQueryUser, txtQueryMessage) {
    flog('initWebsockets', orgId);

    var b64ContentId = Base64.encode(orgId);
    try {
        var proto = 'ws://';
        if (window.location.protocol === 'https:') {
            proto = 'wss://';
        }
        var url = window.location.host + '/comments/' + window.location.host + '/logging/' + b64ContentId;

        wsocket = new WebSocket(proto + url);
        wsocket.onmessage = function (evt) {
            flog('Received Logs');

            var c = $.parseJSON(evt.data);
            var filterMsg = txtQueryUser.val().toLowerCase();
            var filterUser = txtQueryMessage.val().toLowerCase();

            for (var i = 0; i < c.length; i++) {
                processReceivedLog(c[i], filterMsg, filterUser);
            }

            if (appendTimer != null) {
                clearTimeout(appendTimer);
                appendTimer = null;
            }
            if (itemsToAppend.length > 50) {
                appendItems();
            } else {
                appendTimer = setTimeout(appendItems, 250);
            }
        };

        flog('done initWebsockets');
    } catch (e) {
        // TODO: setup polling to load comments every minute or so
        flog('Websocket initialisation failed');
    }
}

function appendItems() {
    flog('Appending with ' + itemsToAppend.length + ' logs');

    appendTimer = null;
    $('#logsBody').append(itemsToAppend);
    initTimeAgo();
    trimTable(maxLimit);

    while (itemsToAppend.length > 0) {
        itemsToAppend.pop();
    }
}

function processReceivedLog(c, filterMsg, filterUser) {
    var dt = moment(c.data);
    var labelType = c.level.toLowerCase();

    if ((filterMsg === '' || c.message.toLowerCase().contains(filterMsg))
            && (filterUser == '' || c.userName.toLowerCase().contains(filterUser))) {
        if (labelType == 'error') {
            labelType = 'danger';
        } else if (labelType == 'warn') {
            labelType = 'warning';
        } else if (labelType == 'trace') {
            labelType = 'default';
        }

        var row = $(
                '<div class="' + labelType + ' col-row clearfix">' +
                '    <div class="col-lvl"><span class="label label-' + labelType + '" >' + c.level + '</span></div>' +
                '    <div class="col-user"><a target="_blank" class="userName" href="' + c.userHref + '">' + c.userName + '</a></div>' +
                '    <div class="col-msg"></div>' +
                '    <div class="col-date"><abbr title="' + dt.format(moment.ISO_8601) + '" class="timeago">' + dt.format() + '</abbr></div>' +
                '</div>'
                );
        row.find('.col-msg').text(c.message);

        itemsToAppend.push(row);

        if (c.callstack !== null && c.callstack.length > 0) {
            row = $(
                    '<div class="col-row clearfix no-bordered">' +
                    '   <div class="causes"></div>' +
                    '</div>'
                    );

            var ul = $('<ul />');
            $.each(c.callstack, function (i, n) {
                $('<li>').text(n).appendTo(ul);
            });
            row.find('.causes').append(ul);

            itemsToAppend.push(row);
        }
    }
}

function filterTableByMsg(val) {
    var logBody = $('#logsBody');

    if (val !== '') {
        logBody.find('.col-row').each(function () {
            var row = $(this);

            if (!row.hasClass('filter-user') && row.find('.col-msg').length > 0) {
                var msg = row.find('.col-msg').text().toLowerCase();

                if (msg.contains(val.toLowerCase())) {
                    row.removeClass('filter-msg');
                } else {
                    row.addClass('filter-msg');
                }
            }
        });
    } else {
        logBody.find('tr').removeClass('filter-msg');
    }
}

function filterTableByUser(val) {
    var logBody = $('#logsBody');

    if (val !== '') {
        logBody.find('.col-row').each(function () {
            var row = $(this);

            if (!row.hasClass('filter-msg') && row.find('.userName')) {
                var msg = row.find('.userName').text().toLowerCase();
                flog('User Name Found', msg);

                if (msg !== '' && msg.contains(val.toLowerCase())) {
                    row.removeClass('filter-user')
                } else {
                    row.addClass('filter-user');
                }
            }
        });
    } else {
        logBody.find('tr').removeClass('filter-user');
    }
}

function trimTable(limit) {
    if (limit === null) {
        limit = 50;
    }

    var logBody = $('#logsBody');
    var logTable = logBody.find('.col-row');
    flog('Table Size', logTable.length, 'Limit', limit)

    if (logTable.length > limit) {
        logBody.find('.col-row:lt(' + (logTable.length - limit) + ')').remove()
    }
}

function initTimeAgo() {
    $('abbr.timeago').timeago();
}

function initViewLogs(options) {
    var orgId = options.orgId;
    maxLimit = options.maxLimit;
    var logsBody = $('#logsBody');
    var txtQueryUser = $('#user-query');
    var txtQueryMessage = $('#message-query');

    var logsBodyMaxHeight = $(window).height() - 329;
    if (logsBodyMaxHeight < 300) {
        logsBodyMaxHeight = 300;
    }
    logsBody.css('max-height', logsBodyMaxHeight);

    initTimeAgo();
    initWebsockets(orgId, txtQueryUser, txtQueryMessage);

    $('.logs-clear').click(function (e) {
        e.preventDefault();

        logsBody.html('');
    });

    txtQueryUser.on('change', function () {
        var val = txtQueryUser.val();
        flog('user-query change', val);

        filterTableByUser(val);
    });

    txtQueryMessage.on('change', function () {
        var val = txtQueryMessage.val();
        flog('message-query change', val);

        filterTableByMsg(val);
    });

    $('#level-filter').val('').on('change', function () {
        var classLevel = this.value;

        if (classLevel) {
            logsBody.attr('class', classLevel);
        } else {
            logsBody.attr('class', '');
        }
    });
}