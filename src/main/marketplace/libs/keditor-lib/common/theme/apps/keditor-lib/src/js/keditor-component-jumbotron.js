(function ($) {
    var KEditor = $.keditor;
    var contentEditor = $.contentEditor;
    var flog = KEditor.log;
    
    KEditor.components['jumbotron'] = {
        settingEnabled: true,
        
        settingTitle: 'Jumbotron Settings',
        init: function (contentArea, container, component, keditor) {
            var self = this;
            var options = keditor.options;
            
            var componentContent = component.children('.keditor-component-content');
            componentContent.prop('contenteditable', true);
            
            componentContent.on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(keditor, e, component, contentArea);
                }
                
                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(keditor, e, container, contentArea);
                }
                
                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(keditor, e, contentArea);
                }
            });
            
            var editor = componentContent.ckeditor(options.ckeditorOptions).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);
                
                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });
        },
        
        getContent: function (component, keditor) {
            flog('getContent "jumbotron" component', component);
            
            var componentContent = component.find('.keditor-component-content');
            var id = componentContent.attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                return editor.getData();
            } else {
                return componentContent.html();
            }
        },
        
        initSettingForm: function (form, keditor) {
            flog('init "jumbotron" settings', form);
            
            return $.ajax({
                url: '/theme/apps/keditor-lib/componentJumbotronSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.chk-inverse').on('click', function () {
                        var comp = keditor.getSettingComponent();
                        comp.find('.jumbotron')[this.checked ? 'addClass' : 'removeClass']('jumbotron-inverse');
                    });
                    
                    var buttonColorPicker = form.find('.button-color-picker');
                    contentEditor.initSimpleColorPicker(buttonColorPicker, function (color) {
                        var comp = keditor.getSettingComponent();
                        comp.find('.jumbotron').css('background-color', color);
                        comp.attr('data-bgcolor', color);
                    });
                    
                    var paddingSettings = form.find('.paddingSettings');
                    paddingSettings.on('change', function () {
                        var paddingValue = this.value || '';
                        var component = keditor.getSettingComponent();
                        var paddingProp = $(this).attr('name');
                        if (paddingValue.trim() === '') {
                            component.find('.jumbotron').css(paddingProp, '');
                        } else {
                            if (isNaN(paddingValue)) {
                                paddingValue = 0;
                                this.value = paddingValue;
                            }
                            component.find('.jumbotron').css(paddingProp, paddingValue + 'px');
                        }
                    });
                    
                    var marginSettings = form.find('.marginSettings');
                    marginSettings.on('change', function () {
                        var paddingValue = this.value || '';
                        var component = keditor.getSettingComponent();
                        var paddingProp = $(this).attr('name');
                        if (paddingValue.trim() === '') {
                            component.find('.jumbotron').css(paddingProp, '');
                        } else {
                            if (isNaN(paddingValue)) {
                                paddingValue = 0;
                                this.value = paddingValue;
                            }
                            component.find('.jumbotron').css(paddingProp, paddingValue + 'px');
                        }
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "jumbotron" component', component);
            form.find('[name=button-color]').val(component.attr('data-bgcolor')).trigger('update');
            form.find('.paddingSettings').each(function () {
                $(this).val(component.find('.jumbotron').css($(this).attr('name')).replace('px', ''));
            });
            form.find('.marginSettings').each(function () {
                $(this).val(component.find('.jumbotron').css($(this).attr('name')).replace('px', ''));
            });
            form.find('[name=showButton][value=false]').prop('checked', component.find('a').hasClass('hide'));
            form.find('.chk-inverse').prop('checked', component.find('.jumbotron').hasClass('jumbotron-inverse'));
        },
        
        destroy: function (component, keditor) {
            flog('destroy "text" component', component);
            
            var id = component.find('.keditor-component-content').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        }
    };
    
})(jQuery);

