/**
 * KEditor Line Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var edmEditor = $.edmEditor;
    var flog = KEditor.log;

    KEditor.components['line'] = {
        settingEnabled: true,

        settingTitle: 'Line Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "line" component');
            form.append(
                '<form class="form-horizontal">' +
                '    <div class="form-group">' +
                '       <div class="col-md-12">' +
                '           <label>Color</label>' +
                '           <input type="text" value="" id="line-color" class="form-control" />' +
                '       </div>' +
                '    </div>' +
                '    <div class="form-group">' +
                '       <label for="line-height" class="col-sm-12">Width</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="number" id="line-width" class="form-control" />' +
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
    
            form = form.find('form');
            edmEditor.initDefaultComponentControls(form, keditor);

            var lineHeight = form.find('#line-height');
            lineHeight.on('change', function () {
                keditor.getSettingComponent().find('.wrapper div').css('height', this.value);
            });

            var lineHeight = form.find('#line-width');
            lineHeight.on('change', function () {
                keditor.getSettingComponent().find('.wrapper table').attr('width', this.value);
            });
    
            var lineColorPicker = form.find('.line-color-picker');
            edmEditor.initSimpleColorPicker(lineColorPicker, function (color) {
                var wrapper = keditor.getSettingComponent().find('.wrapper');
                var div = wrapper.children('div');
    
                edmEditor.setStyles('background-color', color, div);
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "line" component', component);

            var lineHeight = form.find('#line-height');
            var height = component.find('.wrapper div').css('height');
            lineHeight.val(height ? height.replace('px', '') : '0');

            var lineWidth = form.find('#line-width');
            var width = component.find('.wrapper table').attr('width');
            lineWidth.val(width ? width.replace('px', '') : '0');
            
            edmEditor.showDefaultComponentControls(form, component, keditor);

            var wrapper = component.find('.wrapper');
            var div = wrapper.children('div');
            var lineColorPicker = form.find('.line-color-picker');
            lineColorPicker.val(div.css('background-color') || '').trigger('update');
        }
    };

})(jQuery);
