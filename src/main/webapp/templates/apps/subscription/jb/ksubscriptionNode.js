JBNodes['ksubscription'] = {
    icon: 'fa fa-thumbs-o-up',
    title: 'KSubscription',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/subscription/jb/ksubscriptionNode.png',
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
            '        <label>Action</label>' +
            '        <input type="text" class="form-control action" value="" />' +
            '    </div>' +
            '</div>' + JBApp.standardGoalSettingControls
        );

        JBApp.initStandardGoalSettingControls(form);

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var action = form.find('.action').val();
                JBApp.currentSettingNode.action = action || null;

                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        form.find('.action').val(node.action !== null ? node.action : '');
        JBApp.showSettingPanel(node);
    }
};
