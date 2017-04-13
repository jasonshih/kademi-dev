function initManageUsers() {
    initNewUserForm();
    initSettingPanel();
    initSearchBusiness();
    initSearchUser();
    initOrgSearch();
    initSelectAll();
    initRemoveUsers();
    initAddToGroup();
    initUploadUsers();
    initLoginAs();
    initAggregations();
    initSort();

    //initUploadUsersFile();
}

function initChangeUserId() {
    $('.change-userid').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Changing the userID will invalidate the user\'s password. They will need to reset their password. Are you sure you want to continue?')) {
            var newId = prompt('Please enter a new UserID. This must be unique across all users in this system');
            if (newId) {
                doUpdateUserId(newId);
            }
        }
    });
}

function initRemoveCreds() {
    $('body').on('click', '.btn-remove-creds', function (e) {
        e.preventDefault();
        if (confirm('Are you sure you want to remove this users password and credentials? They will not be able to login.')) {
            doRemoveCreds();
        }
    });
}

function initRemoveOAuthCred() {
    $('body').on('click', '.btnDisconnect', function (e) {
        e.preventDefault();
        var btn = $(this);
        var provider = btn.data('provider');
        if (confirm('Are you sure you want to disconnect this user from ' + provider + '?')) {
            $.ajax({
                type: 'POST',
                url: window.location.pathname,
                dataType: 'json',
                data: {
                    removeProvider: provider
                },
                success: function (data) {
                    flog('success', data)
                    if (data.status) {
                        $('#oauthLogins').reloadFragment();
                    } else {
                        Msg.error('Oh No! Something went wrong! ' + data.messages);
                    }

                },
                error: function (resp) {
                    Msg.error('An error occured attempting to remove the oauth signature. Please check your internet connection');
                }
            });
        }
    });
}

function initUploadUsers() {
    var modalUploadCsv = $('#modal-upload-csv');
    //$('.btn-upload-users-csv').click(function (e) {
    //    e.preventDefault();
    //
    //    modalUploadCsv.modal('show');
    //});

    var modalMatchOrgsCsv = $('#modal-match-orgs-csv');
    $('.btn-match-orgs').click(function (e) {
        e.preventDefault();

        modalMatchOrgsCsv.modal('show');
    });

    var resultUploadCsv = modalUploadCsv.find('.upload-results');
    modalUploadCsv.find('#do-upload-csv').mupload({
        buttonText: '<i class=\'clip-folder\'></i> Upload spreadsheet',
        url: 'users.csv?insertMode=true',
        useJsonPut: false,
        oncomplete: function (data, name, href) {
            flog('oncomplete:', data.result.data, name, href);
            resultUploadCsv.find('.num-updated').text(data.result.data.numUpdated);
            resultUploadCsv.find('.num-inserted').text(data.result.data.numInserted);
            resultUploadCsv.find('.num-unmatched').text(data.result.data.unmatched.length);
            showUnmatched(resultUploadCsv, data.result.data.unmatched);
            resultUploadCsv.show();
            Msg.success('Upload completed. Please review any unmatched members below, or refresh the page to see the updated list of members');
        }
    });

    var formUploadCsv = modalUploadCsv.find('form');
    $('#allow-inserts').click(function (e) {
        flog('click', e.target);
        if ($(e.target).is(':checked')) {
            formUploadCsv.attr('action', 'users.csv?insertMode=true');
            flog('allow insert:', formUploadCsv);
        } else {
            formUploadCsv.attr('action', 'users.csv');
            flog('do not allow insert:', formUploadCsv, formUploadCsv.attr('action'));
        }
    });
}

function initUploadUsersFile() {
    var fileData = null;
    var userFileModal = $('#modal-upload-userFile');
    $('.btn-upload-users-csv').click(function (e) {
        e.preventDefault();

        userFileModal.modal('show');
    });

    var wizardContent = $('#wizard');
    wizardContent.smartWizard({
        selected: 0,
        keyNavigation: false
    });

    wizardContent.find(".next-step").on('click', function (e) {
        e.preventDefault();
        wizardContent.smartWizard("goForward");
    });

    wizardContent.find(".back-step").on('click', function (e) {
        e.preventDefault();
        wizardContent.smartWizard("goBackward");
    });

    userFileModal.find('#do-upload-file').mupload({
        buttonText: '<i class=\'clip-folder\'></i> Upload spreadsheet',
        url: 'userFile',
        useJsonPut: false,
        oncomplete: function (data, name, href) {
            flog('oncomplete:', data.result.data, name, href);
            fileData = data.result.data;
            populateFileColumns(userFileModal, fileData);
            wizardContent.smartWizard("goForward");
        }
    });

    Handlebars.registerHelper('equal', function (lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    });

    Handlebars.registerHelper('startsWith', function (lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if (!lvalue.toString().startsWith(rvalue)) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    });
}

function populateFileColumns(modal, data) {
    var columnSel = modal.find('.column-selector');

    var d = {
        fields: availableProfileFields,
        columns: data.fileLines[0]
    }

    var streamItemTemplateSource = $("#column-sel-template").html();
    var streamItemTemplate = Handlebars.compile(streamItemTemplateSource);

    var html = streamItemTemplate(d);

    flog('new HTML', html);

    columnSel.html(html);
}

function showUnmatched(resultUploadCsv, unmatched) {
    var unmatchedTable = resultUploadCsv.find('table');
    var tbody = unmatchedTable.find('tbody');
    tbody.html('');
    $.each(unmatched, function (i, row) {
        flog('unmatched', row);
        var tr = $('<tr>');
        $.each(row, function (ii, field) {
            tr.append('<td>' + field + '</td>');
        });
        tbody.append(tr);
    });
}

function initSearchUser() {
    $('#user-query').keyup(function () {
        typewatch(function () {
            flog('do search');
            doSearch();
        }, 500);
    });

    $('#search-group').change(function () {
        doSearch();
    });

    $('.btn-group-user-states .btn-link input[type=radio]').on('change', function () {
        doSearch();
    });
}

function doSearch() {
    var query = $('#user-query').val();
    var groupName = $('#search-group').val();
    var isEnabled = $('.btn-enable-user').is(':checked');
    
    flog('doSearch', query, groupName);
    
    var uri = URI(window.location);
    
    uri.setSearch('q', query);
    uri.setSearch('g', groupName);
    uri.setSearch('enabled', isEnabled);
    
    flog('doSearch', uri.toString());
    
    var newHref = uri.toString();
    
    window.history.pushState('', newHref, newHref);
    Msg.info('Searching...', 50000);
    
    $.ajax({
        type: 'GET',
        url: newHref,
        success: function (data) {
            Msg.info('Search complete', 5000);
            flog('success', data);
            var newDom = $(data);
            var $fragment = newDom.find('#table-users');
            $('#table-users').replaceWith($fragment);
            $('#searchStats').replaceWith(newDom.find('#searchStats'));
            $("#table-users").paginator();
        },
        error: function (resp) {
            Msg.error('An error occured doing the user search. Please check your internet connection and try again');
        }
    });
}

function doUpdateUserId(newUserId) {
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        dataType: 'json',
        data: {
            newUserId: newUserId
        },
        success: function (data) {
            flog('success', data)
            if (data.status) {
                window.location.reload();
            } else {
                Msg.error('Could not change the user\'s ID: ' + data.messages);
            }

        },
        error: function (resp) {
            Msg.error('An error occured attempting to update the userID. Please check your internet connection');
        }
    });
}

function doRemoveCreds() {
    $.ajax({
        type: 'POST',
        url: window.location.pathname,
        dataType: 'json',
        data: {
            removeAllCredentials: true
        },
        success: function (data) {
            flog('success', data)
            if (data.status) {
                window.location.reload();
            } else {
                Msg.error('Could not change the user\'s ID: ' + data.messages);
            }

        },
        error: function (resp) {
            Msg.error('An error occured attempting to update the userID. Please check your internet connection');
        }
    });
}

function initSettingPanel() {
    // Check cookie for user settings
    var settingContent = $('div.SettingContent');
    var userSetting = $.cookie('user-setting');
    var checkboxes = settingContent.find('input[type=checkbox]');
    var remember = $('#remember');

    if (userSetting) {
        remember.attr('checked', true);
        checkboxes.not(remember).attr('checked', false);
        userSetting = userSetting.split('#');
        settingContent.find('select').val(userSetting[0]);
        for (var i = 1, setting; setting = userSetting[i]; i++) {
            checkboxes.filter('#' + setting).check(true);
        }
    }

    // Event for save change button
    $('#saveChange').bind('click', function (e) {
        if (remember.is(':checked')) {
            var setting = [];
            setting.push(settingContent.find('select').val());

            checkboxes.not(remember).each(function () {
                var self = $(this);

                if (self.is(':checked')) {
                    setting.push(self.val());
                }
            });

            $.cookie('user-setting', setting.join('#'), {
                expires: 999
            });
        } else {
            $.cookie('user-setting', null);
        }

        settingContent.addClass('Hidden');
        e.preventDefault();
    });
}

function initSearchBusiness() {
    var container = $('#pullDown');
    var content = container.find('table.Summary tbody');
    var input = container.find('input[type=text]');

    container.find('a.ClearText').unbind('click').bind('click', function (e) {
        input.val('');
        content.html('');
        e.preventDefault();
    });

    input.bind('input', function () {
        var keyword = input.val().toLowerCase();
        var urlRequest = '/users/_DAV/PROPFIND?fields=name,clyde:title,clyde:templateName,clyde:suburb,clyde:postcode,clyde:address,clyde:state&depth=5';
        if (keyword.replace(/^\s+|\s+$/g, '') != '') {
            $.getJSON(urlRequest, function (datas) {
                var result = '';
                $(datas).each(function () {
                    var data = $(this);
                    var title = data.attr('title').toLowerCase();

                    if (data.is('[state]') && title.indexOf(keyword) != -1) {
                        result += '<tr>';
                        result += '<td>' + data.attr('title') + '</td>';
                        result += '<td>' + data.attr('suburb') + '</td>';
                        result += '<td>' + data.attr('postcode') + '</td>';
                        result += '<td>' + data.attr('address') + '</td>';
                        result += '<td>' + data.attr('state') + '</td>';
                        result += '</tr>';
                    }
                });
                content.html(result);
            });
        } else {
            content.html('');
        }
    });
}

function initNewUserForm() {
    var modal = $('#modal-new-user');
    var form = modal.find('form');
    var nextAction = 'view';

    $('.btn-add-user').click(function (e) {
        e.preventDefault();
        e.stopPropagation();

        modal.modal('show');
    });

    $('.btn-add-and-view').on('click', function (e) {
        nextAction = 'view';
    });

    $('.btn-add-and-add').on('click', function (e) {
        nextAction = 'add';
    });

    $('.btn-add-and-close').on('click', function (e) {
        nextAction = 'close';
    });

    modal.on('hidden.bs.modal', function () {
        resetForm(form);
    });

    form.forms({
        validate: function () {
            var newUserEmail = $('#newUserEmail');
            var newUserEmailStr = newUserEmail.val();

            if (newUserEmailStr == null || newUserEmailStr == "") {
                return true; // blank is ok now!
            }

            var error = 0;

            if (!validateFuseEmail(newUserEmailStr)) {
                error++;
                showErrorField(newUserEmail);
            }

            if (error === 0) {
                return true;
            } else {
                showMessage('Email address is invalid!', form);

                return false;
            }
        },
        callback: function (resp) {
            flog('done new user', resp);

            switch (nextAction) {
                case 'view':
                    if (resp.nextHref) {
                        window.location.href = resp.nextHref;
                    }

                    modal.modal('hide');
                    break;

                case 'close':
                    modal.modal('hide');
                    break;

                case 'add':
                    $("#newUserEmail, #newUserSurName, #newUserFirstName, #newUserNickName").val("");
                    break;
            }

            Msg.info('Saved');
        }
    });
}

function initOrgSearch() {
    var orgTitle = $('#orgTitle');
    var orgId = $('#orgId');
    var orgSearch = $('#org-search');

    flog('initOrgSearch', orgTitle);
    orgTitle.on('focus click', function () {
        orgSearch.show();
        flog('show', orgSearch);
    });
    orgTitle.keyup(function () {
        typewatch(function () {
            flog('do search');
            doOrgSearch();
        }, 500);
    });
    $('div.groups').on('click', 'a', function (e) {
        flog('clicked', e.target);
        e.preventDefault();
        e.stopPropagation();
        var orgLink = $(e.target);
        orgId.val(orgLink.attr('href'));
        orgTitle.val(orgLink.text());
        $('#org-search').hide();
        flog('clicked', orgId.val(), orgTitle.val());
    });
}

function doOrgSearch() {
    $.ajax({
        type: 'GET',
        url: window.location.pathname + '?orgSearch=' + $('#orgTitle').val(),
        success: function (data) {
            flog('success', data);

            var $fragment = $(data).find('#org-search');
            $('#org-search').replaceWith($fragment);
            $fragment.show();
            flog('frag', $fragment);
        },
        error: function (resp) {
            Msg.error('An error occurred searching for organisations');
        }
    });
}

function initRemoveUsers() {
    $('.btn-remove-users').click(function (e) {
        e.preventDefault();
        var node = $(e.target);
        flog('removeUsers', node, node.is(':checked'));
        var checkBoxes = $('#table-users').find('tbody input[name=toRemoveId]:checked');
        if (checkBoxes.length == 0) {
            Msg.error('Please select the users you want to remove by clicking the checkboxs to the right');
        } else {
            if (confirm('Are you sure you want to remove ' + checkBoxes.length + ' users?')) {
                doRemoveUsers(checkBoxes);
            }
        }
    });
}

function initAddToGroup() {
    var modal = $('#modal-add-to-group');

    $('.btn-add-to-group').click(function (e) {
        var node = $(e.target);
        flog('addToGroup', node, node.is(':checked'));
        var checkBoxes = $('#table-users').find('tbody input[name=toRemoveId]').filter(':checked');
        if (checkBoxes.length === 0) {
            Msg.error('Please select the users you want to add by clicking the checkboxs to the right');
        } else {
            modal.modal('show');
        }
    });

    modal.find('.groups-wrapper a').click(function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
    });

    modal.find('.btnSaveGroup').on('click', function (e) {
        var checkBoxes = $('#table-users').find('tbody input[name=toRemoveId]').filter(':checked');
        var selectedGroups = modal.find('.groups-wrapper a.active');
        if (selectedGroups.length) {
            selectedGroups.each(function () {
                checkBoxes = checkBoxes.add('<input name="groupNames" type="checkbox" value="' + $(this).attr('href') + '" />');
            });
            doAddUsersToGroup(checkBoxes);
        } else {
            Msg.error('Please select group(s) to add users to');
        }
    });

    modal.on('hidden.bs.modal', function () {
        modal.find('.groups-wrapper a').removeClass('active');
    })
}

function doAddUsersToGroup(data) {
    $.ajax({
        type: 'POST',
        data: data,
        dataType: 'json',
        url: '?addToGroup',
        success: function (data) {
            flog('success', data);
            $('#modal-add-to-group').modal('hide');
            if (data.status) {
                doSearch();
                Msg.success('Added users ok');
            } else {
                Msg.error('There was a problem adding users. Please try again and contact the administrator if you still have problems');
            }
        },
        error: function (resp) {
            Msg.error('An error occurred adding users. You might not have permission to do this');
        }
    });
}

function doRemoveUsers(checkBoxes) {
    var ids = [];

    checkBoxes.each(function (a, item) {
        ids.push($(item).val());
    });

    $.ajax({
        type: 'POST',
        data: {
            toRemoveId: ids.join(',')
        },
        dataType: 'json',
        url: '',
        success: function (data) {
            flog('success', data);
            if (data.status) {
                doSearch();
                Msg.success('Removed users ok');
            } else {
                Msg.error('There was a problem removing users. Please try again and contact the administrator if you still have problems');
            }
        },
        error: function (resp) {
            Msg.error('An error occurred removing users. You might not have permission to do this');
        }
    });
}

function initLoginAs() {
    $('body').on('click', 'a.btn-login-as', function (e) {
        e.preventDefault();
        var profileId = $(e.target).attr('href');
        showLoginAs(profileId);
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

function initSort() {
    flog('initSort()');
    $('.sort-field').on('click', function (e) {
        e.preventDefault();
        var a = $(e.target);
        var uri = URI(window.location);
        var field = a.attr('id');

        var dir = 'asc';
        if (field == getSearchValue(window.location.search, 'sortfield')
            && 'asc' == getSearchValue(window.location.search, 'sortdir')) {
            dir = 'desc';
        }
        uri.setSearch('sortfield', field);
        uri.setSearch('sortdir', dir);

        $.ajax({
            type: 'GET',
            url: uri.toString(),
            success: function (data) {
                flog('success', data);
                window.history.pushState('', document.title, uri.toString());
                var $fragment = $(data).find('#table-users');
                flog('replace', $('#se'));
                flog('frag', $fragment);
                $('#table-users').replaceWith($fragment);
                $("#table-users").paginator();
            },
            error: function (resp) {
                Msg.error('err');
            }
        });
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
