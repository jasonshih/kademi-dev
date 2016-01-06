(function(CKEDITOR) {
    CKEDITOR.plugins.add('bslayout2col', {
        requires: 'widget',
        icons: 'bslayout2col',
        init: function(editor) {
            CKEDITOR.dialog.add('bslayout2col', this.path + 'dialogs/bslayout2col.js');

            editor.ui.addButton('bslayout2col', {
                label: 'Create a 2-column layout',
                command: 'bslayout2col',
                toolbar: 'layouts,1',
                icon: this.path + "icons/bslayout2col.png"
            });


            editor.widgets.add('bslayout2col', {
                template:
                        '<div class="row layout-2col"><div class="col-md-6 col1">First column</div><div class="col-md-6 col2">Second column</div></div><br/>',
                editables: {
                    col1: {
                        selector: '.row > div:nth-child(1)'
                                //,allowedContent: 'p span h2 h3 h4 h5 h6 a i b strong em'
                    },
                    col2: {
                        selector: '.row > div:nth-child(2)'
                                //,allowedContent: 'p br ul ol li strong em'
                    }
                },
                // allowedContent: 'div(!panel); div(!panel-heading); h2(!panel-body)',
                // requiredContent: 'div(simplebox)',
                dialog: 'bslayout2col',
                init: function() {
                    var align = "equal";
                    var n = $(this.element);
                    var first = n.find("div:first-child");
                    if (first.is(".col-md-8")) {
                        align = "left";
                    } else if (first.is(".col-md-4")) {
                        align = "right";
                    }
                    this.setData('alignment', align);
                },
                data: function() {
                    flog("bslayout-2col plugin.js: data", this.data, this.element, "alignment=", this.data.alignment);
                    try {
                        var align = this.data.alignment;
                        var n = this.element;
                        
                        var first = n.findOne(".col1");
                        var second = n.findOne(".col2");
                        
                        first.removeClass("col-md-4").removeClass("col-md-6").removeClass("col-md-8")
                        second.removeClass("col-md-4").removeClass("col-md-6").removeClass("col-md-8")
                        
                        var firstClass = "col-md-6";
                        var secondClass = "col-md-6";
                        if (align === "left") {
                            firstClass = "col-md-8";
                            secondClass = "col-md-4";
                        } else if (align === "right") {
                            firstClass = "col-md-4";
                            secondClass = "col-md-8";
                        }
                        first.addClass(firstClass);
                        second.addClass(secondClass);
                        flog("done",first,firstClass,second,secondClass);
                    } catch (e) {
                        flog("Exception", e);
                    }
                },
                upcast: function(element) {
                    return element.name === 'div' && element.hasClass('layout-2col');
                }
            });
        }
    });
}(CKEDITOR));