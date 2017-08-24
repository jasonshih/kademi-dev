JBNodes['activateAlertAction'] = {
    icon: 'fa fa-exclamation-triangle',
    title: 'Activate Alert',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/vayaExtra/jb/activateAlertActionNode.png',
    ports: {
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
                '        <label>Website</label>' +
                '        <select class="form-control website"></select>' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Alert Id</label>' +
                '        <input type="text" class="form-control alertId" placeholder="The alert id" />' +
                '    </div>' +
                '</div>'
                );
        
        $.ajax({
            url: '/websites/_DAV/PROPFIND?fields=name',
            type: 'get',
            dataType: 'json',
            success: function (resp) {
                var optionsStr = '<option value="">[No website selected]</option>';
                for (var i = 1; i < resp.length; i++) {
                    optionsStr += '<option value="' + resp[i].name + '">' + resp[i].name+ '</option>';
                }

                form.find('.website').html(optionsStr);
            }
        });

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var website = form.find('.website').val();
                var alertId = form.find('.alertId').val();
                
                JBApp.currentSettingNode.website = website || null;
                JBApp.currentSettingNode.alertId = alertId || null;

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        form.find('.website').val(node.website !== null ? node.website : '');
        form.find('.alertId').val(node.alertId !== null ? node.alertId : '');
        
        JBApp.showSettingPanel(node);
    }
};
