function initManageGroupRegoMode() {
    flog('initManageGroupRegoMode');

    initGroupType();
    initCRUDRole();
    initGroupPasswordPolicy();
    initRegoMode();
    initOptins();
    initQueryBuilder();
}

function initOptins() {
    $('#optinsCheckAll').on('click', function (e) {
        $('[name=optinGroup][type=checkbox]').prop('checked', this.checked);
    });
    var allChecked = true;
    $('[name=optinGroup][type=checkbox]').each(function () {
        allChecked = this.checked;
    });
    $('#optinsCheckAll').prop('checked', allChecked);
}

function initCRUDRole() {
    var body = $(document.body);
    var modal = $('#modal-edit-roles');

    body.on('click', '.btn-remove-role', function (e) {
        e.preventDefault();

        var btn = $(this);
        var href = btn.attr('href');

        Kalert.confirm('Are you sure you want to remove this role?', function () {
            deleteFile(href, function () {
                btn.closest('span.role').remove();
            });
        });
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
        var appliesToText;
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

        var roleName = btn.closest('.article-action').prev().text().trim();

        addRoleToGroup(roleName, appliesToTypeVal, appliesToVal, function (resp) {
            if (appliesToVal.length == 0) {
                appliesToVal = 'their own organisation';
            }

            $('.roles-wrapper').append(
                    '<span class="block role">' +
                    '   <span>' + roleName + ', on ' + appliesToText + '</span> ' +
                    '   <a class="btn btn-xs btn-danger btn-remove-role" href="' + resp.nextHref + '" title="Remove this role"><i class="fa fa-times"></i></a>' +
                    '</span>'
                    );
        });
    });
}

function addRoleToGroup(roleName, appliesToType, appliesTo, callback) {
    flog('addRoleToGroup', roleName, appliesToType, appliesTo);

    try {
        $.ajax({
            type: "POST",
            url: window.location.pathname,
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

function initGroupType() {
    flog('initGroupType');

    $('input:radio[name=groupType]').click(function () {
        showHidePanels();
    });
}

function showHidePanels() {
    var panels = $('.panel-fields, .panel-optins, .panel-joinorgs, .panel-regomode');
    panels.addClass('hide');

    // show only appropriate
    var type = $('input:radio[name=groupType]:checked').val();
    flog('showHidePanels:', type);

    if (type == 'P') {
        // primary
        panels.removeClass('hide');
    } else if (type == 'M') {
        // mailing list
    } else if (type == 'S') {
        // subscription
        $('.panel-fields').removeClass('hide');
    }
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
        onSuccess: function (resp) {
            flog('done', resp);
            $('#groups-folders').reloadFragment();
            Msg.info("Saved");
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
        onSuccess: function (resp) {
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


function initQueryBuilder() {
    var builder = $('#query-builder');
    if( builder.length == 0) {
        return ;
    }

    var rulesInput = $("#rulesInput");

    $('form.query-builder').forms({
        onValid : function() {
            var rules = builder.queryBuilder('getRules');
            rules = checkRuleType(rules);
            rulesInput.val( JSON.stringify(rules) );
            flog("onValid", rules);
        },
        onSuccess: function (resp) {
            flog('done', resp);
            $('#groups-folders').reloadFragment();
            Msg.info("Saved");
        }
    });


    $.getScriptOnce('/static/query-builder/2.3.3/js/query-builder.standalone.min.js', function () {
        $.ajax({
            url: window.location.pathname + '?fields',
            type: 'get',
            dataType: 'json',
            success: function (resp) {
                var rulesJson = rulesInput.val();
                flog("riles ", rulesJson);
                var rulesOb = JSON.parse(rulesJson);
                builder.queryBuilder({
                    filters: resp,
                    rules: rulesOb
                });
            }
        });
    });
    $.getStyleOnce('/static/query-builder/2.3.3/css/query-builder.default.min.css');
}

function checkRuleType(rules) {
    if (rules.condition) {
        rules.ruleType = 'ruleList';
        rules.rules = checkRuleType(rules.rules);
    } else {
        if ($.isArray(rules)) {
            for (var i = 0; i < rules.length; i++) {
                if (rules[i].condition) {
                    rules[i] = checkRuleType(rules[i]);
                } else {
                    rules[i].ruleType = 'rule';
                }
            }
        }
    }

    return rules;
}