JBNodes['calendarEventAction'] = {
    title: '<i class="fa fa-calendar-check-o"></i> <span class="node-type">Calendar Event</span>',
    previewUrl: '/theme/apps/calendar/jb/calendarEventActionNode.png',
    ports: {
        nextNodeId: {
            label: 'then',
            title: 'When completed',
            maxConnections: 1
        }
    },

    initSettingForm: function (form) {
        form.append(
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Task name</label>' +
            '        <input type="text" class="form-control calendarName" value="" />' +
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
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label for="expression">Date</label>' +
            '        <input type="text" class="form-control dateMvel" value="" />' +
            '        <small class="text-muted help-block">Can use MVEL syntax</small>' +
            '    </div>' +
            '</div>'
        );

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var calendarName = form.find('.calendarName').val();
                var titleMvel = form.find('.titleMvel').val();
                var descriptionMvel = form.find('.descriptionMvel').val();
                var dateMvel = form.find('.dateMvel').val();

                JBApp.currentSettingNode.calendarName = calendarName || null;
                JBApp.currentSettingNode.titleMvel = titleMvel || null;
                JBApp.currentSettingNode.descriptionMvel = descriptionMvel || null;
                JBApp.currentSettingNode.dateMvel = dateMvel || null;
                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        form.find('.calendarName').val(node.calendarName !== null ? node.calendarName : '');
        form.find('.titleMvel').val(node.titleMvel !== null ? node.titleMvel : '');
        form.find('.descriptionMvel').val(node.descriptionMvel !== null ? node.descriptionMvel : '');
        form.find('.dateMvel').val(node.dateMvel !== null ? node.dateMvel : '');
        JBApp.showSettingPanel(node);
    }
};
