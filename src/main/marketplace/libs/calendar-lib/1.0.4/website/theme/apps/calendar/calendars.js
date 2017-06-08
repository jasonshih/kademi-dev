function initCalendar() {
    initFullCalendar();
    jQuery.timeago.settings.allowFuture = true;
    $("abbr.timeago").timeago();
}

function initEvents(){
    jQuery.timeago.settings.allowFuture = true;
    $("abbr.timeago").timeago();
    $('.eventFormAllowRegistration').each(function(){
        initViewEvent($(this));
    });
}

function initViewEvent(rootElement) {
    var rsvpStatus = rootElement.attr('data-rsvpStatus');
    flog("initViewEvent");
    initRsvpForm(rootElement);
    showRsvpPanel(rootElement, rsvpStatus);

    rootElement.find('.rsvp-nouser button').click(function (e) {
        var rsvpStatus = rootElement.attr('data-rsvpStatus');
        showRsvpPanel(rootElement, rsvpStatus);
    });
    rootElement.find(".rsvp-change").click(function (e) {
        e.preventDefault();
        rootElement.find(".well-rsvp").hide();
        rootElement.find(".rsvp-form").show(200);
    });

    var modal = rootElement.find(".guests-modal");
    rootElement.find(".guests-add").click(function (e) {
        e.preventDefault();
        showModal(modal);
    });

    var guestLi = null;
    var guestList = rootElement.find("ul.guests");
    checkGuestList(guestList, rootElement);
    guestList.on("click", "a.guest-edit", function (e) {
        guestLi = $(e.target).closest("li");
        updateModalForGuest(modal, guestLi);
        showModal(modal);
    });
    guestList.on("click", "a.guests-delete", function (e) {
        guestLi = $(e.target).closest("li");
        guestLi.remove();
        checkGuestList(guestList, rootElement);
    });

    rootElement.on('hidden.modal.bs', '.guests-modal', function () {
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
        checkGuestList(guestList, rootElement);
        if (Msg) {
            Msg.info("Thank you for registering");
        } else {
            alert("Thank you")
        }
    });

    rootElement.on('click', '.guest-view', function(e){
        e.preventDefault();

        var m = rootElement.find('.attendees-modal');
        m.find('.guestName').text($(this).siblings('[name=guestName]').val());
        m.find('.guestEmail').text($(this).siblings('[name=guestEmail]').val());
        m.find('.guestOrgName').text($(this).siblings('[name=guestOrgName]').val());
        m.modal();
    });
}

function initFullCalendar() {
    $('.calendar-container').each(function(){
        if($(this).find('table').length > 0) return;
        var calendar = $(this).attr('data-calendar');
        var eventsUrl = calendar? '/Calendars/'+calendar : window.location.pathname;
        $(this).fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            editable: false,
            allDayDefault: false,
            events: eventsUrl
        });
    });
}

function initRsvpForm(rootElement) {
    var rsvpForm = rootElement.find("form.rsvp");
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
        callback: function (resp) {
            // only called when resp.status = true
            var rsvpStatus = rootElement.find("form.rsvp input[name=rsvp]:checked").val();
            showRsvpPanel(rootElement, rsvpStatus);
            if (rootElement.find('.attendeesWrap').length){
                var id = rootElement.find('.attendeesWrap').attr('id');
                $('#'+id).reloadFragment();
            }
        },
        errorHandler: function (response, form, valiationMessageSelector, errorCallback) {
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
                            callback: function (resp) {
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
            } else {
                ajaxLoadingOff();
                alert("Sorry, for some reason we couldnt register your attendance. Maybe you could try again, or contact the site administrator for help");
            }
        },
        error: function () {
            //var alert = $("<div class='alert alert-danger'><a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a>Sorry, there was an error submitting your request. Please try again and contact the administrator if you still have problems.</div>");
            //rsvpForm.prepend(alert)
        }
    });
}

function showRsvpPanel(rootElement, rsvpStatus) {
    flog("showRsvpPanel", rsvpStatus);
    var toShow = null;
    if (rsvpStatus === "ACCEPTED") {
        var numGuests = rootElement.find("ul.guests li").length;
        rootElement.find(".num-guests-count").text(numGuests + "");
        toShow = rootElement.find(".rsvp-yes");
    } else if (rsvpStatus === "DECLINED") {
        toShow = rootElement.find(".rsvp-no");
    } else {
        if (userUrl) {
            toShow = rootElement.find(".rsvp-form");
        } else {
            toShow = rootElement.find(".rsvp-form");
        }
    }
    flog("showRsvpPanel: showing", toShow);
    rootElement.find(".well-rsvp").not(toShow).hide();
    toShow.show(200);
}


function checkGuestList(guestList, rootElement) {
    if (guestList.find("li").length > 0) {
        rootElement.find(".guests-intro").show();
    } else {
        rootElement.find(".guests-intro").hide();
    }

}

function updateModalForGuest(modal, li) {
    modal.find(".newGuestFirstName").val(li.find("input[name=guestFirstName]").val());
    modal.find(".newGuestSurname").val(li.find("input[name=guestSurname]").val());
    modal.find(".newGuestEmail").val(li.find("input[name=guestEmail]").val());
    modal.find(".newGuestOrg").val(li.find("input[name=guestOrgName]").val());
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
    var fullName = form.find(".newGuestFirstName").val() + " " + form.find(".newGuestSurname").val();
    li.find("a.guest-edit").text(fullName);
    li.find("b").text(form.find(".newGuestOrg").val());
    li.find("input[name=guestFirstName]").val(form.find(".newGuestFirstName").val());
    li.find("input[name=guestSurname]").val(form.find(".newGuestSurname").val());
    li.find("input[name=guestEmail]").val(form.find(".newGuestEmail").val());
    li.find("input[name=guestOrgName]").val(form.find(".newGuestOrg").val());

}