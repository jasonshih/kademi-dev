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
                                ['0 star', 'no-star'],
                                ['0.5 star', 'half-star'],
                                ['1 star', 'one-star'],
                                ['1.5 stars', 'one-half'],
                                ['2 stars', 'two-stars'],
                                ['2.5 stars', 'two-half'],
                                ['3 stars', 'three-stars'],
                                ['3.5 stars', 'three-half'],
                                ['4 stars', 'four-stars'],
                                ['4.5 stars', 'four-half'],
                                ['5 stars', 'five-stars']
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

                        var ratingString = '<span class="rating-stars ' + data.text + '">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span>';
                        

                        if (this._.selectedElement) {
                            var target = this._.selectedElement;
                            var id = target.getAttribute('href').replace('#', '');
                            var rating = editor.document.getById(id);
                            target.setHtml(ratingString);

                            if (rating === null) {
                                rating = editor.document.createElement('span');
                                rating.setAttributes({
                                    'id': id,
                                    'class': 'rating fade'
                                });
                                editor.insertElement(rating);
                                editor.insertElement(target);
                            }

                        } else {
                            var link = editor.document.createElement('a');
                            var rating = editor.document.createElement('span');
                            var id = 'rating-' + Math.round(Math.random() * 1000000).toString() + '-' + (new Date()).getTime();
                            flog('Create new rating with id=' + id, link, rating);

                            link.setHtml(ratingString);
                            link.setAttributes({
                                'href': '#' + id,
                                'data-toggle': 'rating'
                            });

                            rating.setAttributes({
                                'id': id
                            });

                            editor.insertElement(link);
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