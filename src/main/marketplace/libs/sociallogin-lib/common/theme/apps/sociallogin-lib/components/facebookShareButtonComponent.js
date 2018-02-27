/*
 Created by Wesley on 27/02/2018.
 */

(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['facebookShareButton'] = {
        settingEnabled: true,

        settingTitle: 'Facebook Share Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "facebookShareButton" component', form, keditor);

            return $.ajax({
                url: '_components/facebookShareButton?settings',
                type: 'GET',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.shareUrl').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-share-url', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.useCurrent').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-use-current', this.value);

                        if (this.value == 'true') {
                            form.find('.shareUrlWrapper').hide();
                        } else {
                            form.find('.shareUrlWrapper').show();
                        }

                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.successMessage').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-success-message', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "facebookShareButton" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);

            form.find('.shareUrl').val(dataAttributes['data-share-url']);
            form.find('.useCurrent').val(dataAttributes['data-use-current'] || 'true');
            form.find('.successMessage').val(dataAttributes['data-success-message'] || 'Thank you for sharing.');

            if (form.find('.useCurrent').val() == 'true') {
                form.find('.shareUrlWrapper').hide();
            } else {
                form.find('.shareUrlWrapper').show();
            }
        }
    };

})(jQuery);