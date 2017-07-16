function initCalendarsHome() {
    initFullCalendar();
    jQuery.timeago.settings.allowFuture = true;
    $("abbr.timeago").timeago();
}

function initCalendar() {
    initFullCalendar();
    jQuery.timeago.settings.allowFuture = true;
    $("abbr.timeago").timeago();
}

function initViewEvent() {
    flog("initViewEvent");
    jQuery.timeago.settings.allowFuture = true;
    $("abbr.timeago").timeago();
    initRsvpForm();
    showRsvpPanel();
    $(".rsvp-change").click(function (e) {
        e.preventDefault();
        $(".well-rsvp").hide();
        $(".rsvp-form").show(200);
    });

    var modal = $(".guests-modal");
    $(".guests-add").click(function (e) {
        e.preventDefault();
        showModal(modal);
    });

    var guestLi = null;
    var guestList = $("ul.guests");
    checkGuestList(guestList);
    guestList.on("click", "a.guest-edit", function (e) {
        guestLi = $(e.target).closest("li");
        updateModalForGuest(modal, guestLi);
        showModal(modal);
    });
    guestList.on("click", "a.guests-delete", function (e) {
        guestLi = $(e.target).closest("li");
        guestLi.remove();
        checkGuestList(guestList);
    });

    $(document.body).on('hidden.modal.bs', '.guests-modal', function () {
        var modal = $(this);
        var form = modal.find('form');

        resetForm(form);
    });

    var form = modal.find("form");
    form.submit(function (e) {
        e.preventDefault();
        try {
            if (guestLi) {
                updateGuest(form, guestLi);
            } else {
                insertGuest(form, guestList);
            }
        } finally {
            guestLi = null;
        }
        closeModals();
        checkGuestList(guestList);
        if (Msg) {
            Msg.info("Thank you for registering");
        } else {
            alert("Thank you")
        }
    });

    $(document).on('click', '.guest-view', function(e){
        e.preventDefault();

        var m = $('.attendees-modal');
        m.find('.guestName').text($(this).siblings('[name=guestName]').val());
        m.find('.guestEmail').text($(this).siblings('[name=guestEmail]').val());
        m.find('.guestOrgName').text($(this).siblings('[name=guestOrgName]').val());
        m.modal();
    });
}

function initFullCalendar() {
    $('.calendar-container').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        allDayDefault: false,
        events: window.location.pathname
    });
}

function initRsvpForm() {
    var rsvpForm = $("form.rsvp");
    rsvpForm.forms({
        validate: function () {
            // Check they've selected something
            var option = rsvpForm.find("input[type=radio]:checked");
            if (option.length === 0) {
                return {error: 1, errorFields: ['rsvp'], errorMessages: ['Please select an option']};
            }

            // re-number guestlist inputs
            rsvpForm.find("ul.guests li").each(function (row, n) {
                var li = $(n);
                li.find("input").each(function (fieldNum, inp) {
                    var i = $(inp);
                    var name = i.attr("name");
                    flog("nameA", name);
                    if (name.contains(".")) {
                        name = name.substring(0, name.indexOf('.'));
                    }
                    name += "." + row;
                    i.attr("name", name);
                    flog("nameB", name);
                });
            });
            return true;
        },
        onSuccess: function (resp) {
            // only called when resp.status = true
            rsvpStatus = $("form.rsvp input[name=rsvp]:checked").val();
            showRsvpPanel();
            $('#attendeesWrap').length && $('#attendeesWrap').reloadFragment();
        },
        onError: function (response, form) {
            if (response.fieldMessages.length > 0 && response.fieldMessages[0].field === "userData") {
                // show modal prompting for name details
                jQuery.ajax({
                    type: 'GET',
                    url: "/profile/",
                    success: function (resp) {
                        flog("setStatusComplete: profile get complete");
                        var page = $(resp);
                        var form = page.find("div.details form");
                        form.find("h4").remove();
                        form.find("legend").text("In order to register for this event you must provide the following information.");
                        form.find("#firstName").addClass("required");
                        form.find("#surName").addClass("required");
                        form.find("button").hide();
                        form.attr("action", "/profile/");
                        form.forms({
                            onSuccess: function (resp) {
                                if (resp.status) {
                                    closeModals();
                                    rsvpForm.submit();
                                } else {
                                    alert("Sorry, we couldnt update your details, please try again");
                                }
                            }
                        });
                        var modal = $("#userDataModal");
                        modal.find("button").click(function (e) {
                            flog("submit form", e);
                            e.preventDefault();
                            e.stopPropagation();
                            form.submit();
                        });
                        modal.find(".modal-body").html(form);
                        flog("got profile page", resp);
                        showModal(modal);

                    },
                    error: function (resp) {
                        ajaxLoadingOff();
                        flog("setStatusComplete: profile get failed");
                        alert("Very sorry, but something went wrong while attempting to complete your module. Could you please refresh the page and try again?");

                    }
                });
            } else if (response.fieldMessages.length > 0 && response.fieldMessages[0].field === "groupCalendarRequired") {
                ajaxLoadingOff();
                alert("In order to register for this event you must be in at least one of the calendar's groups.");
            } else {
                ajaxLoadingOff();
                alert("Sorry, for some reason we couldnt register your attendance. Maybe you could try again, or contact the site administrator for help");
            }
        }
    });
}

function showRsvpPanel() {
    flog("showRsvpPanel", rsvpStatus);
    var toShow = null;
    if (rsvpStatus === "ACCEPTED") {
        var numGuests = $("ul.guests li").length;
        $(".num-guests-count").text(numGuests + "");
        toShow = $(".rsvp-yes");
    } else if (rsvpStatus === "DECLINED") {
        toShow = $(".rsvp-no");
    } else {
        if (userUrl) {
            toShow = $(".rsvp-form");
        } else {
            toShow = $(".rsvp-form");
            //toShow = $(".rsvp-nouser");
        }
    }
    flog("showRsvpPanel: showing", toShow);
    $(".well-rsvp").not(toShow).hide();
    toShow.show(200);
}


function checkGuestList(guestList) {
    if (guestList.find("li").length > 0) {
        $(".guests-intro").show();
    } else {
        $(".guests-intro").hide();
    }

}

function updateModalForGuest(modal, li) {
    $("#newGuestFirstName").val(li.find("input[name=guestFirstName]").val());
    $("#newGuestSurname").val(li.find("input[name=guestSurname]").val());
    $("#newGuestEmail").val(li.find("input[name=guestEmail]").val());
    $("#newGuestOrg").val(li.find("input[name=guestOrgName]").val());
}

function insertGuest(form, guestList) {
    var html = "<li>" +
        "<a class='pull-right guests-delete' href='#'><span class='glyphicon glyphicon-remove-circle'></span></a>" +
        "<a href='#' class='guest-edit'>Guest</a> of <b>org</b>" +
        "<input type='hidden' name='guestFirstName' value=''/>" +
        "<input type='hidden' name='guestSurname' value=''/>" +
        "<input type='hidden' name='guestEmail' value=''/>" +
        "<input type='hidden' name='guestOrgName' value=''/>" +
        "</li>";
    var li = $(html);
    guestList.append(li);
    updateGuest(form, li);
}

function updateGuest(form, li) {
    var fullName = $("#newGuestFirstName").val() + " " + $("#newGuestSurname").val();
    li.find("a.guest-edit").text(fullName);
    li.find("b").text($("#newGuestOrg").val());
    li.find("input[name=guestFirstName]").val($("#newGuestFirstName").val());
    li.find("input[name=guestSurname]").val($("#newGuestSurname").val());
    li.find("input[name=guestEmail]").val($("#newGuestEmail").val());
    li.find("input[name=guestOrgName]").val($("#newGuestOrg").val());

}