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
                    
                    form.find('[name=displayLabels]').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-display-labels', this.value === 'true');
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('[name=displayName]').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-display-name', this.value === 'true');
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('[name=displayNickname]').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-display-nickname', this.value === 'true');
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('[name=displayPhone]').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-display-phone', this.value === 'true');
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=displayPwd]').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-display-pwd', this.value === 'true');
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('[name=displayCancel]').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-display-cancel', this.value === 'true');
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=showOptins]').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-show-optins', this.value === 'true');
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=showOrgs]').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-show-orgs', this.value === 'true');
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=showXtraFields]').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-show-xtra-fields', this.value === 'true');
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

                    form.find('[name=labelAlign]').on('change', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-label-align', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "registerForm" component', form, component, keditor);
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            var showDisplayLabels = dataAttributes['data-display-labels'] !== undefined ? dataAttributes['data-display-labels'] : "true";
            var showDisplayName = dataAttributes['data-display-name'] !== undefined ? dataAttributes['data-display-name'] : "false";
            var showDisplayNickname = dataAttributes['data-display-nickname'] !== undefined ? dataAttributes['data-display-nickname'] : "false";
            var showDisplayPhone = dataAttributes['data-display-phone'] !== undefined ? dataAttributes['data-display-phone'] : "false";
            
            form.find('[name=displayLabels][value='+showDisplayLabels+']').prop('checked', true);
            form.find('[name=displayName][value='+ showDisplayName +']').prop('checked', true);
            form.find('[name=displayNickname][value='+showDisplayNickname+']').prop('checked', true);
            form.find('[name=displayPhone][value='+showDisplayPhone+']').prop('checked', true);
            form.find('[name=displayPwd][value='+dataAttributes['data-display-pwd']+']').prop('checked', true);
            form.find('[name=displayCancel][value='+dataAttributes['data-display-cancel']+']').prop('checked', true);
            form.find('[name=showOptins][value='+dataAttributes['data-show-optins']+']').prop('checked', true);
            form.find('[name=showOrgs][value='+dataAttributes['data-show-orgs']+']').prop('checked', true);
            form.find('[name=showXtraFields][value='+dataAttributes['data-show-xtra-fields']+']').prop('checked', true);
            form.find('[name=successTitle]').val(dataAttributes['data-success-title']);
            form.find('[name=successBody]').val(dataAttributes['data-success-body']);
            form.find('[name=group]').val(dataAttributes['data-group']);
            form.find('[name=labelAlign]').val(dataAttributes['data-label-align']);
        }
    };

})(jQuery);