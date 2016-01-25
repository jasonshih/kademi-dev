var win = $(window);
var DEFAULT_EDM_BACKGROUND= '#fafafa';
var DEFAULT_EDM_PADDING_TOP = '20px';
var DEFAULT_EDM_PADDING_BOTTOM = '20px';
var DEFAULT_EDM_PADDING_LEFT = '20px';
var DEFAULT_EDM_PADDING_RIGHT = '20px';
var DEFAULT_EDM_BODY_BACKGROUND = '#ffffff';
var DEFAULT_EDM_BODY_PADDING_TOP = '10px';
var DEFAULT_EDM_BODY_PADDING_BOTTOM = '10px';
var DEFAULT_EDM_BODY_PADDING_LEFT = '10px';
var DEFAULT_EDM_BODY_PADDING_RIGHT = '10px';
var DEFAULT_TEXT_COLOR = '#333333';
var DEFAULT_LINK_COLOR = '#337ab7';
var DEFAULT_FONT_FAMILY = 'Arial, Helvetica, san-serif';
var DEFAULT_FONT_SIZE = '14px';
var DEFAULT_LINE_HEIGHT = '1.42857143';

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

function applyInlineCssForLink(target) {
    target.each(function () {
        $(this).css({
            'text-decoration': 'none',
            'color': $('#edm-link-color').val()
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
    $('#edm-background').val(tdWrapper.css('background-color') || DEFAULT_EDM_BACKGROUND);
    $('#edm-padding-top').val(tdWrapper.css('padding-top') || DEFAULT_EDM_PADDING_TOP);
    $('#edm-padding-bottom').val(tdWrapper.css('padding-bottom') || DEFAULT_EDM_PADDING_BOTTOM);
    $('#edm-padding-left').val(tdWrapper.css('padding-left') || DEFAULT_EDM_PADDING_LEFT);
    $('#edm-padding-right').val(tdWrapper.css('padding-right') || DEFAULT_EDM_PADDING_RIGHT);

    var tdBody = edmHtml.find('td#edm-body-td');
    $('#edm-body-background').val(tdBody.css('background-color') || DEFAULT_EDM_BODY_BACKGROUND);
    $('#edm-body-padding-top').val(tdBody.css('padding-top') || DEFAULT_EDM_BODY_PADDING_TOP);
    $('#edm-body-padding-bottom').val(tdBody.css('padding-bottom') || DEFAULT_EDM_BODY_PADDING_BOTTOM);
    $('#edm-body-padding-left').val(tdBody.css('padding-left') || DEFAULT_EDM_BODY_PADDING_LEFT);
    $('#edm-body-padding-right').val(tdBody.css('padding-right') || DEFAULT_EDM_BODY_PADDING_RIGHT);
    $('#edm-font-family').val(tdBody.attr('data-font-family') || DEFAULT_FONT_FAMILY);
    $('#edm-font-size').val(tdBody.attr('data-font-size') || DEFAULT_FONT_SIZE);
    $('#edm-line-height').val(tdBody.attr('data-line-height') || DEFAULT_LINE_HEIGHT);
    $('#edm-text-color').val(tdBody.attr('data-text-color') || DEFAULT_TEXT_COLOR);
    $('#edm-link-color').val(tdBody.attr('data-link-color') || DEFAULT_LINK_COLOR);
}

function initKEditor(body) {
    $('#edm-header, #edm-body, #edm-footer').keditor({
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
            extraPlugins: 'embed_video,fuse-image,sourcedialog,lineheight,onchange',
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
            var contentArea = $(this);
            contentArea[contentArea.find('> section').length === 0 ? 'addClass' : 'removeClass']('empty');

            return contentArea.find('> table');
        },
        onSectionReady: function (section) {
            var textWrapper = section.find('td.text-wrapper');
            applyInlineCssForTextWrapper(textWrapper);
            applyInlineCssForLink(textWrapper.find('a'));

            var editor = section.find('.keditor-section-content').ckeditor().editor;
            editor.on('change', function () {
                applyInlineCssForLink(textWrapper.find('a'));
            });
        },
        onContentChanged: function () {
            if (!body.hasClass('content-changed')) {
                body.addClass('content-changed');
            }

            var contentArea = $(this);
            contentArea[contentArea.find('> section').length === 0 ? 'addClass' : 'removeClass']('empty');
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

    // Init nicescroll
    settingPanel.getNiceScroll().hide();

    // Init colorpicker
    settingPanel.find('.color-picker').each(function () {
        var input = $(this);
        input.colorpicker({
            format: 'hex',
            container: input.parent(),
            component: '.add-on, .input-group-addon'
        }).trigger('changeColor.colorpicker');

        input.on('changeColor.colorpicker', function (e) {
            input.val(e.color.toHex());
            applySetting();
        });
    });

    settingPanel.find('input').not('.colorpicker').on('change', function () {
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
    var edmLinkColor = $('#edm-link-color').val();
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
    if (edmLinkColor) {
        attributeTDBody += ' data-link-color="' + edmLinkColor + '" ';
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
