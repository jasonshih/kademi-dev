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

    initOrgSearchPromo();
    initSkuSearchPromo();

    $(".go-again").click(function(e) {
        e.preventDefault();
        var f = $(e.target);
        var div = f.closest(".competitionForm");
        div.find(".reset-on-resubmit").val("");
        div.find(".thankyou").hide(1000);
        div.find(".entryForm").show(1000);
    });
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

function initOrgSearchPromo() {
    var orgSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: window.location.pathname + '?searchOrgs=%QUERY',
            wildcard: '%QUERY'
        }
    });

    $('.relatedOrgTitlePromo').typeahead({
        highlight: true
    }, {
        display: 'title',
        limit: 10,
        source: orgSearch,
        templates: {
            empty: [
                '<div class="empty-message">',
                'No existing stores were found.',
                '</div>'
            ].join('\n'),
            suggestion: Handlebars.compile(
                '<div>'
                + '<strong>{{title}}</strong>'
                + '</div>')
        }
    });

    $('.relatedOrgTitlePromo').bind('typeahead:select', function (ev, sug) {
        var inp = $(this);
        var form = inp.closest('form');

        form.find('input[name=relatedOrg]').val(sug.orgId);
    });
}

function initSkuSearchPromo() {
    var orgSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: window.location.pathname + '?searchProducts=%QUERY',
            wildcard: '%QUERY',
            filter: function(data) {
                var newData = data.map(function(item){
                    item.tokens.splice(2, 1);
                    return {value: item.value, skuTitle: item.tokens.join(' - ')}
                })
                return newData;
            }
        }
    });

    $('.relatedProductSkuTitlePromo').typeahead({
        highlight: true
    }, {
        display: 'skuTitle',
        limit: 10,
        source: orgSearch,
        templates: {
            empty: [
                '<div class="empty-message">',
                'No existing SKUs were found.',
                '</div>'
            ].join('\n'),
            suggestion: Handlebars.compile(
                '<div>'
                + '<span>{{skuTitle}}</span>'
                + '</div>')
        }
    });

    $('.relatedProductSkuTitlePromo').bind('typeahead:select', function (ev, sug) {
        var inp = $(this);
        var form = inp.closest('form');

        form.find('input[name=relatedProductSku]').val(sug.value);
    });
}