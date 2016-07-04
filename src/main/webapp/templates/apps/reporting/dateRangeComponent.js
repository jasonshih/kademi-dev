(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['dateRange'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "dateRange component', contentArea, container, component, keditor);

            var self = this;
        },

        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },

        destroy: function (component, keditor) {
            // Do nothing
        },

        settingEnabled: true,

        settingTitle: 'Date Range Settings',

        initKpiVis: function () {
            flog('dateRange');
        },

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "dateRange" component');
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "dateRange" component');
        },

        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);