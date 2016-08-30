JBNodes['automationGoal'] = {
    title: '<i class="fa fa-trophy"></i> <span class="node-type">Automation Goal</span>',
    previewUrl: '/theme/apps/email/jb/automationGoalNode.png',
    ports: {
        nextNodeId: {
            label: 'then',
            title: 'When complete',
            maxConnections: 1
        },
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        }
    },

    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Trigger name</label>' +
            '        <select class="form-control triggerName"></select>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Timeout</label>' +
            '        <div class="input-group">' +
            '            <input type="number" class="form-control timeout-multiples numeric" />' +
            '            <div class="input-group-btn">' +
            '                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="timeout-units-preview"></span>' +
            '                    <span class="caret"></span>' +
            '                </button>' +
            '                <input type="hidden" class="timeout-units" value="" />' +
            '                <ul class="dropdown-menu dropdown-menu-right timeout-units-selector">' +
            '                    <li><a href="#" data-value="y">Years</a></li>' +
            '                    <li><a href="#" data-value="M">Months</a></li>' +
            '                    <li><a href="#" data-value="w">Weeks</a></li>' +
            '                    <li><a href="#" data-value="d">Days</a></li>' +
            '                    <li><a href="#" data-value="h">Hours</a></li>' +
            '                    <li><a href="#" data-value="m">Minutes</a></li>' +
            '                </ul>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>'
        );

        $.ajax({
            url: '/autoEmails/_DAV/PROPFIND?fields=name,milton:title',
            type: 'get',
            dataType: 'json',
            success: function (resp) {
                var optionsStr = '<option value="">[No trigger selected]</option>';
                for (var i = 1; i < resp.length; i++) {
                    optionsStr += '<option value="' + resp[i].name + '">' + resp[i].title.replace('Automation: ', '') + '</option>';
                }

                form.find('.triggerName').html(optionsStr);
            }
        });

        form.find('.timeout-units-selector li').on('click', function (e) {
            e.preventDefault();

            var a = $(this).find('a');
            var text = a.text().trim();
            var value = a.attr('data-value');

            form.find('.timeout-units').val(value);
            form.find('.timeout-units-preview').html(text);
        });

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var timeoutUnits = form.find('.timeout-units').val();
                var timeoutMultiples = form.find('.timeout-multiples').val();
                var triggerName = form.find('.triggerName').val();

                JBApp.currentSettingNode.timeoutUnits = timeoutUnits || null;
                JBApp.currentSettingNode.timeoutMultiples = timeoutMultiples || null;
                JBApp.currentSettingNode.triggerName = triggerName || null;
                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        if (node.timeoutUnits !== null) {
            form.find('.timeout-units-selector li a').filter('[data-value=' + node.timeoutUnits + ']').trigger('click');
        } else {
            form.find('.timeout-units').val('');
            form.find('.timeout-units-preview').html('');
        }

        form.find('.timeout-multiples').val(node.timeoutMultiples !== null ? node.timeoutMultiples : '');
        form.find('.triggerName').val(node.triggerName !== null ? node.triggerName : '');
        JBApp.showSettingPanel(node);
    }
};
