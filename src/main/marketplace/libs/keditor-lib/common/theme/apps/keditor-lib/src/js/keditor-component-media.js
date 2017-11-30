(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['media'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "media" component', component);
            
            var options = keditor.options;
            var componentContent = component.children('.keditor-component-content');
            
            var mediaBody = componentContent.find('.media-body');
            mediaBody.addClass('clearfix');
            
            var mediaLeft = componentContent.find('.media-left');
            var mediaLeftInner = componentContent.find('.media-left-inner');
            if (mediaLeftInner.length === 0) {
                mediaLeft.html('<div class="media-left-inner">' + mediaLeft.html() + '</div>');
            }
            
            if (!mediaBody.attr('id')) {
                mediaBody.attr('id', keditor.generateId('component-text-content-inner'));
            }
            
            mediaBody.prop('contenteditable', true);
            mediaBody.on('input', function (e) {
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
            
            var editor = mediaBody.ckeditor(options.ckeditorOptions).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);
                
                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });
        },
        
        getContent: function (component, keditor) {
            flog('getContent "media" component', component);
            
            var componentContent = component.find('.keditor-component-content');
            var mediaBody = componentContent.find('.media-body');
            
            var id = mediaBody.attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                mediaBody.replaceWith('<div class="media-body clearfix">' + editor.getData() + '</div>');
            }
            
            return componentContent.html();
        },
        
        destroy: function (component, keditor) {
            flog('destroy "text" component', component);
            
            var id = component.find('.media-body').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        },
        
        settingEnabled: true,
        
        settingTitle: 'Media Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "media" component');
            
            return $.ajax({
                url: '/theme/apps/keditor-lib/componentMediaSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    var txtLink = form.find('.photo-link');
                    txtLink.on('change', function () {
                        var link = this.value.trim();
                        keditor.getSettingComponent().find('a').attr('href', link);
                    });
                    
                    var cbbTarget = form.find('.photo-target');
                    cbbTarget.on('change', function () {
                        keditor.getSettingComponent().find('a').attr('target', this.value);
                    });
                    
                    var chkLinkable = form.find('.photo-linkable');
                    chkLinkable.on('click', function () {
                        var img = keditor.getSettingComponent().find('img.media-object');
                        
                        if (chkLinkable.is(':checked')) {
                            txtLink.prop('disabled', false);
                            cbbTarget.prop('disabled', false);
                            img.wrap('<a href=""></a>');
                        } else {
                            txtLink.prop('disabled', true);
                            cbbTarget.prop('disabled', true);
                            img.unwrap('a');
                        }
                    });
                    
                    form.find('.photo-v-align').on('change', function () {
                        var mediaLeft = keditor.getSettingComponent().find('.media-left');
                        mediaLeft.css('vertical-align', this.value);
                    });
                    
                    form.find('.photo-responsive').on('click', function () {
                        keditor.getSettingComponent().find('img')[this.checked ? 'addClass' : 'removeClass']('img-responsive');
                    });
                    
                    form.find('.photo-style').on('change', function () {
                        var img = keditor.getSettingComponent().find('img.media-object');
                        var val = this.value;
                        
                        img.removeClass('img-rounded img-circle img-thumbnail');
                        if (val) {
                            img.addClass(val);
                        }
                    });
                    
                    form.find('.photo-width').on('change', function () {
                        var img = keditor.getSettingComponent().find('img.media-object');
                        img.attr('width', this.value);
                    });
                    
                    var photoEdit = form.find('.photo-edit');
                    photoEdit.mselect({
                        contentTypes: ['image'],
                        bs3Modal: true,
                        pagePath: keditor.options.pagePath,
                        basePath: keditor.options.basePath,
                        onSelectFile: function (url, relativeUrl, fileType, hash) {
                            var img = keditor.getSettingComponent().find('img.media-object');
                            
                            img.attr('src', '/_hashes/files/' + hash);
                        }
                    });
                    
                    form.find('.left-width').on('change', function () {
                        var mediaLeftInner = keditor.getSettingComponent().find('.media-left-inner');
                        mediaLeftInner.css('width', this.value);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "media" component', component);
            
            var inputVAlign = form.find('.photo-v-align');
            var inputResponsive = form.find('.photo-responsive');
            var inputWidth = form.find('.photo-width');
            var cbbStyle = form.find('.photo-style');
            var txtLink = form.find('.photo-link');
            var cbbTarget = form.find('.photo-target');
            var chkLinkable = form.find('.photo-linkable');
            
            var img = component.find('img.media-object');
            var mediaLeft = component.find('.media-left');
            var mediaLeftInner = component.find('.media-left-inner');
            
            form.find('.left-width').val(mediaLeftInner.get(0).style.width || '');
            
            var a = img.parent('a');
            if (a.length > 0) {
                chkLinkable.prop('checked', true);
                txtLink.prop('disabled', false).val(a.attr('href'));
                cbbTarget.prop('disabled', false).val(a.attr('target'));
            } else {
                chkLinkable.prop('checked', false);
                txtLink.prop('disabled', true).val('');
                cbbTarget.prop('disabled', true).val('');
            }
            
            var valign = mediaLeft.css('vertical-align') || 'top';
            
            if (img.hasClass('img-rounded')) {
                cbbStyle.val('img-rounded');
            } else if (img.hasClass('img-circle')) {
                cbbStyle.val('img-circle');
            } else if (img.hasClass('img-thumbnail')) {
                cbbStyle.val('img-thumbnail');
            } else {
                cbbStyle.val('');
            }
            
            inputVAlign.val(valign);
            inputResponsive.prop('checked', img.hasClass('img-responsive'));
            inputWidth.val(img.attr('width'));
        }
    };
    
})(jQuery);
