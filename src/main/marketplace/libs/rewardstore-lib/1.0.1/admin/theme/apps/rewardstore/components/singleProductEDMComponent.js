(function ($) {
    var KEditor = $.keditor;
    var edmEditor = $.edmEditor;
    var flog = KEditor.log;
    
    KEditor.components['singleProductEDM'] = {
        settingEnabled: true,
        
        settingTitle: 'Product List Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "singleProductEDM" component', form, keditor);
            
            return $.ajax({
                url: '_components/singleProductEDM?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);
                    
                    var cbbProduct = form.find('.select-product');
                    var productOptions = cbbProduct.find('option');
                    
                    form.find('.select-store').on('change', function () {
                        var component = keditor.getSettingComponent();
                        component.attr('data-store', this.value);
    
                        cbbProduct.val('');
                        productOptions.css('display', 'none').filter('[data-store="' + this.value + '"]').css('display', 'block');
                    });
                    
                    form.find('.select-product').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-product-id', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.select-layout').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-layout', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    var colorPicker = form.find('.color-picker');
                    edmEditor.initSimpleColorPicker(colorPicker, function (color) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-viewmore-color', color);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "singleProductEDM" component', form, component, keditor);
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-store').val(dataAttributes['data-store']);
            form.find('.select-product').val(dataAttributes['data-product-id']).find('option').css('display', 'none').filter('[data-store="' + dataAttributes['data-store'] + '"]').css('display', 'block');
            form.find('.select-layout').val(dataAttributes['data-layout']);
            form.find('.color-picker').val(dataAttributes['data-viewmore-color'] || '').trigger('update');
        }
    };
    
})(jQuery);