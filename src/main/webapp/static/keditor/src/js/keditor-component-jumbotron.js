/**
 * KEditor Jumbotron Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['jumbotron'] = {
        settingEnabled: true,

        settingTitle: 'Jumbotron Settings',
        options: {
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
                {name: 'others', groups: ['others']}
            ],
            title: false,
            allowedContent: true, // DISABLES Advanced Content Filter. This is so templates with classes: allowed through
            bodyId: 'editor',
            templates_replaceContent: false,
            enterMode: 'P',
            forceEnterMode: true,
            format_tags: 'p;h1;h2;h3;h4;h5;h6',
            removePlugins: 'table,magicline,tabletools',
            removeButtons: 'Save,NewPage,Preview,Print,Templates,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,HiddenField,ImageButton,Button,Select,Textarea,TextField,Radio,Checkbox,Outdent,Indent,Blockquote,CreateDiv,Language,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,BGColor,Maximize,About,ShowBlocks,BidiLtr,BidiRtl,Flash,Image,Subscript,Superscript,Anchor',
            minimumChangeMilliseconds: 100
        },
        init: function(contentArea, container, component, keditor){
            var self = this;
            var options = self.options;

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

            var editor = componentContent.ckeditor(self.options).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);

                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });
        },

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "jumbotron" component');
            form.append(
                '<form class="form-horizontal">' +
                '    <div class="form-group">' +
                '       <div class="col-md-12">' +
                '           <label>Background Color</label>' +
                '           <div class="input-group button-color-picker">' +
                '               <span class="input-group-addon"><i></i></span>' +
                '               <input type="text" value="" id="button-color" class="form-control" />' +
                '           </div>' +
                '       </div>' +
                '    </div>' +
                '    <div class="form-group">' +
                '       <label class="col-sm-12">Rounded</label>' +
                '       <div class="col-sm-12">' +
                '           <div class="radio"><label><input type="radio" name="rounded" value="true" checked> Yes</label></div>' +
                '           <div class="radio"><label><input type="radio" name="rounded" value="false"> No</label></div>' +
                '       </div>' +
                '    </div>' +
                '</form>'
            );

            form.find('[name=rounded]').on('click', function (e) {
                var comp = keditor.getSettingComponent();
                if (this.value == 'false') {
                    comp.find('.jumbotron').css('border-radius', '0');
                } else {
                    comp.find('.jumbotron').css('border-radius', '');
                }
            });

            var buttonColorPicker = form.find('.button-color-picker');
            initColorPicker(buttonColorPicker, function (color) {
                var comp = keditor.getSettingComponent();

                if (color && color !== 'transparent') {
                    comp.find('.jumbotron').css('background-color', color);
                } else {
                    comp.find('.jumbotron').css('background-color', '');
                    form.find('.button-color').val('');
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "jumbotron" component', component);

            form.find('[name=showButton][value=false]').prop('checked', component.find('a').hasClass('hide'));
        },

        destroy: function (component, keditor) {
            flog('destroy "text" component', component);

            var id = component.find('.keditor-component-content').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        }
    };

    function initColorPicker(target, onChangeHandle) {
        target.each(function () {
            var colorPicker = $(this);
            var input = colorPicker.find('input');
            var previewer = colorPicker.find('.input-group-addon i');

            colorPicker.colorpicker({
                format: 'hex',
                container: colorPicker.parent(),
                component: '.input-group-addon',
                align: 'left',
                colorSelectors: {
                    'transparent': 'transparent'
                }
            }).on('changeColor.colorpicker', function (e) {
                var colorHex = e.color.toHex();

                if (!input.val() || input.val().trim().length === 0) {
                    colorHex = '';
                    previewer.css('background-color', '');
                }

                if (typeof onChangeHandle === 'function') {
                    onChangeHandle(colorHex);
                }
            });

        });
    }
})(jQuery);

