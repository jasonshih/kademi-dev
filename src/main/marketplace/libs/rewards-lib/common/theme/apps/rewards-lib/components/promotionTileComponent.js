(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['promotionTile'] = {
        settingEnabled: true,

        settingTitle: 'Promotion Tile Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "promotionTile" component');

            return $.ajax({
                url: '_components/promotionTile?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.featured').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var arr = [];
                        form.find('.featured').each(function () {
                            if (this.checked){
                                arr.push(this.value);
                            }
                        });
                        component.attr('data-featured', arr.join(','));
                        keditor.initDynamicContent(dynamicElement);
                    });

                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "promotionTile" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.featured').each(function () {
                if (dataAttributes['data-featured'] && dataAttributes['data-featured'].indexOf(this.value) != -1){
                    this.checked = true;
                }
            });
        }
    };

})(jQuery);