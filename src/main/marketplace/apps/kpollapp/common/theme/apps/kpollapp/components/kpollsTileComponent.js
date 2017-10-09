(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['kpollsTile'] = {
        settingEnabled: true,

        settingTitle: 'Kpolls Tile Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "kpollsTile" component', form, keditor);

            return $.ajax({
                url: '_components/kpollsTile?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.txt-number-of-polls').on('change', function () {
                        var number = this.value;
                        
                        if (isNaN(number) || +number < 0) {
                            number = 0;
                            this.value = number;
                        }
                        
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-number-of-polls', number);
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
            flog('showSettingForm "kpollsTile" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-tile-size').val(dataAttributes['data-tile-size'] || 'col-sm-6');
            form.find('.txt-number-of-polls').val(dataAttributes['data-number-of-polls'] || '0');
        }
    };

})(jQuery);