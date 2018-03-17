(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['debitsActivity'] = {
        settingEnabled: true,
        settingTitle: 'Debits Activity Settings',
        init: function (contentArea, container, component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            var dynamicElement = componentContent.find('[data-dynamic-href]');

            keditor.initDynamicContent(dynamicElement).done(function () {
                var debits = component.find('.debits-activity');
                debits.each(function () {
                    window.initDebitActivityChart($(this));
                })
            });
        },
        initSettingForm: function (form, keditor) {
            return $.ajax({
                url: '_components/debitsActivity?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.debitsActivityBucket').on('change', function () {
                        var selectedBucket = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-bucket', selectedBucket);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            window.initDebitActivityChart(component.find('.debits-activity'))
                        });
                    });

                    form.find('.debitsActivityDays').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 1) {
                            number = 1;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-days', number);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            window.initDebitActivityChart(component.find('.debits-activity'))
                        });
                    });

                    form.find('.debitsActivityHeight').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 99) {
                            number = 100;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-height', number);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            window.initDebitActivityChart(component.find('.debits-activity'))
                        });
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "debitsActivity" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.debitsActivityBucket').val(dataAttributes['data-bucket']);
            form.find('.debitsActivityDays').val(dataAttributes['data-days']);
            form.find('.debitsActivityHeight').val(dataAttributes['data-height']);
        }
    };

})(jQuery);