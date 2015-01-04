function initTextEditor(fileName) {
    initLoadingOverlay();

    var editor = ace.edit('editor');
    var extension = fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length) || 'txt';
    var editorMode = '';

    switch (extension) {
        case 'js':
            editorMode = 'javascript';
            break;
        default :
            editorMode = extension;
    }

//    editor.setTheme("ace/theme/github");
    editor.getSession().setMode("ace/mode/" + editorMode);
    editor.setOptions({
        minLines: editor.getSession().$rowLengthCache.length,
        maxLines: Infinity
    });

    $('#editor').removeClass('hide');
    editor.focus();

    var btnSave = $('.btn-save-file');

    $(document.body).on('keydown', function (e) {
        if (e.ctrlKey && e.keyCode === keymap.S) {
            e.preventDefault();
            btnSave.trigger('click');
        }
    });

    btnSave.on('click', function (e) {
        e.preventDefault();

        var btn = $(this);
        var href = btn.prop('href');
        var fileContent = editor.getValue();

        showLoadingOverlay();

        $.ajax({
            url: href,
            type: 'PUT',
            data: fileContent,
            success: function () {
                Msg.success('File is saved!');
                hideLoadingOverlay();
            },
            error: function (e) {
                Msg.error(e.status + ': ' + e.statusText);
                hideLoadingOverlay();
            }
        })
    });

    var editorWrapper = $('#editor-wrapper');
    var btnFullscreen = $('.btn-fullscreen');

    btnFullscreen.on('click', function (e) {
        e.preventDefault();

        fullscreenEditor(!btnFullscreen.hasClass('active'));
    });

    function fullscreenEditor(isFullscreen) {
        var icon = btnFullscreen.find('i');

        if (isFullscreen) {
            btnFullscreen.addClass('active');
            btnFullscreen.attr('title', 'Exit fullscreen mode');
            icon.attr('class', 'clip-fullscreen-exit');
            editorWrapper.fullscreen();
            editorWrapper.addClass('fullscreen-mode');
            editor.setOptions({
                maxLines: null
            });
        } else {
            btnFullscreen.removeClass('active');
            btnFullscreen.attr('title', 'Enter fullscreen mode');
            icon.attr('class', 'clip-fullscreen');
            $.fullscreen.exit();
            editorWrapper.removeClass('fullscreen-mode');
            editor.setOptions({
                maxLines: Infinity
            });
        }
    }

    editorWrapper.on('fscreenclose', function () {
        fullscreenEditor(false);
    });
}