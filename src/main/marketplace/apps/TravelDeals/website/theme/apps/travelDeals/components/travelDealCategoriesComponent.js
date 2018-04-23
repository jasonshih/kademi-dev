(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['travelDealCategories'] = {
        settingEnabled: true,
        settingTitle: 'Travel Deal Categories Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "travelDealCategories" component');

            return $.ajax({
                url: '_components/travelDealCategories?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.traveldeals-cat-title').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-traveldeals-cat-title', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.traveldeals-cat-show-count').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        if (this.value == 'true') {
                            form.find('.traveldeals-cat-count-style-wrapper').show();
                        } else {
                            form.find('.traveldeals-cat-count-style-wrapper').hide();
                        }

                        component.attr('data-traveldeals-cat-show-count', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.traveldeals-cat-count-style').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-traveldeals-cat-count-style', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "travelDealCategories" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.traveldeals-cat-title').val(dataAttributes['data-traveldeals-cat-title'] || 'Categories');
            form.find('.traveldeals-cat-show-count').val(dataAttributes['data-traveldeals-cat-show-count'] || 'true').trigger('change');
            form.find('.traveldeals-cat-count-style').val(dataAttributes['data-traveldeals-cat-count-style'] || 'default');
        }
    };

})(jQuery);