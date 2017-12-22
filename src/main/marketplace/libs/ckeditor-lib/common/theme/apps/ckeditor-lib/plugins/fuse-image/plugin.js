(function (CKEDITOR) {
    var modal;
    var modalBody;
    var txtWidth;
    var txtHeight;
    var txtAlt;
    var cbbAlign;
    var previewContainer;
    
    
    CKEDITOR.plugins.add('fuse-image', {
        init: function (editor) {
            var that = this;
            
            // ===========================================================
            // Init modal for plugin
            // ===========================================================
            modal = $('#modal-fuse-image');
            if (modal.length === 0) {
                $(document.body).append(
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
                modal = $('#modal-fuse-image');
            }
            
            modalBody = modal.find('.modal-body');
            
            // ===========================================================
            // Add imageDialog for plugin
            // ===========================================================
            editor.addCommand('imageDialog', new CKEDITOR.command(editor, {
                exec: function (instance) {
                    if (!modalBody.data('mselect')) {
                        flog('[fuse-image] Init mselect modal');
                        
                        var options = {
                            contentTypes: ['image'],
                            useModal: false,
                            onSelectFile: function (url, relativeUrl, fileType, hash) {
                                flog('[CKEDITOR.fuse-image] onSelectFile', url, relativeUrl, fileType, hash);
                                
                                var previewImg = previewContainer.find('img');
                                hash = hash || previewImg.attr('data-hash');
                                var imageUrl = (editor.config.fullUrl ? 'http://' + window.location.host : '') + '/_hashes/files/' + hash;
                                var width = previewImg.width();
                                var height = previewImg.height();
                                var alt = previewImg.attr('alt');

                                that.element.setAttribute('src', imageUrl);
                                that.element.setAttribute('data-hash', hash);
                                that.element.setAttribute('align', previewImg.attr('align') || '');
                                that.element.setAttribute('width', width);
                                that.element.setAttribute('height', height);
                                that.element.setAttribute('alt', alt);
                                that.element.$.style.width = width + 'px';
                                that.element.$.style.height = height + 'px';
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
                                txtAlt.val(previewImg.attr('alt'));
                                cbbAlign.val('');
                                addLoremText();
                            },
                            onReady: function () {
                                previewContainer = modalBody.find('.milton-file-preview');
                                
                                // Extra textboxes for plugin
                                modalBody.find('.milton-btn-upload-file').after(
                                    '<div class="input-group" style="float: left; width: 130px; margin: 0 10px 10px 10px;">' +
                                    '    <input type="text" class="form-control txt-width" placeholder="Image width" title="Image height" />' +
                                    '</div>' +
                                    '<div class="input-group" style="float: left; width: 130px; margin: 0 10px 10px 0">' +
                                    '    <input type="text" class="form-control txt-height" placeholder="Image height" title="Image height" />' +
                                    '</div>' +
                                    '<div class="input-group" style="float: left; width: 270px; margin: 0 10px 10px 0">' +
                                    '    <input type="text" class="form-control txt-alt" placeholder="Alt text" title="Alt text" />' +
                                    '</div>' +
                                    '<div class="input-group" style="float: left; width: 180px; margin: 0 10px 10px 0">' +
                                    '    <select class="form-control cbb-align" title="Image align">' +
                                    '        <option value="">[No align selected]</option>' +
                                    '        <option value="left">Left</option>' +
                                    '        <option value="right">Right</option>' +
                                    '    </select>' +
                                    '</div>'
                                );
                                modalBody.find('.milton-file-progress, .milton-file-preview').css({top: 90});
                                txtWidth = modalBody.find('.txt-width');
                                txtHeight = modalBody.find('.txt-height');
                                txtAlt = modalBody.find('.txt-alt');
                                cbbAlign = modalBody.find('.cbb-align');
                                var updateImageSize = function (width, height) {
                                    previewContainer.find('img').css({
                                        width: width,
                                        height: height
                                    }).attr({
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
                                
                                txtWidth.on('input', function () {
                                    typewatch(function () {
                                        var width = txtWidth.val();
                                        var height = txtHeight.val();
                                        var ratio = +previewContainer.find('img').attr('data-ratio');
                                        
                                        if (width) {
                                            height = +width / ratio;
                                            txtHeight.val(height);
                                            updateImageSize(width, height);
                                        } else {
                                            txtWidth.val(+height * ratio);
                                        }
                                    }, 200);
                                });
                                
                                txtHeight.on('input', function () {
                                    typewatch(function () {
                                        var width = txtWidth.val();
                                        var height = txtHeight.val();
                                        var ratio = previewContainer.find('img').attr('data-ratio');
                                        
                                        if (height) {
                                            width = +height * ratio;
                                            txtWidth.val(width);
                                            updateImageSize(width, height);
                                        } else {
                                            txtWidth.val(+width / ratio);
                                        }
                                    }, 200);
                                });

                                txtAlt.on('input', function () {
                                    var value = this.value;
                                    typewatch(function () {
                                        previewContainer.find('img').attr('alt', value);
                                    }, 200);
                                });
                                
                                cbbAlign.on('change', function () {
                                    previewContainer.find('img').attr('align', this.value);
                                });
                                
                                openModal(that, instance);
                            }
                        };
                        
                        if (editor.config.basePath) {
                            options.basePath = editor.config.basePath;
                        }
                        
                        if (editor.config.pagePath) {
                            options.basePath = editor.config.pagePath;
                        }
                        
                        modalBody.mselect(options);
                    } else {
                        openModal(that, instance);
                    }
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
    
    function addLoremText() {
        previewContainer.append(
            '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint aspernatur nostrum eligendi minima sequi sed modi tenetur quis laborum nam sunt maxime similique voluptatibus consequuntur impedit, temporibus in consequatur illo mollitia a qui doloremque suscipit, facere earum. Rerum, hic, ad!</p>' +
            '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto impedit perferendis enim, laborum. Odio, reprehenderit ad labore tempore non repellendus porro expedita, doloribus temporibus mollitia molestias officiis minima adipisci ut a repudiandae rem totam. Expedita dolorum ipsa placeat cupiditate, temporibus doloremque. Porro, possimus perferendis officia culpa aliquam libero neque aut.</p>'
        );
    }
    
    function openModal(that, instance) {
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
            var alt = element.getAttribute('alt');
            if (!alt){
                alt = '';
            }
            modalBody.mselect('selectFile', hash);
            
            $('<img />').attr('src', src).attr('alt', alt).load(function () {
                var realWidth = this.width;
                var realHeight = this.height;
                var ratio = realWidth / realHeight;
                var align = element.getAttribute('align') || '';
                
                previewContainer.html('<img alt="'+alt+'" src="' + src + '" data-hash="' + hash + '" data-real-width="' + realWidth + '" data-real-height="' + realHeight + '" data-ratio="' + ratio + '" style="width: ' + width + 'px; height: ' + height + 'px;" align="' + align + '" />');
                addLoremText();
                txtWidth.val(width || realWidth);
                txtHeight.val(height || realHeight);
                cbbAlign.val(align);
                txtAlt.val(alt);
            });
        } else {
            element = instance.document.createElement('img');
            that.insertMode = true;
            // modalBody.mselect('selectFile', '');
        }
        
        that.element = element;
        modal.data('ckeditorInstance', instance);
        modal.modal('show');
    };
    
})(CKEDITOR);