(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['orgsLocator'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "orgsLocator" component', component);

            var componentContent = component.children('.keditor-component-content');
            var dynamicElement = componentContent.find('[data-dynamic-href]');

            keditor.initDynamicContent(dynamicElement).done(function () {
                var orgsLocator = component.find('.orgs-locator-component');
                window.initOrgsLocator(orgsLocator);
            });
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

                    form.find('.chk-orgtypes-only').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-selected-types-only', this.checked);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            window.initOrgsLocator(component.find('.orgs-locator-component'));
                        });
                    });

                    form.find('.chk-org-type').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var arr = [];
                        form.find('.chk-org-type').each(function () {
                            if (this.checked){
                                arr.push(this.value);
                            }
                        });
                        component.attr('data-org-types', arr.join(','));
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            window.initOrgsLocator(component.find('.orgs-locator-component'));
                        });
                    });

                    var distance = form.find('.distance');
                    distance.on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-distance', this.value);
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
            form.find('.chk-orgtypes-only').prop('checked', dataAttributes['data-selected-types-only'] === 'true');
            var arr = (dataAttributes['data-org-types'] || '').split(',');
            form.find('.chk-org-type').each(function () {
                if (arr.indexOf(this.value) != -1){
                    this.checked = true;
                }
            });
            form.find('.distance').val(dataAttributes['data-distance'] || 50);
        }
    };
    
})(jQuery);