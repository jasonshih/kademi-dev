(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['salesDataCompare'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "salesDataCompare component', contentArea, container, component, keditor);

            var self = this;

            if ($('[href="/static/nvd3/1.8.2/nv.d3.min.css"]').length === 0) {
                $('head').append('<link href="/static/nvd3/1.8.2/nv.d3.min.css" rel="stylesheet" type="text/css" />');
            }

            $.getScriptOnce('/static/nvd3/1.8.2/d3.min.js', function () {
                $.getScriptOnce('/static/nvd3/1.8.2/nv.d3.min.js', function () {
                    $.getScriptOnce('/theme/apps/reporting/jquery.dateAgg.js', function () {
                        self.initDateAgg();
                    });
                });
            });
        },
        initDateAgg: function () {
            flog('initDateAgg');

            $('.panel-date-histogram').each(function () {
                var queryData = $(this);

                if (!queryData.hasClass('initialized-dateAgg')) {
                    queryData.addClass('initialized-dateAgg');
                    queryData.dateAgg();
                }
            });
            flog("initDateAgg: trigger date changed");
            $(document.body).trigger('pageDateChanged', ["1/1/2016", "1/1/2017", "This year", null]);
        },
        settingEnabled: true,
        settingTitle: 'Date Histogram Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "salesDataCompare" component');

            var self = this;

            return $.ajax({
                url: '_components/salesDataCompare?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.queryType').on('click', function () {
                        var cls = this.value;

                        form.find('.select-query').val('');
                        form.find('.select-agg').val('');
                        form.find('.sub-agg').val('');
                        form.find('.metric-agg').val('');
                        form.find('.select-query option').addClass('hide');
                        form.find('.'+cls).removeClass('hide');

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-queryname', '');
                        component.attr('data-agg', '');
                        component.attr('data-sub-agg', '');
                        component.attr('data-querytype', cls);
                        if (cls === 'queryTable'){
                            form.find('.aggregation, .sub-aggregation, .metric-aggregation').addClass('hide');
                        } else {
                            form.find('.aggregation, .sub-aggregation, .metric-aggregation').removeClass('hide');
                        }

                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-query').on('change', function () {
                        var selectedQuery = this.value;
                        flog("selected", selectedQuery);
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var seelctedQueryType = component.attr('data-querytype');
                        if (!seelctedQueryType){
                            component.attr('data-querytype', 'query');
                        }
                        if (selectedQuery) {
                            component.attr('data-queryname', selectedQuery);
                            var queryType = component.attr('data-querytype');
                            var aggsSelect = form.find(".select-agg");
                            self.initSelect(aggsSelect, selectedQuery, null, queryType);

                            keditor.initDynamicContent(dynamicElement).done(function () {
                                self.initDateAgg();
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
                                self.initDateAgg();
                            });
                        } else {
                            component.attr('data-agg', '');
                            dynamicElement.html('<p>Please select a data histogram aggregation</p>');
                        }
                    });

                    form.find('.sub-agg').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-sub-agg', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initDateAgg();
                        });
                    });

                    form.find('.metric-agg').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-metric-agg', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initDateAgg();
                        });
                    });

                    form.find('.chart-type').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-chart-type', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initDateAgg();
                        });
                    });

                    form.find('.show-stacked').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        var inp = $(this);
                        component.attr('data-stacked', inp.prop("checked"));
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initDateAgg();
                        });
                    });

                    form.find('.show-controls').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        var inp = $(this);
                        component.attr('data-controls', inp.prop("checked"));
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initDateAgg();
                        });
                    });

                    form.find('.show-legend').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        var inp = $(this);
                        component.attr('data-legend', inp.prop("checked"));
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initDateAgg();
                        });
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
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initDateAgg();
                        });
                    });

                    form.find('.txt-title').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-title', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initDateAgg();
                        });
                    });
                }
            });
        },
        initSelect: function (aggsSelect, selectedQuery, selectedAgg, selectedQueryType) {
            flog("initSelect", selectedQuery, selectedAgg);
            if (!selectedQuery){
                return;
            }
            var url = "/queries/" + selectedQuery;
            if (selectedQueryType=='query'){
                url += '?run';
            } else if (selectedQueryType == 'queryTable'){
                url += '?as=json';
            }
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function (resp) {
                    flog('initSelect resp', resp);

                    var aggsHtml = '<option value=""> - None - </option>';
                    var aggs = resp.aggregations;
                    for (var key in aggs) {
                        aggsHtml += '<option value="' + key + '">' + key + '</option>';
                    }
                    aggsSelect.html(aggsHtml);

                    if (selectedAgg) {
                        aggsSelect.val(selectedAgg);
                    }
                },
                error: function (e) {
                    Msg.error(e.status + ': ' + e.statusText);
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "salesDataCompare" component');
            var self = this;
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            var selectedQuery = dataAttributes['data-queryname'];
            var selectedQueryType = dataAttributes['data-querytype'];
            var selectedAgg = dataAttributes['data-agg'];

            form.find('.queryType[value='+selectedQueryType+']').prop('checked', true);
            form.find('.select-query').val(selectedQuery);
            form.find('.select-agg').val(dataAttributes['data-agg']);
            form.find('.sub-agg').val(dataAttributes['data-sub-agg']);
            form.find('.metric-agg').val(dataAttributes['data-metric-agg']);
            form.find('.chart-type').val(dataAttributes['data-chart-type'] || 'bar');

            form.find('.show-stacked').prop("checked", toBool(dataAttributes['data-stacked']));
            form.find('.show-controls').prop("checked", toBool(dataAttributes['data-controls']));
            form.find('.show-legend').prop("checked", toBool(dataAttributes['data-legend']));

            form.find('.query-height').val(dataAttributes['data-height']);
            form.find('.txt-title').val(dataAttributes['data-title']);

            var aggsSelect = form.find(".select-agg");
            self.initSelect(aggsSelect, selectedQuery, selectedAgg, selectedQueryType);
        }
    };

    function toBool(v) {
        if (v === true) {
            return true;
        }
        var b = (v === 'true');
        return b;
    }
})(jQuery);
