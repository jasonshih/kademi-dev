(function ($, window) {
    var DEFAULTS = {
        aspectRatio: null,
        useModal: true,
        modalSize: '',
        modalAuto: true,
        onSave: function () {
        
        },
        onModalShow: function (modal) {
        
        },
        onModalShown: function (modal) {
        
        },
        onModalHide: function (modal) {
        
        },
        onModalHidden: function (modal) {
        
        },
        onReady: function () {
        
        },
        preview: true
    };
    
    var PhotoEditor = function (target, options) {
        this.target = target;
        this.options = $.extend({}, DEFAULTS, options);
        this.init();
    };
    
    PhotoEditor.DEFAULTS = DEFAULTS;
    
    PhotoEditor.prototype.init = function () {
        var self = this;
        var options = self.options;
        
        if (options.useModal) {
            self.getModal();
            
            if (options.modalAuto) {
                self.target.on('click', function (e) {
                    e.preventDefault();
                    
                    self.modal.modal('show');
                });
            }
        } else {
            self.target.wrap('<div class="photo-editor-wrapper clearfix"></div>');
            self.container = self.target.parent();
        }
        self.image = self.container.find('img');
        self.image.wrap('<div class="photo-editor-cropper"></div>');
        
        self.container.append('<div class="photo-editor-helper"></div>');
        self.helper = self.container.find('.photo-editor-helper');
        
        self.initCropZone();
        
        if (typeof options.onReady === 'function') {
            options.onReady.call(self);
        }
    };
    
    PhotoEditor.prototype.getModal = function () {
        var self = this;
        var options = self.options;
        var modalId = 'photo-editor-modal-' + (new Date()).getTime();
        
        $(document.body).append(
            '<div id="' + modalId + '" class="modal fade" tabindex="-1" >' +
            '   <div class="modal-dialog ' + options.modalSize + '">' +
            '       <div class="modal-content">' +
            '           <div class="modal-header">' +
            '               <button type="button" class="close" data-dismiss="modal">&times;</button>' +
            '               <h4 class="modal-title">Photo Editor</h4>' +
            '           </div>' +
            '           <div class="modal-header">' +
            '               <div class="photo-editor-wrapper clearfix"><img src="" class="img-responsive" /></div>' +
            '           </div>' +
            '           <div class="modal-footer">' +
            '               <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
            '               <button type="button" class="btn btn-primary btn-save-image">Save Image</button>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>'
        );
        
        self.modal = $('#' + modalId);
        self.container = self.modal.find('.photo-editor-wrapper');
        
        self.modal.find('.btn-save-image').on('click', function (e) {
            e.preventDefault();
            
            var data = self.getCropData();
            
            if (typeof options.onSave === 'function') {
                options.onSave.call(self, data);
            }
            
            if (options.modalAuto) {
                self.modal.modal('hide');
            }
        });
        
        self.modal.on({
            'show.bs.modal': function () {
                if (typeof options.onModalShow === 'function') {
                    options.onModalShow.call(self, self.modal);
                }
            },
            'shown.bs.modal': function () {
                if (typeof options.onModalShown === 'function') {
                    options.onModalShown.call(self, self.modal);
                }
            },
            'hide.bs.modal': function () {
                if (typeof options.onModalHide === 'function') {
                    options.onModalHide.call(self, self.modal);
                }
            },
            'hidden.bs.modal': function () {
                if (typeof options.onModalHidden === 'function') {
                    options.onModalHidden.call(self, self.modal);
                }
            }
        });
    };
    
    PhotoEditor.prototype.initCropZone = function () {
        var self = this;
        var options = self.options;
        var helper = self.helper;
        
        if (options.preview === true) {
            helper.append('<div class="photo-editor-previewer"></div>');
            self.previewer = helper.find('.photo-editor-previewer');
        }
        
        helper.append(
            '<div class="photo-editor-toolbar">' +
            '    <div class="btn-group">' +
            '       <a href="javascript:void(0);" class="btn btn-default photo-editor-move" title="Drag to move image"><i class="fa fa-arrows"></i></a>' +
            '       <a href="javascript:void(0);" class="btn btn-default photo-editor-crop" title="Drag to crop image"><i class="fa fa-crop"></i></a>' +
            '    </div>' +
            '    <div class="btn-group">' +
            '       <a href="javascript:void(0);" class="btn btn-default photo-editor-zoom-in" title="Zoom in"><i class="fa fa-search-plus"></i></a>' +
            '       <a href="javascript:void(0);" class="btn btn-default photo-editor-zoom-out" title="Zoom out"><i class="fa fa-search-minus"></i></a>' +
            '    </div>' +
            // '    <div class="btn-group">' +
            // '       <a href="javascript:void(0);" class="btn btn-default photo-editor-rotate-left" title="Rotate image 45 degree to left"><i class="fa fa-rotate-left"></i></a>' +
            // '       <a href="javascript:void(0);" class="btn btn-default photo-editor-rotate-right" title="Rotate image 45 degree to right"><i class="fa fa-rotate-right"></i></a>' +
            // '    </div>' +
            // '    <div class="btn-group">' +
            // '       <a href="javascript:void(0);" class="btn btn-default photo-editor-flip-horizontal" title="Flip image horizontal"><i class="fa fa-arrows-h"></i></a>' +
            // '       <a href="javascript:void(0);" class="btn btn-default photo-editor-flip-vertical" title="Flip image vertical"><i class="fa fa-arrows-v"></i></a>' +
            // '    </div>' +
            '    <div class="btn-group">' +
            '       <a href="javascript:void(0);" class="btn btn-default photo-editor-reset" title="Reset"><i class="fa fa-refresh"></i></a>' +
            '    </div>' +
            '</div>'
        );
        
        helper.find('.photo-editor-move').on('click', function (e) {
            e.preventDefault();
            
            self.cropper.setDragMode('move');
        });
        
        helper.find('.photo-editor-crop').on('click', function (e) {
            e.preventDefault();
            
            self.cropper.setDragMode('crop');
        });
        
        helper.find('.photo-editor-zoom-in').on('click', function (e) {
            e.preventDefault();
            
            self.cropper.zoom(0.1);
        });
        
        helper.find('.photo-editor-zoom-out').on('click', function (e) {
            e.preventDefault();
            
            self.cropper.zoom(-0.1);
        });
        
        // helper.find('.photo-editor-rotate-left').on('click', function (e) {
        //     e.preventDefault();
        //
        //     self.cropper.rotate(-45);
        // });
        //
        // helper.find('.photo-editor-rotate-right').on('click', function (e) {
        //     e.preventDefault();
        //
        //     self.cropper.rotate(45);
        // });
        //
        // helper.find('.photo-editor-flip-horizontal').on('click', function (e) {
        //     e.preventDefault();
        //
        //     self.cropper.scaleX(-self.cropper.getData().scaleX);
        // });
        //
        // helper.find('.photo-editor-flip-vertical').on('click', function (e) {
        //     e.preventDefault();
        //
        //     self.cropper.scaleY(-self.cropper.getData().scaleY);
        // });
        
        helper.find('.photo-editor-reset').on('click', function (e) {
            e.preventDefault();
            
            self.cropper.reset();
        });
        
        if (!options.useModal) {
            self.setImage(self.image.attr('src'));
        }
    };
    
    PhotoEditor.prototype.setImage = function (url) {
        if (!url) {
            return;
        }
        
        var self = this;
        var options = self.options;
        var cropperOptions = {
            responsive: true,
            viewMode: 1,
            aspectRatio: options.aspectRatio,
            preview: self.previewer.get(0)
        };
        
        self.image.attr('src', url);
        
        if (self.cropper) {
            self.cropper.destroy();
        }
        self.cropper = new Cropper(self.image.get(0), cropperOptions);
    };
    
    PhotoEditor.prototype.getCropData = function () {
        var self = this;
        var data;
        
        if (self.cropper) {
            data = self.cropper.getData();
        }
        
        return data;
    };
    
    PhotoEditor.prototype.showModal = function () {
        this.modal && this.modal.modal('show');
    };
    
    PhotoEditor.prototype.hideModal = function () {
        this.modal && this.modal.modal('hide');
    };
    
    $.fn.photoEditor = function (options) {
        var target = $(this)
        var data = target.data('photoEditor');
        
        if (!data) {
            target.data('photoEditor', (data = new PhotoEditor(target, options)));
        }
        
        if (typeof options == 'string') {
            return data[options].apply(data, Array.prototype.slice.call(arguments, 1));
        } else {
            return data;
        }
    };
    
    $.fn.photoEditor.constructor = PhotoEditor;
    
})(jQuery, window);