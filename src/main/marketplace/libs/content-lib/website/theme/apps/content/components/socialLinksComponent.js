/**
 * Created by Anh on 30/06/2017.
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['socialLinks'] = {
        settingEnabled: true,
        settingTitle: 'Social Links',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "socialLinks" component');

            return $.ajax({
                url: '_components/socialLinks?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-style').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-style', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-target').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-target', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-align').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-align', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.facebook[type=checkbox]').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-facebook', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.twitter[type=checkbox]').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-twitter', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.google[type=checkbox]').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-google', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.linkedin[type=checkbox]').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-linkedin', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    form.find('.youtube[type=checkbox]').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-youtube', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    form.find('.instagram[type=checkbox]').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-instagram', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    

                    form.find('.linkedin[type=text]').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-linkedin-url', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.google[type=text]').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-google-url', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.twitter[type=text]').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-twitter-url', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.facebook[type=text]').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-facebook-url', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.youtube[type=text]').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-youtube-url', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.instagram[type=text]').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-instagram-url', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "socialLinks" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-style').val(dataAttributes['data-style'] || 'circle-animated');
            form.find('.select-target').val(dataAttributes['data-target'] || '');
            form.find('.select-align').val(dataAttributes['data-align'] || '');
            form.find('.facebook[type=checkbox]').prop('checked', dataAttributes['data-facebook'] != 'false');
            form.find('.twitter[type=checkbox]').prop('checked', dataAttributes['data-twitter'] != 'false');
            form.find('.google[type=checkbox]').prop('checked', dataAttributes['data-google'] != 'false');
            form.find('.linkedin[type=checkbox]').prop('checked', dataAttributes['data-linkedin'] != 'false');
            form.find('.youtube[type=checkbox]').prop('checked', dataAttributes['data-youtube'] != 'false');
            form.find('.instagram[type=checkbox]').prop('checked', dataAttributes['data-instagram'] != 'false');
            form.find('.facebook[type=text]').val(dataAttributes['data-facebook-url']);
            form.find('.twitter[type=text]').val(dataAttributes['data-twitter-url']);
            form.find('.google[type=text]').val(dataAttributes['data-google-url']);
            form.find('.linkedin[type=text]').val(dataAttributes['data-linkedin-url']);
            form.find('.youtube[type=text]').val(dataAttributes['data-youtube-url']);
            form.find('.instagram[type=text]').val(dataAttributes['data-instagram-url']);
        }
    };

})(jQuery);