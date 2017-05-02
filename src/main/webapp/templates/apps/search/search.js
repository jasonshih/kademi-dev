function initContentSearch() {
    flog("initContentSearch");

    var txtKeyword = $("input[name=q]");
    var searchResults = $('#search-results');
    txtKeyword.on({
        keyup: function () {
            var query = $(this).val();
            typewatch(function () {
                // Load fragment
                flog("do search on keyup event", searchResults);
                searchResults.load('contentSearch?q=' + encodeURIComponent(query.trim()) + ' #search-results > *');
            }, 500);
        },
        input: function () {
            var query = $(this).val() || '';
            if (query.trim() === '') {
                flog("Query is empty. Clear search result panel!", searchResults);
                searchResults.html('');
            }
        }
    });

    txtKeyword.keyup();

    txtKeyword.closest('form').on('submit', function (e) {
        var keyword = txtKeyword.val().trim();

        if (!keyword) {
            e.preventDefault();
        }
    });
}

function prettyPrintJson() {
    flog('prettyPrintJson');

    $('.prettyPrintJson pre').each(function (i, n) {
        var target = $(n);
        var json = target.text();
        var obj = JSON.parse(json);
        var str = JSON.stringify(obj, null, 2);
        target.text(str);
        flog('set json', target, str);
    });
}

function initReindexForms() {
    $(".manage-search form").forms({
        confirmMessage: "Processing, Please Wait...",
        callback: function (resp) {
            flog("The contents of current repository have been re-indexed", resp);
            // Should be disabled the Re-index button while processing, just enable after re-index thread was started
            $(".btn-reindex").prop('disabled', true);

            // Load state of re-indexing process
            setTimeout(function () {
                reIndexState()
            }, 1500);
        }
    });
}

function reIndexState() {
    $.ajax({
        url: location.href + "../manageSearchStatus",
        success: function (res) {
            flog("Response", res);
            var resp = $.parseJSON(res);
            var data = resp.data, status = resp.status, message = resp.messages, state = message[0];
            if (state != 'STOPPED') {
                flog("Re-indexing state: " + data + " resources (htmls, blogs, products...) have been processed");
                $(".pageMessage").css({"display": "block"});
                $(".pageMessage").empty();
                $(".pageMessage").html("<b>Re-Indexing Status: </b><i class=\"badge badge-info\">" + data + "</i> files have been processed");
            }

            var lblReindex = $(".lbl-reindex-action");
            if (state == 'PENDING' || state == 'PROCESSING') {
                if (state == 'PROCESSING') {
                    $(".btn-reindex").prop('disabled', false);
                    lblReindex.empty();
                    lblReindex.html("Stop re-indexing process");
                }
                // Continually to check running jobs status every 500 milliseconds
                setTimeout(function () {
                    reIndexState()
                }, 500);
            } else if (state == 'STOPPED' || state == 'COMPLETED' || !status) {
                if (state == 'STOPPED') {
                    flog("RE-INDEXING PROCESS HAVE BEEN STOPPED BY SOMEONE!!!");
                    $(".btn-reindex").prop('disabled', false);
                }

                // Throw exception message
                if (!status) {
                    Msg.error(state);
                }
                lblReindex.empty();
                lblReindex.html("Re-index");

                setTimeout(function () {
                    // Should be closed message after 5 minutes
                    $(".pageMessage").css({"display": "none"});
                }, 5000);
            }
        }
    });
}