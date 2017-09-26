JBNodes['addToOrgType'] = {
    icon: 'fa fa-sitemap',
    title: 'Add to Org Type',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/user/jb/addToOrgTypeNode.png',
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
                '        <label>Org Type to Add</label>' +
                '        <select class="form-control orgTypeToAdd"></select>' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Org Type to Locate</label>' +
                '        <select class="form-control orgTypeToLocate"></select>' +
                '    </div>' +
                '</div>'
                );

        $.ajax({
            url: '/orgTypes/_DAV/PROPFIND?fields=name',
            type: 'get',
            dataType: 'json',
            success: function (resp) {
                var optionsStr = '<option value="">[No Org Type selected]</option>';
                for (var i = 1; i < resp.length; i++) {
                    optionsStr += '<option value="' + resp[i].name + '">' + resp[i].name + '</option>';
                }

                form.find('.orgTypeToAdd').html(optionsStr);
                form.find('.orgTypeToLocate').html(optionsStr);
            }
        });

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var orgTypeToAdd = form.find('.orgTypeToAdd').val();
                var orgTypeToLocate = form.find('.orgTypeToLocate').val();

                JBApp.currentSettingNode.orgTypeToAdd = orgTypeToAdd || null;
                JBApp.currentSettingNode.orgTypeToLocate = orgTypeToLocate || null;

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        form.find('.orgTypeToAdd').val(node.orgTypeToAdd !== null ? node.orgTypeToAdd : '');
        form.find('.orgTypeToLocate').val(node.orgTypeToLocate !== null ? node.orgTypeToLocate : '');
        JBApp.showSettingPanel(node);
    }

};
