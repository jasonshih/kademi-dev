JBNodes['voucherStateGoal'] = {
    icon: 'fa fa-users',
    title: 'Voucher state goal',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/vouchers/jb/voucherStateGoalNode.png',
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nextNodeId: {
            label: 'then',
            title: 'When issued or state changed',
            maxConnections: 1
        }
    },

    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Voucher Type</label>' +
            '        <select class="form-control voucherType"></select>' +
            '    </div>' +
            '</div>'+
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Goal Type</label>' +
            '        <select class="form-control goalType">'+
            '           <option value="ISSUED">Issued</option>'+
            '           <option value="STATE_CHANGED">State changed</option>'+
            '        </select>' +
            '    </div>' +
            '</div>'
        );

        $.ajax({
            url: '/voucher-type/_DAV/PROPFIND?fields=name',
            type: 'get',
            dataType: 'json',
            success: function (resp) {
                var optionsStr = '<option value="">[No voucher type selected]</option>';
                for (var i = 1; i < resp.length; i++) {
                    optionsStr += '<option value="' + resp[i].name + '">' + resp[i].name+ '</option>';
                }

                form.find('.voucherType').html(optionsStr);
            }
        });
        
        form.forms({
            allowPostForm: false,
            onValid: function () {
                var voucherType = form.find('.voucherType').val();
                var goalType = form.find('.goalType').val();
                JBApp.currentSettingNode.voucherType = voucherType || null;
                JBApp.currentSettingNode.goalType = goalType || null;
                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        form.find('.voucherType').val(node.voucherType !== null ? node.voucherType : '');
        form.find('.goalType').val(node.goalType !== null ? node.goalType : '');
        JBApp.showSettingPanel(node);
    }
};
