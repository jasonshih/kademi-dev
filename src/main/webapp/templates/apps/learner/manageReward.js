function initManagePoints() {
    initSelectAll();

    var editModal = $("#modalEditPoints");
    var modalForm = editModal.find("form");
    modalForm.forms({
        callback: function (resp) {
            if (resp.status) {
                Msg.success("Points record updated ok");
                editModal.modal("hide");
                $('#pointsBody, #pointsFooter').reloadFragment();
            } else {
                Msg.error("Sorry, there was a problem updating the points record");
            }
        }
    });
    $("#pointsContainer").on("click", ".btnEditPoints", function (e) {
        e.preventDefault();
        var href = $(e.target).closest("a").attr("href");
        modalForm.attr("action", href);
        $.ajax({
            url: href,
            dataType: "json",
            success: function (data) {
                flog("success", data)
                if (data.status) {
                    modalForm.find("input[name=numPoints]").val(data.data.numPoints);
                    modalForm.find("input[name=reason]").val(data.data.reason);
                    editModal.modal("show");
                } else {
                    Msg.error("There was a problem loading the points record");
                }
            },
            error: function (resp) {
                Msg.error("There was a problem loading the point record");
            }
        });
    });

    var createDebitModal = $("#modalCreateDebit");
    var createDebitForm = createDebitModal.find("form");
    createDebitForm.forms({
        callback: function (resp) {
            if (resp.status) {
                Msg.success("Points debit created ok");
                createDebitModal.modal("hide");
                $('#pointsBody, #pointsFooter').reloadFragment();
            } else {
                Msg.error("Sorry, there was a problem creating the debit record");
            }
        }
    });

    $(".removeUsers").click(function (e) {
        var node = $(e.target);
        log("removeUsers", node, node.is(":checked"));
        var checkBoxes = node.closest(".Content").find("tbody td input[name=toRemoveId]:checked");
        if (checkBoxes.length == 0) {
            Msg.error("Please select the points you want to remove by clicking the checkboxs to the right");
        } else {
            if (confirm("Are you sure you want to remove " + checkBoxes.length + " points records?")) {
                doRemovePoints(checkBoxes);
            }
        }
    });

    $("#new-points-form").forms({
        callback: function (resp) {
            if (resp.status) {
                Msg.info("Assigned points OK");
                $('#modal-new-points').modal('hide');
                $('#pointsBody, #pointsFooter').reloadFragment();
            } else {
                alert("An error occured and the points may not have been assigned. Please refresh the page and try again");
            }
        }
    }
    );

    $("#doUploadCsv").mupload({
        buttonText: "<i class=\"clip-folder\"></i> Upload spreadsheet",
        url: "points.csv",
        useJsonPut: false,
        oncomplete: function (data, name, href) {
            log("oncomplete:", data.result.data, name, href);
            $(".results .numUpdated").text(data.result.data.numUpdated);
            $(".results .numInserted").text(data.result.data.numInserted);
            $(".results .numUnmatched").text(data.result.data.unmatched.length);
            showUnmatched(data.result.data.unmatched);
            $(".results").show();
            Msg.success("Upload completed. Please review any unmatched members below, or refresh the page to see the updated list of members");
            $('#pointsBody, #pointsFooter').reloadFragment();
        }
    });

    var debitModal = $('#modal-debit-points');
    var debitModalForm = debitModal.find('form');

    debitModalForm.forms({
        callback: function (resp) {
            if (resp.status) {
                debitModal.modal('hide');
                Msg.success(resp.messages);
            } else {
                Msg.warning(resp.messages);
            }
        }
    });

    debitModal.on('hidden', function () {
        debitModalForm.trigger('reset');
    });

    initHistorySearch();

    $(document.body).on('click', '.btn-refresh-pb', function (e) {
        e.preventDefault();
        if (confirm('Are you sure you want to refresh the points balance for all rewards?')) {
            $.ajax({
                url: window.location.pathname,
                dataType: 'JSON',
                type: 'POST',
                data: {
                    refreshPointsBalance: true
                },
                success: function (data, textStatus, jqXHR) {
                    Msg.info(data.messages);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Msg.error('Oh No! Something went wrong!');
                }
            });
        }
    });

}

function initEditReward(quiz) {
    try {
        initHtmlEditors($(".htmleditor"));
        $("form.manageRewardForm").forms({
            callback: function (resp) {
                flog("done", resp);
                Msg.success("Saved ok");
            },
            error: function () {
                Msg.error("Some information is not valid. Please check the reward details");
            }
        });

        $("body").on("submitForm", "form", function (e) {
            var form = $(e.target);
            data = prepareQuizForSave(form);
            form.find("input.answer").remove();
            form.find("input[name=quizHtml]").val(data.body);
            for (var key in data) {
                if (key.startsWith("answer")) {
                    var inp = $("<input type='hidden' class='answer'/>");
                    inp.attr("name", key);
                    inp.val(data[key]);
                    form.append(inp);
                }
            }
        });
        $(".Cancel").click(function () {
            window.location = "../";
        });

        initGroupEditing();
        initEntryFormEditing();
        initQuizBuilder();
        initRestrictions();
        var quizContainer = $(".quizContainer");
        loadQuizEditor(quizContainer, quiz);
    } catch (e) {
        flog("exception in initEditReward", e);
    }
}

function initRestrictions() {
    var form = $(".addRestrictionForm");
    form.submit(function (e) {
        e.preventDefault();
        var type = form.find("select[name=type]").val();
        var typeText = form.find("select[name=type] option:selected").text();
        var item = form.find("select[name=item]").val();
        var text = form.find("select[name=item] option:selected").text();
        var ul = $(".restrictionList");
        var li = $("<li>");
        li.text(typeText + " " + text);
        var id = Math.floor(Math.random() * 1000000);
        li.append("<input type='hidden' name='restrictionType" + id + "' value='" + type + "'/>");
        li.append("<input type='hidden' name='restrictionItem" + id + "' value='" + item + "'/>");
        li.append("<button data-dismiss=\"alert\" class=\"close remove\">&times;</button>");
        ul.append(li);
        ul.removeClass('hidden');
        flog("Successfully added restriction!");

        $("#modalAddRestriction").modal('hide');
    });

    $(".restrictionList").on("click", ".remove", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(e.target).closest("li").remove();
        var ul = $(".restrictionList");
        if (ul.find("li .remove").html() === undefined) {
            ul.addClass("hidden");
        }
    });
}

function initGroupEditing() {
    $("#modalGroup input[type=checkbox]").click(function () {
        var $chk = $(this);
        flog("checkbox click", $chk, $chk.is(":checked"));
        var isRecip = $chk.is(":checked");
        setGroupRecipient($chk.attr("name"), isRecip);
    });
}

function initRewardImages() {
    $("#delete-image").on("click", "", function (e) {
        e.preventDefault();
        var target = $(e.target).closest("a");
        var href = target.attr("href");
        var name = getFileName(href);
        confirmDelete(href, name, function () {
            $("#reward-image").reloadFragment();
        });
//        $("#reward-image").reloadFragment();
    });
    $('#btn-change-img').upcropImage({
        buttonContinueText: 'Save',
        url: window.location.pathname, // this is actually the default value anyway
        onCropComplete: function (resp) {
            flog("onCropComplete:", resp, resp.nextHref);
            $("#reward-image").reloadFragment();
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
                        $("#reward-image").reloadFragment();
                    } else {
                        Msg.error("An error occurred processing the image");
                    }
                },
                error: function () {
                    alert('Sorry, we couldn\'t save your image.');
                }
            });
        }
    });
}


function setGroupRecipient(name, isRecip) {
    flog("setGroupRecipient", name, isRecip);
    try {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                group: name,
                isRecip: isRecip
            },
            dataType: "json",
            success: function (data) {
                if (data.status) {
                    flog("saved ok", data);
                    if (isRecip) {
                        $(".GroupList").append('<button class="btn btn-sm btn-default reset-margin-bottom" type="button" style="margin-right: 5px;">' + name + '</button>');
                        flog("appended to", $(".GroupList"));
                    } else {
                        var toRemove = $(".GroupList button").filter(function () {
                            return $(this).text() == name;
                        });
                        toRemove.remove();
                    }
                } else {
                    flog("error", data);
                    Msg.error("Sorry, couldnt save " + data);
                }
            },
            error: function (resp) {
                flog("error", resp);
                Msg.error("Sorry, couldnt save - " + resp);
            }
        });
    } catch (e) {
        flog("exception in createJob", e);
    }
}

var list;

function initManageReward() {
    flog("initManageReward");
    stripList();
    initController();
//    initDialog();
    initSortableButton();
    initList();
    checkCookie();
    $("#manageReward .Add").click(function () {
        showAddReward(this);
    });
    $("#manageReward form.addReward").forms({
        callback: function (resp) {
            flog("done");
            window.location.href = resp.nextHref;
        }
    });

}

function checkCookie() {
    var _sort_type = $.cookie("reward-sort-type");
    if (_sort_type) {
        _sort_type = _sort_type.split("#");
        var _type = _sort_type[0];
        var _asc = _sort_type[1] === "asc" ? true : false;
        sortBy(_type, _asc);

        if (_type === "status") {
            $("a.SortByStatus").attr("rel", _asc ? "desc" : "asc");
        } else {
            $("a.SortByTitle").attr("rel", _asc ? "desc" : "asc");
        }
    }
}

function initList() {
    list = $("#manageReward .Content ul li").each(function (i) {
        $(this).attr("rel", i);
    }).clone();
}
;

function stripList() {
    $("#manageReward .Content ul li").removeClass("Odd").filter(":odd").addClass("Odd");
}

function initController() {
    //Bind event for Delete reward
    $("body").on("click", "a.DeleteReward", function (e) {
        e.preventDefault();
        var link = $(e.target).closest("a");
        var href = link.attr("href");

        confirmDelete(href, href, function () {
            flog("remove it");
            link.closest("tr").remove();
            link.closest("li").remove();
            Msg.success('Reward is deleted!');
        });
    });
}

function sortBy(type, asc) {
    var _list = {};
    var sortObject = function (obj) {
        var sorted = {},
                array = [],
                key,
                l;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                array.push(key);
            }
        }

        array.sort();
        if (!asc) {
            array.reverse();
        }

        for (key = 0, l = array.length; key < l; key++) {
            sorted[array[key]] = obj[array[key]];
        }
        return sorted;
    };

    if (type === "title") {
        for (var i = 0, _item; _item = list[i]; i++) {
            _item = $(_item);
            var title = _item.find("> span").html();
            var rel = _item.attr("rel");
            _list[title + "#" + rel] = _item;
        }
    } else {
        for (var i = 0, _item; _item = list[i]; i++) {
            _item = $(_item);
            var status = _item.find("> div > a.ShowDialog").html();
            var rel = _item.attr("rel");
            _list[status + "#" + rel] = _item;
        }
    }

    _list = sortObject(_list);

    var _rewardList = $("#manageReward .Content ul");
    _rewardList.html("");
    for (var i in _list) {
        _rewardList.append(_list[i]);
    }

    stripList();
}

function initSortableButton() {
    // Bind event for Status sort button
    $("body").on("click", "a.SortByStatus", function (e) {
        e.preventDefault();

        var _this = $(this);
        var _rel = _this.attr("rel");

        if (_rel === "asc") {
            sortBy("status", true);
            $.cookie("reward-sort-type", "status#asc");
            _this.attr("rel", "desc");
        } else {
            sortBy("status", false);
            $.cookie("reward-sort-type", "status#desc");
            _this.attr("rel", "asc");
        }
    });

    // Bind event for Title sort button
    $("body").on("click", "a.SortByTitle", function (e) {
        e.preventDefault();

        var _this = $(this);
        var _rel = _this.attr("rel");

        if (_rel === "asc") {
            sortBy("title", true);
            $.cookie("reward-sort-type", "title#asc");
            _this.attr("rel", "desc");
        } else {
            sortBy("title", false);
            $.cookie("reward-sort-type", "title#desc");
            _this.attr("rel", "asc");
        }
    });
}

function initEntryFormEditing() {
    var chks = $(".entryFormItem input[type=checkbox]");

    chks.click(function (e) {
        var node = $(e.target);
        if (node.is(":checked")) {
            node.closest("div").find("div.entryFormItemDetails").show(200);
        } else {
            node.closest("div").find("div.entryFormItemDetails").hide(200);
        }
    });
    chks = chks.filter(":checked");
    flog("chcks", chks);
    chks.each(function (i, n) {
        var node = $(n);
        node.parent().find("div.entryFormItemDetails").show();
    })
}


function doRemovePoints(checkBoxes) {
    $.ajax({
        type: 'POST',
        data: checkBoxes,
        dataType: "json",
        url: "",
        success: function (data) {
            log("success", data)
            if (data.status) {
                Msg.success("Removed points records");
                $('#pointsBody, #pointsFooter').reloadFragment();
            } else {
                Msg.error("There was a problem removing points records. Please try again and contact the administrator if you still have problems");
            }
        },
        error: function (resp) {
            Msg.error("An error occurred removing points. You might not have permission to do this");
        }
    });
}

function showUnmatched(unmatched) {
    var unmatchedTable = $(".results table");
    var tbody = unmatchedTable.find("tbody");
    tbody.html("");
    $.each(unmatched, function (i, row) {
        log("unmatched", row);
        var tr = $("<tr>");
        $.each(row, function (ii, field) {
            tr.append("<td>" + field + "</td>");
        });
        tbody.append(tr);
    });
    unmatchedTable.show();
}

var searchOptions = {
    startDate: null,
    endDate: null
};

function initHistorySearch() {
    $(document.body).on('pageDateChanged', function (e, startDate, endDate, text, trigger, initial) {
        flog("initHistorySearch: pageDateChanged", initial);
        if( initial ) {
            flog("Ignore initial");
            return;
        }
        searchOptions.startDate = startDate;
        searchOptions.endDate = endDate;
        doHistorySearch();
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

    $(document.body).on('change', '#searchGroup', function (e) {
        e.preventDefault();
        doHistorySearch();
    });

    $(document.body).on('change', '#searchReward', function (e) {
        e.preventDefault();
        doHistorySearch();
    });
}

function doHistorySearch() {
    flog('doHistorySearch');
    Msg.info("Doing search...", 2000);

    var data = {
        startDate: searchOptions.startDate,
        finishDate: searchOptions.endDate,
        dataQuery: $("#data-query").val(),
        searchGroup: $("#searchGroup").val(),
        searchReward: $("#searchReward").val(),
    };
    flog("data", data);

    $('.btn-export-points').attr('href', 'points.csv?' + $.param(data));

    var target = $("#pointsTable");
    target.load();

    var serialize = function (obj, prefix) {
        var str = [], p;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
                str.push((v !== null && typeof v === "object") ?
                        serialize(v, k) :
                        encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
        }
        return str.join("&");
    }

    var link = window.location.pathname + "?" + serialize(data);
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
            $("#pointsTable").paginator();
        }
    });
}
