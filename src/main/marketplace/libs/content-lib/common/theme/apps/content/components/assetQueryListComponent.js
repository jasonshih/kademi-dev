(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['assetQueryList'] = {
        settingEnabled: true,
        settingTitle: 'Asset Query Settings',
        initSettingForm: function (form, keditor) {
            var self = this;
            flog('initSettingForm "assetQueryList" component');
            
            return $.ajax({
                url: '_components/assetQueryList?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('#asset-query-select').on('change', function () {
                        var comp = keditor.getSettingComponent();
                        comp.attr('data-query', this.value);
                        
                        var dynamicElement = comp.find('[data-dynamic-href]');
                        keditor.initDynamicContent(dynamicElement);
                        
                        self.loadFields(form, keditor);
                    });
                    
                    form.find('.select-thumbnail').on('change', function () {
                        var comp = keditor.getSettingComponent();
                        comp.attr('data-thumbnail-field', this.value);
                        
                        var dynamicElement = comp.find('[data-dynamic-href]');
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.select-caption').on('change', function () {
                        var comp = keditor.getSettingComponent();
                        comp.attr('data-caption-field', this.value);
                        
                        var dynamicElement = comp.find('[data-dynamic-href]');
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        loadFields: function (form, keditor, callback) {
            var selectQuery = form.find('#asset-query-select');
            var targetType = selectQuery.find('option[value="' + selectQuery.val() + '"]').attr('data-target-type');
            
            $.ajax({
                url: '/content-types/' + targetType,
                dataType: 'json',
                type: 'get',
                data: {
                    asJson: true
                },
                success: function (resp) {
                    var optionsStr = '<option value="">None</option>';
                    if (resp && resp.status && resp.data && resp.data && resp.data.fields) {
                        
                        $.each(resp.data.fields, function (index, item) {
                            optionsStr += '<option value="' + item.name + '">' + item.title + '</option>';
                        });
                    }
                    
                    form.find('.select-thumbnail, .select-caption').html(optionsStr);
                    
                    if (typeof callback === 'function') {
                        callback();
                    }
                },
                error: function (jqXHR, textStatus, errorText) {
                    flog('Error in loading fields', jqXHR, textStatus, errorText);
                    var optionsStr = '<option value="">None</option>';
                    form.find('.select-thumbnail, .select-caption').html(optionsStr);
                    
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "assetQueryList" component');
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            
            form.find('#asset-query-select').val(dataAttributes['data-query'] || '');
            
            this.loadFields(form, keditor, function () {
                form.find('.select-thumbnail').val(dataAttributes['data-thumbnail-field'] || '');
                form.find('.select-caption').val(dataAttributes['data-caption-field'] || '');
            });
        }
    };
    
})(jQuery);