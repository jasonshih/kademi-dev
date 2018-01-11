(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['assetQueryList'] = {
        settingEnabled: true,
        settingTitle: 'Asset Query Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "assetQueryList" component');

            return $.ajax({
                url: '_components/assetQueryList?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('#asset-query-select').on('click', function (e) {
                        var comp = keditor.getSettingComponent();
                        comp.attr('data-query', this.value);
                        var dynamicElement = comp.find('[data-dynamic-href]');
                        keditor.initDynamicContent(dynamicElement);
                    });

                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "assetQueryList" component');
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('#asset-query-select').val(dataAttributes['data-query'])
        }
    };

})(jQuery);