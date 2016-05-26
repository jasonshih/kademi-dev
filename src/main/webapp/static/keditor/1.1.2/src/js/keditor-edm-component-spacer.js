/**
 * KEditor Spacer Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['spacer'] = {
        init: function (contentArea, container, component, keditor) {
            // Do nothing
        },

        getContent: function (component, keditor) {
            flog('getContent "spacer" component', component);

            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },

        destroy: function (component, keditor) {
            // Do nothing
        },

        settingEnabled: true,

        settingTitle: 'Spacer Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "spacer" component');
            form.append(
                '<form class="form-horizontal">' +
                '    <div class="form-group">' +
                '       <label for="spacer-height" class="col-sm-12">Height</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="number" id="spacer-height" class="form-control" />' +
                '       </div>' +
                '    </div>' +
                '</form>'
            );

            var spacerHeight = form.find('#spacer-height');
            spacerHeight.on('change', function () {
                keditor.getSettingComponent().find('.spacer').attr('height', this.value);
            });

            form = form.find('form');
            KEditor.initBgColorControl(keditor, form, 'prepend');
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "spacer" component', component);

            var spacerHeight = form.find('#spacer-height');
            spacerHeight.val(component.find('.spacer').attr('height'));

            KEditor.showBgColorControl(keditor, form, component);
        },

        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);
