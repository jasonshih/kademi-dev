(function ($) {
    // Init add Login Provider
    function initLoginProviderModal() {
        var addProviderModal = $('#add-oauth-provider');
        var form = addProviderModal.find('form');

        form.forms({
            onSuccess: function (resp) {
                if (resp.status) {
                    $('#oauthproviders').reloadFragment();
                    addProviderModal.modal('hide');

                    Msg.success(resp.messages);
                } else {
                    Msg.warning(resp.messages);
                }
            }
        });

        $('body').on('change', '.sel-template', function (e) {
            e.preventDefault();

            var btn = $(this);
            var val = btn.val();

            var template = oauth2Templates[val];

            if (template === null || typeof template === 'undefined') {
                addProviderModal.find('form').trigger('reset');
            } else {
                addProviderModal.find('input[name=providerId]').val(template.providerId);
                addProviderModal.find('select[name=providerType]').val(template.providerTypeId);
                addProviderModal.find('input[name=clientId]').val(template.clientId);
                addProviderModal.find('input[name=clientSecret]').val(template.clientSecret);
                addProviderModal.find('input[name=authLocation]').val(template.authLocation);
                addProviderModal.find('input[name=tokenLocation]').val(template.tokenLocation);
                addProviderModal.find('input[name=profileLocation]').val(template.profileLocation);
                addProviderModal.find('input[name=redirectURI]').val(template.redirectURI);
                addProviderModal.find('input[name=accountId]').val(template.accountId);
                if (template.permissionScopes) {
                    addProviderModal.find('textarea[name=permissionScopes]').val(template.permissionScopes.join(','));
                }
                addProviderModal.find('input[name=displayNamePath]').val(template.displayNamePath);

            }
        });
    }

    function initAddLoginProvider() {
        $('body').on('click', '.btn-add-provider', function (e) {
            e.preventDefault();

            showProviderModal(null, 'add', 'Add a new OAuth2 Provider');
        });
    }

    function initEditLoginProvider() {
        $('body').on('click', '.btn-edit-provider', function (e) {
            e.preventDefault();

            var btn = $(this);
            var selectedProv = btn.closest("div.row");
            var jsonText = selectedProv.data('json');
            flog(jsonText);

            showProviderModal(jsonText, 'edit', 'Edit ');
        });
    }

    function initDeleteLoginProvider() {
        $('body').on('click', '.btn-delete-provider', function (e) {
            e.preventDefault();

            var btn = $(this);
            var providerId = btn.data('id');
            Kalert.confirm('You want to delete ' + providerId + '?', 'Ok', function () {
                $.ajax({
                    type: 'POST',
                    url: window.location.pathname,
                    data: {
                        providerAction: 'delete',
                        providerId: providerId
                    },
                    dataType: 'json',
                    success: function (result) {
                        Msg.info(result.messages);
                        $('#oauthproviders').reloadFragment();
                    }
                });
            });
        });
    }

    function showProviderModal(data, type, title) {
        var add_provider_modal = $('#add-oauth-provider');

        if (data === null || typeof data === 'undefined') {
            add_provider_modal.find('form').trigger('reset');
        } else {
            add_provider_modal.find('input[name=providerId]').val(data.providerId);
            add_provider_modal.find('select[name=providerType]').val(data.providerTypeId);
            add_provider_modal.find('input[name=clientId]').val(data.clientId);
            add_provider_modal.find('input[name=clientSecret]').val(data.clientSecret);
            add_provider_modal.find('input[name=authLocation]').val(data.authLocation);
            add_provider_modal.find('input[name=tokenLocation]').val(data.tokenLocation);
            add_provider_modal.find('input[name=profileLocation]').val(data.profileLocation);
            add_provider_modal.find('input[name=displayNamePath]').val(data.displayNamePath);
            add_provider_modal.find('input[name=redirectURI]').val(data.redirectURI);
            add_provider_modal.find('input[name=accountId]').val(data.accountId);
            if (data.permissionScopes) {
                add_provider_modal.find('textarea[name=permissionScopes]').val(data.permissionScopes.join(','));
            }
        }

        add_provider_modal.find('input[name=providerAction]').val(type);
        add_provider_modal.find('.modal-title').html(title);

        if (type === 'add') {
            add_provider_modal.find('button[data-type=form-submit]').text('Add Provider');
        } else if (type === 'edit') {
            add_provider_modal.find('input[name=origProviderId]').val(data.providerId);
            add_provider_modal.find('button[data-type=form-submit]').text('Save Provider');
        }

        add_provider_modal.modal('show');
    }

    // Run init files
    $(function () {
        initLoginProviderModal();
        initAddLoginProvider();
        initEditLoginProvider();
        initDeleteLoginProvider();
    });
})(jQuery);