JBNodes['formGoal'] = {
    icon: 'fa fa-wpforms',
    title: 'Leadman Form Goal',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/leadman/jb/formGoalNode.png',
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
        }
    },

    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Form path</label>' +
            '        <input type="text" class="form-control formPath" value="" />' +
            '    </div>' +
            '</div>' + JBApp.standardGoalSettingControls
        );

        JBApp.initStandardGoalSettingControls(form);



        form.forms({
            allowPostForm: false,
            onValid: function () {
                var formPath = form.find('.formPath').val();
                JBApp.currentSettingNode.formPath = formPath || null;

                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        form.find('.formPath').val(node.formPath || '');

        JBApp.showSettingPanel(node);
    }
};
