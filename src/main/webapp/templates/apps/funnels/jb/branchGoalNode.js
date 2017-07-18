JBNodes['branchGoal'] = {
    icon: 'fa fa-code-fork',
    title: 'Branch Goal',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/funnels/jb/branchGoalNode.png',
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nextGoals: {
            label: '',
            title: 'Make new branch',
            maxConnections: -1,
            onInitConnection: function (node) {
                for( var i=0; i<node.branchNodeIds.length; i++) {
                    var nodeId = node.branchNodeIds[i];
                    JBApp.jspInstance.connect({
                        source: node.nodeId,
                        target: nodeId,
                        type: 'nextGoals'
                    });
                }
            },
            onConnected: function (connection, sourceNodeData) {
                if (!sourceNodeData.branchNodeIds) {
                    sourceNodeData.branchNodeIds = [];
                }
                sourceNodeData.branchNodeIds.push(connection.targetId);
            },
            onDeleteConnection: function (connection, sourceNodeData) {
                var index = sourceNodeData.branchNodeIds.indexOf(connection.targetId);
                if (index > -1) {
                    sourceNodeData.branchNodeIds.splice(index, 1);
                }                

            }
        },
        pastTimeNode: {
            label: 'past time',
            title: 'When entered while timeout has passed',
            maxConnections: 1
        }        
    },

    settingEnabled: true,

    initSettingForm: function (form) {

        JBApp.initStandardGoalSettingControls(form);

        form.forms({
            allowPostForm: false,
            onValid: function () {
                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        JBApp.showSettingPanel(node);
    }
};
