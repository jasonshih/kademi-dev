/**
 * KEditor Button Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var edmEditor = $.edmEditor;
    var flog = KEditor.log;
    
    KEditor.components['button'] = {
        settingEnabled: true,
        
        settingTitle: 'Button Settings',
        
        settingFormHtml: (
            '<form class="form-horizontal">' +
            '    <div class="form-group">' +
            '       <div class="col-md-12">' +
            '           <label>Button color</label>' +
            '           <input type="text" value="" id="button-color" class="form-control button-color-picker" />' +
            '       </div>' +
            '    </div>' +
            '    <div class="form-group">' +
            '       <label for="button-border-radius" class="col-sm-12">Border Radius</label>' +
            '       <div class="col-sm-12">' +
            '           <input type="number" id="button-border-radius" class="form-control" />' +
            '       </div>' +
            '    </div>' +
            '    <div class="form-group">' +
            '       <div class="col-md-12">' +
            '           <label>Inner Padding (in px)</label>' +
            '           <div class="row row-sm text-center">' +
            '               <div class="col-xs-4 col-xs-offset-4">' +
            '                   <input type="number" value="" class="button-inner-padding form-control" data-css="padding-top" />' +
            '                   <small>top</small>' +
            '               </div>' +
            '           </div>' +
            '           <div class="row row-sm text-center">' +
            '               <div class="col-xs-4">' +
            '                   <input type="number" value="" class="button-inner-padding form-control" data-css="padding-left" />' +
            '                   <small>left</small>' +
            '               </div>' +
            '               <div class="col-xs-4 col-xs-offset-4">' +
            '                   <input type="number" value="" class="button-inner-padding form-control" data-css="padding-right" />' +
            '                   <small>right</small>' +
            '               </div>' +
            '           </div>' +
            '           <div class="row row-sm text-center">' +
            '               <div class="col-xs-4 col-xs-offset-4">' +
            '                   <input type="number" value="" class="button-inner-padding form-control" data-css="padding-bottom" />' +
            '                   <small>bottom</small>' +
            '               </div>' +
            '           </div>' +
            '       </div>' +
            '    </div>' +
            '    <div class="form-group">' +
            '       <label for="button-text" class="col-sm-12">Text</label>' +
            '       <div class="col-sm-12">' +
            '           <input type="text" id="button-text" class="form-control" />' +
            '       </div>' +
            '    </div>' +
            '    <div class="form-group button-link">' +
            '       <label for="button-link" class="col-sm-12">Link</label>' +
            '       <div class="col-sm-12">' +
            '           <input type="text" id="button-link" class="form-control" />' +
            '       </div>' +
            '    </div>' +
            '    <div class="form-group">' +
            '       <div class="col-md-12">' +
            '           <label>Text color</label>' +
            '           <input type="text" value="" id="button-text-color" class="form-control button-color-text-picker" />' +
            '       </div>' +
            '    </div>' +
            '    <div class="form-group">' +
            '       <label for="button-font-size" class="col-sm-12">Font Size</label>' +
            '       <div class="col-sm-12">' +
            '           <input type="number" id="button-font-size" class="form-control" />' +
            '       </div>' +
            '    </div>' +
            '    <div class="form-group">' +
            '       <label for="button-font-family" class="col-sm-12">Font Family</label>' +
            '       <div class="col-sm-12">' +
            '           <select id="button-font-family" class="form-control">' +
            '               <option value="">None</option>' +
            '               <option value="arial,helvetica,sans-serif">Arial</option>' +
            '               <option value="comic sans ms,cursive">Comic Sans MS</option>' +
            '               <option value="courier new,courier,monospace">Courier New</option>' +
            '               <option value="lucida sans unicode,lucida grande,sans-serif">Lucida Sans Unicode</option>' +
            '               <option value="tahoma,geneva,sans-serif">Tahoma</option>' +
            '               <option value="times new roman,times,serif">Times New Roman</option>' +
            '               <option value="trebuchet ms,helvetica,sans-serif">Trebuchet MS</option>' +
            '               <option value="verdana,geneva,sans-serif">Verdana</option>' +
            '           </select>' +
            '       </div>' +
            '    </div>' +
            '    <div class="form-group">' +
            '       <label class="col-sm-12">Font Style</label>' +
            '       <div class="col-sm-12">' +
            '           <button type="button" class="btn btn-sm btn-default btn-style btn-bold" data-value="bold" data-prop="fontWeight" name="font-weight"><i class="fa fa-bold"></i></button>' +
            '           <button type="button" class="btn btn-sm btn-default btn-style btn-italic" data-value="italic" data-prop="fontStyle" name="font-style"><i class="fa fa-italic"></i></button>' +
            '       </div>' +
            '    </div>' +
            '    <div class="form-group">' +
            '       <label class="col-sm-12">Alignment</label>' +
            '       <div class="col-sm-12">' +
            '           <button type="button" class="btn btn-sm btn-default btn-align" data-value="left"><i class="fa fa-align-left"></i></button>' +
            '           <button type="button" class="btn btn-sm btn-default btn-align" data-value="center"><i class="fa fa-align-center"></i></button>' +
            '           <button type="button" class="btn btn-sm btn-default btn-align" data-value="right"><i class="fa fa-align-right"></i></button>' +
            '           <button type="button" class="btn btn-sm btn-default btn-align" data-value="full"><i class="fa fa-align-justify"></i></button>' +
            '       </div>' +
            '    </div>' +
            '</form>'
        ),
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "button" component');
            
            form.append(this.settingFormHtml);
            
            form = form.find('form');
            edmEditor.initDefaultComponentControls(form, keditor);
            
            var buttonColorPicker = form.find('.button-color-picker');
            edmEditor.initSimpleColorPicker(buttonColorPicker, function (color) {
                var buttonWrapper = keditor.getSettingComponent().find('.button-wrapper');
                buttonWrapper.attr('bgcolor', color);
                edmEditor.setStyles('background-color', color, buttonWrapper);
            });
            
            var txtBorderRadius = form.find('#button-border-radius');
            txtBorderRadius.on('change', function () {
                edmEditor.setStyles('border-radius', this.value + 'px', keditor.getSettingComponent().find('.button-wrapper'));
            });
            
            form.find('.button-inner-padding').each(function () {
                var input = $(this);
                var dataCss = input.attr('data-css');
                
                edmEditor.initPaddingControl(input, function (value) {
                    edmEditor.setStyles(dataCss, value, keditor.getSettingComponent().find('.button-inner'));
                });
            });
            
            var txtText = form.find('#button-text');
            txtText.on('change', function () {
                var text = this.value || '';
                text = text.trim();
                
                keditor.getSettingComponent().find('.button-wrapper a').text(text);
            });
            
            var txtLink = form.find('#button-link');
            txtLink.on('change', function () {
                var href = this.value || '';
                href = href.trim();
                
                keditor.getSettingComponent().find('.button-wrapper a').attr("href", href);
            });
            
            var buttonTextColorPicker = form.find('.button-color-text-picker');
            edmEditor.initSimpleColorPicker(buttonTextColorPicker, function (color) {
                var button = keditor.getSettingComponent().find('.button-wrapper a');
                edmEditor.setStyles('color', color, button);
            });
            
            var txtFontSize = form.find('#button-font-size');
            txtFontSize.on('change', function () {
                edmEditor.setStyles('font-size', (this.value > 0 ? this.value : 0) + 'px', keditor.getSettingComponent().find('.button-wrapper .button-inner'));
            });
            
            var cbbFontFamily = form.find('#button-font-family');
            cbbFontFamily.on('change', function () {
                edmEditor.setStyles('font-family', this.value, keditor.getSettingComponent().find('.button-wrapper .button-inner'));
            });
            
            form.find('.btn-style').each(function () {
                var btn = $(this);
                var name = btn.attr('data-prop');
                
                btn.on('click', function (e) {
                    e.preventDefault();
                    
                    var value = btn.attr('data-value');
                    if (btn.hasClass('active')) {
                        btn.removeClass('active');
                        value = '';
                    } else {
                        btn.addClass('active');
                    }
                    
                    keditor.getSettingComponent().find('.button-wrapper a').get(0).style[name] = value;
                });
            });
            
            var btnsAlign = form.find('.btn-align');
            btnsAlign.each(function () {
                var btn = $(this);
                var value = btn.attr('data-value');
                
                btn.on('click', function (e) {
                    e.preventDefault();
                    
                    if (!btn.hasClass('active')) {
                        var table = keditor.getSettingComponent().find('.button-wrapper');
                        
                        btnsAlign.removeClass('active');
                        btn.addClass('active');
                        
                        if (value === 'full') {
                            table.attr('width', '100%').attr('align', 'center');
                        } else {
                            table.removeAttr('width').attr('align', value);
                        }
                    }
                });
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "button" component', component);
            
            edmEditor.showDefaultComponentControls(form, component, keditor);
            
            var buttonWrapper = component.find('.button-wrapper');
            var buttonInner = buttonWrapper.find('.button-inner');
            var button = buttonInner.find('a');
            
            var buttonColorPicker = form.find('.button-color-picker');
            buttonColorPicker.val(buttonWrapper.css('background-color') || '').trigger('update');
            
            var txtBorderRadius = form.find('#button-border-radius');
            var borderRadius = buttonWrapper.css('border-radius');
            txtBorderRadius.val(borderRadius ? borderRadius.replace('px', '') : '');
            
            form.find('.button-inner-padding').each(function () {
                var input = $(this);
                var propName = input.attr('data-prop');
                var value = buttonInner.get(0).style[propName];
                
                input.val(value ? value.replace('px', '') : '0');
            });
            
            var txtText = form.find('#button-text');
            txtText.val(button.text());
            
            var txtLink = form.find('#button-link');
            txtLink.val(button.attr("href"));
            
            var buttonTextColorPicker = form.find('.button-color-text-picker');
            buttonTextColorPicker.val(button.css('color') || '').trigger('update');
            
            var txtFontSize = form.find('#button-font-size');
            var fontSize = buttonInner.css('font-size');
            txtFontSize.val(fontSize ? fontSize.replace('px', '') : '');
            
            var cbbFontFamily = form.find('#button-font-family');
            cbbFontFamily.val(buttonInner.css('font-family').toLowerCase().replace(/,\s/g, ',').replace(/"/g, ''));
            
            var btnBold = form.find('.btn-bold');
            var fontWeight = button.css('font-weight');
            btnBold[fontWeight === '700' || fontWeight === 'bold' ? 'addClass' : 'removeClass']('active');
            
            var btnItalic = form.find('.btn-italic');
            btnItalic[button.css('font-style') === 'italic' ? 'addClass' : 'removeClass']('active');
            
            var align = buttonWrapper.attr('align');
            if (buttonWrapper.attr('width') === '100%') {
                align = 'full';
            }
            form.find('.btn-align').removeClass('active').filter('[data-value=' + align + ']').addClass('active');
        }
    };
    
})(jQuery);
