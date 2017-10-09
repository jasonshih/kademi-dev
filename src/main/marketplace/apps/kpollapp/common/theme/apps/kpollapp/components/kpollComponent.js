(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['kpoll'] = {
        settingEnabled: true,

        settingTitle: 'Kpoll Settings',

        initSettingForm: function (form, keditor) {
            return $.ajax({
                url: '_components/kpoll?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-survey').on('change', function () {
                        var surveyName = this.value;

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-poll-name', surveyName);
                        keditor.initDynamicContent(dynamicElement);
                        flog(component, surveyName);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "kpoll" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-survey').val(dataAttributes['data-poll-name']);
        }
    };

})(jQuery);