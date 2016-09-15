(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['pointsActivity'] = {
        settingEnabled: true,
        settingTitle: 'Points Activity Settings',
        initSettingForm: function (form, keditor) {
            $.ajax({
                url: '_components/pointsActivity?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.pointsActivityBucket').on('change', function () {
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

                    form.find('.pointsActivityDays').on('change', function () {
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

                    form.find('.pointsActivityHeight').on('change', function () {
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
            flog('showSettingForm "pointsActivity" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.pointsActivityBucket').val(dataAttributes['data-bucket']);
            form.find('.pointsActivityDays').val(dataAttributes['data-days']);
            form.find('.pointsActivityHeight').val(dataAttributes['data-height']);
        }
    };

})(jQuery);