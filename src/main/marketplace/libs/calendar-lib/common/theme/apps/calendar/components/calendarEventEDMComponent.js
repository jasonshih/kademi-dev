(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['calendarEventEDM'] = {
        settingEnabled: true,

        settingTitle: 'Calendar Event Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "calendarEventEDM" component');

            return $.ajax({
                url: '_components/calendarEventEDM?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-calendar').on('change', function () {
                        var selectedCalendar = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        if (selectedCalendar) {
                            form.find('[data-calendar]').addClass('hide');
                            form.find('.select-event [data-calendar='+selectedCalendar+']').removeClass('hide');
                            form.find('.select-event').val('').trigger('change');
                            component.attr('data-calendar', selectedCalendar);
                        } else {
                            dynamicElement.html('<p>Please select calendar</p>');
                        }
                    });

                    form.find('.select-event').on('change', function () {
                        var selectedEvent = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        if (selectedEvent) {
                            component.attr('data-event', selectedEvent);
                            keditor.initDynamicContent(dynamicElement);
                        } else {
                            dynamicElement.html('<p>Please select event</p>');
                        }
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "calendarEventEDM" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-calendar').val(dataAttributes['data-calendar']);
            form.find('.select-event').val(dataAttributes['data-event']);
        }
    };

})(jQuery);