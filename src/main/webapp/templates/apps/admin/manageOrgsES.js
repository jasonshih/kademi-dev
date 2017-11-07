(function ($, win, doc, undefined) {
    function showErrors($result, errors) {
        var $table = $result.find('table'),
                $tbody = $table.find('tbody');

        $tbody.html('');

        $.each(errors, function (i, row) {
            flog('error:', row);

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
            flog('unmatched', row);

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

            self.$inputs.filter('[name=parentOrgId]').entityFinder({
                type: 'organisation'
            });

            self.$form.forms({
                onSuccess: function (resp) {
                    flog('done', resp);
                    Msg.success($('#orgTitle').val() + ' is saved!');
                    setTimeout(
                            $('#searchResults').reloadFragment()
                            , 5000);
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
            flog('select', $selectes.val());
            resetValidation($modal);

            if (href) {
                $.ajax({
                    type: 'GET',
                    url: href,
                    dataType: 'json',
                    success: function (response) {
                        flog('success', response);
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
                flog('oncomplete:', data.result, name, href);
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

            confirmDelete(href, getFileName(href), function (resp) {
                flog(resp);
                setTimeout($('#searchResults').reloadFragment(), 5000);

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
        initEditParent();
        initSort();
        initMerge();
        initMove();
        initAssignToOrgType();
        aggFilter();
        initAggregations();
    };

})(jQuery, window, document);


function initMove() {
    var modal = $("#modal-move-orgs");
    modal.find("form").forms({
        onSuccess: function (resp) {
            if (resp.status) {
                Msg.info("Move complete");
                modal.modal("hide");
                window.location.reload();
            } else {
                Msg.warning("Move failed. " + resp.messages);
            }
        }
    });

    $("body").on("click", ".btn-orgs-move", function (e) {
        flog("move..");
        e.preventDefault();
        var checkBoxes = $('#searchResults').find('input[name=toRemoveId]:checked');
        if (checkBoxes.length === 0) {
            Msg.singletonForCategory = true;
            Msg.error("Please select the organisations you want to move by clicking the checkboxs to the right");
            return;
        } else {
            var tbody = modal.find(".orgsMoveTableBody");
            var destSelect = modal.find("select[name=moveDest]");
            tbody.html("");
            var moveIds = "";
            checkBoxes.each(function (i, n) {
                var tr = $("<tr>");
                var chk = $(n);
                var selected = chk.closest("tr");
                var orgid = selected.find(".org-orgid").text();
                var title = selected.find(".org-title").text();
                var numMembers = selected.find(".org-members").text();
                var internalId = selected.data("id");
                moveIds += internalId + ",";

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
            modal.find("textarea").val(moveIds);

            modal.modal("show");
        }
    });
}

function initAssignToOrgType() {
    var modal = $("#modal-assign-orgtype");
    modal.find("form").forms({
        onSuccess: function (resp) {
            if (resp.status) {
                Msg.info("Type Assignment complete");
                modal.modal("hide");
                window.location.reload();
            } else {
                Msg.warning("Move failed. " + resp.messages);
            }
        }
    });

    $("body").on("click", ".btn-orgs-assign-orgtype", function (e) {
        flog("assign..");
        e.preventDefault();
        var checkBoxes = $('#searchResults').find('input[name=toRemoveId]:checked');
        if (checkBoxes.length === 0) {
            Msg.singletonForCategory = true;
            Msg.error("Please select the organisations you want to assign by clicking the checkboxs to the right");
            return;
        } else {
            var tbody = modal.find(".assignOrgTypeTableBody");

            tbody.html("");
            var moveIds = "";
            checkBoxes.each(function (i, n) {
                var tr = $("<tr>");
                var chk = $(n);
                var selected = chk.closest("tr");
                var orgid = selected.find(".org-orgid").text();
                var title = selected.find(".org-title").text();
                var orgType = selected.find(".org-type").text() === "" ? "-" : selected.find(".org-type").text();
                var internalId = selected.data("id");
                moveIds += internalId + ",";

                var td = $("<td>");
                td.text(orgid);
                tr.append(td);

                td = $("<td>");
                td.text(title);
                tr.append(td);

                td = $("<td>");
                td.text(orgType);
                tr.append(td);

                tbody.append(tr);
            });

            modal.find("textarea").val(moveIds);

            modal.modal("show");
        }
    });
}

function initMerge() {
    var modal = $("#modal-merge-orgs");

    modal.find("form").forms({
        onSuccess: function (resp) {
            if (resp.status) {
                Msg.info("Merge complete");
                modal.modal("hide");
                window.location.reload();
            } else {
                Msg.warning("Merge failed. " + resp.messages);
            }
        }
    });

    $("body").on("click", ".btn-orgs-merge", function (e) {
        e.preventDefault();
        var checkBoxes = $('#searchResults').find('input[name=toRemoveId]:checked');
        if (checkBoxes.length === 0) {
            Msg.singletonForCategory = true;
            Msg.error("Please select the organisations you want to merge by clicking the checkboxs to the right");
        } else {
            var tbody = modal.find(".orgsMergeTableBody");
            var destSelect = modal.find("select[name=mergeDest]");
            tbody.html("");
            var mergeIds = "";
            checkBoxes.each(function (i, n) {
                var tr = $("<tr>");
                var chk = $(n);
                var selected = chk.closest("tr");
                var orgid = selected.find(".org-orgid").text();
                var title = selected.find(".org-title").text();
                var numMembers = selected.find(".org-members").text();
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
        }
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
    $("#org-query, #org-query-parent").on({
        keyup: function () {
            typewatch(function () {
                flog("initSearchOrg: do search");
                doSearch();
            }, 500);
        },
        change: function () {
            flog("do search");
            doSearch();
        }
    });
}


function doSearch() {
    var newUrl = window.location.pathname + "?q=" + $("#org-query").val();
    reloadSearchResults(newUrl);
}


function doSearchAndSort(field, direction) {
    var newUrl = window.location.pathname + "?q=" + $("#org-query").val() + "&sortfield=" + field + "&sortdir=" + direction;
    reloadSearchResults(newUrl);
}

function reloadSearchResults(newUrl) {
    $("#searchResults").reloadFragment({
        url: newUrl,
        whenComplete: function (response) {
            window.history.pushState("", document.title, newUrl);
            Msg.info('Refreshed', 1500)
            flog('complete', response);
            var inner = $(response).find('#aggregationsContainer > *');
            $('#aggregationsContainer').html(inner);
            var innerSearchStats = $(response).find('#searchStats > *');
            $('#searchStats').html(innerSearchStats);
            
            aggFilter();
            initManageOrgs();

            
        }
    });

}
function aggFilter() {
    $(".agg-filter-link").on("click", function (e) {
        e.preventDefault();
        var newUrl = $(this).attr("href");
        reloadSearchResults(newUrl);
    });
}

function initRemoveOrgs() {
    Msg.singletonForCategory = true;

    $(".btn-orgs-remove").click(function (e) {
        var node = $(e.target);
        flog("remove orgs", node, node.is(":checked"));
        var checkBoxes = $('#searchResults').find('input[name=toRemoveId]:checked');
        if (checkBoxes.length === 0) {
            Msg.error("Please select the organisations you want to remove by clicking the checkboxs to the right", 'no-org-selected');
        } else {
            Kalert.confirm("Are you sure you want to remove " + checkBoxes.length + " organisations?", function () {
                doRemoveOrgs(checkBoxes);
            });
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
                var msg = (data.messages === undefined) ? "Removed organisations ok" : data.messages[0];
                Msg.success(msg);
            } else {
                var msg = (data.messages === undefined) ? "There was a problem removing organisations. Please try again and contact the administrator if you still have problems" : data.messages[0];
                Msg.error(msg);
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

function initEditParent() {
    var modal = $('#modal-edit-parent');
    var txtParent = modal.find('[name=destOrgId]');
    var txtOrgId = modal.find('[name=mergeIds]');

    txtParent.entityFinder({
        type: 'organisation'
    });
    var txtParentTitle = modal.find('.search-input');

    $(document.body).on('click', '.btn-edit-parent', function (e) {
        e.preventDefault();

        var btn = $(this);
        var parent = btn.attr("data-parent");
        var parentTitle = btn.attr("data-parent-title");
        var orgId = btn.attr("data-orgid");

        txtParent.val(parent);
        txtParentTitle.val(parentTitle);
        txtOrgId.val(orgId);

        modal.modal('show');
    });

    modal.find('form').forms({
        onSuccess: function () {
            doSearch();
            Msg.success("Successfully updated parent");
            modal.modal('hide');
        }
    });

    modal.on('hidden.bs.modal', function () {
        txtParent.val('');
        txtOrgId.val('');
        txtParentTitle.val('');
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

function initAggregations() {
    var body = $('body');
    body.on('click', '.aggClearer', function (e) {
        e.preventDefault();

        var input = $($(this).data('target'));
        flog('aggs clearer click', input);
        input.val('');
        var name = input.attr('name');
        // We want to remove the parameter from the query string entirely
        var uri = URI(window.location);
        uri.removeSearch('filter-'.concat(name));
        history.pushState(null, null, uri.toString());

        $('#aggregationsContainer').reloadFragment({
            url: window.location
        });

    });
    body.on('change', '.agg-filter', function (e) {
        var input = $(e.target);
        aggSearch(input);
    });
    body.on('keyup', '.agg-filter', function (e) {
        var input = $(e.target);
        typewatch(function () {
            aggSearch(input);
        }, 500);
    });
}

function aggSearch(input) {
    var name = input.attr('name');
    var value = input.val();
    flog('initAggregations: do agg search', 'name=', name, 'value=', value);
    var uri = URI(window.location);
    uri.setSearch('filter-'.concat(name), value);

    history.pushState(null, null, uri.toString());

    $('#aggregationsContainer').reloadFragment({
        url: window.location
    });
}
