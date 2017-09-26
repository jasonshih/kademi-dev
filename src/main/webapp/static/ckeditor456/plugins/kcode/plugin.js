(function (CKEDITOR) {
    CKEDITOR.plugins.add('kcode', {
        init: function (editor) {
            var fields = [];
            $.ajax({
                url: '/_fields',
                type: 'get',
                dataType: 'JSON',
                success: function (resp) {
                    $.each(resp.data, function (i, field) {
                        fields.push([
                            field.label,
                            field.placeholder
                        ]);
                    });
                }
            });
            
            // ===========================================================
            // Add dialog for plugin
            // ===========================================================
            CKEDITOR.dialog.add('kcodeDialog', function (editor) {
                return {
                    title: 'Insert Kcode',
                    width: 200,
                    height: 80,
                    contents: [{
                        id: 'general',
                        label: 'Kcode List',
                        elements: [{
                            type: 'select',
                            id: 'kcode',
                            default: '',
                            label: 'Kcode',
                            items: fields,
                            commit: function (data) {
                                data.kcode = this.getValue();
                            }
                        }]
                    }],
                    onOk: function () {
                        var data = {};
                        this.commitContent(data);
                        editor.insertHtml( data.kcode );
                    }
                };
            });
            
            // ===========================================================
            // Add command for plugin
            // ===========================================================
            editor.addCommand('inserKcodeDialog', new CKEDITOR.dialogCommand('kcodeDialog'));
            
            // ===========================================================
            // Add toolbar button for plugin
            // ===========================================================
            editor.ui.addButton('kcode', {
                label: 'Kcode',
                command: 'inserKcodeDialog',
                toolbar: 'insert,2',
                icon: this.path + 'images/icon.png'
            });
        }
    });
    
})(CKEDITOR);