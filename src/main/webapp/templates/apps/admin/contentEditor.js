var win = $(window);

function initContentEditorPage(fileName, snippetsUrl) {
    flog('initContentEditorPage', fileName);
    var body = $(document.body);

    initKEditor(body, snippetsUrl);
    initBtns(body, fileName);
    initSnippetsToggler(body);

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

function initKEditor(body, snippetsUrl) {
    var themeCssFiles = [];
    themeCssFiles.push('/theme/assets/plugins/bootstrap/css/bootstrap.min.css');
    themeCssFiles.push('/theme/assets/plugins/bootstrap/css/bootstrap-ckeditor.css');

    $('#content-area').keditor({
        ckeditor: {
            skin: editorSkin,
            allowedContent: true, // DISABLES Advanced Content Filter. This is so templates with classes are allowed through
            contentsCss: themeCssFiles, // mainCssFile,
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
        snippetsUrl: snippetsUrl,
        snippetsListId: 'snippets-list',
        onContentChange: function (event) {
            if (!body.hasClass('content-changed')) {
                body.addClass('content-changed');
            }
        }
    });
}

function initBtns(body, fileName) {
    flog('initBtns', fileName);

    $('.btn-save-file').on('click', function (e) {
        e.preventDefault();

        var fileContent = $('#content-area').keditor('getContent');

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

function initSnippetsToggler(body) {
    flog('initSnippetsToggler');

    $('#keditor-snippets-toggler').on('click', function (e) {
        e.preventDefault();

        var icon = $(this).find('i');
        if (body.hasClass('opened-keditor-snippets')) {
            body.removeClass('opened-keditor-snippets');
            icon.attr('class', 'glyphicon glyphicon-chevron-left')
        } else {
            body.addClass('opened-keditor-snippets');
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
