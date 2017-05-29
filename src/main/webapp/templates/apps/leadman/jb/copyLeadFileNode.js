JBNodes['copyLeadFile'] = {
    icon: 'fa fa-copy',
    title: 'Copy lead File',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/leadman/jb/copyLeadFileNode.png',
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
            '        <label for="expression">Source file name</label>' +
            '        <textarea name="fileNameMvel" class="form-control file-name" rows="5"></textarea>' +
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
            '        <label for="expression">Destination file name</label>' +
            '        <textarea name="newFileNameMvel" class="form-control destination-file-name" rows="5"></textarea>' +
            '        <small class="text-muted help-block">Can use MVEL syntax</small>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <div class="checkbox">' +
            '           <label>' +
            '               <input type="checkbox" name="newFilePlainText" class="new-plain-text">' +
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
            '               <input type="checkbox" name="setInSource" class="set-in-source-field">' +
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
                var fileNameMvel = form.find('.file-name').val();
                var newFileNameMvel = form.find('.destination-file-name').val();
                var plainText = form.find('.plain-text').prop("checked");
                var newFilePlainText = form.find('.new-plain-text').prop("checked");
                var setInSource = form.find('.set-in-source-field').prop("checked");

                JBApp.currentSettingNode.fileNameMvel = fileNameMvel || null;
                JBApp.currentSettingNode.newFileNameMvel = newFileNameMvel || null;
                JBApp.currentSettingNode.plainText = plainText || null;
                JBApp.currentSettingNode.newFilePlainText = newFilePlainText || null;
                JBApp.currentSettingNode.setInSource = setInSource || null;
                
                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        form.find('.file-name').val(node.fileNameMvel != null ? node.fileNameMvel : '');
        form.find('.destination-file-name').val(node.newFileNameMvel != null ? node.newFileNameMvel : '');
        form.find('.plain-text').prop("checked", node.plainText != null ? node.plainText : false);
        form.find('.new-plain-text').prop("checked", node.newFilePlainText != null ? node.newFilePlainText : false);
        form.find('.set-in-source-field').prop("checked", node.setInSource != null ? node.setInSource : false);
        
        JBApp.showSettingPanel(node);
    }
};
