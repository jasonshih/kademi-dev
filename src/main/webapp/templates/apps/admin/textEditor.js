function hideLoadingIcon() {
    $('#editor-loading').addClass('hide');
}

function showLoadingIcon() {
    $('#editor-loading').removeClass('hide');
}

function initTextEditor(fileName) {
    var DEFAULT_THEME = 'ace/theme/textmate';
    var DEFAULT_FONT_SIZE = '12px';
    var DEFAULT_SHORTCUT = '';
    var DEFAULT_WORD_WRAP = '';

    var initTheme = $.cookie('text-editor-theme') || DEFAULT_THEME;
    var initFontSize = $.cookie('text-editor-fontsize') || DEFAULT_FONT_SIZE;
    var initShortcut = $.cookie('text-editor-shortcut') || DEFAULT_SHORTCUT;
    var initWordWrap = $.cookie('text-editor-wordwrap') || DEFAULT_WORD_WRAP;

    var body = $(document.body);

    var editor = ace.edit('editor');
    editor.on('input', function () {
        if (!body.hasClass('content-changed')) {
            body.addClass('content-changed')
        }
    });

    var storeSetting = function (key, value) {
        $.cookie(key, value, {
            path: '/',
            expires: 999
        });
    };
    var setTheme = function (theme) {
        storeSetting('text-editor-theme', theme);
        editor.setTheme(theme);
    };
    var setFontSize = function (fontSize) {
        storeSetting('text-editor-fontsize', fontSize);
        editor.container.style.fontSize = fontSize;
        editor.updateFontSize();
    };
    var setShortcut = function (shortcut) {
        storeSetting('text-editor-shortcut', shortcut);
        editor.setKeyboardHandler(shortcut);
    };
    var setWordWrap = function (wordWrap) {
        storeSetting('text-editor-wordwrap', wordWrap);

        var btn = $('.btn-word-wrap');

        if (wordWrap === 'free') {
            btn.addClass('active');
            editor.getSession().setUseWrapMode('free');
        } else {
            btn.removeClass('active');
            editor.getSession().setUseWrapMode('');
        }
    };

    // Format of editor
    var extension = fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length) || 'txt';
    $('#file-type').val("ace/mode/" + (extension === 'js' ? 'javascript' : extension)).on('change', function () {
        editor.getSession().setMode(this.value);
    }).trigger('change');

    // Theme of editor
    $('#theme-switcher').val(initTheme).on('change', function () {
        setTheme(this.value);
    });

    // Word wrap of editor
    setWordWrap(initWordWrap);
    $('.btn-word-wrap').on('click', function (e) {
        e.preventDefault();

        var btn = $(this);

        if (btn.hasClass('active')) {
            setWordWrap('');
        } else {
            setWordWrap('free');
        }
    });

    // Font size of editor
    $('#font-size-switcher').val(initFontSize).on('change', function () {
        setFontSize(this.value);
    });

    // Shortcut of editor
    setShortcut(initShortcut);
    $('#shortcut-switcher').val(initShortcut).on('change', function () {
        setShortcut(this.value);
    });

    // Remove Shortcut for showing setting panel
    editor.commands.removeCommands(["showSettingsMenu"]);

    editor.setOptions({
        minLines: editor.getSession().$rowLengthCache.length,
        theme: initTheme,
        wrap: initWordWrap,
        fontSize: initFontSize
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

                var storageName = getStorageName();
                localStorage.setItem(storageName, fileContent);
            },
            error: function (e) {
                Msg.error(e.status + ': ' + e.statusText);
                hideLoadingIcon();
            }
        })
    });

    initLocalStorage(editor);
    initFullScreenMode();
    hideLoadingIcon();

    window.onbeforeunload = function (e) {
        if (body.hasClass('content-changed')) {
            e.returnValue = "Are you sure you would like to leave the editor? You will lose any unsaved changes";
        }
    }
}

function getStorageName() {
    return location.pathname + location.search;
}

function initLocalStorage(editor) {
    var storageName = getStorageName();
    var btnRestore = $('.btn-restore-file');
    var localCode = localStorage.getItem(storageName);
    var currentCode = editor.getValue();

    if (localCode && localCode !== currentCode) {
        btnRestore.removeClass('hide');
        btnRestore.tooltip({
            placement: 'bottom',
            trigger: 'manual',
            container: 'body'
        }).tooltip('show');

        setTimeout(function () {
            btnRestore.tooltip('hide');
        }, 10 * 1000);
    }

    btnRestore.on('click', function (e) {
        e.preventDefault();

        if (confirm('Are you sure that you want to restore the latest version of this file in your local storage?')) {
            editor.setValue(localCode);
        }
    });
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
