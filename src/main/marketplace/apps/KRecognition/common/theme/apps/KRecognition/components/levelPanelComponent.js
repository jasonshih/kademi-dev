(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['levelPanel'] = {
        settingEnabled: true,

        settingTitle: 'Achievement Level',

        initSettingForm: function (form, keditor) {
            return $.ajax({
                url: '_components/levelPanel?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-topic').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-topic', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-display-type').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-display-type', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.chk-show-topic-name').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-show-topic-name', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "levelPanel" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-topic').val(dataAttributes['data-topic']);
            form.find('.select-display-type').val(dataAttributes['data-display-type'] || 'text-icon');
            form.find('.chk-show-topic-name').prop('checked', dataAttributes['data-show-topic-name'] === 'true');
        }
    };

})(jQuery);