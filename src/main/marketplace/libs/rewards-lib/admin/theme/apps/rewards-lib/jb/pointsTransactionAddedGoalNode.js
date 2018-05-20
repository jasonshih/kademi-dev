JBNodes['pointsTransactionAddedGoal'] = {
    icon: 'fa fa-exclamation',
    title: 'Points Transaction Added',
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
                '        <label>Tag Name</label>' +
                '        <input type="text" name="tagName" class="form-control" placeholder="Name of the tag to trigger" />' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Reason Code</label>' +
                '        <input type="text" name="reasonCode" class="form-control" placeholder="Code of the reason to trigger" />' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <div class="checkbox">' +
                '           <label>' +
                '               <input type="checkbox" name="debit" class="plain-text">' +
                '               On Debit Transactions' +
                '           </label>' +
                '        </div>' +
                '        <small class="text-muted help-block">If set, goal will trigger on debit transactions</small>' +
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
                    if (resp[i].name !== "points" && resp[i].name !== "points-buckets") {
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
                JBApp.currentSettingNode.tagName = form.find('[name = "tagName" ]').val() || null;
                JBApp.currentSettingNode.reasonCode = form.find('[name = "reasonCode" ]').val() || null;
                JBApp.currentSettingNode.debit = form.find('[name = "debit" ]').prop("checked");

                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },

    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        form.find('[name = "rewardName" ]').val(node.rewardName !== null ? node.rewardName : '');
        form.find('[name = "tagName" ]').val(node.tagName !== null ? node.tagName : '');
        form.find('[name = "reasonCode" ]').val(node.reasonCode !== null ? node.reasonCode : '');
        form.find('[name = "debit" ]').prop("checked", node.debit !== null ? node.debit : false);
        JBApp.showSettingPanel(node);
    }
};