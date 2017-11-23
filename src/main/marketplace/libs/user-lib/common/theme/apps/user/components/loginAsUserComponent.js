(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['loginAsUser'] = {
        settingEnabled: true,
        settingTitle: 'Login as User Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "loginAsUser" component');

            return $.ajax({
                url: '_components/loginAsUser?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.loginas-website').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-loginas-website', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "loginAsUser" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);

            form.find('.loginas-website').val(dataAttributes['data-loginas-website'] || '');
        }
    };

})(jQuery);