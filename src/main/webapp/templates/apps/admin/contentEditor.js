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

function initSnippet() {
    flog('initSnippet');

    var container = $('#snippet-container');
    var wrapper = $('#snippet-wrapper');

    $('#snippet-toggler').on('click', function (e) {
        e.preventDefault();

        var icon = $(this).find('i');
        if (container.hasClass('opened')) {
            container.removeClass('opened');
            icon.attr('class', 'glyphicon glyphicon-chevron-right')
        } else {
            container.addClass('opened');
            icon.attr('class', 'glyphicon glyphicon-chevron-left')
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
        revert: 'invalid'
    });

    $('#editor').droppable({
        accept: '.snippet',
        drop: function (event, ui) {
            var item = ui.draggable.clone().find('.snippet-content');
            $(this).append(item);
        }
    });/*.sortable({
        handle: '.grab',
        items: '> *',
        axis: 'y',
        delay: 300,
        revert: true,
        sort: function() {
            $( this ).removeClass( 'ui-state-default' );
        }
    });*/
}

function hideLoadingIcon() {
    $('#editor-loading').addClass('hide');
}

function showLoadingIcon() {
    $('#editor-loading').removeClass('hide');
}
