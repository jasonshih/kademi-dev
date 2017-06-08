(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['kfeedbackEmail'] = {
        settingEnabled: true,

        settingTitle: 'KFeedback Settings',

       initSettingForm: function (form, keditor) {
            return $.ajax({
                url: '_components/kfeedbackEmail?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-survey').on('change', function () {
                        var surveyName = this.value;

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-surveyname', surveyName);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    form.find('.select-website').on('change', function () {
                        var websiteName = this.value;

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-websitename', websiteName);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "kfeedbackEmail" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-survey').val(dataAttributes['data-surveyname']);
            form.find('.select-website').val(dataAttributes['data-websitename']);
        }
    };

})(jQuery);