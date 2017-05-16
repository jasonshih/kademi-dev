JBNodes['startAndWaitFunnel'] = {
    icon: 'fa fa-code-fork',
    title: 'Start other journey',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/funnels/jb/startAndWaitFunnelGoal.png',
    ports: {
        nextNodeId: {
            label: 'then',
            title: 'When completed',
            maxConnections: 1
        },
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        }
    },

    settingEnabled: true,

    initSettingForm: function (form) {
        form.forms({
            allowPostForm: false,
            onValid: function () {
                var funnelName = form.find('[name=funnelName]').val();
                var initialGoal = form.find('[name=initialGoal]').val();
                JBApp.currentSettingNode.funnelName = funnelName || null;
                JBApp.currentSettingNode.initialGoal = initialGoal || null;
            
                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        var href = window.location.pathname;
        if (!href.endsWith('/')) {
            href += '/';
        }
        href = href + node.nodeId + '?mode=settings';

        form.load(href + ' #frmDetails > *', function () {
            form.removeAttr('action');
    
            form.find('[name=funnelName]').val(node.funnelName || '');
            form.find('[name=initialGoal]').val(node.initialGoal || '');
    
            JBApp.showSettingPanel(node);
        });
    }
};
