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
                '</div><hr /><h4>Reminder Details</h4>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Theme Website</label>' +
                '        <select class="form-control reminderThemeWebsite"></select>' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label for="expression">Reminder Subject</label>' +
                '        <input type="text" class="form-control reminderSubject" value="" placeholder="Can use MVEL synta" />' +
                '        <small class="text-muted help-block">Subject of the reminder</small>' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label for="expression">Remind Before</label>' +
                '        <input type="number" class="form-control remindBeforeDays" value="" placeholder="Number of Days" />' +
                '        <small class="text-muted help-block">Number of Days To Send Reminder</small>' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label for="expression">Path to Reminder Body</label>' +
                '        <input type="text" class="form-control reminderBodyPath" value="" placeholder="Path to page containning reminder body" />' +
                '        <small class="text-muted help-block">Page must exist inside journey repository</small>' +
                '    </div>' +
                '</div>'
                );


        $.ajax({
            url: '/Calendars/_DAV/PROPFIND?fields=name',
            type: 'get',
            dataType: 'json',
            success: function (resp) {
                var optionsStr = '<option value="">[No calendar selected]</option>';
                var optionsStr = '<option value="_default">Personal calendar</option>';
                for (var i = 1; i < resp.length; i++) {
                    optionsStr += '<option value="' + resp[i].name + '">' + resp[i].name + '</option>';
                }

                form.find('.calendarName').html(optionsStr);
            }
        });

        $.ajax({
            url: '/websites/_DAV/PROPFIND?fields=name',
            type: 'get',
            dataType: 'json',
            success: function (resp) {
                var optionsStr = '<option value="">[No website selected]</option>';
                for (var i = 1; i < resp.length; i++) {
                    optionsStr += '<option value="' + resp[i].name + '">' + resp[i].name + '</option>';
                }

                form.find('.reminderThemeWebsite').html(optionsStr);
            }
        });

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var calendarName = form.find('.calendarName').val();
                var titleMvel = form.find('.titleMvel').val();
                var descriptionMvel = form.find('.descriptionMvel').val();
                var dateMvel = form.find('.dateMvel').val();
                
                var reminderThemeWebsite = form.find('.reminderThemeWebsite :selected').val();
                var reminderSubject = form.find('.reminderSubject').val();
                var remindBeforeDays = form.find('.remindBeforeDays').val();
                var reminderBodyPath = form.find('.reminderBodyPath').val();

                JBApp.currentSettingNode.calendarName = calendarName || null;
                JBApp.currentSettingNode.titleMvel = titleMvel || null;
                JBApp.currentSettingNode.descriptionMvel = descriptionMvel || null;
                JBApp.currentSettingNode.dateMvel = dateMvel || null;
                JBApp.currentSettingNode.reminderThemeWebsite = reminderThemeWebsite || null;
                JBApp.currentSettingNode.reminderSubject = reminderSubject || null;
                JBApp.currentSettingNode.remindBeforeDays = remindBeforeDays || null;
                JBApp.currentSettingNode.reminderBodyPath = reminderBodyPath || null;
                
                
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
        form.find('.reminderThemeWebsite').val(node.reminderThemeWebsite !== null ? node.reminderThemeWebsite : '');
        form.find('.reminderSubject').val(node.reminderSubject !== null ? node.reminderSubject : '');
        form.find('.remindBeforeDays').val(node.remindBeforeDays !== null ? node.remindBeforeDays : '');
        form.find('.reminderBodyPath').val(node.reminderBodyPath !== null ? node.reminderBodyPath : '');
        
        JBApp.showSettingPanel(node);
    }
};
