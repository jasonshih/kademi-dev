(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    var win = $(this);
    
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
                        
                        form.find('.search-when-init-wrapper').css('display', this.checked ? 'block' : 'none');
                    });
                    
                    form.find('.txt-query-name').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-query-name', this.value || 'query');
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            window.initOrgsLocator(component.find('.orgs-locator-component'));
                        });
                    });
                    
                    form.find('.txt-lat-name').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-lat-name', this.value || 'lat');
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            window.initOrgsLocator(component.find('.orgs-locator-component'));
                        });
                    });
                    
                    form.find('.txt-lng-name').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-lng-name', this.value || 'lng');
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
            form.find('.txt-query-name').val(dataAttributes['data-query-name'] || 'query');
            form.find('.txt-lat-name').val(dataAttributes['data-lat-name'] || 'lat');
            form.find('.txt-lng-name').val(dataAttributes['data-lng-name'] || 'lng');
            form.find('.chk-search-when-init').prop('checked', dataAttributes['data-search-when-init'] === 'true');
            
            form.find('.search-when-init-wrapper').css('display', dataAttributes['data-search-when-init'] === 'true' ? 'block' : 'none');
        }
    };
    
})(jQuery);