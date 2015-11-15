function initManageGroup() {
    initCRUDGroup();
    addOrderGroup();
//    addOrderProgramList();
//    addOrderPermissionList();
    initGroupModal();
//    initPermissionCheckboxes();
    initRegoMode();
    initCRUDRole();
    initCopyMembers();
//    initOptInGroups();
    initPanelHeader();
    //initGroupFolderModal();
    //initAddToFolder();
    //initRemoveFromFolder();
    initGroupFolder();
    initGroupPasswordPolicy();
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
        flog("groupName", groupName);
        showGroupModal('Group', 'Rename group', 'Rename', {
            name: groupName,
            title: groupTitle,
            notes: groupNotes,
            group: selectGroup.attr('id')
        });
    });
}

var currentGroupDiv;
var currentRoleGroup;

function initCRUDRole() {
    var body = $(document.body);
    var modal = $('#modal-edit-roles');

    body.on('click', '.btn-add-role-group', function (e) {
        e.preventDefault();
        currentRoleGroup = $(this).data("group")
        currentGroupDiv = $(this).closest(".group");
    });

    body.on('click', '.btn-remove-role', function (e) {
        flog('click', this);
        e.preventDefault();

        if (confirm('Are you sure you want to remove this role?')) {
            var btn = $(this);
            flog('do it', btn);
            var href = btn.attr('href');
            deleteFile(href, function () {
                btn.closest('span.role').remove();
            });
        }
    });

    modal.on('click', 'input:radio', function (e) {
        var input = $(this);
        var appliesTo = input.closest('.applies-to');
        appliesTo.find('select').addClass('hide');
        appliesTo.find('input[type=radio]:checked').next().next().removeClass('hide');
    });

    modal.on('click', '.btn-add-role', function (e) {
        e.preventDefault();

        var btn = $(this);
        var article = btn.closest('article');
        var appliesTo = $('div.applies-to');
        var appliesToType = appliesTo.find('input:checked');

        if (!appliesToType[0]) {
            Msg.error('Please select what the role applies to');
            return;
        }

        var appliesToTypeVal = appliesToType.val();
        var select = appliesToType.next().next();
        var appliesToVal = ''; // if need to select a target then this has its value
        if (select[0]) {
            appliesToVal = select.val();
            if (appliesToVal.length == 0) {
                Msg.error('Please select a target for the role');
                return;
            }
            appliesToText = select.find('option:checked').text().trim();
        } else {
            appliesToText = 'their own organisation';
        }

        flog('add role', appliesToTypeVal, appliesToVal);
        flog('currentGroupDiv', currentGroupDiv);

        var groupHref = currentRoleGroup;
        var roleName = btn.closest('.article-action').prev().text().trim();

        addRoleToGroup(groupHref, roleName, appliesToTypeVal, appliesToVal, function (resp) {
            if (appliesToVal.length == 0) {
                appliesToVal = 'their own organisation';
            }
            //$('#groups-folders').reloadFragment();
            currentGroupDiv.find('.roles-wrapper').append(
                    '<span class="block role">' +
                    '<span>' + roleName + ', on ' + appliesToText + '</span> ' +
                    '<a class="btn btn-xs btn-danger btn-remove-role" href="' + resp.nextHref + '" title="Remove this role"><i class="fa fa-times"></i></a>' +
                    '</span>'
                    );
        });
    });
}


function addRoleToGroup(groupHref, roleName, appliesToType, appliesTo, callback) {
    flog('addRoleToGroup', groupHref, roleName, appliesToType, appliesTo);

    try {
        $.ajax({
            type: "POST",
            url: groupHref,
            dataType: 'json',
            data: {
                appliesToType: appliesToType,
                role: roleName,
                appliesTo: appliesTo
            },
            success: function (data) {
                flog('success', data);
                if (data.status) {
                    flog('saved ok', data);
                    callback(data);
                    Msg.success('Added role');
                } else {
                    var msg = data.messages + '\n';
                    if (data.fieldMessages) {
                        $.each(data.fieldMessages, function (i, n) {
                            msg += '\n' + n.message;
                        });
                    }
                    flog('error msg', msg);
                    Msg.error('Couldnt save the new role: ' + msg);
                }
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('Error, couldnt add role');
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
                    var _randomId = Math.round(Math.random() * 100000);
                    var _for = _this.attr('for') || null;
                    var _name = _this.attr('name') || null;
                    var _id = _this.attr('id') || null;

                    if (_for) {
                        _this.attr('for', _for + _randomId);
                    }

                    if (_name) {
                        _this.attr('name', _name + _randomId);
                    }

                    if (_id) {
                        _this.attr('id', _id + _randomId);
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
    modal.attr('data-group', '');
}

function showGroupModal(name, title, type, data) {
    resetModalControl();

    var modal = $('#modal-group');
    flog('showGroupModal', modal);

    modal.find('.modal-title').html(title);
    modal.find('.btn-save-group').text(type);
    modal.find('input[name=groupType]').val(type);

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
        callback: function (resp) {
            reloadGroupFolders();
            Msg.success(resp.messages.first());
            resetModalControl();
            modal.modal('hide');
        }
    });
}

function reloadGroupFolders() {
    $('#groups-folders').reloadFragment({
        onComplete: function () {
            var startFolder;
            $('.group').draggable({
                revert: "invalid",
                axis: "y",
                handle: '.btn-order',
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
                alert('Sorry, the folder could not be created. Please check if a folder with that name already exists');
            } else {
                alert('There was a problem creating the folder');
            }
        }
    });
}

/**
 * Called from the manageGroupRegoMode.html template
 *
 * @returns {undefined}
 */
function initRegoMode() {
    flog('initRegoMode');

    initOptInGroups();
    $('form.general').forms({
        callback: function (resp) {
            flog('done', resp);
            $('#groups-folders').reloadFragment();
            Msg.info("Saved");
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
        callback: function (resp) {
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
        var r = confirm("Are you sure you want to delete " + folderName);
        if (r) {
            addGroupFolder(folderName, href, "deleteFolder=deleteFolder&folderName=" + $.URLEncode(folderName), function () {
                Msg.success(folderName + ' has been deleted');
                $('#groups-folders').reloadFragment();
            });
        }
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
        callback: function (resp) {
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

function initGroupPasswordPolicy() {
    var modal = $('#modal-add-policy');
    var modalForm = modal.find('form');

    modal.on('hidden', function (e) {
        var m = $(this);
        var groupName = m.data('groupname');

        m.find('form').trigger('reset');

        var a = m.find('input[name=updatePasswordPolicy]');
        a.attr('name', 'addPasswordPolicy');
        a.val(groupName);

        m.find('.modal-title').text('Add new password policy for ' + groupName);
    });

    modalForm.forms({
        validate: function (form) {
            var m = $(form);

            if ((m.find('input[name=minLength]').val().length === 0 || m.find('input[name=minLength]').val() < 1)
                    & (m.find('input[name=minUpperCase]').val().length === 0 || m.find('input[name=minUpperCase]').val() < 1)
                    & (m.find('input[name=minLowerCase]').val().length === 0 || m.find('input[name=minLowerCase]').val() < 1)
                    & (m.find('input[name=minAlpha]').val().length === 0 || m.find('input[name=minAlpha]').val() < 1)
                    & (m.find('input[name=minNumeric]').val().length === 0 || m.find('input[name=minNumeric]').val() < 1)
                    & (m.find('input[name=maxRepeat]').val().length === 0 || m.find('input[name=maxRepeat]').val() < 1)
                    & m.find('input[name=badWords]').val().length === 0
                    & m.find('input[name=customRegex]').val().length === 0) {
                showValidation(null, "At least one field needs to be filled & greater than 1", form);
                return false;
            }

            return true;
        },
        callback: function (resp) {
            if (resp.status) {
                modal.modal('hide');
                modalForm.trigger('reset');
                Msg.info('Added Policy');
                $('#policy-list').reloadFragment({
                    whenComplete: function () {
                        initPPTemplates();
                    }
                });
            } else {
                Msg.warning(resp.messages);
            }
        }
    });

    $('body').on('click', '.btn-edit-policy', function (e) {
        e.preventDefault();
        var btn = $(this);

        var article = btn.closest('article');
        var ppid = article.data('ppid');
        var current = article.data('current');
        var groupName = btn.closest('.policy-list').data('group');

        var m = $('#modal-add-policy');

        m.find('input[name=addPasswordPolicy]').attr('name', 'updatePasswordPolicy');
        m.find('input[name=updatePasswordPolicy]').val(ppid);

        m.find('.modal-title').text('Edit password policy for ' + groupName);
        m.find('input[name=minLength]').val(current.minLength);
        m.find('input[name=minUpperCase]').val(current.minUpperCase);
        m.find('input[name=minLowerCase]').val(current.minLowerCase);
        m.find('input[name=minAlpha]').val(current.minAlpha);
        m.find('input[name=minNumeric]').val(current.minNumeric);
        m.find('input[name=maxRepeat]').val(current.maxRepeat);
        m.find('input[name=badWords]').val(current.badWords);
        m.find('input[name=customRegex]').val(current.customRegex);

        m.modal('show');
    });

    $('body').on('click', '.btn-del-policy', function (e) {
        e.preventDefault();

        var btn = $(this);
        var article = btn.closest('article');
        var ppid = article.data('ppid');
        var groupName = article.data('groupname');

        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                deletePolicy: ppid
            },
            success: function (resp) {
                Msg.info('Removed Policy');
                $('#policy-list').reloadFragment({
                    whenComplete: function () {
                        initPPTemplates();
                    }
                });
            }
        });
    });
    initPPTemplates();

    $('body').on('change', '.add-policy-modal .preset-select', function (e) {
        var select = $(this);
        var val = select.val();

        var temp = null;
        for (var i = 0; i < ppTemplates.length; i++) {
            if (ppTemplates[i].name === val) {
                temp = ppTemplates[i];
                break;
            }
        }

        var m = select.closest('.add-policy-modal');

        if (temp !== null) {
            m.find('input[name=minLength]').val(temp.minLength);
            m.find('input[name=minUpperCase]').val(temp.minUpperCase);
            m.find('input[name=minLowerCase]').val(temp.minLowerCase);
            m.find('input[name=minAlpha]').val(temp.minAlpha);
            m.find('input[name=minNumeric]').val(temp.minNumeric);
            m.find('input[name=maxRepeat]').val(temp.maxRepeat);
            m.find('input[name=badWords]').val(temp.badWords);
            m.find('input[name=customRegex]').val(temp.customRegex);
        } else {
            m.find('input[name=minLength]').val('');
            m.find('input[name=minUpperCase]').val('');
            m.find('input[name=minLowerCase]').val('');
            m.find('input[name=minAlpha]').val('');
            m.find('input[name=minNumeric]').val('');
            m.find('input[name=maxRepeat]').val('');
            m.find('input[name=badWords]').val('');
            m.find('input[name=customRegex]').val('');
        }
    });
}

function initPPTemplates() {
    var modals = $('.add-policy-modal');

    var presetSelect = modals.find('.preset-select');
    presetSelect.empty();

    presetSelect.append('<option value=""></option>');
    for (var i = 0; i < ppTemplates.length; i++) {
        presetSelect.append('<option value="' + ppTemplates[i].name + '">' + ppTemplates[i].title + '</option>');
    }
}

var ppTemplates = [
    {
        "name": "min8chars",
        "title": "Minimum 8 Characters",
        "minLength": 8,
        "minUpperCase": null,
        "minLowerCase": null,
        "minAlpha": 1,
        "minNumeric": 1,
        "maxRepeat": null,
        "badWords": null,
        "customRegex": null
    },
    {
        "name": "min8chars_mixed",
        "title": "Minimum 8 Characters, Mixed case & 1 number",
        "minLength": 8,
        "minUpperCase": 1,
        "minLowerCase": 1,
        "minAlpha": 2,
        "minNumeric": 1,
        "maxRepeat": null,
        "badWords": null,
        "customRegex": null
    },
    {
        "name": "min8chars_strict",
        "title": "Minimum 8 Characters, Mixed case & 2 number & max 3 repeats",
        "minLength": 8,
        "minUpperCase": 1,
        "minLowerCase": 1,
        "minAlpha": 2,
        "minNumeric": 2,
        "maxRepeat": 3,
        "badWords": null,
        "customRegex": null
    }
];

function initOptInGroups() {
    $('.optins input[type=checkbox]').click(function (e) {
        updateOptIn($(e.target));
    }).each(function (i, n) {
        updateOptIn($(n));
    });
}

function updateOptIn(chk) {
    if (chk.is(':checked')) {
        chk.closest('div.clearfix').addClass('checked');
    } else {
        chk.closest('div.clearfix').removeClass('checked');
    }

}