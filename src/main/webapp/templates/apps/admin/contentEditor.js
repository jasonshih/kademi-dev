var win = $(window);

function initContentEditorPage(fileName) {
    flog('initContentEditorPage', fileName);
    var body = $(document.body);

    initBtns(body, fileName);
    initSnippet();
    initRichTextEditor(body);

    win.on({
        keydown: function (e) {
            if (e.ctrlKey && e.keyCode === keymap.S) {
                e.preventDefault();
                $('.btn-save-file').trigger('click');
            }
        }
    });

    window.onbeforeunload = function (e) {
        if (body.hasClass('content-changed')) {
            e.returnValue = 'Are you sure you would like to leave the editor? You will lose any unsaved changes';
        }
    };

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

    initHtmlEditors($('#editor'), null, null, 'embed_video,fuse-image,sourcedialog,onchange', standardRemovePlugins);

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

function initSnippet() {
    flog('initSnippet');

    var container = $('#snippet-container');
    var wrapper = $('#snippet-wrapper');
    var body = $(document.body);

    $('#snippet-toggler').on('click', function (e) {
        e.preventDefault();

        var icon = $(this).find('i');
        if (body.hasClass('opened-snippet')) {
            body.removeClass('opened-snippet');
            icon.attr('class', 'glyphicon glyphicon-chevron-left')
        } else {
            body.addClass('opened-snippet');
            icon.attr('class', 'glyphicon glyphicon-chevron-right')
        }
    });

    wrapper.niceScroll({
        cursorcolor: '#999',
        cursorwidth: 6,
        railpadding: {
            top: 0,
            right: 0,
            left: 0,
            bottom: 0
        },
        cursorborder: ''
    });

    wrapper.find('.snippet').draggable({
        helper: 'clone',
        revert: 'invalid',
        connectToSortable: '#editor'
    });

    $('#editor').droppable({
        accept: '.snippet',
        tolerance: 'pointer',
        greedy: true,
        drop: function (event, ui) {
            var data = ui.draggable.find('.snippet-content').html();
            return ui.draggable.html(data).removeAttr('class');
        }
    }).sortable({
        handle: '.grab',
        items: '> *, > * > *',
        axis: 'y',
        delay: 300,
        sort: function() {
            $( this ).removeClass( 'ui-state-default' );
        }
    });
}

function hideLoadingIcon() {
    $('#editor-loading').addClass('hide');
}

function showLoadingIcon() {
    $('#editor-loading').removeClass('hide');
}
