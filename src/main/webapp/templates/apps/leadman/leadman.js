$(function () {
    flog("leadman.js - init");

    jQuery.timeago.settings.allowFuture = true;

    initNewLeadForm();
    initNewQuickLeadForm();
    initNewContactForm();
    initNewNoteForm();
    initTakeTasks();
    initLeadActions();
    initOrgSelector();
    initDateTimePickers();
    initTasks();
    initImmediateUpdate();
    initCloseDealModal();
    initCancelLeadModal();
    initCancelTaskModal();
    initTopNavSearch();
    initOrgSearch();
    initProfileSearch();
    initGpsTracking();
    initAudioPlayer();


    // Clear down modals when closed
    $('body').on('hidden.bs.modal', '.modal', function () {
        $(this).removeData('bs.modal');
    });
    $('body').on('shown.bs.modal', function (e) {
        flog("modal show");
        var modal = $(this);
        jQuery.timeago.settings.allowFuture = true;
        modal.find('abbr.timeago').timeago();
        modal.find('.date-time').datetimepicker({
            format: "DD/MM/YYYY HH:mm"
                    //,startDate: date
        });
        var form = modal.find(".completeTaskForm");
        flog("complete task form", form);
        if (form.length > 0) {
            form.forms({
                onSuccess: function (resp) {
                    flog("onSuccess", resp, modal);
                    form.closest(".modal").modal("hide");
                    flog("done");
                    reloadTasks();
                }
            });
        }
    })
    $("body").on("click", ".autoFillText", function (e) {
        e.preventDefault();
        var target = $(e.target).closest("a");
        var text = target.text();
        var inp = target.closest(".input-group").find("input[type=text]");
        flog("autofill", text, inp);
        inp.val(text);
    });
    $('abbr.timeago').timeago();
});

function initCloseDealModal() {
    var closeDealModal = $("#closeDealModal");
    closeDealModal.find("form").forms({
        callback: function (resp) {
            Msg.info('Deal marked as closed');
            //window.location.reload();
        }
    });
}

function initCancelLeadModal() {
    var cancelDealModal = $("#cancelDealModal");
    cancelDealModal.find("form").forms({
        callback: function (resp) {
            Msg.info('Lead cancelled');
            reloadTasks();
            cancelDealModal.modal("hide");
        }
    });

    $("body").on("click", ".btnLeadCancelLead", function (e) {
        e.preventDefault();
        var href = $(e.target).attr("href");
        cancelDealModal.find("form").attr("action", href);
        cancelDealModal.modal("show");
    });
}

function initCancelTaskModal() {
    var cancelDealModal = $("#cancelTaskModal");
    cancelDealModal.find("form").forms({
        callback: function (resp) {
            Msg.info('Task cancelled');
            reloadTasks();
            cancelDealModal.modal("hide");
        }
    });

    $("body").on("click", ".btnCancelTask", function (e) {
        e.preventDefault();
        var href = $(e.target).closest("a").attr("href");
        flog("set href", href);
        cancelDealModal.find("form").attr("action", href);
        cancelDealModal.modal("show");
    });
}



function initImmediateUpdate() {
    var onchange = function (e) {
        flog("field changed", e);
        var target = $(e.target);
        var href = target.data("href");
        var name = target.attr("name");
        var value = target.val();
        var oldValue = target.data("original-value");
        if (value != oldValue) {
            updateField(href, name, value);
        }
    };
    $("body").on("change", ".immediateUpdate", function (e) {
        onchange(e);
    });
    $("body").on("dp.change", ".immediateUpdate", function (e) {
        onchange(e);
    });
}

function initTasks() {
    $("body").on("click", "#assignToMenu a", function (e) {
        e.preventDefault();
        var name = $(e.target).attr("href");
        assignTo(name);
    });
    $("body").on("click", ".btnTaskDelete", function (e) {
        e.preventDefault();
        var link = $(e.target).closest("a");
        var href = link.attr("href");
        var name = getFileName(href);
        confirmDelete(href, name, function () {
            var modal = link.closest(".modal");
            modal.modal("hide");
            $("a[href='" + href + "']").closest(".task").remove();
        });
    });
    $("body").on("click", ".btnTaskDone", function (e) {
        flog("click");
        e.preventDefault();
        $(".completeTaskDiv").show(300);
        $(".hideOnComplete").hide(300);
    });
}

function initOrgSelector() {
    flog("initOrgSelector", $(".selectOrg a"));
    $(".selectOrg").on("click", "a", function (e) {
        e.preventDefault();
        var orgId = $(e.target).closest("a").attr("href");
        flog("initOrgSelector - click", orgId);
        $.cookie("org", orgId);
        window.location.reload();
    });
}

function initLeadActions() {
    flog("initLeadActions");
    $("body").on("click", ".closeLead", function (e) {
        flog("initLeadActions click - close");
        e.preventDefault();
        var href = $(e.target).closest("a").attr("href");
        closeLead(href);
    });
    $("body").on("click", ".cancelLead", function (e) {
        flog("initLeadActions click - cancel");
        e.preventDefault();
        var href = $(e.target).closest("a").attr("href");
        cancelLead(href);
    });

}


function initTakeTasks() {
    $("body").on("click", ".takeTask", function (e) {
        flog("click");
        e.preventDefault();
        var href = $(e.target).attr("href");
        takeTask(href);
    });
}


function initNewLeadForm() {
    flog("initNewLeadForm");
    var modal = $('#newLeadModal');
    var form = modal.find('form');

    modal.on('hidden.bs.modal', function () {
        form.trigger('reset');
        $('input[name=newOrgId]', form).val('');
    });

    $('#newOrgTitle', form).on('change', function () {
        var inp = $(this);

        if (inp.val().length < 1) {
            $('input[name=newOrgId]', form).val('');
        }
    });

    $(".createLead").click(function (e) {
        flog("initNewLeadForm - click");
        e.preventDefault();
        var funnelName = $(e.target).closest("a").attr("href");
        form.find("select").val(funnelName);
        modal.modal("show");

    });

    form.forms({
        onSuccess: function (resp, form, config, event) {
            flog('done new lead', resp, event);
            var btn = form.find(".clicked");
            //flog("btn", btn, btn.hasClass("btnCreateAndClose"));

            if (btn.hasClass("btnCreateAndClose")) {
                Msg.info('Saved new lead');
                modal.modal("hide");
            } else {
                Msg.info('Saved, going to the new lead');
                if (resp.nextHref) {
                    window.location.href = resp.nextHref;
                }
                modal.modal("hide");
            }
        }
    });
    form.find("button").click(function (e) {
        form.find(".clicked").removeClass("clicked");
        $(e.target).closest("a, button").addClass("clicked");
    });
}

function initNewQuickLeadForm() {
    var modal = $('#newQuickLeadModal');
    var form = modal.find('form');
    var formData = null;

    $('body').on('click', '.createQuickLead', function (e) {
        e.preventDefault();
        var funnelName = $(this).attr("href");

        modal.find('input[name=quickLead]').val(funnelName);
        formData = new FormData();

        modal.modal('show');
    });

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    var audio_context = new AudioContext();
    var recorder = null;

    navigator.getUserMedia({audio: true}, function (stream) {
        var input = audio_context.createMediaStreamSource(stream);
        recorder = new Recorder(input);
        flog('Recording init complete');

        modal.on('click', '#recordMemo', function (e) {
            e.preventDefault();

            var btn = $(this);
            if (btn.hasClass('btn-success')) { // Not Recording
                recorder && recorder.record();
                btn.removeClass('btn-success').addClass('btn-danger');
                formData = null;
                $('.audio-rec', form).empty();
                $('.audio-rec', form).hide();
                $('.recording', modal).show();
            } else { // Recording
                recorder && recorder.stop();
                recorder && recorder.exportWAV(function (blob) {
                    var url = URL.createObjectURL(blob);

                    $('.audio-rec', form).html('<audio controls="true" src="' + url + '"></audio>');
                    $('.audio-rec', form).show();
                    flog('Audio URL', url);
                    recorder.clear();
                    formData = new FormData();
                    formData && formData.append('recording', blob, 'recording_' + (new Date()).getTime() + '.wav');
                });
                btn.removeClass('btn-danger').addClass('btn-success');
                $('.recording', modal).hide();
            }
        });
    }, function (e) {
        flog('No live audio input: ' + e, e);
        $('.voiceMemo', form).remove();
    });

    modal.on('hidden.bs.modal', function (e) {
        form.trigger('reset');
        $('.audio-rec', form).empty();
        $('.audio-rec', form).hide();
    });

    form.on('submit', function (e) {
        e.preventDefault();

        if (formData == null) {
            formData = new FormData();
        }

        var images = $('input[name=image]', form)[0];
        $.each(images.files, function (i, file) {
            formData.append(images.name, file);
        });

        formData.append('notes', $('[name=notes]', form).val());
        formData.append('quickLead', $('[name=quickLead]', form).val());

        $.ajax({
            type: 'POST',
            url: '/leads/',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data, textStatus) {
                flog('Success', data, textStatus);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                flog('Error', textStatus, errorThrown);
            }
        });
    });
}

function initNewContactForm() {
    var modal = $('#newContactModal');
    var form = modal.find('form');

    $(".createContact").click(function (e) {
        flog("click");
        e.preventDefault();
        modal.modal("show");
    });

    form.forms({
        callback: function (resp) {
            if (resp.nextHref) {
                window.location.href = resp.nextHref;
            }
            Msg.info('Created contact');
            modal.modal("hide");
        }
    });
}

function initNewNoteForm() {
    var modal = $('#newNoteModal');
    var form = modal.find('form');

    $(".createNote").click(function (e) {
        e.preventDefault();
        var href = $(e.target).closest("a").attr("href");
        form.attr("action", href);
        modal.modal("show");
    });

    form.forms({
        callback: function (resp) {
            if (resp.nextHref) {
                window.location.href = resp.nextHref;
            }
            Msg.info('Created note');
            modal.modal("hide");
        }
    });
}


function reloadTasks() {
    $("#tasksList").reloadFragment({
        whenComplete: function () {
            $('abbr.timeago').timeago();
        }
    });
}

function takeTask(href) {
    $.ajax({
        type: 'POST',
        url: href,
        data: {
            assignToName: "me" // special value
        },
        dataType: 'json',
        success: function (resp) {
            if (resp && resp.status) {
                Msg.info("Assigned task");
                reloadTasks();
            } else {
                Msg.error("Sorry, we couldnt assign the task");
            }
        },
        error: function (resp) {
            flog('error', resp);
            Msg.error('Sorry couldnt assign the task ' + resp);
        }
    });
}

function closeLead(href) {
    setLead(href, "closeDeal", "close this lead, ie sale has been completed");
}
function cancelLead(href) {
    setLead(href, "cancelDeal", "cancel this lead");
}
function setLead(href, status, actionDescription) {
    flog("SetLead", href, status);
    if (confirm("Are you sure you want to " + actionDescription + "?")) {
        var data = {};
        data[status] = "";
        $.ajax({
            type: 'POST',
            url: href,
            data: data,
            dataType: 'json',
            success: function (resp) {
                if (resp && resp.status) {
                    Msg.info(actionDescription + " ok");
                    $(".leadsList").each(function (i, n) {
                        $(n).reloadFragment({
                            whenComplete: function () {
                                $('abbr.timeago').timeago();
                            }
                        });
                    });
                } else {
                    Msg.error("Sorry, we couldnt " + actionDescription);
                }
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('Sorry couldnt ' + actionDescription + ' - ' + resp);
            }
        });
    }
}


function initDateTimePickers() {
    var date = new Date();
    date.setDate(date.getDate() - 1);

    $('.date-time').datetimepicker({
        format: "DD/MM/YYYY HH:mm"
                //,startDate: date
    });
}


function assignTo(name) {
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        data: {
            assignToName: name
        },
        dataType: 'json',
        success: function (resp) {
            if (resp && resp.status) {
                Msg.info("Assigned");
                $("#assignedBlock").reloadFragment();
            } else {
                Msg.error("Sorry, we couldnt change the assignment");
            }
        },
        error: function (resp) {
            flog('error', resp);
            Msg.error('Sorry couldnt set the visibility ' + resp);
        }
    });
}

function updateField(href, fieldName, fieldValue) {
    var data = {};
    data[fieldName] = fieldValue;
    flog("updateField", href, data, fieldName, fieldValue);
    $.ajax({
        type: 'POST',
        url: href,
        data: data,
        dataType: 'json',
        success: function (resp) {
            Msg.info("Saved " + fieldName);
            reloadTasks();
        },
        error: function (resp) {
            flog('error', resp);
            Msg.error('Sorry couldnt save field ' + fieldName);
        }
    });
}

function initTopNavSearch() {
    flog('initTopNavSearch');

    var txt = $('#lead-search-input');
    var suggestionsWrapper = $('#lead-search-suggestions');
    var backdrop = $('<div />', {
        id: 'lead-search-backdrop',
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
        url: '/leads',
        type: 'GET',
        data: {
            q: query
        },
        dataType: 'JSON',
        success: function (resp) {
            flog('Got search response from server', resp);

            var suggestionStr = '';

            if (resp && resp.hits && resp.hits.total > 0) {
                for (var i = 0; i < resp.hits.hits.length; i++) {
                    var suggestion = resp.hits.hits[i];
                    var leadId = suggestion.fields.leadId[0];
                    var email = suggestion.fields['profile.email'][0];
                    var firstName = suggestion.fields['profile.firstName'] ? suggestion.fields['profile.firstName'][0] : '';
                    var surName = suggestion.fields['profile.surName'] ? suggestion.fields['profile.surName'][0] : '';

                    suggestionStr += '<li class="suggestion">';
                    suggestionStr += '    <a href="/leads/' + leadId + '">';
                    suggestionStr += '        <span class="email">' + email + '</span>';
                    if (firstName || surName) {
                        suggestionStr += '    <br /><small class="text-muted">' + firstName + ' ' + surName + '</small>';
                    }
                    suggestionStr += '    </a>';
                    suggestionStr += '</li>';
                }
            } else {
                suggestionStr = '<li>No result.</li>';
            }

            suggestionsWrapper.html(suggestionStr).removeClass('hide');
            //backdrop.removeClass('hide');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            flog('Error when doTopNavSearch with query: ' + query, jqXHR, textStatus, errorThrown);
        }
    });
}

function initOrgSearch() {
    var orgSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '/leads?orgSearch=%QUERY',
            wildcard: '%QUERY'
        }
    });

    $('#newOrgTitle').typeahead({
        highlight: true
    }, {
        display: 'title',
        limit: 10,
        source: orgSearch,
        templates: {
            empty: [
                '<div class="empty-message">',
                'No existing companies were found.',
                '</div>'
            ].join('\n'),
            suggestion: Handlebars.compile(
                    '<div>'
                    + '<strong>{{title}}</strong>'
                    + '</br>'
                    + '<span>{{phone}}</span>'
                    + '</br>'
                    + '<span>{{address}}, {{addressLine2}}, {{addressState}}, {{postcode}}</span>'
                    + '</div>')
        }
    });

    $('#newOrgTitle').bind('typeahead:select', function (ev, sug) {
        var inp = $(this);
        var form = inp.closest('form');

        form.find('input[name=newOrgId]').val(sug.orgId);
    });
}

function initProfileSearch() {
    var profileSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '/leads?profileSearch=%QUERY',
            wildcard: '%QUERY'
        }
    });

    $('#newUserFirstName').typeahead({
        highlight: true
    }, {
        display: 'firstName',
        limit: 10,
        source: profileSearch,
        templates: {
            empty: [
                '<div class="empty-message">',
                'No existing contacts were found.',
                '</div>'
            ].join('\n'),
            suggestion: Handlebars.compile(
                    '<div>'
                    + '<strong>{{name}}</strong>'
                    + '</br>'
                    + '<span>{{phone}}</span>'
                    + '</br>'
                    + '<span>{{email}}</span>'
                    + '</div>')
        }
    });

    $('#newUserFirstName').bind('typeahead:select', function (ev, sug) {
        var inp = $(this);
        var form = inp.closest('form');

        form.find('input[name=firstName]').val(sug.firstName);
        form.find('input[name=surName]').val(sug.surName);
        form.find('input[name=email]').val(sug.email);
        form.find('input[name=phone]').val(sug.phone);
    });
}

function initGpsTracking() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function (position) {
            flog(position.coords.latitude, position.coords.longitude);
        }, function () {

        });
    } else {
        flog('GeoLocation not supported');
    }
}

function initAudioPlayer() {
    $('#files').on('click', '.play-audio', function (e) {
        e.preventDefault();

        var btn = $(this);
        var pId = btn.data('id');

        var player = $('#' + pId);
        var playerDom = player[0];

        if (playerDom.paused) {
            $('.lead-audio-file').trigger('pause');
            playerDom.play();
        } else {
            playerDom.pause();
        }
    });

    $('.lead-audio-file').on('playing', function (e) {
        var player = $(this);
        var td = player.closest('td');
        var btn = td.find('.play-audio');

        btn.find('i').removeClass('fa-play').addClass('fa-pause');
    });

    $('.lead-audio-file').on('pause', function (e) {
        var player = $(this);
        var td = player.closest('td');
        var btn = td.find('.play-audio');

        btn.find('i').removeClass('fa-pause').addClass('fa-play');
    });

    $('.lead-audio-file').on('timeupdate', function (e) {
        var player = $(this);
        var td = player.closest('td');
        var span = td.find('.lead-audio-duration');
        span.html(formatSecondsAsTime(this.currentTime) + '/' + formatSecondsAsTime(this.duration));
    });

    /* Populate all players with their time */
    var audioFiles = $('.lead-audio-file');
    audioFiles.on('loadedmetadata', function () {
        var player = $(this);
        var td = player.closest('td');
        var span = td.find('.lead-audio-duration');
        span.html(formatSecondsAsTime(this.currentTime) + '/' + formatSecondsAsTime(this.duration));
    });
}

function formatSecondsAsTime(secs, format) {
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600)) / 60);
    var sec = Math.floor(secs - (hr * 3600) - (min * 60));

    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }

    return min + ':' + sec;
}