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
                        
                        form.find('.select-items-per-row-wrapper').css('display', this.value === 'text' ? 'none' : 'block');
                        form.find('.txt-icon-width-wrapper').css('display', this.value === 'text' ? 'none' : 'block');
                    });
                    
                    form.find('.select-question-tag').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-question-tag', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.select-items-per-row').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-items-per-row', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.txt-icon-width').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 40) {
                            number = 40;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-icon-width', number);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "kfeedbackEmail" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-survey').val(dataAttributes['data-surveyname']);
            form.find('.select-items-per-row').val(dataAttributes['data-items-per-row'] || '3');
            form.find('.select-display').val(dataAttributes['data-display'] || 'icon');
            form.find('.select-question-tag').val(dataAttributes['data-question-tag'] || '');
            form.find('.txt-icon-width').val(dataAttributes['data-icon-width'] || '40');
            form.find('.select-items-per-row-wrapper').css('display', dataAttributes['data-display'] === 'text' ? 'none' : 'block');
            form.find('.icon-width-wrapper').css('display', dataAttributes['data-display'] === 'text' ? 'none' : 'block');
        }
    };
    
})(jQuery);