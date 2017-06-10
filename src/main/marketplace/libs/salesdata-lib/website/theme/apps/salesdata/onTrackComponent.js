(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['onTrack'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "onTrack" component', contentArea, container, component, keditor);
            
            var self = this;
        },

        settingEnabled: true,

        settingTitle: 'OnTrack Visualisation Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "onTrack" component');

            var self = this;

            return $.ajax({
                url: '_components/onTrack?settings',
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
                        } else {
                            dynamicElement.html('<p>Please select KPI</p>');
                        }
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

                    });
                    
                    form.find('.kpi-level').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-level', this.value);
                    });                    
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-kpi').val(dataAttributes['data-href']);
            form.find('.kpi-level').val(dataAttributes['data-level']);
            form.find('.kpi-height').val(dataAttributes['data-height']);
        }
    };

})(jQuery);