JBNodes['allocateVoucherAction'] = {
    icon: 'fa fa-database',
    title: 'Allocate Voucher',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/vouchers/jb/allocateVoucherActionNode.png',
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
