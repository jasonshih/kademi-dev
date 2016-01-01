var win = $(window);

function initContentEditorPage(fileName) {
    flog('initContentEditorPage', fileName);
    var body = $(document.body);

    initCKEditorBase();
    initBtns(body, fileName);
    initSnippet();
    initContentArea();

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

function initContentArea() {
    var contentArea = $('#content-area');

    contentArea.droppable({
        accept: '.snippet',
        tolerance: 'pointer',
        greedy: true,
        drop: function (event, ui) {
            flog('drop', event, ui);

            var data = ui.draggable.find('.snippet-content').html();
            var section = $('<section contenteditable="true"></section>').html(data);

            setTimeout(function () {
                ui.draggable.replaceWith(section);
            }, 100);

            return ui.draggable.html(data).removeAttr('class');
        }
    }).sortable({
        handle: '.grab',
        items: '> section',
        axis: 'y',
        sort: function () {
            $(this).removeClass('ui-state-default');
        }
    });

    contentArea.find('> section').each(function () {
        var section = $(this);

        initCKEditorInline(section.prop('contenteditable', true));
    });

    contentArea.on({
        click: function () {
            var section = $(this);

            if (!section.hasClass('cke_editable')) {
                initCKEditorInline(section);
            }
        }
    }, '> section');
}

function initCKEditorBase() {
    themeCssFiles.push('/static/editor/editor.css'); // just to format the editor itself a little
    themeCssFiles.push('/static/prettify/prettify.css');

    $('link[rel=editor-stylesheet]').each(function (i, n) {
        var cssPath = $(n).attr('href');
        themeCssFiles.push(cssPath);
        $(n).remove();
    });
}

function initCKEditorInline(target) {
    flog('init CKEditor inline', target);

    var body = $(document.body);
    initHtmlEditors(target, null, null, 'embed_video,fuse-image,sourcedialog,onchange', standardRemovePlugins, function (editor) {
        flog('Editor is ready!');

        setTimeout(function () {
            editor.on('change', function () {
                flog('Editor content is changed!');

                if (!body.hasClass('content-changed')) {
                    body.addClass('content-changed');
                }
            });
        }, 1000);
    });
}

function getData() {
    var contentArea = $('#content-area');
    contentArea.find('> section').each(function () {
        var section = $(this);
        var id = section.attr('id');

        CKEDITOR.instances[id].destroy();
    });

    var contentAreaClone = contentArea.clone();
    contentAreaClone.find('> section').each(function () {
        var section = $(this);
        section.replaceWith(
            $('<section />').html(section.html())
        );
    });

    return contentAreaClone.html();
}

function initBtns(body, fileName) {
    flog('initBtns', fileName);

    $('.btn-save-file').on('click', function (e) {
        e.preventDefault();

        var fileContent = getData();

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
        connectToSortable: '#content-area',
        cursorAt: {
            top: 0,
            left: 0
        }
    });
}

function hideLoadingIcon() {
    $('#editor-loading').addClass('hide');
}

function showLoadingIcon() {
    $('#editor-loading').removeClass('hide');
}
