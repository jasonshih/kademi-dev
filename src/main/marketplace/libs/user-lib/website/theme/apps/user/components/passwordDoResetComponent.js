(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['passwordDoReset'] = {
        settingEnabled: true,
        settingTitle: 'Password Do Reset Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "passwordDoReset" component');
            
            return $.ajax({
                url: '_components/passwordDoReset?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    var attrs = ['reset-password-text', 'create-password-text', 'description-text', 'cant-reset-password-text', 'cant-reset-password-description-text', 'placeholder-text', 'button-text', 'redirection-text'];
                    
                    $.each(attrs, function (i, value) {
                        form.find('.txt-' + value).on('change', function () {
                            var component = keditor.getSettingComponent();
                            var dynamicElement = component.find('[data-dynamic-href]');
                            
                            component.attr('data-' + value, this.value);
                            keditor.initDynamicContent(dynamicElement);
                        });
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "passwordDoReset" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            var attrs = {
                'reset-password-text': 'Reset your password',
                'create-password-text': 'Create a password',
                'description-text': 'Enter a new password below.',
                'cant-reset-password-text': 'Cannot reset password',
                'cant-reset-password-description-text': 'Sorry, the user account with your email address does not have access to this site',
                'placeholder-text': 'New Password',
                'button-text': 'Update password',
                'redirection-text': 'Done! Redirecting to your profile page...'
            };
            
            $.each(attrs, function (name, value) {
                form.find('.txt-' + name).val(dataAttributes['data-' + name] || value);
            });
        }
    };
    
})(jQuery);