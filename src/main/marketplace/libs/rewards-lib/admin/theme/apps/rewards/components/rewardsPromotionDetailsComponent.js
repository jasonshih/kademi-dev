(function ($) {
    var KEditor = $.keditor;
    var edmEditor = $.edmEditor;
    var flog = KEditor.log;

    KEditor.components['rewardsPromotionDetails'] = {
        settingEnabled: true,

        settingTitle: 'Promotion Details Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "rewardsPromotionDetails" component', form, keditor);

            return $.ajax({
                url: '_components/rewardsPromotionDetails?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.rewards-select-promotion').on('change', function () {
                        var component = keditor.getSettingComponent();
                        component.attr('data-rewards-select-promotion', this.value);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "rewardsPromotionDetails" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.rewards-select-promotion').val(dataAttributes['data-rewards-select-promotion']);
        }
    };

})(jQuery);