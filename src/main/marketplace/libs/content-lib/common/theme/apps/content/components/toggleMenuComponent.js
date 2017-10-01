(function ($) {
    var KEditor = $.keditor;
    var contentEditor = $.contentEditor;
    var flog = KEditor.log;

    KEditor.components['toggleMenu'] = {
        settingEnabled: true,
        settingTitle: 'Menu Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "menu" component');

            $.getScriptOnce('/theme/apps/content/toggleMenu.js');

            return $.ajax({
                url: '_components/toggleMenu?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    contentEditor.initDefaultMenuControls(form, keditor);

                    form.find('#cbbTriggerSize').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-trigger-size', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#cbbTriggerAlign').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-trigger-align', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#cbbTriggerColor').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-trigger-color', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#txtTriggerClass').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-trigger-class', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "menu" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('#cbbTriggerSize').val(dataAttributes['data-trigger-size']);
            form.find('#cbbTriggerColor').val(dataAttributes['data-trigger-color']);
            form.find('#txtTriggerClass').val(dataAttributes['data-trigger-class']);
            form.find('#txtTriggerAlign').val(dataAttributes['data-trigger-align']);

            contentEditor.showDefaultMenuControls(form, component, keditor);
        }

    };

})(jQuery);