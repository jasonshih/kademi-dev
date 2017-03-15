JBNodes['moduleProgressGoal'] = {
    icon: 'fa fa-graduation-cap',
    title: 'Module progress',
    type: JB_NODE_TYPE.GOAL,
    previewUrl: '/theme/apps/learning/jb/moduleProgressGoalNode.png',
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
                '        <label>Website</label>' +
                '        <input type="text" class="form-control website-name" value="" />' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Program</label>' +
                '        <input type="text" class="form-control program-code" value="" />' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Course</label>' +
                '        <input type="text" class="form-control course-code" value="" />' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Module</label>' +
                '        <input type="text" class="form-control module-code" value="" />' +
                '    </div>' +
                '</div>' +
                '<div class="form-group">' +
                '    <div class="col-md-12">' +
                '        <label>Action</label>' +
                '        <input type="text" class="form-control module-action" value="" />' +
                '    </div>' +
                '</div>' +
                +JBApp.standardGoalSettingControls
                );

        JBApp.initStandardGoalSettingControls(form);

        form.forms({
            allowPostForm: false,
            onValid: function () {
                JBApp.currentSettingNode.websiteName = formVal(form, "website-name");
                JBApp.currentSettingNode.programCode = formVal(form, "program-code");
                JBApp.currentSettingNode.courseCode = formVal(form, "course-code");
                JBApp.currentSettingNode.moduleCode = formVal(form, "module-code");
                JBApp.currentSettingNode.action = formVal(form, "module-action");

                JBApp.saveStandardGoalSetting(form);

                JBApp.saveFunnel('Funnel is saved');
                JBApp.hideSettingPanel();
            }
        });
    },
    showSettingForm: function (form, node) {
        JBApp.showStandardGoalSettingControls(form, node);
        form.find('.website-name').val(node.websiteName !== null ? node.websiteName : '');
        form.find('.program-code').val(node.programCode !== null ? node.programCode : '');
        form.find('.course-code').val(node.courseCode !== null ? node.courseCode : '');
        form.find('.module-code').val(node.moduleCode !== null ? node.moduleCode : '');
        form.find('.module-action').val(node.action !== null ? node.action : '');

        JBApp.showSettingPanel(node);
    }
};


function formVal(form, name) {
    var s = form.find("." + name).val();
    if (s == null) {
        s = "";
    }
    return s;
}
