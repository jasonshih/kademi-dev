(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['kpiVis'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "kpiVis" component', contentArea, container, component, keditor);
            
            var self = this;

            if ($('[href="/static/nvd3/1.8.3/nv.d3.min.css"]').length === 0) {
                $('head').append('<link href="/static/nvd3/1.8.2/nv.d3.min.css" rel="stylesheet" type="text/css" />');
            }

            $.getScriptOnce('/static/nvd3/1.8.2/d3.min.js', function () {
                $.getScriptOnce('/static/nvd3/1.8.2/nv.d3.min.js', function () {
                    $.getScriptOnce('/theme/apps/salesdata/jquery.kpiVis.js', function () {
                        self.initKpiVis();
                    });
                });
            });
        },

        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.initialized-kpiVis').removeClass('initialized-kpiVis');

            return componentContent.html();
        },

        settingEnabled: true,

        settingTitle: 'KPI Visualisation Settings',

        initKpiVis: function () {
            flog('initKpiVis');

            $('.kpiVis').each(function () {
                var kpiVis = $(this);

                if (!kpiVis.hasClass('initialized-kpiVis')) {
                    kpiVis.addClass('initialized-kpiVis');
                    kpiVis.kpiVis();
                }
            });
        },

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "kpiVis" component');

            var self = this;

            return $.ajax({
                url: '_components/kpiVis?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-kpi').on('change', function () {
                        var selectedKpi = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        if (selectedKpi) {
                            component.attr('data-href', selectedKpi);
                            keditor.initDynamicContent(dynamicElement).done(function () {
                                self.initKpiVis();
                            });
                        } else {
                            dynamicElement.html('<p>Please select KPI</p>');
                        }
                    });

                    form.find('.select-type').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-visualisation', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initKpiVis();
                        });
                    });

                    form.find('.kpi-height').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 99) {
                            number = 100;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-height', number);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initKpiVis();
                        });
                    });

                    form.find('.noTitle').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-no-title', this.checked);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initKpiVis();
                        });
                    });

                    form.find('.bordered').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-no-bordered', this.checked);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initKpiVis();
                        });
                    });

                    form.find('.gridtick').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-no-grid', this.checked);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initKpiVis();
                        });
                    });

                    form.find('.inverted').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-inverted', this.checked);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initKpiVis();
                        });
                    });

                    form.find('.fillcolor').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-fill-color', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initKpiVis();
                        });
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "kpiVis" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-kpi').val(dataAttributes['data-href']);
            form.find('.select-type').val(dataAttributes['data-visualisation']);
            form.find('.kpi-height').val(dataAttributes['data-height']);
            form.find('.noTitle').prop("checked", dataAttributes['data-no-title'] == "true");
            form.find('.bordered').prop("checked", dataAttributes['data-no-bordered'] == "true");
            form.find('.gridtick').prop("checked", dataAttributes['data-no-grid'] == "true");
            form.find('.inverted').prop("checked", dataAttributes['data-inverted'] == "true");
            form.find('.fillcolor').val(dataAttributes['data-fill-color'] || 'bg-primary');
        }
    };

})(jQuery);