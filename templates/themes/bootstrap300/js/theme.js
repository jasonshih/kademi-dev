/**
 *  theme.js - functions which complement the theme
 */


$(function() {
    flog("init: bootstrap300/js/theme.js")
    // just a nice little function to get classes
    $.fn.classes = function(f) {
        var c = [];
        $.each(this, function(i, v) {
            var _ = v.className.split(/\s+/);
            for (var j in _)
                '' === _[j] || c.push(_[j]);
        });
        c = $.unique(c);
        if ("function" === typeof f)
            for (var j in c)
                f(c[j]);
        return c;
    };

    // Stop the login form from disappearing
    $('.banner .dropdown-menu input, .banner .dropdown-menu label, .banner .login button').click(function(e) {
        e.stopPropagation();
    });
    // init the login form
    $(".login").user({
    });

    // setup text box resizing
    log("textarea resize");
    jQuery('textarea.autoresize').autogrow();

    flog("initTheme: run page init functions", pageInitFunctions.length);
    $.each(pageInitFunctions, function(i, f) {
        log("run function" + i);
        pageInitFunctions[i]();
        log("done run function", i);

    });
    $("table.table-tappy tbody td").click(function(e) {
        var target = $(e.target);
        if (target.is("a")) {
            return;
        }
        var td = target.closest("td");
        var href = td.find("a").attr("href");
        log("click", td, href);
        window.location.href = href;
    });
    initPrintLink();
    initVideos();
    //initCleanModals();
});

var targetModalLink;
function initCleanModals() {

    // TODO: doesnt play nicely with other modals. Need to add a class so it only applies when needed

    $("body").on("click", 'a.modalLink', function(e) {
        targetModalLink = $(e.target);
    });

    $('body').on('hidden', '.modal', function() {
        $(this).removeData('modal');
    });

    $("body").on("show", function(e) {
        var modal = $(e.target);
        var forms = modal.find("form");
        forms.find(":input").not(':button, :submit, :reset, :hidden')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected');

    });

    $("body").on("shown", function(e) {
        var modal = $(e.target);
        var forms = modal.find("form");
        forms.find("legend a.btn").remove();
        modal.find("h3").html(forms.find("legend").text());

        forms.forms({
            callback: function() {
                modal.modal("hide");
                var cont = targetModalLink.closest(".well, .container");
                if (cont.attr("id")) {
                    var url = window.location.pathname;
                    url += "?" + Math.random() + " #" + cont.attr("id") + " > *";
                    cont.load(url);
                } else {
                    window.location.reload();
                }
            }
        });
        modal.find("a.btn-primary").click(function() {
            forms.submit();
        });
    });
}

/**
 * Provided by each theme to integrate modals
 */
var lastOpenedModal;
function showModal(modal, title) {
    log("showModal-bootstrap3", modal);
    modal.find(".close-modal").remove(); // added by old fuse theme, need to remove
    if (!modal.hasClass("modal")) {
        modal.addClass("modal fade");
    }
    if (modal.find(".modal-body").length === 0) {
        modal.wrapInner("<div class='modal-body'></div>");
        var headerHtml = "<div class='modal-header'>"
                + "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>";
        if (title) {
            headerHtml += "<h4 class='modal-title'>" + title + "</h4>"
        }
        headerHtml += "</div>";
        modal.prepend(headerHtml);
    }
    if (modal.find(".modal-content").length === 0) {
        modal.wrapInner("<div class='modal-content'></div>");
        log("wrap inner", modal);
    }
    if (modal.find(".modal-dialog").length === 0) {
        modal.wrapInner("<div class='modal-dialog'></div>");
        log("wrap inner", modal);
    }
    lastOpenedModal = modal;
    log("showModal", "lastOpenedModal", lastOpenedModal);
    modal.modal();
}

function closeModals() {
    log("closeModals", $(".modal"));
    if (lastOpenedModal) {
        lastOpenedModal.modal('hide');
    }
}

function closeMyPrompt() {
    closeModals();
}

function myPrompt(id, url, title, instructions, caption, buttonName, buttonText, inputClass, inputPlaceholder, callback) {
    log("myPrompt: bootstrap300", id, url);
    var body = $("body")
    var modal = body.find("div.myprompt");
    if (modal.length === 0) {
        modal = $("" +
                "<div class='modal fade' style='display: none'>\n" +
                "    <div class='modal-dialog'>" +
                "    <div class='modal-content'>\n" +
                "    <div class='modal-header'>\n" +
                "        <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>\n" +
                "        <h3>Modal header</h3>\n" +
                "    </div>\n" +
                "    <form method='POST' class='form-horizontal'>\n" +
                "        <div class='modal-body'>\n" +
                "            <div class='pageMessage'>.</div>\n" +
                "        </div>\n" +
                "        <div class='modal-footer'>\n" +
                "            <a href='#' class='btn'>Close</a>\n" +
                "            <button type='submit' href='#' class='btn btn-primary'>Save changes</button>\n" +
                "        </div>\n" +
                "    </form>\n" +
                "    </div>" +
                "    </div>" +
                "</div>");
        modal.attr("id", id);
        body.append(modal);
    }
    modal.find(".modal-header").text(title);
    var form = modal.find("form");
    form.attr("action", url);
    form.find(".modal-body").append("<p class='notes'></p>");
    form.find(".notes").html(instructions);
    form.find(".modal-body").append("<div class='form-group'><label class='col-md-4 control-label' for='inputEmail'>label</label><div class='col-md-8'><input type='text' id='inputEmail' required='true' class='required form-control'></div></div>");

    var row1 = form.find(".form-group");
    var inputId = id + "_" + buttonName;
    row1.find("input").addClass(inputClass);
    row1.find("input").attr("name", buttonName).attr("id", inputId).attr("placeholder", inputPlaceholder);
    row1.find("label").attr("for", inputId).text(caption);
    form.find(".btn-primary").text(buttonText);

    form.submit(function(e) {
        log("submit");
        e.preventDefault();
        resetValidation(form);
        if (checkRequiredFields(form)) {
            var newName = form.find("input").val();
            if (callback(newName, form)) {
                closeModals();
                modal.remove();
            }
        }
    });

    modal.find("a.btn").click(function() {
        closeModals();
    });

    showModal(modal);
}

