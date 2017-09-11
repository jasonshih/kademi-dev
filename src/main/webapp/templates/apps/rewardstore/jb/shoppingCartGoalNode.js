JBNodes['shoppingCartGoal'] = {
    icon: 'fa fa-shopping-cart',
    title: 'Shopping Cart Goal',
    type: JB_NODE_TYPE.GOAL,

    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nodeIdAddedToCart: {
            label: 'added to cart',
            title: 'When item added to cart',
            maxConnections: 1
        },
        nodeIdCheckoutComplete: {
            label: 'checkout complete',
            title: 'When checkout complete',
            maxConnections: 1
        },
        nodeIdPaymentPending: {
            label: 'payment pending',
            title: 'When payment pending',
            maxConnections: 1
        },
        pastTimeNode: {
            label: 'past time',
            title: 'When entered while timeout has passed',
            maxConnections: 1
        }
    },

    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(JBApp.standardGoalSettingControls);

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
