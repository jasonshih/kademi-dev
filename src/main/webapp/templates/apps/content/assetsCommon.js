$(function () {
    var mainAssetContainer = $("#main-asset");
    
    // these need to be loaded for each asset, eg when modals are opened
    initAssetContainer(mainAssetContainer);
    
    // These only need to be initialised once
    $("body").on("click", ".btn-edit-type", function (e) {
        e.preventDefault();
        var link = $(e.target).closest("a");
        var modal = $("#modal-edit-type");
        modal.find("a.btn-info").attr("href", "/content-types/" + link.attr("href"));
        modal.find("a.remove-type").attr("href", link.attr("href"));
        modal.modal("show");
    });
    
    flog("init: add type");
    $("body").on("click", ".add-type", function (e) {
        flog("click");
        e.preventDefault();
        
        var link = $(e.target).closest("a");
        var contentTypeName = link.attr("href");
        $.ajax({
            url: window.location.pathname,
            type: 'post',
            dataType: 'json',
            data: {
                "assetType": contentTypeName
            },
            success: function (resp) {
                Msg.info("Added");
                $("#asset-types").reloadFragment();
            }
        });
    });
    
    $("body").on("click", ".remove-type", function (e) {
        e.preventDefault();
        var link = $(e.target).closest("a");
        var modal = $("#modal-edit-type");
        var contentTypeName = link.attr("href");
        modal.modal("hide");
        
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            dataType: 'json',
            data: {
                removeAssetType: contentTypeName
            },
            success: function (resp) {
                if (resp.status) {
                    Msg.info("Removed content type");
                    $("#asset-types").reloadFragment();
                } else {
                    Msg.error("Sorry, an error occured removing the content type");
                }
            },
            error: function () {
                Msg.error("Sorry, an error occured removing the content type");
            }
        });
    });
});

/**
 *
 * @param {type} container
 * @returns {undefined}This will be called for the main page when editing an asset, but can also be
 * called when an asset is loaded into a modal
 */
function initAssetContainer(container) {
    container.find(".form-edit").forms({
        onSuccess: function (resp) {
            if (resp.status) {
                Msg.info(resp.messages[0]);
            }
        }
    });
    
    container.find(".form-asset-main").forms({
        onSuccess: function (resp) {
            if (resp.status) {
                Msg.info(resp.messages[0]);
                if (resp.nextHref) {
                    window.location = resp.nextHref;
                }
            }
        }
    });
    
    
    var formUpload = container.find(".frmUpload");
    var uploadProgress = formUpload.find('.progress');
    formUpload.forms({
        onValid: function () {
            uploadProgress.show();
        },
        onSuccess: function (resp) {
            if (resp && resp.status) {
                $('#asset-previewer, #asset-info').reloadFragment({
                    whenComplete: function () {
                        uploadProgress.hide();
                        Msg.info(resp.messages[0]);
                    }
                });
            }
        }
    });
}


function initEditRelations() {
    $("body").on("click", ".btn-edit-relation", function (e) {
        e.preventDefault();
        var link = $(e.target).closest("a");
        var modal = $(link.data("target"));
        var href = link.attr("href");
        //modal.removeData('bs.modal');
        modal.find(".modal-body").load(href + " .main-content-inner", function () {
            initAssetContainer(modal); // init js handlers
            modal.modal('show');
        });
    });
}

function initForm(redirectOnCreated) {
    $(".form-edit").forms({
        onValid: function (form) {
            form.find('.contenteditor').each(function () {
                var contentEditor = $(this);
                
                contentEditor.val(contentEditor.contentEditor('getContent') || '');
            });
        },
        onSuccess: function (resp) {
            if (resp.status) {
                Msg.info(resp.messages[0]);
                if (redirectOnCreated) {
                    if (resp.nextHref) {
                        window.location = resp.nextHref;
                    }
                }
            }
        }
    });
    
    $(".form-asset-main").forms({
        onValid: function (form) {
            form.find('.contenteditor').each(function () {
                var contentEditor = $(this);
                
                contentEditor.val(contentEditor.contentEditor('getContent') || '');
            });
        },
        onSuccess: function (resp) {
            if (resp.status) {
                Msg.info(resp.messages[0]);
                if (resp.nextHref) {
                    window.location = resp.nextHref;
                }
            }
        }
    });
}

function initRelationFields() {
    $('.btn-upload-file').each(function () {
        var btn = $(this);
        var mupload = $('<div style="display: none;"></div>');
        var inputGroup = btn.closest('.input-group');
        var acceptedFiles = '*/*';
        
        if (btn.hasClass('btn-upload-image')) {
            acceptedFiles = 'image/*';
        }
        
        if (btn.hasClass('btn-upload-video')) {
            acceptedFiles = 'video/*';
        }
        
        mupload.mupload({
            url: '/assets/',
            buttonText: '<i class="fa fa-upload"></i> Upload',
            acceptedFiles: acceptedFiles,
            oncomplete: function (data, name, href) {
                flog("uploadcomplete", href);
                var realInput = inputGroup.find('.select-asset');
                var fakeInput = inputGroup.find('.tt-input');
                
                realInput.val(data.result.href.replace('/assets/', ''));
                fakeInput.val(data.name);
                flog("uploadcomplete2", data.name);
                flog("real inp", realInput[0]);
                flog("fake inp", fakeInput[0]);
            }
        });
        
        btn.on('click', function (e) {
            e.preventDefault();
            
            mupload.find('.btn').trigger('click');
        });
    });
    
    $('.btn-edit-text').each(function () {
        var btn = $(this);
        
        // TODO: Continue when contentType="text" works
    });
}