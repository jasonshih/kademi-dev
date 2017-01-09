(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['pointsExpiringEDM'] = {
        settingEnabled: true,

        settingTitle: 'Points Expiring Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "pointsExpiringEDM" component', form, keditor);

            return $.ajax({
                url: '_components/pointsExpiringEDM?settings',
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

                    form.find('.txt-height').on('change', function () {
                        var number = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        if (number === undefined || number === null || number === '') {
                            number = '';
                        } else {
                            if (isNaN(number) || +number <= 100) {
                                number = 100;
                                this.value = number;
                            }
                        }

                        component.attr('data-height', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    var parts = ['header', 'body', 'footer'];

                    $.each(['header', 'body', 'footer'], function (_, part) {
                        var colorPicker = form.find('.color-picker-' + part);
                        initColorPicker(colorPicker, function (color) {
                            var component = keditor.getSettingComponent();
                            var dynamicElement = component.find('[data-dynamic-href]');
                            var bgColor = '';

                            if (color && color !== 'transparent') {
                                bgColor = color;
                            }

                            component.attr('data-' + part + '-bgcolor', bgColor);
                            keditor.initDynamicContent(dynamicElement);
                        });
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "pointsExpiringEDM" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-store').val(dataAttributes['data-store']);
            form.find('.num-months').val(dataAttributes['data-months']);
            var parts = ['header', 'body', 'footer'];
            for (var i = 0; i < parts.length; i++) {
                var colorPicker = form.find('.color-picker-' + parts[i]);
                colorPicker.colorpicker('setValue', dataAttributes['data-' + parts[i] + '-bgcolor'] || 'transparent');
            }
        }
    };

})(jQuery);