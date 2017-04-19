JBNodes['decision'] = {
    icon: 'fa fa-code-fork',
    title: 'Decision',
    type: JB_NODE_TYPE.DECISION,
    previewUrl: '/theme/apps/funnels/jb/decisionNode.png',
    ports: {
        decisionDefault: {
            label: 'default',
            title: 'Default next action',
            maxConnections: 1,
            onInitConnection: function (node) {
                if (node['nextNodeId']) {
                    JBApp.jspInstance.connect({
                        source: node.nodeId,
                        target: node['nextNodeId'],
                        type: 'decisionDefault'
                    });
                }
            },
            onConnected: function (connection, sourceNodeData) {
                sourceNodeData.nextNodeId = connection.targetId;
            },
            onDeleteConnection: function (connection, sourceNodeData) {
                sourceNodeData.nextNodeId = '';
            }
        },
        decisionChoices: {
            label: '',
            title: 'Make new choice',
            maxConnections: -1,
            onInitConnection: function (node) {
                for (var key in node.choices) {
                    JBApp.jspInstance.connect({
                        source: node.nodeId,
                        target: key,
                        type: 'decisionChoices'
                    });
                }
            },
            onConnected: function (connection, sourceNodeData) {
                if (!sourceNodeData.choices) {
                    sourceNodeData.choices = {};
                }
                sourceNodeData.choices[connection.targetId] = {};
            },
            onDeleteConnection: function (connection, sourceNodeData) {
                if (sourceNodeData.choices.hasOwnProperty(connection.targetId)) {
                    delete sourceNodeData.choices[connection.targetId];
                }
            }
        }
    },

    settingEnabled: true,

    initSettingForm: function (form) {
        var self = this;

        form.append(
            '<div class="form-group">' +
            '   <div class="col-md-12">' +
            '       <label for="expression">Choices</label>' +
            '       <div class="choices-wrapper">' +
            '       </div>' +
            '   </div>' +
            '</div>'
        );

        var modal = $(
            '<div class="modal fade in" id="modal-query-builder">' +
            '   <div class="modal-dialog modal-lg">' +
            '       <div class="modal-content">' +
            '           <div class="modal-header">' +
            '               <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            '               <h4 class="modal-title">Decide your choice</h4>' +
            '           </div>' +
            '           <div class="modal-body">' +
            '               <div id="query-builder"></div>' +
            '           </div>' +
            '           <div class="modal-footer">' +
            '               <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
            '               <button type="button" class="btn btn-primary btn-save-choice">Save your choice</button>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>'
        );
        modal.appendTo(document.body);

        $.getScriptOnce('/static/query-builder/2.3.3/js/query-builder.standalone.min.js', function () {
            $.ajax({
                url: window.location.pathname + '?fields',
                type: 'get',
                dataType: 'json',
                success: function (resp) {
                    var builder = $('#query-builder');
                    builder.queryBuilder({
                        filters: resp
                    });

                    form.on('click', '.btn-edit-choice', function (e) {
                        e.preventDefault();

                        var btn = $(this);
                        var targetId = btn.attr('href');
                        var choice = self.choices[targetId];

                        if (choice && choice.query && choice.query.rules) {
                            builder.queryBuilder('setRules', choice.query.rules);
                        } else {
                            builder.queryBuilder('reset');
                        }

                        modal.attr('data-target-id', targetId).modal('show');
                    });

                    modal.find('.btn-save-choice').on('click', function (e) {
                        e.preventDefault();

                        var choiceRules = builder.queryBuilder('getRules');
                        var targetId = modal.attr('data-target-id');

                        if (!$.isEmptyObject(choiceRules)) {
                            if (!self.choices) {
                                self.choices = {};
                            }

                            if (targetId in self.choices) {
                                self.choices[targetId].query = self.choices[targetId].query || {
                                    rules: {},
                                    label: ''
                                };

                                choiceRules = self.checkRuleType(choiceRules);
                                self.choices[targetId].query.rules = choiceRules;
                            }

                            self.showChoices(form);
                            modal.modal('hide');
                        }
                    });
                }
            });
        });
        $.getStyleOnce('/static/query-builder/2.3.3/css/query-builder.default.min.css');

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var expression = form.find('.expression').val();

                JBApp.currentSettingNode.expression = expression || null;
                JBApp.currentSettingNode.choices = self.choices || null;
                JBApp.saveFunnel('Funnel is saved', function () {
                    self.choices = null;
                    JBApp.hideSettingPanel();
                });
            }
        });
    },

    checkRuleType: function (rules) {
        var self = this;

        if (rules.condition) {
            rules.ruleType = 'ruleList';
            rules.rules = self.checkRuleType(rules.rules);
        } else {
            if ($.isArray(rules)) {
                for (var i = 0; i < rules.length; i++) {
                    if (rules[i].condition) {
                        rules[i] = self.checkRuleType(rules[i]);
                    } else {
                        rules[i].ruleType = 'rule';
                    }
                }
            }
        }

        return rules;
    },

    showSettingForm: function (form, node) {
        flog('Show decision setting form', node);

        form.find('.expression').val(node.expression !== null ? node.expression : '');

        this.choices = $.extend({}, node.choices);
        this.showChoices(form, node);
        JBApp.showSettingPanel(node);
    },

    showChoices: function (form) {
        var self = this;
        var choicesStr = '';

        flog('showChoices', self.choices);

        for (var targetId in self.choices) {
            var choice = self.choices[targetId];
            var toText = '';
            var target = $('#' + targetId);

            if (target.length === 0) {
                break;
            }

            target = target.clone();
            toText = (target.find('.node-type').html() || '').trim() + ' ';

            var targetTitle = target.find('.node-title-inner').html().trim();
            if (targetTitle !== 'Enter title') {
                toText += targetTitle;
            }
            flog('To text: ' + toText);

            var rulesStr = '';
            if (choice.query && choice.query.rules) {
                rulesStr = self.ruleToString(choice.query.rules)
            }
            flog('Rules text: ' + rulesStr);

            choicesStr += '<div class="choice">';
            choicesStr += '     <p><strong>To:</strong> ' + toText + '</p>';
            choicesStr += '     <p><strong>Rules <small style="font-weight: normal;">(<a href="' + targetId + '" class="btn-edit-choice">edit</a>)</small>:</strong></p>' + rulesStr;
            choicesStr += '</div>';
            choicesStr += '<hr />';
        }

        form.find('.choices-wrapper').html(choicesStr);
    },

    ruleToString: function (rules) {
        var self = this;
        var rulesStr = '';

        rulesStr += '<ul>';
        rulesStr += '    <li><b>' + rules.condition + '</b>';
        rulesStr += '       <ul>';

        for (var i = 0; i < rules.rules.length; i++) {
            var rule = rules.rules[i];

            rulesStr += '<li>';
            if (rule.condition) {
                rulesStr += self.ruleToString(rule);
            } else {
                rulesStr += rule.id + ' ' + rule.operator + ' ' + rule.value;
            }
            rulesStr += '</li>';
        }

        rulesStr += '       </ul>';
        rulesStr += '   </li>';
        rulesStr += '</ul>';

        return rulesStr;
    }
};
