JBNodes['createDataSeriesAction'] = {
    icon: 'fa fa-database',
    title: 'Create Data Series',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/salesdata/jb/createDataSeriesActionNode.png',
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
            '        <label>Date series name</label>' +
            '        <select class="form-control dataSeriesName"></select>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Amount</label>' +
            '        <input type="text" class="form-control amountMvel" value="" />' +
            '        <small class="text-muted help-block">Can use MVEL syntax</small>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label for="expression">Record date</label>' +
            '        <input type="text" class="form-control recordDateMvel" value="" />' +
            '        <small class="text-muted help-block">Can use MVEL syntax</small>' +
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
                    optionsStr += '<option value="' + resp[i].name + '">' + resp[i].name+ '</option>';
                }

                form.find('.dataSeriesName').html(optionsStr);
            }
        });
        
        form.forms({
            allowPostForm: false,
            onValid: function () {
                var dataSeriesName = form.find('.dataSeriesName').val();
                var amountMvel = form.find('.amountMvel').val();
                var recordDateMvel = form.find('.recordDateMvel').val();

                JBApp.currentSettingNode.dataSeriesName = dataSeriesName || null;
                JBApp.currentSettingNode.amountMvel = amountMvel || null;
                JBApp.currentSettingNode.recordDateMvel = recordDateMvel || null;
                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },
    
    showSettingForm: function (form, node) {
        form.find('.dataSeriesName').val(node.dataSeriesName !== null ? node.dataSeriesName : '');
        form.find('.amountMvel').val(node.amountMvel !== null ? node.amountMvel : '');
        form.find('.recordDateMvel').val(node.recordDateMvel !== null ? node.recordDateMvel : '');
        JBApp.showSettingPanel(node);
    }
};
