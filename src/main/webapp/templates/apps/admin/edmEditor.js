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

function initEdmEditorPage(fileName) {
    flog('initEdmEditorPage', fileName);
    var body = $(document.body);

    initEdmEditor();
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

    hideLoadingIcon();
}

function initEdmEditor(iframeMode) {
    flog('initEdmEditor');

    var body = $(document.body);
    createSettingPanel(body);
    var edmHtml = processFileBody();
    var keditor = initKEditor(body, iframeMode).data('keditor');
    if (iframeMode) {
        keditor.body.append($('#edm-setting'));
    }
    initSettingPanel(edmHtml, iframeMode ? keditor.body : body);

    window.onbeforeunload = function (e) {
        if (body.hasClass('content-changed')) {
            e.returnValue = '\n\nAre you sure you would like to leave the editor? You will lose any unsaved changes\n\n';
        }
    };
}

function createSettingPanel(body) {
    flog('createSettingPanel');

    body.append(
        '<div id="edm-setting" class="form-horizontal">' +
        '    <div class="panel panel-default">' +
        '        <div class="panel-heading">EDM Page</div>' +
        '        <div class="panel-body">' +
        '            <div class="form-group form-group-sm">' +
        '                <div class="col-md-12">' +
        '                    <label for="edm-background">Background</label>' +
        '                    <div class="input-group color-picker">' +
        '                        <span class="input-group-addon"><i></i></span>' +
        '                        <input type="text" value="" id="edm-background" class="form-control" />' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '            <div class="form-group form-group-sm">' +
        '                <div class="col-md-12">' +
        '                    <label>Padding (in px)</label>' +
        '                    <div class="row row-sm text-center">' +
        '                        <div class="col-xs-4 col-xs-offset-4">' +
        '                            <input type="number" value="" id="edm-padding-top" class="form-control" />' +
        '                            <small>top</small>' +
        '                        </div>' +
        '                    </div>' +
        '                    <div class="row row-sm text-center">' +
        '                        <div class="col-xs-4">' +
        '                            <input type="number" value="" id="edm-padding-left" class="form-control" />' +
        '                            <small>left</small>' +
        '                        </div>' +
        '                        <div class="col-xs-4 col-xs-offset-4">' +
        '                            <input type="number" value="" id="edm-padding-right" class="form-control" />' +
        '                            <small>right</small>' +
        '                        </div>' +
        '                    </div>' +
        '                    <div class="row row-sm text-center">' +
        '                        <div class="col-xs-4 col-xs-offset-4">' +
        '                            <input type="number" value="" id="edm-padding-bottom" class="form-control" />' +
        '                            <small>bottom</small>' +
        '                        </div>' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '    <div class="panel panel-default">' +
        '        <div class="panel-heading">EDM Body</div>' +
        '        <div class="panel-body">' +
        '            <div class="form-group form-group-sm">' +
        '                <div class="col-md-12">' +
        '                    <label for="edm-body-background">Width (in px)</label>' +
        '                    <input type="number" value="" id="edm-body-width" class="form-control" />' +
        '                </div>' +
        '            </div>' +
        '            <div class="form-group form-group-sm">' +
        '                <div class="col-md-12">' +
        '                    <label for="edm-body-background">Background</label>' +
        '                    <div class="input-group color-picker">' +
        '                        <span class="input-group-addon"><i></i></span>' +
        '                        <input type="text" value="" id="edm-body-background" class="form-control" />' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '            <div class="form-group form-group-sm">' +
        '                <div class="col-md-12">' +
        '                    <label>Padding (in px)</label>' +
        '                    <div class="row row-sm text-center">' +
        '                        <div class="col-xs-4 col-xs-offset-4">' +
        '                            <input type="number" value="" id="edm-body-padding-top" class="form-control" />' +
        '                            <small>top</small>' +
        '                        </div>' +
        '                    </div>' +
        '                    <div class="row row-sm text-center">' +
        '                        <div class="col-xs-4">' +
        '                            <input type="number" value="" id="edm-body-padding-left" class="form-control" />' +
        '                            <small>left</small>' +
        '                        </div>' +
        '                        <div class="col-xs-4 col-xs-offset-4">' +
        '                            <input type="number" value="" id="edm-body-padding-right" class="form-control" />' +
        '                            <small>right</small>' +
        '                        </div>' +
        '                    </div>' +
        '                    <div class="row row-sm text-center">' +
        '                        <div class="col-xs-4 col-xs-offset-4">' +
        '                            <input type="number" value="" id="edm-body-padding-bottom" class="form-control" />' +
        '                            <small>bottom</small>' +
        '                        </div>' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '    <div class="panel panel-default">' +
        '        <div class="panel-heading">EDM Default Styles</div>' +
        '        <div class="panel-body">' +
        '            <div class="form-group form-group-sm">' +
        '                <div class="col-md-12">' +
        '                    <label for="edm-text-color">Text color</label>' +
        '                    <div class="input-group color-picker">' +
        '                        <span class="input-group-addon"><i></i></span>' +
        '                        <input type="text" value="" id="edm-text-color" class="form-control" />' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '            <div class="form-group form-group-sm">' +
        '                <div class="col-md-12">' +
        '                    <label for="edm-text-color">Link color</label>' +
        '                    <div class="input-group color-picker">' +
        '                        <span class="input-group-addon"><i></i></span>' +
        '                        <input type="text" value="" id="edm-link-color" class="form-control" />' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '            <div class="form-group form-group-sm">' +
        '                <div class="col-md-12">' +
        '                    <label for="edm-font-family">Font family</label>' +
        '                    <input type="text" value="" id="edm-font-family" class="form-control" />' +
        '                </div>' +
        '            </div>' +
        '            <div class="form-group form-group-sm">' +
        '                <div class="col-md-12">' +
        '                    <label for="edm-font-size">Font size</label>' +
        '                    <input type="text" value="" id="edm-font-size" class="form-control" />' +
        '                </div>' +
        '            </div>' +
        '            <div class="form-group form-group-sm">' +
        '                <div class="col-md-12">' +
        '                    <label for="edm-line-height">Line height</label>' +
        '                    <input type="text" value="" id="edm-line-height" class="form-control" />' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>'
    );
}

function applyInlineCssForTextWrapper(target) {
    target.find('.text-wrapper').each(function () {
        var textWrapper = $(this);
        setStyle(textWrapper, 'font-family', $('#edm-font-family').val());
        setStyle(textWrapper, 'font-size', $('#edm-font-size').val());
        setStyle(textWrapper, 'line-height', $('#edm-line-height').val());
        setStyle(textWrapper, 'color', $('#edm-text-color').val());
    });
}

function applyInlineCssForLink(target) {
    target.find('td.text-wrapper a').each(function () {
        var link = $(this);
        setStyle(link, 'text-decoration', 'none');
        setStyle(link, 'color', $('#edm-link-color').val());
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

    return edmHtml;
}

function initKEditor(body, iframeMode) {
    flog('initKEditor', iframeMode);

    return $('#edm-area').keditor({
        iframeMode: iframeMode,
        basePath: iframeMode ? window.location.pathname.substr(0, window.location.pathname.lastIndexOf('/') + 1) : '',
        contentAreasSelector: '#edm-header, #edm-body, #edm-footer',
        contentAreasWrapper: '<div id="edm-area"></div>',
        snippetsUrl: '/_components/edm/snippets.html',
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
        onComponentReady: function (component, editor) {
            if (editor) {
                applyInlineCssForTextWrapper(component);
                applyInlineCssForLink(component);

                editor.on('change', function () {
                    applyInlineCssForLink(component);
                });
            }
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

function initSettingPanel(edmHtml, body) {
    flog('initSettingPanel');

    var settingPanel = body.find('#edm-setting');
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
        zindex: 9999,
        disablemutationobserver: true
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
            applySetting(body);
        });
    });

    settingPanel.find('input').not('.colorpicker').on('change', function () {
        applySetting(body);
    });

    body.find('#edm-body-width').val(edmHtml.find('#edm-container').attr('width') || DEFAULT_EDM_BODY_WIDTH);

    var tdWrapper = edmHtml.find('td#edm-wrapper-td');
    body.find('#edm-background').val(tdWrapper.css('background-color') || DEFAULT_EDM_BACKGROUND);
    var paddingTop = tdWrapper.css('padding-top');
    body.find('#edm-padding-top').val(paddingTop ? paddingTop.replace('px', '') : DEFAULT_EDM_PADDING_TOP);
    var paddingBottom = tdWrapper.css('padding-bottom');
    body.find('#edm-padding-bottom').val(paddingBottom ? paddingBottom.replace('px', '') : DEFAULT_EDM_PADDING_BOTTOM);
    var paddingLeft = tdWrapper.css('padding-left');
    body.find('#edm-padding-left').val(paddingLeft ? paddingLeft.replace('px', '') : DEFAULT_EDM_PADDING_LEFT);
    var paddingRight = tdWrapper.css('padding-right');
    body.find('#edm-padding-right').val(paddingRight ? paddingRight.replace('px', '') : DEFAULT_EDM_PADDING_RIGHT);

    var tdBody = edmHtml.find('td#edm-body-td');
    body.find('#edm-body-background').val(tdBody.css('background-color') || DEFAULT_EDM_BODY_BACKGROUND);
    var paddingBodyTop = tdBody.css('padding-top');
    body.find('#edm-body-padding-top').val(paddingBodyTop ? paddingBodyTop.replace('px', '') : DEFAULT_EDM_BODY_PADDING_TOP);
    var paddingBodyBottom = tdBody.css('padding-bottom');
    body.find('#edm-body-padding-bottom').val(paddingBodyBottom ? paddingBodyBottom.replace('px', '') : DEFAULT_EDM_BODY_PADDING_BOTTOM);
    var paddingBodyLeft = tdBody.css('padding-left');
    body.find('#edm-body-padding-left').val(paddingBodyLeft ? paddingBodyLeft.replace('px', '') : DEFAULT_EDM_BODY_PADDING_LEFT);
    var paddingBodyRight = tdBody.css('padding-right');
    body.find('#edm-body-padding-right').val(paddingBodyRight ? paddingBodyRight.replace('px', '') : DEFAULT_EDM_BODY_PADDING_RIGHT);

    var tableContainer = edmHtml.find('table#edm-container');
    body.find('#edm-font-family').val(tableContainer.attr('data-font-family') || DEFAULT_FONT_FAMILY);
    body.find('#edm-font-size').val(tableContainer.attr('data-font-size') || DEFAULT_FONT_SIZE);
    body.find('#edm-line-height').val(tableContainer.attr('data-line-height') || DEFAULT_LINE_HEIGHT);
    body.find('#edm-text-color').val(tableContainer.attr('data-text-color') || DEFAULT_TEXT_COLOR);
    body.find('#edm-link-color').val(tableContainer.attr('data-link-color') || DEFAULT_LINK_COLOR);

    applySetting(body);
}

function applySetting(body) {
    var edmBackground = body.find('#edm-background').val();
    var edmPaddingTop = body.find('#edm-padding-top').val();
    var edmPaddingBottom = body.find('#edm-padding-bottom').val();
    var edmPaddingLeft = body.find('#edm-padding-left').val();
    var edmPaddingRight = body.find('#edm-padding-right').val();
    setStyle(body, 'background-color', edmBackground);
    var edmArea = body.find('#edm-area');
    setStyle(edmArea, 'padding-top', edmPaddingTop + 'px');
    setStyle(edmArea, 'padding-bottom', edmPaddingBottom + 'px');
    setStyle(edmArea, 'padding-left', edmPaddingLeft + 'px');
    setStyle(edmArea, 'padding-right', edmPaddingRight + 'px');

    var edmHeader = body.find('#edm-header');
    var edmBody = body.find('#edm-body');
    var edmFooter = body.find('#edm-footer');

    var edmBodyBackground = body.find('#edm-body-background').val();
    var edmBodyPaddingTop = body.find('#edm-body-padding-top').val();
    var edmBodyPaddingBottom = body.find('#edm-body-padding-bottom').val();
    var edmBodyPaddingLeft = body.find('#edm-body-padding-left').val();
    var edmBodyPaddingRight = body.find('#edm-body-padding-right').val();
    setStyle(edmBody, 'background-color', edmBodyBackground);
    setStyle(edmBody, 'padding-top', edmBodyPaddingTop + 'px');
    setStyle(edmBody, 'padding-bottom', edmBodyPaddingBottom + 'px');
    setStyle(edmBody, 'padding-left', edmBodyPaddingLeft + 'px');
    setStyle(edmBody, 'padding-right', edmBodyPaddingRight + 'px');

    applyInlineCssForTextWrapper(edmHeader);
    applyInlineCssForTextWrapper(edmBody);
    applyInlineCssForTextWrapper(edmFooter);

    var edmBodyWidth = body.find('#edm-body-width').val();
    edmHeader.innerWidth(edmBodyWidth);
    edmBody.innerWidth(edmBodyWidth);
    edmFooter.innerWidth(edmBodyWidth);
}

function initColorPicker(target, onChangeHandle) {
    target.each(function () {
        var colorPicker = $(this);
        var input = colorPicker.find('input');
        var previewer = colorPicker.find('.input-group-addon i');

        colorPicker.colorpicker({
            format: 'hex',
            container: colorPicker.parent(),
            component: '.input-group-addon',
            align: 'left',
            colorSelectors: {
                'transparent': 'transparent'
            }
        }).on('changeColor.colorpicker', function (e) {
            var colorHex = e.color.toHex();

            if (!input.val() || input.val().trim().length === 0) {
                colorHex = '';
                previewer.css('background-color', '');
            }

            if (typeof onChangeHandle === 'function') {
                onChangeHandle(colorHex);
            }
        });

    });
}

function setStyle(target, name, value) {
    target.each(function () {
        var self = $(this);
        var styles = self.attr('style');
        styles = styles ? styles.split(';') : [];
        var isExisting = false;

        for (var i = 0; i < styles.length; i++) {
            var style = styles[i];
            if (style && style.trim().length > 0 && style.indexOf(':') !== -1) {
                style = style.split(':');

                if (style[0].trim() === name) {
                    if (value) {
                        styles[i] = name + ':' + value;
                    } else {
                        styles.splice(i, 1);
                    }

                    isExisting = true;
                }
            }
        }

        if (!isExisting) {
            styles.push(name + ':' + value);
        }

        self.attr('style', styles.join(';'));
    });
}

function getEdmBody(body) {
    var edmHtml = $('#edm-area').keditor('getContent', true);
    var edmHeader = edmHtml[0];
    var edmBody = edmHtml[1];
    var edmFooter = edmHtml[2];

    // EDM Page
    var edmBackground = body.find('#edm-background').val();
    var edmPaddingTop = body.find('#edm-padding-top').val();
    var edmPaddingBottom = body.find('#edm-padding-bottom').val();
    var edmPaddingLeft = body.find('#edm-padding-left').val();
    var edmPaddingRight = body.find('#edm-padding-right').val();
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
    var edmBodyWidth = body.find('#edm-body-width').val();
    var edmBodyBackground = body.find('#edm-body-background').val();
    var edmBodyPaddingTop = body.find('#edm-body-padding-top').val();
    var edmBodyPaddingBottom = body.find('#edm-body-padding-bottom').val();
    var edmBodyPaddingLeft = body.find('#edm-body-padding-left').val();
    var edmBodyPaddingRight = body.find('#edm-body-padding-right').val();
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
    var edmFontFamily = body.find('#edm-font-family').val();
    var edmFontSize = body.find('#edm-font-size').val();
    var edmLineHeight = body.find('#edm-line-height').val();
    var edmTextColor = body.find('#edm-text-color').val();
    var edmLinkColor = body.find('#edm-link-color').val();
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
    var keditor = $('#edm-area').data('keditor');
    var body = $(document.body);
    if (keditor.options.iframeMode) {
        body = keditor.body;
    }
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
        '    </body>\n' +
        '</html>';
    var edmContentData = {
        styleContent: $('#edm-style').html().trim(),
        bodyContent: getEdmBody(body)
    };

    for (var key in edmContentData) {
        var regex = new RegExp('{{' + key + '}}', 'gi');
        edmContent = edmContent.replace(regex, edmContentData[key]);
    }

    return edmContent;
}

function initBtns(body, fileName) {
    flog('initSaving', fileName);

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

$.keditor.initPaddingControls = function (keditor, form, addMethod, neighbor) {
    var controlsHtml =
        '<div class="form-group">' +
        '   <div class="col-md-12">' +
        '       <label>Padding (in px)</label>' +
        '       <div class="row row-sm text-center">' +
        '           <div class="col-xs-4 col-xs-offset-4">' +
        '               <input type="number" value="" class="txt-padding-top form-control" />' +
        '               <small>top</small>' +
        '           </div>' +
        '       </div>' +
        '       <div class="row row-sm text-center">' +
        '           <div class="col-xs-4">' +
        '               <input type="number" value="" class="txt-padding-left form-control" />' +
        '               <small>left</small>' +
        '           </div>' +
        '           <div class="col-xs-4 col-xs-offset-4">' +
        '               <input type="number" value="" class="txt-padding-right form-control" />' +
        '               <small>right</small>' +
        '           </div>' +
        '       </div>' +
        '       <div class="row row-sm text-center">' +
        '           <div class="col-xs-4 col-xs-offset-4">' +
        '               <input type="number" value="" class="txt-padding-bottom form-control" />' +
        '               <small>bottom</small>' +
        '           </div>' +
        '       </div>' +
        '   </div>' +
        '</div>';

    if (neighbor) {
        form.find(neighbor)[addMethod](controlsHtml);
    } else {
        form[addMethod](controlsHtml);
    }

    var txtPaddingTop = form.find('.txt-padding-top');
    var txtPaddingBottom = form.find('.txt-padding-bottom');
    var txtPaddingLeft = form.find('.txt-padding-left');
    var txtPaddingRight = form.find('.txt-padding-right');
    txtPaddingTop.on('change', function () {
        setStyle(keditor.getSettingComponent().find('.wrapper'), 'padding-top', (this.value > 0 ? this.value : 0) + 'px');
    });
    txtPaddingBottom.on('change', function () {
        setStyle(keditor.getSettingComponent().find('.wrapper'), 'padding-bottom', (this.value > 0 ? this.value : 0) + 'px');
    });
    txtPaddingLeft.on('change', function () {
        setStyle(keditor.getSettingComponent().find('.wrapper'), 'padding-left', (this.value > 0 ? this.value : 0) + 'px');
    });
    txtPaddingRight.on('change', function () {
        setStyle(keditor.getSettingComponent().find('.wrapper'), 'padding-right', (this.value > 0 ? this.value : 0) + 'px');
    });
};

$.keditor.showPaddingControls = function (keditor, form, component) {
    var wrapper = component.find('.wrapper');

    var txtPaddingTop = form.find('.txt-padding-top');
    var paddingTop = wrapper.css('padding-top');
    txtPaddingTop.val(paddingTop ? paddingTop.replace('px', '') : '0');

    var txtPaddingBottom = form.find('.txt-padding-bottom');
    var paddingBottom = wrapper.css('padding-bottom');
    txtPaddingBottom.val(paddingBottom ? paddingBottom.replace('px', '') : '0');

    var txtPaddingLeft = form.find('.txt-padding-left');
    var paddingLeft = wrapper.css('padding-left');
    txtPaddingLeft.val(paddingLeft ? paddingLeft.replace('px', '') : '0');

    var txtPaddingRight = form.find('.txt-padding-right');
    var paddingRight = wrapper.css('padding-right');
    txtPaddingRight.val(paddingRight ? paddingRight.replace('px', '') : '0');
};

$.keditor.initBgColorControl = function (keditor, form, addMethod, neighbor) {
    var controlHtml =
        '<div class="form-group">' +
        '   <div class="col-md-12">' +
        '       <label>Background</label>' +
        '       <div class="input-group color-picker">' +
        '           <span class="input-group-addon"><i></i></span>' +
        '           <input type="text" value="" class="txt-bg-color form-control" />' +
        '       </div>' +
        '   </div>' +
        '</div>';

    if (neighbor) {
        form.find(neighbor)[addMethod](controlHtml);
    } else {
        form[addMethod](controlHtml);
    }

    var colorPicker = form.find('.color-picker');
    initColorPicker(colorPicker, function (color) {
        var wrapper = keditor.getSettingComponent().find('.wrapper');
        var table = wrapper.closest('table');

        if (color && color !== 'transparent') {
            setStyle(wrapper, 'background-color', color);
            table.attr('bgcolor', color);
        } else {
            setStyle(wrapper, 'background-color', '');
            table.removeAttr('bgcolor');
            form.find('.txt-bg-color').val('');
        }
    });
};

$.keditor.showBgColorControl = function (keditor, form, component) {
    var wrapper = component.find('.wrapper');
    var colorPicker = form.find('.color-picker');
    colorPicker.colorpicker('setValue', wrapper.css('background-color') || '');
};
