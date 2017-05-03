(function ($) {
    var KEditor = $.keditor;
    var contentEditor = $.contentEditor;
    var flog = KEditor.log;

    KEditor.components['menu'] = {
        settingEnabled: true,
        settingTitle: 'Menu Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "menu" component');

            return $.ajax({
                url: '_components/menu?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.navbar-layout').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-navbar-layout', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    contentEditor.initDefaultMenuControls(form, keditor);
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "menu" component');
    
            contentEditor.showDefaultMenuControls(form, component, keditor);
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.navbar-layout').val(dataAttributes['data-navbar-layout'] || 'container-fluid');
        }

    };

})(jQuery);