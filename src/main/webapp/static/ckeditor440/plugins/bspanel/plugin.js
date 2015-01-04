(function(CKEDITOR) {
    CKEDITOR.plugins.add('bspanel', {
        requires: 'widget',
        icons: 'bspanel',
        init: function(editor) {
            CKEDITOR.dialog.add('bspanel', this.path + 'dialogs/bspanel.js');

            editor.widgets.add('bspanel', {
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
                        selector: '.panel-heading h3'
                                //,allowedContent: 'p span h2 h3 h4 h5 h6 a i b strong em'
                    },
                    content: {
                        selector: '.panel-body'
                                //,allowedContent: 'p br ul ol li strong em'
                    },
                    table: {
                        selector: '.table-container'
                                //,allowedContent: 'p br ul ol li strong em'
                    }                    
                },
                // allowedContent: 'div(!panel); div(!panel-heading); h2(!panel-body)',
                // requiredContent: 'div(simplebox)',
                dialog: 'bspanel',
                
                init: function() {
                    var type = "default";
                    if (this.element.hasClass('panel-muted')) {
                        type = "muted";
                    } else if (this.element.hasClass('panel-primary')) {
                        type = "primary";
                    } else if (this.element.hasClass('panel-info')) {
                        type = "info";
                    } else if (this.element.hasClass('panel-warning')) {
                        type = "warning";
                    } else if (this.element.hasClass('panel-danger')) {
                        type = "danger";
                    }                    
                    this.setData('classes', 'panel panel-' + type);
                    this.setData('dropdown', this.element.hasClass('dropdown-btn'));
                },
                
                data: function() {
                    flog("plugin.js: data", this.data, this.element, "classes=", this.data.classes);
                    this.element.removeClass('panel');
                    this.element.removeClass('panel-default');
                    this.element.removeClass('panel-primary');
                    this.element.removeClass('panel-success');
                    this.element.removeClass('panel-info');
                    this.element.removeClass('panel-warning');
                    this.element.removeClass('panel-danger');

                    if (this.data.classes) {
                        flog("add classes", this.data.classes);
                        this.element.addClass(this.data.classes);
                    } else {
                        this.element.addClass("panel panel-default");
                    }
                    if (this.data.dropdown) {
                        this.element.addClass("dropdown-btn");
                    } else {
                        this.element.removeClass("dropdown-btn");
                    }
                },
                upcast: function(element) {
                    return element.name === 'div' && element.hasClass('panel');
                }
            });
        }
    });
}(CKEDITOR));