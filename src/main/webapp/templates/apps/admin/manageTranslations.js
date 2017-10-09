function initManageTranslations() {
    flog('initManageTranslations');
    initSearchTranslation();
    initCreateTranslation();
    initDeleteTranslations();
}

function initManageTranslation() {
    flog('initManageTranslation');
    initUpdateTranslation();
}

function initSearchTranslation() {
    $("#translation-query").keyup(function () {
        typewatch(function () {
            flog("do search");
            doTranslationSearch();
        }, 500);
    });
    $("#search-language").change(function () {
        doTranslationSearch();
    });
}

function doTranslationSearch() {
    flog("doTranslationSearch");
    var query = $("#translation-query").val();
    var lang = $("#search-language").val();

    flog("doSearch", query, lang);
    var url = new URL(window.location.href);
    url.searchParams.set('q', query);
    url.searchParams.set('lang', lang);


    //var newUrl = window.location.href + "?q=" + query + "&lang=" + lang;
    var newUrl = url.toString();
    window.history.replaceState("", "", newUrl);
    $.ajax({
        type: 'GET',
        url: newUrl,
        success: function (data) {
            //flog("success", data);
            var fragment = $(data).find("#translations-list");
            //flog("frag", fragment, $("#translations-list"));
            $("#translations-list").replaceWith(fragment);
        },
        error: function (resp) {
            Msg.error("An error occured doing the search. Please check your internet connection and try again");
        }
    });
}

function initCreateTranslation() {
    jQuery("form.createTranslation").forms({
        onSuccess: function (resp) {
            flog("The operation was successfully", resp);
            Msg.success("The operation was successfully");
            $('#translationTableContainer').reloadFragment();
            $("#addTranslationModal").modal('hide');
        },
        error: function (resp) {
            flog('Error: ', resp);
            $("#addTranslationModal").modal('hide');
        }
    });
}

function initUpdateTranslation() {
    jQuery("form.updateTranslation").forms({
        onSuccess: function (resp) {
            flog("The translation was updated successfully", resp);
            Msg.success("The translation was updated successfully");
            $('#translationTableContainer').reloadFragment();
        },
        error: function (resp) {
            flog('Error: ', resp);
        }
    });
}



function initDeleteTranslations() {
    $('body').on('click', '.btn-delete-translations', function (e) {
        e.preventDefault();
        var listToDelete = [];
        $('body').find(':checkbox.translation-check:checked').each(function () {
            var s = $(this);
            var id = s.data("id");
            listToDelete.push(id);
        });
        flog("List To Delete", listToDelete.join(','));
        if (listToDelete.length > 0 && confirm("Are you sure you want to delete " + listToDelete.length + " translations?")) {
            $('body').find('.check-all').check(false).change();
            deleteTranslations(listToDelete.join(','));
        } else {
            Msg.error('Please select the translations you want to remove by clicking the checkboxes on the right');
        }
    });

    $('body').on('change', '.check-all', function (e) {
        flog($(this).is(":checked"));
        var checkedStatus = this.checked;
        $('body').find(':checkbox.translation-check').each(function () {
            $(this).prop('checked', checkedStatus);
        });
    });
}

function deleteTranslations(listToDelete) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: window.location.pathname,
        data: {
            deleteTranslations: listToDelete,
        },
        success: function (data) {
            if (data.status) {
                Msg.info(data.messages);
                $("#translationTableContainer").reloadFragment();
            } else {
                Msg.error("An error occured deleting the translations. Please check your internet connection");
            }
        },
        error: function (resp) {
            Msg.error("An error occured deleting the translations");
        }
    });
}