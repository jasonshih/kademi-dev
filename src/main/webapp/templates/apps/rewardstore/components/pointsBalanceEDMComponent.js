(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['pointsBalanceEDM'] = {
        settingEnabled: true,

        settingTitle: 'Points Balance Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "pointsBalanceEDM" component', form, keditor);

            return $.ajax({
                url: '_components/pointsBalanceEDM?settings',
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

                    var colorPicker = form.find('.color-picker');
                    initColorPicker(colorPicker, function (color) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var bgColor = '';

                        if (color && color !== 'transparent') {
                            bgColor = color;
                        }

                        component.attr('data-bgcolor', bgColor);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "pointsBalanceEDM" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-store').val(dataAttributes['data-store']);
            var colorPicker = form.find('.color-picker');
            colorPicker.colorpicker('setValue', dataAttributes['data-bgcolor'] || 'transparent');
        }
    };

})(jQuery);