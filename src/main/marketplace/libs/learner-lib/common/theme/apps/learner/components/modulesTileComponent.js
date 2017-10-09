(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['modulesTile'] = {
        settingEnabled: true,

        settingTitle: 'Modules Tile Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "modulesTile" component', form, keditor);

            return $.ajax({
                url: '_components/modulesTile?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.txt-number-of-modules').on('change', function () {
                        var number = this.value;
                        
                        if (isNaN(number) || +number < 0) {
                            number = 0;
                            this.value = number;
                        }
                        
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-number-of-modules', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-tile-size').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-tile-size', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "modulesTile" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-tile-size').val(dataAttributes['data-tile-size'] || 'col-sm-6');
            form.find('.txt-number-of-modules').val(dataAttributes['data-number-of-modules'] || '0');
        }
    };

})(jQuery);