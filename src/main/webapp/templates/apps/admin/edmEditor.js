var win = $(window);
var DEFAULT_EDM_BACKGROUND = '#fafafa';
var DEFAULT_EDM_PADDING_TOP = '20';
var DEFAULT_EDM_PADDING_BOTTOM = '20';
var DEFAULT_EDM_PADDING_LEFT = '20';
var DEFAULT_EDM_PADDING_RIGHT = '20';
var DEFAULT_EDM_BODY_WIDTH = '600';
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
var keditor;
var body;

function initEdmEditorPage(fileName) {
    flog('initEdmEditorPage', fileName);

    body = $(document.body);
    Msg.iconMode = 'fa';
    keditor = initKEditor(fileName, processFileBody()).data('keditor');
    initSaveFile(fileName);
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

    // Getting styles
    var edmWidth = edmHtml.find('#edm-container').attr('width') || DEFAULT_EDM_BODY_WIDTH;

    var tdWrapper = edmHtml.find('td#edm-wrapper-td');
    var edmBg = tdWrapper.css('background-color') || DEFAULT_EDM_BACKGROUND;
    var paddingTop = tdWrapper.css('padding-top') || '';
    paddingTop = paddingTop.replace('px', '') || DEFAULT_EDM_PADDING_TOP;
    var paddingBottom = tdWrapper.css('padding-bottom') || '';
    paddingBottom = paddingBottom.replace('px', '') || DEFAULT_EDM_PADDING_BOTTOM;
    var paddingLeft = tdWrapper.css('padding-left') || '';
    paddingLeft = paddingLeft.replace('px', '') || DEFAULT_EDM_PADDING_LEFT;
    var paddingRight = tdWrapper.css('padding-right') || '';
    paddingRight = paddingRight.replace('px', '') || DEFAULT_EDM_PADDING_RIGHT;

    var tdBody = edmHtml.find('td#edm-body-td');
    var bodyBg = tdBody.css('background-color') || DEFAULT_EDM_BODY_BACKGROUND;
    var paddingBodyTop = tdBody.css('padding-top') || '';
    paddingBodyTop = paddingBodyTop.replace('px', '') || DEFAULT_EDM_BODY_PADDING_TOP;
    var paddingBodyBottom = tdBody.css('padding-bottom') || '';
    paddingBodyBottom = paddingBodyBottom.replace('px', '') || DEFAULT_EDM_BODY_PADDING_BOTTOM;
    var paddingBodyLeft = tdBody.css('padding-left') || '';
    paddingBodyLeft = paddingBodyLeft.replace('px', '') || DEFAULT_EDM_BODY_PADDING_LEFT;
    var paddingBodyRight = tdBody.css('padding-right') || '';
    paddingBodyRight = paddingBodyRight.replace('px', '') || DEFAULT_EDM_BODY_PADDING_RIGHT;

    var tableContainer = edmHtml.find('table#edm-container');
    var fontFamily = tableContainer.attr('data-font-family') || DEFAULT_FONT_FAMILY;
    var fontSize = tableContainer.attr('data-font-size') || DEFAULT_FONT_SIZE;
    var lineHeight = tableContainer.attr('data-line-height') || DEFAULT_LINE_HEIGHT;
    var textColor = tableContainer.attr('data-text-color') || DEFAULT_TEXT_COLOR;
    var linkColor = tableContainer.attr('data-link-color') || DEFAULT_LINK_COLOR;

    return {
        edmWidth: edmWidth,
        edmBg: edmBg,
        paddingTop: paddingTop,
        paddingBottom: paddingBottom,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        bodyBg: bodyBg,
        paddingBodyTop: paddingBodyTop,
        paddingBodyBottom: paddingBodyBottom,
        paddingBodyLeft: paddingBodyLeft,
        paddingBodyRight: paddingBodyRight,
        fontFamily: fontFamily,
        fontSize: fontSize,
        lineHeight: lineHeight,
        textColor: textColor,
        linkColor: linkColor
    };
}

function initKEditor(fileName, stylesData) {
    flog('initKEditor', fileName, stylesData);

    return $('#edm-area').keditor({
        basePath: '',
        tabContainersText: '<i class="fa fa-columns"></i>',
        tabComponentsText: '<i class="fa fa-files-o"></i>',
        tabTooltipEnabled: false,
        snippetsTooltipEnabled: false,
        contentAreasSelector: '#edm-header, #edm-body, #edm-footer',
        contentAreasWrapper: '<div id="edm-area"></div>',
        snippetsUrl: '_components?fileName=' + fileName,
        extraTabs: {
            setting: {
                text: '<i class="fa fa-cog"></i>',
                title: 'Settings',
                content: '<div id="edm-setting" class="form-horizontal">' +
                '    <div class="panel panel-default">' +
                '        <div class="panel-heading">EDM Page</div>' +
                '        <div class="panel-body">' +
                '            <div class="form-group form-group-sm">' +
                '                <div class="col-md-12">' +
                '                    <label for="edm-background">Background</label>' +
                '                    <div class="input-group color-picker">' +
                '                        <span class="input-group-addon"><i></i></span>' +
                '                        <input type="text" value="' + stylesData.edmBg + '" id="edm-background" class="form-control" />' +
                '                    </div>' +
                '                </div>' +
                '            </div>' +
                '            <div class="form-group form-group-sm">' +
                '                <div class="col-md-12">' +
                '                    <label>Padding (in px)</label>' +
                '                    <div class="row row-sm text-center">' +
                '                        <div class="col-xs-4 col-xs-offset-4">' +
                '                            <input type="number" value="' + stylesData.paddingTop + '" id="edm-padding-top" class="form-control" />' +
                '                            <small>top</small>' +
                '                        </div>' +
                '                    </div>' +
                '                    <div class="row row-sm text-center">' +
                '                        <div class="col-xs-4">' +
                '                            <input type="number" value="' + stylesData.paddingLeft + '" id="edm-padding-left" class="form-control" />' +
                '                            <small>left</small>' +
                '                        </div>' +
                '                        <div class="col-xs-4 col-xs-offset-4">' +
                '                            <input type="number" value="' + stylesData.paddingRight + '" id="edm-padding-right" class="form-control" />' +
                '                            <small>right</small>' +
                '                        </div>' +
                '                    </div>' +
                '                    <div class="row row-sm text-center">' +
                '                        <div class="col-xs-4 col-xs-offset-4">' +
                '                            <input type="number" value="' + stylesData.paddingBottom + '" id="edm-padding-bottom" class="form-control" />' +
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
                '                    <input type="number" value="' + stylesData.edmWidth + '" id="edm-body-width" class="form-control" />' +
                '                </div>' +
                '            </div>' +
                '            <div class="form-group form-group-sm">' +
                '                <div class="col-md-12">' +
                '                    <label for="edm-body-background">Background</label>' +
                '                    <div class="input-group color-picker">' +
                '                        <span class="input-group-addon"><i></i></span>' +
                '                        <input type="text" value="' + stylesData.bodyBg + '" id="edm-body-background" class="form-control" />' +
                '                    </div>' +
                '                </div>' +
                '            </div>' +
                '            <div class="form-group form-group-sm">' +
                '                <div class="col-md-12">' +
                '                    <label>Padding (in px)</label>' +
                '                    <div class="row row-sm text-center">' +
                '                        <div class="col-xs-4 col-xs-offset-4">' +
                '                            <input type="number" value="' + stylesData.paddingBodyTop + '" id="edm-body-padding-top" class="form-control" />' +
                '                            <small>top</small>' +
                '                        </div>' +
                '                    </div>' +
                '                    <div class="row row-sm text-center">' +
                '                        <div class="col-xs-4">' +
                '                            <input type="number" value="' + stylesData.paddingBodyLeft + '" id="edm-body-padding-left" class="form-control" />' +
                '                            <small>left</small>' +
                '                        </div>' +
                '                        <div class="col-xs-4 col-xs-offset-4">' +
                '                            <input type="number" value="' + stylesData.paddingBodyRight + '" id="edm-body-padding-right" class="form-control" />' +
                '                            <small>right</small>' +
                '                        </div>' +
                '                    </div>' +
                '                    <div class="row row-sm text-center">' +
                '                        <div class="col-xs-4 col-xs-offset-4">' +
                '                            <input type="number" value="' + stylesData.paddingBodyBottom + '" id="edm-body-padding-bottom" class="form-control" />' +
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
                '                        <input type="text" value="' + stylesData.textColor + '" id="edm-text-color" class="form-control" />' +
                '                    </div>' +
                '                </div>' +
                '            </div>' +
                '            <div class="form-group form-group-sm">' +
                '                <div class="col-md-12">' +
                '                    <label for="edm-text-color">Link color</label>' +
                '                    <div class="input-group color-picker">' +
                '                        <span class="input-group-addon"><i></i></span>' +
                '                        <input type="text" value="' + stylesData.linkColor + '" id="edm-link-color" class="form-control" />' +
                '                    </div>' +
                '                </div>' +
                '            </div>' +
                '            <div class="form-group form-group-sm">' +
                '                <div class="col-md-12">' +
                '                    <label for="edm-font-family">Font family</label>' +
                '                    <input type="text" value="' + stylesData.fontFamily + '" id="edm-font-family" class="form-control" />' +
                '                </div>' +
                '            </div>' +
                '            <div class="form-group form-group-sm">' +
                '                <div class="col-md-12">' +
                '                    <label for="edm-font-size">Font size</label>' +
                '                    <input type="text" value="' + stylesData.fontSize + '" id="edm-font-size" class="form-control" />' +
                '                </div>' +
                '            </div>' +
                '            <div class="form-group form-group-sm">' +
                '                <div class="col-md-12">' +
                '                    <label for="edm-line-height">Line height</label>' +
                '                    <input type="text" value="' + stylesData.lineHeight + '" id="edm-line-height" class="form-control" />' +
                '                </div>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '</div>'
            }
        },
        onBeforeDynamicContentLoad: function (dynamicElement, component) {
            var containerInner = dynamicElement.closest('[data-type=container-content]');
            var width = containerInner.width();

            component.attr({
                'data-width': width
            });
        },
        onInitContentArea: function (contentArea) {
            contentArea[contentArea.children().length === 0 ? 'addClass' : 'removeClass']('empty');

            return contentArea.find('> table');
        },
        onComponentReady: function (component, editor) {
            if (editor) {
                applyInlineCssForTextWrapper(component);
                applyInlineCssForLink(component);

                editor.on('change', function () {
                    applyInlineCssForLink(component);
                });
            }

            if (!component.hasClass('existing-component')) {
                var img = component.find('img');

                if (img.length > 0) {
                    $.keditor.components['photo'].adjustWidthForImg(img, img.hasClass('full-width'));
                }
            }
        },
        onContentChanged: function () {
            if (!body.hasClass('content-changed')) {
                body.addClass('content-changed');
            }

            var contentArea = $(this);
            contentArea[contentArea.children().length === 0 ? 'addClass' : 'removeClass']('empty');
        },
        onContainerChanged: function (e, changedContainer) {
            changedContainer.find('[data-dynamic-href]').each(function () {
                keditor.initDynamicContent($(this));
            });
        },
        onReady: function () {
            initSettingPanel();

            adjustColWidth($('.keditor-container'));

            $('#edm-area [data-type="component-photo"]').find('img').each(function () {
                var img = $(this);
                $.keditor.components['photo'].adjustWidthForImg(img, img.hasClass('full-width'));
            });

            hideLoadingIcon();
        },
        onContainerSnippetDropped: function (event, newContainer, droppedContainer) {
            adjustColWidth(newContainer);
        },

        containerSettingEnabled: true,
        containerSettingInitFunction: function (form, keditor) {
            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <label>Available for groups</label>' +
                '           <select class="form-control select-groups selectpicker" multiple="multiple" title=" - Select Groups - ">' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <hr />' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <label>Columns settings</label>' +
                '           <div class="columns-setting">' +
                '           </div>' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            var groupsOptions = '';
            for (var name in allGroups) {
                groupsOptions += '<option value="' + name + '">' + allGroups[name] + '</option>';
            }

            form.find('.select-groups').html(groupsOptions).selectpicker().on('changed.bs.select', function () {
                var container = keditor.getSettingContainer();
                var table = container.find('.keditor-container-inner > table');

                table.attr('data-groups', $(this).selectpicker('val').join(','));
            });

            form.find('.columns-setting').on('change', '.txt-padding', function () {
                var txt = $(this);
                var index = +txt.attr('data-index');
                var propName = txt.attr('data-prop');
                var container = keditor.getSettingContainer();
                var column = container.find('[data-type=container-content]').eq(index);
                var number = txt.val();
                if (isNaN(number) || +number < 0) {
                    number = 0;
                    this.value = number;
                }

                column.prop('style')[propName] = number + 'px';
            });
        },
        containerSettingShowFunction: function (form, container, keditor) {
            var table = container.find('.keditor-container-inner > table');

            form.find('.select-groups').selectpicker('val', (table.attr('data-groups') || '').split(','));

            var columnsSettings = form.find('.columns-setting');
            columnsSettings.html('');

            container.find('[data-type=container-content]').each(function (i) {
                var column = $(this);

                var settingHtml = '';
                settingHtml += '<div class="form-group">';
                settingHtml += '   <div class="col-md-12">';
                settingHtml += '       <p>Padding (in px)</p>';
                settingHtml += '       <div class="row row-sm text-center">';
                settingHtml += '           <div class="col-xs-4 col-xs-offset-4">';
                settingHtml += '               <input type="number" value="' + (column.prop('style')['paddingTop'] || '').replace('px', '') + '" class="txt-padding form-control" data-prop="paddingTop" data-index="' + i + '" />';
                settingHtml += '               <small>top</small>';
                settingHtml += '           </div>';
                settingHtml += '       </div>';
                settingHtml += '       <div class="row row-sm text-center">';
                settingHtml += '           <div class="col-xs-4">';
                settingHtml += '               <input type="number" value="' + (column.prop('style')['paddingLeft'] || '').replace('px', '') + '" class="txt-padding form-control" data-prop="paddingLeft" data-index="' + i + '" />';
                settingHtml += '               <small>left</small>';
                settingHtml += '           </div>';
                settingHtml += '           <div class="col-xs-4 col-xs-offset-4">';
                settingHtml += '               <input type="number" value="' + (column.prop('style')['paddingRight'] || '').replace('px', '') + '" class="txt-padding form-control" data-prop="paddingRight" data-index="' + i + '" />';
                settingHtml += '               <small>right</small>';
                settingHtml += '           </div>';
                settingHtml += '       </div>';
                settingHtml += '       <div class="row row-sm text-center">';
                settingHtml += '           <div class="col-xs-4 col-xs-offset-4">';
                settingHtml += '               <input type="number" value="' + (column.prop('style')['paddingBottom'] || '').replace('px', '') + '" class="txt-padding form-control" data-prop="paddingBottom" data-index="' + i + '" />';
                settingHtml += '               <small>bottom</small>';
                settingHtml += '           </div>';
                settingHtml += '       </div>';
                settingHtml += '   </div>';
                settingHtml += '</div>';

                columnsSettings.append(
                    (i > 0 ? '<hr />' : '') +
                    '<div class="column-setting">' +
                    '   <strong>Column #' + (i + 1) + '</strong>' + settingHtml +
                    '</div>'
                );
            });
        }
    });
}

function adjustColWidth(target) {
    flog('adjustColWidth', target);

    target.find('.keditor-container-inner').each(function () {
        var cols = $(this).find('table.col');
        var isDynamicContent = cols.closest('[data-dynamic-href]').length > 0;

        if (!isDynamicContent) {
            var colsNumber = cols.length;
            var td = cols.closest('td');
            var width = td.width();
            var adjustedWidth = 0;

            flog('Cols number: ' + colsNumber + ', width: ' + width);

            cols.each(function (i) {
                var col = $(this);
                var dataWidth = col.attr('data-width');

                if (dataWidth) {
                    var colWidth = 0;
                    if (i === colsNumber - 1) {
                        colWidth = width - adjustedWidth;
                    } else {
                        colWidth = Math.round(eval(width + '*' + dataWidth));
                        adjustedWidth += colWidth;
                    }

                    col.attr('width', colWidth);
                }
            });
        } else {
            flog('Is dynamic content. Ignored!');
        }
    });
}

function initSettingPanel() {
    flog('initSettingPanel');

    var settingPanel = body.find('#edm-setting');
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
        applySetting($(this));
    });

    applySetting();
}

function applySetting(sender) {
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

    if (sender && sender.length > 0 && sender.is('#edm-body-width')) {
        adjustColWidth(edmHeader);
        adjustColWidth(edmBody);
        adjustColWidth(edmFooter);

        edmHeader.add(edmBody).add(edmFooter).find('img.full-width').each(function () {
            $.keditor.components['photo'].adjustWidthForImg($(this), true);
        });

        edmHeader.add(edmBody).add(edmFooter).find('[data-dynamic-href]').each(function () {
            keditor.initDynamicContent($(this));
        });
    }
}

function setStyle(target, name, value) {
    flog('setStyle', name, value);

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
                } else {
                    if (style[1].trim() === '') {
                        styles.splice(i, 1);
                    }
                }
            }
        }

        if (!isExisting && value) {
            styles.push(name + ':' + value);
        }

        self.attr('style', styles.join(';'));
    });
}

function getEdmContent() {
    var body = $(document.body);
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
        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n' +
        '<html xmlns="http://www.w3.org/1999/xhtml">\n' +
        '    <head>\n' +
        '        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
        '        <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
        '        <title>Kademi EDM Title</title>\n' +
        '        <style type="text/css">\n' +
        '            ' + $('#edm-style').html().trim() + '\n' +
        '        </style>\n' +
        '    </head>\n' +
        '    <body>\n' +
        '        <center>\n' +
        '            <table cellpadding="0" cellspacing="0" border="0" width="100%" id="edm-wrapper" ' + attributeTableWrapper + '>\n' +
        '                <tbody>\n' +
        '                    <tr>\n' +
        '                        <td id="edm-wrapper-td" style="' + styleTDWrapper + '" align="center">\n' +
        '                            <table cellpadding="0" cellspacing="0" border="0" width="' + edmBodyWidth + '" id="edm-container" ' + dataEdmStyles + '>\n' +
        '                                <tbody>\n' +
        '                                    <tr>\n' +
        '                                        <td>\n' +
        '                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" id="edm-header" align="center">\n' +
        '                                                <tbody>\n' +
        '                                                    <tr>\n' +
        '                                                        <td id="edm-header-td">\n' +
        edmHeader +
        '                                                        </td>\n' +
        '                                                    </tr>\n' +
        '                                                </tbody>\n' +
        '                                            </table>\n' +
        '                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" id="edm-body" ' + attributeTableBody + ' align="center">\n' +
        '                                                <tbody>\n' +
        '                                                    <tr>\n' +
        '                                                        <td id="edm-body-td" style="' + styleTDBody + '" >\n' +
        edmBody +
        '                                                        </td>\n' +
        '                                                    </tr>\n' +
        '                                                </tbody>\n' +
        '                                            </table>\n' +
        '                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" id="edm-footer" align="center">\n' +
        '                                                <tbody>\n' +
        '                                                    <tr>\n' +
        '                                                        <td id="edm-footer-td">\n' +
        edmFooter +
        '                                                        </td>\n' +
        '                                                    </tr>\n' +
        '                                                </tbody>\n' +
        '                                            </table>\n' +
        '                                        </td>\n' +
        '                                    </tr>\n' +
        '                                </tbody>\n' +
        '                            </table>\n' +
        '                        </td>\n' +
        '                    </tr>\n' +
        '                </tbody>\n' +
        '            </table>\n' +
        '        </center>\n' +
        '    </body>\n' +
        '</html>'
    );
}

function initSaveFile(fileName) {
    flog('initSaveFile', fileName);

    var btnSave = $('.btn-save-file');
    btnSave.on('click', function (e) {
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

    win.on({
        keydown: function (e) {
            if (e.ctrlKey && e.keyCode === keymap.S) {
                e.preventDefault();
                btnSave.trigger('click');
            }
        },
        beforeunload: function () {
            if (body.hasClass('content-changed')) {
                return '\n\nAre you sure you would like to leave the editor? You will lose any unsaved changes\n\n';
            }
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
