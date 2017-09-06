(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['badgesPanel'] = {
        settingEnabled: true,

        settingTitle: 'Achievement badges',

        initSettingForm: function (form, keditor) {
            return $.ajax({
                url: '_components/badgesPanel?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-topic').on('change', function () {
                        var topicName = this.value;

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-topic', topicName);
                        keditor.initDynamicContent(dynamicElement);
                    });


                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "badgesPanel" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-topic').val(dataAttributes['data-topic']);
        }
    };

})(jQuery);