(function () {

    function initUpdateSku() {
        $("#productsTableBody").on("change", ".input-sku", function (e) {
            var target = $(e.target);
            var newSku = target.val();

            var row = target.closest('tr');
            var productId = row.data("product");
            var skuId = row.data("skuid");
            var options = row.data("options");
            updateSku(productId, options, skuId, newSku);
        });

        $("#productsTableBody").on("keypress", ".input-sku", function (e) {
            if ((e.keyCode || e.which) == keymap.ENTER) {
                var target = $(e.target);
                var newSku = target.val();

                var row = target.closest('tr');
                var productId = row.data("product");
                var skuId = row.data("skuid");
                var options = row.data("options");
                updateSku(productId, options, skuId, newSku);
            }
        });
    }

    function initUpdateSkuTitle() {
        $("#productsTableBody").on("change", ".input-sku-Title", function (e) {
            var target = $(e.target);
            var newSkuTitle = target.val();
            var row = target.closest('tr');
            var skuId = row.data("skuid");

            updateSkuTitle(skuId, newSkuTitle);
        });

        $("#productsTableBody").on("keypress", ".input-sku-Title", function (e) {
            if ((e.keyCode || e.which) == keymap.ENTER) {
                var target = $(e.target);
                var newSkuTitle = target.val();
                var row = target.closest('tr');
                var skuId = row.data("skuid");

                updateSkuTitle(skuId, newSkuTitle);
            }
        });
    }

    function initUpdateBaseCost() {
        $("#productsTableBody").on("change", ".input-sku-baseCost", function (e) {
            var target = $(e.target);
            var newSkuTitle = target.val();
            var row = target.closest('tr');
            var skuId = row.data("skuid");

            updateSkuBaseCost(skuId, newSkuTitle);
        });
    }

    function initUpdateSkuStock() {
        $("#productsTableBody").on("change", ".input-sku-stock", function (e) {
            var target = $(e.target);
            var newSkuStock = target.val();
            var locid = target.data('locid');
            var row = target.closest('tr');
            var skuId = row.data("skuid");

            updateSkuStock(skuId, locid, newSkuStock);
        });
    }

    function initUploadSkuImage() {
        $('body').on('click', '.btn-option-img', function (e) {
            e.preventDefault();

            var btn = $(this);
            var row = btn.closest('tr');
            var skuId = row.data("skuid");
            var imgHashes = row.data('selectableimg').split(',');

            $('#modal-option-img').find('input[name=skuId]').val(skuId);
            $('#modal-option-img').find('.img-list').empty();
            for (var i in imgHashes) {
                var hash = imgHashes[i];
                var imgDiv = '<div class="col-xs-6 col-md-3 product-image-thumb">'
                        + '    <a href="' + hash + '" class="thumbnail select-opt-img"><img src="/_hashes/files/' + hash + '/alt-150-150.png"/></a>'
                        + '    <a class="btn-image-selected btn btn-xs btn-success" style="display: none;" href="/_hashes/files/' + hash + '">'
                        + '        <span class="fa fa-check"></span>'
                        + '    </a>'
                        + '</div>';

                $('#modal-option-img').find('.img-list').append(imgDiv);
            }

            $('#modal-option-img').modal('show');
        });

        $('body').on('click', '.select-opt-img', function (e) {
            e.preventDefault();

            $('#modal-option-img').find('.btn-image-selected ').removeClass('image-selected');

            var img = $(this);
            img.closest('div').find('.btn-image-selected ').addClass('image-selected');
            var hash = img.attr('href');

            var form = img.closest('form');
            form.find('input[name=updateSkuImageHash]').val(hash);
        });

        $('body').on('click', '.image-change', function (e) {
            e.preventDefault();

            var btn = $(this);
            var row = btn.closest('tr');
            var skuId = row.data("skuid");
            var imgHashes = row.data('selectableimg').split(',');

            $('#modal-option-img').find('input[name=skuId]').val(skuId);
            $('#modal-option-img').find('.img-list').empty();
            for (var i in imgHashes) {
                var hash = imgHashes[i];
                var imgDiv = '<div class="col-xs-6 col-md-3 product-image-thumb">'
                        + '    <a href="' + hash + '" class="thumbnail select-opt-img"><img src="/_hashes/files/' + hash + '/alt-150-150.png"/></a>'
                        + '    <a class="btn-image-selected btn btn-xs btn-success" style="display: none;" href="/_hashes/files/' + hash + '">'
                        + '        <span class="fa fa-check"></span>'
                        + '    </a>'
                        + '</div>';

                $('#modal-option-img').find('.img-list').append(imgDiv);
            }

            $('#modal-option-img').find('input[name=skuId]').val(skuId);

            $('#modal-option-img').modal('show');
        });

        $('#modal-option-img').find('form').forms({
            callback: function (resp) {
                $('#modal-option-img').modal('hide');
                reloadSkuTable();
            }
        });

        $('body').on('click', '.btn-sku-img-del', function (e) {
            e.preventDefault();

            var btn = $(this);
            var row = btn.closest('tr');
            var skuId = row.data("skuid");

            removeSkuImage(skuId);
        });

        $('body').on('hidden.bs.modal', '#modal-option-img', function () {
            $('#modal-option-img').find('input[name=updateSkuImageHash]').val(null);
            $('#modal-option-img').find('input[name=skuId]').val(null);
            $('#modal-option-img').find('.btn-image-selected ').removeClass('image-selected');
        });
    }

    function initSkuImgUpload() {
        $('.btn-option-img-upload').each(function (i, item) {
            var btn = $(item);
            var row = btn.closest('tr');
            var skuId = row.data("skuid");

            btn.upcropImage({
                buttonContinueText: 'Save',
                url: window.location.pathname + '?skuId=' + skuId,
                fieldName: 'skuImg',
                onCropComplete: function (resp) {
                    flog("onCropComplete:", resp, resp.nextHref);
                    reloadSkuTable();
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
                                reloadSkuTable();
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

    function updateSku(productId, options, skuId, newSku) {
        $.ajax({
            type: 'POST',
            url: window.href,
            data: {
                productId: productId,
                skuId: skuId,
                options: options,
                updateSku: newSku
            },
            dataType: "json",
            success: function (resp) {
                if (resp.status) {
                    Msg.success(resp.messages);
                    reloadSkuTable();
                } else {
                    Msg.error(resp.messages);
                }
            },
            error: function (resp) {
                Msg.error("An error occured setting the SKU");
            }
        });
    }

    function updateSkuTitle(skuId, newSkuTitle) {
        $.ajax({
            type: 'POST',
            url: window.href,
            data: {
                skuId: skuId,
                updateSkuTitle: newSkuTitle
            },
            dataType: "json",
            success: function (resp) {
                if (resp.status) {
                    Msg.success(resp.messages);
                    reloadSkuTable();
                } else {
                    Msg.error(resp.messages);
                }
            },
            error: function (resp) {
                Msg.error("An error occured setting the SKU Title");
            }
        });
    }

    function updateSkuBaseCost(skuId, newSkuBaseCost) {
        $.ajax({
            type: 'POST',
            url: window.href,
            data: {
                skuId: skuId,
                updateSkuBaseCost: newSkuBaseCost
            },
            dataType: "json",
            success: function (resp) {
                if (resp.status) {
                    Msg.success(resp.messages);
                    reloadSkuTable();
                } else {
                    Msg.error(resp.messages);
                }
            },
            error: function (resp) {
                Msg.error("An error occured setting the SKU Base Cost");
            }
        });
    }

    function updateSkuStock(skuId, locId, newStock) {
        $.ajax({
            type: 'POST',
            url: window.href,
            data: {
                skuId: skuId,
                locId: locId,
                updateSkuStock: newStock
            },
            dataType: "json",
            success: function (resp) {
                if (resp.status) {
                    Msg.success(resp.messages);
                    reloadSkuTable();
                } else {
                    Msg.error(resp.messages);
                }
            },
            error: function (resp) {
                Msg.error("An error occured setting the SKU stock");
            }
        });
    }

    function removeSkuImage(skuId) {
        $.ajax({
            type: 'POST',
            url: window.href,
            data: {
                skuId: skuId,
                removeSkuImg: true
            },
            dataType: "json",
            success: function (resp) {
                if (resp.status) {
                    Msg.success(resp.messages);
                    reloadSkuTable();
                } else {
                    Msg.error(resp.messages);
                }
            },
            error: function (resp) {
                Msg.error("An error occured removing the SKU Image");
            }
        });
    }

    function reloadSkuTable() {
        $("#productsTableBody").reloadFragment({
            whenComplete: function () {
                initSkuImgUpload();
            }
        });
    }

    // Run Init functions
    $(function () {
        initUpdateSku();
        initUpdateSkuTitle();
        initUpdateBaseCost();
        initUploadSkuImage();
        initSkuImgUpload();
        initUpdateSkuStock();
    });

})();