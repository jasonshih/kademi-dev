(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['upcomingEvents'] = {
        settingEnabled: true,

        settingTitle: 'Upcoming Events',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "upcomingEvents" component');

            return $.ajax({
                url: '_components/upcomingEvents?settings',
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
            flog('showSettingForm "upcomingEvents" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-calendar').val(dataAttributes['data-calendar']);
        }
    };

})(jQuery);
