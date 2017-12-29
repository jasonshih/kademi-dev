JBNodes['fork'] = {
    icon: 'fa fa-code-fork',
    title: 'Fork',
    type: JB_NODE_TYPE.ACTION,
    previewUrl: '/theme/apps/leadman/jb/forkNode.png',
    ports: {
        nextNodeId: {
            label: 'default',
            title: 'Default Next Node',
            maxConnections: 1
        },
        secondaryNextNodeIds: {
            label: 'secondaryNode',
            title: 'Secondary Next Node ',
            maxConnections: -1,
            onInitConnection: function (node) {
                if (node.secondaryNextNodeIds && $.isArray(node.secondaryNextNodeIds)) {
                    for (var i = 0; i < node.secondaryNextNodeIds.length; i++) {
                        JBApp.jspInstance.connect({
                            source: node.nodeId,
                            target: node.secondaryNextNodeIds[i],
                            type: 'secondaryNextNodeIds'
                        });
                    }
                }
            },
            onConnected: function (connection, sourceNodeData) {
                if (!sourceNodeData.secondaryNextNodeIds) {
                    sourceNodeData.secondaryNextNodeIds = [];
                }

                sourceNodeData.secondaryNextNodeIds.push(connection.targetId);
            },
            onDeleteConnection: function (connection, sourceNodeData) {
                for (var i = 0; i < sourceNodeData.secondaryNextNodeIds.length; i++) {
                    var secondaryNextNode = sourceNodeData.secondaryNextNodeIds[i];
                    if (secondaryNextNode === connection.targetId) {
                        sourceNodeData.secondaryNextNodeIds.splice(i, 1);
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
            '        <label>Title</label>' +
            '        <input type="text" class="form-control titleMvel" value="" />' +
            '        <small class="text-muted help-block">Can use MVEL syntax</small>' +
            '    </div>' +
            '</div>'
        );
        
        form.forms({
            allowPostForm: false,
            onValid: function () {
                var titleMvel = form.find('.titleMvel').val();

                JBApp.currentSettingNode.titleMvel = titleMvel || null;
                
                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },
    
    showSettingForm: function (form, node) {
        form.find('.titleMvel').val(node.titleMvel !== null ? node.titleMvel : '');

        this.secondaryNextNodeIds = $.extend({}, node.secondaryNextNodeIds);
        
        JBApp.showSettingPanel(node);
    }
};
