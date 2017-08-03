(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['leadStatsSummary'] = {
        settingEnabled: true,
        settingTitle: 'LeadMan Stats Summary Settings',
        init: function (contentArea, container, component, keditor) {

        },
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "leadStatsSummary" component', form, keditor);

            return $.ajax({
                url: '_components/leadStatsSummary?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('[name=funnelName]').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-funnel-name', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "leadStatsSummary" component', form, component, keditor);
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('[name=funnelName]').val(dataAttributes['data-funnel-name']);
        }
    };
})(jQuery);