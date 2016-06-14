(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['contactForm'] = {
        init: function (contentArea, container, component, keditor) {
            // Do nothing
        },

        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },

        destroy: function (component, keditor) {
            // Do nothing
        },

        settingEnabled: true,

        settingTitle: 'Contact Form Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "contactForm" component');

            $.ajax({
                url: '_components/contactForm?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('#chkFirstName').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');
                        
                        component.attr('data-first-name', this.checked);                        
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });
                    
                    form.find('#chkSurname').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');
                        
                        component.attr('data-sur-name', this.checked);                        
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });
                    
                    form.find('#chkEmail').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');
                        
                        component.attr('data-email', this.checked);                        
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });
                    
                    form.find('#chkCompany').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');
                        
                        component.attr('data-company', this.checked);                        
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });
                    
                    form.find('#chkPhone').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');
                        
                        component.attr('data-phone', this.checked);                        
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });
                    
                    form.find('#chkMessage').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');
                        
                        component.attr('data-message', this.checked);                        
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });

                    form.find('#txtSubmitText').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');

                        component.attr('data-submit-text', this.value || 'Send message');
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });

                    form.find('#cbbSubmitSize').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');

                        component.attr('data-submit-size', this.value);
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });

                    form.find('#cbbSubmitColor').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');

                        component.attr('data-submit-color', this.value);
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });

                    form.find('#txtSubmitClass').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');

                        component.attr('data-submit-class', this.value);
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "contactForm" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('#chkFirstName').prop('checked', dataAttributes['data-first-name'] === 'true');
            form.find('#chkSurname').prop('checked', dataAttributes['data-sur-name'] === 'true');
            form.find('#chkEmail').prop('checked', dataAttributes['data-email'] === 'true');
            form.find('#chkCompany').prop('checked', dataAttributes['data-company'] === 'true');
            form.find('#chkPhone').prop('checked', dataAttributes['data-phone'] === 'true');
            form.find('#chkMessage').prop('checked', dataAttributes['data-message'] === 'true');
            form.find('#txtSubmitText').val(dataAttributes['data-submit-text']);
            form.find('#cbbSubmitSize').val(dataAttributes['data-submit-size']);
            form.find('#cbbSubmitColor').val(dataAttributes['data-submit-color']);
            form.find('#txtSubmitClass').val(dataAttributes['data-submit-class']);
        },

        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);