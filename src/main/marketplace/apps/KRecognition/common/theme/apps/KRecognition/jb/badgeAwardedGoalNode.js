JBNodes['krecognition-badgeAwardedGoal'] = {
    icon: 'fa fa-shield',
    title: 'Badge Awarded',
    type: JB_NODE_TYPE.GOAL,

    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nextNodeId: {
            label: 'then',
            title: 'When awarded',
            maxConnections: 1
        }
    },

    nodeTypeClass: 'customGoal',

    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Topic</label>' +
                '        <select class="form-control krecognition-topic"></select>' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Badge</label>' +
                '        <select class="form-control krecognition-badge"><option value="">[No badge selected]</option></select>' +
                '    </div>' +
                '</div>'
                );

        form.append(JBApp.standardGoalSettingControls);
        JBApp.initStandardGoalSettingControls(form);

        $.ajax({
            url: '/recognition/?asJson',
            type: 'GET',
            dataType: 'json',
            success: function (resp) {
                form.data('krecognition-topics', resp);

                var optionsStr = '<option value="">[No topic selected]</option>';
                for (var i = 0; i < resp.length; i++) {
                    var topic = resp[i];
                    optionsStr += '<option value="' + topic.id + '">' + (topic.title || topic.name) + '</option>';
                }

                form.find('.krecognition-topic').html(optionsStr);
            }
        });

        form.forms({
            allowPostForm: false,
            onValid: function () {
                JBApp.saveStandardGoalSetting(form);

                var topic = form.find('.krecognition-topic').val();
                var badge = form.find('.krecognition-badge').val();

                JBApp.currentSettingNode.customSettings = {};
                JBApp.currentSettingNode.customSettings.topic = topic || null;
                JBApp.currentSettingNode.customSettings.badge = badge || null;

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });

        form.find('.krecognition-topic').on('change', function (e) {
            var sel = $(this);
            var val = sel.val();

            var selectedTopic = null;
            var json = form.data('krecognition-topics');
            for (var i = 0; i < json.length; i++) {
                var topic = json[i];
                if (topic.id === parseInt(val)) {
                    selectedTopic = topic;
                    break;
                }
            }

            var badgeVal = form.find('.krecognition-badge').val();
            var optionsStr = '<option value="">[No badge selected]</option>';

            if (selectedTopic !== null) {
                for (var i = 0; i < selectedTopic.badges.length; i++) {
                    var badge = selectedTopic.badges[i];

                    var selected = false;
                    if (badge.id === parseInt(badgeVal)) {
                        selected = true;
                    }

                    optionsStr += '<option value="' + badge.id + '" ' + (selected ? 'selected="selected"' : '') + '>' + (badge.title || badge.name) + '</option>';
                }
            }

            form.find('.krecognition-badge').html(optionsStr);
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);

        if (typeof node.customSettings !== 'object') {
            node.customSettings = {};
        }

        form.find('.krecognition-topic').val(node.customSettings.topic !== null ? node.customSettings.topic : '').trigger("change");
        form.find('.krecognition-badge').val(node.customSettings.badge !== null ? node.customSettings.badge : '').trigger("change");

        JBApp.showSettingPanel(node);
    }
};