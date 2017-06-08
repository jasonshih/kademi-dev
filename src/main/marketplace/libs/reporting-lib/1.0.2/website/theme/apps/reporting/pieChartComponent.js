(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['pieChart'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "pieChart component', contentArea, container, component, keditor);

            var self = this;

            if ($('[href="/static/nvd3/1.8.2/nv.d3.min.css"]').length === 0) {
                $('head').append('<link href="/static/nvd3/1.8.2/nv.d3.min.css" rel="stylesheet" type="text/css" />');
            }

            $.getScriptOnce('/static/moment/2.17.1/moment.js', function () {
                $.getScriptOnce('/static/nvd3/1.8.2/d3.min.js', function () {
                    $.getScriptOnce('/static/nvd3/1.8.2/nv.d3.min.js', function () {
                        $.getScriptOnce('/theme/apps/reporting/jquery.pieChartAgg.js', function () {
                            self.initPieChart();
                        });
                    });
                });
            });
        },
        initPieChart: function () {
            flog('initPieChart');

            $('.panel-pie-chart').each(function () {
                var queryData = $(this);

                if (!queryData.hasClass('initialized-pieChart')) {
                    queryData.pieChartAgg();
                    queryData.addClass('initialized-pieChart');
                }
            });
        },
        settingEnabled: true,
        settingTitle: 'Pie Chart Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "pieChart" component');

            var self = this;

            return $.ajax({
                url: '_components/pieChart?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    var cbbQuery = form.find('.select-query');

                    form.find('.queryType').on('click', function () {
                        var cls = this.value;

                        cbbQuery.val('');
                        cbbQuery.find('option').addClass('hide');
                        form.find('.' + cls).removeClass('hide');

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-query-type', cls);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    cbbQuery.on('change', function () {
                        var selectedQuery = this.value;
                        flog("selected", selectedQuery);
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

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

                    form.find('.select-position').on('change', function () {
                        var selectedAgg = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-legend-position', selectedAgg);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPieChart();
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
                            self.initPieChart();
                        });
                    });

                    form.find('.txt-title').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-title', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPieChart();
                        });
                    });
                    
                    form.find('.show-legend').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        var inp = $(this);
                        component.attr('data-legend', inp.prop("checked"));
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPieChart();
                        });
                    });

                    form.find('.show-legend-values').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        var inp = $(this);
                        component.attr('data-legend-values', inp.prop("checked"));
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPieChart();
                        });
                    });

                    form.find('.show-labels').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        var inp = $(this);
                        component.attr('data-labels', inp.prop("checked"));
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPieChart();
                        });
                    });

                    var colorPicker = form.find('.color-picker');
                    initColorPicker(colorPicker);

                    var colorsWrapper = form.find('.colors-wrapper');

                    form.find('.btn-save-colors').on('click', function (e) {
                        e.preventDefault();

                        var colors = [];
                        colorsWrapper.find('.color').each(function () {
                            colors.push($(this).attr('data-color'));
                        });

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-colors', colors.join(','));
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPieChart();
                        });
                    });

                    form.find('.btn-add-color').on('click', function (e) {
                        e.preventDefault();

                        var color = colorPicker.colorpicker('getValue', '');

                        if (color !== '') {
                            self.addColor(form, color);
                            colorPicker.colorpicker('setValue', 'transparent');
                            colorPicker.find('.txt-bg-color').val('');
                        }
                    });

                    form.on('click', '.btn-delete-color', function (e) {
                        e.preventDefault();

                        $(this).closest('.color').remove();
                    });
                }
            });
        },
        addColor: function (form, color) {
            form.find('.colors-wrapper').append(
                '<div class="input-group input-group-sm color" data-color="' + color + '" style="margin-bottom: 5px;">' +
                '    <div class="form-control">' +
                '        <div style="background-color: ' + color + ';">&nbsp;</div>' +
                '    </div>' +
                '    <span class="input-group-btn">' +
                '        <button class="btn btn-danger btn-delete-color" type="button" title="Delete this color"><i class="fa fa-times"></i></button>' +
                '    </span>' +
                '</div>'
            );
        },
        initSelect: function (aggsSelect, selectedQuery, selectedAgg) {
            flog("initSelect", selectedQuery, selectedAgg);

            $.ajax({
                url: "/queries/" + selectedQuery + "?run",
                type: 'GET',
                dataType: 'json',
                success: function (resp) {
                    flog('resp', resp);

                    var aggsHtml = '<option value""> - None - </option>';
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
            flog('showSettingForm "pieChart" component');

            var self = this;
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            var selectedQuery = dataAttributes['data-query'];
            var selectedAgg = dataAttributes['data-agg'];

            form.find('.select-query').val(selectedQuery);
            form.find('.select-agg').val(dataAttributes['data-agg']);
            form.find('.select-position').val(dataAttributes['data-legend-position']);
            form.find('.query-height').val(dataAttributes['data-height']);
            form.find('.txt-title').val(dataAttributes['data-title']);
            form.find('.show-legend').prop("checked", toBool(dataAttributes['data-legend']));
            form.find('.show-legend-values').prop("checked", toBool(dataAttributes['data-legend-values']));
            form.find('.show-labels').prop("checked", toBool(dataAttributes['data-labels']));

            form.find('.queryType[value=' + dataAttributes['data-query-type'] + ']').prop("checked", true);
            form.find('.select-query option').addClass('hide');
            form.find('.' + dataAttributes['data-query-type']).removeClass('hide');

            form.find('.colors-wrapper').html('');
            var dataColors = (dataAttributes['data-colors'] || '').trim();
            if (dataColors !== '') {
                $.each(dataColors.split(','), function (i, value) {
                    self.addColor(form, value);
                });
            }

            if (selectedQuery) {
                var aggsSelect = form.find(".select-agg");
                self.initSelect(aggsSelect, selectedQuery, selectedAgg);
            }
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