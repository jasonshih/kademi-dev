JBNodes['groupGoal'] = {
    title: '<i class="fa fa-trophy"></i> <span class="node-type">Group goal</span>',
    previewUrl: '/theme/apps/user/jb/groupGoalNode.png',
    ports: {
        nodeIdAccepted: {
            label: 'accepted',
            title: 'When accepted',
            maxConnections: 1
        },
        nodeIdRejected: {
            label: 'rejected',
            title: 'When rejected',
            maxConnections: 1
        },
        nodeIdPending: {
            label: 'pending',
            title: 'When pending',
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
            '        <label>Group name</label>' +
            '        <select class="form-control groupName"></select>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Stage</label>' +
            '        <select class="form-control stageName"></select>' +
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
            url: '/groups/_DAV/PROPFIND?fields=name',
            type: 'get',
            dataType: 'json',
            success: function (resp) {
                var optionsStr = '<option value="">[No group selected]</option>';
                for (var i = 1; i < resp.length; i++) {
                    optionsStr += '<option value="' + resp[i].name + '">' + resp[i].name + '</option>';
                }

                form.find('.groupName').html(optionsStr);
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
                var groupName = form.find('.groupName').val();
                var stageName = form.find('.stageName').val();

                JBApp.currentSettingNode.groupName = groupName || null;
                JBApp.currentSettingNode.timeoutUnits = timeoutUnits || null;
                JBApp.currentSettingNode.timeoutMultiples = timeoutMultiples || null;
                JBApp.currentSettingNode.stageName = stageName || null;

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

        var stagesOptionStr = '<option value="">[No stage selected]</option>';
        if (JBApp.funnel.stages && $.isArray(JBApp.funnel.stages)) {
            for (var i = 0; i < JBApp.funnel.stages.length; i++) {
                stagesOptionStr += '<option value="' + JBApp.funnel.stages[i].name + '">' + JBApp.funnel.stages[i].desc + '</option>';
            }
        }
        form.find('.stageName').html(stagesOptionStr).val(node.timeoutMultiples !== null ? node.timeoutMultiples : '');

        form.find('.timeout-multiples').val(node.timeoutMultiples !== null ? node.timeoutMultiples : '');
        form.find('.groupName').val(node.groupName !== null ? node.groupName : '');
        JBApp.showSettingPanel(node);
    }
};
