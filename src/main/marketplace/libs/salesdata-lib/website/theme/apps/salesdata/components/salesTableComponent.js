(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['salesTable'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "salesTable" component', contentArea, container, component, keditor);
            
            var self = this;
        },

        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.initialized-salesTable').removeClass('initialized-salesTable');

            return componentContent.html();
        },

        settingEnabled: true,

        settingTitle: 'Sales Table Settings',

        initKpiVis: function () {
            flog('salesTable');

            $('.salesTable').each(function () {
                var kpiVis = $(this);

                if (!kpiVis.hasClass('initialized-salesTable')) {
                    kpiVis.addClass('initialized-salesTable');
                    kpiVis.kpiVis();
                }
            });
        },

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "salesTable" component');

            var self = this;

            return $.ajax({
                url: '_components/salesTable?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-data').on('change', function () {
                        var selectedKpi = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-name]');

                        if (selectedKpi) {
                            component.attr('data-name', selectedKpi);
                            keditor.initDynamicContent(dynamicElement).done(function () {
                                self.initKpiVis();
                            });
                        } else {
                            dynamicElement.html('<p>Please select Serie</p>');
                        }
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "salesTable" component');

            var dataAttributes = keditor.getDataAttributes(component, [], false);
            form.find('.select-data').val(dataAttributes['data-name']);
        }
    };

})(jQuery);