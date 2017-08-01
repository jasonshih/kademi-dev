(function ($) {
    // Init fetch Auth Code
    function initFetchAuthCode() {
        $('body').on('click', '.btn-aws-genauthcode', function (e) {
            e.preventDefault();

            $('.aws-auth-loading').show();

            $.ajax({
                url: '?fetchAuthorizationCode',
                dataType: "json",
                success: function (resp) {
                    $('.aws-auth-loading').hide();

                    if (resp.status) {
                        Kalert.info('Authorization code', 'The code is: ' + resp.data);
                    } else {
                        Kalert.error('Oh No! Something went wrong with your request!');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $('.aws-auth-loading').hide();
                    Kalert.error('Oh No! Something went wrong with your request!');
                }
            });
        });
    }

    // Init Toggle Autorenew
    function initToggleAutorenew() {
        $('body').on('click', '.btn-aws-toggle-autorenew', function (e) {
            e.preventDefault();

            var lbl = $('.lbl-aws-autorenew');

            var autorenew = lbl.data('autorenew');
            var newVal = !autorenew;

            $.ajax({
                type: 'POST',
                dataType: 'JSON',
                data: {
                    changeAutoRenew: newVal
                },
                success: function (resp) {
                    if (resp.status) {
                        lbl.data('autorenew', newVal);

                        if (newVal) {
                            lbl.html('Enabled (<a href="#" class="btn-aws-toggle-autorenew">disable</a>)');
                        } else {
                            lbl.html('Disabled (<a href="#" class="btn-aws-toggle-autorenew">enable</a>)');
                        }
                    } else {
                        Kalert.error('Oh No! Something went wrong with your request!');
                    }
                },
                error: function () {
                    Kalert.error('Oh No! Something went wrong with your request!');
                }
            });
        });
    }

    // Init Edit Nameservers
    function initEditNameservers() {
        var modal = $('#awsEditNameServers');
        var form = modal.find('form');

        $('body').on('click', '.btn-aws-edit-ns', function (e) {
            e.preventDefault();

            modal.modal('show');
        });

        form.forms({
            onSuccess: function (resp) {
                
            }
        });
    }

    // Run Init methods
    $(function () {
        initFetchAuthCode();
        initToggleAutorenew();
        //initEditNameservers();
    });
})(jQuery);