(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['modulesList'] = {
        settingEnabled: true,
        
        settingTitle: 'Modules List Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "modulesList" component', form, keditor);
            
            return $.ajax({
                url: '_components/modulesList?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.select-course').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-course', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            adjustHeightModuleGrid();
                            initScrollProgress();
                            initModuleListItem();
                        });
                    });
                    
                    form.find('.txt-number-of-modules').on('change', function () {
                        var number = this.value;
                        
                        if (isNaN(number) || +number < 0) {
                            number = 0;
                            this.value = number;
                        }
                        
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-number-of-modules', number);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            adjustHeightModuleGrid();
                            initScrollProgress();
                            initModuleListItem();
                        });
                    });
                    
                    form.find('.select-layout').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-layout', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            adjustHeightModuleGrid();
                            initScrollProgress();
                            initModuleListItem();
                        });
                        
                        form.find('.items-per-row-wrapper').css('display', this.value === 'grid' ? 'block' : 'none');
                    });
                    
                    form.find('.items-per-row').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-items-per-row', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            adjustHeightModuleGrid();
                            initScrollProgress();
                            initModuleListItem();
                        });
                    });
                    
                    form.find('.txt-grid-item-height').on('change', function () {
                        var number = this.value;
                        
                        if (isNaN(number) || +number <= 200) {
                            number = 200;
                            this.value = number;
                        }
                        
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-grid-item-height', number);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            adjustHeightModuleGrid();
                            initScrollProgress();
                            initModuleListItem();
                        });
                    });
                    
                    form.find('.chk-show-time').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-time', this.checked);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            adjustHeightModuleGrid();
                            initScrollProgress();
                            initModuleListItem();
                        });
                    });
                    
                    form.find('.chk-show-cpd').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-cpd', this.checked);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            adjustHeightModuleGrid();
                            initScrollProgress();
                            initModuleListItem();
                        });
                    });
                    
                    form.find('.chk-show-point').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-point', this.checked);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            adjustHeightModuleGrid();
                            initScrollProgress();
                            initModuleListItem();
                        });
                    });
                    
                    form.find('.chk-show-button').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-button', this.checked);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            adjustHeightModuleGrid();
                            initScrollProgress();
                            initModuleListItem();
                        });
                    });
                    
                    form.find('.chk-full-height-thumb').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-full-height-thumb', this.checked);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            adjustHeightModuleGrid();
                            initScrollProgress();
                            initModuleListItem();
                        });
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "modulesList" component', form, component, keditor);
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-course').val(dataAttributes['data-course'] || '');
            form.find('.txt-number-of-modules').val(dataAttributes['data-number-of-modules'] || '0');
            form.find('.select-layout').val(dataAttributes['data-layout'] || 'list');
            form.find('.items-per-row').val(dataAttributes['data-items-per-row'] || '4');
            form.find('.txt-grid-item-height').val(dataAttributes['data-grid-item-height'] || '200');
            
            form.find('.chk-show-time').prop('checked', dataAttributes['data-show-time'] === 'true');
            form.find('.chk-show-cpd').prop('checked', dataAttributes['data-show-cpd'] === 'true');
            form.find('.chk-show-point').prop('checked', dataAttributes['data-show-point'] === 'true');
            form.find('.chk-show-button').prop('checked', dataAttributes['data-show-button'] === 'true');
            form.find('.chk-full-height-thumb').prop('checked', dataAttributes['data-full-height-thumb'] === 'true');
            
            form.find('.items-per-row-wrapper').css('display', dataAttributes['data-layout'] === 'grid' ? 'block' : 'none');
        }
    };
    
})(jQuery);