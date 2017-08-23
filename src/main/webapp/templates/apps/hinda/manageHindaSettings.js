function hindaApp() {
    startSaveSettings();
    startImport();
}

function startImport() {
    $("form.importForm").forms({
        confirmMessage: "Processing, Please Wait...",
        onSuccess: function (resp) {
            flog("The import process was started", resp);
            Msg.success("The import process was started");
        }
    });
}

function startSaveSettings() {
    $("#hindaForm").forms({
        confirmMessage: "Processing, Please Wait...",
        onSuccess: function (resp) {
            flog("The settings were updated", resp);
            Msg.success("The settings were updated");
            $('#settings-content').reloadFragment({
                whenComplete: function () {
                    hindaApp();
                }
            });
        }
    });
}
