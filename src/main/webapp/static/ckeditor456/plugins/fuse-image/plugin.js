(function (CKEDITOR) {
    CKEDITOR.plugins.add('fuse-image', {
        init: function (editor) {
            var that = this;
            $.getScriptOnce('/static/jquery.mselect/1.1.0/jquery.mselect-1.1.0.js');
            
            // ===========================================================
            // Init modal for plugin
            // ===========================================================
            var modal = $('#modal-fuse-image');
            if (modal.length === 0) {
                var modal = $(
                    '<div id="modal-fuse-image" class="modal fade" aria-hidden="true" tabindex="-1">' +
                    '   <div class="modal-dialog modal-lg">' +
                    '       <div class="modal-content">' +
                    '           <div class="modal-header">' +
                    '               <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>' +
                    '               <h4 class="modal-title">Select image</h4>' +
                    '           </div>' +
                    '           <div class="modal-body"></div>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>'
                );
                $(document.body).append(modal);
            }
            var modalBody = modal.find('.modal-body');
            var txtWidth;
            var txtHeight;
            var previewContainer;
            
            // ===========================================================
            // Add imageDialog for plugin
            // ===========================================================
            editor.addCommand('imageDialog', new CKEDITOR.command(editor, {
                exec: function (instance) {
                    if (!modalBody.data('mselectOptions')) {
                        var options = {
                            contentTypes: ['image'],
                            useModal: false,
                            onSelectFile: function (url, relativeUrl, fileType, hash) {
                                flog('[CKEDITOR.fuse-image] onSelectFile', url, relativeUrl, fileType, hash);
            
                                var imageUrl = '/_hashes/files/' + hash;
                                var previewImg = previewContainer.find('img');
                                that.element.setAttribute('src', imageUrl);
                                that.element.setAttribute('data-hash', hash);
                                that.element.$.style.width = previewImg.width() + 'px';
                                that.element.$.style.height = previewImg.height() + 'px';
                                that.element.$.removeAttribute('data-cke-saved-src');
                                that.element.addClass('img-responsive');
            
                                var instance = modal.data('ckeditorInstance');
                                if (that.insertMode) {
                                    instance.insertElement(that.element);
                                } else {
                                    instance.updateElement();
                                }
            
                                that.element = null;
                                modal.data('ckeditorInstance', null);
                                modal.modal('hide');
                            },
                            onPreviewFile: function (type, selectedUrl, hash) {
                                var previewImg = previewContainer.find('img');
                                txtWidth.val(previewImg.width());
                                txtHeight.val(previewImg.height());
                            }
                        };
    
                        if (editor.config.basePath) {
                            options.basePath = editor.config.basePath;
                        }
    
                        if (editor.config.pagePath) {
                            options.basePath = editor.config.pagePath;
                        }
    
                        modalBody.mselect(options);
                        previewContainer = modalBody.find('.milton-file-preview');
                        
                        // Extra textboxes for plugin
                        modalBody.find('#milton-btn-upload-file').after(
                            '<div class="input-group" style="float: left; width: 170px; margin: 0 10px;">' +
                            '    <span class="input-group-addon">Width</span>' +
                            '    <input type="text" class="form-control txt-width" placeholder="Image width" />' +
                            '</div>' +
                            '<div class="input-group" style="float: left; width: 170px; margin: 0 10px 0 0">' +
                            '    <span class="input-group-addon">Height</span>' +
                            '    <input type="text" class="form-control txt-height" placeholder="Image width" />' +
                            '</div>'
                        );
                        
                        txtWidth = modalBody.find('.txt-width');
                        txtHeight = modalBody.find('.txt-height');
                        var updateImageSize = function (width, height) {
                            previewContainer.find('img').css({
                                width: width,
                                height: height
                            });
                        };
    
                        var typewatch = (function () {
                            var timer = 0;
                            return function (callback, ms) {
                                clearTimeout(timer);
                                timer = setTimeout(callback, ms);
                            }
                        })();
                        
                        txtWidth.on('keydown', function () {
                            typewatch(function () {
                                var width = txtWidth.val();
                                var height = txtHeight.val();
                                var ratio = +previewContainer.find('img').attr('data-ratio');
                                
                                if (width) {
                                    height = +width / ratio;
                                    txtHeight.val(height);
                                    updateImageSize(height, width);
                                } else {
                                    txtWidth.val(+height * ratio);
                                }
                            }, 200);
                        });
    
                        txtHeight.on('keydown', function () {
                            typewatch(function () {
                                var width = txtWidth.val();
                                var height = txtHeight.val();
                                var ratio = previewContainer.find('img').attr('data-ratio');
    
                                if (height) {
                                    width = +height * ratio;
                                    txtWidth.val(width);
                                    updateImageSize(height, width);
                                } else {
                                    txtWidth.val(+width / ratio);
                                }
                            }, 200);
                        });
                    }
                    
                    var sel = instance.getSelection();
                    var element = sel.getStartElement();
                    if (element) {
                        element = element.getAscendant('img', true);
                    }
                    
                    if (CKEDITOR.plugins.fuseImage.isImage(element)) {
                        that.insertMode = false;
                        var hash = element.getAttribute('data-hash');
                        var width = (element.$.style.width || '').replace('px', '') || element.getAttribute('width');
                        var height = (element.$.style.height || '').replace('px', '') || element.getAttribute('height');
                        var src = element.getAttribute('src');
                        modalBody.mselect('selectFile', hash);
    
                        $('<img />').attr('src', src).load(function () {
                            var realWidth = this.width;
                            var realHeight = this.height;
                            var ratio = realWidth / realHeight;
        
                            previewContainer.html('<img class="img-responsive" src="' + src + '" data-hash="' + hash + '" data-real-width="' + realWidth + '" data-real-height="' + realHeight + '" data-ratio="' + ratio + '" style="width: ' + width + 'px; height: ' + height + 'px;" />');
                            txtWidth.val(width || realWidth);
                            txtHeight.val(height || realHeight);
                        });
                    } else {
                        element = instance.document.createElement('img');
                        that.insertMode = true;
                        modalBody.mselect('selectFile', '');
                    }
                    
                    that.element = element;
                    modal.data('ckeditorInstance', instance);
                    modal.modal('show');
                }
            }));
            
            // ===========================================================
            // Add toolbar button for plugin
            // ===========================================================
            editor.ui.addButton('fuse-image', {
                label: 'Browse and upload images',
                command: 'imageDialog',
                toolbar: 'insert,1',
                icon: this.path + 'images/icon.png'
            });
            
            // ===========================================================
            // Adjust statement of plugin button when selection is changed
            // ===========================================================
            editor.on('selectionChange', function (evt) {
                if (editor.readOnly) {
                    return;
                }
                
                var command = editor.getCommand('imageDialog');
                var element = evt.data.path.lastElement && evt.data.path.lastElement.getAscendant('img', true);
                
                if (CKEDITOR.plugins.fuseImage.isEditableImage(element)) {
                    command.setState(CKEDITOR.TRISTATE_ON);
                } else {
                    command.setState(CKEDITOR.TRISTATE_OFF);
                }
            });
            
            // ===========================================================
            // Double-click event handle for plugin
            // ===========================================================
            editor.on('doubleclick', function (evt) {
                var element = evt.data.element.getAscendant('img', true);
                
                if (CKEDITOR.plugins.fuseImage.isEditableImage(element)) {
                    editor.getSelection().selectElement(element);
                    that.element = element;
                    editor.execCommand('imageDialog');
                }
            });
            
            // ===========================================================
            // Context menu for plugin
            // ===========================================================
            if (editor.contextMenu) {
                editor.addMenuGroup('imageGroup');
                
                editor.addMenuItem('imageItem', {
                    label: 'Edit image',
                    icon: this.path + 'images/icon.png',
                    command: 'imageDialog',
                    group: 'imageGroup'
                });
                
                editor.contextMenu.addListener(function (element) {
                    if (CKEDITOR.plugins.fuseImage.isEditableImage(element))
                        return {
                            imageItem: CKEDITOR.TRISTATE_ON
                        };
                    return null;
                });
            }
        }
    });
    
    CKEDITOR.plugins.fuseImage = {
        isEditableImage: function (element) {
            return CKEDITOR.plugins.fuseImage.isImage(element) && !element.isReadOnly();
        },
        isImage: function (element) {
            if (element) {
                element = element.getAscendant('img', true);
            }
            
            return element && element.getName() === 'img' && !element.data('cke-realelement') && !element.data('kaudio') && !element.hasClass('video-jw');
        }
    };
    
})(CKEDITOR);