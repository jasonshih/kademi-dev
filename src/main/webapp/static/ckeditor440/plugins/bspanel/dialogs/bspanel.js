CKEDITOR.dialog.add('bspanel', function(editor) {
    return {
        title: 'Edit Panel',
        minWidth: 200,
        minHeight: 100,
        contents: [
            {
                id: 'info',
                elements: [
                    {
                        id: 'type',
                        type: 'select',
                        label: 'Type',
                        items: [
                            ['Default', 'default'],
                            ['Muted', 'muted'],
                            ['Primary', 'primary'],
                            ['Info', 'info'],
                            ['Warning', 'warning'],
                            ['Danger', 'danger'],
                        ],
                        setup: function(widget) {
                            var current = widget.data.classes;
                            flog("setup", widget, current);
                            var val = "default";
                            if (current) {
                                if (current.indexOf("muted") > 0) {
                                    val = "muted";
                                } else if (current.indexOf("primary") > 0) {
                                    val = "primary";
                                } else if (current.indexOf("info") > 0) {
                                    val = "info";
                                } else if (current.indexOf("warning") > 0) {
                                    val = "warning";
                                } else if (current.indexOf("danger") > 0) {
                                    val = "danger";
                                }
                            }
                            this.setValue(val);
                        },
                        commit: function(widget) {
                            flog("commit", widget, widget.data.class);
                            widget.setData('classes', 'panel panel-' + this.getValue());
                        }
                    },
                    {
                        id: 'dropdown',
                        type: 'checkbox',
                        label: 'Dropdown?',
                        setup: function(widget) {
                            var current = widget.data.dropdown;
                            flog("setup dropdown", widget, current);
                            this.setValue(current);
                        },
                        commit: function(widget) {
                            flog("commit dropdown", widget, widget.data.dropdown);
                            widget.setData('dropdown', this.getValue());
                        }
                    }
                ]
            }
        ]
    };
});