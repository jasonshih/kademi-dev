var win = $(window);

function initEdmEditorPage(fileName) {
    flog('initEdmEditorPage', fileName);
    var body = $(document.body);

    processFileBody();
    initKEditor(body);
    initSettingPanel();
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

function applyInlineCssForTextWrapper(target) {
    target.each(function () {
        $(this).css({
            '-ms-text-size-adjust': '100%',
            '-webkit-text-size-adjust': '100%',
            'font-family': $('#edm-font-family').val(),
            'font-size': $('#edm-font-size').val(),
            'line-height': $('#edm-line-height').val(),
            'color': $('#edm-text-color').val()
        });
    });
}

function processFileBody() {
    var edmBody = $('#edm-body');
    var edmHtml = $('<div />').html($('#edm-html').html());
    var edmStyle = $('#edm-style');
    var defaultStyle = edmStyle.html();
    var savedStyle = edmHtml.find('style').html();

    if (savedStyle && savedStyle.length > 0 && savedStyle !== defaultStyle) {
        edmStyle.html(savedStyle);
    }
    edmBody.html(edmHtml.find('td#edm-body-td').html());

    var tdWrapper = edmHtml.find('td#edm-wrapper-td');
    $('#edm-background').val(tdWrapper.css('background-color') || '#fafafa');
    $('#edm-padding-top').val(tdWrapper.css('padding-top') || '20px');
    $('#edm-padding-bottom').val(tdWrapper.css('padding-bottom') || '20px');
    $('#edm-padding-left').val(tdWrapper.css('padding-left') || '20px');
    $('#edm-padding-right').val(tdWrapper.css('padding-right') || '20px');

    var tdBody = edmHtml.find('td#edm-body-td');
    $('#edm-body-background').val(tdBody.css('background-color') || '#ffffff');
    $('#edm-body-padding-top').val(tdBody.css('padding-top') || '10px');
    $('#edm-body-padding-bottom').val(tdBody.css('padding-bottom') || '10px');
    $('#edm-body-padding-left').val(tdBody.css('padding-left') || '10px');
    $('#edm-body-padding-right').val(tdBody.css('padding-right') || '10px');
    $('#edm-font-family').val(tdBody.attr('data-font-family') || 'Arial, Helvetica, sans-serif');
    $('#edm-font-size').val(tdBody.attr('data-font-size') || '14px');
    $('#edm-line-height').val(tdBody.attr('data-line-height') || '1.42857143');
    $('#edm-text-color').val(tdBody.attr('data-text-color') || '#000000');
}

function initKEditor(body) {
    $('#edm-body').keditor({
        ckeditor: {
            skin: editorSkin,
            allowedContent: true, // DISABLES Advanced Content Filter. This is so templates with classes are allowed through
            bodyId: 'editor',
            templates_files: [templatesPath],
            templates_replaceContent: false,
            toolbarGroups: [
                {name: 'document', groups: ['mode', 'document', 'doctools']},
                {name: 'clipboard', groups: ['clipboard', 'undo']},
                {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
                {name: 'forms', groups: ['forms']},
                {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
                {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
                {name: 'links', groups: ['links']},
                {name: 'insert', groups: ['insert']},
                {name: 'styles', groups: ['styles']},
                {name: 'colors', groups: ['colors']},
                {name: 'tools', groups: ['tools']},
                {name: 'others', groups: ['others']},
                {name: 'about', groups: ['about']}
            ],
            extraPlugins: 'embed_video,fuse-image,sourcedialog,lineheight',
            removePlugins: 'table,magicline,tabletools',
            removeButtons: 'Save,NewPage,Preview,Print,Templates,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,HiddenField,ImageButton,Button,Select,Textarea,TextField,Radio,Checkbox,Outdent,Indent,Blockquote,CreateDiv,Language,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,BGColor,Maximize,About,ShowBlocks,BidiLtr,BidiRtl,Flash,Image',
            enterMode: CKEDITOR.ENTER_DIV,
            forceEnterMode: true,
            filebrowserBrowseUrl: '/static/fckfilemanager/browser/default/browser.html?Type=Image&Connector=/fck_connector.html',
            filebrowserUploadUrl: '/uploader/upload',
            format_tags: 'p;h1;h2;h3;h4;h5;h6',
            stylesSet: 'myStyles:' + stylesPath,
            line_height: '1;1.2;1.5;2;2.2;2.5'
        },
        snippetsUrl: '/static/keditor/snippets/edm/snippets.html',
        snippetsListId: 'snippets-list',
        onInitContent: function (contentArea) {
            return contentArea.find('> table');
        },
        onSectionReady: function (section) {
            applyInlineCssForTextWrapper(section.find('td.text-wrapper'));
        },
        onContentChanged: function () {
            if (!body.hasClass('content-changed')) {
                body.addClass('content-changed');
            }
        }
    });
}

function initSettingPanel() {
    flog('initSettingPanel');

    var settingPanel = $('#edm-setting');
    settingPanel.niceScroll({
        cursorcolor: '#999',
        cursorwidth: 6,
        railpadding: {
            top: 0,
            right: 0,
            left: 0,
            bottom: 0
        },
        cursorborder: '',
        zindex: 9999
    });

    settingPanel.getNiceScroll().hide();

    settingPanel.find('input').on('change', function () {
        applySetting();
    });

    applySetting();
}

function applySetting() {
    var edmBackground = $('#edm-background').val();
    var edmPaddingTop = $('#edm-padding-top').val();
    var edmPaddingBottom = $('#edm-padding-bottom').val();
    var edmPaddingLeft = $('#edm-padding-left').val();
    var edmPaddingRight = $('#edm-padding-right').val();
    $('html').css('background-color', edmBackground);
    $('#edm-area').css({
        'padding-top': edmPaddingTop,
        'padding-bottom': edmPaddingBottom,
        'padding-left': edmPaddingLeft,
        'padding-right': edmPaddingRight
    });

    var edmBodyBackground = $('#edm-body-background').val();
    var edmBodyPaddingTop = $('#edm-body-padding-top').val();
    var edmBodyPaddingBottom = $('#edm-body-padding-bottom').val();
    var edmBodyPaddingLeft = $('#edm-body-padding-left').val();
    var edmBodyPaddingRight = $('#edm-body-padding-right').val();
    var edmBody = $('#edm-body');
    edmBody.css({
        'background-color': edmBodyBackground,
        'padding-top': edmBodyPaddingTop,
        'padding-bottom': edmBodyPaddingBottom,
        'padding-left': edmBodyPaddingLeft,
        'padding-right': edmBodyPaddingRight
    });

    applyInlineCssForTextWrapper(edmBody.find('td.text-wrapper'));
}

function getEdmBody() {
    var edmBody = $('#edm-body').keditor('getContent', false);

    var edmBackground = $('#edm-background').val();
    var edmPaddingTop = $('#edm-padding-top').val();
    var edmPaddingBottom = $('#edm-padding-bottom').val();
    var edmPaddingLeft = $('#edm-padding-left').val();
    var edmPaddingRight = $('#edm-padding-right').val();
    var styleTDWrapper = '';
    var attributeTableWrapper = '';
    if (edmBackground) {
        styleTDWrapper += 'background-color: ' + edmBackground + ';';
        attributeTableWrapper += ' bgcolor="' + edmBackground + '" ';
    }
    if (edmPaddingTop) {
        styleTDWrapper += 'padding-top: ' + edmPaddingTop + ';';
    }
    if (edmPaddingBottom) {
        styleTDWrapper += 'padding-bottom: ' + edmPaddingBottom + ';';
    }
    if (edmPaddingLeft) {
        styleTDWrapper += 'padding-left: ' + edmPaddingLeft + ';';
    }
    if (edmPaddingRight) {
        styleTDWrapper += 'padding-right: ' + edmPaddingRight + ';';
    }

    var edmBodyBackground = $('#edm-body-background').val();
    var edmBodyPaddingTop = $('#edm-body-padding-top').val();
    var edmBodyPaddingBottom = $('#edm-body-padding-bottom').val();
    var edmBodyPaddingLeft = $('#edm-body-padding-left').val();
    var edmBodyPaddingRight = $('#edm-body-padding-right').val();
    var edmFontFamily = $('#edm-font-family').val();
    var edmFontSize = $('#edm-font-size').val();
    var edmLineHeight = $('#edm-line-height').val();
    var edmTextColor = $('#edm-text-color').val();
    var styleTDBody = '';
    var attributeTableBody = '';
    var attributeTDBody = '';
    if (edmBodyBackground) {
        styleTDBody += 'background-color: ' + edmBodyBackground + ';';
        attributeTableBody += ' bgcolor="' + edmBodyBackground + '" ';
    }
    if (edmBodyPaddingTop) {
        styleTDBody += 'padding-top: ' + edmBodyPaddingTop + ';';
    }
    if (edmBodyPaddingBottom) {
        styleTDBody += 'padding-bottom: ' + edmBodyPaddingBottom + ';';
    }
    if (edmBodyPaddingLeft) {
        styleTDBody += 'padding-left: ' + edmBodyPaddingLeft + ';';
    }
    if (edmBodyPaddingRight) {
        styleTDBody += 'padding-right: ' + edmBodyPaddingRight + ';';
    }
    if (edmFontFamily) {
        attributeTDBody += ' data-font-family="' + edmFontFamily + '" ';
    }
    if (edmFontSize) {
        attributeTDBody += ' data-font-size="' + edmFontSize + '" ';
    }
    if (edmLineHeight) {
        attributeTDBody += ' data-line-height="' + edmLineHeight + '" ';
    }
    if (edmTextColor) {
        attributeTDBody += ' data-text-color="' + edmTextColor + '" ';
    }

    return (
        '<table cellpadding="0" cellspacing="0" border="0" width="100%" id="edm-wrapper" ' + attributeTableWrapper + '>\n' +
        '    <tbody>\n' +
        '        <tr>\n' +
        '            <td id="edm-wrapper-td" style="' + styleTDWrapper + '" align="center">\n' +
        '                <table cellpadding="0" cellspacing="0" border="0" width="100%" id="edm-body" ' + attributeTableBody + ' align="center">\n' +
        '                    <tbody>\n' +
        '                        <tr>\n' +
        '                            <td id="edm-body-td" style="' + styleTDBody + '" ' + attributeTDBody + '>\n' + edmBody + '</td>\n' +
        '                        </tr>\n' +
        '                    </tbody>\n' +
        '                </table>\n' +
        '            </td>\n' +
        '        </tr>\n' +
        '    </tbody>\n' +
        '</table>\n'
    );
}

function getEdmContent() {
    var edmContent =
        '<!DOCTYPE HTML>\n' +
        '<html>\n' +
        '    <head>\n' +
        '        <title>Kademi EDM Title</title>\n' +
        '        <style type="text/css">\n' +
        '            {{styleContent}}\n' +
        '        </style>\n' +
        '    </head>\n' +
        '    <body>\n' +
        '        <center>\n' +
        '{{bodyContent}}\n' +
        '        </center>\n' +
        '        <img src="http://$page.closest(\'website\').domainName${formatter.portString}/ack?i=$page.emailItem.id" height="1" width="1" alt="" />' +
        '    </body>\n' +
        '</html>';
    var edmContentData = {
        styleContent: $('#edm-style').html().trim(),
        bodyContent: getEdmBody()
    };

    for (var key in edmContentData) {
        var regex = new RegExp('{{' + key + '}}', 'gi');
        edmContent = edmContent.replace(regex, edmContentData[key]);
    }

    return edmContent;
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

    var settingPanel = $('#edm-setting');
    var snippetsList = $('#snippets-list');

    $('.btn-setting').on('click', function (e) {
        e.preventDefault();

        var btn = $(this);

        if (btn.hasClass('active')) {
            settingPanel.getNiceScroll().hide();
            snippetsList.getNiceScroll().show();
            settingPanel.removeClass('showed');
            btn.removeClass('active');
        } else {
            settingPanel.getNiceScroll().show();
            setTimeout(function () {
                settingPanel.getNiceScroll().resize();
            }, 300);
            snippetsList.getNiceScroll().hide();
            settingPanel.addClass('showed');
            btn.addClass('active');
        }
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
