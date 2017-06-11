(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['salesDataVis'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "salesDataVis" component', contentArea, container, component, keditor);
            
            var self = this;
        },

        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.initialized-kpiVis').removeClass('initialized-kpiVis');

            return componentContent.html();
        },

        settingEnabled: true,

        settingTitle: 'Sales data Visualisation Settings',

        initKpiVis: function () {
            flog('initKpiVis');

            $('.salesVis').each(function () {
                var kpiVis = $(this);

                if (!kpiVis.hasClass('initialized-salesVis')) {
                    kpiVis.addClass('initialized-salesVis');
                    kpiVis.kpiVis();
                }
            });
        },

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "salesVis" component');

            var self = this;

            return $.ajax({
                url: '_components/salesDataVis?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-data').on('change', function () {
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

                    form.find('.data-height').on('change', function () {
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
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "kpiVis" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-data').val(dataAttributes['data-href']);
            form.find('.select-type').val(dataAttributes['data-visualisation']);
            form.find('.data-height').val(dataAttributes['data-height']);
        }
    };

})(jQuery);