(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['viewEmailInBrowser'] = {
        init: function (contentArea, container, component, keditor) {
            // Do nothing
        },

        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },

        destroy: function (component, keditor) {
            // Do nothing
        },

        settingEnabled: true,

        settingTitle: 'View email in browser Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "viewEmailInBrowser" component');

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
                var contentArea = dynamicElement.closest('.keditor-content-area');

                component.attr('data-message', this.value);
                keditor.initDynamicContent(contentArea, dynamicElement);
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "viewEmailInBrowser" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.message').val(dataAttributes['data-message']);
        },

        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);