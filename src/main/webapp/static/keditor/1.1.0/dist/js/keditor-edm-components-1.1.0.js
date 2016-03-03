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
                '   <div class="form-group">' +
                '       <label for="photo-alt" class="col-sm-12">Alt text</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="text" id="photo-alt" class="form-control" />' +
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
        },

        showSettingForm: function (form, component, options) {
            flog('showSettingForm "photo" component', component);

            var inputAlt = form.find('#photo-alt');
            inputAlt.val(component.find('img').attr('alt') || '');
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
            var self = this;

            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <label for="spacer-height" class="col-sm-12">Height</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="number" id="spacer-height" class="form-control" />' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            var spacerHeight = form.find('#spacer-height');
            spacerHeight.on('change', function () {
                KEditor.settingComponent.find('.spacer').attr('height', this.value).css('height', this.value);
            });
        },

        showSettingForm: function (form, component, options) {
            flog('showSettingForm "spacer" component', component);

            var spacerHeight = form.find('#spacer-height');
            spacerHeight.val(component.find('.spacer').attr('height'));
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
            extraPlugins: 'sourcedialog,lineheight',
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
        }
    };

})(jQuery);
