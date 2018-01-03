(function (CKEDITOR) {
    CKEDITOR.plugins.add('embed_audio', {
        init: function (editor) {
            var that = this;
            $.getScriptOnce('/static/jquery.mselect/1.1.1/jquery.mselect-1.1.1.js');
            
            // ===========================================================
            // Init modal for plugin
            // ===========================================================
            var modal = $('#modal-embed-audio');
            if (modal.length === 0) {
                $(document.body).append(
                    '<div id="modal-embed-audio" class="modal fade" aria-hidden="true" tabindex="-1">' +
                    '   <div class="modal-dialog modal-lg">' +
                    '       <div class="modal-content">' +
                    '           <div class="modal-header">' +
                    '               <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>' +
                    '               <h4 class="modal-title">Select audio</h4>' +
                    '           </div>' +
                    '           <div class="modal-body"></div>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>'
                );
                modal = $('#modal-embed-audio');
            }
            var modalBody = modal.find('.modal-body');
            var previewContainer;
            var txtWidth;
            
            // ===========================================================
            // Add audioDialog for plugin
            // ===========================================================
            editor.addCommand('audioDialog', new CKEDITOR.command(editor, {
                exec: function (instance) {
                    if (!modalBody.data('mselectOptions')) {
                        var options = {
                            contentTypes: ['audio'],
                            useModal: false,
                            onSelectFile: function (url, relativeUrl, fileType, hash) {
                                flog('[CKEDITOR.embed_audio] onSelectFile', url, relativeUrl, fileType, hash);
                                
                                that.element.setAttribute('src', '/static/ckeditor456/plugins/embed_audio/images/audio.jpg');
                                that.element.setAttribute('data-kaudio', '/_hashes/files/' + hash);
                                that.element.setAttribute('data-hash', hash);
                                that.element.setAttribute('data-autostart', 'false');
                                that.element.setAttribute('data-width', txtWidth.val());
                                that.element.$.removeAttribute('data-cke-saved-src');
                                that.element.$.style.width = txtWidth.val() + 'px';
                                that.element.$.style.height = '30px';
                                that.element.setAttribute("class", "audio-jw");
                                
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
                                previewContainer.find('.jp-audio').attr('data-width', '330').css({
                                    'width': 330,
                                    'margin': '0 auto'
                                });
                                txtWidth.val('300');
                            },
                            onReady: function () {
                                previewContainer = modalBody.find('.milton-file-preview');
                                
                                // Extra textboxes for plugin
                                modalBody.find('.milton-btn-upload-file').after(
                                    '<div class="input-group" style="float: left; width: 170px; margin: 0 10px;">' +
                                    '    <span class="input-group-addon">Width</span>' +
                                    '    <input type="text" class="form-control txt-width" placeholder="Image width" />' +
                                    '</div>'
                                );
                                
                                txtWidth = modalBody.find('.txt-width');
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
                                        var oldWidth = previewContainer.find('.jp-audio').attr('data-width');
                                        
                                        if (width) {
                                            previewContainer.find('.jp-audio').attr('data-width', width).css({
                                                'width': +width + 30,
                                                'margin': '0 auto'
                                            });
                                        } else {
                                            txtWidth.val(oldWidth);
                                        }
                                    }, 200);
                                });
                            }
                        };
                        
                        if (editor.config.basePath) {
                            options.basePath = editor.config.basePath;
                        }
                        
                        if (editor.config.pagePath) {
                            options.basePath = editor.config.pagePath;
                        }
                        
                        modalBody.mselect(options);
                    }
                    
                    var sel = instance.getSelection();
                    var element = sel.getStartElement();
                    if (element) {
                        element = element.getAscendant('img', true);
                    }
                    
                    if (CKEDITOR.plugins.embedAudio.isAudio(element)) {
                        that.insertMode = false;
                        var hash = element.getAttribute('data-hash');
                        var url = element.getAttribute('data-kaudio');
                        var width = element.getAttribute('data-width') || 300;
                        modalBody.mselect('selectFile', hash);
                        
                        $.getScriptOnce('/static/jwplayer/6.10/jwplayer.js', function () {
                            $.getScriptOnce('/static/jwplayer/jwplayer.html5.js', function () {
                                jwplayer.key = 'cXefLoB9RQlBo/XvVncatU90OaeJMXMOY/lamKrzOi0=';
                                previewContainer.attr('data-hash', hash);
                                previewContainer.attr('data-src', url);
                                txtWidth.val(width);
                                previewContainer.html('<div class="jp-audio" data-hash="' + hash + '" style="padding: 15px; width: ' + (+width + 30) + 'px; margin: 0 auto;"><div id="kaudio-player-100" /></div>');
                                buildJWAudioPlayer(100, url, false);
                            });
                        });
                    } else {
                        element = instance.document.createElement('img');
                        that.insertMode = true;
                        // modalBody.mselect('selectFile', '');
                    }
                    
                    that.element = element;
                    modal.data('ckeditorInstance', instance);
                    modal.modal('show');
                }
            }));
            
            // ===========================================================
            // Add toolbar button for plugin
            // ===========================================================
            editor.ui.addButton('embed_audio', {
                label: 'Browse and upload audios',
                command: 'audioDialog',
                toolbar: 'insert,2',
                icon: this.path + 'images/icon.png'
            });
            
            // ===========================================================
            // Adjust statement of plugin button when selection is changed
            // ===========================================================
            editor.on('selectionChange', function (evt) {
                if (editor.readOnly) {
                    return;
                }
                
                var command = editor.getCommand('audioDialog');
                var element = evt.data.path.lastElement && evt.data.path.lastElement.getAscendant('img', true);
                
                if (CKEDITOR.plugins.embedAudio.isEditableAudio(element)) {
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
                
                if (CKEDITOR.plugins.embedAudio.isEditableAudio(element)) {
                    editor.getSelection().selectElement(element);
                    that.element = element;
                    editor.execCommand('audioDialog');
                }
            });
            
            // ===========================================================
            // Context menu for plugin
            // ===========================================================
            if (editor.contextMenu) {
                editor.addMenuGroup('audioGroup');
                
                editor.addMenuItem('audioItem', {
                    label: 'Edit audio',
                    icon: this.path + 'images/icon.png',
                    command: 'audioDialog',
                    group: 'audioGroup'
                });
                
                editor.contextMenu.addListener(function (element) {
                    if (CKEDITOR.plugins.embedAudio.isEditableAudio(element))
                        return {
                            audioItem: CKEDITOR.TRISTATE_ON
                        };
                    return null;
                });
            }
        }
    });
    
    CKEDITOR.plugins.embedAudio = {
        isEditableAudio: function (element) {
            return CKEDITOR.plugins.embedAudio.isAudio(element) && !element.isReadOnly();
        },
        isAudio: function (element) {
            if (element) {
                element = element.getAscendant('img', true);
            }
            
            return element && element.getName() === 'img' && !element.data('cke-realelement') && element.data('kaudio');
        }
    };
    
})(CKEDITOR);