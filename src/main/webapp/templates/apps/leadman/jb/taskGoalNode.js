JBNodes['taskGoal'] = {
    icon: 'fa fa-tasks',
    title: 'Task',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/leadman/jb/taskGoalNode.png',
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        taskOutcomes: {
            label: 'outcome',
            title: 'Outcome ',
            maxConnections: -1,
            onInitConnection: function (node) {
                if (node.taskOutcomes && $.isArray(node.taskOutcomes)) {
                    for (var i = 0; i < node.taskOutcomes.length; i++) {
                        JBApp.jspInstance.connect({
                            source: node.nodeId,
                            target: node.taskOutcomes[i].nextNodeId,
                            type: 'taskOutcomes'
                        });
                    }
                }
            },
            onConnected: function (connection, sourceNodeData) {
                if (!sourceNodeData.taskOutcomes) {
                    sourceNodeData.taskOutcomes = [];
                }

                sourceNodeData.taskOutcomes.push({
                    'id': 'outcome-' + JBApp.uuid(),
                    'nextNodeId': connection.targetId,
                    'title': '',
                    'fields': null
                });
            },
            onDeleteConnection: function (connection, sourceNodeData) {
                for (var i = 0; i < sourceNodeData.taskOutcomes.length; i++) {
                    var outcome = sourceNodeData.taskOutcomes[i];
                    if (outcome.nextNodeId === connection.targetId) {
                        sourceNodeData.taskOutcomes.splice(i, 1);
                        break;
                    }
                }
            }
        }
    },
    
    settingEnabled: true,
    
    initSettingForm: function (form) {
        form.append(
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Outcomes</label>' +
            '       <div class="outcomes-wrapper">' +
            '       </div>' +
            '    </div>' +
            '</div>' +
            '<hr />' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Task name</label>' +
            '        <input type="text" class="form-control taskName" value="" />' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Title</label>' +
            '        <input type="text" class="form-control titleMvel" value="" />' +
            '        <small class="text-muted help-block">Can use MVEL syntax</small>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Task due</label>' +
            '        <div class="input-group">' +
            '            <input type="number" class="form-control periodMultiples numeric" placeholder="3" />' +
            '            <div class="input-group-btn">' +
            '                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="frequency-preview"></span>' +
            '                    <span class="caret"></span>' +
            '                </button>' +
            '                <input type="hidden" class="frequency" value="" />' +
            '                <ul class="dropdown-menu dropdown-menu-right frequency-selector">' +
            '                    <li><a href="#" data-value="y">Years</a></li>' +
            '                    <li><a href="#" data-value="M">Months</a></li>' +
            '                    <li><a href="#" data-value="w">Weeks</a></li>' +
            '                    <li><a href="#" data-value="d">Days</a></li>' +
            '                    <li><a href="#" data-value="h">Hours</a></li>' +
            '                </ul>' +
            '            </div>' +
            '        </div>' +
            '        <i>When the task is due, eg "3 days"</i>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Run at hour</label>' +
            '        <input type="number" class="form-control runHour numeric" min="0" max="23" value="" placeholder="9" />' +
            '        <small class="text-muted help-block">Format is 24 hours time</small>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Assign to org</label>' +
            '        <input type="text" class="form-control assignToOrgRule" value="" />' +
            '        <small class="text-muted help-block">Can use MVEL syntax</small>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Assign to group</label>' +
            '        <input type="text" class="form-control assignToGroupRule" value="" />' +
            '        <small class="text-muted help-block">Can use MVEL syntax</small>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label for="expression">Description</label>' +
            '        <textarea name="expression"  class="form-control descriptionMvel" rows="5"></textarea>' +
            '        <small class="text-muted help-block">Can use MVEL syntax</small>' +
            '    </div>' +
            '</div>' + JBApp.standardGoalSettingControls
        );
        
        JBApp.initStandardGoalSettingControls(form);
        
        form.find('.frequency-selector li').on('click', function (e) {
            e.preventDefault();
            
            var a = $(this).find('a');
            var text = a.text().trim();
            var value = a.attr('data-value');
            
            form.find('.frequency').val(value);
            form.find('.frequency-preview').html(text);
        });
        
        form.forms({
            allowPostForm: false,
            onValid: function () {
                var frequency = form.find('.frequency').val();
                var periodMultiples = form.find('.periodMultiples').val();
                var runHour = form.find('.runHour').val();
                var taskName = form.find('.taskName').val();
                var assignToOrgRule = form.find('.assignToOrgRule').val();
                var assignToGroupRule = form.find('.assignToGroupRule').val();
                var titleMvel = form.find('.titleMvel').val();
                var descriptionMvel = form.find('.descriptionMvel').val();

                JBApp.currentSettingNode.frequency = frequency || null;
                JBApp.currentSettingNode.periodMultiples = periodMultiples || null;
                JBApp.currentSettingNode.runHour = runHour || null;
                JBApp.currentSettingNode.taskName = taskName || null;
                JBApp.currentSettingNode.assignToOrgRule = assignToOrgRule || null;
                JBApp.currentSettingNode.assignToGroupRule = assignToGroupRule || null;
                JBApp.currentSettingNode.titleMvel = titleMvel || null;
                JBApp.currentSettingNode.descriptionMvel = descriptionMvel || null;

                for (var i = 0; i < JBApp.currentSettingNode.taskOutcomes.length; i++) {
                    var outcomesDev = $('#' + JBApp.currentSettingNode.taskOutcomes[i].id);
                    JBApp.currentSettingNode.taskOutcomes[i].title = outcomesDev.find('.field-title').val().trim();
                    JBApp.currentSettingNode.taskOutcomes[i].formPath = outcomesDev.find('.field-form-path').val().trim();
                    JBApp.currentSettingNode.taskOutcomes[i].validationMVEL = outcomesDev.find('.field-validation-mvel').val().trim();
                    JBApp.currentSettingNode.taskOutcomes[i].fields = outcomesDev.find('select').val() || null;
                }
                
                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },
    
    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        
        if (node.frequency !== null) {
            form.find('.frequency-selector li a').filter('[data-value=' + node.frequency + ']').trigger('click');
        } else {
            form.find('.frequency').val('');
            form.find('.frequency-preview').html('');
        }
        
        form.find('.periodMultiples').val(node.periodMultiples !== null ? node.periodMultiples : '');
        form.find('.runHour').val(node.runHour !== null ? node.runHour : '');
        form.find('.taskName').val(node.taskName !== null ? node.taskName : '');
        form.find('.assignToOrgRule').val(node.assignToOrgRule !== null ? node.assignToOrgRule : '');
        form.find('.assignToGroupRule').val(node.assignToGroupRule !== null ? node.assignToGroupRule : '');
        form.find('.titleMvel').val(node.titleMvel !== null ? node.titleMvel : '');
        form.find('.descriptionMvel').val(node.descriptionMvel !== null ? node.descriptionMvel : '');

        this.outcomes = $.extend({}, node.taskOutcomes);
        this.showOutcomes(form, node);
        JBApp.showSettingPanel(node);
    },

    showOutcomes: function (form, node) {
        var self = this;
        var outcomesStr = '';

        flog('showOutcomes', self.outcomes);

        for (var i in self.outcomes) {
            var outcome = self.outcomes[i];
            var toText = '';
            var target = $('#' + outcome.nextNodeId);

            if (target.length === 0) {
                break;
            }

            target = target.clone();
            toText = target.find('.node-type').html().trim() + ' ';

            var targetTitle = target.find('.node-title-inner').html().trim();
            if (targetTitle !== 'Enter title') {
                toText += targetTitle;
            }
            flog('To text: ' + toText);

            outcomesStr += '<div class="outcome" id="' + outcome.id + '">';
            outcomesStr += '     <p><strong>To:</strong> ' + toText + '</p>';
            outcomesStr += '     <p><strong>Title</strong></p>';
            outcomesStr += '     <p><input type="text" class="field-title form-control required" value="' + (outcome.title || '') + '" /></p>';
            outcomesStr += '     <p><strong>Form Path</strong></p>';
            outcomesStr += '     <p><input type="text" class="field-form-path form-control" value="' + (outcome.formPath || '') + '" /></p>';
            outcomesStr += '     <p><strong>Fields</strong></p>';
            outcomesStr += '     <p><select class="form-control" multiple>';
            if (JBApp.funnel.extraFields && $.isArray(JBApp.funnel.extraFields)) {
                for (var j = 0; j < JBApp.funnel.extraFields.length; j++) {
                    var extraField = JBApp.funnel.extraFields[j];
                    var isSelected = $.inArray(extraField.name, outcome.fields) !== -1;

                    outcomesStr += '<option value="' + extraField.name + '" ' + (isSelected ? 'selected="selected"' : '') + '>' + extraField.title + '</option>';
                }
            }
            outcomesStr += '     </select></p>';
            outcomesStr += '     <p><strong>Validation MVEL</strong></p>';
            outcomesStr += '     <p><textarea class="field-validation-mvel form-control">' + (outcome.validationMVEL || '') + '</textarea></p>';
            outcomesStr += '</div>';
            outcomesStr += '<hr />';
        }

        form.find('.outcomes-wrapper').html("<div class='well'>" + outcomesStr + "</div>");
    }
};
