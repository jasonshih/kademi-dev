JBNodes['taskCompleteGoal'] = {
    icon: 'fa fa-thumbs-o-up',
    title: 'Task Complete',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/leadman/jb/taskCompleteGoalNode.png',
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
            '        <label>Task name</label>' +
            '        <input type="text" class="form-control task-name" value="" />' +
            '    </div>' +
            '</div>' + JBApp.standardGoalSettingControls
        );

        JBApp.initStandardGoalSettingControls(form);

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var taskName = form.find('.task-name').val();
                JBApp.currentSettingNode.taskName = taskName || null;

                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        form.find('.task-name').val(node.taskName !== null ? node.taskName : '');
        JBApp.showSettingPanel(node);
    }
};
