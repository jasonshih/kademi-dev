(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['travelDealsLatestDeals'] = {
        settingEnabled: true,
        settingTitle: 'Latest Travel Deals Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "travelDealsLatestDeals" component');

            return $.ajax({
                url: '_components/travelDealsLatestDeals?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.traveldeals-number-of-deals').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 0) {
                            number = 1;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-traveldeals-number-of-deals', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.traveldeals-select-layout').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-traveldeals-select-layout', this.value);
                        keditor.initDynamicContent(dynamicElement);

                        form.find('.traveldeals-items-per-row-wrapper').css('display', this.value === 'grid' ? 'block' : 'none');
                    });

                    form.find('.traveldeals-items-per-row').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-traveldeals-items-per-row', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "travelDealsLatestDeals" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.traveldeals-number-of-deals').val(dataAttributes['data-traveldeals-number-of-deals'] || 3);
            form.find('.traveldeals-select-layout').val(dataAttributes['data-traveldeals-select-layout'] || 'list').trigger('change');
            form.find('.traveldeals-items-per-row').val(dataAttributes['data-traveldeals-items-per-row'] || 3);
        }
    };

})(jQuery);