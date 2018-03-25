JBNodes['credentialSet'] = {
    icon: 'fa fa-key',
    title: 'Created credentials',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/user/jb/credentialSetNode.png',
    ports: {
        nextNodeId: {
            label: 'then',
            title: 'when credential created',
            maxConnections: 1
        }
    },

    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Website</label>' +
            '        <select class="form-control websiteName"></select>' +
            '    </div>' +
            '</div>' + JBApp.standardGoalSettingControls
        );

        JBApp.initStandardGoalSettingControls(form);

        $.ajax({
            url: '/websites/_DAV/PROPFIND?fields=name',
            type: 'get',
            dataType: 'json',
            success: function (resp) {
                var optionsStr = '<option value="">[No website selected]</option>';
                for (var i = 1; i < resp.length; i++) {
                    optionsStr += '<option value="' + resp[i].name + '">' + resp[i].name+ '</option>';
                }

                form.find('.websiteName').html(optionsStr);
            }
        });

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var websiteName = form.find('.websiteName').val();
                JBApp.currentSettingNode.websiteName = websiteName || null;

                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        form.find('.websiteName').val(node.websiteName || '');

        JBApp.showSettingPanel(node);
    }

};
