JBNodes['pointsValueReachedGoal'] = {
    icon: 'fa fa-exclamation',
    title: 'Points Reached',
    type: JB_NODE_TYPE.GOAL,
    ports: {
        timeoutNode: {
            label: 'timeout',
            title: 'When timeout',
            maxConnections: 1
        },
        nextNodeId: {
            label: 'then',
            title: 'When entered',
            maxConnections: 1
        }
    },

    settingEnabled: true,

    initSettingForm: function (form) {
        form.append(
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Points Bucket</label>' +
            '        <select name="rewardName" class="form-control rewardName"></select>' +
            '    </div>' +
            '</div>' + 
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <label>Points Amount</label>' +
            '        <input type="number" name="pointsAmount" class="form-control" placeholder="Amount of Points to Trigger Goal" />' +
            '    </div>' +
            '</div>' + 
            '<div class="form-group">' +
            '    <div class="col-md-12">' +
            '        <div class="checkbox">' +
            '           <label>' +
            '               <input type="checkbox" name="onCumulative" class="plain-text">' +
            '               On Cumulative Points' +
            '           </label>' +
            '        </div>' +
            '        <small class="text-muted help-block">If set, goal will trigger on total points</small>' +
            '    </div>' +
            '</div>' + JBApp.standardGoalSettingControls
        );

        $.ajax({
            url: '/points-buckets/_DAV/PROPFIND?fields=name,milton:title',
            type: 'get',
            dataType: 'json',
            success: function (resp) {
                var optionsStr = '<option value="">[No points bucket selected]</option>';
                for (var i = 1; i < resp.length; i++) {
                    if( resp[i].name !== "points" && resp[i].name !== "points-buckets") {
                        optionsStr += '<option value="' + resp[i].name + '">' + (resp[i].title === undefined ? resp[i].name : resp[i].title) + '</option>';
                    }
                }

                form.find('.rewardName').html(optionsStr);
            }
        });

        JBApp.initStandardGoalSettingControls(form);

        form.forms({
            allowPostForm: false,
            onValid: function () {
                JBApp.currentSettingNode.rewardName = form.find('[name = "rewardName" ]').val() || null;
                JBApp.currentSettingNode.pointsAmount = form.find('[name = "pointsAmount" ]').val() || null;
                JBApp.currentSettingNode.onCumulative = form.find('[name = "onCumulative" ]').prop("checked");

                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        form.find('[name = "rewardName" ]').val(node.rewardName !== null ? node.rewardName : '');
        form.find('[name = "pointsAmount" ]').val(node.pointsAmount !== null ? node.pointsAmount : '');
        form.find('[name = "onCumulative" ]').prop("checked", node.onCumulative !== null ? node.onCumulative : false);
        JBApp.showSettingPanel(node);
    }
};
