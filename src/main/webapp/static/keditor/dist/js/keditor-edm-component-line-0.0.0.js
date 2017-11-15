/**!
 * KEditor - Kademi content editor
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 0.0.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap (optional), FontAwesome (optional)
 */
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
            flog('init "line" settings', form);
    
            return $.ajax({
                url: '/static/keditor/edmComponentLineSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
    
                    form = form.find('.form-horizontal');
                    edmEditor.initDefaultComponentControls(form, keditor);
    
                    var lineHeight = form.find('#line-height');
                    lineHeight.on('change', function () {
                        keditor.getSettingComponent().find('.wrapper div').css('height', this.value);
                    });
    
                    var lineWidth = form.find('#line-width');
                    lineWidth.on('change', function () {
                        keditor.getSettingComponent().find('.wrapper table').attr('width', this.value);
                    });
                    
                    form.find('[name=width]').on('click', function () {
                        lineWidth.prop('disabled', this.value);
                        
                        if (this.value) {
                            keditor.getSettingComponent().find('.wrapper table').attr('width', '100%');
                        }
                    });
    
                    var lineColorPicker = form.find('.line-color-picker');
                    edmEditor.initSimpleColorPicker(lineColorPicker, function (color) {
                        var wrapper = keditor.getSettingComponent().find('.wrapper');
                        var div = wrapper.find('div');
        
                        edmEditor.setStyles('background-color', color, div);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "line" component', component);

            var lineHeight = form.find('#line-height');
            var height = component.find('.wrapper div').css('height');
            lineHeight.val(height ? height.replace('px', '') : '0');

            var lineWidth = form.find('#line-width');
            var width = component.find('.wrapper table').attr('width');
            form.find('[name=width]')[width === '100%' ? 'filter' : 'not']('[value="line-full-width"]').trigger('click');
            lineWidth.val(width === '100%' ? '' : width ? width.replace('px', '') : '0');
            
            edmEditor.showDefaultComponentControls(form, component, keditor);

            var wrapper = component.find('.wrapper');
            var div = wrapper.find('div');
            var lineColorPicker = form.find('.line-color-picker');
            lineColorPicker.val(div.css('background-color') || '').trigger('update');
        }
    };

})(jQuery);
