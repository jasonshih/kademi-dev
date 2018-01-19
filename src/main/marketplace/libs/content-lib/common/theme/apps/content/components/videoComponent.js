(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['video'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "video" component', component);
            
            var componentContent = component.children('.keditor-component-content');
            var dynamicElement = componentContent.find('[data-dynamic-href]');
            
            if (dynamicElement.length === 0) {
                flog('Old video component. Converting to new video component...');
                dynamicElement = $('<div data-dynamic-href="_components/video" id="' + keditor.generateId('dynamic-element') + '"></div>');
                
                
                var img = component.find('img[data-video-src]');
                var wrapper = img.parent('.video-wrapper');
                component.attr('data-video-autostart', img.attr('data-autostart'));
                component.attr('data-video-ratio', img.attr('data-aspectratio'));
                component.attr('data-video-src', img.attr('data-video-src'));
                component.attr('data-video-repeat', img.attr('data-repeat'));
                component.attr('data-video-controls', img.attr('data-controls'));
                
                componentContent.html(dynamicElement);
                keditor.initDynamicContent(dynamicElement).done(function () {
                    doInitVideos();
                });
                img.remove();
                if (wrapper.length > 0) {
                    wrapper.remove();
                }
                flog('Converted to new video component');
            } else {
                doInitVideos();
            }
            
            var options = keditor.options;
            if (typeof options.onComponentReady === 'function') {
                options.onComponentReady.call(contentArea, component);
            }
        },
        
        settingEnabled: true,
        
        settingTitle: 'Video Settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "video" settings', form);
            var self = this;
            
            return $.ajax({
                url: '_components/video?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    var selectPicker = form.find('.border-style');
                    selectPicker.on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-video-border-style', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            doInitVideos();
                        });
                    });
                    
                    var txtBorderWidth = form.find('.border-width');
                    txtBorderWidth.on('change', function () {
                        var width = this.value;
                        if (isNaN(width) || width < 0) {
                            width = 1;
                            this.value = width;
                        }
                        
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-video-border-width', width);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            doInitVideos();
                        });
                    });
                    
                    var colorPicker = form.find('.border-color');
                    $.contentEditor.initColorPicker(colorPicker, function (color) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-video-border-color', color);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            doInitVideos();
                        });
                    });
                    
                    form.find('.chk-border').on('click', function () {
                        selectPicker.prop('disabled', !this.checked);
                        txtBorderWidth.prop('disabled', !this.checked);
                        colorPicker.prop('disabled', !this.checked);
                        
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-video-border', this.checked);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            doInitVideos();
                        });
                    });
                    
                    form.find('.btn-videoFileInput').mselect({
                        contentType: 'video',
                        bs3Modal: true,
                        pagePath: keditor.options.pagePath,
                        basePath: keditor.options.basePath,
                        onSelectFile: function (url) {
                            var component = keditor.getSettingComponent();
                            var dynamicElement = component.find('[data-dynamic-href]');
                            
                            component.attr('data-video-src', url);
                            keditor.initDynamicContent(dynamicElement).done(function () {
                                doInitVideos();
                            });
                        }
                    });
                    
                    form.find('#video-autostart').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-video-autostart', this.checked);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            doInitVideos();
                        });
                    });
                    
                    form.find('#video-repeat').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-video-repeat', this.checked);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            doInitVideos();
                        });
                    });
                    
                    form.find('.video-ratio').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-video-ratio', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            doInitVideos();
                        });
                    });
                    
                    form.find('#video-controls').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-video-controls', this.checked);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            doInitVideos();
                        });
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "video" component', form, component);
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            
            var isBorderEnabled = dataAttributes['data-video-border'] === 'true';
            
            form.find('.chk-border').prop('checked', isBorderEnabled);
            form.find('.border-style').prop('disabled', !isBorderEnabled).val(dataAttributes['data-video-border-style']);
            form.find('.border-width').prop('disabled', !isBorderEnabled).val(isBorderEnabled ? dataAttributes['data-video-border-width'] : '');
            form.find('.color-picker').colorpicker(isBorderEnabled ? 'enable' : 'disable').colorpicker('setValue', isBorderEnabled ? dataAttributes['data-video-border-color'] : '');
            
            form.find('#video-autostart').prop('checked', dataAttributes['data-video-autostart'] === 'true');
            form.find('#video-repeat').prop('checked', dataAttributes['data-video-repeat'] === 'true');
            form.find('.video-ratio').prop('checked', false).filter('[value="' + dataAttributes['data-video-ratio'] + '"]').prop('checked', true);
            form.find('#video-controls').prop('checked', dataAttributes['data-video-controls'] === 'true');
        }
    };
})(jQuery);
