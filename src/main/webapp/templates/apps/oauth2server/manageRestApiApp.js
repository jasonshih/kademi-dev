(function ($) {
    // init Image Upload
    function initImageUpload() {
        $('.btn-upload-api-logo').upcropImage({
            buttonContinueText: 'Save',
            url: window.location.pathname, // this is actually the default value anyway
            onCropComplete: function () {
                $('#api-app-logo').reloadFragment();
            },
            onContinue: function (resp) {
                $.ajax({
                    url: window.location.pathname,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        uploadedHref: resp.result.nextHref,
                        applyImage: true
                    },
                    success: function (resp) {
                        if (resp.status) {
                            $('#api-app-logo').reloadFragment();
                        } else {
                            Kalert.error('Sorry!', 'An error occured updating your profile image');
                        }
                    },
                    error: function () {
                        Kalert.error('Oh No!', 'We couldn\'t save your profile image');
                    }
                });
            }
        });
    }

    // Init save details
    function initSaveDetails() {
        var form = $('#form-oauth2server-details');

        form.forms({
            onSuccess: function (resp) {
                Msg.success(resp.messages);
            }
        });
    }

    $(function () {
        initImageUpload();
        initSaveDetails();
    });

})(jQuery);