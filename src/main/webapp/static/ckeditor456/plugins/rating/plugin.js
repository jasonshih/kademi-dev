(function (CKEDITOR) {
    var required_string = '<sup style="color: #ff4000">*</sup>';

    CKEDITOR.plugins.add('rating', {
        init: function (editor) {
            editor.addCommand('insertratingLink', new CKEDITOR.dialogCommand('ratingLinkDialog'));
            editor.ui.addButton('rating', {
                label: 'Insert Rating',
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
            CKEDITOR.dialog.add('ratingLinkDialog', function (editor) {
                var parseratingLink = function (editor, element) {
                    var href = element.getAttribute('href').replace('#', '');
                    var rating = editor.document.getById(href);
                    flog('parseratingLink', rating);

                    this._.selectedElement = element;
                    if (rating !== null) {
                        var starsAll = element.findOne('.rating').getAttribute('data-starsall');
                        var starsFill = element.findOne('.rating').getAttribute('data-starsfill');
                        var starsColor = element.findOne('.rating').getAttribute('data-color');
                        var starsSize = element.findOne('.rating').getAttribute('data-size');
                        var starsHalf = element.findOne('.rating').getAttribute('data-half');
                        return {
                            starsall: starsAll,
                            starsfill: starsFill,
                            color: starsColor,
                            size: starsSize,
                            half: starsHalf
                        };
                    } else {
                        flog('parseRatingLink | no rating');

                        return {
                            starsall: starsAll,
                            starsfill: starsFill,
                            color: starsColor,
                            size: starsSize,
                            half: starsHalf

                        };

                    }
                };

                return {
                    title: 'Rating Properties',
                    minWidth: 400,
                    height: 300,
                    contents: [{
                            id: 'general',
                            label: 'Settings',
                            elements: [{
                                    type: 'text',
                                    id: 'starsall',
                                    label: 'Number of all star' + required_string,
                                    validate: CKEDITOR.dialog.validate.notEmpty('you must fill the field numbers!'),
                                    required: true,
                                    setup: function (data) {
                                        flog('setup starsall', data);
                                        if (data.starsall) {
                                            this.setValue(data.starsall);
                                        }
                                    },
                                    commit: function (data) {
                                        data.starsall = this.getValue();
                                    }
                                },
                                {
                                    type: 'text',
                                    id: 'starsfill',
                                    label: 'Number of Colorful Stars' + required_string,
                                    validate: CKEDITOR.dialog.validate.notEmpty('you must fill the field numbers!'),
                                    required: true,
                                    setup: function (data) {
                                        flog('setup text', data);
                                        if (data.starsfill) {
                                            this.setValue(data.starsfill);
                                        }
                                    },
                                    commit: function (data) {
                                        data.starsfill = this.getValue();
                                    }
                                },
                                {
                                    type: 'text',
                                    id: 'color',
                                    label: 'Color of Stars',
                                    default: 'yellow',
                                    setup: function (data) {
                                        flog('setup color', data);
                                        if (data.color) {
                                            this.setValue(data.color);
                                        }
                                    },
                                    commit: function (data) {
                                        data.color = this.getValue();
                                    }
                                },
                                {
                                    type: 'select',
                                    id: 'size',
                                    label: 'Size of Stars',
                                    default: 'inherit',
                                    items: [
                                        ['inherit', 'inherit'],
                                        ['11 px', '11'],
                                        ['13 px', '13'],
                                        ['15 px', '15'],
                                        ['17 px', '17'],
                                        ['20 px', '20'],
                                        ['24 px', '24'],
                                        ['30 px', '30'],
                                        ['36 px', '36']
                                    ],
                                    setup: function (data) {
                                        flog('setup size', data);
                                        if (data.size) {
                                            this.setValue(data.size);
                                        }
                                    },
                                    commit: function (data) {
                                        data.size = this.getValue();
                                    }
                                }
                                ,
                                {
                                    type: 'select',
                                    id: 'half',
                                    label: 'There is Half',
                                    items: [
                                        ['Yes', '1'],
                                        ['No', '0']
                                    ],

                                    default: '0',
                                    setup: function (data) {
                                        flog('setup half', data);
                                        if (data.half) {
                                            this.setValue(data.half);
                                        }
                                    },
                                    commit: function (data) {
                                        data.half = this.getValue();
                                    }
                                }
                            ]
                        }],
                    onShow: function () {
                        flog('rating plugin | onShow');

                        var editor = this.getParentEditor();
                        var selection = editor.getSelection();
                        var text = selection.getStartElement();
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
                                });
                            }
                        }
                    },
                    onOk: function () {
                        flog('rating plugin | onOk', this._.selectedElement);
                        var data = {};

                        this.commitContent(data);
                        flog('Selected element=', this._.selectedElement);

                        var stars = parseInt(data.starsfill), //stars is colorful
                                half = parseInt(data.half),
                                total = parseInt(data.starsall), // Number of all stars
                                starsall = '',
                                i;
                        //stars is colorful
                        for (i = 0; i < stars; i++) {
                            starsall += '<i class="fa fa-star" style="color:' + data.color + ';"></i>';
                        }
                        //star after the stars is colorful
                        for (i = stars; i < total; i++) {
                            if (half === 1 && i === stars) {
                                starsall += '<i class="fa fa-star-half-o" style="color:' + data.color + '"></i>';
                            } else {
                                starsall += '<i class="fa fa-star-o" style="color:#333;"></i>';
                            }
                        }
                        //the result
                        var ratingString = '<span data-starsall="' + data.starsall + '"  data-starsfill="' + data.starsfill + '"  data-color="' + data.color + '"  data-size="' + data.size + '"  data-half="' + data.half + '" class="rating" style="font-size:' + data.size + 'px ;display: inline-flex;">' + starsall + '</span>';

                        if (this._.selectedElement) {
                            var target = this._.selectedElement;
                            var id = target.getAttribute('href').replace('#', '');
                            var rating = editor.document.getById(id);
                            target.setHtml(ratingString);

                            if (rating === null) {
                                rating = editor.document.createElement('span');
                                rating.setAttributes({
                                    'id': id
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

            // ===========================================================
            // Context menu for plugin
            // ===========================================================
            if (editor.contextMenu) {
                editor.addMenuGroup('ratingGroup');

                editor.addMenuItem('ratingItem', {
                    label: 'Edit rating',
                    icon: this.path + 'images/rating.png',
                    command: 'insertratingLink',
                    group: 'ratingGroup'
                });

                editor.contextMenu.addListener(function (element) {
                    if (CKEDITOR.plugins.rating.isEditablerating(element))
                        return {
                            ratingItem: CKEDITOR.TRISTATE_ON
                        };
                    return null;
                });
            }

            // ===========================================================
            //edit by double click on stars 
            // ===========================================================
            editor.on('doubleclick', function (evt) {
                var element = CKEDITOR.plugins.link.getSelectedLink(editor) || evt.data.element;

                if (!element.isReadOnly()) {
                    if (element.is('a') && element.getAttribute('data-toggle') === 'rating') {
                        evt.data.dialog = 'ratingLinkDialog';
                        editor.getSelection().selectElement(element);
                    }
                }
            });

        }
    });
    CKEDITOR.plugins.rating = {
        isEditablerating: function (element) {
            return CKEDITOR.plugins.rating.isRating(element) && !element.isReadOnly();
        },
        isRating: function (element) {
            if (element) {
                element = element.getAscendant('a', true);
            }

            return element && element.getName() === 'a' && element.getAttribute('href') && element.getChildCount() && element.getAttribute('data-toggle') === 'rating';
        }
    };

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
            } catch (e) {
                return null;
            }
        }
    };


}(CKEDITOR));