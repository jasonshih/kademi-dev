JBNodes['addToGroup'] = {
    icon: 'fa fa-pencil-square-o',
    title: 'Add to group',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/user/jb/addToGroupNode.png',
    ports: {
        nextNodeId: {
            label: 'then',
            title: 'When completed',
            maxConnections: 1
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
