JBNodes['sendToHubspot'] = {
    icon: 'fa fa-users',
    title: 'Send To Hubspot',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/hubspot/jb/sendToHubspot.png',
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

        flog(node.hapiKey);
        flog(form.find("#hapiKey"));
        
        form.load(href + ' #frmDetails > *', function () {
            form.attr('action', href);
            $("#hapiKey").val(node.hapiKey || "");
            JBApp.showSettingPanel(node);
        });
    }
};
