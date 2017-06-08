JBNodes['setSourceLead'] = {
    icon: 'fa fa-child',
    title: 'Set Source Lead',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/leadman/jb/setSourceLeadNode.png',
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
            '        <label for="expression">Source Lead Id</label>' +
            '        <textarea name="expression" class="form-control source-lead-id-value" rows="5"></textarea>' +
            '        <small class="text-muted help-block">Can use MVEL syntax</small>' +
            '    </div>' +
            '</div>'
        );

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var sourceLeadIdMvel = form.find('.source-lead-id-value').val();

                JBApp.currentSettingNode.sourceLeadIdMvel = sourceLeadIdMvel || null;
                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        form.find('.source-lead-id-value').val(node.sourceLeadIdMvel !== null ? node.sourceLeadIdMvel : '');
        JBApp.showSettingPanel(node);
    }
};
