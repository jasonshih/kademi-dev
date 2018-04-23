(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['travelDealTags'] = {
        settingEnabled: true,
        settingTitle: 'Travel Deal Tags Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "travelDealTags" component');

            return $.ajax({
                url: '_components/travelDealTags?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.traveldeals-tags-only-related').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-traveldeals-tags-only-related', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "travelDealTags" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.traveldeals-tags-only-related').val(dataAttributes['data-traveldeals-tags-only-related'] || 'true');
        }
    };

})(jQuery);