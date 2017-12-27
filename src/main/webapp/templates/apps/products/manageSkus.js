(function () {
    $('#data-query').on('input', function () {
        typewatch(function () {
            doHistorySearch();
        }, 500);
    });

    $('#pointsFooter a').on('click', function (e) {
        e.preventDefault();
        var uri = e.target.href;

        $.ajax({
            type: 'GET',
            url: uri,
            success: function (data) {
                flog('success', data);
                window.history.pushState('', document.title, uri.toString());

                var newDom = $(data);

                var $tableContent = newDom.find('#productsTableContainer');
                $('#productsTableContainer').replaceWith($tableContent);

                initUpdateSku();
                initUpdateSkuTitle();
                initUpdateBaseCost();
                initProductsCsv();
                initUpdateSkuStock();
                initLoadSkuStockQuantity();
            },
            error: function (resp) {
                Msg.error('err');
            }
        });
    });


    function doHistorySearch() {
        flog('doHistorySearch');

        Msg.info('Doing search...', "manageSKUs", 2000);

        var data = {
            dataQuery: $('#data-query').val(),
        };
        flog('data', data);

        $('.btn-export-points').attr('href', 'skus.csv?' + $.param(data));

        var target = $('#pointsTable');
        target.load();


        var link = window.location.pathname + '?' + $.param(data);
        flog('new link', link);

        $.ajax({
            type: 'GET',
            url: link,
            dataType: 'html',
            success: function (content) {
                flog('response', content);
                Msg.info('Search complete', "manageSKUs", 2000);
                var newBody = $(content).find('#pointsTable');

                target.replaceWith(newBody);
                history.pushState(null, null, link);

                initUpdateSku();
                initUpdateSkuTitle();
                initUpdateBaseCost();
                initProductsCsv();
                initUpdateSkuStock();
                initLoadSkuStockQuantity();
            }
        });
    }

    function initProductsCsv() {
        var modalUploadCsv = $('#modal-upload-csv');

        var resultUploadCsv = modalUploadCsv.find('.upload-results');
        $('#do-upload-csv').mupload({
            buttonText: '<i class="clip-folder"></i> Upload spreadsheet',
            url: 'skus.csv',
            useJsonPut: false,
            oncomplete: function (data, name, href) {
                flog('oncomplete:', data.result.data, name, href);
                resultUploadCsv.find('.num-updated').text(data.result.data.numUpdated);
                resultUploadCsv.find('.num-unmatched').text(data.result.data.unmatched.length);
                showUnmatched(resultUploadCsv, data.result.data.unmatched);
                resultUploadCsv.show();
                Msg.success('Upload completed. Please review any unmatched members below, or refresh the page to see the updated list of products');
                setTimeout(
                        function () {
                            $('#productsTableContainer').reloadFragment();
                        }
                , 500);

            }
        });
    }

    function showUnmatched(resultUploadCsv, unmatched) {
        var unmatchedTable = resultUploadCsv.find('table');
        var tbody = unmatchedTable.find('tbody');
        tbody.html('');
        $.each(unmatched, function (i, row) {
            flog('unmatched', row);
            var tr = $('<tr>');
            $.each(row, function (ii, field) {
                tr.append('<td>' + field + '</td>');
            });
            tbody.append(tr);
        });
    }

    function initUpdateSku() {
        $('#productsTableBody').on('change', '.input-sku', function (e) {
            var target = $(e.target);
            var newSku = target.val();

            var row = target.closest('tr');
            var td = row.find('td:first-child');
            var rowId = row.attr('id');
            var productId = td.data('productid');
            var skuId = td.data('skuid');
            var options = td.data('options');

            updateSku(productId, options, skuId, newSku, rowId);
        });

        $('#productsTableBody').on('keyup', '.input-sku', function (e) {
            if ((e.keyCode || e.which) == keymap.ENTER) {
                var target = $(e.target);
                var newSku = target.val();

                var row = target.closest('tr');
                var td = row.find('td:first-child');
                var rowId = row.attr('id');
                var productId = td.data('productid');
                var skuId = td.data('skuid');
                var options = td.data('options');

                updateSku(productId, options, skuId, newSku, rowId);
            }
        });
    }

    function initUpdateSkuTitle() {
        $('#productsTableBody').on('change', '.input-sku-Title', function (e) {
            var target = $(this);
            var newSkuTitle = target.val();
            var row = target.closest('tr');
            var td = row.find('td:first-child');
            var rowId = row.attr('id');
            var skuId = td.data('skuid');

            updateSkuTitle(skuId, newSkuTitle, rowId);
        });

        $('#productsTableBody').on('keyup', '.input-sku-Title', function (e) {
            if ((e.keyCode || e.which) == keymap.ENTER) {
                var target = $(e.target);
                var newSkuTitle = target.val();
                var row = target.closest('tr');
                var td = row.find('td:first-child');
                var rowId = row.attr('id');
                var skuId = td.data('skuid');

                updateSkuTitle(skuId, newSkuTitle, rowId);
            }
        });
    }

    function initUpdateBaseCost() {
        $('#productsTableBody').on('change', '.input-sku-baseCost', function (e) {
            var target = $(e.target);
            var newSkuTitle = target.val();
            var row = target.closest('tr');
            var td = row.find('td:first-child');
            var rowId = row.attr('id');
            var skuId = td.data('skuid');

            updateSkuBaseCost(skuId, newSkuTitle, rowId);
        });
    }

    function initUpdateSkuStock() {
        $('#productsTableBody').on('change', '.input-sku-stock', function (e) {
            var target = $(e.target);
            var newSkuStock = target.val();
            var locid = target.data('locid');
            var row = target.closest('tr');
            var td = row.find('td:first-child');
            var rowId = row.attr('id');
            var skuId = td.data('skuid');

            updateSkuStock(skuId, locid, newSkuStock, rowId);
        });
    }

    function initLoadSkuStockQuantity() {
        $('#productsTableBody').find('.input-sku-stock').each(function (i, item) {
            var input = $(item);
            var locId = input.data('locid');
            var row = input.closest('tr');
            var td = row.find('td:first-child');
            var skuId = td.data('skuid');

            $.ajax({
                url: '/_stock',
                type: 'GET',
                dataType: 'JSON',
                data: {
                    stockQuantity: true,
                    inventoryLocationId: locId,
                    productSkuId: skuId
                },
                success: function (resp) {
                    var stock = 0;
                    if (resp.status) {
                        stock = resp.data.stock;
                    }

                    input.val(stock);
                }
            });
        });
    }

    function loadSkuStockQuantity(r) {
        $(r).find('.input-sku-stock').each(function (i, item) {
            var input = $(item);
            var locId = input.data('locid');
            var row = input.closest('tr');
            var td = row.find('td:first-child');
            var skuId = td.data('skuid');

            $.ajax({
                url: '/_stock',
                type: 'GET',
                dataType: 'JSON',
                data: {
                    stockQuantity: true,
                    inventoryLocationId: locId,
                    productSkuId: skuId
                },
                success: function (resp) {
                    var stock = 0;
                    if (resp.status) {
                        stock = resp.data.stock;
                    }

                    input.val(stock);
                }
            });
        });
    }

    function initUploadSkuImage() {
        var modalChangeImg = $('#modal-change-img');

        $(document.body).on('click', '.btn-change-img', function (e) {
            e.preventDefault();

            var btn = $(this);
            var row = btn.closest('tr');
            var td = row.find('td:first-child');
            var skuId = td.data('skuid');
            var selectedImage = td.find('.thumbnail').attr('data-select-image');
            selectedImage = selectedImage.replace('/_hashes/files/', '');
            var imgHashes = (td.attr('data-selectableimg') || '').trim();
            imgHashes = imgHashes === '' ? [] : imgHashes.split(',');

            modalChangeImg.find('input[name=skuId]').val(skuId);
            modalChangeImg.attr('data-rowid', row.attr('id'));

            var imgsStr = '';
            for (var i = 0; i < imgHashes.length; i++) {
                var hash = imgHashes[i];

                imgsStr += '<div class="col-xs-6 col-md-3">';
                imgsStr += '    <a href="javascript:void(0)" data-hash="' + hash + '" class="thumbnail btn-select-img ' + (hash === selectedImage ? 'active' : '') + '"><img src="/_hashes/files/' + hash + '/alt-150-150.png"/></a>';
                imgsStr += '</div>';
            }

            modalChangeImg.find('.img-list').html(imgsStr);
            modalChangeImg.modal('show');
        });

        modalChangeImg.on('click', '.btn-select-img', function (e) {
            e.preventDefault();

            var btn = $(this);

            if (!btn.hasClass('active')) {
                var hash = btn.attr('data-hash');
                modalChangeImg.find('.thumbnail.active').removeClass('active');
                btn.addClass('active');
                modalChangeImg.find('input[name=updateSkuImageHash]').val(hash);
            }
        });

        var modalUpCrop;
        var btnUploadImage = modalChangeImg.find('.btn-upload-img');
        btnUploadImage.on('click', function (e) {
            e.preventDefault();

            var skuId = modalChangeImg.find('input[name=skuId]').val();

            modalUpCrop.attr('data-skuid', skuId);
            modalUpCrop.attr('data-rowid', modalChangeImg.attr('data-rowid'));
            btnUploadImage.upcropImage('setUrl', '/skus/?skuId=' + skuId);
            modalChangeImg.modal('hide');
        });
        btnUploadImage.upcropImage({
            buttonContinueText: 'Save',
            fieldName: 'skuImg',
            onReady: function (upcropContainer) {
                modalUpCrop = upcropContainer.closest('.modal');
            },
            onCropComplete: function (resp) {
                flog("onCropComplete:", resp, resp.nextHref);
                reloadRow(modalUpCrop.attr('data-rowid'));
                Msg.info("Crop success");
            },
            onContinue: function (resp) {
                flog("onContinue:", resp, resp.result.nextHref);

                var skuId = modalUpCrop.attr('data-skuid');
                var rowId = modalUpCrop.attr('data-rowid');

                $.ajax({
                    url: window.location.pathname + '?skuId=' + skuId,
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
                            reloadRow(rowId);
                        } else {
                            Msg.error("An error occured processing the variant image.");
                        }
                    },
                    error: function () {
                        Msg.error('An error occured processing the variant image.');
                    }
                });
            }
        });

        modalChangeImg.find('form').forms({
            onSuccess: function () {
                modalChangeImg.modal('hide');
                reloadSkuTable();
            }
        });

        $(document.body).on('click', '.btn-remove-img', function (e) {
            e.preventDefault();

            var btn = $(this);
            var row = btn.closest('tr');
            var td = row.find('td:first-child');
            var rowId = row.attr("id");
            var skuId = td.data('skuid');

            removeSkuImage(skuId, rowId);
        });

        modalChangeImg.on('hidden.bs.modal', function () {
            modalChangeImg.find('input[name=updateSkuImageHash]').val('');
            modalChangeImg.find('input[name=skuId]').val('');
            modalChangeImg.find('.btn-image-selected ').removeClass('image-selected');
            modalChangeImg.attr('data-rowid', '');
        });
    }

    function updateSku(productId, options, skuId, newSku, rowId) {
        $.ajax({
            type: 'POST',
            url: window.href,
            data: {
                productId: productId,
                skuId: skuId,
                options: options,
                updateSku: newSku
            },
            dataType: 'json',
            success: function (resp) {
                if (resp.status) {
                    flog('newSku', newSku);
                    Msg.success(resp.messages);
                    reloadRow(rowId, productId);
                } else {
                    Msg.error(resp.messages);
                }
            },
            error: function (resp) {
                Msg.error('An error occured setting the SKU');
            }
        });
    }

    function updateSkuTitle(skuId, newSkuTitle, rowId) {
        $.ajax({
            type: 'POST',
            url: window.href,
            data: {
                skuId: skuId,
                updateSkuTitle: newSkuTitle
            },
            dataType: 'json',
            success: function (resp) {
                if (resp.status) {
                    Msg.success(resp.messages);
                    reloadRow(rowId);
                } else {
                    Msg.error(resp.messages);
                }
            },
            error: function (resp) {
                Msg.error('An error occured setting the SKU Title');
            }
        });
    }

    function updateSkuBaseCost(skuId, newSkuBaseCost, rowId) {
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
                    reloadRow(rowId);
                } else {
                    Msg.error(resp.messages);
                }
            },
            error: function (resp) {
                Msg.error("An error occured setting the SKU Base Cost");
            }
        });
    }

    function updateSkuStock(skuId, locId, newStock, reloadId) {
        $.ajax({
            type: 'POST',
            url: window.href,
            data: {
                skuId: skuId,
                locId: locId,
                updateSkuStock: newStock
            },
            dataType: 'json',
            success: function (resp) {
                if (resp.status) {
                    Msg.success(resp.messages);
                    reloadRow(reloadId);
                } else {
                    Msg.error(resp.messages);
                }
            },
            error: function (resp) {
                Msg.error('An error occured setting the SKU stock');
            }
        });
    }

    function removeSkuImage(skuId, rowId) {
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
                    reloadRow(rowId);
                } else {
                    Msg.error(resp.messages);
                }
            },
            error: function (resp) {
                flog('Error', resp);
                Msg.error("An error occured removing the SKU Image");
            }
        });
    }

    function reloadSkuTable() {
        $('#productsTableBody').reloadFragment({
            url: window.location.href
        });
    }

    function reloadRow(reloadId, productId) {
        flog('Reloading row', reloadId);

        if (!productId) {
            productId = $('#' + reloadId).find('td:first-child').attr('data-productid');
        }

        $('#' + reloadId).reloadFragment({
            url: window.location.href + '?reloadProductId=' + productId,
            whenComplete: function(){
                loadSkuStockQuantity($('#' + reloadId));
            }
        });
    }


    // Run Init functions
    $(function () {
        initUpdateSku();
        initUpdateSkuTitle();
        initUpdateBaseCost();
        initUploadSkuImage();
        initProductsCsv();
        initUpdateSkuStock();
        initLoadSkuStockQuantity();
    });

})();