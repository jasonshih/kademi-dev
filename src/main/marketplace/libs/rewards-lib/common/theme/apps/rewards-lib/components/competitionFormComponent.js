(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['competitionForm'] = {
        settingEnabled: true,
        
        settingTitle: 'Competition Form Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "competitionForm" component');
            
            return $.ajax({
                url: '_components/competitionForm?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.select-promotion').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-promotion', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.select-photos-per-row').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-photos-per-row', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.chk-show-user-photo').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-user-photo', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.chkShowFirstName').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-first-name', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.chkShowSurname').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-sur-name', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.chkShowEmail').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-email', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.chkShowCompany').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-company', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.chkShowPhone').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-phone', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.chkShowMessage').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-message', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#txtSubmitText').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-submit-text', this.value || 'Send message');
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#cbbSubmitSize').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-submit-size', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#cbbSubmitColor').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-submit-color', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#txtSubmitClass').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-submit-class', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#thankYou').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-thank-you', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('#path').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-path', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "competitionForm" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            
            form.find('.select-promotion').val(dataAttributes['data-promotion'] || '');
            form.find('.select-photos-per-row').val(dataAttributes['data-photos-per-row'] || '2');
            form.find('.chk-show-user-photo').prop('checked', dataAttributes['data-show-user-photo'] !== 'false');
            form.find('.chkShowFirstName').prop('checked', dataAttributes['data-show-first-name'] === 'true');
            form.find('.chkShowSurname').prop('checked', dataAttributes['data-show-sur-name'] === 'true');
            form.find('.chkShowEmail').prop('checked', dataAttributes['data-show-email'] === 'true');
            form.find('.chkShowPhone').prop('checked', dataAttributes['data-show-phone'] === 'true');
            form.find('#txtSubmitText').val(dataAttributes['data-submit-text']);
            form.find('#cbbSubmitSize').val(dataAttributes['data-submit-size']);
            form.find('#cbbSubmitColor').val(dataAttributes['data-submit-color']);
            form.find('#txtSubmitClass').val(dataAttributes['data-submit-class']);
            form.find('#thankYou').val(dataAttributes['data-thank-you']);
            form.find('#path').val(dataAttributes['data-path']);
        }
    };
    
})(jQuery);