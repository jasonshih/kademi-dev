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

    initKEditor(body, fileName);
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

function initKEditor(body, fileName) {
    var contentArea = $('#content-area');

    contentArea.keditor({
        tabContainersText: '<i class="fa fa-columns"></i>',
        tabComponentsText: '<i class="fa fa-files-o"></i>',
        snippetsUrl: '_components?fileName=' + fileName,
        tabTooltipEnabled: false,
        snippetsTooltipEnabled: false,
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
                '   <div class="form-group">' +
                '       <label for="photo-align" class="col-sm-12">Layout</label>' +
                '       <div class="col-sm-12">' +
                '           <select class="form-control select-layout">' +
                '               <option value="">Auto</option>' +
                '               <option value="container-fluid">Wide</option>' +
                '               <option value="container">Box</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-align" class="col-sm-12">Height</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="number" value="" class="txt-height form-control" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <label>Background Image</label>' +
                '           <p><img src="/static/images/photo_holder.png" class="img-responsive img-thumbnail" id="background-image-previewer" /></p>' +
                '           <button type="button" class="btn btn-block btn-primary" id="background-image-edit">Change Background Image</button>' +
                '           <button type="button" class="btn btn-block btn-xs btn-danger" id="background-image-delete">Remove Background Image</button>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-align" class="col-sm-12">Background repeat</label>' +
                '       <div class="col-sm-12">' +
                '           <select class="form-control select-bg-repeat">' +
                '               <option value="repeat">Repeat</option>' +
                '               <option value="no-repeat" selected="selected">No Repeat</option>' +
                '               <option value="repeat-x">Repeat horizontal</option>' +
                '               <option value="repeat-y">Repeat vertical</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-align" class="col-sm-12">Background position</label>' +
                '       <div class="col-sm-12">' +
                '           <select class="form-control select-bg-position">' +
                '               <option value="0% 0%">Top Left</option>' +
                '               <option value="50% 0%">Top Ceter</option>' +
                '               <option value="100% 0%">Top Right</option>' +
                '               <option value="0% 50%">Middle Left</option>' +
                '               <option value="50% 50%">Middle Center</option>' +
                '               <option value="100% 50%">Middle Right</option>' +
                '               <option value="0% 100%">Bottom Left</option>' +
                '               <option value="50% 100%">Bottom Center</option>' +
                '               <option value="100% 100%">Bottom Right</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-align" class="col-sm-12">Background size</label>' +
                '       <div class="col-sm-12">' +
                '           <select class="form-control select-bg-size">' +
                '               <option value="auto">Auto</option>' +
                '               <option value="contain">Contain</option>' +
                '               <option value="cover">Cover</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '      <div class="col-md-12">' +
                '          <label>Background Color</label>' +
                '          <div class="input-group color-picker">' +
                '              <span class="input-group-addon"><i></i></span>' +
                '              <input type="text" value="" class="txt-bg-color form-control" />' +
                '          </div>' +
                '      </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '      <div class="col-md-12">' +
                '          <label>Padding (in px)</label>' +
                '          <div class="row row-sm text-center">' +
                '              <div class="col-xs-4 col-xs-offset-4">' +
                '                  <input type="number" value="" class="txt-padding-top form-control" />' +
                '                  <small>top</small>' +
                '              </div>' +
                '          </div>' +
                '          <div class="row row-sm text-center">' +
                '              <div class="col-xs-4">' +
                '                  <input type="number" value="" class="txt-padding-left form-control" />' +
                '                  <small>left</small>' +
                '              </div>' +
                '              <div class="col-xs-4 col-xs-offset-4">' +
                '                  <input type="number" value="" class="txt-padding-right form-control" />' +
                '                  <small>right</small>' +
                '              </div>' +
                '          </div>' +
                '          <div class="row row-sm text-center">' +
                '              <div class="col-xs-4 col-xs-offset-4">' +
                '                  <input type="number" value="" class="txt-padding-bottom form-control" />' +
                '                  <small>bottom</small>' +
                '              </div>' +
                '          </div>' +
                '      </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-style" class="col-sm-12">Parallax</label>' +
                '       <div class="col-sm-12">' +
                '           <div class="checkbox">' +
                '               <label>' +
                '                   <input type="checkbox" class="parallax-enabled" /> <button type="button" class="btn btn-xs btn-success btn-add-data" style="display: none;">Add data transition</button>' +
                '               </label>' +
                '           </div>' +
                '           <div class="parallax-options-wrapper" style="display: none;">' +
                '               <div class="parallax-options">' +
                '               </div>' +
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
                var containerBg = container.find('.container-bg');

                containerBg.attr('data-groups', $(this).selectpicker('val').join(','));
            });

            var basePath = window.location.pathname.replace('contenteditor', '');
            if (keditor.options.basePath) {
                basePath = keditor.options.basePath;
            }
            form.find('#background-image-edit').mselect({
                contentTypes: ['image'],
                bs3Modal: true,
                pagePath: basePath,
                basePath: basePath,
                onSelectFile: function (url, relativeUrl, fileType, hash) {
                    var container = keditor.getSettingContainer();
                    var containerBg = container.find('.container-bg');
                    var imageUrl = 'http://' + window.location.host + '/_hashes/files/' + hash;
                    containerBg.css('background-image', 'url("' + imageUrl + '")');
                    form.find('#background-image-previewer').attr('src', imageUrl);
                }
            });
            form.find('#background-image-delete').on('click', function (e) {
                e.preventDefault();

                var container = keditor.getSettingContainer();
                var containerBg = container.find('.container-bg');
                containerBg.css('background-image', '');
                form.find('#background-image-previewer').attr('src', '/static/images/photo_holder.png');
            });

            var colorPicker = form.find('.color-picker');
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

                var container = keditor.getSettingContainer();
                var containerBg = container.find('.container-bg');

                if (colorHex && colorHex !== 'transparent') {
                    containerBg.css('background-color', colorHex);
                } else {
                    containerBg.css('background-color', '');
                }
            });

            form.find('.select-bg-repeat').on('change', function () {
                var container = keditor.getSettingContainer();
                var containerBg = container.find('.container-bg');

                containerBg.css('background-repeat', this.value);
            });

            form.find('.select-bg-size').on('change', function () {
                var container = keditor.getSettingContainer();
                var containerBg = container.find('.container-bg');

                containerBg.css('background-size', this.value);
            });

            form.find('.select-bg-position').on('change', function () {
                var container = keditor.getSettingContainer();
                var containerBg = container.find('.container-bg');

                containerBg.css('background-position', this.value);
            });

            form.find('.txt-height').on('change', function () {
                var height = this.value || '';
                if (isNaN(height)) {
                    height = '';
                }

                var container = keditor.getSettingContainer();
                var containerBg = container.find('.container-bg');

                containerBg.css('height', height);
            });

            var txtPaddingTop = form.find('.txt-padding-top');
            var txtPaddingBottom = form.find('.txt-padding-bottom');
            var txtPaddingLeft = form.find('.txt-padding-left');
            var txtPaddingRight = form.find('.txt-padding-right');
            txtPaddingTop.on('change', function () {
                var paddingValue = this.value || '';
                var container = keditor.getSettingContainer();
                var containerContent = container.find('.container-content-wrapper');

                if (paddingValue.trim() === '') {
                    containerContent.css('padding-top', '');
                } else {
                    if (isNaN(paddingValue)) {
                        paddingValue = 0;
                        this.value = paddingValue;
                    }
                    containerContent.css('padding-top', paddingValue + 'px');
                }
            });
            txtPaddingBottom.on('change', function () {
                var paddingValue = this.value || '';
                var container = keditor.getSettingContainer();
                var containerContent = container.find('.container-content-wrapper');

                if (paddingValue.trim() === '') {
                    containerContent.css('padding-bottom', '');
                } else {
                    if (isNaN(paddingValue)) {
                        paddingValue = 0;
                    }
                    containerContent.css('padding-bottom', paddingValue + 'px');
                }
            });
            txtPaddingLeft.on('change', function () {
                var paddingValue = this.value || '';
                var container = keditor.getSettingContainer();
                var containerContent = container.find('.container-content-wrapper');

                if (paddingValue.trim() === '') {
                    containerContent.css('padding-left', '');
                } else {
                    if (isNaN(paddingValue)) {
                        paddingValue = 0;
                    }
                    containerContent.css('padding-left', paddingValue + 'px');
                }
            });
            txtPaddingRight.on('change', function () {
                var paddingValue = this.value || '';
                var container = keditor.getSettingContainer();
                var containerContent = container.find('.container-content-wrapper');

                if (paddingValue.trim() === '') {
                    containerContent.css('padding-right', '');
                } else {
                    if (isNaN(paddingValue)) {
                        paddingValue = 0;
                    }
                    containerContent.css('padding-right', paddingValue + 'px');
                }
            });

            form.find('.select-layout').on('change', function (e) {
                var container = keditor.getSettingContainer();
                var containerContent = container.find('.container-content-wrapper');

                containerContent.removeClass('container container-fluid');
                containerContent.addClass(this.value);
            });

            form.find('.parallax-enabled').on('click', function () {
                var container = keditor.getSettingContainer();
                var containerBg = container.find('.container-bg');
                var parallaxOptionsWrapper = form.find('.parallax-options-wrapper');
                var parallaxBtn = form.find('.btn-add-data');

                if (this.checked) {
                    parallaxOptionsWrapper.css('display', 'block');
                    parallaxBtn.css('display', 'block');
                    containerBg.addClass('parallax-skrollr');
                } else {
                    parallaxOptionsWrapper.css('display', 'none');
                    form.find('.parallax-options').html('');
                    parallaxBtn.css('display', 'none');
                    containerBg.removeClass('parallax-skrollr');
                    $.each(containerBg.get(0).attributes, function (index, attr) {
                        if (attr.name.indexOf('data-') === 0) {
                            containerBg.removeAttr(attr.name);
                        }
                    });
                }
            });

            form.find('.btn-add-data').on('click', function (e) {
                e.preventDefault();

                keditor.options.addDataTransition(form);
            });

            form.find('.parallax-options-wrapper').on('change', '.txt-data-name, .txt-data-value', function () {
                var container = keditor.getSettingContainer();
                var containerBg = container.find('.container-bg');
                var inputGroup = $(this).closest('.checkbox');
                var name = inputGroup.find('.txt-data-name').val() || '';
                name = name.trim();
                var value = inputGroup.find('.txt-data-value').val() || '';
                value = value.trim();

                if (name !== '' && value !== '') {
                    containerBg.attr('data-' + name, value);
                } else {
                    containerBg.removeAttr('data-' + name);
                }
            });
        },
        addDataTransition: function (form, name, value) {
            name = name || '';
            value = value || '';

            form.find('.parallax-options').append(
                '<div class="checkbox">' +
                '    <div class="input-group input-group-sm">' +
                '        <span class="input-group-addon"><span style="display: inline-block; width: 40px;">Name</span></span>' +
                '        <input type="text" value="' + name + '" class="txt-data-name form-control" />' +
                '    </div>' +
                '    <div class="input-group input-group-sm">' +
                '        <span class="input-group-addon"><span style="display: inline-block; width: 40px;">Value</span></span>' +
                '        <input type="text" value="' + value + '" class="txt-data-value form-control" />' +
                '    </div>' +
                '</div>'
            );
        },
        containerSettingShowFunction: function (form, container, keditor) {
            var containerBg = container.find('.container-bg');
            var containerContent = container.find('.container-content-wrapper' +
                '');
            form.find('.parallax-options').html('');

            if (containerBg.hasClass('parallax-skrollr')) {
                form.find('.parallax-enabled').prop('checked', true);
                form.find('.parallax-options-wrapper').css('display', 'block');
                form.find('.btn-add-data').css('display', 'block');

                var dataAttributes = keditor.getDataAttributes(containerBg, null, false);
                for (var name in dataAttributes) {
                    keditor.options.addDataTransition(form, name.replace('data-', ''), dataAttributes[name]);
                }
            } else {
                form.find('.parallax-enabled').prop('checked', false);
                form.find('.parallax-options-wrapper').css('display', 'none');
                form.find('.btn-add-data').css('display', 'none');
            }

            var imageUrl = containerBg.css('background-image');
            imageUrl = imageUrl.replace(/^url\(['"]+(.+)['"]+\)$/, '$1');
            form.find('#background-image-previewer').attr('src', imageUrl !== 'none' ? imageUrl : '/static/images/photo_holder.png');

            form.find('.select-bg-repeat').val(containerBg.css('background-repeat') || 'repeat');
            form.find('.select-bg-position').val(containerBg.css('background-position') || '0% 0%');
            form.find('.select-bg-size').val(containerBg.css('background-size') || 'auto');

            var colorPicker = form.find('.color-picker');
            colorPicker.colorpicker('setValue', containerBg.css('background-color') || '');

            var layout = '';
            if (containerContent.hasClass('container')) {
                layout = 'container';
            } else if (containerContent.hasClass('container-fluid')) {
                layout = 'container-fluid';
            }
            form.find('.select-layout').val(layout);

            var styleInline = containerContent.attr('style') || '';
            var styleRules = styleInline.split(';');
            var paddingTop = '';
            var paddingLeft = '';
            var paddingRight = '';
            var paddingBottom = '';
            for (var i = 0; i < styleRules.length; i++) {
                var rule = styleRules[i];
                rule = rule.split(':');

                if (rule[0].trim() === 'padding-top') {
                    paddingTop = rule[1] || '';
                    paddingTop = paddingTop.replace('px', '').trim();
                }

                if (rule[0].trim() === 'padding-left') {
                    paddingLeft = rule[1] || '';
                    paddingLeft = paddingLeft.replace('px', '').trim();
                }

                if (rule[0].trim() === 'padding-right') {
                    paddingRight = rule[1] || '';
                    paddingRight = paddingRight.replace('px', '').trim();
                }

                if (rule[0].trim() === 'padding-bottom') {
                    paddingBottom = rule[1] || '';
                    paddingBottom = paddingBottom.replace('px', '').trim();
                }
            }
            form.find('.txt-padding-top').val(paddingTop);
            form.find('.txt-padding-bottom').val(paddingBottom);
            form.find('.txt-padding-left').val(paddingLeft);
            form.find('.txt-padding-right').val(paddingRight);

            styleInline = containerBg.attr('style') || '';
            styleRules = styleInline.split(';');
            var height = '';
            for (var i = 0; i < styleRules.length; i++) {
                var rule = styleRules[i];
                rule = rule.split(':');

                if (rule[0].trim() === 'height') {
                    height = rule[1] || '';
                    height = height.replace('px', '').trim();
                }
            }
            form.find('.txt-height').val(height);

            form.find('.select-groups').selectpicker('val', (containerBg.attr('data-groups') || '').split(','));
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
