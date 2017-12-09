var KEDITOR_PATH = '/theme/apps/keditor-lib/dist/';
var KEDITOR_JS_PATH = KEDITOR_PATH + 'js/keditor-0.0.0.min.js';
var KEDITOR_COMPONENTS_JS_PATH = KEDITOR_PATH + 'js/keditor-components-0.0.0.js';
var KEDITOR_CSS_PATH = KEDITOR_PATH + 'css/keditor-0.0.0.min.css';
var KEDITOR_COMPONENTS_CSS_PATH = KEDITOR_PATH + 'css/keditor-components-0.0.0.css';

function loadKEditor(callback) {
    $.getStyleOnce(KEDITOR_CSS_PATH);
    $.getStyleOnce(KEDITOR_COMPONENTS_CSS_PATH);
    
    $.getScriptOnce('/static/jquery-ui/1.12.1-noui/jquery-ui.min.js', function () {
        $.getScriptOnce(KEDITOR_JS_PATH, function () {
            $.getScriptOnce(KEDITOR_COMPONENTS_JS_PATH, function () {
                if (typeof  callback === 'function') {
                    callback();
                }
            });
        });
    });
}

(function ($, window) {
    function MSelectImage(target, keditor, onSelectFile) {
        flog('[jquery.contentEditor] initMSelectImage', target);
        
        this.target = target;
        this.keditor = keditor;
        this.onSelectFile = onSelectFile;
        this.init();
    };
    
    MSelectImage.prototype.init = function () {
        var self = this;
        
        self.target.mselect({
            contentTypes: ['image'],
            pagePath: self.keditor.options.pagePath,
            basePath: self.keditor.options.basePath,
            onSelectFile: self.onSelectFile,
            onReady: function () {
                var mselect = self.mselect = this;
                var previewContainer = mselect.previewContainer;
                
                var btnCrop = self.btnCrop = $('<button type="button" class="btn btn-info btn-crop-image" title="Crop this image" style="margin-left: 5px;"><i class="fa fa-crop"></i></button>')
                mselect.btnUpload.after(btnCrop);
                
                self.getCropModal();
                
                btnCrop.on('click', function (e) {
                    e.preventDefault();
                    
                    var img = previewContainer.find('img');
                    if (img.length > 0) {
                        self.modalCrop.attr('data-hash', img.attr('data-hash')).modal('show');
                        mselect.modal.modal('hide');
                    }
                });
                
                self.modalCrop.on('shown.bs.modal', function () {
                    self.initCropZone();
                });
                
                self.modalCrop.on('hidden.bs.modal', function () {
                    self.destroyCropZone();
                });
            }
        });
    }
    
    MSelectImage.prototype.getCropModal = function () {
        var self = this;
        
        var modalId = 'modal-crop-image-' + (new Date()).getTime();
        var modal = self.modalCrop = $(
            '<div id="' + modalId + '" class="modal fade" data-backdrop="static" data-keyboard="false" aria-hidden="true" tabindex="-1">' +
            '   <div class="modal-dialog">' +
            '       <div class="modal-content">' +
            '           <div class="modal-header">' +
            '               <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>' +
            '               <h4 class="modal-title">Crop image</h4>' +
            '           </div>' +
            '           <div class="modal-body">' +
            '               <div class="crop-zone clearfix">' +
            '                   <p class="alert alert-info"><i class="fa fa-info-circle"></i> Please drag a rectangle to crop the image</p>' +
            '                   <div class="image-wrapper"><img class="image-crop img-responsive" src="" /></div>' +
            '               </div>' +
            '           </div>' +
            '           <div class="modal-footer">' +
            '               <button class="btn btn-default" type="button" data-dismiss="modal">Cancel</button>' +
            '               <button class="btn btn-info btn-back-to-upload" type="button">Back to upload</button>' +
            '               <button class="btn btn-primary btn-crop-image" type="button">Crop</button>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>'
        );
        
        $(document.body).append(modal);
        
        self.imageWrapper = modal.find('.image-wrapper');
        
        modal.find('.btn-back-to-upload').on('click', function (e) {
            e.preventDefault();
            
            modal.modal('hide');
            self.mselect.modal.modal('show');
        });
        
        modal.find('.btn-crop-image').on('click', function (e) {
            e.preventDefault();
            
            var cropperData = self.imageWrapper.data('cropper').getData();
            
            $.ajax({
                url: '/keditor-lib/cropImage',
                dataType: 'json',
                type: 'post',
                data: {
                    x: cropperData.x,
                    y: cropperData.y,
                    w: cropperData.width,
                    h: cropperData.height,
                    hash: modal.attr('data-hash')
                },
                success: function (resp) {
                    if (resp && resp.status) {
                        if (typeof self.onSelectFile === 'function') {
                            var url = '/_hashes/files/' + resp.hash;
                            self.onSelectFile(url, url, 'image', resp.hash);
                            modal.modal('hide');
                        }
                    }
                }
            });
        });
    }
    
    MSelectImage.prototype.initCropZone = function () {
        var self = this;
        
        var hash = self.modalCrop.attr('data-hash');
        var href = '/_hashes/files/' + hash;
        
        var img = self.imageWrapper.find('.image-crop');
        
        img.attr('src', href).load(function () {
            var cropper = new Cropper(img.get(0), {
                responsive: true,
                viewMode: 1
            });
            
            self.imageWrapper.data('cropper', cropper);
        });
    };
    
    MSelectImage.prototype.destroyCropZone = function () {
        var self = this;
        
        var cropper = self.imageWrapper.data('cropper');
        if (cropper) {
            cropper.destroy();
        }
        
        self.imageWrapper.html('<img class="image-crop img-responsive" src="" />');
        self.modalCrop.attr('data-hash', '');
    };
    
    window.initMSelectImage = function (target, keditor, onSelectFile) {
        return new MSelectImage(target, keditor, onSelectFile);
    };
    
})(jQuery, window);
