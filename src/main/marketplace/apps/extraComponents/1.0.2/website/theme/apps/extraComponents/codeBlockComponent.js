(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['codeBlock'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "codeBlock" component', component);

            component.children('.keditor-component-content').css('min-height', 30);
            component.find('[data-dynamic-href="_components/codeBlock"]').remove();
        },

        settingEnabled: true,

        settingTitle: 'Code Block settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "photo" component');

            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <span>Initializing...</span>' +
                '           <button type="button" class="btn btn-block btn-primary" id="source-code-edit" style="display: none">Edit source code</button>' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            flog('Initialize modal for editing source code');
            var modal = $(
                '<div id="modal-code-block" class="modal fade">' +
                '   <div class="modal-dialog modal-lg">' +
                '       <div class="modal-content">' +
                '           <div class="modal-header">' +
                '               <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>' +
                '               <h4 class="modal-title">Edit source code</h4>' +
                '           </div>' +
                '           <div class="modal-body"><div id="source-code-editor" style="height: 500px;"></div></div>' +
                '           <div class="modal-footer">' +
                '               <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
                '               <button type="button" class="btn btn-primary btn-save-source">Save</button>' +
                '           </div>' +
                '       </div>' +
                '   </div>' +
                '</div>'
            ).appendTo(document.body);

            var editor;
            $.getScriptOnce('/static/ace/1.2.0/src-noconflict/ace.js', function () {
                flog('Loaded script for ACE');
                ace.config.set("modePath", "/static/ace/1.2.0/src-noconflict/");
                ace.config.set("workerPath", "/static/ace/1.2.0/src-noconflict/");
                ace.config.set("themePath", "/static/ace/1.2.0/src-noconflict/");

                editor = ace.edit('source-code-editor');
                editor.setTheme('ace/theme/textmate');
                editor.getSession().setMode("ace/mode/html");

                form.find('span').remove();

                $('.btn-save-source').on('click', function (e) {
                    e.preventDefault();

                    keditor.getSettingComponent().find('.keditor-component-content').html(editor.getValue());
                    modal.modal('hide');
                });

                $('#source-code-edit').css('display', 'block').on('click', function (e) {
                    e.preventDefault();

                    flog('Edit source code is clicked');

                    editor.setValue(keditor.getSettingComponent().find('.keditor-component-content').html());
                    modal.modal('show');
                });
            });
        }
    };

})(jQuery);