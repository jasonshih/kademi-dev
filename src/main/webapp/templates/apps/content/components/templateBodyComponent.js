(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['templateBody'] = {
        settingEnabled: true,
        settingTitle: 'Template Body Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "templateBody" component');

            return $.ajax({
                url: '_components/templateBody?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "templateBody" component');

            var self = this;
        }
    };

})(jQuery);