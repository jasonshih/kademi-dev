
function initUploads() {
    var form = $("#importerWizard form");

    $('#myWizard').wizard();
    $('#importerWizard').on('show.bs.collapse', function () {
        var curStep = $('#myWizard').wizard('selectedItem');
        if(!form.find('input[name=fileHash]').val()){
            curStep = 1;
        }
        $('#myWizard').wizard('selectedItem', { step: curStep });
    });

    $('#myWizard').on('actionclicked.fu.wizard', function (evt, data) {
        if (data.step === 1 && $('#importerWizard').attr('aria-expanded')=='true') {
            if (form.find("input[name=fileHash]").val() == "") {
                if($('#btn-upload').length){
                    alert("Please select a file to upload");
                }else{
                    alert("Sale Group hasn't been set. Please contact administrator for assistant.");
                }
                evt.preventDefault();
            }
        }

        if(data.step === 2){
            var startRow = $('#startRow').val();
            if(!startRow){
                alert('Please enter start row value');
                $('#startRow').trigger('focus').parents('.form-group').addClass('has-error');
                evt.preventDefault();
                return false;
            }else{
                $('#startRow').parents('.form-group').removeClass('has-error');
            }

            var importerHead = $('#importerHead');
            var selectedCols = [];
            importerHead.find('select').each(function(){
                if(this.value){
                    selectedCols.push(this.value);
                }
            });

            if(selectedCols.length<1){
                alert('Please select at least 1 column data to import');
                importerHead.find('select').first().trigger('focus');
                evt.preventDefault();
            }
        }
    });

    flog("Init importer form", form);
    form.forms({
        onSuccess: function (resp, form, config) {
            $('#myWizard').wizard("next");
            doCheckProcessStatus();
        }
    });

    $('#btn-upload').mupload({
        url: window.location.pathname,
        useJsonPut: false,
        buttonText: '<i class="clip-folder"></i> Upload CSV',
        oncomplete: function (resp, name, href) {
            flog("oncomplete", resp, name, href);

            var data = resp.result.data;
            flog("got data", data);
            var table = data.table;
            form.find("input[name=fileHash]").val(table.hash);
            var fields = data.destFields;
            var thead = $("#importerHead");
            thead.html("");
            flog("headers:", data.numCols);
            thead.append("<th>#</th>");
            for (var col = 0; col < data.numCols; col++) {
                var td = $("<th>");
                thead.append(td);
                var select = $("<select class='form-control' name='col" + col + "'>");
                select.append("<option value=''>[Do not import]</option>");

                for(var field in fields){
                    select.append("<option value='"+field+"'>" + fields[field] + "</option>");
                }

                td.append(select);
            }
            flog("done head", thead);

            var tbody = $("#importerBody");
            tbody.html("");
            $.each(table.rows, function (i, row) {
                if (i < 10) {
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

            $('#myWizard').wizard("next");
        }
    });
}

function initSearchUser() {
    $('#user-query').on({
        input: function(){
            typewatch(function () {
                flog('do search');
                doSearch();
            }, 500);
        }
    });
    $('#search-group').change(function () {
        doSearch();
    });
}

function doSearch() {
    var lastQuery = $('#user-query').attr('last-query');
    var query = $('#user-query').val();
    // fix the issue on IE that fire the search when focusing on input field
    if(lastQuery===query || (typeof lastQuery === 'undefined' && query==='')){
        return;
    }
    $('#user-query').attr('last-query', query);
    var groupName = $('#search-group').val();
    flog('doSearch', query, groupName);
    var uri = URI(window.location);
    uri.setSearch('q', query);
    uri.setSearch('g', groupName);
    flog('doSearch', uri.toString());
    var newHref = uri.toString();
    window.history.pushState('', newHref, newHref);
    Msg.info('Searching...', 50000);
    $.ajax({
        type: 'GET',
        url: newHref,
        success: function (data) {
            Msg.info('Search complete', 2000);
            flog('success', data);
            var newDom = $(data);
            var $fragment = newDom.find('#searchResults');
            $('#searchResults').replaceWith($fragment);
            $('abbr.timeago').timeago();
        },
        error: function (resp) {
            Msg.error('An error occured doing the user search. Please check your internet connection and try again');
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
        url: window.location.pathname + "?importStatus",
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

                        doSearch();

                        $('#myWizard').wizard("next");

                        return; // dont poll again
                    } else {
                        // running
                        flog("Message", result.messages[0]);
                        resultStatus.text(result.messages[0]);
                        jobTitle.text("Process running...");
                    }

                } else {
                    // waiting to start
                    jobTitle.text("Waiting for process job to start ...");
                }
                window.setTimeout(doCheckProcessStatus, 2500);

            } else {
                flog("No task");
            }
        },
        error: function (resp) {
            flog("weird..", resp);
        }
    });
}
