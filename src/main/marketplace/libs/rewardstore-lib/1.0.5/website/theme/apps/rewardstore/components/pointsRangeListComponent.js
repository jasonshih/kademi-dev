(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['pointsRangeList'] = {
        settingEnabled: true,
        settingTitle: 'Points Ranges',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "pointsRangeList" component');

            return $.ajax({
                url: '_components/pointsRangeList?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('[name=ranges]').on('change', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-ranges', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "pointsRangeList" component');
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('[name=ranges]').val(dataAttributes['data-ranges']);
        }
    };

})(jQuery);