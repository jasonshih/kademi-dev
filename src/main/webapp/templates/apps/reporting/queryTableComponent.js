(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['queryTable'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "queryTable component', contentArea, container, component, keditor);

            var self = this;
        },

        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },

        destroy: function (component, keditor) {
            // Do nothing
        },

        settingEnabled: true,

        settingTitle: 'Query Table Settings',

        initKpiVis: function () {
            flog('dateHistogram');
        },

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "queryTable" component');

            $.ajax({
                url: '_components/queryTable?settings',
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
        },

        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);