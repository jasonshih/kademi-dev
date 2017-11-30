(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['orgSelector'] = {
        settingEnabled: true,
        settingTitle: 'Organisation Selector',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "orgSelector" component', form, keditor);

            return $.ajax({
                url: '_components/orgSelector?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('[name=groups]').on('click', function (e) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var groups = [];
                        form.find('[name=groups]:checked').each(function () {
                            groups.push(this.value);
                        });
                        component.attr('data-groups', groups.join(','));
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.numberOfOrgs').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-num-orgs', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "orgSelector" component', form, component, keditor);
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('[name=groups]').each(function () {
                if (dataAttributes['data-groups'] && dataAttributes['data-groups'].indexOf(this.value) !== -1) {
                    this.checked = true;
                }
            });
            form.find('.numberOfOrgs').val(dataAttributes['data-num-orgs'] || 20);
        }
    };
})(jQuery);
