function initManageBlogArticle() {
    $('.timeago').timeago();
    initHtmlEditors();

    $('.article-form').forms({
        callback: function(resp, form) {
            flog('Done', form, resp);
            if (resp.nextHref) {
                window.location = resp.nextHref;
            }
            Msg.info('Saved');
        }
    });

    var rejectModal = $('#rejectModal');
    $('.article-reject').click(function(e) {
        e.preventDefault();
        rejectModal.modal('show');
    });
    rejectModal.find('form').forms({
        callback: function(data) {
            Msg.info('Rejected/un-published');
            window.location.reload();
        }
    });

    $('.article-submit').click(function(e) {
        e.preventDefault();
        $.ajax({
            url: window.location.pathname,
            data: {submit: 'doit'},
            method: "POST",
            datatype: "json"
        }).done(function(data) {
            flog('Done', data);
            Msg.info('Submitted for approval');
            window.location.reload();
        });
    });

    var publishModal = $('#publishModal');
    $('.article-publish').click(function(e) {
        e.preventDefault();
        publishModal.modal('show');
    });

    publishModal.find('form').forms({
        callback: function(data) {
            Msg.info('Published');
            flog('done publish', data);
            window.location.reload();
        }
    });

    initGroupEditing();
    initManageArticleImage();
}

function initManageArticleImage() {
    var imageContainer = $('#images-container');
    var addImageModal = $('#modal-add-image');
    addImageModal.find('form.form-horizontal').forms({
        callback: function() {
            imageContainer.reloadFragment();
            $(".modal").modal("hide");
        }
    });

    var upcropZone = addImageModal.find('.upcrop-zone');
    var editImageZone = addImageModal.find('.edit-image-zone');
    upcropZone.upcropImage({
        buttonUploadText: "<i class='clip-folder'></i> Upload image",
        buttonCropText: 'Crop and use this image',
        modalTitle: 'Upload and crop image',
        ratio: 0,
        isEmbedded: true,
        embeddedTemplate:
            '<div class="upcrop-embedded" id="{{upcropId}}">' +
                '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                    '<h4 class="modal-title">Upload and crop image</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                    '<div class="form-horizontal">' +
                        '<div class="form-group orientation hide">' +
                            '<label class="col-sm-3 control-label" for="newTagName">Orientation</label>' +
                            '<div class="col-sm-9">' +
                                '<select class="form-control">' +
                                    '<option value="">Default</option>' +
                                    '<option value="square">Square</option>' +
                                    '<option value="vertical">Vertical</option>' +
                                    '<option value="horizontal">Horizontal</option>' +
                                '</select>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '{{upcropZone}}' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<div class="pull-left">' +
                        '{{buttonUploadOther}}' +
                    '</div>' +
                    '<button class="btn btn-default btn-cancel" type="button" data-dismiss="modal">Cancel</button> ' +
                    '{{buttonCrop}} ' +
                    '{{buttonContinue}}' +
                '</div>'+
            '</div>'
        ,
        onUploadComplete: function (data, name, href) {
            flog("manageBlogArticle.js: onUploadComplete");
            upcropZone.find('.orientation').removeClass('hide');
//            setAddImageFormData(data, name, true);
        },
        onUploadedImageLoad: function () {
            addImageModal.trigger('resize');
        },
        onUploadOther: function () {
            addImageModal.trigger('resize');
            upcropZone.find('.orientation').addClass('hide');
            upcropZone.find('.orientation select').val('');
        },
        onContinue: function (data, name) {
            setAddImageFormData(data, name, true);
        },
        onCropComplete: setAddImageFormData,
        onReady: function (upcropContainer) {
            var cbbOrientation = upcropContainer.find('.orientation select');
            cbbOrientation.on('change', function () {
                var value = cbbOrientation.val();
                var ratio;
                switch (value) {
                    case 'square':
                        ratio = 1;
                        break;

                    case 'vertical':
                        ratio = 1/2;
                        break;

                    case 'horizontal':
                        ratio = 2/1;
                        break;

                    default:
                        ratio = 0;
                }

                var jcropApi = upcropZone.upcropImage('getJcropApi');
                jcropApi.setOptions({
                    aspectRatio: ratio
                });
            });

            var btnCancel = upcropContainer.find('.btn-cancel');
            var btnUploadOther = upcropContainer.find('.btn-upload-other');

            btnCancel.on('click', function (e) {
                btnUploadOther.trigger('click');
            });
        }
    });

    function setAddImageFormData(data, name, ignoreOrientation) {
        if (data.result) {
            data = data.result;
        }
        var hash = data.data;
        flog("setAddImageFormData: data=", data);
        flog("setAddImageFormData: hash=", hash);

        addImageModal.find('.preview').attr('src', data.nextHref);
        addImageModal.find('input[name=hash]').val(hash); // the hash of the 'file' file input that was uploaded
        addImageModal.find('input[name=fileName]').val(name);
        addImageModal.find('input[name=orientation]').val(ignoreOrientation ? '' : upcropZone.find('.orientation select').val());
        flog('set', addImageModal.find('input[name=fileName]'));
        upcropZone.find('.orientation select').val('');
        upcropZone.addClass('hide');
        editImageZone.removeClass('hide');
    }

    imageContainer.on('click', '.image-delete', function(e) {
        e.preventDefault();
        var href = $(e.target).closest('a').attr('href');
        flog('delete image', $(e.target), href);

        confirmDelete(href, getFileName(href), function() {
            imageContainer.reloadFragment();
        });
    });


    addImageModal.find('.btn-add-other-img').on('click', function (e) {
        e.preventDefault();

        upcropZone.removeClass('hide');
        editImageZone.addClass('hide');
        addImageModal.find('.btn-upload-other').trigger('click');
    });


    addImageModal.find('.btn-close').on('click', function (e) {

        upcropZone.removeClass('hide');
        editImageZone.addClass('hide');
        addImageModal.find('.btn-upload-other').trigger('click');
    });
}


function initGroupEditing() {
    $('#modalGroup input[type=checkbox]').click(function() {
        var $chk = $(this);
        flog('checkbox click', $chk, $chk.is(':checked'));
        var isRecip = $chk.is(':checked');
        setGroupRecipient($chk.attr('name'), isRecip);
    });
}

function setGroupRecipient(name, isRecip) {
    flog('setGroupRecipient', name, isRecip);
    try {
        $.ajax({
            type: "POST",
            url: window.location.pathname,
            data: {
                group: name,
                isRecip: isRecip
            },
            dataType: 'json',
            success: function(data) {
                if (data.status) {
                    flog('saved ok', data);
                    if (isRecip) {
                        $('.GroupList').append("<button class='btn btn-sm btn-default reset-margin-bottom' type='button' style='margin-right: 5px;'>" + name + "</button>");
                        flog('appended to', $('.GroupList'));
                    } else {
                        var toRemove = $('.GroupList button').filter(function() {
                            return $(this).text() == name;
                        });
                        toRemove.remove();
                    }
                } else {
                    flog('error', data);
                    Msg.error('Sorry, couldnt save ' + data);
                }
            },
            error: function(resp) {
                flog('error', resp);
                Msg.error('Sorry, couldnt save - ' + resp);
            }
        });
    } catch (e) {
        flog('exception in createJob', e);
    }
}
