(function (CKEDITOR) {
    var required_string = '<sup style="color: #ff4000">*</sup>';

    CKEDITOR.plugins.add('modal', {
        init: function (editor) {
            editor.element.getDocument().appendStyleSheet('/static/jqte/jquery-te-1.4.0.css');
            CKEDITOR.scriptLoader.load(CKEDITOR.getUrl('/static/jqte/jquery-te-1.4.0.js'));
            
            editor.addCommand('insertModalLink', new CKEDITOR.dialogCommand('modalLinkDialog'));

            editor.ui.addButton('Modal', {
                label: 'Insert modal',
                command: 'insertModalLink',
                toolbar: 'insert,3',
                icon: this.path + 'images/modal.png'
            });

            editor.on('selectionChange', function (evt) {
                if (editor.readOnly) {
                    return;
                }

                var command = editor.getCommand('insertModalLink'),
                    element = evt.data.path.lastElement && evt.data.path.lastElement.getAscendant('a', true);

                if (element && element.getName() === 'a' && element.getAttribute('href') && element.getChildCount() && element.getAttribute('data-toggle') === 'modal') {
                    command.setState(CKEDITOR.TRISTATE_ON);
                } else {
                    command.setState(CKEDITOR.TRISTATE_OFF);
                }
            });

            editor.on('doubleclick', function (evt) {
                var element = CKEDITOR.plugins.link.getSelectedLink(editor) || evt.data.element;

                if (!element.isReadOnly()) {
                    if (element.is('a') && element.getAttribute('data-toggle') === 'modal') {
                        evt.data.dialog = 'modalLinkDialog';
                        editor.getSelection().selectElement(element);
                    }
                }
            });

            CKEDITOR.dialog.add('modalLinkDialog', function (editor) {
                var parseModalLink = function (editor, element) {
                    var href = element.getAttribute('href').replace('#', '');
                    var modal = editor.document.getById(href);
                    flog('parseModalLink', modal);

                    this._.selectedElement = element;
                    if (modal !== null) {
                        var size = 'modal-md';
                        var modalDialog = modal.findOne('.modal-dialog');
                        if (modalDialog.$.className.indexOf('modal-sm') !== -1) {
                            size = 'modal-sm';
                        } else if (modalDialog.$.className.indexOf('modal-lg') !== -1) {
                            size = 'modal-lg';
                        }
                        var btnOk = modal.findOne('.modal-footer [data-dismiss=modal]');

                        return {
                            text: element.getHtml(),
                            title: modal.findOne('.modal-title').getHtml(),
                            content: modal.findOne('.modal-body').getHtml(),
                            size: size,
                            okText: btnOk ? btnOk.getHtml() : ''
                        };
                    } else {
                        flog('parseModalLink | no modal');

                        return {
                            text: element.getHtml(),
                            title: '',
                            content: '',
                            size: 'modal-md',
                            okText: 'OK'
                        };

                    }
                };

                return {
                    title: 'Modal Properties',
                    minWidth: 600,
                    contents: [{
                        id: 'general',
                        label: 'Settings',
                        elements: [{
                            type: 'text',
                            id: 'text',
                            label: 'Display Text' + required_string,
                            validate: CKEDITOR.dialog.validate.notEmpty('Display Text cannot be empty!'),
                            required: true,
                            setup: function (data) {
                                flog('setup text', data);
                                if (data.text) {
                                    this.setValue(data.text);
                                }
                            },
                            commit: function (data) {
                                data.text = this.getValue();
                            }
                        }, {
                            type: 'text',
                            id: 'title',
                            label: 'Modal Title' + required_string,
                            validate: CKEDITOR.dialog.validate.notEmpty('Modal Title cannot be empty!'),
                            required: true,
                            setup: function (data) {
                                flog('setup title', data);
                                if (data.title) {
                                    this.setValue(data.title);
                                }
                            },
                            commit: function (data) {
                                data.title = this.getValue();
                            }
                        }, {
                            type: 'textarea',
                            id: 'content',
                            onLoad: function () {
                                flog('onLoad1');
                                var text = $('#' + this.domId + ' textarea');
                                text.ckeditor({
                                    toolbarGroups: [
                                        {name: 'document', groups: ['mode', 'document', 'doctools']},
                                        {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
                                        {name: 'forms', groups: ['forms']},
                                        {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
                                        {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
                                        {name: 'links', groups: ['links']},
                                        {name: 'insert', groups: ['insert']}
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
                                });
                                flog('onLoad2');
                            },
                            label: 'Modal Content' + required_string,
                            validate: function () {
                                var ckeditor = CKEDITOR.instances[this._.inputId];
                                var value = ckeditor.getData();

                                if (value.trim() === '') {
                                    alert('');
                                    return false;
                                }
                            },
                            required: true,
                            setup: function (data) {
                                flog('setup content', data);

                                var ckeditor = CKEDITOR.instances[this._.inputId];
                                if (data.content) {
                                    ckeditor.setData(data.content);
                                } else {
                                    ckeditor.setData('');
                                }
                            },
                            commit: function (data) {
                                var ckeditor = CKEDITOR.instances[this._.inputId];
                                data.content = ckeditor.getData();
                            }
                        }, {
                            type: 'select',
                            id: 'size',
                            default: 'modal-md',
                            label: 'Modal Size',
                            items: [
                                ['Small', 'modal-sm'],
                                ['Medium', 'modal-md'],
                                ['Large', 'modal-lg']
                            ],
                            setup: function (data) {
                                if (data.size) {
                                    this.setValue(data.size);
                                }
                            },
                            commit: function (data) {
                                data.size = this.getValue();
                            }
                        }, {
                            type: 'text',
                            id: 'okText',
                            default: '',
                            label: 'Ok Text <span class="small text-mute">(When blank, modal footer will be removed)</span>',
                            setup: function (data) {
                                if (data.okText) {
                                    this.setValue(data.okText);
                                }
                            },
                            commit: function (data) {
                                data.okText = this.getValue();
                            }
                        }]
                    }],
                    onShow: function () {
                        flog('Modal plugin | onShow');

                        var editor = this.getParentEditor();
                        var selection = editor.getSelection();
                        var text = selection.getSelectedText();
                        var element = null;
                        flog('Modal plugin | text=' + text, 'selected', this._.selectedElement);

                        if ((element = CKEDITOR.plugins.modalLink.getSelectedLink(editor)) && element.hasAttribute('href')) {
                            selection.selectElement(element);
                        } else {
                            element = null;
                        }

                        if (element) {
                            this.setupContent(parseModalLink.apply(this, [editor, element]));
                        } else {
                            this._.selectedElement = null;
                            if (text) {
                                this.setupContent({
                                    text: text
                                })
                            }
                        }
                    },
                    onOk: function () {
                        flog('Modal plugin | onOk', this._.selectedElement);
                        var data = {};

                        this.commitContent(data);
                        flog('Selected element=', this._.selectedElement);

                        var modalString = '';
                        modalString += '<div class="modal-dialog ' + data.size + '">';
                        modalString += '    <div class="modal-content">';
                        modalString += '        <div class="modal-header">';
                        modalString += '            <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>';
                        modalString += '            <h4 class="modal-title">' + data.title + '</h4>';
                        modalString += '        </div>';
                        modalString += '        <div class="modal-body">' + data.content + '</div>';
                        if (data.okText) {
                            modalString += '    <div class="modal-footer">';
                            modalString += '        <button type="button" class="btn btn-default" data-dismiss="modal">' + data.okText + '</button>';
                            modalString += '    </div>';
                        }
                        modalString += '    </div>';
                        modalString += '</div>';

                        if (this._.selectedElement) {
                            var target = this._.selectedElement;
                            var id = target.getAttribute('href').replace('#', '');
                            var modal = editor.document.getById(id);
                            target.setHtml(data.text);

                            if (modal === null) {
                                modal = editor.document.createElement('div');
                                modal.setAttributes({
                                    'id': id,
                                    'class': 'modal fade'
                                });
                                editor.insertElement(modal);
                                editor.insertElement(target);
                            }

                            modal.setHtml(modalString);
                        } else {
                            var link = editor.document.createElement('a');
                            var modal = editor.document.createElement('div');
                            var id = 'modal-' + Math.round(Math.random() * 1000000).toString() + '-' + (new Date()).getTime();
                            flog('Create new modal with id=' + id, link, modal);

                            link.setHtml(data.text);
                            link.setAttributes({
                                'href': '#' + id,
                                'data-toggle': 'modal'
                            });

                            modal.setAttributes({
                                'id': id,
                                'class': 'modal fade'
                            });
                            modal.setHtml(modalString);

                            editor.insertElement(link);
                            editor.insertElement(modal);

                            flog('Appended new div', modal);
                        }
                    }
                };
            });
        }
    });

    CKEDITOR.plugins.modalLink = {
        getSelectedLink: function (editor) {
            try {
                var selection = editor.getSelection();
                if (selection.getType() == CKEDITOR.SELECTION_ELEMENT) {
                    var selectedElement = selection.getSelectedElement();
                    if (selectedElement.is('a') && selectedElement.$.getAttribute('data-toggle') === 'modal')
                        return selectedElement;
                }

                var range = selection.getRanges(true)[0];
                range.shrink(CKEDITOR.SHRINK_TEXT);
                var root = range.getCommonAncestor();
                return root.getAscendant('a', true);
            }
            catch (e) {
                return null;
            }
        }
    };


}(CKEDITOR));