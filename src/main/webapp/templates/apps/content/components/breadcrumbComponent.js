(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['breadcrumb'] = {
        settingEnabled: true,
        settingTitle: 'Breadcrumb Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "breadcrumb" component');

            $.ajax({
                url: '_components/breadcrumb?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    var paddingSettings = form.find('.paddingSettings');
                    paddingSettings.on('change', function () {
                        var paddingValue = this.value || '';
                        var component = keditor.getSettingComponent();
                        var paddingProp = $(this).attr('name');
                        if (paddingValue.trim() === '') {
                            component.find('ol').css(paddingProp, '');
                        } else {
                            if (isNaN(paddingValue)) {
                                paddingValue = 0;
                                this.value = paddingValue;
                            }
                            component.find('ol').css(paddingProp, paddingValue + 'px');
                        }
                        component.attr('data-style', component.find('ol').attr('style'));
                        var dynamicElement = component.find('[data-dynamic-href]');
                        keditor.initDynamicContent(dynamicElement);
                    });

                    var marginSettings = form.find('.marginSettings');
                    marginSettings.on('change', function () {
                        var paddingValue = this.value || '';
                        var component = keditor.getSettingComponent();
                        var paddingProp = $(this).attr('name');
                        if (paddingValue.trim() === '') {
                            component.find('ol').css(paddingProp, '');
                        } else {
                            if (isNaN(paddingValue)) {
                                paddingValue = 0;
                                this.value = paddingValue;
                            }
                            component.find('ol').css(paddingProp, paddingValue + 'px');
                        }
                        component.attr('data-style', component.find('ol').attr('style'));
                        var dynamicElement = component.find('[data-dynamic-href]');
                        keditor.initDynamicContent(dynamicElement);
                    });

                    var buttonColorPicker = form.find('.button-color-picker');
                    initColorPicker(buttonColorPicker, function (color) {
                        var comp = keditor.getSettingComponent();

                        if (color && color !== 'transparent') {
                            comp.find('ol').css('background-color', color);
                        } else {
                            comp.find('ol').css('background-color', '');
                            form.find('ol').val('');
                        }

                        comp.attr('data-style', comp.find('ol').attr('style'));
                        var dynamicElement = comp.find('[data-dynamic-href]');
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=rounded]').on('click', function (e) {
                        var comp = keditor.getSettingComponent();
                        if (this.value == 'false') {
                            comp.find('ol').css('border-radius', '0');
                        } else {
                            comp.find('ol').css('border-radius', '');
                        }

                        comp.attr('data-style', comp.find('ol').attr('style'));
                        var dynamicElement = comp.find('[data-dynamic-href]');
                        keditor.initDynamicContent(dynamicElement);
                    });

                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "pageTitle" component');
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            //component.find('ol').attr('style', dataAttributes['data-style']);
            form.find('.paddingSettings').each(function(){
                $(this).val(component.find('ol').css($(this).attr('name')).replace('px',''));
            });
            form.find('.marginSettings').each(function(){
                $(this).val(component.find('ol').css($(this).attr('name')).replace('px',''));
            });
            var color = component.find('ol').css('background-color');
            if (color.indexOf('rgb') !== -1){
                color = rgb2hex(color);
            }
            form.find('[name=button-color]').val(color).trigger('change');
            form.find('[name=rounded][value=false]').prop('checked', component.find('ol').css('border-radius').replace('px', '') === '0');
        }
    };

    function initColorPicker(target, onChangeHandle) {
        target.each(function () {
            var colorPicker = $(this);
            var input = colorPicker.find('input');
            var previewer = colorPicker.find('.input-group-addon i');

            colorPicker.colorpicker({
                format: 'hex',
                container: colorPicker.parent(),
                component: '.input-group-addon',
                align: 'left',
                colorSelectors: {
                    'transparent': 'transparent'
                }
            }).on('changeColor.colorpicker', function (e) {
                var colorHex = e.color.toHex();

                if (!input.val() || input.val().trim().length === 0) {
                    colorHex = '';
                    previewer.css('background-color', '');
                }

                if (typeof onChangeHandle === 'function') {
                    onChangeHandle(colorHex);
                }
            });

        });
    }

    function rgb2hex(rgb){
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    }

})(jQuery);