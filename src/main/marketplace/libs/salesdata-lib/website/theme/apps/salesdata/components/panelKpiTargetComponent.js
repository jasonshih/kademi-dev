(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['panelKpiTarget'] = {
        settingEnabled: true,
        settingTitle: 'Target Panel',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "panelKpiTarget" component');
            
            return $.ajax({
                url: '_components/panelKpiTarget?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.select-kpi').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-kpi', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "panelKpiTarget" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-kpi').val(dataAttributes['data-kpi']);
        }
    };
    
})(jQuery);