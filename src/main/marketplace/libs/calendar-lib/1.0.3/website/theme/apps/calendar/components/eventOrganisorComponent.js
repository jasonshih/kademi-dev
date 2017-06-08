(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['eventOrganisor'] = {
        settingEnabled: true,

        settingTitle: 'Event Organisor',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "eventOrganisor" component');

            return $.ajax({
                url: '_components/eventOrganisor?settings',
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
                            component.attr('data-calendar', selectedCalendar);
                            form.find('.select-event [data-calendar='+selectedCalendar+']').removeClass('hide');
                            form.find('.select-event').val('').trigger('change');
                        } else {
                            //dynamicElement.html('<p>Please select calendar</p>');
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
                            //dynamicElement.html('<p>Please select event</p>');
                        }
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "eventOrganisor" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-calendar').val(dataAttributes['data-calendar']);
            form.find('.select-event').val(dataAttributes['data-event']);
        }
    };

})(jQuery);