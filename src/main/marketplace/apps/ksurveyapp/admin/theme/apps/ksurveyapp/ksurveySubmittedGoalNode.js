JBNodes['ksurveySubmittedGoal'] = {
    icon: 'fa fa-trophy',
    title: 'KSurvey Submit Goal',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/ksurveyapp/ksurvey-submit-goal.png',
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nextNodeId: {
            label: 'then',
            title: 'When completed',
            maxConnections: 1
        }
    },
    
    nodeTypeClass: 'customGoal',
    
    settingEnabled: true,
    
    initSettingForm: function (form) {
        form.append(
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Survey</label>' +
            '        <select name="survey" class="form-control ksurvey-list"></select>' +
            '    </div>' +
            '</div>'
        );

        form.append(JBApp.standardGoalSettingControls);
        
        JBApp.initStandardGoalSettingControls(form);
        
        form.forms({
            allowPostForm: false,
            onValid: function () {
                JBApp.saveStandardGoalSetting(form);

                var survey = form.find('.ksurvey-list').val();
                JBApp.currentSettingNode.customSettings = {
                    survey: survey || null
                };

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });

        $.ajax({
            url: '/ksurveyapi/',
            data: {method: 'surveysList'},
            type: 'GET',
            dataType: 'json',
            success: function (resp) {
                var optionsStr = '<option value="">[No survey selected]</option>';
                for (var i = 0; i < resp.data.length; i++) {
                    var survey = resp.data[i];
                    optionsStr += '<option value="' + survey.id + '">' + (survey.title || survey.name) + '</option>';
                }

                form.find('.ksurvey-list').html(optionsStr);
            }
        });
    },
    
    showSettingForm: function (form, node) {
        if (typeof node.customSettings !== 'object') {
            node.customSettings = {};
        }
        JBApp.showStandardGoalSettingControls(form, node);
        form.find('.ksurvey-list').val(node.customSettings.survey !== null ? node.customSettings.survey : '').trigger("change");
        JBApp.showSettingPanel(node);
    }
};
