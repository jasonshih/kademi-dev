$(function () {
    initNewLeadForm();
    initNewContactForm();
    initNewNoteForm();
    initTakeTasks();
    initLeadActions();
});

function initLeadActions() {
    $("body").on("click", ".closeLead", function (e) {
        flog("click");
        e.preventDefault();
        var href = $(e.target).closest("a").attr("href");
        closeLead(href);
    });
    $("body").on("click", ".cancelLead", function (e) {
        flog("click");
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
    var modal = $('#newLeadModal');
    var form = modal.find('form');

    $(".createLead").click(function (e) {
        flog("click");
        e.preventDefault();
        var funnelName = $(e.target).closest("a").attr("href");
        form.find("select").val(funnelName);
        modal.modal("show");
    });

    form.forms({
        callback: function (resp) {
            flog('done new user', resp);
            if (resp.nextHref) {
                window.location.href = resp.nextHref;
            }
            Msg.info('Saved');
            modal.modal("hide");
        }
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
                $("#tasksList").reloadFragment({
                            whenComplete : function() {
                                $('abbr.timeago').timeago();
                            }
                        });
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
                            whenComplete : function() {
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
