(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['profileOptins'] = {
        initDateAgg: function () {
            flog('profileOptins');
        },
        settingEnabled: true,
        settingTitle: 'Profile Opt-ins Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "profileOptins" component');

            return $.ajax({
                url: '_components/profileOptins?settings',
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
            flog('showSettingForm "profileOptins" component');

            var self = this;
        }
    };

})(jQuery);