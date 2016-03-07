/**
 * KEditor Line Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['line'] = {
        init: function (contentArea, container, component, options) {
            // Do nothing
        },

        getContent: function (component, options) {
            flog('getContent "line" component', component);

            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },

        destroy: function (component, options) {
            // Do nothing
        },

        settingEnabled: true,

        settingTitle: 'Line Settings',

        initSettingForm: function (form, options) {
            flog('initSettingForm "line" component');
            form.append(
                '<form class="form-horizontal">' +
                '    <div class="form-group">' +
                '       <div class="col-md-12">' +
                '           <label>Background</label>' +
                '           <div class="input-group color-picker line-bg-color-picker">' +
                '               <span class="input-group-addon"><i></i></span>' +
                '               <input type="text" value="" id="line-bg-color" class="form-control" />' +
                '           </div>' +
                '       </div>' +
                '    </div>' +
                '    <div class="form-group">' +
                '       <div class="col-md-12">' +
                '           <label>Padding (in px)</label>' +
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" id="line-padding-top" class="form-control" />' +
                '                   <small>top</small>' +
                '               </div>' +
                '           </div>' +
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4">' +
                '                   <input type="number" value="" id="line-padding-left" class="form-control" />' +
                '                   <small>left</small>' +
                '               </div>' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" id="line-padding-right" class="form-control" />' +
                '                   <small>right</small>' +
                '               </div>' +
                '           </div>' +
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" id="line-padding-bottom" class="form-control" />' +
                '                   <small>bottom</small>' +
                '               </div>' +
                '           </div>' +
                '       </div>' +
                '    </div>' +
                '    <div class="form-group">' +
                '       <div class="col-md-12">' +
                '           <label>Color</label>' +
                '           <div class="input-group color-picker line-color-picker">' +
                '               <span class="input-group-addon"><i></i></span>' +
                '               <input type="text" value="" id="line-color" class="form-control" />' +
                '           </div>' +
                '       </div>' +
                '    </div>' +
                '    <div class="form-group">' +
                '       <label for="line-height" class="col-sm-12">Height</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="number" id="line-height" class="form-control" />' +
                '       </div>' +
                '    </div>' +
                '</form>'
            );

            var lineHeight = form.find('#line-height');
            lineHeight.on('change', function () {
                setStyle(KEditor.settingComponent.find('.wrapper div'), 'height', this.value);
            });
            
            var linePaddingTop = form.find('#line-padding-top');
            var linePaddingBottom = form.find('#line-padding-bottom');
            var linePaddingLeft = form.find('#line-padding-left');
            var linePaddingRight = form.find('#line-padding-right');
            linePaddingTop.on('change', function () {
                setStyle(KEditor.settingComponent.find('.wrapper'), 'padding-top', (this.value > 0 ? this.value : 0) + 'px');
            });
            linePaddingBottom.on('change', function () {
                setStyle(KEditor.settingComponent.find('.wrapper'), 'padding-bottom', (this.value > 0 ? this.value : 0) + 'px');
            });
            linePaddingLeft.on('change', function () {
                setStyle(KEditor.settingComponent.find('.wrapper'), 'padding-left', (this.value > 0 ? this.value : 0) + 'px');
            });
            linePaddingRight.on('change', function () {
                setStyle(KEditor.settingComponent.find('.wrapper'), 'padding-right', (this.value > 0 ? this.value : 0) + 'px');
            });

            var lineBgColorPicker = form.find('.line-bg-color-picker');
            initColorPicker(lineBgColorPicker, function (color) {
                var wrapper = KEditor.settingComponent.find('.wrapper');
                var table = wrapper.closest('table');

                if (color && color !== 'transparent') {
                    setStyle(wrapper, 'background-color', color);
                    table.attr('bgcolor', color);
                } else {
                    setStyle(wrapper, 'background-color', '');
                    table.removeAttr('bgcolor');
                    form.find('#line-bg-color').val('');
                }
            });

            var lineColorPicker = form.find('.line-color-picker');
            initColorPicker(lineColorPicker, function (color) {
                var wrapper = KEditor.settingComponent.find('.wrapper');
                var div = wrapper.children('div');

                if (color && color !== 'transparent') {
                    setStyle(div, 'background-color', color);
                } else {
                    setStyle(div, 'background-color', '');
                    form.find('#line-color').val('');
                }
            });
        },

        showSettingForm: function (form, component, options) {
            flog('showSettingForm "line" component', component);

            var lineHeight = form.find('#line-height');
            var height = component.find('.wrapper > div').css('height');
            lineHeight.val(height ? height.replace('px', '') : '0');

            var wrapper = component.find('.wrapper');
            
            var linePaddingTop = form.find('#line-padding-top');
            var paddingTop = wrapper.css('padding-top');
            linePaddingTop.val(paddingTop ? paddingTop.replace('px', '') : '0');

            var linePaddingBottom = form.find('#line-padding-bottom');
            var paddingBottom = wrapper.css('padding-bottom');
            linePaddingBottom.val(paddingBottom ? paddingBottom.replace('px', '') : '0');

            var linePaddingLeft = form.find('#line-padding-left');
            var paddingLeft = wrapper.css('padding-left');
            linePaddingLeft.val(paddingLeft ? paddingLeft.replace('px', '') : '0');

            var linePaddingRight = form.find('#line-padding-right');
            var paddingRight = wrapper.css('padding-right');
            linePaddingRight.val(paddingRight ? paddingRight.replace('px', '') : '0');

            var lineBgColorPicker = form.find('.line-bg-color-picker');
            lineBgColorPicker.colorpicker('setValue', wrapper.css('background-color') || '');

            var div = wrapper.children('div');
            var lineColorPicker = form.find('.line-color-picker');
            flog(div.css('background-color'));
            lineColorPicker.colorpicker('setValue', div.css('background-color') || '');
        },

        hideSettingForm: function (form) {
            // Do nothing
        }
    };

})(jQuery);
