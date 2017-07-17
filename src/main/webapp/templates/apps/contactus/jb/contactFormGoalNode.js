JBNodes['contactFormGoal'] = {
    icon: 'fa fa-wpforms',
    title: 'Contact Form Goal',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/contactus/jb/contactFormGoalNode.png',
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
            '        <label>Contact form path</label>' +
            '        <input type="text" class="form-control contactFormPath" value="" />' +
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
                var contactFormPath = form.find('.contactFormPath').val();
                var websiteName = form.find('.websiteName').val();
                JBApp.currentSettingNode.contactFormPath = contactFormPath || null;
                JBApp.currentSettingNode.websiteName = websiteName || null;

                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        form.find('.contactFormPath').val(node.contactFormPath || '');
        form.find('.websiteName').val(node.websiteName || '');

        JBApp.showSettingPanel(node);
    }
};
