/**
 * Created by Anh on 7/25/2016.
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['ecomStoreBreadcrumb'] = {
        settingEnabled: true,

        settingTitle: 'Ecommerce breadcrumb',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "ecomStoreBreadcrumb" component', form, keditor);

            return $.ajax({
                url: '_components/ecomStoreBreadcrumb?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('[name=ptype]').on('change', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-ptype', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "ecomStoreBreadcrumb" component', form, component, keditor);
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('[name=ptype]').val(dataAttributes['data-ptype']);
        }
    };

})(jQuery);