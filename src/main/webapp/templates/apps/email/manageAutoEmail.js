var c = {};

function initManageAutoEmails() {
    initModalAddEmailTrigger();
    initFolderDragDrop();
    initDefaultDragDrop();
    initCategoryButtons();
    initDeleteEmail();
    flog("init dup", $("#email-trigger-wrapper"));
    $("body").on("click", ".btn-dup-email", function (e) {
        e.preventDefault();
        var name = $(e.target).attr("href");
        duplicate(name);
    });
}

function initModalAddEmailTrigger() {
    var modal = $('#modal-add-trigger');
    flog("initModalAddEmail", modal);
    modal.find('form').forms({
        validate: function (form) {
            flog("manageEmail.js: check radio", form);
            return checkRadio("eventId", form);
        },
        callback: function (data) {
            flog('saved ok', data);
            modal.modal('hide');
            Msg.success($('#name').val() + ' is created!');
            $('#email-trigger-wrapper').reloadFragment({
                whenComplete: function () {
                    initDefaultDragDrop();
                }
            });
        }
    });
}

var p;
function initManageAutoEmail() {
    flog("initManageAutoEmail");
    initHtmlEditors($('.htmleditor'), getStandardEditorHeight(), null, null, 'autogrow');
    initAttachment();
    initFormDetailEmail();
    initIncludeUser();
    initEventType();
    initAdvanceRecipients();
    initSendTest();
    initChooseGroup();

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
            '<span class="article-name">' +
            '<a target="_blank" href="/_hashes/files/' + hash + '">' + name + '</a>' +
            '</span>' +
            '<aside class="article-action">' +
            '<a class="btn btn-xs btn-danger btn-delete-attachment" href="' + name + '" title="Remove"><i class="clip-minus-circle"></i></a>' +
            '</aside>' +
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

function initDefaultDragDrop() {
    $("#email-trigger-wrapper .email-row").draggable({
        helper: "clone",
        revert: "invalid",
        axis: "y",
        start: function (event, ui) {
            c.helper = ui.helper;
        }
    });

    $("#email-trigger-wrapper").droppable({
        accept: ".email-row",
        greedy: true,
        drop: function (event, ui) {
            var row = ui.draggable.css({position: "relative", top: "", left: ""});
            var seriesName = row.data("seriesname");
            categoryAjax(seriesName, "changeCategory=changeCategory", seriesName, function (name, resp) {
                //window.location.reload();
            });
            $(this).find("tbody").append(row);

            $(c.helper).remove();
        }
    });
}

function initFolderDragDrop() {
    $(".category").droppable({
        accept: ".email-row",
        greedy: true,
        drop: function (event, ui) {
            var row = ui.draggable.css({position: "relative", top: "", left: ""});
            var seriesName = row.data("seriesname");
            var categoryID = $(this).attr("id");
            categoryAjax(seriesName, "changeCategory=changeCategory&categoryID=" + categoryID, seriesName, function (name, resp) {
                //window.location.reload();
            });
            $(this).find("tbody").append(row);

            $(c.helper).remove();
        }
    });
    
    $("#category-wrapper .email-row").draggable({
        helper: "clone",
        revert: "invalid",
        axis: "y",
        start: function (event, ui) {
            c.helper = ui.helper;
        }
    });
}

function initCategoryButtons() {
    $('body').on('click', '.btn-add-category', function (e) {
        var categoryTitle = prompt("Please enter a category title", "");
        flog(categoryTitle);
        if (categoryTitle !== null && categoryTitle.trim() !== "") {
            categoryAjax(categoryTitle, "createCategory=createCategory&categoryTitle=" + categoryTitle.trim(), null, function (name, resp) {
                window.location.reload();
            });
        }
    });

    $("body").on('click', '.btn-rename-category', function (e) {
        e.preventDefault();
        var catTitle = $(this).data("catname");
        var catID = $(this).attr("href");
        var categoryTitle = prompt("Please enter a category title", catTitle);
        if (categoryTitle != null || categoryTitle != "") {
            categoryAjax(categoryTitle, "updateCategory=updateCategory&categoryTitle=" + categoryTitle + "&categoryID=" + catID, null, function (name, resp) {
                window.location.reload();
            });
        }
    });

    $("body").on('click', '.btn-delete-category', function (e) {
        e.preventDefault();
        var catID = $(this).attr("href");
        var catTitle = $(this).data("catname");
        var categoryTitle = confirm("Are you sure you want to delete " + catTitle);
        if (categoryTitle) {
            categoryAjax(categoryTitle, "deleteCategory=deleteCategory&categoryID=" + catID, null, function (name, resp) {
                window.location.reload();
            });
        }
    });
}

function categoryAjax(name, data, url, callback) {
    $.ajax({
        type: 'POST',
        url: window.location.pathname + (url || ""),
        data: data,
        success: function (resp) {
            $('body').trigger('ajaxLoading', {
                loading: false
            });
            if (callback) {
                callback(name, resp);
            }
        },
        error: function (resp) {
            log('error', resp);
            $('body').trigger('ajaxLoading', {
                loading: false
            });
            if (resp.status === 400) {
                alert('Sorry, the category could not be created. Please check if a category with that name already exists');
            } else {
                alert('There was a problem creating the folder');
            }
        }
    });
}