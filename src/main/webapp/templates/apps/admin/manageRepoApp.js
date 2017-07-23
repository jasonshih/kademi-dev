function initManageRepoApp() {
    initHtmlEditors();
    initInputLimiter();
    initForPublished();
    initForm();
    initMarketForm();
    initPublishApp();
    initRePublishApp();
    initUnPublishApp();
    initUpload();
    initBannerUpload();
    initDeleteBanner();
    initLogoUpload();
    initDeleteLogo();
    initScreenshotDelete();
    PagesGallery.init();
    
    $('abbr.timeago').timeago();
}

function initInputLimiter() {
    $('.limited').inputlimiter({
        remText: 'You only have %n character%s remaining...',
        remFullText: 'Stop typing! You\'re not allowed any more characters!',
        limitText: 'You\'re allowed to input %n character%s into this field.'
    });
}

function initForPublished() {
    $('body').on('click', '#published', function (e) {
        var btn = $(this);
        var isChecked = btn.is(":checked");
        var forPublished = $('.for-published');
        if (isChecked) {
            forPublished.show('slow');
        } else {
            forPublished.hide('slow');
        }
    });
}

function initForm() {
    var form = $('#details').find('form');
    
    form.forms({
        onSuccess: function (resp) {
            if (resp.status) {
                Msg.success("Successfully saved.");
                setUrl();
            } else {
                Msg.warning("Oh No! Something went wrong!")
            }
        }
    });
}

function initMarketForm() {
    var marketForm = $('#market').find('form');
    
    marketForm.forms({
        onSuccess: function (resp) {
            if (resp.status) {
                Msg.success("Saved");
            }
        }
    });
}

function initPublishApp() {
    $('body').on('click', '.publishApp', function (e) {
        e.preventDefault();
        
        Kalert.confirm("Are you sure you want to publish this app?", function () {
            $.ajax({
                type: 'POST',
                url: window.location.pathname,
                data: {publishApp: true},
                dataType: 'json',
                success: function (data) {
                    flog("success", data);
                    window.location.reload();
                },
                error: function (resp) {
                    Msg.error("An error occured doing the publish. Please check your internet connection and try again");
                }
            });
        });
    });
}

function initRePublishApp() {
    $('body').on('click', '.rePublishApp', function (e) {
        e.preventDefault();
        Kalert.confirm("Are you sure you want to re-publish this app?", function () {
            $.ajax({
                type: 'POST',
                url: window.location.pathname,
                data: {publishApp: true},
                dataType: 'json',
                success: function (data) {
                    flog("success", data);
                    window.location.reload();
                },
                error: function (resp) {
                    Msg.error("An error occured doing the publish. Please check your internet connection and try again");
                }
            });
        });
    });
}

function initUnPublishApp() {
    $('body').on('click', '.unPublishApp', function (e) {
        e.preventDefault();
        Kalert.confirm("Are you sure you want to un publish this app?", function () {
            $.ajax({
                type: 'POST',
                url: window.location.pathname,
                data: {unPublishApp: true},
                dataType: 'json',
                success: function (data) {
                    flog("success", data);
                    window.location.reload();
                },
                error: function (resp) {
                    Msg.error("An error occured doing the publish. Please check your internet connection and try again");
                }
            });
        });
    });
}

function setUrl() {
    var appName = $("#appName");
    
    history.pushState(null, null, "/manageApps/" + appName.val() + '/');
}

function initUpload() {
    Dropzone.autoDiscover = false;
    $("#uploadImageDropzone").dropzone({
        paramName: "screenshots", // The name that will be used to transfer the file
        maxFilesize: 500.0, // MB
        addRemoveLinks: true,
        parallelUploads: 2,
        uploadMultiple: true
    });
    var dz = Dropzone.forElement("#uploadImageDropzone");
    dz.on("success", function (file, resp) {
        flog("added file", file);
        addScreenshot(file);
    });
    dz.on("error", function (file, errorMessage) {
        Msg.error("An error occured uploading: " + file.name + " because: " + errorMessage);
    });
    
    $('body').on('hidden.bs.modal', '#modal-image-upload', function () {
        dz.removeAllFiles();
        //$('#screenshot-div').reloadFragment();
    });
}

function initBannerUpload() {
    var bannerImage = $("#bannerImage");
    $('#upload-banner').upcropImage({
        buttonContinueText: 'Save',
        url: window.location.pathname, // this is actually the default value anyway
        ratio: 8 / 3,
        fieldName: "banner",
        onCropComplete: function (resp) {
            flog("onCropComplete:", resp, resp.nextHref);
            updateImageHref(bannerImage, resp.nextHref, 'noBanner', false);
        },
        onContinue: function (resp) {
            flog("onContinue:", resp, resp.result.nextHref);
            updateImageHref(bannerImage, resp.result.nextHref, 'noBanner', false);
        }
    });
}

function initDeleteBanner() {
    var bannerImage = $("#bannerImage");
    $('body').on('click', '.delete-banner', function (e) {
        e.preventDefault();
        var btn = $(this);
        var href = btn.attr('href');
        
        confirmDelete(href, "the banner", function (resp) {
            updateImageHref(bannerImage, '/theme/apps/marketplace/no_banner.png', 'noBanner', true);
        });
    });
}

function initLogoUpload() {
    var btn = $('#upload-logo');
    var logoImage = $('#logoImage');
    btn.upcropImage({
        buttonContinueText: 'Save',
        ratio: 32 / 15,
        url: window.location.pathname,
        fieldName: "logo",
        onCropComplete: function (resp) {
            flog("onCropComplete:", resp, resp.nextHref);
            updateImageHref(logoImage, resp.nextHref, 'noLogo', false);
        },
        onContinue: function (resp) {
            flog("onContinue:", resp, resp.result.nextHref);
            Msg.info("Done");
            updateImageHref(logoImage, resp.result.nextHref, 'noLogo', false);
        }
    });
}

function initDeleteLogo() {
    var logoImage = $('#logoImage');
    $('body').on('click', '.delete-logo', function (e) {
        e.preventDefault();
        var btn = $(this);
        var href = btn.attr('href');
        
        confirmDelete(href, "the logo", function (resp) {
            updateImageHref(logoImage, '/theme/apps/marketplace/no_logo.png', 'noLogo', true);
        });
    });
}

function updateImageHref(elem, href, cl, deleted) {
    flog("updateImageHref", elem, href, deleted);
    elem.find('.cboxElement').attr('href', href);
    elem.find('img').attr('src', href + '?' + (new Date).getTime());
    elem.find('.delete-logo').attr('href', href);
    elem.find('.delete-banner').attr('href', href);
    if (deleted) {
        elem.find('.delete-logo').addClass(cl);
        elem.find('.delete-banner').addClass(cl);
    } else {
        elem.find('.delete-logo').removeClass(cl);
        elem.find('.delete-banner').removeClass(cl);
    }
}

function initScreenshotDelete() {
    $("body").on("click", ".delete-screenshot", function (e) {
        e.preventDefault();
        var btn = $(this);
        var href = btn.attr("href");
        var name = btn.data("title");
        confirmDelete(href, name, function () {
            var divThumb = btn.closest(".gallery-img");
            divThumb.hide("fast", function () {
                $(this).remove();
            })
        });
    });
}

function addScreenshot(file) {
    var screenshots = $('#screenshots');
    
    var newDiv = $(
        '<div class="col-md-3 col-sm-4 gallery-img" style="display:none;">\n' +
        '    <div class="wrap-image" data-href="' + 'SCREENSHOT_' + file.name + '">\n' +
        '        <a class="group1 cboxElement" href="' + 'SCREENSHOT_' + file.name + '" title="' + file.name + '">\n' +
        '            <img src="' + 'SCREENSHOT_' + file.name + '" alt="" class="img-responsive">\n' +
        '        </a>\n' +
        '        <div class="tools tools-bottom">\n' +
        '            <a href="' + 'SCREENSHOT_' + file.name + '" data-title="' + file.name + '" class="delete-screenshot pull-right" title="Delete ' + file.name + '">\n' +
        '            <i class="fa fa-trash"></i>\n' +
        '            </a>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>'
    );
    
    newDiv.find(".group1").colorbox({
        rel: 'group1',
        transition: "none",
        width: "100%",
        height: "100%",
        retinaImage: true
    });
    screenshots.append(newDiv);
    
    newDiv.show("slow");
}

var initCreateMarketItem = function () {
    var marketItemModal = $('#makeMarketItem');
    var marketItemForm = marketItemModal.find('form');
    
    marketItemForm.forms({
        onSuccess: function (resp) {
            flog("Callback ", resp);
            if (resp.status) {
                marketItemModal.modal('hide');
                window.location.reload();
            } else {
                Msg.warning(resp.messages[0]);
            }
        }
    });
};