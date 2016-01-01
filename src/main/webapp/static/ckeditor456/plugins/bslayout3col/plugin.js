(function(CKEDITOR) {
    CKEDITOR.plugins.add('bslayout3col', {
        requires: 'widget',
        //icons: 'bslayout3col',
        init: function(editor) {
            editor.ui.addButton('bslayout3col', {
                label: 'Create a 3-column layout',
                command: 'bslayout3col',
                toolbar: 'layouts,2',
                icon: this.path + "icons/bslayout3col.png"
            });

            editor.widgets.add('bslayout3col', {
                //button: 'Create a 3-column layout',
                template:
                        '<div class="row layout-3col"><div class="col-md-4 col1">First column</div><div class="col-md-4 col2">Second column</div><div class="col-md-4 col3">Third column</div></div><br/>',
                editables: {
                    col1: {
                        selector: '.row > div:nth-child(1)'
                    },
                    col2: {
                        selector: '.row > div:nth-child(2)'
                    },
                    col3: {
                        selector: '.row > div:nth-child(3)'
                    }
                    
                },
                // allowedContent: 'div(!panel); div(!panel-heading); h2(!panel-body)',
                // requiredContent: 'div(simplebox)',
                

                upcast: function(element) {
                    return element.name === 'div' && element.hasClass('layout-3col');
                }
            });
        }
    });
}(CKEDITOR));