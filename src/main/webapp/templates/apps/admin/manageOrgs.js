(function ($, win, doc, undefined) {
    function showErrors($result, errors) {
        var $table = $result.find('table'),
                $tbody = $table.find('tbody');

        $tbody.html('');

        $.each(errors, function (i, row) {
            log('error:', row);

            var $tr = $('<tr>');

            $tr.append('<td>' + row + '</td>');
            $tbody.append($tr);
        });

        $result.show();
    }

    function showUnmatched($result, unmatched) {
        var $table = $result.find('table');
        var $tbody = $table.find('tbody');

        $tbody.html('');

        $.each(unmatched, function (i, row) {
            log('unmatched', row);

            var $tr = $('<tr>');

            $.each(row, function (ii, field) {
                $tr.append('<td>' + field + '</td>');
            });
            $tbody.append($tr);
        });

        $result.show();
    }

    var ModalEditOrg = {
        init: function () {
            var self = this;
            self.$modal = $('#modal-edit-org').modal({
                show: false
            });
            self.$form = self.$modal.find('form');
            self.$inputs = self.$form.find('input');
            self.$selects = self.$form.find('select');

            self.$form.forms({
                callback: function (resp) {
                    log('done', resp);
                    Msg.success($('#orgTitle').val() + ' is saved!');
                    $('#search-results').reloadFragment();
                    self.hide();
                }
            });

            self.$modal.find('')
        },
        show: function (href) {
            var self = this,
                    $modal = self.$modal,
                    $form = self.$form,
                    $inputs = self.$inputs,
                    $selectes = self.$selects;

            if (href) {
                $form.attr('action', href);
            } else {
                $form.attr('action', win.location.pathname + '?newOrg');
            }

            $inputs.val('');
            $selectes.val('');
            log('select', $selectes.val());
            resetValidation($modal);

            if (href) {
                $.ajax({
                    type: 'GET',
                    url: href,
                    dataType: 'json',
                    success: function (response) {
                        log('success', response);
                        for (var key in response.data) {
                            $modal.find('[name="' + key + '"]').val(response.data[key]);
                            $modal.modal('show');
                        }
                    },
                    error: function (response) {
                        Msg.error('err');
                    }
                });
            } else {
                $modal.modal('show');
            }
        },
        hide: function () {
            this.$modal.modal('hide');
        }
    };

    var initUploadCsv = function () {
        // Upload CSV
        var modalUploadCsv = $('#modal-upload-csv');
        var resultUploadCsv = modalUploadCsv.find('.upload-results');
        var form = modalUploadCsv.find("form");
        form.submit(function (e) {
            e.preventDefault();
            var f = form[0];
            flog("init form data", f);
            var formData = new FormData(f);
            flog("done form data");
            $.ajax({
                url: form.attr("action"),
                type: 'POST',
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                success: function (result) {
                    flog("success", result);
                    if (result.status) {
                        resultUploadCsv.find('.num-updated').text(result.data.numUpdated);
                        resultUploadCsv.find('.num-unmatched').text(result.data.unmatched.length);
                        showUnmatched(resultUploadCsv, result.data.unmatched);
                        Msg.success('Upload completed. Please review any unmatched organisations below, or refresh the page to see the updated list of organisations');
                    } else {
                        Msg.error('There was a problem uploading the organisations: ' + result.messages);
                    }
                }
            });
        });

        $('#do-upload-csv').mupload({
            buttonText: '<i class="clip-folder"></i> Upload spreadsheet',
            url: 'orgs.csv',
            useJsonPut: false,
            oncomplete: function (data, name, href) {
                flog('oncomplete:', data.result, name, href);
                if (data.result.status) {
                    resultUploadCsv.find('.num-updated').text(data.result.data.numUpdated);
                    resultUploadCsv.find('.num-unmatched').text(data.result.data.unmatched.length);
                    showUnmatched(resultUploadCsv, data.result.data.unmatched);
                    Msg.success('Upload completed. Please review any unmatched organisations below, or refresh the page to see the updated list of organisations');
                } else {
                    Msg.error('There was a problem uploading the organisations: ' + data.result.messages);
                }
            }
        });
        var $formUploadCsv = modalUploadCsv.find('form');
        $('#allow-inserts').on('click', function (e) {
            flog('click', e.target);
            if (this.checked) {
                $formUploadCsv.attr('action', 'orgs.csv?insertMode=true');
            } else {
                $formUploadCsv.attr('action', 'orgs.csv');
            }
        });
    };

    var initUploadOrgIdCsv = function () {
        // Upload OrgId CSV
        var $modalUploadOrgidCsv = $('#modal-upload-orgid-csv');
        var $resultUploadOrgidCsv = $modalUploadOrgidCsv.find('.upload-results');
        $('#do-upload-orgid-csv').mupload({
            buttonText: '<i class="clip-folder"></i> Upload OrgIDs spreadsheet',
            url: 'orgIds.csv',
            useJsonPut: false,
            oncomplete: function (data, name, href) {
                log('oncomplete:', data.result, name, href);
                if (data.result.status) {
                    $resultUploadOrgidCsv.find('.num-update').text(data.result.data.numUpdated);
                    $resultUploadOrgidCsv.find('.num-errors').text(data.result.data.errors.length);
                    showErrors($resultUploadOrgidCsv, data.result.data.errors);
                    Msg.success('Upload completed. Please review any unmatched organisations below, or refresh the page to see the updated list of organisations');
                } else {
                    Msg.error('There was a problem uploading the organisations: ' + data.result.messages);
                }
            }
        });
    };

    var initCRUDOrg = function () {
        var $body = $(doc.body);

        $body.on('click', '.btn-delete-org', function (e) {
            e.preventDefault();

            var href = $(this).attr('href');

            confirmDelete(href, getFileName(href), function () {
                win.location.reload();
            });
        });

//        $body.on('click', '.btn-edit-org', function(e) {
//            e.preventDefault();
//
//            ModalEditOrg.show($(this).attr('href'));
//        });

        $('.btn-add-org').on('click', function (e) {
            e.preventDefault();

            ModalEditOrg.show(null);
        });
    };

    win.initManageOrgs = function () {
        ModalEditOrg.init();
        initUploadCsv();
        initUploadOrgIdCsv();
        initCRUDOrg();
        initSearchOrg();
        initRemoveOrgs();
        initSortById();
        initEditPath();
        initSort();
        initMerge();
    };

})(jQuery, window, document);

function initMerge() {
    var modal = $("#modal-merge-orgs");

    modal.find("form").forms({
        callback : function(resp){
            if( resp.status) {
                Msg.info("Merge complete");
                modal.modal("hide");
                window.location.reload();
            } else {
                Msg.warning("Merge failed. " + resp.messages);
            }
        }
    });

    $("body").on("click", ".btn-orgs-merge", function(e) {
        e.preventDefault();
        var checkBoxes = $('#searchResults').find('input[name=toRemoveId]:checked');
        if (checkBoxes.length === 0) {
            Msg.error("Please select the organisations you want to merge by clicking the checkboxs to the right");
        }

        var tbody = modal.find(".orgsMergeTableBody");
        var destSelect = modal.find("select[name=mergeDest]");
        tbody.html("");
        var mergeIds = "";
        checkBoxes.each(function(i, n) {
            var tr = $("<tr>");
            var chk = $(n);
            var selected = chk.closest("tr");
            var orgid = selected.find(".org-orgid").text();
            var title =  selected.find(".org-title").text();
            var numMembers =  selected.find(".org-members").text();
            var internalId = selected.data("id");
            mergeIds += internalId + ",";

            var td = $("<td>");
            td.text(orgid);
            tr.append(td);

            td = $("<td>");
            td.text(title);
            tr.append(td);

            td = $("<td>");
            td.text(numMembers + "");
            tr.append(td);

            tbody.append(tr);

            var opt = $("<option>");
            opt.attr("value", internalId);
            opt.text(orgid + " - " + title);
            destSelect.append(opt);
        });
        modal.find("textarea").val(mergeIds);

        modal.modal("show");
    });
}

function initSort() {
	flog('initSort()');
	$('.sort-field').on('click', function (e) {
        e.preventDefault();
        var a = $(e.target);
        var search = window.location.search;
    	flog(search);
        var field = a.attr('id');
        var dir = 'asc';
        if (field == getSearchValue(search, 'sortfield')) {
        	if (getSearchValue(search, 'sortdir') == 'asc') {
        		dir = 'desc';
        	} else {
        		dir = 'asc'
        	}
        }
        doSearchAndSort(field, dir);
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


function initSearchOrg() {
    $("#org-query").on({
        keyup: function () {
            typewatch(function () {
                flog("do search");
                doSearch();
            }, 500);
        },
        change: function () {
            flog("do search");
            doSearch();
        }
    });
    $("#searchOrgType").change(function () {
        doSearch();
    });
}


function doSearch() {
    flog("doSearch", $("#searchOrgType"));
    var newUrl = window.location.pathname + "?q=" + $("#org-query").val() + "&searchOrgType=" + $("#searchOrgType").val();
    $.ajax({
        type: 'GET',
        url: newUrl,
        success: function (data) {
            flog("success", data);
            window.history.pushState("", document.title, newUrl);
            var $fragment = $(data).find("#searchResults");
            flog("replace", $("#se"));
            flog("frag", $fragment);
            $("#searchResults").replaceWith($fragment);
        },
        error: function (resp) {
            Msg.error("err");
        }
    });
}

function doSearchAndSort(field, direction) {
    var newUrl = window.location.pathname + "?q=" + $("#org-query").val() + "&searchOrgType=" + $("#searchOrgType").val() + "&sortfield=" + field + "&sortdir=" + direction;
    $.ajax({
        type: 'GET',
        url: newUrl,
        success: function (data) {
            flog("success", data);
            window.history.pushState("", document.title, newUrl);
            var $fragment = $(data).find("#searchResults");
            flog("replace", $("#se"));
            flog("frag", $fragment);
            $("#searchResults").replaceWith($fragment);
        },
        error: function (resp) {
            Msg.error("err");
        }
    });
}

function initRemoveOrgs() {
    $(".btn-orgs-remove").click(function (e) {
        var node = $(e.target);
        flog("remove orgs", node, node.is(":checked"));
        var checkBoxes = $('#searchResults').find('input[name=toRemoveId]:checked');
        if (checkBoxes.length === 0) {
            Msg.error("Please select the organisations you want to remove by clicking the checkboxs to the right");
        } else {
            if (confirm("Are you sure you want to remove " + checkBoxes.length + " organisations?")) {
                doRemoveOrgs(checkBoxes);
            }
        }
    });
}

function initSortById() {
	$(".btn-orgs-sort-all-asc").click(function (e) {
		doSearchAndSort('id', 'asc');
	});
	$(".btn-orgs-sort-all-desc").click(function (e) {
		doSearchAndSort('id', 'desc');
	});
}

function doRemoveOrgs(checkBoxes) {
	var search = window.location.search;
	var field = getSearchValue(search, 'sortfield');
	var dir = getSearchValue(search, 'sortdir');
    $.ajax({
        type: 'POST',
        data: checkBoxes,
        dataType: "json",
        url: window.location.pathname,
        success: function (data) {
            flog("success", data);
            if (data.status) {
            	doSearchAndSort(field, dir);
                Msg.success("Removed organisations ok");
            } else {
                Msg.error("There was a problem removing organisations. Please try again and contact the administrator if you still have problems");
            }
        },
        error: function (resp) {
            Msg.error("An error occurred removing organisations. You might not have permission to do this");
        }
    });
}

function initEditPath() {
    $('body').on('click', '.btn-edit-path', function (e) {
        e.preventDefault();
        var btn = $(this);
        var path = btn.data("path");
        var orgId = btn.data("orgid");
        var p = prompt("Path", path);
        if (p !== null && path !== p) {
            flog("Actual Org ID", orgId, "Old Path", path, "New Path", p);
            updateOrgPath(orgId, p);
        }
    });
}

function updateOrgPath(orgId, newPath) {
    $.ajax({
        type: 'POST',
        data: {
            updateOrgPath: newPath,
            actualID: orgId
        },
        dataType: 'json',
        url: window.location.pathname,
        success: function (data) {
            flog("success", data);
            if (data.status) {
                doSearch();
                Msg.success("Successfully updated path");
            } else {
                Msg.error("There was a problem updating the organisation path.");
            }
        },
        error: function (resp) {
            Msg.error("An error occurred updating the organisation. You might not have permission to do this");
        }
    });
}