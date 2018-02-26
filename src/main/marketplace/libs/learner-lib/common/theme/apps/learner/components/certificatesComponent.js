(function ($) {
    var KEditor = $.keditor;

    KEditor.components['certificates'] = {
        settingEnabled: true,

        settingTitle: 'Certificates',

        initSettingForm: function (form, keditor) {
            return $.ajax({
                url: '_components/certificates?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.query-height').on('change', function () {
                        var number = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        if (isNaN(number) || number < 200) {
                            number = 200;
                            this.value = number;
                        }

                        component.attr('data-height', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.txt-title').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-table-title', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.query-height').val(dataAttributes['data-height']);
            form.find('.txt-title').val(dataAttributes['data-table-title']);
        }
    };
})(jQuery);