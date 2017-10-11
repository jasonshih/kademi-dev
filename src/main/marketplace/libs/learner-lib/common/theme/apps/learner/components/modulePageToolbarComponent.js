(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['modulePageToolbar'] = {
        settingEnabled: true,
        
        settingTitle: 'Module Toolbar',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "modulePageToolbar" component', form, keditor);
            
            return $.ajax({
                url: '_components/modulePageToolbar?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.select-align').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-align', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "modulePageToolbar" component', form, component, keditor);
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            
            form.find('.select-align').val(dataAttributes['data-align'] || 'text-right');
        }
    };
    
})(jQuery);