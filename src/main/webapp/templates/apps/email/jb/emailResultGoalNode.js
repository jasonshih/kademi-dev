JBNodes['emailResultGoal'] = {
    title: '<i class="fa fa-trophy"></i> <span class="node-type">Email Result Goal</span>',
    previewUrl: '/theme/apps/email/jb/emailResultGoalNode.png',
    ports: {
        nodeIdDelivered: {
            label: 'delivered',
            title: 'When delivered',
            maxConnections: 1
        },
        nodeIdFailed: {
            label: 'failed',
            title: 'When failed',
            maxConnections: 1
        },
        nodeIdOpened: {
            label: 'opened',
            title: 'When opened',
            maxConnections: 1
        },
        nodeIdConverted: {
            label: 'converted',
            title: 'When converted',
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
                var stageName = form.find('.stageName').val();

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
        JBApp.showSettingPanel(node);
    }
};
