JBNodes['dataSeriesValueGoal'] = {
    icon: 'fa fa-puzzle-piece',
    title: 'Data Series Value',
    type: JB_NODE_TYPE.GOAL,
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nextNodeId: {
            label: 'then',
            title: 'When achieved',
            maxConnections: 1
        }
    },

    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Date series name</label>' +
                '        <select class="form-control dataSeriesName"></select>' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Amount</label>' +
                '        <input type="text" class="form-control amount" value="" />' +
                '    </div>' +
                '</div>'
                );

        $.ajax({
            url: '/sales/_DAV/PROPFIND?fields=name',
            type: 'get',
            dataType: 'json',
            success: function (resp) {
                var optionsStr = '<option value="">[No data series selected]</option>';
                for (var i = 1; i < resp.length; i++) {
                    optionsStr += '<option value="' + resp[i].name + '">' + resp[i].name + '</option>';
                }

                form.find('.dataSeriesName').html(optionsStr);
            }
        });

        //JBApp.initStandardGoalSettingControls(form);

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var dataSeriesName = form.find('.dataSeriesName').val();
                var amount = form.find('.amount').val();

                JBApp.currentSettingNode.dataSeriesName = dataSeriesName || null;
                JBApp.currentSettingNode.amount = amount || null;
                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        form.find('.dataSeriesName').val(node.dataSeriesName !== null ? node.dataSeriesName : '');
        form.find('.amount').val(node.amount !== null ? node.amount : '');
        JBApp.showSettingPanel(node);
    }
};
