
// were getting two change events for one click, so quick and dirty flag to prevent double submissions
function initApps() {
    flog("initApps", $("div.appsContainer"));
    $("div.appsContainer").on("switchChange.bootstrapSwitch", ".CheckBoxWrapper input[type=checkbox]", function () {
        chk = $(this);
        flog("changed", this);
        if (chk.prop('disabled')) {
            flog("already processing");
            return;
        }
        chk.prop('disabled', true); // prevent user from double clicking while in progress
        var isChecked = chk.is(":checked")
        if (isChecked) {
            setEnabled(chk.val(), true, function () {
                chk.closest("tr").addClass("enabled");
            }, chk);
            if (chk.closest('tr').data('iscore')) {
                chk.closest('.CheckBoxWrapper').empty();
            }
        } else {
            setEnabled(chk.val(), false, function () {
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

    //$(document.body).on('hidden.bs.modal', '.modal', function () {
    //    var modal = $(this);
    //    var form = modal.find('form');
    //    resetForm(form);
    //});
}

function initSettingsForms() {
    $("td.CheckBoxWrapper input:checked").closest("tr").addClass("enabled");
    $(".settings form").forms({
        callback: function (resp) {
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
                whenComplete: function(){
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