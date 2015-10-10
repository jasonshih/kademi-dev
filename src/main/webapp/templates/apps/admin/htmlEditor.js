var win = $(window);

function hideLoadingIcon() {
    $('#editor-loading').addClass('hide');
}

function showLoadingIcon() {
    $('#editor-loading').removeClass('hide');
}

function initHtmlEditorPage(fileName, cssPaths) {
    flog("initHtmlEditorPage");

    var h = win.height() - 157;
    initHtmlEditors($("#editor"), h, null, "", standardRemovePlugins + ",autogrow");

    var btnSave = $('.btn-save-file');
    btnSave.on('click', function (e) {
        e.preventDefault();

        var editor = CKEDITOR.instances["editor"];
        var fileContent = editor.getData();

        showLoadingIcon();

        $.ajax({
            url: fileName,
            type: 'POST',
            data: {
                body: fileContent
            },
            success: function () {
                Msg.success('File is saved!');
                hideLoadingIcon();
            },
            error: function (e) {
                Msg.error(e.status + ': ' + e.statusText);
                hideLoadingIcon();
            }
        })
    });

    win.on({
        keydown:  function (e) {
            if (e.ctrlKey && e.keyCode === keymap.S) {
                e.preventDefault();
                btnSave.trigger('click');
            }
        },

        resize: function () {
            $("#cke_1_contents").css("height", (win.height() - 157) + "px");
        }
    });

    hideLoadingIcon();
}
