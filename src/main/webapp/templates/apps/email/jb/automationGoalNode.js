JBNodes['automationGoal'] = {
    icon: 'fa fa-gear',
    title: 'Automation Goal',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/email/jb/automationGoalNode.png',
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nextNodeId: {
            label: 'then',
            title: 'When completed',
            maxConnections: 1
        },
        pastTimeNode: {
            label: 'past time',
            title: 'When entered while timeout has passed',
            maxConnections: 1
        }
    },

    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Trigger name</label>' +
            '        <select class="form-control triggerName"></select>' +
            '    </div>' +
            '</div>' + JBApp.standardGoalSettingControls
        );

        $.ajax({
            url: '/autoEmails/_DAV/PROPFIND?fields=name,milton:title',
            type: 'get',
            dataType: 'json',
            success: function (resp) {
                var optionsStr = '<option value="">[No trigger selected]</option>';
                for (var i = 1; i < resp.length; i++) {
                    optionsStr += '<option value="' + resp[i].name + '">' + resp[i].title.replace('Automation: ', '') + '</option>';
                }

                form.find('.triggerName').html(optionsStr);
            }
        });

        JBApp.initStandardGoalSettingControls(form);

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var triggerName = form.find('.triggerName').val();
                JBApp.currentSettingNode.triggerName = triggerName || null;

                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        form.find('.triggerName').val(node.triggerName !== null ? node.triggerName : '');
        JBApp.showSettingPanel(node);
    }
};
