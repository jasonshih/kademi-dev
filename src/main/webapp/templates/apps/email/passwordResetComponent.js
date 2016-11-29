(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    // BM: Would be nice if we can extend button, but not sure how to do that..
    KEditor.components['passwordReset'] = $.extend({}, KEditor.components['button'], {
        settingEnabled: true,
        settingTitle: 'View In Browser Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "passwordReset" component');

            form.append(
                    '<form class="form-horizontal">' +
                    '   <div class="form-group">' +
                    '       <label for="photo-align" class="col-sm-12">Message:</label>' +
                    '       <div class="col-sm-12">' +
                    '           <input class="form-control message" type="text" />' +
                    '       </div>' +
                    '   </div>' +
                    '</form>'
                    );

            form.find('.message').on('change', function () {
                var component = keditor.getSettingComponent();
                var dynamicElement = component.find('[data-dynamic-href]');

                component.attr('data-message', this.value);
                keditor.initDynamicContent(dynamicElement);
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "passwordReset" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.message').val(dataAttributes['data-message']);
        }
    });

})(jQuery);