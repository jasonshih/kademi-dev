JBNodes['kfeedbackSubmittedGoal'] = {
    icon: 'fa fa-trophy',
    title: 'KFeedback Submit Goal',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/kfeedback/jb/kfeedbackSubmittedGoalNode.png',
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

    settingEnabled: false,

    initSettingForm: function (form) {
    },

    showSettingForm: function (form, node) {
    }
};
