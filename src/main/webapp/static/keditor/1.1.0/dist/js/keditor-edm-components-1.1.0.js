/**
 * KEditor Line Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.0
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
                KEditor.settingComponent.find('.wrapper').attr('height', this.value).css('height', this.value);
            });
            
            var linePaddingTop = form.find('#line-padding-top');
            var linePaddingBottom = form.find('#line-padding-bottom');
            var linePaddingLeft = form.find('#line-padding-left');
            var linePaddingRight = form.find('#line-padding-right');
            linePaddingTop.on('change', function () {
                KEditor.settingComponent.find('.wrapper').css('padding-top', (this.value > 0 ? this.value : 0) + 'px');
            });
            linePaddingBottom.on('change', function () {
                KEditor.settingComponent.find('.wrapper').css('padding-bottom', (this.value > 0 ? this.value : 0) + 'px');
            });
            linePaddingLeft.on('change', function () {
                KEditor.settingComponent.find('.wrapper').css('padding-left', (this.value > 0 ? this.value : 0) + 'px');
            });
            linePaddingRight.on('change', function () {
                KEditor.settingComponent.find('.wrapper').css('padding-right', (this.value > 0 ? this.value : 0) + 'px');
            });

            var lineBgColorPicker = form.find('.line-bg-color-picker');
            initColorPicker(lineBgColorPicker, function (color) {
                var wrapper = KEditor.settingComponent.find('.wrapper');
                var table = wrapper.closest('table');

                if (color && color !== 'transparent') {
                    wrapper.css('background-color', color);
                    table.attr('bgcolor', color);
                } else {
                    wrapper.css('background-color', '');
                    table.removeAttr('bgcolor');
                    form.find('#line-bg-color').val('');
                }
            });

            var lineColorPicker = form.find('.line-color-picker');
            initColorPicker(lineColorPicker, function (color) {
                var wrapper = KEditor.settingComponent.find('.wrapper');
                var div = wrapper.children('div');

                if (color && color !== 'transparent') {
                    div.css('background-color', color);
                } else {
                    div.css('background-color', '');
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

/**
 * KEditor Photo Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['photo'] = {
        init: function (contentArea, container, component, options) {
            // Do nothing
        },

        getContent: function (component, options) {
            flog('getContent "photo" component', component);

            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },

        destroy: function (component, options) {
            // Do nothing
        },

        settingEnabled: true,

        settingTitle: 'Photo Settings',

        initSettingForm: function (form, options) {
            flog('initSettingForm "photo" component');
            var self = this;

            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-block btn-primary" id="photo-edit">Change Photo</button>' +
                '       </div>' +
                '   </div>' +
                '    <div class="form-group">' +
                '       <div class="col-md-12">' +
                '           <label>Background</label>' +
                '           <div class="input-group color-picker">' +
                '               <span class="input-group-addon"><i></i></span>' +
                '               <input type="text" value="" id="photo-bg-color" class="form-control" />' +
                '           </div>' +
                '       </div>' +
                '    </div>' +
                '    <div class="form-group">' +
                '       <div class="col-md-12">' +
                '           <label>Padding (in px)</label>' +
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" id="photo-padding-top" class="form-control" />' +
                '                   <small>top</small>' +
                '               </div>' +
                '           </div>' +
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4">' +
                '                   <input type="number" value="" id="photo-padding-left" class="form-control" />' +
                '                   <small>left</small>' +
                '               </div>' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" id="photo-padding-right" class="form-control" />' +
                '                   <small>right</small>' +
                '               </div>' +
                '           </div>' +
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" id="photo-padding-bottom" class="form-control" />' +
                '                   <small>bottom</small>' +
                '               </div>' +
                '           </div>' +
                '       </div>' +
                '    </div>' +
                '   <div class="form-group">' +
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
            photoEdit.mselect({
                contentTypes: ['image'],
                bs3Modal: true,
                pagePath: window.location.pathname.replace('contenteditor',''),
                onSelectFile: function(url) {
                    var img = KEditor.settingComponent.find('img');
                    img.attr('src', url);
                    self.showSettingForm(form, KEditor.settingComponent, options);
                }
            });

            var inputAlt = form.find('#photo-alt');
            inputAlt.on('change', function () {
                KEditor.settingComponent.find('img').attr('alt', this.value);
            });

            var photoPaddingTop = form.find('#photo-padding-top');
            var photoPaddingBottom = form.find('#photo-padding-bottom');
            var photoPaddingLeft = form.find('#photo-padding-left');
            var photoPaddingRight = form.find('#photo-padding-right');
            photoPaddingTop.on('change', function () {
                KEditor.settingComponent.find('.wrapper').css('padding-top', (this.value > 0 ? this.value : 0) + 'px');
            });
            photoPaddingBottom.on('change', function () {
                KEditor.settingComponent.find('.wrapper').css('padding-bottom', (this.value > 0 ? this.value : 0) + 'px');
            });
            photoPaddingLeft.on('change', function () {
                KEditor.settingComponent.find('.wrapper').css('padding-left', (this.value > 0 ? this.value : 0) + 'px');
            });
            photoPaddingRight.on('change', function () {
                KEditor.settingComponent.find('.wrapper').css('padding-right', (this.value > 0 ? this.value : 0) + 'px');
            });

            var colorPicker = form.find('.color-picker');
            initColorPicker(colorPicker, function (color) {
                var wrapper = KEditor.settingComponent.find('.wrapper');
                var table = wrapper.closest('table');
                if (color && color !== 'transparent') {
                    wrapper.css('background-color', color);
                    table.attr('bgcolor', color);
                } else {
                    wrapper.css('background-color', '');
                    table.removeAttr('bgcolor');
                    form.find('#photo-bg-color').val('');
                }
            });

            var chkFullWidth = form.find('#photo-fullwidth');
            chkFullWidth.on('click', function () {
                var img = KEditor.settingComponent.find('img');
                if (chkFullWidth.is(':checked')) {
                    img.attr({
                        width: '100%',
                        height: ''
                    });
                } else {
                    img.attr({
                        width: self.width,
                        height: self.height
                    });
                }
            });
        },

        showSettingForm: function (form, component, options) {
            flog('showSettingForm "photo" component', component);

            var self = this;
            var img = component.find('img');

            var inputAlt = form.find('#photo-alt');
            inputAlt.val(img.attr('alt') || '');

            var wrapper = component.find('.wrapper');
            var textPaddingTop = form.find('#text-padding-top');
            var paddingTop = wrapper.css('padding-top');
            textPaddingTop.val(paddingTop ? paddingTop.replace('px', '') : '0');

            var textPaddingBottom = form.find('#text-padding-bottom');
            var paddingBottom = wrapper.css('padding-bottom');
            textPaddingBottom.val(paddingBottom ? paddingBottom.replace('px', '') : '0');

            var textPaddingLeft = form.find('#text-padding-left');
            var paddingLeft = wrapper.css('padding-left');
            textPaddingLeft.val(paddingLeft ? paddingLeft.replace('px', '') : '0');

            var textPaddingRight = form.find('#text-padding-right');
            var paddingRight = wrapper.css('padding-right');
            textPaddingRight.val(paddingRight ? paddingRight.replace('px', '') : '0');

            var colorPicker = form.find('.color-picker');
            colorPicker.colorpicker('setValue', wrapper.css('background-color') || '');

            var chkFullWidth = form.find('#photo-fullwidth');
            chkFullWidth.prop('checked', img.attr('width') === '100%');

            $('<img />').attr('src', img.attr('src')).load(function() {
                self.ratio = this.width / this.height;
                self.width = this.width;
                self.height = this.height;
            });
        },

        hideSettingForm: function (form) {
            // Do nothing
        }
    };

})(jQuery);

/**
 * KEditor Spacer Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.0
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
                KEditor.settingComponent.find('.spacer').attr('height', this.value).css('height', this.value);
            });

            var colorPicker = form.find('.color-picker');
            initColorPicker(colorPicker, function (color) {
                var wrapper = KEditor.settingComponent.find('.wrapper');
                var table = wrapper.closest('table');

                if (color && color !== 'transparent') {
                    wrapper.css('background-color', color);
                    table.attr('bgcolor', color);
                } else {
                    wrapper.css('background-color', '');
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

/**
 * KEditor Text Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

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

        init: function (contentArea, container, component, options) {
            flog('init "text" component', component);
            var self = this;

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

        getContent: function (component, options) {
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

        destroy: function (component, options) {
            flog('destroy "text" component', component);

            var id = component.find('.keditor-component-content').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        },

        settingEnabled: true,

        settingTitle: 'Text Settings',

        initSettingForm: function (form, options) {
            flog('initSettingForm "text" component');
            form.append(
                '<form class="form-horizontal">' +
                '    <div class="form-group">' +
                '       <div class="col-md-12">' +
                '           <label for="edm-text-color">Background</label>' +
                '           <div class="input-group color-picker">' +
                '               <span class="input-group-addon"><i></i></span>' +
                '               <input type="text" value="" id="text-bg-color" class="form-control" />' +
                '           </div>' +
                '       </div>' +
                '    </div>' +
                '    <div class="form-group">' +
                '       <div class="col-md-12">' +
                '           <label>Padding (in px)</label>' +
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" class="text-padding-top form-control" />' +
                '                   <small>top</small>' +
                '               </div>' +
                '           </div>' +
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4">' +
                '                   <input type="number" value="" class="text-padding-left form-control" />' +
                '                   <small>left</small>' +
                '               </div>' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" class="text-padding-right form-control" />' +
                '                   <small>right</small>' +
                '               </div>' +
                '           </div>' +
                '           <div class="row row-sm text-center">' +
                '               <div class="col-xs-4 col-xs-offset-4">' +
                '                   <input type="number" value="" class="text-padding-bottom form-control" />' +
                '                   <small>bottom</small>' +
                '               </div>' +
                '           </div>' +
                '       </div>' +
                '    </div>' +
                '</form>'
            );

            var textPaddingTop = form.find('.text-padding-top');
            var textPaddingBottom = form.find('.text-padding-bottom');
            var textPaddingLeft = form.find('.text-padding-left');
            var textPaddingRight = form.find('.text-padding-right');
            textPaddingTop.on('change', function () {
                KEditor.settingComponent.find('.wrapper').css('padding-top', (this.value > 0 ? this.value : 0) + 'px');
            });
            textPaddingBottom.on('change', function () {
                KEditor.settingComponent.find('.wrapper').css('padding-bottom', (this.value > 0 ? this.value : 0) + 'px');
            });
            textPaddingLeft.on('change', function () {
                KEditor.settingComponent.find('.wrapper').css('padding-left', (this.value > 0 ? this.value : 0) + 'px');
            });
            textPaddingRight.on('change', function () {
                KEditor.settingComponent.find('.wrapper').css('padding-right', (this.value > 0 ? this.value : 0) + 'px');
            });

            var colorPicker = form.find('.color-picker');
            initColorPicker(colorPicker, function (color) {
                var wrapper = KEditor.settingComponent.find('.wrapper');
                var table = wrapper.closest('table');
                if (color && color !== 'transparent') {
                    wrapper.css('background-color', color);
                    table.attr('bgcolor', color);
                } else {
                    wrapper.css('background-color', '');
                    table.removeAttr('bgcolor');
                    form.find('#photo-bg-color').val('');
                }
            });
        },

        showSettingForm: function (form, component, options) {
            flog('showSettingForm "text" component', component);

            var wrapper = component.find('.wrapper');
            var textPaddingTop = form.find('.text-padding-top');
            var paddingTop = wrapper.css('padding-top');
            textPaddingTop.val(paddingTop ? paddingTop.replace('px', '') : '0');

            var textPaddingBottom = form.find('.text-padding-bottom');
            var paddingBottom = wrapper.css('padding-bottom');
            textPaddingBottom.val(paddingBottom ? paddingBottom.replace('px', '') : '0');

            var textPaddingLeft = form.find('.text-padding-left');
            var paddingLeft = wrapper.css('padding-left');
            textPaddingLeft.val(paddingLeft ? paddingLeft.replace('px', '') : '0');

            var textPaddingRight = form.find('.text-padding-right');
            var paddingRight = wrapper.css('padding-right');
            textPaddingRight.val(paddingRight ? paddingRight.replace('px', '') : '0');

            var colorPicker = form.find('.color-picker');
            colorPicker.colorpicker('setValue', wrapper.css('background-color') || '');

            var colorPicker = form.find('.color-picker');
            colorPicker.colorpicker('setValue', wrapper.css('background-color') || '');
        },

        hideSettingForm: function (form) {
            // Do nothing
        }
    };

})(jQuery);

/**
 * KEditor Unsubscribe Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    // Unsubscribe component
    // ---------------------------------------------------------------------
    KEditor.components['unsubscribe'] = $.extend({}, KEditor.components['text'], {
        options: {
            title: false,
            allowedContent: true, // DISABLES Advanced Content Filter. This is so templates with classes are allowed through
            bodyId: 'editor',
            templates_replaceContent: false,
            toolbarGroups: [
                {name: 'document', groups: ['mode', 'document', 'doctools']},
                {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
                {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
                {name: 'paragraph', groups: ['align', 'bidi', 'paragraph']},
                {name: 'clipboard', groups: ['clipboard', 'undo']},
                {name: 'colors', groups: ['colors']},
                {name: 'tools', groups: ['tools']},
                {name: 'others', groups: ['others']},
                {name: 'about', groups: ['about']}
            ],
            extraPlugins: 'sourcedialog,lineheight,onchange',
            removePlugins: 'table,magicline,tabletools',
            removeButtons: 'Save,NewPage,Preview,Print,Templates,PasteUnsubscribe,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,HiddenField,ImageButton,Button,Select,Unsubscribearea,UnsubscribeField,Radio,Checkbox,Outdent,Indent,Blockquote,CreateDiv,Language,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,BGColor,Maximize,About,ShowBlocks,BidiLtr,BidiRtl,Flash,Image,Subscript,Superscript,Anchor',
            enterMode: CKEDITOR.ENTER_DIV,
            forceEnterMode: true,
            filebrowserBrowseUrl: '/static/fckfilemanager/browser/default/browser.html?Type=Image&Connector=/fck_connector.html',
            filebrowserUploadUrl: '/uploader/upload',
            format_tags: 'p;h1;h2;h3;h4;h5;h6',
            stylesSet: 'myStyles:' + stylesPath,
            line_height: '1;1.2;1.5;2;2.2;2.5'
        },

        settingTitle: 'Unsubscribe Settings'

    });

})(jQuery);
