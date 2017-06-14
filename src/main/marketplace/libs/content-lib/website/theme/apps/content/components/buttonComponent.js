(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['button'] = {
        settingEnabled: true,
        settingTitle: 'Button Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "button" component');

            return $.ajax({
                url: '_components/button?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('#cbbButtonSize').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-button-size', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#cbbButtonColor').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-button-color', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#cbbButtonAlign').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-button-align', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#txtButtonClass').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-button-class', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#txtButtonText').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-button-text', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#cbbButtonType').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-button-type', this.value);
                        keditor.initDynamicContent(dynamicElement);

                        form.find('#txtButtonLink').prop('disabled', this.value !== 'link');
                        form.find('#cbbButtonTarget').prop('disabled', this.value !== 'link');
                    });

                    form.find('#txtButtonLink').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-button-link', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#cbbButtonTarget').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-button-target', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "button" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('#cbbButtonSize').val(dataAttributes['data-button-size']);
            form.find('#cbbButtonAlign').val(dataAttributes['data-button-align']);
            form.find('#cbbButtonColor').val(dataAttributes['data-button-color']);
            form.find('#txtButtonClass').val(dataAttributes['data-button-class']);
            form.find('#txtButtonText').val(dataAttributes['data-button-text']);
            form.find('#cbbButtonType').val(dataAttributes['data-button-type']);
            form.find('#txtButtonLink').val(dataAttributes['data-button-link']).prop('disabled', dataAttributes['data-button-type'] !== 'link');
            form.find('#cbbButtonTarget').val(dataAttributes['data-button-target']).prop('disabled', dataAttributes['data-button-type'] !== 'link');
        }

    };
})(jQuery);