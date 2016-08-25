JBNodes['eventGoal'] = {
    title: '<i class="fa fa-trophy"></i> <span class="node-type">Event Goal</span>',
    previewUrl: '/theme/apps/email/jb/eventGoalNode.png',
    ports: {
        nextNodeId: {
            label: 'then',
            title: 'When complete',
            maxConnections: 1
        },
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        }
    },

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
            '</div>' +
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Timeout</label>' +
            '        <div class="input-group">' +
            '            <input type="number" class="form-control timeout-multiples numeric" />' +
            '            <div class="input-group-btn">' +
            '                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="timeout-units-preview"></span>' +
            '                    <span class="caret"></span>' +
            '                </button>' +
            '                <input type="hidden" class="timeout-units" value="" />' +
            '                <ul class="dropdown-menu dropdown-menu-right timeout-units-selector">' +
            '                    <li><a href="#" data-value="y">Years</a></li>' +
            '                    <li><a href="#" data-value="M">Months</a></li>' +
            '                    <li><a href="#" data-value="w">Weeks</a></li>' +
            '                    <li><a href="#" data-value="d">Days</a></li>' +
            '                    <li><a href="#" data-value="h">Hours</a></li>' +
            '                    <li><a href="#" data-value="m">Minutes</a></li>' +
            '                </ul>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>'
        );

        form.find('.timeout-units-selector li').on('click', function (e) {
            e.preventDefault();

            var a = $(this).find('a');
            var text = a.text().trim();
            var value = a.attr('data-value');

            form.find('.timeout-units').val(value);
            form.find('.timeout-units-preview').html(text);
        });

        form.forms({
            allowPostForm: false,
            onValid: function () {
                var timeoutUnits = form.find('.timeout-units').val();
                var timeoutMultiples = form.find('.timeout-multiples').val();
                var triggerTypeId = form.find('.triggerTypeId').val();
                var condition1 = form.find('.condition1').val();
                var condition2 = form.find('.condition2').val();
                var condition3 = form.find('.condition3').val();
                var condition4 = form.find('.condition4').val();

                JBApp.currentSettingNode.timeoutUnits = timeoutUnits || null;
                JBApp.currentSettingNode.timeoutMultiples = timeoutMultiples || null;
                JBApp.currentSettingNode.triggerTypeId = triggerTypeId || null;
                JBApp.currentSettingNode.condition1 = condition1 || null;
                JBApp.currentSettingNode.condition2 = condition2 || null;
                JBApp.currentSettingNode.condition3 = condition3 || null;
                JBApp.currentSettingNode.condition4 = condition4 || null;
                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        if (node.timeoutUnits !== null) {
            form.find('.timeout-units-selector li a').filter('[data-value=' + node.timeoutUnits + ']').trigger('click');
        } else {
            form.find('.timeout-units').val('');
            form.find('.timeout-units-preview').html('');
        }

        form.find('.timeout-multiples').val(node.timeoutMultiples !== null ? node.timeoutMultiples : '');
        form.find('.triggerTypeId').val(node.triggerTypeId !== null ? node.triggerTypeId : '');
        form.find('.condition1').val(node.condition1 !== null ? node.condition1 : '');
        form.find('.condition2').val(node.condition2 !== null ? node.condition2 : '');
        form.find('.condition3').val(node.condition3 !== null ? node.condition3 : '');
        form.find('.condition4').val(node.condition4 !== null ? node.condition4 : '');
        JBApp.showSettingPanel(node);
    }
};
