 $(function () {
	 initTable();

    $('#data-query').keyup(function () {
        typewatch(function () {
            flog('initSearchUser: do search');
            doHistorySearch();
        }, 500);
    }); 
	 
	$('#supplier').on('change', function(e) {
		doHistorySearch();
	});
	 
	 
    $("#newProduct").click(function (event) {
        event.preventDefault();

        // Reset fields in the create product form
        $("#addProductModal").find("input[type=text], textarea,input[name=pageName]").val("");
    });

    $("#modalBulkDelete form").forms({
        callback: function (resp) {
            flog("Done", resp);
            if (resp.status) {
                if (resp.data.numDeleted > 0) {
                    $("#productTableBody").reloadFragment();
                    alert("Deleted " + resp.data.numDeleted + " products");
                    $("#modalBulkDelete").modal("hide");
                    initTable();
                } else {
                    alert("Did not find any matching products. Nothing deleted");
                }
            } else {
                alert("There was a problem deleting products")
            }
        }
    });

    jQuery("form.createProduct").forms({
        callback: function () {
            $.ajax({
                type: 'GET',
                url: window.location.href,
                dataType: "html",
                success: function (resp) {
                    var page = $(resp);
                    var table = page.find("#productsTableContainer table");
                    $("#productsTableContainer").html(table);
                    
                    initTable();
                },
                error: function (resp) {
                    log('There was a problem logging you out', resp);
                },
                complete: function (jqXHR, textStatus) {
                    $("#addProductModal").modal('hide');
                }
            });
        }
    });
    initProductsCsv();
    initVariantsCsv();

    $('body').on('click', '.btn-delete-products', function (e) {
        e.preventDefault();
        var listToDelete = [];
        $('body').find(':checkbox.product-check:checked').each(function () {
            var p = $(this);
            flog(p.data("productname"));
            listToDelete.push(p.data("productname"));
        });
        if (listToDelete.length > 0 && confirm("Are you sure you want to delete " + listToDelete.length + " products?")) {
            $('body').find('.check-all').check(false).change();
            flog(listToDelete.join(','));
            deleteProducts(listToDelete.join(','));
        }
    });

    $('body').on('change', '.check-all', function (e) {
        flog($(this).is(":checked"));
        //$("body").find(":checkbox.product-check").check($(this).is(":checked"));
        var checkedStatus = this.checked;
        $('body').find(':checkbox.product-check').each(function () {
            $(this).prop('checked', checkedStatus);
        });
    });
});

function initTable() {
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

                initTable();
            },
            error: function (resp) {
                Msg.error('err');
            }
        });
	});
	
	flog('initSort()');
    $('.sort-field').on('click', function (e) {
        e.preventDefault();
        var a = $(e.target);
        var uri = URI(window.location);
        var field = a.attr('id');

        var dir = 'asc';
        if (field == getSearchValue(window.location.search, 'sortfield')
            && 'asc' == getSearchValue(window.location.search, 'sortdir')) {
            dir = 'desc';
        }
        uri.setSearch('sortfield', field);
        uri.setSearch('sortdir', dir);

        $.ajax({
            type: 'GET',
            url: uri.toString(),
            success: function (data) {
                flog('success', data);
                window.history.pushState('', document.title, uri.toString());

                var newDom = $(data);

                var $tableContent = newDom.find('#productsTableContainer');
                $('#productsTableContainer').replaceWith($tableContent);

                initTable();
            },
            error: function (resp) {
                Msg.error('err');
            }
        });

    });
    
} 
 
function initProductsCsv() {
    var modalUploadCsv = $("#modal-upload-csv");

    var resultUploadCsv = modalUploadCsv.find('.upload-results');
    $("#do-upload-csv").mupload({
        buttonText: "<i class=\"clip-folder\"></i> Upload spreadsheet",
        url: "products.csv",
        useJsonPut: false,
        oncomplete: function (data, name, href) {
            flog("oncomplete:", data.result.data, name, href);
            resultUploadCsv.find('.num-updated').text(data.result.data.numUpdated);
            resultUploadCsv.find('.num-inserted').text(data.result.data.numInserted);
            resultUploadCsv.find('.num-unmatched').text(data.result.data.unmatched.length);
            showUnmatched(resultUploadCsv, data.result.data.unmatched);
            resultUploadCsv.show();
            Msg.success("Upload completed. Please review any unmatched members below, or refresh the page to see the updated list of products");
            $("#productTableBody").reloadFragment();
            initTable();
        }
    });
}

function initVariantsCsv() {
    var modalUploadCsv = $("#modal-upload-variants-csv");

    var resultUploadCsv = modalUploadCsv.find('.upload-results');
    $("#do-upload-variants-csv").mupload({
        buttonText: "<i class=\"clip-folder\"></i> Upload spreadsheet",
        url: "variants.csv",
        useJsonPut: false,
        oncomplete: function (data, name, href) {
            flog("oncomplete:", data.result.data, name, href);
            resultUploadCsv.find('.num-updated').text(data.result.data.numUpdated);
            resultUploadCsv.find('.num-inserted').text(data.result.data.numInserted);
            resultUploadCsv.find('.num-unmatched').text(data.result.data.unmatched.length);
            showUnmatched(resultUploadCsv, data.result.data.unmatched);
            resultUploadCsv.show();
            Msg.success("Upload completed. Please review any unmatched members below, or refresh the page to see the updated list of products");
            $("#productsTableContainer").reloadFragment();
            initTable();
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

function deleteProducts(listToDelete) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: window.location.pathname,
        data: {
            deleteProducts: listToDelete,
        },
        success: function (data) {
            if (data.status) {
                Msg.info(data.messages);
                $("#productTableBody").reloadFragment();
                initTable();
            } else {
                Msg.error("An error occured deleting the products. Please check your internet connection");
            }
        },
        error: function (resp) {
            Msg.error("An error occured deleting the products");
        }
    });
}

function getSearchValue(search, key) {
    if (search.charAt(0) == '?') {
        search = search.substr(1);
    }
    parts = search.split('&');
    if (parts) {
        for (var i = 0; i < parts.length; i++) {
            entry = parts[i].split('=');
            if (entry && key == entry[0]) {
                return entry[1];
            }
        }
    }
    return '';
}


function doHistorySearch() {
    flog('doHistorySearch');
    
    Msg.info("Doing search...", 2000);

    var data = {
        dataQuery: $("#data-query").val(),
        supplier: $("#supplier").val()
    };
    flog("data", data);

    $('.btn-export-points').attr('href', 'skus.csv?' + $.param(data));

    var target = $("#productsTableContainer");
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
            
            var newBody = $(content).find("#productsTableContainer");
            
            target.replaceWith(newBody);
            history.pushState(null, null, link);
            
            $("abbr.timeago").timeago();
            initTable();
        }
    });
}