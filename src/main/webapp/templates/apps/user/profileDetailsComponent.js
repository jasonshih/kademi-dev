(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['pageBody'] = {
        initDateAgg: function () {
            flog('pageBody');
        },
        settingEnabled: true,
        settingTitle: 'Page Body Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "pageBody" component');

            var self = this;

            $.ajax({
                url: '_components/pageBody?settings',
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
            flog('showSettingForm "pageBody" component');

            var self = this;
        }
    };

})(jQuery);