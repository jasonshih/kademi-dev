(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['profileMemberships'] = {
        initDateAgg: function () {
            flog('profileMemberships');
        },
        settingEnabled: true,
        settingTitle: 'Profile Memberships Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "profileMemberships" component');

            return $.ajax({
                url: '_components/profileMemberships?settings',
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
            flog('showSettingForm "profileMemberships" component');

            var self = this;
        }
    };

})(jQuery);