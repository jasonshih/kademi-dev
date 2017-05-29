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
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <div class="checkbox">' +
            '           <label>' +
            '               <input type="checkbox" name="plainText" class="plain-text">' +
            '               Plain Text Value' +
            '           </label>' +
            '        </div>' +
            '        <small class="text-muted help-block">If set, value will not be evaluated as MVEL</small>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <div class="checkbox">' +
            '           <label>' +
            '               <input type="checkbox" name="setInSource" class="set-in-source">' +
            '               Set for Source Lead' +
            '           </label>' +
            '        </div>' +
            '        <small class="text-muted help-block">If set, value will be set to source lead field</small>' +
            '    </div>' +
            '</div>'
        );

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var fieldName = form.find('.field-name').val();
                var fieldValueMvel = form.find('.field-value').val();
                var plainText = form.find('.plain-text').prop("checked");
                var setInSource = form.find('.set-in-source').prop("checked");

                JBApp.currentSettingNode.fieldName = fieldName || null;
                JBApp.currentSettingNode.fieldValueMvel = fieldValueMvel || null;
                JBApp.currentSettingNode.plainText = plainText || null;
                JBApp.currentSettingNode.setInSource = setInSource || null;
                
                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        form.find('.field-name').val(node.fieldName != null ? node.fieldName : '');
        form.find('.field-value').val(node.fieldValueMvel != null ? node.fieldValueMvel : '');
        form.find('.plain-text').prop("checked", node.plainText != null ? node.plainText : false);
        form.find('.set-in-source').prop("checked", node.setInSource != null ? node.setInSource : false);
        
        JBApp.showSettingPanel(node);
    }
};
