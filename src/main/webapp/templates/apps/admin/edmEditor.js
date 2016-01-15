var win = $(window);

function initEdmEditorPage(fileName) {
    flog('initEdmEditorPage', fileName);
    var body = $(document.body);

    initKEditor(body);
    initBtns(body, fileName);
    initSnippetsToggler(body);
    Msg.iconMode = 'fa';

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

function initKEditor(body) {
    $('#content-area').keditor({
        ckeditor: {
            skin: editorSkin,
            allowedContent: true, // DISABLES Advanced Content Filter. This is so templates with classes are allowed through
            bodyId: 'editor',
            templates_files: [templatesPath],
            templates_replaceContent: false,
            toolbarGroups: toolbarSets['Default'],
            extraPlugins: 'embed_video,fuse-image,sourcedialog,onchange',
            removePlugins: standardRemovePlugins + ',autogrow',
            enterMode: 'P',
            forceEnterMode: true,
            filebrowserBrowseUrl: '/static/fckfilemanager/browser/default/browser.html?Type=Image&Connector=/fck_connector.html',
            filebrowserUploadUrl: '/uploader/upload',
            format_tags: 'p;h1;h2;h3;h4;h5;h6', // removed p2
            format_p2: {
                element: 'p',
                attributes: {
                    'class': 'lessSpace'
                }
            },
            minimumChangeMilliseconds: 100,
            stylesSet: 'myStyles:' + stylesPath
        },
        snippetsUrl: '/static/keditor/1.0.1/snippets/edm/snippets.html',
        snippetsListId: 'snippets-list',
        onContentChanged: function () {
            if (!body.hasClass('content-changed')) {
                body.addClass('content-changed');
            }
        }
    });
}

function getEdmContent() {
    var bodyContent = $('#content-area').keditor('getContent');



    return bodyContent;
}

function initBtns(body, fileName) {
    flog('initBtns', fileName);

    $('.btn-save-file').on('click', function (e) {
        e.preventDefault();

        showLoadingIcon();

        $.ajax({
            url: fileName,
            type: 'POST',
            data: {
                body: getEdmContent()
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

function initSnippetsToggler(body) {
    flog('initSnippetsToggler');

    $('#keditor-snippets-toggler').on('click', function (e) {
        e.preventDefault();

        var icon = $(this).find('i');
        if (body.hasClass('opened-keditor-snippets')) {
            body.removeClass('opened-keditor-snippets');
            icon.attr('class', 'fa fa-chevron-left')
        } else {
            body.addClass('opened-keditor-snippets');
            icon.attr('class', 'fa fa-chevron-right')
        }
    });
}

function hideLoadingIcon() {
    $('#editor-loading').addClass('hide');
}

function showLoadingIcon() {
    $('#editor-loading').removeClass('hide');
}
