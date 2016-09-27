(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['userPanel'] = {
        settingEnabled: true,
        settingTitle: 'User Panel Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "userPanel" component');

            return $.ajax({
                url: '_components/userPanel?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-reward').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-reward', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    })
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "userPanel" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-reward').val(dataAttributes['data-reward'] || '');
        }
    };

})(jQuery);