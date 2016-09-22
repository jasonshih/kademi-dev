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
                        
                        if (selectedQuery) {
                            component.attr('data-query', selectedQuery);
                            var aggsSelect = form.find(".select-agg");
                            self.initSelect(aggsSelect, selectedQuery, null);

                            keditor.initDynamicContent(dynamicElement).done(function () {
                                self.initPieChart();
                            });
                        } else {
                            dynamicElement.html('<p>Please select Query</p>');
                        }                        
                    });

                    form.find('.select-agg').on('change', function () {
                        var selectedAgg = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        if (selectedAgg) {
                            component.attr('data-agg', selectedAgg);
                            keditor.initDynamicContent(dynamicElement).done(function () {
                                self.initPieChart();
                            });
                        } else {
                            dynamicElement.html('<p>Please select a data histogram aggregation</p>');
                        }
                    });

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
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "queryTable" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-query').val(dataAttributes['data-query']);
            form.find('.query-height').val(dataAttributes['data-height']);
        }
    };

})(jQuery);