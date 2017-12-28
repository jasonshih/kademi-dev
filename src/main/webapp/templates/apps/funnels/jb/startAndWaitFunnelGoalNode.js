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
        },
        pastTimeNode: {
            label: 'past time',
            title: 'When entered while timeout has passed',
            maxConnections: 1
        }
    },

    settingEnabled: true,

    initSettingForm: function (form) {
        form.forms({
            allowPostForm: false,
            onValid: function () {
                var funnelName = form.find('[name=funnelName]').val();
                var startGoal = form.find('[name=startGoal]').val();
                var profile = form.find('[name=profile]').val();
                
                JBApp.currentSettingNode.funnelName = funnelName || null;
                JBApp.currentSettingNode.startGoal = startGoal || null;
                JBApp.currentSettingNode.profile = profile || null;
            
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
            form.find('[name=startGoal]').val(node.startGoal || '');
            form.find('[name=profile]').val(node.profile || '');
    
            JBApp.showSettingPanel(node);
        });
    }
};
