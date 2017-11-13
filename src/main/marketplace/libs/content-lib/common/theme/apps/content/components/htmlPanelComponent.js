(function ($) {
    var KEditor = $.keditor;
    var contentEditor = $.contentEditor;
    var flog = KEditor.log;
    
    KEditor.components['htmlPanel'] = {
        settingEnabled: true,
        settingTitle: 'Panel Settings',
        
        buildComponent: function (component, keditor) {
            flog('buildComponent', component, keditor);
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            var bg = dataAttributes['data-bg'] || 'bg-default';
            var panelStyle = bg.replace('bg-', 'panel-');
            var padding = dataAttributes['data-paddingpanel'] || '15px';
            var textColor = dataAttributes['data-textcolor'] || '';
            var showIcon = dataAttributes['data-show-icon'] !== 'false';
            var customIconColor = dataAttributes['data-custom-icon-color'] === 'true';
            var iconColor = dataAttributes['data-icon-color'] || '';
            var icon = dataAttributes['data-icon'] || '';
            var iconSize = dataAttributes['data-icon-size'] || '';
            
            component.find('.panel').attr('class', 'panel ' + panelStyle);
            component.find('.htmlPanel').attr('class', 'htmlPanel panel-body ' + bg).css({
                padding: padding,
                color: textColor
            });
            
            var textEdit = component.find('.textEdit');
            var panelIconWrap = component.find('.panelIconWrap');
            if (showIcon) {
                textEdit.removeClass('noIcon');
                
                if (panelIconWrap.length === 0) {
                    textEdit.before(
                        '<div class="panelIconWrap">' +
                        '    <i class="" style=""></i>' +
                        '</div>'
                    );
                    panelIconWrap = component.find('.panelIconWrap');
                }
                
                panelIconWrap.find('i').attr('class', icon + ' ' + iconSize).css('color', customIconColor ? iconColor : '');
            } else {
                textEdit.addClass('noIcon');
                panelIconWrap.remove();
            }
        },
        
        init: function (contentArea, container, component, keditor) {
            flog('init "htmlPanel" component', component);
            
            var self = this;
            if (component.find('.panel-html-wrapper').length === 0) {
                var componentContent = component.find('.keditor-component-content');
                var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
                var htmlContent = decodeURIComponent(dataAttributes['data-html'] || '');
                
                var componentHtml = '';
                componentHtml += '<div class="panel">';
                componentHtml += '    <div class="htmlPanel panel-body">';
                componentHtml += '        <div class="textEdit">' + htmlContent + '</div>';
                componentHtml += '    </div>';
                componentHtml += '</div>';
                
                componentContent.html(componentHtml);
                component.removeAttr('data-html');
            }
            self.buildComponent(component, keditor);
            
            var options = keditor.options;
            
            var componentContent = component.find('.keditor-component-content');
            var ckeditorPlace = componentContent.find('.textEdit');
            
            if (!ckeditorPlace.attr('id')) {
                ckeditorPlace.attr('id', keditor.generateId('component-text-content-inner'));
            }
            
            ckeditorPlace.prop('contenteditable', true);
            ckeditorPlace.on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(contentArea, e, component);
                }
                
                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(contentArea, e, container);
                }
                
                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(contentArea, e);
                }
            });
            
            var editor = ckeditorPlace.ckeditor(options.ckeditorOptions).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);
                
                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });
        },
        
        getContent: function (component, keditor) {
            flog('getContent "text" component', component);
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            var showIcon = dataAttributes['data-show-icon'] !== 'false';
            var componentContent = component.find('.keditor-component-content');
            var textEdit = componentContent.find('.textEdit');
            
            var id = textEdit.attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                textEdit.replaceWith('<div class="textEdit ' + (showIcon ? '' : 'noIcon') + '">' + editor.getData() + '</div>');
            }
            
            return componentContent.html();
        },
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "htmlPanel" component');
            var self = this;
            
            return $.ajax({
                url: '_components/htmlPanel?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    $.getStyleOnce('/static/bootstrap-iconpicker/1.7.0/css/bootstrap-iconpicker.min.css');
                    $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/iconset/iconset-fontawesome-4.2.0.min.js', function () {
                        $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/bootstrap-iconpicker.min.js', function () {
                            form.find('.value-icon').iconpicker({
                                rows: 5,
                                cols: 5,
                                iconset: 'fontawesome',
                                search: true,
                                placement: 'left'
                            }).on('change', function (e) {
                                var component = keditor.getSettingComponent();
                                component.attr('data-icon', 'fa ' + e.icon);
                                self.buildComponent(component, keditor);
                            });
                        });
                    });
                    
                    contentEditor.initColorPicker(form.find('.iconColor'), function (color) {
                        var component = keditor.getSettingComponent();
                        component.attr('data-icon-color', color);
                        self.buildComponent(component, keditor);
                    });
                    
                    contentEditor.initColorPicker(form.find('.textcolor'), function (color) {
                        var component = keditor.getSettingComponent();
                        component.attr('data-textcolor', color);
                        self.buildComponent(component, keditor);
                    });
                    
                    
                    form.find('.textcolor').on('change', function (e) {
                        var component = keditor.getSettingComponent();
                        component.attr('data-textcolor', this.value);
                        self.buildComponent(component, keditor);
                    });
                    
                    form.find('.iconSize').on('change', function (e) {
                        var component = keditor.getSettingComponent();
                        component.attr('data-icon-size', this.value);
                        self.buildComponent(component, keditor);
                    });
                    
                    form.find('.customIconColor').on('click', function (e) {
                        var component = keditor.getSettingComponent();
                        component.attr('data-custom-icon-color', this.checked);
                        if (this.checked) {
                            form.find('.iconColor').prop('disabled', false);
                        } else {
                            form.find('.iconColor').prop('disabled', true);
                        }
                        self.buildComponent(component, keditor);
                    });
                    
                    form.find('.bgstyle').on('change', function (e) {
                        var component = keditor.getSettingComponent();
                        component.attr('data-bg', this.value);
                        self.buildComponent(component, keditor);
                    });
                    
                    form.find('.showIcon').on('click', function (e) {
                        var component = keditor.getSettingComponent();
                        component.attr('data-show-icon', this.checked);
                        self.buildComponent(component, keditor);
                    });
                    
                    form.find('.paddingpanel').on('change', function (e) {
                        var component = keditor.getSettingComponent();
                        component.attr('data-paddingpanel', this.value);
                        self.buildComponent(component, keditor);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "htmlPanel" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.value-icon').find('i').attr('class', 'fa ' + dataAttributes['data-icon']);
            form.find('.iconSize').val(dataAttributes['data-icon-size'])
            form.find('.bgstyle').val(dataAttributes['data-bg'] || 'bg-default')
            form.find('.textcolor').val(dataAttributes['data-textcolor']).colorpicker('setValue', dataAttributes['data-textcolor'])
            form.find('.paddingpanel').val(dataAttributes['data-paddingpanel'])
            form.find('.customIconColor').prop('checked', dataAttributes['data-custom-icon-color'] === 'true');
            form.find('.iconColor').val(dataAttributes['data-icon-color']).colorpicker('setValue', dataAttributes['data-icon-color']).prop('disabled', dataAttributes['data-custom-icon-color'] !== 'true');
            var showIcon = true;
            if (dataAttributes['data-show-icon'] && dataAttributes['data-show-icon'] != 'true') {
                showIcon = false;
            }
            form.find('.showIcon').prop('checked', showIcon);
        }
    };
    
})(jQuery);