(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['multiCalendars'] = {
        settingEnabled: true,
        
        settingTitle: 'Calendar Event Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "multiCalendars" component');
            
            return $.ajax({
                url: '_components/multiCalendars?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.select-calendar').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-calendar', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "multiCalendars" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-calendar').val(dataAttributes['data-calendar']);
        }
    };
    
})(jQuery);