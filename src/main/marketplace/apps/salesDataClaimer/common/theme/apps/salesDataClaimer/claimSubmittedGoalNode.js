JBNodes['claimSubmittedGoal'] = {
    icon: 'fa fa-trophy',
    title: 'Sales Claim Submitted',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/salesDataClaimer/salesDataClaimer-submitted-goal.png',
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nextNodeId: {
            label: 'then',
            title: 'When submitted',
            maxConnections: 1
        }
    },
    
    nodeTypeClass: 'customGoal',
    
    settingEnabled: true,
    
    initSettingForm: function (form) {
        form.append(            
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Claim Type</label>' +
            '        <input type="text" class="form-control claim-type" placeholder="Claim type to proceed" />' +
            '    </div>' +
            '</div>' 
        );

        form.append(JBApp.standardGoalSettingControls);
               
        JBApp.initStandardGoalSettingControls(form);
        
        
        form.forms({
            allowPostForm: false,
            onValid: function () {
                var claimType = form.find('.claim-type').val();
                JBApp.saveStandardGoalSetting(form);
                
                JBApp.currentSettingNode.customSettings = {};
                JBApp.currentSettingNode.customSettings['claimType'] = claimType || null;
                
                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },
    
    showSettingForm: function (form, node) {
        var customSettings = node.customSettings === undefined || node.customSettings === null ? {} : node.customSettings;
        
        JBApp.showStandardGoalSettingControls(form, node);
        form.find('.claim-type').val(customSettings.claimType !== null ? customSettings.claimType : '');
        JBApp.showSettingPanel(node);
    }
};
