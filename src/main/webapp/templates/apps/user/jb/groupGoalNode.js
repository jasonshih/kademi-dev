JBNodes['groupGoal'] = {
    title: '<i class="fa fa-trophy"></i> <span class="node-type">Group goal</span>',
    previewUrl: '/theme/apps/email/jb/groupGoalNode.png',
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

    initSettingForm: function (form) {
        form.append(
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Group name</label>' +
            '        <input type="text" class="form-control groupName" value="" />' +
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

                JBApp.currentSettingNode.timeoutUnits = timeoutUnits || null;
                JBApp.currentSettingNode.timeoutMultiples = timeoutMultiples || null;
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
        JBApp.showSettingPanel(node);
    }
};
