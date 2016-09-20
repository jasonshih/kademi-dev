(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['topBalances'] = {
        settingEnabled: true,
        settingTitle: 'Top Balances Settings',
        initSettingForm: function (form, keditor) {
            return $.ajax({
                url: '_components/topBalances?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.top-balances-bucket').on('change', function () {
                        var selectedBucket = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        if (selectedBucket) {
                            component.attr('data-bucket', selectedBucket);
                            keditor.initDynamicContent(dynamicElement);
                        } else {
                            dynamicElement.html('<p>Please select a points bucket</p>');
                        }
                    });

                    form.find('.top-balances-limit').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 1) {
                            number = 1;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-limit', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.top-balances-height').on('change', function () {
                        var number = this.value;

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-height', number);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "topBalances" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.top-balances-bucket').val(dataAttributes['data-bucket']);
            form.find('.top-balances-limit').val(dataAttributes['data-limit']);
            form.find('.top-balances-height').val(dataAttributes['data-height']);
        }
    };

})(jQuery);