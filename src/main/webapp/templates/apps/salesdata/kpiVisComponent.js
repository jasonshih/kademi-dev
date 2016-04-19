(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['kpiVis'] = {
        init: function (contentArea, container, component, keditor) {
            // Do nothing
        },

        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },

        destroy: function (component, keditor) {
            // Do nothing
        },

        settingEnabled: true,

        settingTitle: 'KPI Visualisation Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "blogArticleList" component');

            $.ajax({
                url: '/_components/web/kpiVis?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-kpi').on('change', function () {
                        var selectedKpi = this.value;
                        var dynamicElement = keditor.getSettingComponent().find('[data-dynamic-href]');

                        if (selectedKpi) {
                            var contentArea = dynamicElement.closest('.keditor-content-area');

                            dynamicElement.attr('data-href', selectedKpi);
                            keditor.initDynamicContent(contentArea, dynamicElement);
                        } else {
                            dynamicElement.html('<p>Please select KPI</p>');
                        }
                    });

                    form.find('.select-type').on('change', function () {
                        var dynamicElement = keditor.getSettingComponent().find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');

                        dynamicElement.attr('data-visualisation', this.value);
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });

                    form.find('.kpi-height').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 99) {
                            number = 100;
                            this.value = number;
                        }

                        var dynamicElement = keditor.getSettingComponent().find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');

                        dynamicElement.attr('data-height', number);
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "blogArticleList" component');

            var dynamicElement = component.find('[data-dynamic-href]');
            form.find('.select-kpi').val(dynamicElement.attr('data-href'));
            form.find('.select-type').val(dynamicElement.attr('data-visualisation'));
            form.find('.kpi-height').val(dynamicElement.attr('data-height'));
        },

        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);