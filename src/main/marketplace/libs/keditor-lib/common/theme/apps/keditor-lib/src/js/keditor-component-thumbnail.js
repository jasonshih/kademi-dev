(function ($) {
    var KEditor = $.keditor;
    var contentEditor = $.contentEditor;
    var flog = KEditor.log;
    
    KEditor.components['thumbnail'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "thumbnail" component', component);
            
            var options = keditor.options;
            var componentContent = component.children('.keditor-component-content');
            
            var caption = componentContent.find('.caption');
            caption.addClass('clearfix');
            
            var captionInner = caption.find('.caption-inner');
            if (captionInner.length === 0) {
                caption.html('<div class="caption-inner">' + caption.html() + '</div>');
                captionInner = caption.find('.caption-inner');
            }
            
            if (!captionInner.attr('id')) {
                captionInner.attr('id', keditor.generateId('component-text-content-inner'));
            }
            
            captionInner.prop('contenteditable', true);
            captionInner.on('input', function (e) {
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
            
            var editor = captionInner.ckeditor(options.ckeditorOptions).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);
                
                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });
        },
        
        getContent: function (component, keditor) {
            flog('getContent "thumbnail" component', component);
            
            var componentContent = component.find('.keditor-component-content');
            var caption = componentContent.find('.caption');
            var captionInner = caption.find('.caption-inner');
            
            var id = captionInner.attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                caption.html(editor.getData());
            }
            
            return componentContent.html();
        },
        
        destroy: function (component, keditor) {
            flog('destroy "text" component', component);
            
            var id = component.find('.caption-inner').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        },
        
        settingEnabled: true,
        
        settingTitle: 'Thumbnail Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "thumbnail" component');
            
            return $.ajax({
                url: '/theme/apps/keditor-lib/componentThumbnailSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    contentEditor.initMselectImage(form.find('.photo-edit'), keditor, function (url, relativeUrl, fileType, hash) {
                        var img = keditor.getSettingComponent().find('.thumbnail img');
                        
                        img.attr('src', '/_hashes/files/' + hash);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "thumbnail" component', component);
        }
    };
    
})(jQuery);
