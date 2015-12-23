var win = $(window);

function hideLoadingIcon() {
    $('#editor-loading').addClass('hide');
}

function showLoadingIcon() {
    $('#editor-loading').removeClass('hide');
}

function initRichTextEditor(body) {
    flog('initRichTextEditor', body);

    themeCssFiles.push('/static/editor/editor.css'); // just to format the editor itself a little
    themeCssFiles.push('/static/prettify/prettify.css');

    $('link[rel=editor-stylesheet]').each(function (i, n) {
        var cssPath = $(n).attr('href');
        themeCssFiles.push(cssPath);
        $(n).remove();
    });

    var h = win.height() - 157;
    initHtmlEditors($('#editor'), h, null, '', standardRemovePlugins + ',autogrow');

    var editor = CKEDITOR.instances['editor'];
    editor.on('instanceReady', function () {
        flog('Editor is ready!');

        setTimeout(function () {
            editor.on('change', function() {
                flog('Editor content is changed!');

                if (!body.hasClass('content-changed')) {
                    body.addClass('content-changed');
                }
            });
        }, 1000);
    });
}

function initHtmlEditorPage(fileName) {
    flog('initHtmlEditorPage');
    var body = $(document.body);

    initRichTextEditor(body);

    var btnSave = $('.btn-save-file');
    btnSave.on('click', function (e) {
        e.preventDefault();

        var editor = CKEDITOR.instances['editor'];
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
                body.removeClass('content-changed');
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
            $('#cke_1_contents').css('height', (win.height() - 157) + 'px');
        }
    });

    window.onbeforeunload = function (e) {
        if (body.hasClass('content-changed')) {
            e.returnValue = 'Are you sure you would like to leave the editor? You will lose any unsaved changes';
        }
    };

    hideLoadingIcon();
}
