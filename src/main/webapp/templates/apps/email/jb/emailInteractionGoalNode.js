JBNodes['emailInteractionGoal'] = {
    icon: 'fa fa-envelope-open',
    title: 'Email open',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/email/jb/emailInteractionGoalNode.png',
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nodeIdOpened: {
            label: 'opened',
            title: 'When opened',
            maxConnections: 1
        },
        nodeIdConverted: {
            label: 'converted',
            title: 'When converted',
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
