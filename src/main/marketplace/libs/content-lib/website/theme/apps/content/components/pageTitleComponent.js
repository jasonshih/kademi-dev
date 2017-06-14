(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['pageTitle'] = {
        settingEnabled: true,
        settingTitle: 'Page Title Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "pageTitle" component');

            return $.ajax({
                url: '_components/pageTitle?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('[name=tag]').on('change', function (e) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-tag', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "pageTitle" component');
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('[name=tag]').val(dataAttributes['data-tag']);
        }
    };

})(jQuery);