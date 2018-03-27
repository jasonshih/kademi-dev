/**
 * Created by Anh on 7/14/2016.
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['registerForm'] = {
        settingEnabled: true,

        settingTitle: 'Signup Form Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "registerForm" component', form, keditor);

            return $.ajax({
                url: '_components/registerForm?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.displayLabels').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-display-labels', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.displayName').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-display-name', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.displayNickname').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-display-nickname', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.displayPhone').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-display-phone', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.displayPwd').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-display-pwd', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.displayCancel').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-display-cancel', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.showOptins').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-show-optins', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.showOrgs').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-show-orgs', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.showXtraFields').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-show-xtra-fields', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=successTitle]').on('change', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-success-title', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=successBody]').on('change', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-success-body', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=group]').on('change', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-group', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=extra-group]').on('change', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-extra-group', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=labelAlign]').on('change', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-label-align', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.redirectUrl').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-redirect-url', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "registerForm" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            debugger;
            form.find('.displayLabels').prop('checked', dataAttributes['data-display-labels'] !== 'false');
            form.find('.displayName').prop('checked', dataAttributes['data-display-name'] == 'true');
            form.find('.displayNickname').prop('checked', dataAttributes['data-display-nickname'] == 'true');
            form.find('.displayPhone').prop('checked', dataAttributes['data-display-phone'] == 'true');
            form.find('.displayPwd').prop('checked', dataAttributes['data-display-pwd'] == 'true');
            form.find('.displayCancel').prop('checked', dataAttributes['data-display-cancel'] !== 'false');
            form.find('.showOptins').prop('checked', dataAttributes['data-show-optins'] === 'true');
            form.find('.showOrgs').prop('checked', dataAttributes['data-show-orgs'] === 'true');
            form.find('.showXtraFields').prop('checked', dataAttributes['data-show-xtra-fields'] === 'true');
            form.find('[name=successTitle]').val(dataAttributes['data-success-title']);
            form.find('[name=successBody]').val(dataAttributes['data-success-body']);
            form.find('[name=group]').val(dataAttributes['data-group']);
            form.find('[name=extra-group]').val(dataAttributes['data-extra-group']);
            form.find('[name=labelAlign]').val(dataAttributes['data-label-align']);
            form.find('.redirectUrl').val(dataAttributes['data-redirect-url'] || '/dashboard');
        }
    };

})(jQuery);