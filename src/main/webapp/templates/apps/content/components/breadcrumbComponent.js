(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['breadcrumb'] = {
        settingEnabled: true,
        settingTitle: 'Breadcrumb Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "breadcrumb" component');
            
            return $.ajax({
                url: '_components/breadcrumb?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('[name=inverse]').on('click', function (e) {
                        var comp = keditor.getSettingComponent();
                        comp.attr('data-inverse', this.value);
                        var dynamicElement = comp.find('[data-dynamic-href]');
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "pageTitle" component');
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('[name=inverse][value=true]').prop('checked', dataAttributes['data-inverse'] === 'true');
        }
    };
    
})(jQuery);