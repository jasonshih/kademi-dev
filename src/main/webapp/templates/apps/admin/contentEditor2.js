var win = $(window);

function initContentEditorPage(fileName) {
    flog('initContentEditorPage', fileName);
    var body = $(document.body);

    initContentEditor();
    initBtns(body, fileName);
    initSnippet();

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

function initBtns(body, fileName) {
    flog('initBtns', fileName);

    var contentArea = $('#content-area');

    $('.btn-save-file').on('click', function (e) {
        e.preventDefault();

        var fileContent = contentArea.data('contentbuilder').html();
        flog('save', fileContent);
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
                flog("opener", window.opener);
                var opener = window.opener;
                var doc = opener.document;
                var iframe = doc.getElementById("rawBody");
                flog("iframe", iframe);
                var w = iframe.contentWindow;
                flog("window", w);
                var doc2 = w.document;
                flog("doc2", doc2);
                doc2.location.reload();
            },
            error: function (e) {
                Msg.error(e.status + ': ' + e.statusText);
                hideLoadingIcon();
            }
        })
    });

    $('.btn-view-html').on('click', function (e) {
        e.preventDefault();

        contentArea.data('contentbuilder').viewHtml();
    });
}

function hideLoadingIcon() {
    $('#editor-loading').addClass('hide');
}

function showLoadingIcon() {
    $('#editor-loading').removeClass('hide');
}

function initContentEditor() {
    flog('initContentEditor');

    var url =  window.location.pathname.replace('contenteditor', '');

    $('#content-area').contentbuilder({
        enableZoom: false,
        imageselect: '/static/ContentBuilder/assets/kademi/images.html?url=' + url,
        fileselect: '/static/ContentBuilder/assets/kademi/images.html?url=' + url,
        snippetFile: '/static/ContentBuilder/assets/kademi/snippets.html',
        snippetList: '#snippet-wrapper',
        imageEmbed: false
    }).data('contentbuilder').zoom(1);
}

function initSnippet() {
    flog('initSnippet');

    $('#snippet-wrapper').niceScroll({
        cursorcolor: '#999',
        cursorwidth: 6,
        railpadding: {
            top: 0,
            right: 3,
            left: 0,
            bottom: 0
        },
        cursorborder: ''
    });

    var container = $('#snippet-container');
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
}
