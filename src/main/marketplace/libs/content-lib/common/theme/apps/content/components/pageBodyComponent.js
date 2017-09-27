(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['pageBody'] = {
        settingEnabled: true,
        settingTitle: 'Page Body Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "pageBody" component');

            return $.ajax({
                url: '_components/pageBody?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "pageBody" component');

            var self = this;
        }
    };

})(jQuery);