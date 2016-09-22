(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['singleValue'] = {
        initSingleValue: function () {
            flog('initSingleValue');

            $('.panel-pie-chart').each(function () {
                var queryData = $(this);

                if (!queryData.hasClass('initialized-pieChart')) {
                    queryData.pieChartAgg();
                    queryData.addClass('initialized-pieChart');
                }
            });
        },
        settingEnabled: true,
        settingTitle: 'Single Value Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "singleValue" component');

            return $.ajax({
                url: '_components/singleValue?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-query').on('change', function () {
                        var selectedQuery = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-query', selectedQuery);
                        keditor.initDynamicContent(dynamicElement);

                    });

                    form.find('.select-agg').on('change', function () {
                        var selectedAgg = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-agg', selectedAgg);

                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.value-label').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-label', this.value);

                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.value-icon').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-icon', this.value);

                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.value-link').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-link', this.value);

                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "queryTable" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-query').val(dataAttributes['data-query']);
            form.find('.select-agg').val(dataAttributes['data-agg']);
            form.find('.value-label').val(dataAttributes['data-label']);
            form.find('.value-icon').val(dataAttributes['data-icon']);
            form.find('.value-link').val(dataAttributes['data-link']);
        }
    };

})(jQuery);