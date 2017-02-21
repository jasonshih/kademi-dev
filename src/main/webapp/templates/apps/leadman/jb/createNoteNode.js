JBNodes['createNote'] = {
    icon: 'fa fa-pencil-square-o',
    title: 'Create Note',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/leadman/jb/createNoteNode.png',
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
                '        <label>Inbound</label>' +
                '        <select class="form-control field-inbound" >' +
                '            <option value="true">True</option>' +
                '            <option value="false">False</option>' +
                '        </select>' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Action type</label>' +
                '        <input class="form-control field-actiontype"/>' +
                '        <small class="text-muted help-block">e.g. phone, email, sms, twitter, facebook</small>' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Note</label>' +
                '        <textarea name="expression"  class="form-control field-notes" rows="5"></textarea>' +
                '        <small class="text-muted help-block">Can use MVEL syntax</small>' +
                '    </div>' +
                '</div>'
                );

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var inbound = form.find('.field-inbound').val();
                var actionType = form.find('.field-actiontype').val();
                var noteValueMvel = form.find('.field-notes').val();

                JBApp.currentSettingNode.inbound = inbound || null;
                JBApp.currentSettingNode.actionType = actionType || null;
                JBApp.currentSettingNode.noteValueMvel = noteValueMvel || null;
                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        form.find('.field-inbound').val(node.inbound !== null ? node.inbound : '');
        form.find('.field-actiontype').val(node.actionType !== null ? node.actionType : '');
        form.find('.field-notes').val(node.noteValueMvel !== null ? node.noteValueMvel : '');
        JBApp.showSettingPanel(node);
    }
};
