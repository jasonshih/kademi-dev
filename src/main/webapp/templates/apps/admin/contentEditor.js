var win = $(window);

function doPostMessage(data, url) {
    flog('doPostMessage', data);

    data.from = 'keditor';
    var dataStr = JSON.stringify(data);
    window.parent.postMessage(dataStr, url);
}

function initContentEditorPage(fileName) {
    flog('initContentEditorPage', fileName);

    var body = $(document.body);
    var url = getParam('url') || '';
    if (url && url !== 'undefined') {
        body.addClass('embedded-iframe');
        doPostMessage({
            url: window.location.href.split('#')[0]
        }, url);
    } else {
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
            $('#content-area .keditor-content-area').css('min-height', win.height() - +body.css('padding-top').replace('px', ''));
        }, 100);
    }).trigger('resize');

    initKEditor(body);
    initSaving(body, fileName);

    setTimeout(function () {
        hideLoadingIcon();
    }, 200);
}

$.keditor.components['text'].options = {
    skin: editorSkin,
    allowedContent: true, // DISABLES Advanced Content Filter. This is so templates with classes are allowed through
    bodyId: 'editor',
    templates_files: [templatesPath],
    templates_replaceContent: false,
    toolbarGroups: toolbarSets['Default'],
    extraPlugins: 'embed_video,fuse-image,sourcedialog',
    removePlugins: standardRemovePlugins + ',autogrow,magicline,showblocks',
    removeButtons: 'Find,Replace,SelectAll,Scayt',
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
};

function initKEditor(body) {
    var contentArea = $('#content-area');

    contentArea.keditor({
        snippetsUrl: '/_components/web/snippets.html',
        onContentChanged: function () {
            if (contentArea.keditor('getContent').trim() === '') {
                contentArea.find('.keditor-content-area').addClass('empty');
            } else {
                contentArea.find('.keditor-content-area').removeClass('empty');
            }

            if (!body.hasClass('content-changed')) {
                body.addClass('content-changed');
            }
        },
        onInitContentArea: function (contentArea) {
            var content = contentArea.html() || '';

            if (content === '') {
                contentArea.addClass('empty');
            }
        }
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
    var parentUrl;
    var pageName;
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
        var fileContent = $('#content-area').keditor('getContent');
        var saveUrl = postMessageData && postMessageData.pageName ? postMessageData.pageName : fileName;

        $.ajax({
            url: saveUrl,
            type: 'POST',
            data: {
                body: fileContent
            },
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
