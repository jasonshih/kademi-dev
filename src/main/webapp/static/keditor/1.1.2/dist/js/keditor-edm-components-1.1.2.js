/**
 * KEditor Button Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.2
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['button'] = {
        init: function (contentArea, container, component, keditor) {
            // Do nothing
        },

        getContent: function (component, keditor) {
            flog('getContent "button" component', component);

            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },

        destroy: function (component, keditor) {
            // Do nothing
        },

        settingEnabled: true,

        settingTitle: 'Button Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "button" component');
            form.append(
                '<form class="form-horizontal">' +
                '    <div class="form-group">' +
                '       <div class="col-md-12">' +
                '           <label>Color</label>' +
                '           <div class="input-group button-color-picker">' +
                '               <span class="input-group-addon"><i></i></span>' +
                '               <input type="text" value="" id="button-color" class="form-control" />' +
                '           </div>' +
                '       </div>' +
                '    </div>' +
                '    <div class="form-group button-text">' +
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
                '                   <input type="number" value="" class="button-inner-padding-top form-control" />' +
                '                   <small>top</small>' +
                '               </div>' +
                '           </div>' +
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4">' +
                '                   <input type="number" value="" class="button-inner-padding-left form-control" />' +
                '                   <small>left</small>' +
                '               </div>' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" class="button-inner-padding-right form-control" />' +
                '                   <small>right</small>' +
                '               </div>' +
                '           </div>' +
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" class="button-inner-padding-bottom form-control" />' +
                '                   <small>bottom</small>' +
                '               </div>' +
                '           </div>' +
                '       </div>' +
                '    </div>' +
                '    <div class="form-group button-text">' +
                '       <label for="button-text" class="col-sm-12">Text</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="text" id="button-text" class="form-control" />' +
                '       </div>' +
                '    </div>' +
                '    <div class="form-group button-text">' +
                '       <label for="button-text" class="col-sm-12">Link</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="text" id="button-link" class="form-control" />' +
                '       </div>' +
                '    </div>' +
                '    <div class="form-group">' +
                '       <div class="col-md-12">' +
                '           <label>Text color</label>' +
                '           <div class="input-group button-color-text-picker">' +
                '               <span class="input-group-addon"><i></i></span>' +
                '               <input type="text" value="" id="button-text-color" class="form-control" />' +
                '           </div>' +
                '       </div>' +
                '    </div>' +
                '    <div class="form-group button-text">' +
                '       <label for="button-font-size" class="col-sm-12">Font Size</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="number" id="button-font-size" class="form-control" />' +
                '       </div>' +
                '    </div>' +
                '    <div class="form-group button-text">' +
                '       <label for="button-font-family" class="col-sm-12">Font Family</label>' +
                '       <div class="col-sm-12">' +
                '           <select id="button-font-family" class="form-control">' +
                '               <option value="">None</option>' +
                '               <option value="arial,helvetica,sans-serif;">Arial</option>' +
                '               <option value="comic sans ms,cursive;">Comic Sans MS</option>' +
                '               <option value="courier new,courier,monospace;">Courier New</option>' +
                '               <option value="lucida sans unicode,lucida grande,sans-serif;">Lucida Sans Unicode</option>' +
                '               <option value="tahoma,geneva,sans-serif;">Tahoma</option>' +
                '               <option value="times new roman,times,serif;">Times New Roman</option>' +
                '               <option value="trebuchet ms,helvetica,sans-serif;">Trebuchet MS</option>' +
                '               <option value="verdana,geneva,sans-serif;">Verdana</option>' +
                '           </select>' +
                '       </div>' +
                '    </div>' +
                '    <div class="form-group">' +
                '       <label class="col-sm-12">Font Style</label>' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-sm btn-default btn-bold"><i class="fa fa-bold"></i></button>' +
                '           <button type="button" class="btn btn-sm btn-default btn-italic"><i class="fa fa-italic"></i></button>' +
                '       </div>' +
                '    </div>' +
                '    <div class="form-group">' +
                '       <label class="col-sm-12">Alignment</label>' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-sm btn-default btn-button-left"><i class="fa fa-align-left"></i></button>' +
                '           <button type="button" class="btn btn-sm btn-default btn-button-center"><i class="fa fa-align-center"></i></button>' +
                '           <button type="button" class="btn btn-sm btn-default btn-button-right"><i class="fa fa-align-right"></i></button>' +
                '           <button type="button" class="btn btn-sm btn-default btn-button-full"><i class="fa fa-align-justify"></i></button>' +
                '       </div>' +
                '    </div>' +
                '</form>'
            );

            form = form.find('form');
            KEditor.initPaddingControls(keditor, form, 'prepend');
            KEditor.initBgColorControl(keditor, form, 'prepend');

            var buttonColorPicker = form.find('.button-color-picker');
            initColorPicker(buttonColorPicker, function (color) {
                var buttonWrapper = keditor.getSettingComponent().find('.button-wrapper');

                if (color && color !== 'transparent') {
                    setStyle(buttonWrapper, 'background-color', color);
                    buttonWrapper.attr('bgcolor', color);
                } else {
                    setStyle(buttonWrapper, 'background-color', '');
                    buttonWrapper.removeAttr('bgcolor');
                    form.find('.button-color').val('');
                }
            });

            var txtBorderRadius = form.find('#button-border-radius');
            txtBorderRadius.on('change', function () {
                setStyle(keditor.getSettingComponent().find('.button-wrapper'), 'border-radius', this.value + 'px');
            });

            var buttonInnerPaddingTop = form.find('.button-inner-padding-top');
            var buttonInnerPaddingBottom = form.find('.button-inner-padding-bottom');
            var buttonInnerPaddingLeft = form.find('.button-inner-padding-left');
            var buttonInnerPaddingRight = form.find('.button-inner-padding-right');
            buttonInnerPaddingTop.on('change', function () {
                setStyle(keditor.getSettingComponent().find('.button-inner'), 'padding-top', (this.value > 0 ? this.value : 0) + 'px');
            });
            buttonInnerPaddingBottom.on('change', function () {
                setStyle(keditor.getSettingComponent().find('.button-inner'), 'padding-bottom', (this.value > 0 ? this.value : 0) + 'px');
            });
            buttonInnerPaddingLeft.on('change', function () {
                setStyle(keditor.getSettingComponent().find('.button-inner'), 'padding-left', (this.value > 0 ? this.value : 0) + 'px');
            });
            buttonInnerPaddingRight.on('change', function () {
                setStyle(keditor.getSettingComponent().find('.button-inner'), 'padding-right', (this.value > 0 ? this.value : 0) + 'px');
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
            initColorPicker(buttonTextColorPicker, function (color) {
                var button = keditor.getSettingComponent().find('.button-wrapper a');

                if (color && color !== 'transparent') {
                    setStyle(button, 'color', color);
                } else {
                    setStyle(button, 'color', '');
                    form.find('.button-text-color').val('');
                }
            });

            var txtFontSize = form.find('#button-font-size');
            txtFontSize.on('change', function () {
                setStyle(keditor.getSettingComponent().find('.button-wrapper a'), 'font-size', (this.value > 0 ? this.value : 0) + 'px');
            });

            var cbbFontFamily = form.find('#button-font-family');
            cbbFontFamily.on('change', function () {
                setStyle(keditor.getSettingComponent().find('.button-wrapper a'), 'font-family', this.value);
            });

            var btnBold = form.find('.btn-bold');
            btnBold.on('click', function (e) {
                e.preventDefault();

                var style = '';
                if (btnBold.hasClass('active')) {
                    btnBold.removeClass('active');
                } else {
                    btnBold.addClass('active');
                    style = 'bold';
                }
                setStyle(keditor.getSettingComponent().find('.button-wrapper a'), 'font-weight', style);
            });

            var btnItalic = form.find('.btn-italic');
            btnItalic.on('click', function (e) {
                e.preventDefault();

                var style = '';
                if (btnItalic.hasClass('active')) {
                    btnItalic.removeClass('active');
                } else {
                    btnItalic.addClass('active');
                    style = 'italic';
                }
                setStyle(keditor.getSettingComponent().find('.button-wrapper a'), 'font-style', style);
            });

            var btnAlignLeft = form.find('.btn-button-left');
            var btnAlignCenter = form.find('.btn-button-center');
            var btnAlignRight = form.find('.btn-button-right');
            var btnAlignFull = form.find('.btn-button-full');
            var setAlign = function (trigger, align) {
                var table = keditor.getSettingComponent().find('.button-wrapper');

                btnAlignLeft.removeClass('active');
                btnAlignCenter.removeClass('active');
                btnAlignRight.removeClass('active');
                btnAlignFull.removeClass('active');

                trigger.addClass('active');
                if (align === 'full') {
                    table.attr('width', '100%').attr('align', 'center');
                } else {
                    table.removeAttr('width').attr('align', align);
                }
            };

            btnAlignLeft.on('click', function (e) {
                e.preventDefault();

                if (!btnAlignLeft.hasClass('active')) {
                    setAlign(btnAlignLeft, 'left');
                }
            });
            btnAlignCenter.on('click', function (e) {
                e.preventDefault();

                if (!btnAlignCenter.hasClass('active')) {
                    setAlign(btnAlignCenter, 'center');
                }
            });
            btnAlignRight.on('click', function (e) {
                e.preventDefault();

                if (!btnAlignRight.hasClass('active')) {
                    setAlign(btnAlignRight, 'right');
                }
            });
            btnAlignFull.on('click', function (e) {
                e.preventDefault();

                if (!btnAlignFull.hasClass('active')) {
                    setAlign(btnAlignFull, 'full');
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "button" component', component);

            KEditor.showBgColorControl(keditor, form, component);
            KEditor.showPaddingControls(keditor, form, component);

            var buttonWrapper = component.find('.button-wrapper');
            var buttonInner = buttonWrapper.find('.button-inner');
            var button = buttonInner.find('a');

            var buttonColorPicker = form.find('.button-color-picker');
            buttonColorPicker.colorpicker('setValue', buttonWrapper.css('background-color') || '');

            var txtBorderRadius = form.find('#button-border-radius');
            var borderRadius = buttonWrapper.css('border-radius');
            txtBorderRadius.val(borderRadius ? borderRadius.replace('px', '') : '');

            var buttonInnerPaddingTop = form.find('.button-inner-padding-top');
            var paddingTop = buttonInner.css('padding-top');
            buttonInnerPaddingTop.val(paddingTop ? paddingTop.replace('px', '') : '0');

            var buttonInnerPaddingBottom = form.find('.button-inner-padding-bottom');
            var paddingBottom = buttonInner.css('padding-bottom');
            buttonInnerPaddingBottom.val(paddingBottom ? paddingBottom.replace('px', '') : '0');

            var buttonInnerPaddingLeft = form.find('.button-inner-padding-left');
            var paddingLeft = buttonInner.css('padding-left');
            buttonInnerPaddingLeft.val(paddingLeft ? paddingLeft.replace('px', '') : '0');

            var buttonInnerPaddingRight = form.find('.button-inner-padding-right');
            var paddingRight = buttonInner.css('padding-right');
            buttonInnerPaddingRight.val(paddingRight ? paddingRight.replace('px', '') : '0');

            var txtText = form.find('#button-text');
            txtText.val(button.text());

            var txtLink = form.find('#button-link');
            txtLink.val(button.attr("href"));

            var buttonTextColorPicker = form.find('.button-color-text-picker');
            buttonTextColorPicker.colorpicker('setValue', button.css('color') || '');

            var txtFontSize = form.find('#button-font-size');
            var fontSize = button.css('font-size');
            txtFontSize.val(fontSize ? fontSize.replace('px', '') : '');

            var cbbFontFamily = form.find('#button-font-family');
            cbbFontFamily.val(button.css('font-family'));

            var btnBold = form.find('.btn-bold');
            var fontWeight = button.css('font-weight');
            btnBold[fontWeight === '700' || fontWeight === 'bold' ? 'addClass' : 'removeClass']('active');

            var btnItalic = form.find('.btn-italic');
            btnItalic[button.css('font-style') === 'italic' ? 'addClass' : 'removeClass']('active');

            var btnAlignLeft = form.find('.btn-button-left');
            var btnAlignCenter = form.find('.btn-button-center');
            var btnAlignRight = form.find('.btn-button-right');
            var btnAlignFull = form.find('.btn-button-full');
            btnAlignLeft.removeClass('active');
            btnAlignCenter.removeClass('active');
            btnAlignRight.removeClass('active');
            btnAlignFull.removeClass('active');
            if (buttonWrapper.attr('width') === '100%') {
                btnAlignFull.addClass('active');
            } else {
                var align = buttonWrapper.attr('align');
                switch (align) {
                    case 'left':
                        btnAlignLeft.addClass('active');
                        break;

                    case 'center':
                        btnAlignCenter.addClass('active');
                        break;

                    case 'right':
                        btnAlignRight.addClass('active');
                        break;
                }
            }
        },

        hideSettingForm: function (form) {
            // Do nothing
        }
    };

})(jQuery);

/**
 * KEditor Line Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.2
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['line'] = {
        init: function (contentArea, container, component, keditor) {
            // Do nothing
        },

        getContent: function (component, keditor) {
            flog('getContent "line" component', component);

            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },

        destroy: function (component, keditor) {
            // Do nothing
        },

        settingEnabled: true,

        settingTitle: 'Line Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "line" component');
            form.append(
                '<form class="form-horizontal">' +
                '    <div class="form-group">' +
                '       <div class="col-md-12">' +
                '           <label>Color</label>' +
                '           <div class="input-group line-color-picker">' +
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
                setStyle(keditor.getSettingComponent().find('.wrapper div'), 'height', this.value);
            });

            form = form.find('form');
            KEditor.initPaddingControls(keditor, form, 'prepend');
            KEditor.initBgColorControl(keditor, form, 'prepend');

            var lineColorPicker = form.find('.line-color-picker');
            initColorPicker(lineColorPicker, function (color) {
                var wrapper = keditor.getSettingComponent().find('.wrapper');
                var div = wrapper.children('div');

                if (color && color !== 'transparent') {
                    setStyle(div, 'background-color', color);
                } else {
                    setStyle(div, 'background-color', '');
                    form.find('#line-color').val('');
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "line" component', component);

            var lineHeight = form.find('#line-height');
            var height = component.find('.wrapper > div').css('height');
            lineHeight.val(height ? height.replace('px', '') : '0');

            KEditor.showBgColorControl(keditor, form, component);
            KEditor.showPaddingControls(keditor, form, component);

            var wrapper = component.find('.wrapper');
            var div = wrapper.children('div');
            var lineColorPicker = form.find('.line-color-picker');
            flog(div.css('background-color'));
            lineColorPicker.colorpicker('setValue', div.css('background-color') || '');
        },

        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);

/**
 * KEditor Photo Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.2
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['photo'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "photo" component', component);

            var options = keditor.options;
            if (typeof options.onComponentReady === 'function') {
                options.onComponentReady.call(contentArea, component);
            }
        },

        getContent: function (component, keditor) {
            flog('getContent "photo" component', component);

            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },

        destroy: function (component, keditor) {
            // Do nothing
        },

        settingEnabled: true,

        settingTitle: 'Photo Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "photo" component');

            var self = this;
            var options = keditor.options;

            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group photo-edit-wrapper">' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-block btn-primary" id="photo-edit">Change Photo</button>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group photo-alt-wrapper">' +
                '       <label for="photo-alt" class="col-sm-12">Alt text</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="text" id="photo-alt" class="form-control" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-fullwidth" class="col-sm-12">Full width</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="checkbox" id="photo-fullwidth" />' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            var photoEdit = form.find('#photo-edit');
            var basePath = window.location.pathname.replace('edmeditor', '');
            if (keditor.options.basePath) {
                basePath = keditor.options.basePath;
            }
            photoEdit.mselect({
                contentTypes: ['image'],
                bs3Modal: true,
                pagePath: basePath,
                basePath: basePath,
                onSelectFile: function (url, relativeUrl, fileType, hash) {
                    var img = keditor.getSettingComponent().find('img');
                    img.attr('src', "http://" + window.location.host + "/_hashes/files/" + hash);
                    self.adjustWidthForImg(img, true);
                }
            });

            var inputAlt = form.find('#photo-alt');
            inputAlt.on('change', function () {
                keditor.getSettingComponent().find('img').attr('alt', this.value);
            });

            var chkFullWidth = form.find('#photo-fullwidth');
            chkFullWidth.on('click', function () {
                var img = keditor.getSettingComponent().find('img');
                self.adjustWidthForImg(img, chkFullWidth.is(':checked'));
            });

            form = form.find('form');
            KEditor.initBgColorControl(keditor, form, 'after', '.photo-edit-wrapper');
            KEditor.initPaddingControls(keditor, form, 'before', '.photo-alt-wrapper');
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "photo" component', component);

            var self = this;
            var img = component.find('img');

            var inputAlt = form.find('#photo-alt');
            inputAlt.val(img.attr('alt') || '');

            KEditor.showBgColorControl(keditor, form, component);
            KEditor.showPaddingControls(keditor, form, component);

            var chkFullWidth = form.find('#photo-fullwidth');
            chkFullWidth.prop('checked', img.hasClass('full-width'));
        },

        hideSettingForm: function (form, keditor) {
            // Do nothing
        },

        adjustWidthForImg: function (img, isFullWidth) {
            $('<img />').attr('src', img.attr('src')).load(function () {
                var wrapper = img.parent();
                img.attr({
                    width: 1,
                    height: 1
                });
                var wrapperWidth = wrapper.width();
                img.attr({
                    width: isFullWidth ? wrapperWidth : this.width,
                    height: isFullWidth ? (wrapperWidth * this.height) / this.width : this.height
                });
                img[isFullWidth ? 'addClass' : 'removeClass']('full-width');
            });
        }
    };

})(jQuery);

/**
 * KEditor Spacer Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.2
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

/**
 * KEditor Text Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.2
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    CKEDITOR.disableAutoInline = true;

    // Text component
    // ---------------------------------------------------------------------
    KEditor.components['text'] = {
        options: {
            title: false,
            allowedContent: true, // DISABLES Advanced Content Filter. This is so templates with classes are allowed through
            bodyId: 'editor',
            templates_replaceContent: false,
            toolbarGroups: [
                {name: 'document', groups: ['mode', 'document', 'doctools']},
                {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
                {name: 'forms', groups: ['forms']},
                {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
                {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
                {name: 'links', groups: ['links']},
                {name: 'insert', groups: ['insert']},
                '/',
                {name: 'clipboard', groups: ['clipboard', 'undo']},
                {name: 'styles', groups: ['styles']},
                {name: 'colors', groups: ['colors']},
                {name: 'tools', groups: ['tools']},
                {name: 'others', groups: ['others']},
                {name: 'about', groups: ['about']}
            ],
            extraPlugins: 'sourcedialog,lineheight,onchange',
            removePlugins: 'table,magicline,tabletools',
            removeButtons: 'Save,NewPage,Preview,Print,Templates,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,HiddenField,ImageButton,Button,Select,Textarea,TextField,Radio,Checkbox,Outdent,Indent,Blockquote,CreateDiv,Language,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,BGColor,Maximize,About,ShowBlocks,BidiLtr,BidiRtl,Flash,Image,Subscript,Superscript,Anchor',
            enterMode: CKEDITOR.ENTER_DIV,
            forceEnterMode: true,
            filebrowserBrowseUrl: '/static/fckfilemanager/browser/default/browser.html?Type=Image&Connector=/fck_connector.html',
            filebrowserUploadUrl: '/uploader/upload',
            format_tags: 'p;h1;h2;h3;h4;h5;h6',
            stylesSet: 'myStyles:' + stylesPath,
            line_height: '1;1.2;1.5;2;2.2;2.5'
        },

        init: function (contentArea, container, component, keditor) {
            flog('init "text" component', component);

            var self = this;
            var options = keditor.options;

            var componentContent = component.children('.keditor-component-content');
            componentContent.prop('contenteditable', true);

            componentContent.on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(contentArea, e, component);
                }

                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(contentArea, e, container);
                }

                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(contentArea, e);
                }
            });

            self.options.skin = editorSkin;
            self.options.templates_files = [templatesPath];

            var editor = componentContent.ckeditor(self.options).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);

                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });
        },

        getContent: function (component, keditor) {
            flog('getContent "text" component', component);

            var componentContent = component.find('.keditor-component-content');
            var id = componentContent.attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                return editor.getData();
            } else {
                return componentContent.html();
            }
        },

        destroy: function (component, keditor) {
            flog('destroy "text" component', component);

            var id = component.find('.keditor-component-content').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        },

        settingEnabled: true,

        settingTitle: 'Text Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "text" component');
            form.append(
                '<form class="form-horizontal">' +
                '</form>'
            );

            form = form.find('form');
            KEditor.initBgColorControl(keditor, form, 'append');
            KEditor.initPaddingControls(keditor, form, 'append');
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "text" component', component);

            KEditor.showBgColorControl(keditor, form, component);
            KEditor.showPaddingControls(keditor, form, component);
        },

        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);
