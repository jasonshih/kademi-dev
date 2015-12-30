var win = $(window);

function initContentEditorPage(fileName) {
    flog('initContentEditorPage', fileName);
    var body = $(document.body);

    initBtns(body, fileName);
    initRichTextEditor(body);

    win.on({
        keydown: function (e) {
            if (e.ctrlKey && e.keyCode === keymap.S) {
                e.preventDefault();
                $('.btn-save-file').trigger('click');
            }
        }
    });

    //window.onbeforeunload = function (e) {
    //    if (body.hasClass('content-changed')) {
    //        e.returnValue = 'Are you sure you would like to leave the editor? You will lose any unsaved changes';
    //    }
    //};

    hideLoadingIcon();
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

    initHtmlEditors($('#editor'), null, null, '', standardRemovePlugins + ',autogrow,fuse-image');

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

function initBtns(body, fileName) {
    flog('initBtns', fileName);

    $('.btn-save-file').on('click', function (e) {
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
}

function hideLoadingIcon() {
    $('#editor-loading').addClass('hide');
}

function showLoadingIcon() {
    $('#editor-loading').removeClass('hide');
}
