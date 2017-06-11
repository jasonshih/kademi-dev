(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['profilePassword'] = {
        initDateAgg: function () {
            flog('profilePassword');
        },
        settingEnabled: true,
        settingTitle: 'Profile Password Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "profilePassword" component');

            return $.ajax({
                url: '_components/profilePassword?settings',
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
            flog('showSettingForm "profilePassword" component');

            var self = this;
        }
    };

})(jQuery);