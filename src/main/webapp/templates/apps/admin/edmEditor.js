var win = $(window);
var DEFAULT_EDM_BACKGROUND = '#fafafa';
var DEFAULT_EDM_PADDING_TOP = '20';
var DEFAULT_EDM_PADDING_BOTTOM = '20';
var DEFAULT_EDM_PADDING_LEFT = '20';
var DEFAULT_EDM_PADDING_RIGHT = '20';
var DEFAULT_EDM_BODY_WIDTH = '650';
var DEFAULT_EDM_BODY_BACKGROUND = '#ffffff';
var DEFAULT_EDM_BODY_PADDING_TOP = '10';
var DEFAULT_EDM_BODY_PADDING_BOTTOM = '10';
var DEFAULT_EDM_BODY_PADDING_LEFT = '10';
var DEFAULT_EDM_BODY_PADDING_RIGHT = '10';
var DEFAULT_TEXT_COLOR = '#333333';
var DEFAULT_LINK_COLOR = '#337ab7';
var DEFAULT_FONT_FAMILY = 'Arial, Helvetica, san-serif';
var DEFAULT_FONT_SIZE = '14px';
var DEFAULT_LINE_HEIGHT = '1.42857143';

function initEdmEditorPage(fileName, snippets) {
    flog('initEdmEditorPage', fileName);
    var body = $(document.body);

    processFileBody();
    initKEditor(body, snippets);
    initSettingPanel();
    initBtns(body, fileName);
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
            e.returnValue = '\n\nAre you sure you would like to leave the editor? You will lose any unsaved changes\n\n';
        }
    };

    hideLoadingIcon();
}

function applyInlineCssForTextWrapper(target) {
    target.find('.text-wrapper').each(function () {
        $(this).css({
            'font-family': $('#edm-font-family').val(),
            'font-size': $('#edm-font-size').val(),
            'line-height': $('#edm-line-height').val(),
            'color': $('#edm-text-color').val()
        });
    });
}

function applyInlineCssForLink(target) {
    target.find('td.text-wrapper a').each(function () {
        $(this).css({
            'text-decoration': 'none',
            'color': $('#edm-link-color').val()
        });
    });
}

function processFileBody() {
    var edmHeader = $('#edm-header');
    var edmBody = $('#edm-body');
    var edmFooter = $('#edm-footer');
    var edmHtml = $('<div />').html($('#edm-html').html());

    // Handle styles
    var edmStyle = $('#edm-style');
    var defaultStyle = edmStyle.html();
    var savedStyle = edmHtml.find('style').html();
    if (savedStyle && savedStyle.length > 0 && savedStyle !== defaultStyle) {
        edmStyle.html(savedStyle);
    }

    // Fulfill header, body and footer data
    edmHeader.html(edmHtml.find('td#edm-header-td').html());
    edmBody.html(edmHtml.find('td#edm-body-td').html());
    edmFooter.html(edmHtml.find('td#edm-footer-td').html());

    $('#edm-body-width').val(edmHtml.find('#edm-container').attr('width') || DEFAULT_EDM_BODY_WIDTH);

    var tdWrapper = edmHtml.find('td#edm-wrapper-td');
    $('#edm-background').val(tdWrapper.css('background-color') || DEFAULT_EDM_BACKGROUND);
    var paddingTop = tdWrapper.css('padding-top');
    $('#edm-padding-top').val(paddingTop ? paddingTop.replace('px', '') : DEFAULT_EDM_PADDING_TOP);
    var paddingBottom = tdWrapper.css('padding-bottom');
    $('#edm-padding-bottom').val(paddingBottom ? paddingBottom.replace('px', '') : DEFAULT_EDM_PADDING_BOTTOM);
    var paddingLeft = tdWrapper.css('padding-left');
    $('#edm-padding-left').val(paddingLeft ? paddingLeft.replace('px', '') : DEFAULT_EDM_PADDING_LEFT);
    var paddingRight = tdWrapper.css('padding-right');
    $('#edm-padding-right').val(paddingRight ? paddingRight.replace('px', '') : DEFAULT_EDM_PADDING_RIGHT);

    var tdBody = edmHtml.find('td#edm-body-td');
    $('#edm-body-background').val(tdBody.css('background-color') || DEFAULT_EDM_BODY_BACKGROUND);
    var paddingBodyTop = tdBody.css('padding-top');
    $('#edm-body-padding-top').val(paddingBodyTop ? paddingBodyTop.replace('px', '') : DEFAULT_EDM_BODY_PADDING_TOP);
    var paddingBodyBottom = tdBody.css('padding-bottom');
    $('#edm-body-padding-bottom').val(paddingBodyBottom ? paddingBodyBottom.replace('px', '') : DEFAULT_EDM_BODY_PADDING_BOTTOM);
    var paddingBodyLeft = tdBody.css('padding-left');
    $('#edm-body-padding-left').val(paddingBodyLeft ? paddingBodyLeft.replace('px', '') : DEFAULT_EDM_BODY_PADDING_LEFT);
    var paddingBodyRight = tdBody.css('padding-right');
    $('#edm-body-padding-right').val(paddingBodyRight ? paddingBodyRight.replace('px', '') : DEFAULT_EDM_BODY_PADDING_RIGHT);

    var tableContainer = edmHtml.find('table#edm-container');
    $('#edm-font-family').val(tableContainer.attr('data-font-family') || DEFAULT_FONT_FAMILY);
    $('#edm-font-size').val(tableContainer.attr('data-font-size') || DEFAULT_FONT_SIZE);
    $('#edm-line-height').val(tableContainer.attr('data-line-height') || DEFAULT_LINE_HEIGHT);
    $('#edm-text-color').val(tableContainer.attr('data-text-color') || DEFAULT_TEXT_COLOR);
    $('#edm-link-color').val(tableContainer.attr('data-link-color') || DEFAULT_LINK_COLOR);
}

function initKEditor(body, snippets) {
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
        snippetsUrl: snippets,
        onInitContentArea: function (contentArea) {
            contentArea[contentArea.find('.keditor-container-content').children().length === 0 ? 'addClass' : 'removeClass']('empty');

            return contentArea.find('> table');
        },
        onSidebarToggled: function (isOpened) {
            var settingPanel = $('#edm-setting');
            if (isOpened) {
                if ($('.btn-setting').parent().hasClass('active')) {
                    settingPanel.getNiceScroll().show();
                    setTimeout(function () {
                        settingPanel.getNiceScroll().resize();
                    }, 300);
                }
            } else {
                settingPanel.getNiceScroll().hide();
            }
        },
        onCKEditorReady: function (component, editor) {
            applyInlineCssForTextWrapper(component);
            applyInlineCssForLink(component);

            editor.on('change', function () {
                applyInlineCssForLink(component);
            });
        },
        onContentChanged: function () {
            if (!body.hasClass('content-changed')) {
                body.addClass('content-changed');
            }

            var contentArea = $(this);
            contentArea[contentArea.children().length === 0 ? 'addClass' : 'removeClass']('empty');
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
        'padding-top': edmPaddingTop + 'px',
        'padding-bottom': edmPaddingBottom + 'px',
        'padding-left': edmPaddingLeft + 'px',
        'padding-right': edmPaddingRight + 'px'
    });

    var edmHeader = $('#edm-header');
    var edmBody = $('#edm-body');
    var edmFooter = $('#edm-footer');

    var edmBodyBackground = $('#edm-body-background').val();
    var edmBodyPaddingTop = $('#edm-body-padding-top').val();
    var edmBodyPaddingBottom = $('#edm-body-padding-bottom').val();
    var edmBodyPaddingLeft = $('#edm-body-padding-left').val();
    var edmBodyPaddingRight = $('#edm-body-padding-right').val();
    edmBody.css({
        'background-color': edmBodyBackground,
        'padding-top': edmBodyPaddingTop + 'px',
        'padding-bottom': edmBodyPaddingBottom + 'px',
        'padding-left': edmBodyPaddingLeft + 'px',
        'padding-right': edmBodyPaddingRight + 'px'
    });

    applyInlineCssForTextWrapper(edmHeader);
    applyInlineCssForTextWrapper(edmBody);
    applyInlineCssForTextWrapper(edmFooter);

    var edmBodyWidth = $('#edm-body-width').val();
    edmHeader.innerWidth(edmBodyWidth);
    edmBody.innerWidth(edmBodyWidth);
    edmFooter.innerWidth(edmBodyWidth);
}

function getEdmBody() {
    var edmHeader = $('#edm-header').keditor('getContent', false);
    var edmBody = $('#edm-body').keditor('getContent', false);
    var edmFooter = $('#edm-footer').keditor('getContent', false);

    // EDM Page
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
        styleTDWrapper += 'padding-top: ' + edmPaddingTop + 'px;';
    }
    if (edmPaddingBottom) {
        styleTDWrapper += 'padding-bottom: ' + edmPaddingBottom + 'px;';
    }
    if (edmPaddingLeft) {
        styleTDWrapper += 'padding-left: ' + edmPaddingLeft + 'px;';
    }
    if (edmPaddingRight) {
        styleTDWrapper += 'padding-right: ' + edmPaddingRight + 'px;';
    }

    // EDM Body
    var edmBodyWidth = $('#edm-body-width').val();
    var edmBodyBackground = $('#edm-body-background').val();
    var edmBodyPaddingTop = $('#edm-body-padding-top').val();
    var edmBodyPaddingBottom = $('#edm-body-padding-bottom').val();
    var edmBodyPaddingLeft = $('#edm-body-padding-left').val();
    var edmBodyPaddingRight = $('#edm-body-padding-right').val();
    var styleTDBody = '';
    var attributeTableBody = '';
    if (edmBodyBackground) {
        styleTDBody += 'background-color: ' + edmBodyBackground + ';';
        attributeTableBody += ' bgcolor="' + edmBodyBackground + '" ';
    }
    if (edmBodyPaddingTop) {
        styleTDBody += 'padding-top: ' + edmBodyPaddingTop + 'px;';
    }
    if (edmBodyPaddingBottom) {
        styleTDBody += 'padding-bottom: ' + edmBodyPaddingBottom + 'px;';
    }
    if (edmBodyPaddingLeft) {
        styleTDBody += 'padding-left: ' + edmBodyPaddingLeft + 'px;';
    }
    if (edmBodyPaddingRight) {
        styleTDBody += 'padding-right: ' + edmBodyPaddingRight + 'px;';
    }

    // EDM Default styles
    var edmFontFamily = $('#edm-font-family').val();
    var edmFontSize = $('#edm-font-size').val();
    var edmLineHeight = $('#edm-line-height').val();
    var edmTextColor = $('#edm-text-color').val();
    var edmLinkColor = $('#edm-link-color').val();
    var dataEdmStyles = '';
    if (edmFontFamily) {
        dataEdmStyles += ' data-font-family="' + edmFontFamily + '" ';
    }
    if (edmFontSize) {
        dataEdmStyles += ' data-font-size="' + edmFontSize + '" ';
    }
    if (edmLineHeight) {
        dataEdmStyles += ' data-line-height="' + edmLineHeight + '" ';
    }
    if (edmTextColor) {
        dataEdmStyles += ' data-text-color="' + edmTextColor + '" ';
    }
    if (edmLinkColor) {
        dataEdmStyles += ' data-link-color="' + edmLinkColor + '" ';
    }

    return (
            '<table cellpadding="0" cellspacing="0" border="0" width="100%" id="edm-wrapper" ' + attributeTableWrapper + '>\n' +
            '    <tbody>\n' +
            '        <tr>\n' +
            '            <td id="edm-wrapper-td" style="' + styleTDWrapper + '" align="center">\n' +
            '                <table cellpadding="0" cellspacing="0" border="0" width="' + edmBodyWidth + '" id="edm-container" ' + dataEdmStyles + '>\n' +
            '                    <tbody>\n' +
            '                        <tr>\n' +
            '                            <td>\n' +
            '                                <table cellpadding="0" cellspacing="0" border="0" width="100%" id="edm-header" align="center">\n' +
            '                                    <tbody>\n' +
            '                                        <tr>\n' +
            '                                            <td id="edm-header-td">\n' +
            edmHeader +
            '                                            </td>\n' +
            '                                        </tr>\n' +
            '                                    </tbody>\n' +
            '                                </table>\n' +
            '                                <table cellpadding="0" cellspacing="0" border="0" width="100%" id="edm-body" ' + attributeTableBody + ' align="center">\n' +
            '                                    <tbody>\n' +
            '                                        <tr>\n' +
            '                                            <td id="edm-body-td" style="' + styleTDBody + '" >\n' +
            edmBody +
            '                                            </td>\n' +
            '                                        </tr>\n' +
            '                                    </tbody>\n' +
            '                                </table>\n' +
            '                                <table cellpadding="0" cellspacing="0" border="0" width="100%" id="edm-footer" align="center">\n' +
            '                                    <tbody>\n' +
            '                                        <tr>\n' +
            '                                            <td id="edm-footer-td">\n' +
            edmFooter +
            '                                            </td>\n' +
            '                                        </tr>\n' +
            '                                    </tbody>\n' +
            '                                </table>\n' +
            '                            </td>\n' +
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
    $('.btn-setting').on('click', function (e) {
        e.preventDefault();

        var btn = $(this);
        var li = btn.parent();

        if (li.hasClass('active')) {
            settingPanel.getNiceScroll().hide();
            settingPanel.removeClass('showed');
            li.removeClass('active');
        } else {
            settingPanel.getNiceScroll().show();
            setTimeout(function () {
                settingPanel.getNiceScroll().resize();
            }, 300);
            settingPanel.addClass('showed');
            li.addClass('active');
        }
    });
}

function hideLoadingIcon() {
    $('#editor-loading').addClass('hide');
}

function showLoadingIcon() {
    $('#editor-loading').removeClass('hide');
}
