(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['numUsers'] = {
        init: function () {
            flog('numUsers');
        },
        settingEnabled: true,
        settingTitle: 'No. users Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "numUsers" component');

            return $.ajax({
                url: '_components/numUsers?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-group').on('change', function () {
                        var selectedQuery = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-group', selectedQuery);
                        keditor.initDynamicContent(dynamicElement);

                    });

                    form.find('.value-label').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-label', this.value);

                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.value-icon').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-icon', this.value);

                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.value-link').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-link', this.value);

                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "$group" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-group').val(dataAttributes['data-group']);
            form.find('.value-label').val(dataAttributes['data-label']);
            form.find('.value-icon').val(dataAttributes['data-icon']);
            form.find('.value-link').val(dataAttributes['data-link']);
        }
    };

})(jQuery);