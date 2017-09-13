JBNodes['voucherStateGoal'] = {
    icon: 'fa fa-users',
    title: 'Voucher state goal',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/vouchers/jb/groupGoalNode.png',
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nodeIdIssued: {
            label: 'issued',
            title: 'When issued',
            maxConnections: 1
        },
        nodeIdStateChanged: {
            label: 'change',
            title: 'When state change',
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
                JBApp.currentSettingNode.voucherType = voucherType || null;
                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        form.find('.voucherType').val(node.voucherType !== null ? node.voucherType : '');
        JBApp.showSettingPanel(node);
    }
};
