var searchOptions = {
    startDate: null,
    endDate: null
};

function initManagePointsSystem() {
    flog("initManagePointsSystem");
    
    showHidePointsOrgType();
    initGroupEditing();
    initFormPointsSystem();
    initRemovePoints();
    initExpireAllPoints();
    initClearAllPoints();
    initDeleteDebits();
    initClearAllDebits();
    initLeaderboardSearch();
    initDebitsPjax();
    
    $("select.pointsType").click(function () {
        showHidePointsOrgType();
    });

    $(document.body).on('click', '.btn-remove-group', function (e) {
        e.preventDefault();
        var btn = $(this);
        var name = btn.attr("href");
        setGroupRecipient(name, "", false);
        btn.closest('span').remove();
        $("#modalGroup input[name=" + name + "]").check(false);
    });

    $(document.body).on('keypress', '#data-query', function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();

            doHistorySearch();
            return false;
        }
    });

    $(document.body).on('change', '#data-query', function (e) {
        e.preventDefault();

        doHistorySearch();
    });

    $(document.body).on('pageDateChanged', function (e, startDate, endDate) {
        searchOptions.startDate = startDate;
        searchOptions.endDate = endDate;

        doHistorySearch();
        doLeaderboardSearch();
    });
}

function initExpireAllPoints() {
    $(document.body).on('click', '.btnExpireAll', function (e) {
        e.preventDefault();
        if (confirm("Are you sure you want to expire all records? This can not be undone! All points records in this points system will be marked as expired and not available for redemptions.")) {
            $.ajax({
                type: 'POST',
                data: {
                    expireAll: true
                },
                dataType: "json",
                url: "",
                success: function (data) {
                    flog("success", data);
                    if (data.status) {
                        $('#tablePointsBody').reloadFragment();
                        Msg.success("All points have been expired");
                    } else {
                        Msg.error("There was a problem expiring points. Please try again and contact the administrator if you still have problems");
                    }
                },
                error: function (resp) {
                    Msg.error("An error occurred removing points. You might not have permission to do this");
                }
            });
        }
    });
}

function initGroupEditing() {
    $("#modalGroup input[type=checkbox]").click(function () {
        var $chk = $(this);
        flog("checkbox click", $chk, $chk.is(":checked"));
        var isRecip = $chk.is(":checked");
        var groupType = $chk.closest('label').data("grouptype");
        setGroupRecipient($chk.attr("name"), groupType, isRecip);
    });
}

function initFormPointsSystem() {
    flog('initFormPointsSystem');

    $("form.managePointsSystem").forms({
        callback: function (resp) {
            flog("done");
            if (resp.status) {
                Msg.info("Saved");
            } else {
                Msg.error("Sorry, couldnt save");
            }

        }
    });
}


function initDebitsPjax() {
    $(document).pjax2('.debitsTableWrap', {
        selector: '.debitsPaginator a',
        fragment: '.debitsTableWrap',
        success: function () {
            flog('Pjax success!');
            window.location.hash = '#debits-tab';
        },
        debug: true
    });
}

function showHidePointsOrgType() {
    if ($("select.pointsType").val() == "POINTS_ORG") {
        $(".pointsOrgType").show();
    } else {
        $(".pointsOrgType").hide();
    }
}


function initRemovePoints() {
    $(".btnRemovePoints").click(function (e) {
        e.preventDefault();
        var node = $(e.target);
        flog("initRemoveSalesData", node, node.is(":checked"));
        var checkBoxes = $('#tablePoints').find('tbody input[name=toRemoveId]:checked');
        if (checkBoxes.length === 0) {
            Msg.error("Please select the points you want to remove by clicking the checkboxs to the right");
        } else {
            if (confirm("Are you sure you want to remove " + checkBoxes.length + " points?")) {
                doRemovePoints(checkBoxes);
            }
        }
    });
}

function initClearAllPoints() {
    // btn-clear-history
    $(document.body).on('click', '.btn-clear-history', function (e) {
        e.preventDefault();
        if (confirm("Are you sure you want to clear all records? This can not be undone!")) {
            $.ajax({
                type: 'POST',
                data: {
                    clearHistory: true
                },
                dataType: "json",
                url: "",
                success: function (data) {
                    flog("success", data);
                    if (data.status) {
                        $('#tablePoints tbody').empty();
                        Msg.success("Removed points ok");
                    } else {
                        Msg.error("There was a problem removing points. Please try again and contact the administrator if you still have problems");
                    }
                },
                error: function (resp) {
                    Msg.error("An error occurred removing points. You might not have permission to do this");
                }
            });
        }
    });
}


function doRemovePoints(checkBoxes) {
    Msg.info("Deleting...", 2000);
    $.ajax({
        type: 'POST',
        data: checkBoxes,
        dataType: "json",
        url: "",
        success: function (data) {
            flog("success", data);
            if (data.status) {
                Msg.success("Removed points ok");
                $("#tablePointsBody").reloadFragment();
            } else {
                Msg.error("There was a problem removing points. Please try again and contact the administrator if you still have problems");
            }
        },
        error: function (resp) {
            Msg.error("An error occurred removing points. You might not have permission to do this");
        }
    });
}

function doHistorySearch() {
    flog('doHistorySearch');
    Msg.info("Doing search...", 2000);

    var data = {
        startDate: searchOptions.startDate,
        finishDate: searchOptions.endDate,
        dataQuery: $('#data-query').val()
    };
    flog("data", data);

    var target = $("#tablePointsBody");
    target.load();

    $.ajax({
        type: "GET",
        url: window.location.pathname,
        dataType: 'html',
        data: data,
        success: function (content) {
            flog('response', content);
            Msg.success("Search complete", 2000);
            var newBody = $(content).find("#tablePointsBody");
            target.replaceWith(newBody);
            $("abbr.timeago").timeago();
            flog("done insert and timeago", $("abbr.timeago"));
        }
    });
}

function initDeleteDebits() {
    $("body").on('click', '.btnRemoveDebits', function (e) {
        e.preventDefault();
        var checkBoxes = $('#table-debits').find('tbody input[name=removeDebitsId]:checked');
        if (checkBoxes.length === 0) {
            Msg.error("Please select the debits you want to remove by clicking the checkboxs to the right");
        } else {
            if (confirm("Are you sure you want to remove " + checkBoxes.length + " debits?")) {
                doRemoveDebits(checkBoxes);
            }
        }
    });
}

function doRemoveDebits(checkBoxes) {
    Msg.info("Deleting...", 2000);
    $.ajax({
        type: 'POST',
        data: checkBoxes,
        dataType: "json",
        success: function (data) {
            flog("success", data);
            if (data.status) {
                Msg.success("Removed debits ok");
                $("#table-debits").reloadFragment();
            } else {
                Msg.error("There was a problem removing debits. Please try again and contact the administrator if you still have problems");
            }
        },
        error: function (resp) {
            Msg.error("An error occurred removing debits. You might not have permission to do this");
        }
    });
}

function initClearAllDebits() {
    // btn-clear-history
    $(document.body).on('click', '.btn-clear-debits', function (e) {
        e.preventDefault();
        if (confirm("Are you sure you want to clear all records? This can not be undone!")) {
            $.ajax({
                type: 'POST',
                data: {
                    clearDebits: true
                },
                dataType: "json",
                url: "",
                success: function (data) {
                    flog("success", data);
                    if (data.status) {
                        $('#table-debits tbody').empty();
                        Msg.success("Removed points ok");
                    } else {
                        Msg.error("There was a problem removing debits. Please try again and contact the administrator if you still have problems");
                    }
                },
                error: function (resp) {
                    Msg.error("An error occurred removing debits. You might not have permission to do this");
                }
            });
        }
    });
}


function initLeaderboardSearch() {
    $(document.body).on('keypress', '#leaderboard-limit', function (e) {
        var code = e.keyCode || e.which;
        if (code === 13) {
            e.preventDefault();

            doLeaderboardSearch();

            return false;
        }
    });

    $(document.body).on('change', '#leaderboard-limit', function (e) {
        e.preventDefault();

        doLeaderboardSearch();
    });
}

function doLeaderboardSearch() {
    flog('doHistorySearch');
    Msg.info("Doing search...", 2000);

    var leaderboardLimit = parseInt($('#leaderboard-limit').val(), 10);
    if (Number.isNaN(leaderboardLimit)) {
        leaderboardLimit = 20;
    }

    var data = {
        lbStartDate: searchOptions.startDate,
        lbFinishDate: searchOptions.endDate,
        lbLimit: leaderboardLimit
    };
    flog("data", data);

    var target = $("#table-leaderboard");
    target.load();

    $.ajax({
        type: "GET",
        url: window.location.pathname,
        dataType: 'html',
        data: data,
        success: function (content) {
            flog('response', content);
            Msg.success("Search complete", 2000);
            var newBody = $(content).find("#table-leaderboard");
            target.replaceWith(newBody);
            $("abbr.timeago").timeago();
            flog("done insert and timeago", $("abbr.timeago"));
        }
    });
}
