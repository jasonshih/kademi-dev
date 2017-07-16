// were getting two change events for one click, so quick and dirty flag to prevent double submissions
function initApps() {
    flog("initApps", $("div.appsContainer"));
    $("div.appsContainer").on("switchChange.bootstrapSwitch", ".CheckBoxWrapper input[type=checkbox]", function (e, state) {
        var chk = $(this);
        flog('Enabled=' + state, chk);

        if (chk.prop('disabled')) {
            flog("already processing");
            return;
        }
        chk.prop('disabled', true); // prevent user from double clicking while in progress

        if (state) {
            setEnabled(chk.val(), state, function () {
                chk.closest("tr").addClass("enabled");
            }, chk);
            if (chk.closest('tr').data('iscore')) {
                chk.closest('.CheckBoxWrapper').empty();
            }
        } else {
            setEnabled(chk.val(), state, function () {
                chk.closest("tr").removeClass("enabled");
            }, chk);
        }
    });

    $("div.appsContainer").on("click", "button.settings", function (e) {
        e.preventDefault();
        var modal = $("#settings_" + $(this).attr("rel"));
        flog("show", $(this), $(this).attr("rel"), modal);
    });

    initSettingsForms();
    initUpdates();
    initAppSearchers();
    initAppBuilder();

    //$(document.body).on('hidden.bs.modal', '.modal', function () {
    //    var modal = $(this);
    //    var form = modal.find('form');
    //    resetForm(form);
    //});
}

function initUpdates() {
    $("body").on("click", ".update-all-apps", function (e) {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            dataType: "json",
            data: {
                updateAll: true
            },
            success: function (data) {
                Msg.info("Updated dependencies. Reloading page..");
                window.location.reload();
            },
            error: function (resp) {
                flog("error", resp);
                Msg.error("Could not update dependencies");
            }
        });
    });
}

function initAppBuilder() {
    var modal = $("#addAppModal");
    var form = modal.find("form");

    form.forms({
        onSuccess: function (resp) {
            flog("done", resp);
            modal.modal('hide');
            Msg.success(form.find('[name=newAppName]').val() + ' is created!');
            $('#my-apps-body').reloadFragment();
        }
    });

    $(document.body).on('click', '.btn-delete-app', function (e) {
        e.preventDefault();
        var btn = $(this);
        var href = btn.attr('href');
        var tr = btn.closest('tr');
        var title = tr.find('.appTitle').text();

        confirmDelete(href, title, function () {
            tr.remove();
        });
    });
}

function initAppSearchers() {
    $('#txt-search-app').domFinder({
        container: $('.appsContainer'),
        items: 'tr',
        filter: function (items, query) {
            query = query.toLowerCase();

            return items.filter(function () {
                var text = ($(this).find('h4').text() || '').toLowerCase();

                return text.indexOf(query) !== -1;
            });
        },
        showItems: function (items) {
            items.css('display', '');
        }
    });

    $('#txt-search-app-builder').domFinder({
        container: $('#custom-apps'),
        items: 'tbody tr',
        filter: function (items, query) {
            query = query.toLowerCase();

            return items.filter(function () {
                var tds = $(this).find('td').not('.action');
                for (var i = 0; i < tds.length; i++) {
                    var text = (tds.eq(i).text() || '').toLowerCase();

                    if (text.indexOf(query) !== -1) {
                        return true;
                    }
                }

                return false;
            });
        },
        showItems: function (items) {
            items.css('display', '');
        }
    });
}

function initSettingsForms() {
    $("td.CheckBoxWrapper input:checked").closest("tr").addClass("enabled");
    $(".settings form").forms({
        onSuccess: function (resp) {
            flog("done save", resp);
            $('.modal').modal('hide');
            //initSettingsForms();
            // Close modal auto by timeout
            //setTimeout(function(){ $('.modal').modal('hide'); }, 1000);
            Msg.info("Saved settings");
        }
    });

}

function setEnabled(appId, isEnabled, success, chk) {
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        dataType: "json",
        data: {
            appId: appId,
            enabled: isEnabled
        },
        success: function (data) {
            chk.prop('disabled', false);
            flog("response", data);
            if (!data.status) {
                Msg.error("Failed to set status: " + data.messages);
                chk.bootstrapSwitch('state', !isEnabled);
                return;
            }
            success(data);
            $('#settings_' + appId).reloadFragment({
                whenComplete: function () {
                    initSettingsForms();
                }
            });
        },
        error: function (resp) {
            chk.prop('disabled', false);
            flog("error", resp);
            Msg.error("Could not change application. Please check your internet connection, and that you have permissions");
        }
    });
}