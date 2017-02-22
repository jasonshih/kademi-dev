JBNodes['kfeedbackSubmittedGoal2'] = {
    icon: 'fa fa-tasks',
    title: 'Feedback submitted2',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/kfeedback/jb/kfeedbackSubmittedGoal2.png',
    nodeType: "customGoal",
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
            '        <label>Frequency2</label>' +
            '        <div class="input-group">' +
            '            <input type="number" class="form-control periodMultiples numeric" />' +
            '            <div class="input-group-btn">' +
            '                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="frequency-preview"></span>' +
            '                    <span class="caret"></span>' +
            '                </button>' +
            '                <input type="hidden" class="frequency" value="" />' +
            '                <ul class="dropdown-menu dropdown-menu-right frequency-selector">' +
            '                    <li><a href="#" data-value="y">Years</a></li>' +
            '                    <li><a href="#" data-value="M">Months</a></li>' +
            '                    <li><a href="#" data-value="w">Weeks</a></li>' +
            '                    <li><a href="#" data-value="d">Days</a></li>' +
            '                    <li><a href="#" data-value="h">Hours</a></li>' +
            '                </ul>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Run at</label>' +
            '        <input type="number" class="form-control runHour numeric" min="0" max="23" value="" />' +
            '        <small class="text-muted help-block">Format is 24 hours time</small>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Assign to org</label>' +
            '        <input type="text" class="form-control assignToOrgRule" value="" />' +
            '        <small class="text-muted help-block">Can use MVEL syntax</small>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Assign to group</label>' +
            '        <input type="text" class="form-control assignToGroupRule" value="" />' +
            '        <small class="text-muted help-block">Can use MVEL syntax</small>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Title</label>' +
            '        <input type="text" class="form-control titleMvel" value="" />' +
            '        <small class="text-muted help-block">Can use MVEL syntax</small>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label for="expression">Description</label>' +
            '        <textarea name="expression"  class="form-control descriptionMvel" rows="5"></textarea>' +
            '        <small class="text-muted help-block">Can use MVEL syntax</small>' +
            '    </div>' +
            '</div>'
        );

        form.find('.frequency-selector li').on('click', function (e) {
            e.preventDefault();

            var a = $(this).find('a');
            var text = a.text().trim();
            var value = a.attr('data-value');

            form.find('.frequency').val(value);
            form.find('.frequency-preview').html(text);
        });

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var frequency = form.find('.frequency').val();
                var periodMultiples = form.find('.periodMultiples').val();
                var runHour = form.find('.runHour').val();
                var taskName = form.find('.taskName').val();
                var assignToOrgRule = form.find('.assignToOrgRule').val();
                var assignToGroupRule = form.find('.assignToGroupRule').val();
                var titleMvel = form.find('.titleMvel').val();
                var descriptionMvel = form.find('.descriptionMvel').val();

                JBApp.currentSettingNode.frequency = frequency || null;
                JBApp.currentSettingNode.periodMultiples = periodMultiples || null;
                JBApp.currentSettingNode.runHour = runHour || null;
                JBApp.currentSettingNode.taskName = taskName || null;
                JBApp.currentSettingNode.assignToOrgRule = assignToOrgRule || null;
                JBApp.currentSettingNode.assignToGroupRule = assignToGroupRule || null;
                JBApp.currentSettingNode.titleMvel = titleMvel || null;
                JBApp.currentSettingNode.descriptionMvel = descriptionMvel || null;
                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        if (node.frequency !== null) {
            form.find('.frequency-selector li a').filter('[data-value=' + node.frequency + ']').trigger('click');
        } else {
            form.find('.frequency').val('');
            form.find('.frequency-preview').html('');
        }

        form.find('.periodMultiples').val(node.periodMultiples !== null ? node.periodMultiples : '');
        form.find('.runHour').val(node.runHour !== null ? node.runHour : '');
        form.find('.taskName').val(node.taskName !== null ? node.taskName : '');
        form.find('.assignToOrgRule').val(node.assignToOrgRule !== null ? node.assignToOrgRule : '');
        form.find('.assignToGroupRule').val(node.assignToGroupRule !== null ? node.assignToGroupRule : '');
        form.find('.titleMvel').val(node.titleMvel !== null ? node.titleMvel : '');
        form.find('.descriptionMvel').val(node.descriptionMvel !== null ? node.descriptionMvel : '');
        JBApp.showSettingPanel(node);
    }
};
