(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['levelPanel'] = {
        settingEnabled: true,
        
        settingTitle: 'Achievement Level',
        
        initSettingForm: function (form, keditor) {
            return $.ajax({
                url: '_components/levelPanel?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.select-topic').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-topic', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.select-level-name-tag').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-level-name-tag', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.chk-show-level-name').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-level-name', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.btn-remove-img-no-level').on('click', function () {
                        form.find('.img-no-level-previewer').attr('src', '/static/images/photo_holder.png');
                        
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-img-no-level', '');
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.btn-change-img-no-level').mselect({
                        contentTypes: ['image'],
                        bs3Modal: true,
                        pagePath: keditor.options.pagePath,
                        basePath: keditor.options.basePath,
                        onSelectFile: function (url, relativeUrl, fileType, hash) {
                            var newUrl = '/_hashes/files/' + hash;
                            form.find('.img-no-level-previewer').attr('src', newUrl);
                            
                            var component = keditor.getSettingComponent();
                            var dynamicElement = component.find('[data-dynamic-href]');
                            
                            component.attr('data-img-no-level', newUrl);
                            keditor.initDynamicContent(dynamicElement);
                        }
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "levelPanel" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-topic').val(dataAttributes['data-topic']);
            form.find('.select-level-name-tag').val(dataAttributes['data-level-name-tag'] || 'h3');
            form.find('.chk-show-level-name').prop('checked', dataAttributes['data-show-level-name'] === 'true');
            form.find('.img-no-level-previewer').attr('src', dataAttributes['data-img-no-level'] || '/static/images/photo_holder.png');
        }
    };
    
})(jQuery);