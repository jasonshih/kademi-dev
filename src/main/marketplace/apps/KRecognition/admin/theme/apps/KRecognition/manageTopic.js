(function ($) {

    function initSaveDetails() {
        $("#topic-detail-form").forms({
            onSuccess: function (resp, form, config) {
                Msg.success("Saved");
            }
        });
    }

    function initSelectLevelsValueType() {
        $('body').on('change', '.krecognition-select-levels-value', function (e) {
            var sel = $(this);
            var val = sel.val();
            if (val === '' || val === null) {
                $('.krecognition-select-dataSeries').hide().find('select').val('');
                $('.krecognition-select-pointsBucket').hide().find('select').val('');
            } else {
                $('.krecognition-select-dataSeries').hide().find('select').val('');
                $('.krecognition-select-pointsBucket').hide().find('select').val('');

                $('.krecognition-select-' + val).show();
            }

        });
    }

    function initCreateBadge() {
        var modal = $('#model-krecognition-create-badge');
        var form = modal.find('form');

        form.forms({
            onSuccess: function (resp) {
                Msg.success(resp.messages);

                reloadBadges();

                modal.modal('hide');
                form.trigger('reset');
            }
        });
    }

    function initBadgeImageUpload() {
        flog('initBadgeImageUpload');
        $('.btn-krecognition-badge-img-upload').each(function (i, item) {
            var btn = $(item);
            var badgeid = btn.data('badgeid');

            btn.upcropImage({
                buttonContinueText: 'Save',
                url: window.location.pathname + '?uploadBadgeImage&badgeid=' + badgeid,
                fieldName: 'badgeImg',
                onCropComplete: function (resp) {
                    flog('onCropComplete:', resp, resp.nextHref);
                    reloadBadges();
                },
                onContinue: function (resp) {
                    flog('onContinue:', resp, resp.result.nextHref);
                    $.ajax({
                        url: window.location.pathname,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            uploadedHref: resp.result.nextHref,
                            applyImage: true
                        },
                        success: function (resp) {
                            flog('success');
                            if (resp.status) {
                                Msg.info('Done');
                                reloadBadges();
                            } else {
                                Msg.error('An error occured processing the badge image.');
                            }
                        },
                        error: function () {
                            alert('An error occured processing the badge image.');
                        }
                    });
                }
            });
        });
    }

    function initBadgeImageDelete() {
        $('body').on('click', '.btn-krecognition-badge-img-del', function (e) {
            e.preventDefault();

            var btn = $(this);
            var badgeid = btn.data('badgeid');

            Kalert.confirm('You want to remove the badge image?', 'Ok', function () {
                $.ajax({
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        removeBadgeImage: badgeid
                    },
                    success: function (resp) {
                        Kalert.close();

                        if (resp.status) {
                            reloadBadges();
                            Msg.success(resp.messages);
                        } else {
                            Msg.warning(resp.messages);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        reloadBadges();
                        Kalert.close();

                        Msg.error('Oh No! Something went wrong!');
                    }
                });
            });
        });
    }

    function initBadgeDelete() {
        $('body').on('click', '.btn-krecognition-badge-del', function (e) {
            e.preventDefault();

            var btn = $(this);
            var badgeid = btn.data('badgeid');

            Kalert.confirm('You want to delete this badge?', 'Ok', function () {
                $.ajax({
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        deleteBadge: badgeid
                    },
                    success: function (data, textStatus, jqXHR) {
                        Kalert.close();

                        if (resp.status) {
                            reloadBadges();
                            Msg.success(resp.messages);
                        } else {
                            Msg.warning(resp.messages);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        reloadBadges();
                        Kalert.close();

                        Msg.error('Oh No! Something went wrong!');
                    }
                });
            });
        });
    }

    function reloadBadges() {
        $('#krecognition-badges-body').reloadFragment({
            whenComplete: function () {
                initBadgeImageUpload();
            }
        });
    }

    $(function () {
        initSaveDetails();
        initSelectLevelsValueType();
        initCreateBadge();
        initBadgeImageUpload();
        initBadgeImageDelete();
        initBadgeDelete();
    });
})(jQuery);