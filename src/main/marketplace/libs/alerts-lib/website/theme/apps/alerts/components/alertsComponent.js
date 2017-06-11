(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['alerts'] = {
        settingEnabled: true,
        settingTitle: 'Alerts Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "pageBody" component');
            return $.ajax({
                url: '_components/alerts?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "alerts" component');

            var self = this;
        }
    };

})(jQuery);