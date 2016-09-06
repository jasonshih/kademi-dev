(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['breadcrumb'] = {
        settingEnabled: true,
        settingTitle: 'Breadcrumb Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "breadcrumb" component');

            $.ajax({
                url: '_components/breadcrumb?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    var paddingSettings = form.find('.paddingSettings');
                    paddingSettings.on('change', function () {
                        var paddingValue = this.value || '';
                        var component = keditor.getSettingComponent();
                        var paddingProp = $(this).attr('name');
                        if (paddingValue.trim() === '') {
                            component.find('ol').css(paddingProp, '');
                        } else {
                            if (isNaN(paddingValue)) {
                                paddingValue = 0;
                                this.value = paddingValue;
                            }
                            component.find('ol').css(paddingProp, paddingValue + 'px');
                        }
                        component.attr('data-style', component.find('ol').attr('style'));
                        var dynamicElement = component.find('[data-dynamic-href]');
                        keditor.initDynamicContent(dynamicElement);
                    });

                    var marginSettings = form.find('.marginSettings');
                    marginSettings.on('change', function () {
                        var paddingValue = this.value || '';
                        var component = keditor.getSettingComponent();
                        var paddingProp = $(this).attr('name');
                        if (paddingValue.trim() === '') {
                            component.find('ol').css(paddingProp, '');
                        } else {
                            if (isNaN(paddingValue)) {
                                paddingValue = 0;
                                this.value = paddingValue;
                            }
                            component.find('ol').css(paddingProp, paddingValue + 'px');
                        }
                        component.attr('data-style', component.find('ol').attr('style'));
                        var dynamicElement = component.find('[data-dynamic-href]');
                        keditor.initDynamicContent(dynamicElement);
                    });

                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "pageTitle" component');
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            //component.find('ol').attr('style', dataAttributes['data-style']);
            form.find('.paddingSettings').each(function(){
                $(this).val(component.find('ol').css($(this).attr('name')).replace('px',''));
            });
            form.find('.marginSettings').each(function(){
                $(this).val(component.find('ol').css($(this).attr('name')).replace('px',''));
            });
        }
    };

})(jQuery);