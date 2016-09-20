(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['profileAvatar'] = {
        settingEnabled: true,
        settingTitle: 'Profile Avatar Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "profileAvatar" component');

            return $.ajax({
                url: '_components/profileAvatar?settings',
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
            flog('showSettingForm "profileAvatar" component');

            var self = this;
        }
    };

})(jQuery);