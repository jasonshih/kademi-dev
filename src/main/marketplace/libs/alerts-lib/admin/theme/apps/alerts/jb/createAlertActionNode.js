JBNodes[''] = {
    icon: 'fa fa-exclamation-triangle',
    title: 'Create Alert',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/vayaExtra/jb/createAlertActionNode.png',
    ports: {
        nextNodeId: {
            label: 'then',
            title: 'When completed',
            maxConnections: 1
        }
    },

    nodeTypeClass: 'customAction',
    
    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Website name</label>' +
                '        <input type="text" class="form-control website" placeholder="Name of the website" />' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Title</label>' +
                '        <input type="text" class="form-control title" placeholder="User friendly title" />' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Message</label>' +
                '        <textarea class="form-control message" placeholder="the actual message of this alert"></textarea>' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Type</label>' +
                '        <select class="form-control type">' +
                '           <option value="">[Please Select]</option>' +
                '           <option value="top">Top</option>' +
                '           <option value="bottom">Bottom</option>' +
                '        </select>' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Group name</label>' +
                '        <input type="text" class="form-control groupName" placeholder="The group which this alert applies to" />' +
                '    </div>' +
                '</div>'
                );

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var website = form.find('.website').val();
                var title = form.find('.title').val();
                var message = form.find('.message').val();
                var type = form.find('.type').val();
                var groupName = form.find('.groupName').val();
                
                JBApp.currentSettingNode.customSettings = {};
                JBApp.currentSettingNode.customSettings['website'] = website || null;
                JBApp.currentSettingNode.customSettings['title'] = title || null;
                JBApp.currentSettingNode.customSettings['message'] = message || null;
                JBApp.currentSettingNode.customSettings['type'] = type || null;
                JBApp.currentSettingNode.customSettings['groupName'] = groupName || null;

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        var customSettings = node.customSettings === undefined ? {} : node.customSettings;
        
        form.find('.website').val(customSettings.website !== null ? customSettings.website : '');
        form.find('.title').val(customSettings.title !== null ? customSettings.title : '');
        form.find('.message').val(customSettings.message !== null ? customSettings.message : '');
        form.find('.type').val(customSettings.type !== null ? customSettings.type : '');
        form.find('.groupName').val(customSettings.groupName !== null ? customSettings.groupName : '');    
        
        JBApp.showSettingPanel(node);
    }
};
