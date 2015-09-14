function initTextEditor(fileName) {
    var DEFAULT_THEME = 'ace/theme/textmate';

    var editor = ace.edit('editor');

    // Format of editor
    var extension = fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length) || 'txt';
    $('#file-type').val("ace/mode/" + (extension === 'js' ? 'javascript' : extension)).on('change', function () {
        editor.getSession().setMode(this.value);
    }).trigger('change');

    // Theme of editor
    $('#theme-switcher').val(DEFAULT_THEME).on('change', function () {
        editor.setTheme(this.value);
    });

    // Word wrap of editor
    $('.btn-word-wrap').on('click', function (e) {
        e.preventDefault();

        var btn = $(this);

        if (btn.hasClass('active')) {
            btn.removeClass('active');
            editor.getSession().setUseWrapMode('');
        } else {
            btn.addClass('active');
            editor.getSession().setUseWrapMode('free');
        }
    });

    // Font size of editor
    $('#font-size-switcher').val('12px').on('change', function () {
        editor.container.style.fontSize = this.value;
        editor.updateFontSize();
    });

    // Shortcut of editor
    $('#shortcut-switcher').val('').on('change', function () {
        editor.setKeyboardHandler(this.value);
    });

    // Remove Shortcut for showing setting panel
    editor.commands.removeCommands(["showSettingsMenu"]);

    editor.setOptions({
        minLines: editor.getSession().$rowLengthCache.length
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

        showLoadingIcon();

        $.ajax({
            url: href,
            type: 'PUT',
            data: fileContent,
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

    initFullScreenMode();
    hideLoadingIcon();
}

function initFullScreenMode() {
    var editorWrapper = $('#editor-wrapper');
    var btnFullscreen = $('.btn-fullscreen');

    btnFullscreen.on('click', function (e) {
        e.preventDefault();

        makeFullscreenEditor(!btnFullscreen.hasClass('active'));
    });

    editorWrapper.on('fscreenclose', function () {
        makeFullscreenEditor(false);
    });
}

function makeFullscreenEditor(isFullscreen) {
    var editorWrapper = $('#editor-wrapper');
    var btnFullscreen = $('.btn-fullscreen');
    var icon = btnFullscreen.find('i');

    if (isFullscreen) {
        btnFullscreen.addClass('active');
        btnFullscreen.attr('title', 'Exit fullscreen mode');
        icon.attr('class', 'clip-fullscreen-exit');
        editorWrapper.fullscreen();
        editorWrapper.addClass('fullscreen-mode');
    } else {
        btnFullscreen.removeClass('active');
        btnFullscreen.attr('title', 'Enter fullscreen mode');
        icon.attr('class', 'clip-fullscreen');
        $.fullscreen.exit();
        editorWrapper.removeClass('fullscreen-mode');
    }
}
