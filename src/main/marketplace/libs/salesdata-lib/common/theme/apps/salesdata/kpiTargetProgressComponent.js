(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['kpiTargetProgress'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "kpiTargetProgress" component', contentArea, container, component, keditor);
            
            var self = this;

            if ($('[href="/static/nvd3/1.8.2/nv.d3.min.css"]').length === 0) {
                $('head').append('<link href="/static/nvd3/1.8.2/nv.d3.min.css" rel="stylesheet" type="text/css" />');
            }

            $.getScriptOnce('/static/nvd3/1.8.2/d3.min.js', function () {
                $.getScriptOnce('/static/nvd3/1.8.2/nv.d3.min.js', function () {
                    $.getScriptOnce('/theme/apps/salesdata/jquery.kpiVis.js', function () {
                        self.initKpiProgress();
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

        settingTitle: 'KPI Target Settings',

        initKpiProgress: function () {
            flog('initKpiProgress');

            $('.kpiVis').each(function () {
                var kpiVis = $(this);

                if (!kpiVis.hasClass('initialized-kpiVis')) {
                    kpiVis.addClass('initialized-kpiVis');
                    kpiVis.kpiVis();
                }
            });
        },

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "kpiTargetProgress" component');

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
                                self.initKpiProgress();
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
                            self.initKpiProgress();
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
                            self.initKpiProgress();
                        });
                    });

                    form.find('.kpi-achivement-label').on('change', function () {
                        var label = this.value;

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-achivement-label', label);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initKpiProgress();
                        });
                    });

                    form.find('.select-level').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-level', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initKpiProgress();
                        });
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "kpiTargetProgress" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-kpi').val(dataAttributes['data-href']);
            form.find('.select-type').val(dataAttributes['data-visualisation']);
            form.find('.kpi-achivement-labe').val(dataAttributes['data-achivement-labe']);
            form.find('.select-level').val(dataAttributes['data-visualisation']);
            form.find('.kpi-height').val(dataAttributes['data-height']);
        }
    };

})(jQuery);