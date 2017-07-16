function initAndPopulateLeadForm(editable, saveOnly) {
    var formData = $.trim($("#form-data").html()) === '' ? {} : JSON.parse($("#form-data").html());
    
    if (editable && saveOnly) {
        $("#save-button").html("Save Details");
    } else if (editable && !saveOnly) {
        $("#save-button").html("Submit Form");
    } else {
        $("#save-button").remove();
    }

    $.each(formData, function (key, value) {
        var input = $("[name='" + key + "']");

        if (input.is("select")) {
            $("[name='" + key + "'] [value='" + value + '"]').prop("selected", true);
        } else if (input.is(":checkbox")) {
            input.prop("checked", true);
        } else if (input.is(":radio")) {
            input = $("[name='" + key + "'][value='" + value + "']");
            input.prop("checked", true);
        } else {
            $("[name='" + key + "']").val(value);
        }
    });

    if (!editable) {
        $(":input").prop("disabled", true);
    } else {
        $("form").forms({
            onSuccess: function (resp) {
                flog("done", resp);

                if (saveOnly) {
                    Msg.info("Form details are saved successfully");
                } else {
                    $("#container-content").html("<h1>Thank you!</h1><p style=\"margin-top: 30px;\">We have received your feedback, we will get to you shortly!</p>");
                }
            }
        });
    }
}