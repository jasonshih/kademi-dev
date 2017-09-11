(function ($) {
    var KEditor = $.keditor;
    var contentEditor = $.contentEditor;
    var flog = KEditor.log;

    KEditor.components['claimForm'] = {
        settingEnabled: true,

        settingTitle: 'Claim Form Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "claimForm" component');

            return $.ajax({
                url: '_components/claimForm?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.txt-form-title').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-form-title', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.txt-form-description').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-form-description', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    
                    var colorPicker = form.find('.txt-bg-color');
                    contentEditor.initSimpleColorPicker(colorPicker, function (color) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-form-bg-color', color);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "claimForm" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.txt-form-title').val(dataAttributes['data-form-title']);
            form.find('.txt-form-description').val(dataAttributes['data-form-description']);
            form.find('.txt-bg-color').val(dataAttributes['data-form-bg-color'] || '').trigger('update')
        }
    };

})(jQuery);
