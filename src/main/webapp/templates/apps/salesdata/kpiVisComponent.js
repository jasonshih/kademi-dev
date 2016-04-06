(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['kpiVis'] = {
        init: function (contentArea, container, component, options) {
            $.getScriptOnce('/theme/apps/salesdata/jquery.kpiVis.js', function () {
                
            });
        },
        getContent: function (component, options) {
            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },
        destroy: function (component, options) {
            // Do nothing
        },
        settingEnabled: true,
        settingTitle: 'KPI Visualisation Settings',
        initSettingForm: function (form, options) {

        },
        showSettingForm: function (form, component, options) {
        },
        hideSettingForm: function (form) {
            // Do nothing
        }
    };

})(jQuery);