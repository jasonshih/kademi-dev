(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['calendarWidget'] = {
        settingEnabled: true,

        settingTitle: 'Calendar Widget',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "calendarWidget" component');

            return $.ajax({
                url: '_components/calendarWidget?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-calendar').on('change', function () {
                        var selectedBlog = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-calendar', selectedBlog);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "calendarWidget" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-calendar').val(dataAttributes['data-calendar']);
        }
    };

})(jQuery);
