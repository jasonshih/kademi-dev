function initRegister(afterRegisterHref) {
    log("init labels")
    var form = $("#registerForm");
    var lastTabIndex = 0;
    jQuery("#registerForm label.collapse").each(function(i, n) {
        var label = jQuery(n);
        var title = label.text();
        var input = form.find("#" + label.attr("for"));
        input.attr("title", title);
        input.attr("tabindex", i + 1);
        log("set tab index", input, i + 1);
        label.text(i + 1);
        lastTabIndex = i + 2;
    });
    form.find("button[type=submit]").attr("tabindex", lastTabIndex);
    initRegisterForms(afterRegisterHref);
}

function initRegisterForms(afterRegisterHref, callback) {
    log("initRegisterForms - bootstrap300", jQuery("#registerForm"));
    $("#registerForm").forms({
        validationFailedMessage: "Please enter your details below.",
        callback: function(resp, form) {
            if (resp.messages && resp.messages[0] == "pending") {
                showPendingMessage();
            } else {
                log("created account ok, logging in...", resp, form);
                var userName = form.find("input[name=email]").val();
                var password = form.find("input[name=password]").val();
                doLogin(userName, password, {
                    afterLoginUrl: afterRegisterHref,
                    urlSuffix: "/.dologin",
                    loginCallback: callback
                }, this);
            }
        }
    });
    $.getScript("/theme/js/typeahead.js", function() {
        var searchUrl = $("#registerForm").attr("action");
        $("#orgName").typeahead({
            minLength: 1,
            valueKey: "title",
            name: "orgs",
            remote: searchUrl + '?jsonQuery=%QUERY&th', // set the 'th' flag to get responses in typeahead format
            template: function (datum) {
                return '<div>' + datum.title + ' ' + datum.address + '</span></div>'
            }
        });
        $("#orgName").on("typeahead:selected", function(e, datum) {
            log("Selected", e, datum);
            $("#orgId").val(datum.orgId);
        });
    });


    function showPendingMessage() {
        showModal($("#pending"));
    }
}
