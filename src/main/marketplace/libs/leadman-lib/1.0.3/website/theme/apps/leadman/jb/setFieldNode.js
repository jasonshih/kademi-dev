JBNodes['setField'] = {
    icon: 'fa fa-info',
    title: 'Set Field',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/leadman/jb/setFieldNode.png',
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
            '        <label>Field name</label>' +
            '        <input type="text" class="form-control field-name" value="" />' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label for="expression">Field value</label>' +
            '        <textarea name="expression"  class="form-control field-value" rows="5"></textarea>' +
            '        <small class="text-muted help-block">Can use MVEL syntax</small>' +
            '    </div>' +
            '</div>'
        );

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var fieldName = form.find('.field-name').val();
                var fieldValueMvel = form.find('.field-value').val();

                JBApp.currentSettingNode.fieldName = fieldName || null;
                JBApp.currentSettingNode.fieldValueMvel = fieldValueMvel || null;
                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        form.find('.field-name').val(node.fieldName !== null ? node.fieldName : '');
        form.find('.field-value').val(node.fieldValueMvel !== null ? node.fieldValueMvel : '');
        JBApp.showSettingPanel(node);
    }
};
