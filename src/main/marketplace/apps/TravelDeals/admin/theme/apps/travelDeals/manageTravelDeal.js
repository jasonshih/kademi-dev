(function ($) {
    function initDetailsForm() {
        var form = $('#dealForm');
        form.forms({
            onSuccess: function (resp) {
                if (resp.nextHref) {
                    window.location.pathname = resp.nextHref;
                } else {
                    Msg.success(resp.messages);
                }
            }
        });
    }

    function initPublish() {
        $('body').on('click', '.deal-publish', function (e) {
            e.preventDefault();
            Kalert.confirm('You want to publish this deal?', 'Ok', function () {
                setPublishedStatus(true);
            });
        });

        $('body').on('click', '.deal-unpublish', function (e) {
            e.preventDefault();
            Kalert.confirm('You want to un-publish this deal?', 'Ok', function () {
                setPublishedStatus(false);
            });
        });
    }

    function setPublishedStatus(publish) {
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            dataType: 'JSON',
            data: {
                publish: publish
            },
            success: function (data, textStatus, jqXHR) {
                flog('success', data, textStatus);
                if (data.status) {
                    Msg.success(data.messages);
                    if (publish) {
                        $('.deal-unpublish').removeClass('hide');
                        $('.deal-publish').addClass('hide');
                    } else {
                        $('.deal-publish').removeClass('hide');
                        $('.deal-unpublish').addClass('hide');
                    }
                } else {

                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                flog('error', textStatus, errorThrown);
            }
        });
    }

    function initTipTableSort() {
        $("#tipsBody").sortable({
            items: "> tr",
            appendTo: "parent",
            helper: "clone",
            axis: "y",
            stop: function (event, ui) {
                var item = ui.item;
                var prevItem = item.prev('tr');
                var id = item.data('id');
                var prevId = prevItem.data('id');
                flog(id, prevId);
                $.ajax({
                    url: window.location.pathname,
                    dataType: 'json',
                    type: 'POST',
                    data: {
                        reorderTip: true,
                        id: id,
                        prevId: prevId
                    },
                    success: function (data, textStatus, jqXHR) {
                        if (data.status) {
                            $('#tipsBody').reloadFragment();
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }
                });
            }
        }).disableSelection();
    }

    function initCreateTipModal() {
        var modal = $('#modal-add-tip');
        var form = modal.find('form');
        form.forms({
            onSuccess: function (resp) {
                Msg.success(resp.messages);
                modal.modal('hide');
                $('#tipsBody').reloadFragment();
                form.trigger('reset');
            }
        });
    }

    function initDeleteTip() {
        $('body').on('click', '.btn-delete-tip', function (e) {
            e.preventDefault();
            var btn = $(this);
            var tr = btn.closest('tr');
            var id = tr.data('id');
            if (confirm('Are you sure you want to delete this tip?')) {
                $.ajax({
                    url: window.location.pathname,
                    dataType: 'json',
                    type: 'POST',
                    data: {
                        deleteTip: id
                    },
                    success: function (data, textStatus, jqXHR) {
                        if (data.status) {
                            $('#tipsBody').reloadFragment();
                        }
                    }
                });
            }
        });
    }

    function initCreateLinkModal() {
        var modal = $('#modal-add-link');
        var form = modal.find('form');
        form.forms({
            onSuccess: function (resp) {
                Msg.success(resp.messages);
                modal.modal('hide');
                $('#linksBody').reloadFragment();
                form.trigger('reset');
            }
        });
    }

    function initLinkTableSort() {
        $("#linksBody").sortable({
            items: "> tr",
            appendTo: "parent",
            helper: "clone",
            axis: "y",
            stop: function (event, ui) {
                var item = ui.item;
                var prevItem = item.prev('tr');
                var id = item.data('id');
                var prevId = prevItem.data('id');
                flog(id, prevId);
                $.ajax({
                    url: window.location.pathname,
                    dataType: 'json',
                    type: 'POST',
                    data: {
                        reorderLink: true,
                        id: id,
                        prevId: prevId
                    },
                    success: function (data, textStatus, jqXHR) {
                        if (data.status) {
                            $('#linksBody').reloadFragment();
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }
                });
            }
        }).disableSelection();
    }

    function initDeleteLink() {
        $('body').on('click', '.btn-delete-link', function (e) {
            e.preventDefault();
            var btn = $(this);
            var tr = btn.closest('tr');
            var id = tr.data('id');
            if (confirm('Are you sure you want to delete this link?')) {
                $.ajax({
                    url: window.location.pathname,
                    dataType: 'json',
                    type: 'POST',
                    data: {
                        deleteLink: id
                    },
                    success: function (data, textStatus, jqXHR) {
                        if (data.status) {
                            $('#linksBody').reloadFragment();
                        }
                    }
                });
            }
        });
    }

    var previewUpcropContainer = null;

    function initPreviewUpload() {
        var image = $("#previewImage");
        var uploadBtn = $('#upload-preview');
        var changeBtn = $('#change-preview');
        var removeBtn = $('#remove-preview');

        var dimensions = image.closest('.preview-image-wrapper').data('dimensions') || '650x216';
        var dimensionParts = dimensions.split('x');
        var aspectRatio = dimensionParts[0] / dimensionParts[1];

        $('.upload-preview').upcropImage({
            buttonContinueText: 'Save',
            url: window.location.pathname + '?uploadPreview=true',
            ratio: aspectRatio,
            fieldName: "preview",
            onCropComplete: function (resp) {
                image.attr('src', resp.nextHref);
                image.show();
                uploadBtn.hide();
                changeBtn.show();
                removeBtn.show();
            },
            onContinue: function (resp) {
                image.attr('src', resp.nextHref);
                image.show();
                uploadBtn.hide();
                changeBtn.show();
                removeBtn.show();
            },
            onReady: function (container) {
                previewUpcropContainer = $(container);
                flog('onReady', container, previewUpcropContainer);
            },
            onUploadComplete: function (data, name, href) {
                previewUpcropContainer.find('.btn-continue').addClass('hide');

                flog('onUploadComplete', previewUpcropContainer, previewUpcropContainer.find('.btn-continue'));
            }
        });
        $('body').on('click', '#remove-preview', function (e) {
            e.preventDefault();
            if (confirm('Are you sure you want to remove the preview image?')) {
                $.ajax({
                    url: window.location.pathname,
                    dataType: 'json',
                    type: 'POST',
                    data: {
                        removePreview: true
                    },
                    success: function (data, textStatus, jqXHR) {
                        if (data.status) {
                            image.hide();
                            uploadBtn.show();
                            changeBtn.hide();
                            removeBtn.hide();
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }
                });
            }
        });
    }

    var bannerUpcropContainer = null;

    function initBannerUpload() {
        var bannerImage = $("#bannerImage");
        var uploadBtn = $('#upload-banner');
        var changeBtn = $('#change-banner');
        var removeBtn = $('#remove-banner');
        var dimensions = bannerImage.closest('.banner-image-wrapper').data('dimensions') || '650x216';

        var dimensionParts = dimensions.split('x');
        var aspectRatio = dimensionParts[0] / dimensionParts[1];

        $('.upload-banner').upcropImage({
            buttonContinueText: 'Save',
            url: window.location.pathname + '?uploadBanner=true', // this is actually the default value anyway
            ratio: aspectRatio,
            fieldName: "banner",
            onCropComplete: function (resp) {
                flog("onCropComplete:", resp, resp.nextHref);
                bannerImage.attr('src', resp.nextHref);
                bannerImage.show();
                uploadBtn.hide();
                changeBtn.show();
                removeBtn.show();
            },
            onContinue: function (resp) {
                flog("onContinue:", resp, resp.result.nextHref);
                bannerImage.attr('src', resp.nextHref);
                bannerImage.show();
                uploadBtn.hide();
                changeBtn.show();
                removeBtn.show();
            },
            onReady: function (container) {
                bannerUpcropContainer = $(container);
            },
            onUploadComplete: function (data, name, href) {
                bannerUpcropContainer.find('.btn-continue').addClass('hide');
            }
        });
        $('body').on('click', '#remove-banner', function (e) {
            e.preventDefault();
            if (confirm('Are you sure you want to remove the banner image?')) {
                $.ajax({
                    url: window.location.pathname,
                    dataType: 'json',
                    type: 'POST',
                    data: {
                        removeBanner: true
                    },
                    success: function (data, textStatus, jqXHR) {
                        if (data.status) {
                            bannerImage.hide();
                            uploadBtn.show();
                            changeBtn.hide();
                            removeBtn.hide();
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }
                });
            }
        });
    }

    function initTravelBetweenPicker() {
        var startField = $('#validBetweenStart');
        var endField = $('#validBetweenEnd');
        var now = new moment().format('DD/MM/YYYY');

        flog('initTravelBetweenPicker', startField.val(), endField.val(), now);

        var options = {
            locale: {
                format: 'DD/MM/YYYY'
            }
        };

        if (startField.val().length > 0) {
            options.startDate = startField.val();
        }

        if (endField.val().length > 0) {
            options.endDate = endField.val();
        }

        $('#validBetweenDate').daterangepicker(options, function (start, end) {
            startField.val(start.format('DD/MM/YYYY'));
            endField.val(end.format('DD/MM/YYYY'));
        });
    }

    function initBrochureUpload() {
        $('.btn-travelDeals-add-file').mupload({
            buttonText: 'Upload <i class="fa fa-upload"></i>',
            url: window.location.pathname + '?uploadFiles=true',
            useJsonPut: false,
            oncomplete: function (data, name, href) {
                $('#tabel-travelDeals-files').reloadFragment();
            }
        });

        $('body').on('click', '.btn-travelDeals-file-del', function (e) {
            e.preventDefault();

            var row = $(this).closest('tr');
            var fileName = row.data('filename');

            Kalert.confirm('You want to delete this file?', 'Ok', function () {
                $.ajax({
                    url: window.location.pathname,
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        removeFiles: fileName
                    },
                    success: function () {
                        row.remove();
                    },
                    error: function () {
                        Msg.error('Error when removing file');
                    }
                });
            });
        });
    }

    $(function () {
        initDetailsForm();
        initTipTableSort();
        initCreateTipModal();
        initDeleteTip();
        initCreateLinkModal();
        initLinkTableSort();
        initDeleteLink();
        initPublish();
        initPreviewUpload();
        initBannerUpload();
        initTravelBetweenPicker();
        initBrochureUpload();
    });
})(jQuery);