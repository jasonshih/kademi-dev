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

                    form.find('.select-display').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-display', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-question-tag').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-question-tag', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "kfeedbackEmail" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-survey').val(dataAttributes['data-surveyname']);
            form.find('.select-display').val(dataAttributes['data-display'] || 'icon');
            form.find('.select-question-tag').val(dataAttributes['data-question-tag'] || '');
        }
    };

})(jQuery);