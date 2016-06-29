(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['dateHistogram'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "dateHistogram component', contentArea, container, component, keditor);

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

        settingTitle: 'Date Histogram Settings',

        initKpiVis: function () {
            flog('dateHistogram');
        },

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "dateHistogram" component');

            var self = this;

            $.ajax({
                url: '_components/dateHistogram?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "dateHistogram" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
//            form.find('.select-kpi').val(dataAttributes['data-href']);
//            form.find('.select-type').val(dataAttributes['data-visualisation']);
//            form.find('.kpi-height').val(dataAttributes['data-height']);
        },

        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);