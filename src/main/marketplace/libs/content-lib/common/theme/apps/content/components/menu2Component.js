(function ($) {
    var KEditor = $.keditor;
    var contentEditor = $.contentEditor;
    var flog = KEditor.log;

    KEditor.components['menu2'] = {
        settingEnabled: true,
        settingTitle: 'Menu2 Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "menu" component');

            return $.ajax({
                url: '_components/menu?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    contentEditor.initDefaultMenuControls(form, keditor);
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "menu" component');

            contentEditor.showDefaultMenuControls(form, component, keditor);
        }
        
    };

})(jQuery);