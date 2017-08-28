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

                $('#krecognition-badges-body').reloadFragment();

                modal.modal('hide');
                form.trigger('reset');
            }
        });
    }

    function initBadgeImageUpload() {
        $('.btn-krecognition-badge-img-upload').each(function (i, item) {
            var btn = $(item);
            var badgeid = btn.data('badgeid');

            btn.upcropImage({
                buttonContinueText: 'Save',
                url: window.location.pathname + '?badgeid=' + badgeid,
                fieldName: 'badgeImg',
                onCropComplete: function (resp) {
                    flog('onCropComplete:', resp, resp.nextHref);
                    reloadVariantList();
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
                                reloadVariantList();
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

    $(function () {
        initSaveDetails();
        initSelectLevelsValueType();
        initCreateBadge();
        initBadgeImageUpload();
    });
})(jQuery);