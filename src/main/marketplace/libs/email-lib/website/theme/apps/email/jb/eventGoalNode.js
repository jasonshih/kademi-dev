JBNodes['eventGoal'] = {
    icon: 'fa fa-exclamation',
    title: 'Event Goal',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/email/jb/eventGoalNode.png',
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

    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Trigger type</label>' +
            '        <select class="form-control triggerTypeId">' +
            '            <option value="">[No trigger type selected]</option>' +
            '            <option value="calendar-event">calendar-event</option>' +
            '            <option value="newComment">newComment</option>' +
            '            <option value="voted">voted</option>' +
            '            <option value="voteReceived">voteReceived</option>' +
            '            <option value="subscription">subscription</option>' +
            '            <option value="trigger">trigger</option>' +
            '            <option value="emailDelivery">emailDelivery</option>' +
            '            <option value="emailReceived">emailReceived</option>' +
            '            <option value="userVisit">userVisit</option>' +
            '            <option value="contact">contact</option>' +
            '            <option value="learnerProgress">learnerProgress</option>' +
            '            <option value="moduleProgress">moduleProgress</option>' +
            '            <option value="rewardGranted">rewardGranted</option>' +
            '            <option value="quizAttempt">quizAttempt</option>' +
            '            <option value="pointsExpired">pointsExpired</option>' +
            '            <option value="referral">referral</option>' +
            '            <option value="auctionClosed">auctionClosed</option>' +
            '            <option value="auctionBid">auctionBid</option>' +
            '            <option value="shoppingCart">shoppingCart</option>' +
            '            <option value="pipelineProcess">pipelineProcess</option>' +
            '            <option value="payment">payment</option>' +
            '            <option value="goal">goal</option>' +
            '        </select>' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Condition #1</label>' +
            '        <input type="text" class="form-control condition1" value="" />' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Condition #2</label>' +
            '        <input type="text" class="form-control condition2" value="" />' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Condition #3</label>' +
            '        <input type="text" class="form-control condition3" value="" />' +
            '    </div>' +
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Condition #4</label>' +
            '        <input type="text" class="form-control condition4" value="" />' +
            '    </div>' +
            '</div>' + JBApp.standardGoalSettingControls
        );

        JBApp.initStandardGoalSettingControls(form);

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var triggerTypeId = form.find('.triggerTypeId').val();
                var condition1 = form.find('.condition1').val();
                var condition2 = form.find('.condition2').val();
                var condition3 = form.find('.condition3').val();
                var condition4 = form.find('.condition4').val();
                JBApp.currentSettingNode.triggerTypeId = triggerTypeId || null;
                JBApp.currentSettingNode.condition1 = condition1 || null;
                JBApp.currentSettingNode.condition2 = condition2 || null;
                JBApp.currentSettingNode.condition3 = condition3 || null;
                JBApp.currentSettingNode.condition4 = condition4 || null;

                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);

        form.find('.triggerTypeId').val(node.triggerTypeId !== null ? node.triggerTypeId : '');
        form.find('.condition1').val(node.condition1 !== null ? node.condition1 : '');
        form.find('.condition2').val(node.condition2 !== null ? node.condition2 : '');
        form.find('.condition3').val(node.condition3 !== null ? node.condition3 : '');
        form.find('.condition4').val(node.condition4 !== null ? node.condition4 : '');

        JBApp.showSettingPanel(node);
    }
};
