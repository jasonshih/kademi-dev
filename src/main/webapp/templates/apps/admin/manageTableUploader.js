var importUrl = window.location.pathname;
var importWizardStarted = false;
var importTotalCount = 0;
var hasCustomForm = false;

var optionsRow = null;
var mapColumnsRow = 2;
var reviewRow = 3;

function initManageTableUploader(hcf) {
    initUploads();

    hasCustomForm = hcf;

    if (hasCustomForm) {
        optionsRow = 2;
        mapColumnsRow++;
        reviewRow++;
    }
}


function initUploads() {
    var form = $("#importerWizard form");

    $('#myWizard').wizard();
    $('#importerWizard').on('show.bs.collapse', function () {
        var curStep = $('#myWizard').wizard('selectedItem');
        if (!form.find('input[name=fileHash]').val()) {
            curStep = {step: 1};
        }
        $('#myWizard').wizard('selectedItem', curStep);
    });
    $('#myWizard').on('finished.fu.wizard', function (evt, data) {
        $('.btn-upload-Orgs-csv').trigger('click');
        $('#myWizard').wizard('selectedItem', {step: 1});
        $('#myWizard').find('form').trigger('reset');
        form.find("input[name=fileHash]").val('');
        $('#importProgressbar .progress-bar').attr('aria-valuenow', 0).css('width', '0%');
        importTotalCount = 0;
        var resultStatus = $('#job-status');
        resultStatus.text('');
    });

    $('#myWizard').on('changed.fu.wizard', function (evt, data) {
        if (data.step === 1) {
            // IE 11 fix
            var ul = $('#myWizard').find('ul.steps');
            if (ul.css('margin-left') !== '0') {
                ul.css('margin-left', '0');
            }
        }
    });

    $('#myWizard').on('actionclicked.fu.wizard', function (evt, data) {
        if (data.step === 1) {
            if (form.find("input[name=fileHash]").val() == "") {
                if ($('#btn-upload').length) {
                    Msg.error("Please select a file to upload");
                }
                evt.preventDefault();
            }
        }

        if (hasCustomForm && data.step === optionsRow) {
            var fileHash = form.find('[name=fileHash]').val();
            var formData = {fetchTableHeaders: 'fetchTableHeaders', fileHash: fileHash};

            var fields = $("#importerWizard .customForm :input").serializeArray();

            for (var i in fields) {
                var f = fields[i];
                formData[f.name] = f.value;
            }

            flog('Data', formData);

            $.ajax({
                url: importUrl,
                data: formData,
                type: 'post',
                dataType: 'json',
                success: function (resp, textStatus, jqXHR) {
                    if (resp.status && resp.data) {
                        populateImportTable($('#importerWizard'), resp.data);

                        $('#myWizard').wizard('selectedItem', {step: mapColumnsRow});
                    } else {
                        Msg.error(resp.messages);
                    }
                }
            });

            evt.preventDefault();
            return false;
        }

        if (data.step === mapColumnsRow) {
            var startRow = $('#startRow').val();
            if (!startRow) {
                Msg.error('Please enter start row value');
                $('#startRow').trigger('focus').parents('.form-group').addClass('has-error');
                evt.preventDefault();
                return false;
            } else {
                $('#startRow').parents('.form-group').removeClass('has-error');
            }

            var importerHead = $('#importerHead');
            var selectedCols = [];

            importerHead.find('select').each(function () {
                if (this.value) {
                    selectedCols.push(this.value);
                }
            });

            if (!selectedCols.length) {
                Msg.error('Please select at least 1 destination field to continue.');
                importerHead.find('select').first().trigger('focus');
                evt.preventDefault();
                return false;
            }

            var fileHash = form.find('[name=fileHash]').val();
            var startRow = form.find('[name=startRow]').val();
            var formData = {beforeImport: 'beforeImport', fileHash: fileHash, startRow: startRow};
            form.find('select').each(function () {
                if (this.value) {
                    formData[this.name] = this.value;
                }
            });
            form.find('#noValidRow').addClass('hide');
            form.find('[type=submit]').addClass('hide');

            $('#processing').show();
            $('#result').hide();

            $.ajax({
                url: importUrl,
                data: formData,
                type: 'post',
                dataType: 'json',
                success: function (resp) {
                    if (resp.status && resp.data) {
                        $('#myWizard').wizard('selectedItem', {step: reviewRow});
                        form.find('[type=submit]').removeClass('hide');
                        form.find(".beforeImportNumNew").text(resp.data.newImportsCount);
                        form.find(".beforeImportNumExisting").text(resp.data.existingImportsCount);
                        var invalidRows = resp.data.invalidRows.length;
                        if (resp.data.invalidRows.length != 0) {
                            invalidRows--;
                        }
                        form.find(".beforeImportNumInvalid").text(invalidRows);

                        var invalidRowsBody = form.find(".beforeImportInvalidRows");
                        invalidRowsBody.html("");
                        if (resp.data.invalidRows) {
                            for (var i = 0; i < resp.data.invalidRows.length; i++) {
                                var row = resp.data.invalidRows[i];
                                flog("row", row);
                                var tr = $("<tr>");
                                for (var col = 0; col < row.length; col++) {
                                    var colText = row[col];
                                    tr.append("<td>" + colText + "</td>");
                                }
                                invalidRowsBody.append(tr);
                            }
                        }

                        importTotalCount = resp.data.newImportsCount + resp.data.existingImportsCount;

                        $('#result').show();
                        $('#processing').hide();
                        if (importTotalCount == 0 || resp.data.toManyErrors) {
                            form.find('[type=submit]').attr('disabled', true);

                            if (resp.data.toManyErrors) {
                                $('#toManyErrors').show();
                            } else {
                                form.find('#noValidRow').removeClass('hide');
                            }
                        } else {
                            $('#toManyErrors').hide();
                            form.find('#noValidRow').addClass('hide');
                            form.find('[type=submit]').attr('disabled', false);
                        }
                    } else if (!resp.status && resp.messages) {
                        var msg = 'Please check the selected fields:' + '</br><ul>';
                        for (var i = 0; i < resp.messages.length; i++) {
                            msg += '<li>' + resp.messages[i] + '</li>';
                        }
                        msg += '</ul>';
                        Msg.error(msg);
                    } else {
                        $('#myWizard').wizard('selectedItem', {step: reviewRow});
                        form.find(".beforeImportInfo").text('Cannot verify data to import');
                    }
                },
                error: function (err) {
                    form.find(".beforeImportInfo").text('Cannot verify data to import');
                }
            });

            evt.preventDefault();
            return false;
        }

        if (data.step === reviewRow) {
            if (!importWizardStarted) {
                Msg.error("Importing process hasn't been started yet");
                evt.preventDefault();
                return false;
            }
        }
    });

    flog("Init importer form", form);
    form.forms({
        postUrl: importUrl,
        validate: function () {
            if (importWizardStarted) {
                $('#myWizard').wizard("next");

                var resultCustomValidate = {
                    error: 1,
                    errorMessages: [" That task is already in progress. Please cancel it or wait until it finishes"]
                };

                return resultCustomValidate;
            }
        },
        onError: function (resp, form, config) {
            Msg.error(resp.messages[0]);
            checkProcessStatus();
            $('#myWizard').wizard("next");
        },
        beforePostForm: function (form, config, data) {
            importWizardStarted = true;
            return data;
        },
        onSuccess: function (resp, form, config) {
            $('#myWizard').wizard("next");
            checkProcessStatus();
        }
    });

    $('#btn-upload').mupload({
        url: importUrl,
        useJsonPut: false,
        buttonText: '<i class="clip-folder"></i> Upload CSV, XLS, XLSX',
        acceptedFiles: '.csv,.xlsx,.xls,.txt',
        oncomplete: function (resp, name, href) {
            flog("oncomplete", resp, name, href);

            populateImportTable(form, resp.result.data);

            $('#myWizard').wizard("next");
        }
    });

    $('#btn-cancel-import').on('click', function (e) {
        e.preventDefault();
        var c = confirm('Are you sure you want to cancel this process?');
        if (!c) {
            return;
        }
        $.ajax({
            type: 'post',
            url: importUrl,
            data: {cancel: 'cancel'},
            success: function (data) {
                Msg.success('Import task cancelled');
            },
            error: function () {

            }
        });
    });
}

function populateImportTable(form, data) {
    flog("got data", data);
    var table = data.table;
    form.find("input[name=fileHash]").val(table.hash);
    var fields = data.destFields;
    fields = sortObjectByValue(fields);
    var thead = $("#importerHead");
    thead.html("");
    flog("headers:", data.numCols);
    $('#importerTable').css({width: (data.numCols * 200) + 'px', maxWidth: 'none', minWidth: '100%'});
    thead.append("<th>#</th>");
    for (var col = 0; col < data.numCols; col++) {
        var td = $('<th style="min-width: 200px">');
        thead.append(td);
        var select = $("<select class='form-control' name='col" + col + "'>");
        select.append("<option value=''>[Do not import]</option>");

        for (var field in fields) {
            select.append("<option value='" + field + "'>" + fields[field] + "</option>");
        }

        td.append(select);
    }
    flog("done head", thead);

    var tbody = $("#importerBody");
    tbody.html("");
    var numRows = 0;
    $.each(table.rows, function (i, row) {
        if (numRows < 50) {
            numRows++;
            var tr = $("<tr>");
            tbody.append(tr);
            var td = $("<td>" + i + "</td>");
            tr.append(td);
            $.each(row, function (i, cell) {
                var td = $("<td>");
                td.html(cell);
                tr.append(td);
            });
        }
    });
}

function checkProcessStatus() {
    flog("checkProcessStatus");
    var jobTitle = $(".job-title");
    var resultStatus = $('#job-status');
    $.ajax({
        type: 'GET',
        dataType: "json",
        url: importUrl + "?importStatus",
        success: function (result) {
            flog("success", result);
            if (result.status) {
                resultStatus.text(result.messages[0]);
                if (result.data) {
                    var state = result.data.state;
                    flog("state", state);

                    if (result.data.statusInfo.complete) {
                        var dt = result.data.statusInfo.completedDate;
                        flog("Process Completed", dt);
                        jobTitle.text("Process finished at " + pad2(dt.hours) + ":" + pad2(dt.minutes));

                        if (typeof state.updatedCount !== 'undefined') {
                            $('#myWizard').find('.updatedCount').text(state.updatedCount)
                        }
                        if (typeof state.createdCount !== 'undefined') {
                            $('#myWizard').find('.createdCount').text(state.createdCount)
                        }
                        if (typeof state.deletedCount !== 'undefined') {
                            $('#myWizard').find('.deletedCount').text(state.deletedCount)
                        }
                        if (typeof state.errorCount !== 'undefined') {
                            $('#myWizard').find('.errorCount').text(state.errorCount)
                        }
                        flog("finished state", state, state.resultHash);
                        if (typeof state.resultHash !== 'undefined' && state.resultHash != null) {
                            var href = "/_hashes/files/" + state.resultHash + ".csv";
                            $('#myWizard').find('.errorRows').prop("href", href).closest("a").show();
                        } else {
                            $('#myWizard').find('.errorRows').closest("a").hide();
                        }

                        $('#myWizard').wizard("next");
                        $('#table-Orgs-body').reloadFragment({url: '/organisations/'});
                        $('#aggregationsContainer').reloadFragment({url: '/organisations/'});
                        importWizardStarted = false;
                        $('#importProgressbar .progress-bar').attr('aria-valuenow', 0).css('width', '0%');
                        importTotalCount = 0;
                        return; // dont poll again
                    } else {
                        // running
                        flog("Message", result.messages[0]);
                        resultStatus.text(result.messages[0]);
                        var percentComplete = result.messages[0].split(' ').reverse()[0] / importTotalCount * 100;
                        if (isNaN(percentComplete)) {
                            percentComplete = 0;
                        }
                        percentComplete = percentComplete * 0.9; // scale down to a max of 90% so the Org doesnt think they're finished when they're not.
                        $('#importProgressbar .progress-bar').attr('aria-valuenow', percentComplete).css('width', percentComplete + '%');
                        jobTitle.text("Process running...");
                    }
                } else {
                    // waiting to start
                    jobTitle.text("Waiting for process job to start ...");
                }
                window.setTimeout(checkProcessStatus, 2500);

            } else {
                flog("No task");
            }
        },
        error: function (resp) {
            flog("weird..", resp);
        }
    });
}

function sortObjectByValue(obj) {
    var sorted = {};
    var prop;
    var arr = [];

    for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            var o = {key: prop, value: obj[prop]};
            arr.push(o);
        }
    }

    arr.sort(function (a, b) {
        if (a.value > b.value)
            return 1;
        if (a.value < b.value)
            return -1;
        return 0;
    });

    for (i = 0; i < arr.length; i++) {
        sorted[arr[i].key] = arr[i].value;
    }

    return sorted;
}