(function ($) {
    var KEditor = $.keditor;
    var edmEditor = $.edmEditor;
    var flog = KEditor.log;

    KEditor.components['pointsEarnedEDM'] = {
        settingEnabled: true,

        settingTitle: 'Points Earned Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "pointsEarnedEDM" component', form, keditor);

            return $.ajax({
                url: '_components/pointsEarnedEDM?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-store').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-store', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.num-months').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 0) {
                            number = 1;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-months', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    var colorPicker = form.find('.color-picker');
                    edmEditor.initSimpleColorPicker(colorPicker, function (color) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-bgcolor', color);
                        keditor.initDynamicContent(dynamicElement);
                    });

                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "pointsEarnedEDM" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-store').val(dataAttributes['data-store']);
            form.find('.num-months').val(dataAttributes['data-months']);
            form.find('.txt-height').val(dataAttributes['data-height']);
            form.find('.color-picker').val(dataAttributes['data-bgcolor'] || '').trigger('update');
        }
    };

})(jQuery);