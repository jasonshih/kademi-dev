function initManageLanguages() {
    flog('initManageLanguages');

    initCreateLanguage();
    initUpdateLanguage();
    initDeleteLanguages();
}

function initCreateLanguage() {
    jQuery("form.createLanguage").forms({
        onSuccess: function (resp) {
            $("#addLanguageModal").find("#languageId").remove();
            $("#addLanguageModal").find("#action").attr("name", "newLanguage");
            $("#addLanguageModal").find("#languageCode").val("");
            $("#addLanguageModal").find("#title").val("");
            flog("The operation was successfully", resp);
            Msg.success("The operation was successfully");
            $('#languageTableContainer').reloadFragment();
            $("#addLanguageModal").modal('hide');
        },
        error: function (resp) {
            flog('Error: ', resp);
        }
    });
}

function initUpdateLanguage() {
    flog("initUpdateLanguage");
    $('body').on('click', '.editLanguage', function (e) {
        e.preventDefault();
        var id = $(this).attr("lang-id");
        var row = $("#" + id);
        var code = $(row.find("td")[0]).html();
        var title = $(row.find("td")[1]).html();
        $("#addLanguageModal").find("#languageCode").val(code);
        $("#addLanguageModal").find("#title").val(title);
        $("#addLanguageModal").find("#action").attr("name", "updateLanguage");
        $("#addLanguageModal").find("form").append("<input type='hidden' id='languageId' value='" + id + "' name='languageId' />");
        $("#addLanguageModal").modal('show');
    });
}


function initDeleteLanguages() {
    $('body').on('click', '.btn-delete-languages', function (e) {
        e.preventDefault();
        var listToDelete = [];
        $('body').find(':checkbox.language-check:checked').each(function () {
            var s = $(this);
            var id = s.data("id");
            listToDelete.push(id);
        });
        flog("List To Delete", listToDelete.join(','));
        if (listToDelete.length > 0 && confirm("Are you sure you want to delete " + listToDelete.length + " languages?")) {
            $('body').find('.check-all').check(false).change();
            deleteLanguages(listToDelete.join(','));
        } else {
            Msg.error('Please select the languages you want to remove by clicking the checkboxes on the right');
        }
    });

    $('body').on('change', '.check-all', function (e) {
        flog($(this).is(":checked"));
        var checkedStatus = this.checked;
        $('body').find(':checkbox.language-check').each(function () {
            $(this).prop('checked', checkedStatus);
        });
    });
}

function deleteLanguages(listToDelete) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: window.location.pathname,
        data: {
            deleteLanguages: listToDelete,
        },
        success: function (data) {
            if (data.status) {
                Msg.info(data.messages);
                $("#languageTableContainer").reloadFragment();
            } else {
                Msg.error("An error occured deleting the languages. Please check your internet connection");
            }
        },
        error: function (resp) {
            Msg.error("An error occured deleting the languages");
        }
    });
}
