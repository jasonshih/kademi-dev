(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['dynamicMediaAsset'] = {
        settingEnabled: true,
        settingTitle: 'Dynamic Media Asset',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "dynamicMediaAsset" component');

            return $.ajax({
                url: '_components/dynamicMediaAsset?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('[name=assetField]').on('change', function (e) {
                        flog("changed");
                        var comp = keditor.getSettingComponent();
                        comp.attr('data-asset-field', this.value);
                        var dynamicElement = comp.find('[data-dynamic-href]');
                        keditor.initDynamicContent(dynamicElement);
                    });

                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "dynamicMediaAsset" component');
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('[name=assetField]').val(dataAttributes['data-asset-field'])
        }
    };

})(jQuery);