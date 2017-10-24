(function () {
    $(document.body).on('keypress', '#data-query', function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();
            doHistorySearch();
            return false;
        }
    });
    
    $("#pointsFooter a").on('click', function (e) {
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
                initUploadSkuImage();
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
        
        Msg.info("Doing search...", 2000);
        
        var data = {
            dataQuery: $("#data-query").val(),
        };
        flog("data", data);
        
        $('.btn-export-points').attr('href', 'skus.csv?' + $.param(data));
        
        var target = $("#pointsTable");
        target.load();
        
        
        var link = window.location.pathname + "?" + $.param(data);
        flog("new link", link);
        
        $.ajax({
            type: "GET",
            url: link,
            dataType: 'html',
            success: function (content) {
                flog('response', content);
                Msg.success("Search complete", 2000);
                var newBody = $(content).find("#pointsTable");
                
                target.replaceWith(newBody);
                history.pushState(null, null, link);
                
                $("abbr.timeago").timeago();
                
                initUpdateSku();
                initUpdateSkuTitle();
                initUpdateBaseCost();
                initUploadSkuImage();
                initProductsCsv();
                initUpdateSkuStock();
                initLoadSkuStockQuantity();
            }
        });
    }
    
    function initProductsCsv() {
        var modalUploadCsv = $("#modal-upload-csv");
        
        var resultUploadCsv = modalUploadCsv.find('.upload-results');
        $("#do-upload-csv").mupload({
            buttonText: "<i class=\"clip-folder\"></i> Upload spreadsheet",
            url: "skus.csv",
            useJsonPut: false,
            oncomplete: function (data, name, href) {
                flog("oncomplete:", data.result.data, name, href);
                resultUploadCsv.find('.num-updated').text(data.result.data.numUpdated);
                resultUploadCsv.find('.num-unmatched').text(data.result.data.unmatched.length);
                showUnmatched(resultUploadCsv, data.result.data.unmatched);
                resultUploadCsv.show();
                Msg.success("Upload completed. Please review any unmatched members below, or refresh the page to see the updated list of products");
                $("#productsTableContainer").reloadFragment();
            }
        });
    }
    
    function showUnmatched(resultUploadCsv, unmatched) {
        var unmatchedTable = resultUploadCsv.find("table");
        var tbody = unmatchedTable.find("tbody");
        tbody.html("");
        $.each(unmatched, function (i, row) {
            flog("unmatched", row);
            var tr = $("<tr>");
            $.each(row, function (ii, field) {
                tr.append("<td>" + field + "</td>");
            });
            tbody.append(tr);
        });
    }
    
    function initUpdateSku() {
        $("#productsTableBody").on("change", ".input-sku", function (e) {
            var target = $(e.target);
            var newSku = target.val();
            var row = target.closest('tr');
            var rowId = $(row).attr("id");
            
            var td = $(row).find('td:first-child');
            
            var productId = td.data("product");
            var skuId = td.data('skuid');
            var options = td.data("options");
            
            updateSku(productId, options, skuId, newSku, rowId);
        });
        
        $("#productsTableBody").on("keyup", ".input-sku", function (e) {
            if ((e.keyCode || e.which) == keymap.ENTER) {
                var target = $(e.target);
                var newSku = target.val();
                
                var row = target.closest('tr');
                var td = $(row).find('td:first-child');
                
                var rowId = $(row).attr("id");
                var productId = td.data("product");
                var skuId = td.data('skuid');
                var options = td.data("options");
                updateSku(productId, options, skuId, newSku, rowId);
            }
        });
    }
    
    function initUpdateSkuTitle() {
        $("#productsTableBody").on("change", ".input-sku-Title", function (e) {
            var target = $(e.target);
            var newSkuTitle = target.val();
            var row = target.closest('tr');
            var rowId = $(row).attr("id");
            var td = $(row).find('td:first-child');
            
            var skuId = td.data('skuid');
            
            
            updateSkuTitle(skuId, newSkuTitle, rowId);
        });
        
        $("#productsTableBody").on("keyup", ".input-sku-Title", function (e) {
            if ((e.keyCode || e.which) == keymap.ENTER) {
                var target = $(e.target);
                var newSkuTitle = target.val();
                
                var row = target.closest('tr');
                var rowId = $(row).attr("id");
                var td = $(row).find('td:first-child');
                
                var skuId = td.data('skuid');
                
                updateSkuTitle(skuId, newSkuTitle, rowId);
            }
        });
    }
    
    function initUpdateBaseCost() {
        $("#productsTableBody").on("change", ".input-sku-baseCost", function (e) {
            var target = $(e.target);
            var newSkuTitle = target.val();
            var row = target.closest('tr');
            var rowId = $(row).attr("id");
            var td = $(row).find('td:first-child');
            
            var skuId = td.data('skuid');
            
            updateSkuBaseCost(skuId, newSkuTitle, rowId);
        });
    }
    
    function initUpdateSkuStock() {
        $("#productsTableBody").on("change", ".input-sku-stock", function (e) {
            var target = $(e.target);
            var newSkuStock = target.val();
            var locid = target.data('locid');
            var row = target.closest('tr');
            var rowId = $(row).attr("id");
            var td = $(row).find('td:first-child');
            var skuId = td.data('skuid');
            
            updateSkuStock(skuId, locid, newSkuStock, rowId, rowId);
        });
    }
    
    function initLoadSkuStockQuantity() {
        $('#productsTableBody').find('.input-sku-stock').each(function (i, item) {
            var input = $(item);
            var locId = input.data('locid');
            var row = input.closest('tr');
            var skuId = row.data('skuid');
            
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
        $('body').on('click', '.btn-option-img', function (e) {
            e.preventDefault();
            
            var btn = $(this);
            var row = btn.closest('tr');
            var td = $(row).find('td:first-child');
            
            var skuId = td.data('skuid');
            var imgHashes = (td.attr('data-selectableimg') || '').trim();
            imgHashes = imgHashes === '' ? [] : imgHashes.split(',');
            var modalOptionImg = $('#modal-option-img');
            modalOptionImg.find('input[name=skuId]').val(skuId);
            
            var imgsStr = '';
            for (var i = 0; i < imgHashes.length; i++) {
                var hash = imgHashes[i];
                
                imgsStr += '<div class="col-xs-6 col-md-3 product-image-thumb">';
                imgsStr += '    <a href="' + hash + '" class="thumbnail select-opt-img"><img src="/_hashes/files/' + hash + '/alt-150-150.png"/></a>';
                imgsStr += '    <a class="btn-image-selected btn btn-xs btn-success" style="display: none;" href="/_hashes/files/' + hash + '">';
                imgsStr += '        <span class="fa fa-check"></span>';
                imgsStr += '    </a>';
                imgsStr += '</div>';
                
            }
            
            modalOptionImg.find('.img-list').html(imgsStr);
            modalOptionImg.modal('show');
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
            var td = $(row).find('td:first-child');
            var skuId = td.data('skuid');
            var imgHashes = td.data('selectableimg').split(',');
            
            $('#modal-option-img').find('input[name=skuId]').val(skuId);
            $('#modal-option-img').find('.img-list').empty();
            for (var i = 0; i < imgHashes.length; i++) {
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
            onSuccess: function (resp) {
                $('#modal-option-img').modal('hide');
                reloadSkuTable();
            }
        });
        
        $('body').on('click', '.btn-sku-img-del', function (e) {
            e.preventDefault();
            
            var btn = $(this);
            var row = btn.closest('tr');
            var rowId = $(row).attr("id");
            var td = $(row).find('td:first-child');
            
            var skuId = td.data('skuid');
            
            removeSkuImage(skuId, rowId);
        });
        
        $('body').on('hidden.bs.modal', '#modal-option-img', function () {
            $('#modal-option-img').find('input[name=updateSkuImageHash]').val(null);
            $('#modal-option-img').find('input[name=skuId]').val(null);
            $('#modal-option-img').find('.btn-image-selected ').removeClass('image-selected');
        });
    }
    
    function initUpCropImage(btn, skuId, rowId) {
        btn.upcropImage({
            buttonContinueText: 'Save',
            url: window.location.pathname + '?skuId=' + skuId,
            fieldName: 'skuImg',
            onCropComplete: function (resp) {
                flog("onCropComplete:", resp, resp.nextHref);
                reloadRow(rowId);
            },
            onContinue: function (resp) {
                flog("onContinue:", resp, resp.result.nextHref);
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
                        alert('An error occured processing the variant image.');
                    }
                });
            }
        });
    }
    
    function initSkuImgUpload() {
        
        $('.btn-option-img-upload').each(function (i, item) {
            var btn = $(item);
            var row = btn.closest('tr');
            var rowId = $(row).attr("id");
            var td = $(row).find('td:first-child');
            
            var skuId = td.data('skuid');
            
            initUpCropImage(btn, skuId, rowId);
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
            dataType: "json",
            success: function (resp) {
                if (resp.status) {
                    flog("newSku", newSku);
                    Msg.success(resp.messages);
                    reloadRow(rowId, productId);
                } else {
                    Msg.error(resp.messages);
                }
            },
            error: function (resp) {
                Msg.error("An error occured setting the SKU");
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
                Msg.error("An error occured setting the SKU Title");
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
            dataType: "json",
            success: function (resp) {
                if (resp.status) {
                    Msg.success(resp.messages);
                    reloadRow(reloadId);
                } else {
                    Msg.error(resp.messages);
                }
            },
            error: function (resp) {
                Msg.error("An error occured setting the SKU stock");
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
        $("#productsTableBody").reloadFragment({
            whenComplete: function () {
            },
            url: window.location.href
        });
    }
    
    function reloadRow(reloadId, productId) {
        flog("Reloading row", reloadId);
        $("#" + reloadId).reloadFragment({
            whenComplete: function () {
                $("#" + reloadId + " td:first-child .btn-option-img-upload").each(function (i, item) {
                    var btn = $(item);
                    var row = btn.closest('tr');
                    var rowId = $(row).attr("id");
                    var td = $(row).find('td:first-child');
                    
                    var skuId = td.data('skuid');
                    
                    initUpCropImage(btn, skuId, rowId);
                });
            },
            url: window.location.href + "?reloadProductId=" + productId
        });
    }
    
    
    // Run Init functions
    $(function () {
        initUpdateSku();
        initUpdateSkuTitle();
        initUpdateBaseCost();
        initUploadSkuImage();
        initSkuImgUpload();
        initProductsCsv();
        initUpdateSkuStock();
        initLoadSkuStockQuantity();
    });
    
})();