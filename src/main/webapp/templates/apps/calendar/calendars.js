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
    log("initViewEvent");
    jQuery.timeago.settings.allowFuture = true;
    $("abbr.timeago").timeago();
    initRsvpForm();
    showRsvpPanel();
    $(".rsvp-change").click(function(e) {
        e.preventDefault();
        $(".well-rsvp").hide();
        $(".rsvp-form").show(200);
    });

    var modal = $(".guests-modal");
    $(".guests-add").click(function(e) {
        e.preventDefault();
        showModal(modal);
    });

    var guestLi = null;
    var guestList = $("ul.guests");
    checkGuestList(guestList);
    guestList.on("click", "a.guest-edit", function(e) {
        guestLi = $(e.target).closest("li");
        updateModalForGuest(modal, guestLi);
        showModal(modal);
    });
    guestList.on("click", "a.guests-delete", function(e) {
        guestLi = $(e.target).closest("li");
        guestLi.remove();
        checkGuestList(guestList);
    });

    var form = modal.find("form");
    form.submit(function(e) {
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
        events: window.location.pathname,
    });
}

function initRsvpForm() {
    var form = $("form.rsvp");
    form.forms({
        validate: function() {
            // Check they've selected something
            var option = form.find("input[type=radio]:checked");
            if (option.length === 0) {
                var alert = $("<div class='alert alert-warning'><a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a>Please select an option</div>");
                form.prepend(alert);
                //alert.alert();
                return false;
            }

            // re-number guestlist inputs
            form.find("ul.guests li").each(function(row, n) {
                var li = $(n);
                li.find("input").each(function(fieldNum, inp) {
                    var i = $(inp);
                    var name = i.attr("name");
                    log("nameA", name);
                    if (name.contains(".")) {
                        name = name.substring(0, name.indexOf('.'));
                    }
                    name += "." + row;
                    i.attr("name", name);
                    log("nameB", name);
                });
            });
            return true;
        },
        callback: function() {
            alert("Thanks!");
            rsvpStatus = $("form.rsvp input[name=rsvp]:checked").val();
            showRsvpPanel();
        },
        error: function() {
            var alert = $("<div class='alert alert-danger'><a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a>Sorry, there was an error submitting your request. Please try again and contact the administrator if you still have problems.</div>");
            form.prepend(alert)
        }
    });
}

function showRsvpPanel() {
    log("showRsvpPanel", rsvpStatus);
    var toShow = null;
    if (rsvpStatus === "ACCEPTED") {
        toShow = $(".rsvp-yes");
    } else if (rsvpStatus === "DECLINED") {
        toShow = $(".rsvp-no");
    } else {
        if (userUrl) {
            toShow = $(".rsvp-form");
        } else {
            toShow = $(".rsvp-nouser");
        }
    }
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