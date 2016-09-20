(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['debitsActivity'] = {
        settingEnabled: true,
        settingTitle: 'Debits Activity Settings',
        initSettingForm: function (form, keditor) {
            return $.ajax({
                url: '_components/debitsActivity?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.debitsActivityBucket').on('change', function () {
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

                    form.find('.debitsActivityDays').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 1) {
                            number = 1;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-days', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.debitsActivityHeight').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 99) {
                            number = 100;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-height', number);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "debitsActivity" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.debitsActivityBucket').val(dataAttributes['data-bucket']);
            form.find('.debitsActivityDays').val(dataAttributes['data-days']);
            form.find('.debitsActivityHeight').val(dataAttributes['data-height']);
        }
    };

})(jQuery);