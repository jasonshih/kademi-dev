(function ($) {
    var KEditor = $.keditor;
    var edmEditor = $.edmEditor;
    var flog = KEditor.log;

    KEditor.components['photoEDM'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "photoEDM" component', component);
            
            var self = this;
            var componentContent = component.children('.keditor-component-content');
            var dynamicElement = componentContent.find('[data-dynamic-href]');
            
            if (dynamicElement.length === 0) {
                flog('Old photo component. Converting to new photo component...');
                dynamicElement = $('<div data-dynamic-href="_components/photoEDM" id="' + keditor.generateId('dynamic-element') + '"></div>');
                
                var td = component.find('.text-wrapper');
                var img = component.find('img');
                var tdWrapper = component.find('td.wrapper');
                var table = tdWrapper.closest('table');
                var a = img.parent('a');
                
                component.attr('data-photo-src', img.attr('src') || '');
                component.attr('data-photo-align', td.attr('align') || '');
                component.attr('data-photo-alt', img.attr('alt') || '');
                component.attr('data-photo-fullwidth', img.hasClass('full-width'));
                component.attr('data-photo-linkable', a.length > 0);
                component.attr('data-photo-link', a.attr('href') || '');
                component.attr('data-photo-link-target', a.attr('target') || '');
                component.attr('data-background-color', tdWrapper.attr('bgcolor') || '');
                
                $.each(['padding-top', 'padding-bottom', 'padding-left', 'padding-right'], function (i, dataCss) {
                    component.attr('data-' + dataCss, edmEditor.getPxValue(tdWrapper.css(dataCss)));
                });
                
                componentContent.html(dynamicElement);
                keditor.initDynamicContent(dynamicElement).done(function () {
                    $('<img />').attr('src', component.find('img').attr('src')).load(function () {
                        component.attr('data-real-width', this.width);
                    });
                });
                table.remove();
                
                component.attr('data-type', 'component-photoEDM');
                flog('Converted to new photo component');
            }
            
            var options = keditor.options;
            if (typeof options.onComponentReady === 'function') {
                options.onComponentReady.call(contentArea, component);
            }
        },
        
        settingEnabled: true,
        
        settingTitle: 'Photo Settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "photoEDM" settings', form);
            
            var self = this;
            return $.ajax({
                url: '_components/photoEDM?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form = form.find('.form-horizontal');
                    
                    $.ajax({
                        url: '/_fields',
                        type: 'get',
                        dataType: 'JSON',
                        success: function (resp) {
                            var optionsStr = '';
                            $.each(resp.data, function (i, field) {
                                optionsStr += '<option value="' + field.placeholder + '">' + field.label + '</option>';
                            });
                            
                            form.find('#photo-asset-code').append(optionsStr).on('change', function () {
                                var component = keditor.getSettingComponent();
                                var dynamicElement = component.find('[data-dynamic-href]');
                                
                                component.attr('data-photo-src', this.value);
                                keditor.initDynamicContent(dynamicElement).done(function () {
                                    $('<img />').attr('src', component.find('img').attr('src')).load(function () {
                                        component.attr('data-real-width', this.width);
                                    });
                                });
                            });
                        }
                    });

                    edmEditor.initDefaultComponentControls(form, keditor, {
                        dynamicComponent: true
                    });
                    
                    form.find('#photo-link').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-photo-link', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#photo-target').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-photo-target', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#photo-linkable').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        form.find('#photo-link').prop('disabled', !this.checked);
                        form.find('#photo-target').prop('disabled', !this.checked);
                        
                        component.attr('data-photo-linkable', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    
                    initMSelectImage(form.find('#photo-edit'), keditor, function (url, relUrl, type, hash, isAsset) {
                        var src = isAsset ? '/assets/' + hash : '/_hashes/files/' + hash;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-photo-src', src);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            $('<img />').attr('src', component.find('img').attr('src')).load(function () {
                                component.attr('data-real-width', this.width);
                            });
                        });
                    });
                    
                    form.find('#photo-alt').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-photo-alt', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#photo-fullwidth').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-photo-fullwidth', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#photo-align').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-photo-align', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "photoEDM" component', component);
            
            edmEditor.showDefaultComponentControls(form, component, keditor, {
                dynamicComponent: true
            });
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('#photo-linkable').prop('checked', dataAttributes['data-photo-linkable'] === 'true');
            form.find('#photo-link').prop('disabled', dataAttributes['data-photo-linkable'] !== 'true').val(dataAttributes['data-photo-link'] || '');
            form.find('#photo-target').prop('disabled', dataAttributes['data-photo-linkable'] !== 'true').val(dataAttributes['data-photo-target'] || '');
            form.find('#photo-align').val(dataAttributes['data-photo-align'] || '');
            form.find('#photo-fullwidth').prop('checked', dataAttributes['data-photo-fullwidth'] === 'true');
            form.find('#photo-alt').val(dataAttributes['data-photo-alt'] || '');
            form.find('#photo-asset-code').val('');
            
            if (dataAttributes['data-photo-src'].indexOf('*|') === 0) {
                form.find('#photo-asset-code').val(dataAttributes['data-photo-src']);
            }
        }
    };
    
})(jQuery);
