(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['topSkus'] = {
        settingEnabled: true,
        settingTitle: 'Top Skus',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "topSkus" component');

            return $.ajax({
                url: '_components/topSkus?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    form.find('[name=dataSeriesName]').on('change', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-data-series-name', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=displayedItems]').on('change', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-displayed-items', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "pointsRangeList" component');
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('[name=dataSeriesName]').val(dataAttributes['data-data-series-name']);
            var dataAttribute = dataAttributes['data-displayed-items'];
            if (!dataAttribute) {
                dataAttribute = 10;
            }
            form.find('[name=displayedItems]').val(dataAttribute);
        }
    };

})(jQuery);