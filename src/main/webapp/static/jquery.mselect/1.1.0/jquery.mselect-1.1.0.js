(function ($) {
    $.fn.mselect = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('[jquery.mselect] Method ' + method + ' does not exist on jquery.mselect');
        }
    };
    
    // since there's jquery.milton-image-select is using the same shorthand $().mselect, just create alias for this
    $.fn.mselectAll = $.fn.mselect;
    flog('[jquery.mselect] mselectAll is loaded');
    
    $.fn.mselect.DEFAULT = {
        btnClass: 'btn btn-success',
        btnOkClass: 'btn btn-sm btn-primary',
        modalTitle: 'Select file',
        contentTypes: ['image', 'video', 'audio'],
        mselectAll: false, // when true, all file types are allowed so contentTypes is ignored
        excludedEndPaths: ['.mil/'],
        basePath: '/',
        pagePath: window.location.pathname,
        zIndex: 10012,
        showModal: function (modal) {
            modal.modal('show');
        },
        onSelectFile: function (selectedUrl, selectedRelUrl) {
        },
        onSelectFolder: function (selectedUrl, selectedRelUrl) {
            
        },
        onPreviewFile: function (type, selectedUrl, hash) {
            
        },
        useModal: true
    };
    
    var methods = {
        init: function (options) {
            var config = $.extend({}, $.fn.mselect.DEFAULT, options);
            var target = this;
            
            if (target.data('mselectOptions')) {
                flog('[jquery.mselect] mselect is already initialized!', config, target);
                return target;
            }
            
            $.getStyleOnce('/static/jquery.mselect/1.1.0/jquery.mselect-1.1.0.css');
            $.when(
                $.getScriptOnce('/static/js/jquery.jstree.js'),
                $.getScriptOnce('/static/js/jquery.milton-tree.js'),
                $.getScriptOnce('/static/milton-upload/1.0.1/jquery.milton-upload.js')
            ).then(function () {
                flog('[jquery.mselect] Initializing mselect', config, target);
                if (config.useModal) {
                    flog('[jquery.mselect] Initializing button and modal...', config, target);
                    target.on('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        var modal = getModal(config);
                        config.showModal(modal);
                        if (config.zIndex) {
                            modal.css('z-index', config.zIndex + 1).siblings('.modal-backdrop').css('z-index', config.zIndex);
                        }
                    });
                } else {
                    flog('[jquery.mselect] Initializing mselect container only', config, target);
                    
                    target.html(getSelectContainer(config));
                    initSelectContainer(target, config);
                }
                
                target.data('mselectOptions', config);
                flog('[jquery.mselect] Initialized mselect');
            });
        },
        selectFile: function (hash, callback) {
            var target = this;
            var tree = target.find('div.milton-tree-wrapper');
            try {
                tree.mtree('select', tree.find('[data-hash="' + hash + '"]'), callback);
            } catch (e) {
            }
        },
        updateOption: function (key, value) {
            var target = this;
            var options = target.data('mselectOptions');
            options[key] = value;
            target.data('mselectOptions', options);
        }
    };
    
    function getExtension(filename) {
        var parts = filename.split('.');
        return parts[parts.length - 1];
    }
    
    function isImage(filename) {
        var ext = getExtension(filename);
        switch (ext.toLowerCase()) {
            case 'jpg':
            case 'gif':
            case 'bmp':
            case 'png':
                //etc
                return true;
        }
        return false;
    }
    
    function isVideo(filename) {
        var ext = getExtension(filename);
        switch (ext.toLowerCase()) {
            case 'm4v':
            case 'avi':
            case 'mpg':
            case 'mp4':
                // etc
                return true;
        }
        return false;
    }
    
    function isAudio(filename) {
        var ext = getExtension(filename);
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
    }
    
    function getAcceptedFiles(contentTypes) {
        return contentTypes.map(function (a) {
            return a + '/*'
        }).join(',');
    }
    
    function initSelectContainer(container, config, onOk) {
        flog('[jquery.mselect] initSelectContainer', container, config);
        
        config.basePath = config.basePath.replace(/\/\//g, '/');
        config.pagePath = config.pagePath.replace(/\/\//g, '/');
        
        var tree = container.find('div.milton-tree-wrapper');
        var progressBar = container.find('.milton-file-progress');
        var progressBarInner = progressBar.find('.progress-bar');
        var previewContainer = container.find('.milton-file-preview');
        var mtreeOptions = {
            basePath: config.basePath,
            pagePath: config.pagePath,
            excludedEndPaths: config.excludedEndPaths,
            onselectFolder: function (n, selectedUrl, hash) {
                flog('Selected folder', n, selectedUrl, hash);
                if (selectedUrl.indexOf('/') !== 0) {
                    selectedUrl = '/' + selectedUrl;
                }
                container.find('.milton-btn-upload-file').mupload('setUrl', selectedUrl);
                //previewContainer.html('<p class="alert alert-warning">Unsupported preview folder</p>');
                previewContainer.attr('data-url', selectedUrl);
                previewContainer.attr('data-hash', hash);
            },
            onselectFile: function (n, selectedUrl, hash) {
                flog('Selected file', n, selectedUrl, hash);
                if (selectedUrl.indexOf('/') !== 0) {
                    selectedUrl = '/' + selectedUrl;
                }
                var newUrl = selectedUrl.substr(0, selectedUrl.lastIndexOf('/')) + '/';
                newUrl = newUrl.replace(/\/\//g, '/');
                container.find('.milton-btn-upload-file').mupload('setUrl', newUrl);
                
                var fileType = 'other';
                if (isVideo(selectedUrl)) {
                    fileType = 'video';
                } else if (isImage(selectedUrl)) {
                    fileType = 'image';
                } else if (isAudio(selectedUrl)) {
                    fileType = 'audio';
                }
                
                var hashUrl = '/_hashes/files/' + hash;
                progressBar.show();
                progressBarInner.html('Loading...');
                if (fileType === 'video') {
                    previewContainer.html('<div class="jp-video" data-hash="' + hash + '"></div>');
                    $.getScriptOnce('/static/jwplayer/6.10/jwplayer.js', function () {
                        $.getScriptOnce('/static/jwplayer/jwplayer.html5.js', function () {
                            jwplayer.key = 'cXefLoB9RQlBo/XvVncatU90OaeJMXMOY/lamKrzOi0=';
                            buildJWPlayer(previewContainer.find('div.jp-video'), 100, hashUrl, hashUrl + '/alt-640-360.png');
                            
                            if (typeof config.onPreviewFile === 'function') {
                                config.onPreviewFile.call(container, fileType, selectedUrl, hash);
                            }
                        });
                    });
                    progressBar.hide();
                } else if (fileType === 'audio') {
                    previewContainer.html('<div class="jp-audio" data-hash="' + hash + '" style="padding: 15px"><div id="kaudio-player-100" /></div>');
                    $.getScriptOnce('/static/jwplayer/6.10/jwplayer.js', function () {
                        $.getScriptOnce('/static/jwplayer/jwplayer.html5.js', function () {
                            jwplayer.key = 'cXefLoB9RQlBo/XvVncatU90OaeJMXMOY/lamKrzOi0=';
                            buildJWAudioPlayer(100, hashUrl, false);
                            
                            if (typeof config.onPreviewFile === 'function') {
                                config.onPreviewFile.call(container, fileType, selectedUrl, hash);
                            }
                        });
                    });
                    progressBar.hide();
                } else if (fileType === 'image') {
                    $('<img />').attr('src', hashUrl).load(function () {
                        var realWidth = this.width;
                        var realHeight = this.height;
                        var ratio = realWidth / realHeight;
                        
                        previewContainer.html('<img src="' + hashUrl + '" data-hash="' + hash + '" data-real-width="' + realWidth + '" data-real-height="' + realHeight + '" data-ratio="' + ratio + '" />');
                        
                        if (typeof config.onPreviewFile === 'function') {
                            config.onPreviewFile.call(container, fileType, selectedUrl, hash);
                        }
                        progressBar.hide();
                    });
                } else {
                    previewContainer.html('<p class="alert alert-warning">Unsupported preview file</p>');
                    
                    if (typeof config.onPreviewFile === 'function') {
                        config.onPreviewFile.call(container, fileType, selectedUrl, hash);
                    }
                    progressBar.hide();
                }
                
                previewContainer.attr('data-url', selectedUrl);
                previewContainer.attr('data-hash', hash);
            },
            ondelete: function (n, isFolder) {
                if (isFolder) {
                    flog('Deleted folder', n, isFolder);
                    
                    var newUrl = config.basePath + config.pagePath;
                    newUrl = newUrl.replace(/\/\//g, '/');
                    container.find('.milton-btn-upload-file').mupload('setUrl', newUrl);
                }
            }
        };
        if (!config.mselectAll) {
            mtreeOptions.includeContentTypes = config.contentTypes;
        }
        tree.mtree(mtreeOptions);
        
        var muploadOptions = {
            url: config.basePath,
            buttonText: '<i class="fa fa-upload"></i>',
            oncomplete: function (data, name, href) {
                flog('[jquery.mselect] oncomplete', data);
                progressBar.hide();
                //tree.mtree('addFile', name, href, hash);
                addFileToTree(name, href, tree);
                url = href;
            },
            onBeforeUpload: function () {
                progressBar.show();
                progressBarInner.html('Uploading...');
            }
        };
        if (!config.mselectAll) {
            muploadOptions.acceptedFiles = getAcceptedFiles(config.contentTypes);
        }
        container.find('.milton-btn-upload-file').mupload(muploadOptions);
        
        container.find('.btn-ok').click(function () {
            var url = previewContainer.attr('data-url');
            var hash = previewContainer.attr('data-hash');
            
            if (url) {
                if (typeof config.onSelectFile === 'function') {
                    var relUrl = url.substring(config.basePath.length, url.length);
                    flog('[jquery.mselect] Selected', url, relUrl);
                    var fileType = 'other';
                    if (isVideo(url)) {
                        fileType = 'video';
                    } else if (isImage(url)) {
                        fileType = 'image';
                    } else if (isAudio(url)) {
                        fileType = 'audio';
                    }
                    
                    config.onSelectFile.call(container, url, relUrl, fileType, hash);
                }
                
                if (typeof config.onSelectFolder === 'function') {
                    config.onSelectFolder.call(container, url, hash);
                }
                
                if (typeof onOk === 'function') {
                    onOk.call(this);
                }
            } else {
                flog('[jquery.mselect] No selected file!');
            }
        });
        
        if (typeof config.onReady === 'function') {
            config.onReady.call(config);
        }
    }
    
    function addFileToTree(name, href, tree) {
        var t = "/_DAV/PROPFIND?fields=milton:hash";
        flog("addFileToTree", href + t);
        $.ajax({
            url: href + t,
            cache: false
        }).done(function (data) {
            var hash = data[0].hash;
            flog("addFileToTree", data, hash);
            tree.mtree('addFile', name, href, hash);
        });
    }
    
    function getSelectContainer(config) {
        var extraElement = '';
        
        if (!config.useModal) {
            extraElement += '<button type="button" class="btn btn-primary btn-ok"><i class="fa fa-check"></i></button>';
        }
        
        return (
            '<div class="milton-file-select-container">' +
            '    <div class="row">' +
            '        <div class="col-xs-4"><div class="milton-tree-wrapper"></div></div>' +
            '        <div class="col-xs-8">' +
            '            <div class="milton-file-preview-wrapper">' +
            '                <div class="milton-btn-upload-file"></div>' + extraElement +
            '                <div class="milton-file-progress progress" style="display: none;">' +
            '                    <div class="progress-bar progress-bar-info progress-bar-striped active" style="width: 100%"></div>' +
            '                </div>' +
            '                <div class="milton-file-preview"></div>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>'
        );
    }
    
    function getModal(config) {
        flog('[jquery.mselect] getModal', config);
        
        var modal = $('#modal-milton-file-select');
        if (modal.length === 0) {
            $(document.body).append(
                '<div id="modal-milton-file-select" class="modal fade" aria-hidden="true" tabindex="-1">' +
                '   <div class="modal-dialog modal-md">' +
                '       <div class="modal-content">' +
                '           <div class="modal-header">' +
                '               <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>' +
                '               <h4 class="modal-title">' + config.modalTitle + '</h4>' +
                '           </div>' +
                '           <div class="modal-body">' + getSelectContainer(config) + '</div>' +
                '           <div class="modal-footer">' +
                '               <button class="' + config.btnOkClass + ' btn-ok" type="button"> OK </button>' +
                '           </div>' +
                '       </div>' +
                '   </div>' +
                '</div>'
            );
            modal = $('#modal-milton-file-select');
            
            initSelectContainer(modal, config, function () {
                modal.modal('hide');
            });
        }
        
        return modal;
    }
    
})(jQuery);
