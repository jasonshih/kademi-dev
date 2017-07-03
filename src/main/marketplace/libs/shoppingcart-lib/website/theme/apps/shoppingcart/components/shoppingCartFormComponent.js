(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['shoppingCartForm'] = {
        settingEnabled: true,
        settingTitle: 'Shopping Cart Form',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "shoppingCartForm" component');

            return $.ajax({
                url: '_components/shoppingCartForm?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-orgtype').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-org-type', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.useOrgAddress').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-use-org-address', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "shoppingCartForm" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-orgtype').val(dataAttributes['data-org-type'] || '');
            form.find('.useOrgAddress').prop('checked', dataAttributes['data-use-org-address']=='true');
        }
    };

})(jQuery);