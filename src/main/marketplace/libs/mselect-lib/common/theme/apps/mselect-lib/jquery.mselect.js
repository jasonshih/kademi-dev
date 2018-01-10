(function (factory) {
	"use strict";
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	}
	else if(typeof module !== 'undefined' && module.exports) {
		module.exports = factory(require('jquery'));
	}
	else {
		factory(jQuery);
	}
}(function ($, undefined) {
    var DEFAULTS = {
        btnClass: 'btn btn-success',
        btnOkClass: 'btn btn-sm btn-primary',
        modalTitle: 'Select file',
        contentType: null,
        excludedEndPaths: ['.mil/'],
        basePath: '/',
        pagePath: window.location.pathname,
        zIndex: null,
        showModal: function (modal) {
            modal.modal('show');
        },
        onSelectFile: function (selectedUrl, selectedRelUrl) {
        },
        onSelectFolder: function (selectedUrl, selectedRelUrl) {
        
        },
        onPreviewFile: function (type, selectedUrl, hash) {
        },
        onReady: function () {
        
        },
        useModal: true,
        useCrop: true
    };
    
    function MSelect(target, options) {
        this.target = target;
        this.options = $.extend({}, DEFAULTS, options);
        this.init();
    }
    
    MSelect.prototype.init = function () {
        var self = this;
        var options = self.options;
        var target = self.target;
        
        flog('[MSelect] Initializing mselect', target);
        
        if (options.useModal) {
            flog('[MSelect] Initializing button and modal...', target);
            
            self.getModal();
            target.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                
                options.showModal(self.modal);
                
                if (options.zIndex) {
                    self.modal.css('z-index', options.zIndex + 1).siblings('.modal-backdrop').last().css('z-index', options.zIndex);
                }
            });
        } else {
            flog('[MSelect] Initializing mselect container only', target);
            
            target.html(self.getSelectContainer());
            self.initSelectContainer(target);
        }
        
        flog('[MSelect] Initialized mselect');
    };
    
    MSelect.prototype.getModal = function () {
        var self = this;
        var options = self.options;
        var modalId = 'modal-milton-file-select-' + (new Date()).getTime();
        
        var modal = $(
            '<div id="' + modalId + '" class="modal modal-mselect fade" aria-hidden="true" tabindex="-1" data-backdrop="static" data-keyboard="false">' +
            '   <div class="modal-dialog modal-lg">' +
            '       <div class="modal-content">' +
            '           <div class="modal-header">' +
            '               <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>' +
            '               <h4 class="modal-title">' + options.modalTitle + '</h4>' +
            '           </div>' +
            '           <div class="modal-body">' + self.getSelectContainer() + '</div>' +
            '           <div class="modal-footer">' +
            '               <button class="' + options.btnOkClass + ' btn-ok" type="button"> OK </button>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>'
        );
        
        $(document.body).append(modal);
        
        self.initSelectContainer(modal, function () {
            modal.modal('hide');
        });
        
        self.modal = modal;
    };
    
    MSelect.prototype.selectFile = function (hash, callback) {
        var self = this;
        var target = self.target;
        var tree = target.find('div.milton-tree-wrapper');
        try {
            tree.mtree('select', tree.find('[data-hash="' + hash + '"]'), callback);
        } catch (e) {
        }
    }
    
    MSelect.prototype.updateOption = function (key, value) {
        this.options[key] = value;
    }
    
    MSelect.prototype.getExtension = function (filename) {
        var parts = filename.split('.');
        return parts[parts.length - 1];
    }
    
    MSelect.prototype.isImage = function (filename) {
        var ext = this.getExtension(filename);
        switch (ext.toLowerCase()) {
            case 'jpg':
            case 'gif':
            case 'bmp':
            case 'png':
                //etc
                return true;
        }
        return false;
    };
    
    MSelect.prototype.isVideo = function (filename) {
        var ext = this.getExtension(filename);
        switch (ext.toLowerCase()) {
            case 'm4v':
            case 'avi':
            case 'mpg':
            case 'mp4':
                // etc
                return true;
        }
        return false;
    };
    
    MSelect.prototype.isAudio = function (filename) {
        var ext = this.getExtension(filename);
        switch (ext.toLowerCase()) {
            // Since jwplayer supports mp3, aac and Vorbis
            case 'mp3':
            case 'aac':
            case 'ogg':
            case 'oga':
                // etc
                return true;
        }
        return false;
    };
    
    MSelect.prototype.getFileType = function (fileUrl) {
        // Remove '/_DAV/....' before checking file type
        fileUrl = fileUrl.replace(/^(.+)(\/_DAV\/.+)$/, '$1')
        
        var fileType = 'other';
        if (this.isVideo(fileUrl)) {
            fileType = 'video';
        } else if (this.isImage(fileUrl)) {
            fileType = 'image';
        } else if (this.isAudio(fileUrl)) {
            fileType = 'audio';
        }
        
        return fileType;
    };
    
    MSelect.prototype.getAcceptedFile = function (contentType) {
        return contentType + '/*';
    };
    
    MSelect.prototype.getCleanUrl = function (url) {
        return (url || '').replace(/\/\//g, '/');
    };
    
    MSelect.prototype.initTreeContainer = function (container) {
        flog('[MSelect] initTreeContainer', container);
        
        var self = this;
        var options = self.options;
        
        var treeContainer = self.treeContainer;
        var progressBar = self.progressBar;
        var progressBarInner = self.progressBarInner;
        var previewContainer = self.previewContainer;
        var btnUpload = self.btnUpload;
        
        var mtreeOptions = {
            basePath: options.basePath,
            pagePath: options.pagePath,
            includeContentType: options.contentType,
            excludedEndPaths: options.excludedEndPaths,
            onSelect: function (node, type, selectedUrl, hash, isAsset) {
                flog('[MSelect] Select node', node, selectedUrl, hash);
                var selectFolder = this.getSelectedFolderUrl();
                btnUpload.mupload('setUrl', selectFolder);
                
                if (type === 'file') {
                    var fileType = self.getFileType(selectedUrl);
                    var hashUrl = isAsset ? selectedUrl : '/_hashes/files/' + hash;
                    flog('[MSelect] File type="' + fileType + '"');
                    
                    progressBar.show();
                    progressBarInner.html('Loading...');
                    container.find('.btn-edit-image').hide();
                    
                    switch (fileType) {
                        case 'video':
                            previewContainer.html('<div class="jp-video" data-hash="' + hash + '"></div>');
                            $.getScriptOnce('/static/jwplayer/6.10/jwplayer.js', function () {
                                $.getScriptOnce('/static/jwplayer/jwplayer.html5.js', function () {
                                    jwplayer.key = 'cXefLoB9RQlBo/XvVncatU90OaeJMXMOY/lamKrzOi0=';
                                    buildJWPlayer(previewContainer.find('div.jp-video'), 100, hashUrl, hashUrl + '/alt-640-360.png');
                                    
                                    if (typeof options.onPreviewFile === 'function') {
                                        options.onPreviewFile.call(container, fileType, selectedUrl, hash);
                                    }
                                });
                            });
                            progressBar.hide();
                            break;
                        
                        case 'audio':
                            previewContainer.html('<div class="jp-audio" data-hash="' + hash + '" style="padding: 15px"><div id="kaudio-player-100" /></div>');
                            $.getScriptOnce('/static/jwplayer/6.10/jwplayer.js', function () {
                                $.getScriptOnce('/static/jwplayer/jwplayer.html5.js', function () {
                                    jwplayer.key = 'cXefLoB9RQlBo/XvVncatU90OaeJMXMOY/lamKrzOi0=';
                                    buildJWAudioPlayer(100, hashUrl, false);
                                    
                                    if (typeof options.onPreviewFile === 'function') {
                                        options.onPreviewFile.call(container, fileType, selectedUrl, hash);
                                    }
                                });
                            });
                            progressBar.hide();
                            break;
                        
                        case 'image':
                            container.find('.btn-edit-image').show();
                            
                            $('<img />').attr('src', hashUrl).on('load', function () {
                                var realWidth = this.width;
                                var realHeight = this.height;
                                var ratio = realWidth / realHeight;
                                
                                previewContainer.html('<img src="' + hashUrl + '" data-hash="' + hash + '" data-real-width="' + realWidth + '" data-real-height="' + realHeight + '" data-ratio="' + ratio + '" />');
                                
                                if (typeof options.onPreviewFile === 'function') {
                                    options.onPreviewFile.call(container, fileType, selectedUrl, hash);
                                }
                                progressBar.hide();
                            });
                            break;
                        
                        default:
                            previewContainer.html('<p class="alert alert-warning">Unsupported preview file</p>');
                            
                            if (typeof options.onPreviewFile === 'function') {
                                options.onPreviewFile.call(container, fileType, selectedUrl, hash);
                            }
                            progressBar.hide();
                    }
                    
                    previewContainer.attr('data-url', selectedUrl);
                    previewContainer.attr('data-hash', hash);
                }
            }
        };
        
        self.mtree = treeContainer.mtree(mtreeOptions);
    };
    
    MSelect.prototype.initUploadButton = function () {
        var self = this;
        var options = self.options;
        
        var progressBar = self.progressBar;
        var progressBarInner = self.progressBarInner;
        var btnUpload = self.btnUpload;
        
        var muploadOptions = {
            url: options.basePath,
            buttonText: '<i class="fa fa-upload"></i>',
            buttonSize: 'btn-sm',
            oncomplete: function (data, name, href) {
                flog('[MSelect] oncomplete', data);
                progressBar.hide();
                self.mtree.addFile(href);
            },
            onBeforeUpload: function () {
                progressBar.show();
                progressBarInner.html('Uploading...');
            }
        };
        
        if (options.contentType) {
            muploadOptions.acceptedFiles = [self.getAcceptedFile(options.contentType)];
        }
        btnUpload.mupload(muploadOptions);
    };
    
    MSelect.prototype.initSelectContainer = function (container, onOk) {
        flog('[MSelect] initSelectContainer', container);
        
        var self = this;
        var options = self.options;
        
        options.basePath = self.getCleanUrl(options.basePath);
        options.pagePath = self.getCleanUrl(options.pagePath);
        
        var treeContainer = self.treeContainer = container.find('div.milton-tree-wrapper');
        var progressBar = self.progressBar = container.find('.milton-file-progress');
        var progressBarInner = self.progressBarInner = progressBar.find('.progress-bar');
        var previewContainer = self.previewContainer = container.find('.milton-file-preview');
        var btnUpload = self.btnUpload = container.find('.milton-btn-upload-file');
        
        self.initTreeContainer(container);
        self.initUploadButton(container);
        
        container.find('.btn-ok').click(function () {
            var url = previewContainer.attr('data-url');
            var hash = previewContainer.attr('data-hash');
            
            if (url) {
                if (typeof options.onSelectFile === 'function') {
                    var relUrl = url.substring(options.basePath.length, url.length);
                    flog('[MSelect] Selected', url, relUrl);
                    var fileType = self.getFileType(url);
                    
                    options.onSelectFile.call(container, url, relUrl, fileType, hash);
                }
                
                if (typeof options.onSelectFolder === 'function') {
                    options.onSelectFolder.call(container, url, hash);
                }
                
                if (typeof onOk === 'function') {
                    onOk.call(this);
                }
            } else {
                flog('[MSelect] No selected file!');
            }
        });
        
        self.initEditZone(container);
        
        if (typeof options.onReady === 'function') {
            options.onReady.call(self);
        }
    };
    
    MSelect.prototype.initEditZone = function (container) {
        flog('[MSelect] initEditZone', container);
        
        var self = this;
        var options = self.options;
        var btnEditImage = container.find('.btn-edit-image');
        
        var photoEditor = btnEditImage.photoEditor({
            modalSize: 'modal-lg',
            modalAuto: false,
            btnCancelText: 'Back to Upload',
            onModalShow: function () {
                if (options.useModal) {
                    container.modal('hide');
                }
            },
            onModalShown: function () {
                var hash = self.previewContainer.attr('data-hash');
                this.setImage('/_hashes/files/' + hash);
            },
            onCancel: function () {
                if (options.useModal) {
                    container.modal('show');
                }
            },
            onSave: function (data) {
                var editModal = this.modal;
                var btns = editModal.find('.btn');
                btns.prop('disabled', true);
                
                $.ajax({
                    url: '/mselect-lib/storeImage',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        file: data.croppedImage
                    },
                    success: function (resp) {
                        if (resp && resp.status) {
                            if (typeof self.options.onSelectFile === 'function') {
                                var url = '/_hashes/files/' + resp.hash;
                                self.options.onSelectFile(url, url, 'image', resp.hash);
                            }
                        }
                        
                        editModal.modal('hide');
                        btns.prop('disabled', false);
                    }
                });
            }
        });
        
        btnEditImage.on('click', function (e) {
            e.preventDefault();
            
            var url = self.previewContainer.attr('data-url');
            
            if (url) {
                photoEditor.showModal();
            } else {
                flog('[MSelect] No selected file!');
            }
        });
    };
    
    MSelect.prototype.getSelectContainer = function () {
        var self = this;
        var options = self.options;
        var extraElement = '';
        
        if (options.useCrop) {
            extraElement += '<button type="button" class="btn btn-primary btn-sm btn-edit-image" title="Edit image" style="display: none;"><i class="fa fa-edit"></i></button>';
        }
        
        if (!options.useModal) {
            extraElement += '<button type="button" class="btn btn-primary btn-sm btn-ok"><i class="fa fa-check"></i></button>';
        }
        
        return (
            '<div class="milton-file-select-container">' +
            '    <div class="row">' +
            '        <div class="col-xs-3"><div class="milton-tree-wrapper"></div></div>' +
            '        <div class="col-xs-9">' +
            '            <div class="milton-file-preview-wrapper">' +
            '                <div class="milton-btn-upload-file"></div>' + extraElement +
            '                <div class="milton-file-progress progress" style="display: none;">' +
            '                    <div class="progress-bar progress-bar-info progress-bar-striped active" style="width: 100%"></div>' +
            '                </div>' +
            '                <div class="milton-file-preview panel panel-default"></div>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>'
        );
    };
    
    MSelect.DEFAULTS = DEFAULTS;
    
    $.fn.mselect = $.fn.mselectAll = function (options) {
        var element = $(this)
        var data = element.data('mselect');
        
        if (!data) {
            element.data('mselect', (data = new MSelect(element, options)));
        }
        
        if (typeof options == 'string') {
            return data[options].apply(data, Array.prototype.slice.call(arguments, 1));
        } else {
            return data;
        }
    };
    
    $.fn.mselect.constructor = MSelect;
}));
