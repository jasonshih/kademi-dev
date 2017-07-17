(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['errorDetails'] = {
        settingEnabled: true,
        settingTitle: 'Error Details Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "errorDetails" component');
            
            return $.ajax({
                url: '_components/errorDetails?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    var attrs = ['error-code', 'error-title', 'error-description', 'success-message', 'fail-message'];
                    
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
            flog('showSettingForm "errorDetails" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            var attrs = {
                'error-code': '',
                'error-title': '',
                'error-description': '',
                'success-message': 'Thank you! Those details have been sent',
                'fail-message': 'Sorry, we weren\'t able to send the details automatically.'
            };
            
            $.each(attrs, function (name, value) {
                form.find('.txt-' + name).val(dataAttributes['data-' + name] || value);
            });
        }
    };
    
})(jQuery);