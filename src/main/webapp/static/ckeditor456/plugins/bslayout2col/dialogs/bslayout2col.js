CKEDITOR.dialog.add('bslayout2col', function(editor) {
    return {
        title: 'Edit 2 column Layout',
        minWidth: 200,
        minHeight: 100,
        contents: [
            {
                id: 'alignment',
                elements: [
                    {
                        id: 'type',
                        type: 'select',
                        label: 'Alignment',
                        items: [
                            ['60/30', 'left'],
                            ['50/50', 'equal'],
                            ['30/60', 'right'],
                        ],
                        setup: function(widget) {
                            flog("a1");
                            var current = widget.data.alignment;
                            this.setValue(current);
                        },
                        commit: function(widget) {
                            flog("a2");
                            widget.setData('alignment', this.getValue());
                        }
                    }
                ]
            }
        ]
    };
});