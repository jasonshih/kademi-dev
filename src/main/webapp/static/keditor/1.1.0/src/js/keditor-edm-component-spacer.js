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
        init: function (contentArea, container, component, options) {
            // Do nothing
        },

        getContent: function (component, options) {
            flog('getContent "spacer" component', component);

            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },

        destroy: function (component, options) {
            // Do nothing
        },

        settingEnabled: true,

        settingTitle: 'Spacer Settings',

        initSettingForm: function (form, options) {
            flog('initSettingForm "spacer" component');
            form.append(
                '<form class="form-horizontal">' +
                '    <div class="form-group">' +
                '       <div class="col-md-12">' +
                '           <label>Background</label>' +
                '           <div class="input-group color-picker">' +
                '               <span class="input-group-addon"><i></i></span>' +
                '               <input type="text" value="" id="spacer-bg-color" class="form-control" />' +
                '           </div>' +
                '       </div>' +
                '    </div>' +
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
                KEditor.settingComponent.find('.spacer').attr('height', this.value);
            });

            var colorPicker = form.find('.color-picker');
            initColorPicker(colorPicker, function (color) {
                var wrapper = KEditor.settingComponent.find('.wrapper');
                var table = wrapper.closest('table');

                if (color && color !== 'transparent') {
                    setStyle(wrapper, 'background-color', color);
                    table.attr('bgcolor', color);
                } else {
                    setStyle(wrapper, 'background-color', '');
                    table.removeAttr('bgcolor');
                    form.find('#spacer-bg-color').val('');
                }
            });
        },

        showSettingForm: function (form, component, options) {
            flog('showSettingForm "spacer" component', component);

            var spacerHeight = form.find('#spacer-height');
            spacerHeight.val(component.find('.spacer').attr('height'));

            var wrapper = component.find('.wrapper');
            var colorPicker = form.find('.color-picker');
            colorPicker.colorpicker('setValue', wrapper.css('background-color') || '');
        },

        hideSettingForm: function (form) {
            // Do nothing
        }
    };

})(jQuery);
