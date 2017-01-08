/**
 * Created by Anh on 7/19/2016.
 */
$(function () {
    $("form.entryForm").forms({
        onSuccess: function (resp, form) {
            flog("onSuccess", resp, form);
            var f = $(form);
            flog("hide", f);
            f.hide(1000);
            f.closest(".competitionForm").find(".thankyou").show(1000);
        }
    });
    $("#myUploaded").mupload({
        url: "uploads/",
        buttonText: "Upload a photo",
        oncomplete: function (data, name, href) {
            $("form input[name=userAttachmentHash]").val(name);
            var divViewUploaded = $("div.viewUploaded");
            var img = divViewUploaded.find("img");
            if (img.length == 0) {
                img = $("<img/>");
                divViewUploaded.empty();
                divViewUploaded.append(img);
            }
            img.attr("src", "uploads/" + name + "/alt-150-150.png");
            pulseBorder(divViewUploaded);
        }
    });

    var rewardQuizes = $(".viewQuiz");
    rewardQuizes.each(function (i, n) {
        var quiz = $(n);
        var json = quiz.text();
        quiz.text("");
        quiz.formRender({
            dataType: 'json',
            formData: json,
            labelClasses : "control-label",
            inputClasses : "form-control"
        });
        quiz.show();
    });

    checkViewUploaded();
});
function checkViewUploaded() {
    var div = $(".viewUploaded");
    log("checkViewUploaded", div);
    if (div.find("img").length == 0) {
        div.addClass("noImage");
    } else {
        div.removeClass("noImage");
    }
}