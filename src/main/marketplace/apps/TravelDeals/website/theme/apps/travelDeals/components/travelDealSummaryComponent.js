(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['travelDealSummary'] = {
        settingEnabled: true,
        settingTitle: 'Travel Deal Summary Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "travelDealSummary" component');

            return $.ajax({
                url: '_components/travelDealSummary?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.traveldeals-summary-title').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-traveldeals-summary-title', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "travelDealSummary" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.traveldeals-summary-title').val(dataAttributes['data-traveldeals-summary-title'] || 'Details');
        }
    };

})(jQuery);