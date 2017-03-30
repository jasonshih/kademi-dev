var win = $(window);

function doPostMessage(data, url) {    
    data.from = 'keditor';
    var dataStr = JSON.stringify(data);
    flog('doPostMessage', data, window.parent);
    window.parent.postMessage(dataStr, url);
}

function initContentEditorPage(fileName) {    

    var body = $(document.body);
    var url = getParam('url') || '';
    if (url && url !== 'undefined') {
        flog('initContentEditorPage url=', url);
        body.addClass('embedded-iframe');
        doPostMessage({
            url: window.location.href.split('#')[0]
        }, url);
    } else {
        flog('initContentEditorPage fileName=', fileName);
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
    }
    var timer;
    win.on('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            var bd = $(document.body);
            var paddingTop = bd.css('padding-top');
            if( paddingTop ) {
                paddingTop = paddingTop.replace('px', '');
                $('#content-area .keditor-content-area').css('min-height', win.height() - paddingTop);
            }
        }, 100);
    }).trigger('resize');

    initKEditor(body, fileName);
    initSaving(body, fileName);

    setTimeout(function () {
        hideLoadingIcon();
    }, 200);

    $(document.body).on('click', '.keditor-component-content a', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
    });
}

function initKEditor(fileName) {
    var themeCss = $('head link[href^="/--theme--less--bootstrap.less"]');

    if( typeof themeCssFiles !== 'undefined' ) {
        
        if (themeCss.length > 0) {
            themeCssFiles.push(themeCss.attr('href'));
        }    
        themeCssFiles.push('/static/bootstrap/ckeditor/bootstrap-ckeditor.css');
    }
    
    $('#content-area').contentEditor({
        snippetsUrl: '_components?fileName=' + fileName
    });
}

function getParam(name) {
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var value = regex.exec(window.location.href) || '';
    value = decodeURIComponent(value[1]);

    return value;
}

function initSaving(body, fileName) {
    flog('initSaving', fileName);

    var isEmbeddedIframe = body.hasClass('embedded-iframe');
    var btnSaveFile = $('.btn-save-file');
    var postMessageData;
    if (isEmbeddedIframe) {
        win.on('message', function (e) {
            flog('On got message', e, e.originalEvent);

            postMessageData = $.parseJSON(e.originalEvent.data);
            if (postMessageData.triggerSave) {
                btnSaveFile.trigger('click');
            }
        });
    }

    btnSaveFile.on('click', function (e) {
        e.preventDefault();

        showLoadingIcon();
        $('[contenteditable]').blur();
        var fileContent = $('#content-area').contentEditor('getContent');
        var saveUrl = postMessageData && postMessageData.pageName ? postMessageData.pageName : fileName;

        $.ajax({
            url: saveUrl,
            type: 'POST',
            data: {
                body: fileContent
            },            
            dataType: 'json',
            success: function () {
                if (isEmbeddedIframe) {
                    doPostMessage({
                        isSaved: true,
                        resp: postMessageData.resp,
                        willClose: postMessageData.willClose
                    }, postMessageData.url);
                } else {
                    Msg.success('File is saved!');
                }

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
