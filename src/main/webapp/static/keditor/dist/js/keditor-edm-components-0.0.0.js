/**
 * KEditor Button Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 0.0.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['button'] = {
        settingEnabled: true,

        settingTitle: 'Button Settings',

        settingFormHtml: (
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
            '                   <input type="number" value="" class="button-inner-padding form-control" data-prop="paddingTop" name="padding-top" />' +
            '                   <small>top</small>' +
            '               </div>' +
            '           </div>' +
            '           <div class="row row-sm text-center">' +
            '               <div class="col-xs-4">' +
            '                   <input type="number" value="" class="button-inner-padding form-control" data-prop="paddingLeft" name="padding-left" />' +
            '                   <small>left</small>' +
            '               </div>' +
            '               <div class="col-xs-4 col-xs-offset-4">' +
            '                   <input type="number" value="" class="button-inner-padding form-control" data-prop="paddingRight" name="padding-right" />' +
            '                   <small>right</small>' +
            '               </div>' +
            '           </div>' +
            '           <div class="row row-sm text-center">' +
            '               <div class="col-xs-4 col-xs-offset-4">' +
            '                   <input type="number" value="" class="button-inner-padding form-control" data-prop="paddingBottom" name="padding-bottom" />' +
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
            '           <div class="input-group button-color-text-picker">' +
            '               <span class="input-group-addon"><i></i></span>' +
            '               <input type="text" value="" id="button-text-color" class="form-control" />' +
            '           </div>' +
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

            form.find('.button-inner-padding').each(function () {
                var input = $(this);
                var propName = input.attr('data-prop');

                input.on('change', function () {
                    var value = this.value > 0 ? this.value : 0;

                    keditor.getSettingComponent().find('.button-inner').get(0).style[propName] = value + 'px';
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
            buttonTextColorPicker.colorpicker('setValue', button.css('color') || '');

            var txtFontSize = form.find('#button-font-size');
            var fontSize = button.css('font-size');
            txtFontSize.val(fontSize ? fontSize.replace('px', '') : '');

            var cbbFontFamily = form.find('#button-font-family');
            cbbFontFamily.val(button.css('font-family').toLowerCase().replace(/,\s/g, ','));

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

/**
 * KEditor Line Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 0.0.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
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
        }
    };

})(jQuery);

/**
 * KEditor Photo Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 0.0.0
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
                '   <div class="form-group">' +
                '       <label for="photo-width" class="col-sm-12">Linkable</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="checkbox" id="photo-linkable" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-height" class="col-sm-12">Link</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="text" id="photo-link" class="form-control" disabled="disabled" />' +
                '           <span class="help-block" style="display: none;">Link is invalid</span>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-height" class="col-sm-12">Open link in</label>' +
                '       <div class="col-sm-12">' +
                '           <select class="form-control" id="photo-target" disabled="disabled">' +
                '               <option value="" selected="selected">Current tab/window</option>' +
                '               <option value="_blank">New tab/window</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            var txtLink = form.find('#photo-link');
            txtLink.on('change', function () {
                var link = this.value.trim();
                var pattern = new RegExp('^[a-zA-Z0-9_/%:/./-]+$');
                var span = txtLink.next();
                var formGroup = txtLink.closest('.form-group');

                if (pattern.test(link)) {
                    keditor.getSettingComponent().find('a').attr('href', link);
                    span.hide();
                    formGroup.removeClass('has-error');
                } else {
                    span.show();
                    formGroup.addClass('has-error');
                }
            });

            var cbbTarget = form.find('#photo-target');
            cbbTarget.on('change', function () {
                keditor.getSettingComponent().find('a').attr('target', this.value);
            });

            var chkLinkable = form.find('#photo-linkable');
            chkLinkable.on('click', function () {
                var img = keditor.getSettingComponent().find('img');

                if (chkLinkable.is(':checked')) {
                    txtLink.prop('disabled', false);
                    cbbTarget.prop('disabled', false);
                    img.wrap('<a href="" style="text-decoration: none;"></a>');
                    img.css('border', '0');
                } else {
                    txtLink.prop('disabled', true);
                    cbbTarget.prop('disabled', true);
                    img.unwrap('a');
                }
            });

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

            var img = component.find('img');

            var inputAlt = form.find('#photo-alt');
            inputAlt.val(img.attr('alt') || '');

            KEditor.showBgColorControl(keditor, form, component);
            KEditor.showPaddingControls(keditor, form, component);

            var chkFullWidth = form.find('#photo-fullwidth');
            chkFullWidth.prop('checked', img.hasClass('full-width'));

            var txtLink = form.find('#photo-link');
            var cbbTarget = form.find('#photo-target');
            var chkLinkable = form.find('#photo-linkable');

            txtLink.next().hide();
            txtLink.closest('.form-group').removeClass('has-error');

            var a = img.parent('a');
            if (a.length > 0) {
                chkLinkable.prop('checked', true);
                txtLink.prop('disabled', false).val(a.attr('href'));
                cbbTarget.prop('disabled', false).val(a.attr('target'));
            } else {
                chkLinkable.prop('checked', false);
                txtLink.prop('disabled', true).val('');
                cbbTarget.prop('disabled', true).val('');
            }
        },

        adjustWidthForImg: function (img, isFullWidth) {
            flog('adjustWidthForImg', img, isFullWidth);

            img.css('display', 'none');

            $('<img />').attr('src', img.attr('src')).load(function () {
                var realWidth = this.width;
                var realHeight = this.height;
                var ratio = realWidth / realHeight;
                var wrapper = img.parent();
                if (wrapper.is('a')) {
                    wrapper = wrapper.parent();
                }
                var wrapperWidth = wrapper.width();

                setTimeout(function () {
                    img.attr({
                        width: isFullWidth ? wrapperWidth : realWidth,
                        height: isFullWidth ? wrapperWidth / ratio : realHeight
                    });

                    img.css('display', 'block');
                }, 200);
            });
        }
    };

})(jQuery);

/**
 * KEditor Spacer Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 0.0.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['spacer'] = {
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
        }
    };

})(jQuery);

/**
 * KEditor Text Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 0.0.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    CKEDITOR.disableAutoInline = true;
    CKEDITOR.isEDM = true;

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
            extraPlugins: 'sourcedialog,lineheight,onchange,fuse-image',
            removePlugins: 'table,magicline,tabletools',
            removeButtons: 'Save,NewPage,Preview,Print,Templates,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,HiddenField,ImageButton,Button,Select,Textarea,TextField,Radio,Checkbox,Outdent,Indent,Blockquote,CreateDiv,Language,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Maximize,About,ShowBlocks,BidiLtr,BidiRtl,Flash,Image,Subscript,Superscript,Anchor',
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
            self.options.skin = editorSkin;
            self.options.templates_files = [templatesPath];

            var componentContent = component.children('.keditor-component-content');
            var textWrapper = componentContent.find('.text-wrapper');
            var textHtml = textWrapper.html();
            var editorDiv = $('<div class="text-editor" contenteditable="true"></div>').attr('id', keditor.generateId('text-editor')).html(textHtml);
            textWrapper.html(editorDiv);

            var editor = editorDiv.ckeditor(self.options).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);

                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });

            editorDiv.on('input', function (e) {
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
        },

        getContent: function (component, keditor) {
            flog('getContent "text" component', component);

            var componentContent = component.find('.keditor-component-content');
            var textWrapper = componentContent.find('.text-wrapper');
            var editorDiv = componentContent.find('.text-editor');
            var id = editorDiv.attr('id');
            var editor = CKEDITOR.instances[id];

            if (editor) {
                textWrapper.html(editor.getData());
            }

            return componentContent.html();
        },

        destroy: function (component, keditor) {
            flog('destroy "text" component', component);

            var id = component.find('.text-editor').attr('id');
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
        }
    };

})(jQuery);
