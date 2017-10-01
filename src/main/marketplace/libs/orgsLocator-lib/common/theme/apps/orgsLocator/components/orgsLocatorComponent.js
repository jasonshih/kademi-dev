(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['orgsLocator'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "orgsLocator" component', component);
            
            var orgsLocator = component.find('.orgs-locator-component');
            window.initOrgsLocator(orgsLocator);
        },
        
        settingEnabled: true,
        
        settingTitle: 'Orgs Locator Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "orgsLocator" component');
            
            return $.ajax({
                url: '_components/orgsLocator?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.chk-search-when-init').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-search-when-init', this.checked);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            window.initOrgsLocator(component.find('.orgs-locator-component'));
                        });
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "orgsLocator" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.chk-search-when-init').prop('checked', dataAttributes['data-search-when-init'] === 'true');
        }
    };
    
})(jQuery);