JBNodes['decision'] = {
    title: '<i class="fa fa-question-circle"></i> <span class="node-type">Decision</span>',
    previewUrl: '/theme/apps/funnels/jb/decisionNode.png',
    ports: {
        decisionDefault: {
            label: 'default',
            title: 'Default next action',
            maxConnections: 1,
            position: [1, 0.925, 1, 0]
        },
        decisionChoices: {
            label: 'choice',
            title: 'Make new choice',
            maxConnections: -1,
            position: [1, 0.775, 1, 0]
        }
    },

    settingEnabled: true,

    initSettingForm: function (form) {
        form.forms({
            onSuccess: function () {
                JBApp.reloadFunnelJson();
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
            form.attr('action', href);

            JBApp.showSettingPanel(node);
        });
    }
};
