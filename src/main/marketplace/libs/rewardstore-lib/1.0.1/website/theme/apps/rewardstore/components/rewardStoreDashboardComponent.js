(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['rewardStoreDashboard'] = {
        settingEnabled: true,

        settingTitle: 'Categories List Setting',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "rewardStoreDashboard" component');

            return $.ajax({
                url: '_components/rewardStoreDashboard?settings',
                type: 'get',
                dataType: 'html',
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
            flog('showSettingForm "rewardStoreDashboard" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-reward').val(dataAttributes['data-reward'] || '');
        }
    };

})(jQuery);
