function initProductDetails() {
    jQuery("form.updateProduct").forms({
        callback: function () {
            $('#relatedAppWrap').reloadFragment({
                whenComplete: function (dom) {
                }
            });
            Msg.success("Successfully updated product!");
        }
    });
    $("#variants").on("click", ".add-variant-type", function (e) {
        e.preventDefault();
        var title = prompt("Please enter a name for the variant type, eg Colour or Size ");
        if (title !== null) {
            doCreateProductParameter(title);
        }
    });
    initHtmlEditors();
    toggleOrderInfo();
    $("#canOrderChk").change(function (event) {
        toggleOrderInfo();
    });
    initProductImages();
    initProductVariants();
    initProductVariantImgUpload();
}

function initProductVariants() {
    var modal = $("#modal-product-option");
    modal.find("form").forms({
        callback: function (resp, form) {
            flog("done", resp, form);
            if (resp.status) {
                Msg.info("Saved");
                modal.modal("hide");
                reloadVariantList();
            } else {
                Msg.error("An error occured saving the option");
            }
        }
    });

    $("#variants").on("click", ".btn-add-variant", function (e) {
        e.preventDefault();
        var target = $(e.target);
        var ppId = target.closest(".product-parameter").data("product-parameter-id");
        modal.find("input[name=productParameterId]").val(ppId);
        modal.find("input[name=productOptionId]").val("");
        modal.find("input[name=name]").val("");
        modal.find("input[name=title]").val("");
        modal.find("input[name=cost]").val("");
        flog("add variant for", ppId, modal.find("input[name=productParameterId]"));

        modal.modal("show");
    });

    $("#variants").on("click", ".btn-edit-variant", function (e) {
        e.preventDefault();
        var target = $(e.target);
        var tr = target.closest("tr");
        var ppId = target.closest(".product-parameter").data("product-parameter-id");
        modal.find("input[name=productParameterId]").val(ppId);
        var optId = target.closest("a").attr("href");
        modal.find("input[name=productOptionId]").val(optId);
        modal.find("input[name=name]").val(tr.find(".variant-name").text());
        modal.find("input[name=title]").val(tr.find(".variant-title").text());
        modal.find("input[name=cost]").val(tr.find(".variant-cost").text());
        modal.modal("show");
    });

    $('#variants').on('click', '.btn-option-img-del', function (e) {
        e.preventDefault();

        var btn = $(this);
        var optid = btn.data('optid');

        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                productOptionId: optid,
                productOptionImgUrl: false
            },
            success: function () {
                reloadVariantList();
            }
        });
    });
}

function reloadVariantList() {
    $('#variantsList').reloadFragment({
        whenComplete: function () {
            initProductVariantImgUpload();
        }
    });
}

function initProductVariantImgUpload() {
    $('.btn-option-img-upload').each(function (i, item) {
        var btn = $(item);
        var optid = btn.data('optid');

        btn.upcropImage({
            buttonContinueText: 'Save',
            url: window.location.pathname + '?productOptionId=' + optid,
            fieldName: 'variantImg',
            onCropComplete: function (resp) {
                flog("onCropComplete:", resp, resp.nextHref);
                reloadVariantList();
            },
            onContinue: function (resp) {
                flog("onContinue:", resp, resp.result.nextHref);
                $.ajax({
                    url: window.location.pathname,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        uploadedHref: resp.result.nextHref,
                        applyImage: true
                    },
                    success: function (resp) {
                        flog("success");
                        if (resp.status) {
                            Msg.info("Done");
                            reloadVariantList();
                        } else {
                            Msg.error("An error occured processing the variant image.");
                        }
                    },
                    error: function () {
                        alert('An error occured processing the variant image.');
                    }
                });
            }
        });
    });
}

function initProductImages() {
    $("#product-images").on("click", ".delete-image", function (e) {
        e.preventDefault();
        var target = $(e.target).closest("a");
        var href = target.attr("href");
        var name = getFileName(href);
        confirmDelete(href, name, function () {
            target.closest(".product-image-thumb").remove();
        });
    });
    $('#btn-change-ava').upcropImage({
        buttonContinueText: 'Save',
        url: window.location.pathname, // this is actually the default value anyway
        onCropComplete: function (resp) {
            flog("onCropComplete:", resp, resp.nextHref);
            $("#product-images").reloadFragment();
        },
        onContinue: function (resp) {
            flog("onContinue:", resp, resp.result.nextHref);
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                dataType: 'json',
                data: {
                    uploadedHref: resp.result.nextHref,
                    applyImage: true
                },
                success: function (resp) {
                    flog("success");
                    if (resp.status) {
                        Msg.info("Done");
                        $("#product-images").reloadFragment();
                    } else {
                        Msg.error("An error occured processing the product image");
                    }
                },
                error: function () {
                    alert('Sorry, we couldn\'t save your profile image.');
                }
            });
        }
    });
}

function toggleOrderInfo() {
    var chk = $("#canOrderChk:checked");
    if (chk.length > 0) {
        $(".ordering").show();
    } else {
        $(".ordering").hide();
    }
}

function doCreateProductParameter(newTitle) {
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        dataType: 'json',
        data: {
            newProductParameterTitle: newTitle
        },
        success: function (resp) {
            flog("success");
            if (resp.status) {
                Msg.info("Done");
                reloadVariantList();
            } else {
                Msg.error("An error occured creating the variant type");
            }
        },
        error: function () {
            alert('Sorry, we couldn\'t save.');
        }
    });
}