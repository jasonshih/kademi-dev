(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['websiteList'] = {
        init: function (contentArea, container, component, options) {
            // Do nothing
        },

        getContent: function (component, options) {
            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },

        destroy: function (component, options) {
            // Do nothing
        },

        settingEnabled: true,

        settingTitle: 'Website List Settings',

        initSettingForm: function (form, options) {

        },

        showSettingForm: function (form, component, options) {
        },

        hideSettingForm: function (form) {
            // Do nothing
        }
    };

})(jQuery);