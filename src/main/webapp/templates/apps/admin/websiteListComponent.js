(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['websiteList'] = {
        settingEnabled: true,

        settingTitle: 'Website List Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "websiteList" component');

            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <label for="photo-align" class="col-sm-12">Items per row:</label>' +
                '       <div class="col-sm-12">' +
                '           <select class="form-control items-per-row">' +
                '               <option value="1">1</option>' +
                '               <option value="2">2</option>' +
                '               <option value="3">3</option>' +
                '               <option value="4">4</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            form.find('.items-per-row').on('change', function () {
                var component = keditor.getSettingComponent();
                var dynamicElement = component.find('[data-dynamic-href]');

                component.attr('data-items-per-row', this.value);
                keditor.initDynamicContent(dynamicElement);
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "websiteList" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.items-per-row').val(dataAttributes['data-items-per-row']);
        }
    };

})(jQuery);