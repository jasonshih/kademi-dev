function initManageAuction() {
    initForms();
    initGroupModal();
    initGroupDelete();
    initDateTimePickers();
    initOrgSearch();
    initOrgListBtn();
    initHtmlEditors();
    initImageUploaderViewer();
    initManageAuctionImage();
    $('abbr.timeago').timeago();
}

function getImageId(pathname) {
    return pathname.substr(pathname.lastIndexOf('/') + 1);
}

function initForms() {
    $(".Cancel").click(function () {
        window.location = "../";
    });

    $("#mainForm").forms({
        validate: function( resp){
            var valid = true;
            var auctionDescription = $("form textarea[name=auctionDescription]").text();
            if(auctionDescription.length > 2048){
                valid = false;
            }
            return valid;
        },
        callback: function (resp) {
            flog("done", resp);
            Msg.success(resp.messages[0]);
            if (resp.nextHref && resp.nextHref !== window.location.pathname) {
                window.location.pathname = resp.nextHref;
            }
        }
    });
}

function initGroupModal() {
    $("#modalGroup input[type=checkbox]").click(function () {
        var $chk = $(this);
        flog("checkbox click", $chk, $chk.is(":checked"));
        var isRecip = $chk.is(":checked");
        var groupType = $chk.closest('label').data("grouptype");
        setGroupRecipient($chk.attr("name"), groupType, isRecip);
    });
}

function initGroupDelete() {
    $('body').on('click', '.btn-delete-group', function (e) {
        e.preventDefault();
        var btn = $(this);
        var name = btn.attr("href");
        setGroupRecipient(name, "", false);
        $("#modalGroup input[name=" + name + "]").check(false);
    });
}

function initDateTimePickers() {
    $('.date-time').datetimepicker({
        format: "DD/MM/YYYY HH:mm"
    });
}

function initOrgSearch() {
    var orgTitle = $('#orgTitle');
    var orgId = $('#orgId');
    var orgSearch = $('#org-search');

    flog("initOrgSearch", orgTitle);
    orgTitle.on("focus click", function () {
        orgSearch.show();
        flog("show", orgSearch);
    });
    orgTitle.keyup(function () {
        typewatch(function () {
            flog("do search");
            doOrgSearch();
        }, 500);
    });
    $("#modalOrganisations").on("show", function () {
        doOrgSearch();
    });
}

function initOrgSearchCheckbox() {
    $("#org-search input[type=checkbox]").click(function () {
        var $chk = $(this);
        var isRecip = $chk.is(":checked");
        flog("checkbox click", $chk, isRecip);
        setOrgRecipient($chk.attr("id"), $chk.attr("name"), isRecip);
    });
}

function initOrgListBtn() {
    $("#OrganisationList a").click(function (e) {
        e.preventDefault();
        var href = $(e.currentTarget).attr("href");
        var name = $(e.currentTarget).attr("name");
        flog("remove organisation", e);
        if (confirm("Are you sure you want to delete " + name + "?")) {
            setOrgRecipient(href, name, false);
        }
    });
}

function doOrgSearch() {
    $.ajax({
        type: 'GET',
        url: window.location.pathname + "?orgSearch=" + $("#orgTitle").val(),
        success: function (data) {
            flog("success", data);

            var $fragment = $(data).find("#org-search");
            $("#org-search").replaceWith($fragment);
            $fragment.show();
            flog("frag", $fragment);
            initOrgSearchCheckbox();
        },
        error: function (resp) {
            Msg.error("An error occurred searching for organisations");
        }
    });
}

function setGroupRecipient(name, groupType, isRecip) {
    flog("setGroupRecipient", name, isRecip);
    try {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                groupName: name,
                isRecip: isRecip
            },
            dataType: "json",
            success: function (data) {
                if (data.status) {
                    flog("saved ok", data);
                    if (isRecip) {
                        var groupClass = "";
                        var groupIcon = "";
                        if (groupType === "P" || groupType === "") {
                            groupClass = "alert alert-success";
                            groupIcon = "clip-users";
                        } else if (groupType === "S") {
                            groupClass = "alert alert-info";
                            groupIcon = "fa fa-trophy";
                        } else if (groupType === "M") {
                            groupClass = "alert alert-info";
                            groupIcon = "fa fa-envelope";
                        }
                        var newBtn = '<span id="group_' + name + '" class="group-list ' + groupClass + '">'
                            + '<i class="' + groupIcon + '"></i>'
                            + '<span class="block-name" title="' + name + '">' + name + '</span>'
                            + '<a href="' + name + '" class="btn btn-xs btn-danger btn-delete-group" title="Delete access for group ' + name + '"><i href="' + name + '" class="fa fa-times"></i></a>'
                            + '</span>';
                        //$(".GroupList").append('<button class="btn btn-sm btn-default reset-margin-bottom" type="button" style="margin-right: 5px;">' + name + '</button>');
                        $(".GroupList").append(newBtn);
                        flog("appended to", $(".GroupList"));
                    } else {
                        var toRemove = $("#group_" + name);
                        toRemove.remove();
                    }
                } else {
                    flog("error", data);
                    Msg.error("Sorry, couldnt save " + data);
                }
            },
            error: function (resp) {
                flog("error", resp);
                Msg.error("Sorry, couldnt save - " + resp);
            }
        });
    } catch (e) {
        flog("exception in createJob", e);
    }
}

function setOrgRecipient(orgId, orgFormattedName, isRecip) {
    flog("setOrgRecipient", orgId, isRecip);
    try {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                orgId: orgId,
                isRecip: isRecip
            },
            dataType: "json",
            success: function (data) {
                if (data.status) {
                    flog("saved ok", data);
                    if (isRecip) {
                        $(".OrganisationList").append('<div class="btn btn-sm btn-default"><span> ' + orgFormattedName + ' </span><a href="' + orgId + '" name="' + orgFormattedName + '" class="btn btn-xs btn-danger" title="Delete"><i class="fa fa-times"></i></a></div>');
                        flog("appended to", $(".OrganisationList"));
                        $("#OrganisationList a[href='" + orgId + "']").click(function (e) {
                            e.preventDefault();
                            var href = $(e.currentTarget).attr("href");
                            var name = $(e.currentTarget).attr("name");
                            flog("remove organisation", e);
                            if (confirm("Are you sure you want to delete " + name + "?")) {
                                setOrgRecipient(href, name, false);
                            }
                        });
                    } else {
                        var toRemove = $(".OrganisationList div").filter(function () {
                            return $(this).children("a").attr("name") == orgFormattedName;
                        });
                        toRemove.remove();
                    }
                } else {
                    flog("error", data);
                    Msg.error("Sorry, couldnt save " + data);
                }
            },
            error: function (resp) {
                flog("error", resp);
                Msg.error("Sorry, couldnt save - " + resp);
            }
        });
    } catch (e) {
        flog("exception in createJob", e);
    }
}

function initImageUploaderViewer() {
    $("#product-images").on("click", ".del-image", function (e) {
        e.preventDefault();
        var target = $(e.target).closest("a");
        var href = target.attr("href");
        var name = getFileName(href);
        confirmDelete(href, name, function () {
            target.closest(".product-image-thumb").remove();
        });
    });
}

function initManageAuctionImage() {
    var imageContainer = $('#product-images');
    var addImageModal = $('#modal-add-image');
    addImageModal.find('form.form-horizontal').forms({
        callback: function () {
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
            '   <div class="modal-header">' +
            '       <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '       <h4 class="modal-title">Upload and crop image</h4>' +
            '   </div>' +
            '   <div class="modal-body">' +
            '       <div class="form-horizontal">' +
            '           <div class="form-group orientation hide">' +
            '               <label class="col-sm-3 control-label" for="newTagName">Orientation</label>' +
            '               <div class="col-sm-9">' +
            '                   <select class="form-control">' +
            '                       <option value="">Default</option>' +
            '                       <option value="square">Square</option>' +
            '                       <option value="vertical">Vertical</option>' +
            '                       <option value="horizontal">Horizontal</option>' +
            '                   </select>' +
            '               </div>' +
            '           </div>' +
            '       </div>' +
            '       {{upcropZone}}' +
            '   </div>' +
            '   <div class="modal-footer">' +
            '       <div class="pull-left">' +
            '           {{buttonUploadOther}}' +
            '       </div>' +
            '       <button class="btn btn-default btn-cancel" type="button" data-dismiss="modal">Cancel</button> ' +
            '       {{buttonCrop}} ' +
            '       {{buttonContinue}}' +
            '   </div>' +
            '</div>',
        onUploadComplete: function (data, name, href) {
            flog("manageAuction.js: onUploadComplete");
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
            setAddImageFormData(data, name, true, true);
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
                        ratio = 1 / 2;
                        break;

                    case 'horizontal':
                        ratio = 2 / 1;
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

    function setAddImageFormData(data, name, ignoreOrientation, isContinue) {
        if (data.result) {
            data = data.result;
        }
        var hash = data.data;
        if (typeof hash == "object") {
            hash = hash.file;
        }

        var isCrop = typeof isContinue === 'undefined';

        flog("setAddImageFormData: data=", data);
        flog("setAddImageFormData: hash=", hash);
        flog("setAddImageFormData: isCrop=", isCrop);
        if (isCrop) {
            name = name.replace(/\.[^/.]+$/, "") + ".png";
        }

        addImageModal.find('.preview').attr('src', data.nextHref);
        addImageModal.find('input[name=hash]').val(hash); // the hash of the 'file' file input that was uploaded
        addImageModal.find('input[name=fileName]').val(name);
        addImageModal.find('input[name=orientation]').val(ignoreOrientation ? '' : upcropZone.find('.orientation select').val());
        flog('set', addImageModal.find('input[name=fileName]'));
        upcropZone.find('.orientation select').val('');
        upcropZone.addClass('hide');
        editImageZone.removeClass('hide');
    }

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