JBNodes['formGoal'] = {
    icon: 'fa fa-th-list',
    title: 'Form Goal',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/leadman/jb/formGoalNode.png',
    ports: {
        nextNodeId: {
            label: 'then',
            title: 'When completed',
            maxConnections: 1
        },
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        }
    },

    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Form Path</label>' +
                '        <input type="text" class="form-control form-path" value="">' +
                '    </div>' +
                '</div>' + 
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Form Data Field</label>' +
                '        <input type="text" class="form-control form-data-field" value="">' +
                '    </div>' +
                '</div>' + JBApp.standardGoalSettingControls
                );

        JBApp.initStandardGoalSettingControls(form);

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var formPath = form.find('.form-path').val();
                var formDataField = form.find('.form-data-field').val();

                JBApp.currentSettingNode.formPath = formPath || null;
                JBApp.currentSettingNode.formDataFieldName = formDataField || null;
                
                JBApp.saveFunnel('Funnel is saved', function () {
                    JBApp.hideSettingPanel();
                });
            }
        });
    },

    showSettingForm: function (form, node) {
        flog("showSettingForm", node);
        
        form.find('.form-path').val(node.formPath);
        form.find('.form-data-field').val(node.formDataFieldName);
        
        JBApp.showStandardGoalSettingControls(form, node);
        JBApp.showSettingPanel(node);
    }
};
