CKEDITOR.plugins.add('bspanel', {
    requires: 'widget',
    icons: 'panel',
    init: function(editor) {
        editor.widgets.add('simplebox', {
            button: 'Create a bootstrap panel',
            template:
                    '<div class="panel panel-default">' +
                    '<div class="panel-heading"><h3 class="panel-title">Panel heading</h3></div>' +
                    '<div class="panel-body">' +
                    'Panel content' +
                    '</div>' +
                    '</div>',
            editables: {
                title: {
                    selector: '.panel-heading',
                    allowedContent: 'p span h2 h3 h4 h5 h6 a i b strong em'
                },
                content: {
                    selector: '.panel-body'
                    //,allowedContent: 'p br ul ol li strong em'
                }
            },
            //allowedContent: 'div(!simplebox); div(!simplebox-content); h2(!simplebox-title)',
            //requiredContent: 'div(simplebox)',
            upcast: function(element) {
                return element.name === 'div' && element.hasClass('panel');
            }
        });
    }
});