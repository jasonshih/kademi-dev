(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['selectedOrganisation'] = {
        settingEnabled: true,
        
        settingTitle: 'Selected Organisation Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "selectedOrganisation" component');
            
            return $.ajax({
                url: '_components/selectedOrganisation?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.chk-enable-link').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
    
                        component.attr('data-enable-link', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "selectedOrganisation" component');
    
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.chk-enable-link').prop('checked', dataAttributes['data-enable-link'] === 'true');
        }
    };
    
})(jQuery);