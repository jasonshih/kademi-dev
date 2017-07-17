JBNodes['emailSendGoal'] = {
    icon: 'fa fa-envelope',
    title: 'Email sent',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/email/jb/emailSendGoalNode.png',
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nextNodeId: {
            label: 'then',
            title: 'when email sent',
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
            '        <label>Subject</label>' +
            '        <input type="text" class="form-control subject" value="" />' +
            '    </div>' +
            '</div>' +
            + JBApp.standardGoalSettingControls
        );


        JBApp.initStandardGoalSettingControls(form);

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var triggerName = form.find('.subject').val();
                JBApp.currentSettingNode.subjectPattern = triggerName || null;

                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        form.find('.subject').val(node.subjectPattern || '');
        JBApp.showSettingPanel(node);
    }
};
