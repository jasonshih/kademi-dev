(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['travelDealFiles'] = {
        settingEnabled: true,
        settingTitle: 'Travel Deal Files Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "travelDealFiles" component');

            return $.ajax({
                url: '_components/travelDealFiles?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.traveldeals-files-title').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-traveldeals-files-title', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.traveldeals-files-order').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-traveldeals-files-order', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "travelDealFiles" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.traveldeals-files-title').val(dataAttributes['data-traveldeals-files-title'] || 'Files');
            form.find('.traveldeals-files-order').val(dataAttributes['data-traveldeals-files-order'] || 'asc-name');
        }
    };

})(jQuery);