function initManageGroup() {
    initCRUDGroup();
    addOrderGroup();
    initGroupModal();
    initCopyMembers();
    initPanelHeader();
    initGroupFolder();
    initDnD();
}

function initPanelHeader() {
    $(document.body).on('click', '.panel-tools, .btn-group .dropdown-menu', function (e) {
        e.stopPropagation();
    });
}

function initCRUDGroup() {
    var body = $(document.body);

    $('.btn-add-group').on('click', function (e) {
        e.preventDefault();
        flog('addGroupButton: click');
        showGroupModal('Group', 'Add new group', 'Add');
    });

    $('.btn-add-groupFolder').on('click', function (e) {
        e.preventDefault();
        flog('addGroupFolderButton: click');
        showGroupFolderModal('Folder', 'Add new folder', 'Add', "createFolder");
    });

    $('.btn-add-rule-group').on('click', function (e) {
        e.preventDefault();
        var name = prompt("Enter a name for the new rules-based group");
        if (name) {
            flog("create ", name);
            createRuleBasedGroup(name);
        }
    });


    // Bind event for Delete forum
    body.on('click', '.btn-delete-group', function (e) {
        e.preventDefault();

        var btn = $(this);
        var selectedGroup = btn.closest('div.group');
        var name = selectedGroup.data('name');
        var href = $.URLEncode(name);

        flog('delete', href);
        confirmDelete(href, name, function () {
            flog('remove ', this);
            var folder = btn.closest('.folder');
            btn.closest('.group').remove();
            folder.find(".group-count").text(folder.find(".group").size());
        });
    });

    body.on('click', '.btn-rename-group', function (e) {
        e.preventDefault();

        var btn = $(this);
        var selectGroup = btn.parents('div.group');
        var groupName = selectGroup.data('name');
        var groupTitle = selectGroup.data('title');
        var groupNotes = selectGroup.data('notes');
        var groupType = selectGroup.data('type');

        flog("groupName", groupName);
        showGroupModal('Group', 'Rename group', 'Rename', {
            name: groupName,
            title: groupTitle,
            notes: groupNotes,
            group: selectGroup.attr('id'),
            type: groupType
        });
    });

    body.on('input', '#modal-group [name=title]', function () {
        var titleInput = body.find('#modal-group [name=title]');
        var nameInput = body.find('#modal-group [name=name]');
        var group = body.find('#modal-group [name=group]');
        if (!group.val()) {
            var newVal = titleInput.val().toLowerCase();
            newVal = newVal.replaceAll("[", "-");
            newVal = newVal.replaceAll("]", "-");
            newVal = newVal.replaceAll(" ", "-");
            newVal = newVal.replaceAll("{", "-");
            newVal = newVal.replaceAll("}", "-");
            newVal = newVal.replaceAll("(", "-");
            newVal = newVal.replaceAll(")", "-");
            flog("on change", group, newVal);
            nameInput.val(newVal);
        }
    });
}

function createRuleBasedGroup(name) {
    flog('createRuleBasedGroup', name);
    try {
        $.ajax({
            type: "POST",
            url: window.location.href,
            data: {
                rulesGroupName: name
            },
            success: function (data) {
                Msg.info("Saved, going to new group");
                window.location = data.nextHref;
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('err');
            }
        });
    } catch (e) {
        flog('exception in createJob', e);
    }
}

function initPermissionCheckboxes() {
    $('body').on('click', '.roles input[type=checkbox]', function (e) {
        var $chk = $(this);
        flog('checkbox click', $chk, $chk.is(':checked'));
        var isRecip = $chk.is(':checked');
        var groupName = $chk.closest('aside').attr('rel');
        var permissionList = $chk.closest('.ContentGroup').find('.PermissionList');
        setGroupRole(groupName, $chk.attr('name'), isRecip, permissionList);
    });
}

function setGroupRole(groupName, roleName, isRecip, permissionList) {
    flog('setGroupRole', groupName, roleName, isRecip);
    try {
        $.ajax({
            type: "POST",
            url: window.location.href,
            data: {
                group: groupName,
                role: roleName,
                isRecip: isRecip
            },
            success: function (data) {
                flog('saved ok', data);
                if (isRecip) {
                    permissionList.append('<li>' + roleName + '</li>');
                } else {
                    flog('remove', permissionList.find('li:contains("' + roleName + '")'));
                    permissionList.find('li:contains("' + roleName + '")').remove();
                }
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('err');
            }
        });
    } catch (e) {
        flog('exception in createJob', e);
    }
}

function addOrderGroup() {
    $('div.group').each(function (i) {
        $(this).attr('data-group', i);
    });
}

function addOrderProgramList() {
    var tempControl = $('#modalListController').html();
    $('#modalGroup tr[rel=Program] ul.ListItem li').each(function (i) {
        $(this)
                .attr('data-program', i)
                .append(tempControl)
                .find('label', 'input')
                .each(function () {
                    var _this = $(this);
                    var randomId = Math.round(Math.random() * 100000);
                    var _for = _this.attr('for') || null;
                    var _name = _this.attr('name') || null;
                    var _id = _this.attr('id') || null;

                    if (_for) {
                        _this.attr('for', _for + randomId);
                    }

                    if (_name) {
                        _this.attr('name', _name + randomId);
                    }

                    if (_id) {
                        _this.attr('id', _id + randomId);
                    }
                });
    });
}

function addOrderPermissionList() {
    var tempControl = $('#modalListController').html();
    $('#modalGroup tr[rel=Permission] ul.ListItem li').each(function (i) {
        $(this).attr('data-permission', i).append(tempControl);
    });
}

function resetModalControl() {
    var modal = $('#modal-group');

    modal.find('input[type=text]').val('');
    modal.find('input[type=radio]').prop('checked', false);
    modal.attr('data-group', '');
}

function showGroupModal(name, title, type, data) {
    resetModalControl();

    var modal = $('#modal-group');
    flog('showGroupModal', modal);

    modal.find('.modal-title').html(title);
    modal.find('.btn-save-group').text(type);
    modal.find('input[name=groupActionType]').val(type);

    if (data) {
        if (data.name) {
            modal.find('input[name=name]').val(data.name);
        }

        if (data.title) {
            modal.find('input[name=title]').val(data.title);
        }

        if (data.notes) {
            modal.find('textarea[name=notes]').html(data.notes);
        }

        if (data.group) {
            modal.attr('data-group', data.group);
            modal.find('input[name=group]').val(data.group);
        }

        if (data.type) {
            modal.find('[name=groupType][value="' + data.type + '"]').prop('checked', true);
            var groupTypeSelection = modal.find("#groupTypeSelection");
            if (data.type == "R") {
                groupTypeSelection.hide();
                groupTypeSelection.find("input").removeClass("required");
                var input = $('<input>').attr({
                    type: 'hidden',
                    id: 'groupTypeDynamic',
                    name: 'groupTypeDynamic',
                    value: "R"
                });
                input.appendTo(groupTypeSelection);
            } else {
                groupTypeSelection.show();
                groupTypeSelection.find("input").addClass("required");
                if (modal.find("#groupTypeDynamic") !== undefined) {
                    modal.find("#groupTypeDynamic").remove();
                }
            }
        }
    } else {
        // Need to reset fields
        modal.find('input[type=hidden][name=group]').val('');
    }

    modal.modal('show');
}

function showGroupFolderModal(name, title, type, action, data) {
    resetModalControl();

    var modal = $('#modal-groupFolder');
    flog('showGroupFolderModal', modal);

    modal.find('.modal-title').html(title);
    modal.find('.btn-save-group').text(type);

    $("#folderModalAction").attr("name", action);

    if (typeof data !== "undefined") {
        flog(data);
        if (data.oldFolderName !== null) {
            modal.find("#name").attr("name", "newFolderName");
            modal.find("#name").val(data.oldFolderName);
            modal.find("#name").parent().append('<input class="form-control" type="hidden" name="oldFolderName" value="' + data.oldFolderName + '"/>')
        }
    } else {
        modal.find('[name="oldFolderName"]').remove();
    }

    modal.modal('show');
}

function maxOrderGroup() {
    var _order = [];
    $('div.Group').each(function () {
        _order.push($(this).attr('data-group'));
    });

    _order.sort().reverse();

    return (parseInt(_order[0]) + 1);
}

function initGroupModal() {
    var modal = $('#modal-group');

    modal.find('form').forms({
        onSuccess: function (resp) {
            reloadGroupFolders();
            Msg.success(resp.messages[0]);
            resetModalControl();
            modal.modal('hide');
        }
    });
}

function reloadGroupFolders() {
    $('#groups-folders').reloadFragment({
        whenComplete: function () {
            initDnD();
        }
    });
}

function addGroupFolder(name, url, data, callback) {
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: function (resp) {
            $('body').trigger('ajaxLoading', {
                loading: false
            });
            if (callback) {
                callback(name, resp);
            }
        },
        error: function (resp) {
            log('error', resp);
            $('body').trigger('ajaxLoading', {
                loading: false
            });
            if (resp.status === 400) {
                Msg.error('Sorry, the folder could not be created. Please check if a folder with that name already exists');
            } else {
                Msg.error('There was a problem creating the folder');
            }
        }
    });
}

function setRegoMode(currentRegoModeLink, selectedRegoModeLink) {
    var val = selectedRegoModeLink.attr('rel');
    var text = selectedRegoModeLink.text().trim();
    var data = 'milton:regoMode=' + val;
    var href = currentRegoModeLink.closest('div.Group').find('header div > span').text().trim();
    href = $.URLEncode(href) + '/';
    flog('setRegoMode: val=', val, 'text=', text, 'data=', data, 'href=', href);
    proppatch(href, data, function () {
        currentRegoModeLink.text(text);
    });
}

function initCopyMembers() {
    var body = $(document.body);
    var modal = $('#modal-copy-members');

    body.on('click', '.btn-copy-member', function (e) {
        flog('click', this);
        e.preventDefault();

        var btn = $(this);
        var href = btn.closest('div.group').find('span.group-name').text().trim();
        modal.find('span.group-name').text(href);
        href = $.URLEncode(href) + '/';
        modal.find('form').attr('action', href);
        modal.modal('show');
    });

    modal.find('form').forms({
        onSuccess: function (resp) {
            flog('done', resp);
            modal.modal('hide');
            Msg.success('Copied members');
            $('#groups-folders').reloadFragment();
        }
    });
}

function initGroupFolder() {
    var body = $(document.body);
    body.on('click', '.btn-remove-from-folder', function (e) {
        flog('click', this);
        e.preventDefault();

        var btn = $(this);
        var href = btn.closest('div.group').find('span.group-name').text().trim();
        var folderName = btn.attr("href");
        flog(href, folderName);
        //modal.find('span.group-name').text(href);
        href = $.URLEncode(href) + '/';
        /*name, url, data, callback*/
        addGroupFolder(folderName, href, "removeFromFolder=removeFromFolder&folderName=" + folderName, function () {
            Msg.success("Removed group from " + folderName);
            $('#groups-folders').reloadFragment();
        });
    });

    body.on('click', ".btn-delete-folder", function (e) {
        flog('click', this);
        e.preventDefault();

        var btn = $(this);
        var href = "";
        var folderName = btn.attr("href");
        flog(href, folderName);
        //modal.find('span.group-name').text(href);
        href = '.';
        /*name, url, data, callback*/
        Kalert.confirm("Are you sure you want to delete " + folderName, function () {
            addGroupFolder(folderName, href, "deleteFolder=deleteFolder&folderName=" + $.URLEncode(folderName), function () {
                Msg.success(folderName + ' has been deleted');
                $('#groups-folders').reloadFragment();
            });
        });
    });

    var addGroupToFolder = $('#modal-addGroupToFolder');

    body.on('click', '.btn-add-to-folder', function (e) {
        flog('click', this);
        e.preventDefault();

        var btn = $(this);
        var href = btn.closest('div.group').find('span.group-name').text().trim();
        flog(href);
        //modal.find('span.group-name').text(href);
        href = $.URLEncode(href) + '/';
        addGroupToFolder.find('form').attr('action', href);
        addGroupToFolder.modal('show');
    });

    addGroupToFolder.find('form').forms({
        onSuccess: function (resp) {
            flog('done', resp);
            addGroupToFolder.modal('hide');
            Msg.success('Copied members');
            $('#groups-folders').reloadFragment();
        }
    });

    var groupFolder = $('#modal-groupFolder');
    groupFolder.find('form').submit(function (e) {
        e.preventDefault();

        var btn = groupFolder.find(".btn-save-group");
        var type = btn.html();
        flog('Click add/edit group folder', btn, type);

        var name = $(groupFolder.find("[name=folderName]")).val();
        if (checkSimpleChars(groupFolder.find('form'))) {
            if (type === 'Add') {
                addGroupFolder(name, window.location.pathname, groupFolder.find('form').serialize(), function (name, resp) {
                    Msg.success(name + ' is created!');
                    window.location.reload();
                    groupFolder.modal('hide');
                    resetModalControl();

                });

            } else { // If is editing Group
                var name = $(groupFolder.find("[name=newFolderName]")).val();
                addGroupFolder(name, window.location.pathname, groupFolder.find('form').serialize(), function (name, resp) {
                    Msg.success(name + ' is updated!');
                    window.location.reload();
                    groupFolder.modal('hide');
                    resetModalControl();

                });
            }
        }
    });

    body.on('click', ".btn-rename-folder", function (e) {
        e.preventDefault();
        var folderName = $(e.target.closest(".folder")).data("name");
        showGroupFolderModal('Folder', 'Update folder name', 'Update', "renameFolder", {oldFolderName: folderName});
    });
}

function initDnD() {
    var startFolder;
    $('.group').draggable({
        revert: "invalid",
        axis: "y",
        delay: 200,
        start: function (event, ui) {
            flog("draggable start", event, ui);
            drapEventStart = event;
            startFolder = $(event.currentTarget.closest(".folder"));
            if (startFolder != null) {
                startFolder.find(".group-count").text(startFolder.find(".group").size());
            }
            clearTimeout(checkTimer);
            checkTimer = null;
        },
        stop: function (event, ui) {
            flog("draggable stop", event, ui);
            //var folder = $(event.currentTarget.closest(".folder"));
            if (startFolder != null) {
                startFolder.find(".group-count").text(startFolder.find(".group").size());
            }
        }
    });

    var checkTimer;
    $('.folder').droppable({
        accept: '.group',
        greedy: true,
        drop: function (event, ui) {
            var groupName = ui.draggable.attr("id");
            var currentFolder = $(this);
            var folderName = currentFolder.data("name");

            if (currentFolder.is(ui.draggable.closest('.folder'))) {
                flog('The draged item is already in this element!');
                ui.draggable.animate({
                    'top': 0
                }, 500);

                return;
            }

            currentFolder.find(".panel-group").append(
                    ui.draggable.css({
                        position: "relative",
                        top: "",
                        left: ""
                    })
                    );

            addGroupFolder(groupName, groupName, "addToFolder=addToFolder&folderName=" + folderName, function (name, resp) {
                Msg.success("Moved " + groupName + " to " + folderName);
            });

            currentFolder.find(".group-count").text(currentFolder.find(".group").size());

            setTimeout(function () {
                flog(currentFolder.find(".group").size());
                currentFolder.find(".group-count").text(currentFolder.find(".group").size());
            }, 150);

            flog(currentFolder.find(".group").size());
        },
        over: function (event, ui) {
            flog(event, ui);
        },
        out: function (event, ui) {
        }
    });

    $(".container").droppable({
        accept: function (draggableElement) {
            var isInFolder = draggableElement.closest('.folder').length > 0;

            return isInFolder;
        },
        greedy: true,
        drop: function (event, ui) {
            flog("Dropped In Container");
            var groupName = ui.draggable.attr("id");
            //var folderName = $(this).data("name");
            //$(this).find(".panel-group").append(ui.draggable.css({position: "relative", top:"", left:""}));
            //updateGroupFolder(groupName, folderName);
            $(this).find("#group-wrapper").append(ui.draggable.css({position: "relative", top: "", left: ""}));
            addGroupFolder(groupName, groupName, "removeFromFolder=removeFromFolder", function (name, resp) {
                Msg.success("Removed " + groupName + " from folder");
            });
        },
        over: function (event, ui) {
            flog(event, ui);
        }
    });
}
