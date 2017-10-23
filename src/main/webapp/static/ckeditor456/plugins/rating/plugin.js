(function (CKEDITOR) {
    var required_string = '<sup style="color: #ff4000">*</sup>';

    CKEDITOR.plugins.add('rating', {
        init: function (editor) {
            editor.element.getDocument().appendStyleSheet('/static/jqte/jquery-te-1.4.0.css');
            CKEDITOR.scriptLoader.load(CKEDITOR.getUrl('/static/jqte/jquery-te-1.4.0.js'));
            
            editor.addCommand('insertratingLink', new CKEDITOR.dialogCommand('ratingLinkDialog'));

            editor.ui.addButton('rating', {
                label: 'Insert rating',
                command: 'insertratingLink',
                toolbar: 'insert,3',
                icon: this.path + 'images/rating.png'
            });

            editor.on('selectionChange', function (evt) {
                if (editor.readOnly) {
                    return;
                }

                var command = editor.getCommand('insertratingLink'),
                    element = evt.data.path.lastElement && evt.data.path.lastElement.getAscendant('a', true);

                if (element && element.getName() === 'a' && element.getAttribute('href') && element.getChildCount() && element.getAttribute('data-toggle') === 'rating') {
                    command.setState(CKEDITOR.TRISTATE_ON);
                } else {
                    command.setState(CKEDITOR.TRISTATE_OFF);
                }
            });

            editor.on('doubleclick', function (evt) {
                var element = CKEDITOR.plugins.link.getSelectedLink(editor) || evt.data.element;

                if (!element.isReadOnly()) {
                    if (element.is('a') && element.getAttribute('data-toggle') === 'rating') {
                        evt.data.dialog = 'ratingLinkDialog';
                        editor.getSelection().selectElement(element);
                    }
                }
            });

            CKEDITOR.dialog.add('ratingLinkDialog', function (editor) {
                var parseratingLink = function (editor, element) {
                    var href = element.getAttribute('href').replace('#', '');
                    var rating = editor.document.getById(href);
                    flog('parseratingLink', rating);

                    this._.selectedElement = element;
                    
                };

                return {
                    title: 'rating Properties',
                    minWidth: 600,
                    contents: [{
                        id: 'general',
                        label: 'Settings',
                        elements: [{
                            type: 'select',
                            id: 'text',
                            label: 'Number of star' + required_string,
                            items: [
                                ['0.5 form 5', '/theme/apps/content/img/stars/half.png'],
                                ['1 form 5', '/theme/apps/content/img/stars/one.png'],
                                ['1.5 form 5', '/theme/apps/content/img/stars/oneHalf.png'],
                                ['2 form 5', '/theme/apps/content/img/stars/two.png'],
                                ['2.5 form 5', '/theme/apps/content/img/stars/twoHalf.png'],
                                ['3 form 5', '/theme/apps/content/img/stars/three.png'],
                                ['3.5 form 5', '/theme/apps/content/img/stars/threeHalf.png'],
                                ['4 form 5', '/theme/apps/content/img/stars/four.png'],
                                ['4.5 form 5', '/theme/apps/content/img/stars/fourHalf.png'],
                                ['5 form 5', '/theme/apps/content/img/stars/five.png']
                            ],
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
                        }
                         ]
                    }],
                    onShow: function () {
                        flog('rating plugin | onShow');

                        var editor = this.getParentEditor();
                        var selection = editor.getSelection();
                        var text = selection.getSelectedText();
                        var element = null;
                        flog('rating plugin | text=' + text, 'selected', this._.selectedElement);

                        if ((element = CKEDITOR.plugins.ratingLink.getSelectedLink(editor)) && element.hasAttribute('href')) {
                            selection.selectElement(element);
                        } else {
                            element = null;
                        }

                        if (element) {
                            this.setupContent(parseratingLink.apply(this, [editor, element]));
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
                        flog('rating plugin | onOk', this._.selectedElement);
                        var data = {};

                        this.commitContent(data);
                        flog('Selected element=', this._.selectedElement);

                        var ratingString = '<img width="150" src="' + data.text + '" ' + '/>';
                        

                        if (this._.selectedElement) {
                            var target = this._.selectedElement;
                            var id = target.getAttribute('href').replace('#', '');
                            var rating = editor.document.getById(id);
                            target.setHtml(data.text);

                            if (rating === null) {
                                rating = editor.document.createElement('span');
                                rating.setAttributes({
                                    'id': id,
                                    'class': 'rating fade'
                                });
                                editor.insertElement(rating);
                                editor.insertElement(target);
                            }

                            rating.setHtml(ratingString);
                        } else {
                            var rating = editor.document.createElement('span');
                           
                            rating.setHtml(ratingString);

                            editor.insertElement(rating);

                            flog('Appended new div', rating);
                        }
                    }
                };
            });
        }
    });

    CKEDITOR.plugins.ratingLink = {
        getSelectedLink: function (editor) {
            try {
                var selection = editor.getSelection();
                if (selection.getType() == CKEDITOR.SELECTION_ELEMENT) {
                    var selectedElement = selection.getSelectedElement();
                    if (selectedElement.is('a') && selectedElement.$.getAttribute('data-toggle') === 'rating')
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