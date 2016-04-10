(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['blogArticleList'] = {
        init: function (contentArea, container, component, options) {
        },
        getContent: function (component, options) {
            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },
        destroy: function (component, options) {
            // Do nothing
        },
        settingEnabled: true,
        settingTitle: 'Blog Article List Settings',
        initSettingForm: function (form, options) {

        },
        showSettingForm: function (form, component, options) {
        },
        hideSettingForm: function (form) {
            // Do nothing
        }
    };

})(jQuery);