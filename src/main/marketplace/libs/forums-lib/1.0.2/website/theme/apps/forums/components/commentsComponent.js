(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['comments'] = {
        settingEnabled: true,
        settingTitle: 'Page Comments Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "comments" component');

            return $.ajax({
                url: '_components/comments?settings',
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
            flog('showSettingForm "comments" component');

            var self = this;
        }
    };

})(jQuery);