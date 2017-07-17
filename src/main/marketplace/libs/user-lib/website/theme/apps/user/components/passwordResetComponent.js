(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['passwordReset'] = {
        settingEnabled: true,
        settingTitle: 'Password Reset Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "passwordReset" component');
            
            return $.ajax({
                url: '_components/passwordReset?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    var attrs = ['reset-password-text', 'description-text', 'placeholder-text', 'button-text', 'success-heading-text', 'success-description-text'];
                    
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
            flog('showSettingForm "passwordReset" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
    
            var attrs = {
                'reset-password-text': 'Reset your password',
                'description-text': 'If you can\'t login to your account just enter your email address below and we\'ll email you a link to login.',
                'placeholder-text': 'Enter your email here',
                'button-text': 'Send password reset email',
                'success-heading-text': 'Thanks! You should receive the email with a link in just a moment...',
                'success-description-text': 'When you get the email just click on the link to reset your password.'
            };
            
            $.each(attrs, function (name, value) {
                form.find('.txt-' + name).val(dataAttributes['data-' + name] || value);
            });
        }
    };
    
})(jQuery);