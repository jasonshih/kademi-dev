JBNodes['socialInteractionGoal'] = {
    icon: 'fa fa-share-alt',
    title: 'Social Interaction',
    type: JB_NODE_TYPE.GOAL,

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
                '        <label>Type</label>' +
                '        <select class="form-control interactionType">' +
                '            <option value="">[No type selected]</option>' +
                '            <option value="like">Like</option>' +
                '            <option value="comment">Comment</option>' +
                '        </select>' +
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
                    optionsStr += '<option value="' + resp[i].name + '">' + resp[i].name + '</option>';
                }

                form.find('.websiteName').html(optionsStr);
            }
        });

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var interactionType = form.find('.interactionType').val();
                JBApp.currentSettingNode.interactionType = interactionType || null;

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

        form.find('.interactionType').val(node.interactionType !== null ? node.interactionType : '');
        form.find('.websiteName').val(node.websiteName !== null ? node.websiteName : '');

        JBApp.showSettingPanel(node);
    }
};
