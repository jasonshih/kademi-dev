(function ($) {
    var KEditor = $.keditor;
    var edmEditor = $.edmEditor;
    var flog = KEditor.log;
    
    KEditor.components['rewardCategoriesListEDM'] = {
        settingEnabled: true,
        
        settingTitle: 'Product List Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "rewardCategoriesListEDM" component', form, keditor);
            
            return $.ajax({
                url: '_components/rewardCategoriesListEDM?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.select-reward').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-reward', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.select-tag').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-tag', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    var chkCategories = form.find('.select-categories');
                    chkCategories.on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        var selectedCategories = [];
                        chkCategories.each(function () {
                            if (this.checked) {
                                selectedCategories.push(this.value);
                            }
                        });
                        
                        component.attr('data-categories', selectedCategories.join(','));
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.items-per-row').on('change', function () {
                        var number = this.value;
                        
                        if (isNaN(number) || +number <= 0) {
                            number = 1;
                            this.value = number;
                        }
                        
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-items-per-row', number);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.txt-horizontal-padding').on('change', function () {
                        var number = this.value;
                        
                        if (isNaN(number) || +number <= 0) {
                            number = 1;
                            this.value = number;
                        }
                        
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-horizontal-padding', number);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "rewardCategoriesListEDM" component', form, component, keditor);
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-reward').val(dataAttributes['data-reward']);
            form.find('.select-tag').val(dataAttributes['data-tag'] || 'h3');
            form.find('.items-per-row').val(dataAttributes['data-items-per-row']);
            form.find('.txt-horizontal-padding').val(dataAttributes['data-horizontal-padding'] || 0);
            
            var chkCategories = form.find('.select-categories');
            chkCategories.prop('checked', false);
            $.each((dataAttributes['data-categories'] || '').split(','), function (i, value) {
                chkCategories.filter('[value="' + value + '"]').prop('checked', true);
            });
        }
    };
    
})(jQuery);