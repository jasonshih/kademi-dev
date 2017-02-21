JBNodes['timerGoal'] = {
    icon: 'fa fa-trophy',
    title: 'Timer Goal',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/funnels/jb/timerGoalNode.png',
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        }
    },

    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(
                '<div class="form-group"><div class="col-sm-12">' +
                '    <a class="btn btn-info manage-link" href="/funnels/retirement/NODEID/">' +
                '        <i class="fa fa-clock-o"></i>' +
                '        Manage timer' +
                '    </a>' +
                '</div></div>' + JBApp.standardGoalSettingControls
                );

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
        flog("showSettingForm", node);
        form.find(".manage-link").attr("href", node.nodeId);
        JBApp.showStandardGoalSettingControls(form, node);
        JBApp.showSettingPanel(node);
    }
};
