(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['taskList'] = {
        init: function (contentArea, container, component, keditor) {
            // Do nothing
        },

        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },

        destroy: function (component, keditor) {
            // Do nothing
        },

        settingEnabled: true,

        settingTitle: 'Task List Settings',

        initSettingForm: function (form, keditor) {
            // TODO: settings
        },

        showSettingForm: function (form, component, keditor) {
            // TODO
        },

        hideSettingForm: function (form, keditor) {
            
        }
    };

})(jQuery);