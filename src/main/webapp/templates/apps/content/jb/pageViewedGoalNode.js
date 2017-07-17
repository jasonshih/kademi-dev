JBNodes['pageViewedGoal'] = {
    icon: 'fa fa-globe',
    title: 'Page Viewed Goal',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/content/jb/pageViewedGoalNode.png',
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nextNodeId: {
            label: 'then',
            title: 'When completed',
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
        form.append(
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Website</label>' +
            '        <select class="form-control websiteName"></select>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Path</label>' +
            '        <input type="text" class="form-control path" value="" />' +
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
                var path = form.find('.path').val();
                var websiteName = form.find('.websiteName').val();
                JBApp.currentSettingNode.path = path || null;
                JBApp.currentSettingNode.websiteName = websiteName || null;

                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        form.find('.path').val(node.path || '');
        form.find('.websiteName').val(node.websiteName || '');

        JBApp.showSettingPanel(node);
    }
};
