JBNodes['smsResultGoal'] = {
    icon: 'fa fa-trophy',
    title: 'Sms Result Goal',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/sms/jb/smsResultGoalNode.png',
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nodeIdDelivered: {
            label: 'delivered',
            title: 'When delivered',
            maxConnections: 1
        },
        nodeIdFailed: {
            label: 'failed',
            title: 'When failed',
            maxConnections: 1
        },
        nodeIdSent: {
            label: 'sent',
            title: 'When sent',
            maxConnections: 1
        }
    },
    settingEnabled: true,
    initSettingForm: function (form) {
        form.append(JBApp.standardGoalSettingControls);

        JBApp.initStandardGoalSettingControls(form);

        form.forms({
            allowPostForm: false,
            onValid: function () {
                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },
    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        JBApp.showSettingPanel(node);
    }
};
