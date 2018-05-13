JBNodes['pipeDriveNode'] = {
    icon: 'fa fa-plus-circle',
    title: 'Create Pipedrive Deal',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/KPipeDriveIntegration/jb/pipeDrive.png',
    ports: {
        nextNodeId: {
            label: 'then',
            title: 'When Stage Reached',
            maxConnections: 1
        },
        notReached: {
            label: 'not',
            title: 'When Stage Not Reached',
            maxConnections: 1
        }
    },

    nodeTypeClass: 'customAction',
    
    settingEnabled: true,

    initSettingForm: function (form) {
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
        
        JBApp.showSettingPanel(node);
    }
};
