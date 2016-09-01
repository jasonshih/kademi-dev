(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['menu'] = {
        settingEnabled: true,
        settingTitle: 'Menu Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "menu" component');

            var self = this;

            $.ajax({
                url: '_components/menu?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "menu" component');

            var self = this;
        }
    };

})(jQuery);