(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['profileUnsub'] = {
        initDateAgg: function () {
            flog('profileUnsub');
        },
        settingEnabled: true,
        settingTitle: 'Profile Unsubscribe Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "profileUnsub" component');

            return $.ajax({
                url: '_components/profileUnsub?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                }
            });
        },
        initSelect: function (aggsSelect, selectedQuery, selectedAgg) {
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "profileUnsub" component');

            var self = this;
        }
    };

})(jQuery);