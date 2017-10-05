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
                    
                    form.find('.select-calendar').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var calendars = [];
                        var colors = [];
                        form.find('.select-calendar').each(function () {
                           if (this.checked){
                               calendars.push(this.value);
                           }
                        });

                        component.attr('data-calendars', calendars.join(','));
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "multiCalendars" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-calendar').each(function () {
                if (dataAttributes['data-calendars'].indexOf(this.value) != -1){
                    this.checked = true;
                }
            });
        }
    };
    
})(jQuery);