var win = $(window);

function initContentEditorPage(fileName, snippetsUrl) {
    flog('initContentEditorPage', fileName);
    var body = $(document.body);

    CKEDITOR.disableAutoInline = true;
    initCKEditorBase();
    initBtns(body, fileName);
    initSnippet(snippetsUrl);
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
    var body = $(document.body);

    contentArea.droppable({
        accept: '.snippet',
        tolerance: 'pointer',
        greedy: true,
        drop: function (event, ui) {
            flog('drop', event, ui);

            if (ui.draggable.closest('#content-area').length > 0) {
                ui.draggable.attr('class', 'keditor-section');
                ui.draggable.find('.snippet-content').attr('class', 'keditor-section-inner').html(
                    $(ui.draggable.attr('data-snippet')).html()
                );

                setTimeout(function () {
                    initKEditorToolbar(ui.draggable);
                    initKEditorInline(ui.draggable);
                }, 50);

                return ui.draggable;
            }
        }
    }).sortable({
        handle: '.btn-reposition',
        items: '> section',
        connectWith: '#content-area',
        axis: 'y',
        sort: function () {
            $(this).removeClass('ui-state-default');
        }
    });

    contentArea.find('> section').each(function () {
        var section = $(this);
        section.addClass('keditor-section-inner');
        section.wrap('<section class="keditor-section"></section>')

        var wrapper = section.parent();
        initKEditorInline(wrapper);
        initKEditorToolbar(wrapper);
    });

    body.on('click', function (e) {
        contentArea.find('.keditor-section').removeClass('showed-keditor-toolbar');

        var section = getClickElement(e, 'section.keditor-section');
        if (section) {
            section.addClass('showed-keditor-toolbar');
        }

        var btnRemove = getClickElement(e, '.btn-delete');
        if (btnRemove && confirm('Are you sure that you want to delete this section? This action can not be undo!')) {
            var section = btnRemove.closest('section.keditor-section');
            var id = section.find('.keditor-section-inner').attr('id');

            CKEDITOR.instances[id].destroy();
            section.remove();
        }
    });
}

function getClickElement(e, selector) {
    var target = $(e.target);
    var closest = target.closest(selector);

    if (target.is(selector)) {
        return target;
    } else if (closest.length > 0) {
        return closest;
    } else {
        return null;
    }
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

function initKEditorToolbar(target) {
    target.append(
        '<div class="keditor-toolbar">' +
        '   <div class="btn-group-vertical">' +
        '       <a href="#" class="btn btn-xs btn-info btn-reposition"><i class="glyphicon glyphicon-sort"></i></a>' +
        '       <a href="#" class="btn btn-xs btn-danger btn-delete"><i class="glyphicon glyphicon-remove"></i></a>' +
        '   </div>' +
        '</div>'
    );
}

function initKEditorInline(target) {
    if (!target.hasClass('keditor-editable') || !target.hasClass('keditor-initing')) {
        flog('init CKEditor inline', target);

        target.addClass('keditor-initing');

        var inner = target.find('.keditor-section-inner');
        inner.prop('contenteditable', true);

        // Init CKEditor inline
        initHtmlEditors(inner, null, null, 'embed_video,fuse-image,sourcedialog,onchange', standardRemovePlugins, function (editor) {
            flog('Editor is ready!');

            setTimeout(function () {
                editor.on('change', function () {
                    flog('Editor content is changed!');

                    var body = $(document.body);
                    if (!body.hasClass('content-changed')) {
                        body.addClass('content-changed');
                    }
                });
            }, 1000);
        });

        target.addClass('keditor-editable');
        target.removeClass('keditor-initing');
    }
}

function getData() {
    var contentArea = $('#content-area');
    var html = '';

    contentArea.find('> section').each(function () {
        var section = $(this);
        var id = section.find('.keditor-section-inner').attr('id');

        html += '<section>' + CKEDITOR.instances[id].getData() + '</section>';
    });

    return html;
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

function initSnippet(snippetsUrl) {
    flog('initSnippet', snippetsUrl);

    var container = $('#snippet-container');
    var wrapper = $('#snippet-wrapper');
    var body = $(document.body);

    $.ajax({
        type: 'get',
        dataType: 'html',
        url: snippetsUrl,
        success: function (resp) {
            var snippets = $('<div />').html(resp);
            var snippetsHtml = '';
            var snippetsContentHtml = '';

            snippets.find('> div').each(function (i) {
                var div = $(this);
                var content = div.html().trim();
                var preview = '<img src="' + div.attr('data-preview') + '" />';

                snippetsHtml += '<section class="snippet" data-snippet="#keditor-snippet-' + i + '">';
                snippetsHtml += '   <section class="snippet-content">' + preview + '</section>';
                snippetsHtml += '</section>';

                snippetsContentHtml += '<div id="keditor-snippet-' + i + '" style="display: none;">' + content + '</div>';
            });

            $('#snippet-content').html(snippetsContentHtml);

            wrapper.html(snippetsHtml).niceScroll({
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
                },
                start: function () {
                    $('.keditor-section-inner').blur();
                }
            });
        }
    });

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
}

function hideLoadingIcon() {
    $('#editor-loading').addClass('hide');
}

function showLoadingIcon() {
    $('#editor-loading').removeClass('hide');
}
