(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['profileDetails'] = {
        initDateAgg: function () {
            flog('profileDetails');
        },
        settingEnabled: true,
        settingTitle: 'Profile Details Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "profileDetails" component');

            return $.ajax({
                url: '_components/profileDetails?settings',
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
            flog('showSettingForm "profileDetails" component');

            var self = this;
        }
    };

})(jQuery);