/**
 * Created by m.elkhoudary on 4/7/2017.
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['leadManForm'] = {
        settingEnabled: true,

        settingTitle: 'LeadMan Form Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "leadManForm" component', form, keditor);

            return $.ajax({
                url: '_components/leadManForm?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('[name=displayName]').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-display-name', this.value === 'true');
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=displayPwd]').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-display-pwd', this.value === 'true');
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

                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "registerForm" component', form, component, keditor);
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('[name=displayName][value='+dataAttributes['data-display-name']+']').prop('checked', true);
            form.find('[name=displayPwd][value='+dataAttributes['data-display-pwd']+']').prop('checked', true);
            form.find('[name=showOptins][value='+dataAttributes['data-show-optins']+']').prop('checked', true);
            form.find('[name=showOrgs][value='+dataAttributes['data-show-orgs']+']').prop('checked', true);
            form.find('[name=showXtraFields][value='+dataAttributes['data-show-xtra-fields']+']').prop('checked', true);
            form.find('[name=successTitle]').val(dataAttributes['data-success-title']);
            form.find('[name=successBody]').val(dataAttributes['data-success-body']);
            form.find('[name=group]').val(dataAttributes['data-group']);
        }
    };

})(jQuery);