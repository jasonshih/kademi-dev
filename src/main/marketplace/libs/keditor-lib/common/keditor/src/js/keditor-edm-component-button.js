(function ($) {
    var KEditor = $.keditor;
    var edmEditor = $.edmEditor;
    var flog = KEditor.log;
    
    KEditor.components['button'] = {
        settingEnabled: true,
        
        settingTitle: 'Button Settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "button" settings', form);
    
            return $.ajax({
                url: '/static/keditor/edmComponentButtonSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
    
                    form = form.find('.form-horizontal');
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
                            edmEditor.setStyles(dataCss, value + 'px', keditor.getSettingComponent().find('.button-inner'));
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
                    
                    form.find('.btn-browse-file').mselect({
                        mselectAll: true,
                        pagePath: keditor.options.pagePath,
                        basePath: keditor.options.basePath,
                        onSelectFile: function (url, relativeUrl, fileType, hash) {
                            txtLink.val('http://' + window.location.host + '/_hashes/files/' + hash).trigger('change');
                        }
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
                }
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
                var propName = input.attr('data-css');
                var value = buttonInner.css(propName);
                
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
