JBNodes['calendarEventAction'] = {
    icon: 'fa fa-calendar-check-o',
    title: 'Calendar Event',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/calendar/jb/calendarEventActionNode.png',
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
            '        <label>Calendar name</label>' +
            '        <select class="form-control calendarName"></select>' +
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


        $.ajax({
            url: '/Calendars/_DAV/PROPFIND?fields=name',
            type: 'get',
            dataType: 'json',
            success: function (resp) {
                var optionsStr = '<option value="">[No calendar selected]</option>';
                for (var i = 1; i < resp.length; i++) {
                    optionsStr += '<option value="' + resp[i].name + '">' + resp[i].name + '</option>';
                }

                form.find('.calendarName').html(optionsStr);
            }
        });

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
