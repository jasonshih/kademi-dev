JBNodes['krecognition-levelAchievedGoal'] = {
    icon: 'fa fa-star-half-o',
    title: 'Level Achieved',
    type: JB_NODE_TYPE.GOAL,

    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nextNodeId: {
            label: 'then',
            title: 'When level achieved',
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
                '        <label>Level</label>' +
                '        <select class="form-control krecognition-level"><option value="">[No level selected]</option></select>' +
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
                var level = form.find('.krecognition-level').val();

                JBApp.currentSettingNode.topic = topic || null;
                JBApp.currentSettingNode.level = level || null;

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

            var levelVal = form.find('.krecognition-level').val();
            var optionsStr = '<option value="">[No level selected]</option>';

            if (selectedTopic !== null) {
                for (var i = 0; i < selectedTopic.levels.length; i++) {
                    var level = selectedTopic.levels[i];

                    var selected = false;
                    if (level.id === parseInt(levelVal)) {
                        selected = true;
                    }

                    optionsStr += '<option value="' + level.id + '" ' + (selected ? 'selected="selected"' : '') + '>' + (level.title || level.name) + '</option>';
                }
            }

            form.find('.krecognition-level').html(optionsStr);
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);

        form.find('.krecognition-topic').val(node.topic !== null ? node.topic : '').trigger("change");
        form.find('.krecognition-level').val(node.level !== null ? node.level : '').trigger("change");

        JBApp.showSettingPanel(node);
    }
};
