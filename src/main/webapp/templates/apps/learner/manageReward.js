function initEditReward(quiz) {
    try {
        initHtmlEditors($(".htmleditor"));
        $("form.manageRewardForm").forms({
            callback: function(resp) {
                flog("done", resp);
                Msg.success("Saved ok");
            },
            error: function() {
                Msg.error("Some information is not valid. Please check the reward details");
            }
        });

        $("body").on("submitForm", "form", function(e) {
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
        $(".Cancel").click(function() {
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
    form.submit(function(e) {
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

    $(".restrictionList").on("click", ".remove", function(e) {
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
    $("#modalGroup input[type=checkbox]").click(function() {
        var $chk = $(this);
        flog("checkbox click", $chk, $chk.is(":checked"));
        var isRecip = $chk.is(":checked");
        setGroupRecipient($chk.attr("name"), isRecip);
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
            success: function(data) {
                if (data.status) {
                    flog("saved ok", data);
                    if (isRecip) {
                        $(".GroupList").append('<button class="btn btn-sm btn-default reset-margin-bottom" type="button" style="margin-right: 5px;">' + name + '</button>');
                        flog("appended to", $(".GroupList"));
                    } else {
                        var toRemove = $(".GroupList button").filter(function() {
                            return $(this).text() == name;
                        });
                        toRemove.remove();
                    }
                } else {
                    flog("error", data);
                    Msg.error("Sorry, couldnt save " + data);
                }
            },
            error: function(resp) {
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
    $("#manageReward .Add").click(function() {
        showAddReward(this);
    });
    $("#manageReward form.addReward").forms({
        callback: function(resp) {
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
    list = $("#manageReward .Content ul li").each(function(i) {
        $(this).attr("rel", i);
    }).clone();
}
;

function stripList() {
    $("#manageReward .Content ul li").removeClass("Odd").filter(":odd").addClass("Odd");
}

function initController() {
    //Bind event for Delete reward
    $("body").on("click", "a.DeleteReward", function(e) {
        e.preventDefault();
        var link = $(e.target).closest("a");
        var href = link.attr("href");

        confirmDelete(href, href, function() {
            flog("remove it");
            link.closest("tr").remove();
            link.closest("li").remove();
            Msg.success('Reward is deleted!');
        });
    });
}

function sortBy(type, asc) {
    var _list = {};
    var sortObject = function(obj) {
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
    $("body").on("click", "a.SortByStatus", function(e) {
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
    $("body").on("click", "a.SortByTitle", function(e) {
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

    chks.click(function(e) {
        var node = $(e.target);
        if (node.is(":checked")) {
            node.closest("div").find("div.entryFormItemDetails").show(200);
        } else {
            node.closest("div").find("div.entryFormItemDetails").hide(200);
        }
    });
    chks = chks.filter(":checked");
    flog("chcks", chks);
    chks.each(function(i, n) {
        var node = $(n);
        node.parent().find("div.entryFormItemDetails").show();
    })
}