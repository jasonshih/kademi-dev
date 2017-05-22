(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['portlet'] = {
        settingEnabled: true,
        settingTitle: 'Portlet Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "portlet" component');

            return $.ajax({
                url: '_components/portlet?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "portlet" component');

            var self = this;
        }
    };

})(jQuery);