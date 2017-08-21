function startImport() {
    $("form.importForm").forms({
        confirmMessage: "Processing, Please Wait...",
        onSuccess: function (resp) {
            flog("The import process was started", resp);
            Msg.success("The import process was started");
        }
    });
}