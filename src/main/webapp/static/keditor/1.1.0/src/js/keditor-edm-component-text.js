/**
 * KEditor Text Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
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
                setStyle(KEditor.settingComponent.find('.wrapper'), 'padding-top', (this.value > 0 ? this.value : 0) + 'px');
            });
            textPaddingBottom.on('change', function () {
                setStyle(KEditor.settingComponent.find('.wrapper'), 'padding-bottom', (this.value > 0 ? this.value : 0) + 'px');
            });
            textPaddingLeft.on('change', function () {
                setStyle(KEditor.settingComponent.find('.wrapper'), 'padding-left', (this.value > 0 ? this.value : 0) + 'px');
            });
            textPaddingRight.on('change', function () {
                setStyle(KEditor.settingComponent.find('.wrapper'), 'padding-right', (this.value > 0 ? this.value : 0) + 'px');
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
