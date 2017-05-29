JBNodes['userVisitGoal'] = {
    icon: 'fa fa-user-o',
    title: 'User visit',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/user/jb/userVisitGoalNode.png',
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nextNodeId: {
            label: 'then',
            title: 'when visited',
            maxConnections: 1
        }
    },

    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Group name</label>' +
            '        <select class="form-control groupName"></select>' +
            '    </div>' +
            '</div>' + JBApp.standardGoalSettingControls
        );

        $.ajax({
            url: '/groups/_DAV/PROPFIND?fields=name',
            type: 'get',
            dataType: 'json',
            success: function (resp) {
                var optionsStr = '<option value="">[No group selected]</option>';
                for (var i = 1; i < resp.length; i++) {
                    optionsStr += '<option value="' + resp[i].name + '">' + resp[i].name + '</option>';
                }

                form.find('.groupName').html(optionsStr);
            }
        });

        JBApp.initStandardGoalSettingControls(form);

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var groupName = form.find('.groupName').val();
                JBApp.currentSettingNode.groupName = groupName || null;
                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        form.find('.groupName').val(node.groupName !== null ? node.groupName : '');
        JBApp.showSettingPanel(node);
    }
};
