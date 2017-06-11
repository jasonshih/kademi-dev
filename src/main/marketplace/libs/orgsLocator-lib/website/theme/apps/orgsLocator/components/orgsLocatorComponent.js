(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['orgsLocator'] = {
        settingEnabled: true,

        settingTitle: 'Org/Store locator Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "orgsLocator" component');

            return $.ajax({
                url: '_components/orgsLocator?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                }
            });
        },

        showSettingForm: function (form, component, keditor) {

        }
    };

})(jQuery);