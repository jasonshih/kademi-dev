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

function initKEditor(body, fileName) {
    var contentArea = $('#content-area');
    var themeCss = $('head link[href^="/--theme--less--bootstrap.less"]');

    if( typeof themeCssFiles !== 'undefined' ) {
        
        if (themeCss.length > 0) {
            themeCssFiles.push(themeCss.attr('href'));
        }    
        themeCssFiles.push('/static/bootstrap/ckeditor/bootstrap-ckeditor.css');
    }

    contentArea.keditor({
        ckeditorOptions: {
            skin: editorSkin,
            allowedContent: true, // DISABLES Advanced Content Filter. This is so templates with classes are allowed through
            bodyId: 'editor',
            contentsCss: themeCssFiles,
            templates_files: [templatesPath],
            templates_replaceContent: false,
            toolbarGroups: toolbarSets['Default'],
            extraPlugins: 'embed_video,fuse-image,sourcedialog',
            removePlugins: standardRemovePlugins + ',autogrow,magicline,showblocks',
            removeButtons: 'Find,Replace,SelectAll,Scayt,FontSize,Font',
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
                '       <label class="col-sm-12">Layout</label>' +
                '       <div class="col-sm-12">' +
                '           <select class="form-control select-layout">' +
                '               <option value="">Auto</option>' +
                '               <option value="container-fluid">Wide</option>' +
                '               <option value="container">Box</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Dock type</label>' +
                '       <div class="col-sm-12">' +
                '           <select class="form-control select-dock-type">' +
                '               <option value=""> - None - </option>' +
                '               <option value="top">Top</option>' +
                '               <option value="middle">Middle</option>' +
                '               <option value="bottom">Bottom</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Height</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="number" value="" class="txt-height form-control" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '      <div class="col-md-12">' +
                '          <label>Padding (in px)</label>' +
                '          <div class="row row-sm text-center">' +
                '              <div class="col-xs-4 col-xs-offset-4">' +
                '                  <input type="number" value="" class="txt-padding form-control" data-style-name="paddingTop" />' +
                '                  <small>top</small>' +
                '              </div>' +
                '          </div>' +
                '          <div class="row row-sm text-center">' +
                '              <div class="col-xs-4">' +
                '                  <input type="number" value="" class="txt-padding form-control" data-style-name="paddingLeft" />' +
                '                  <small>left</small>' +
                '              </div>' +
                '              <div class="col-xs-4 col-xs-offset-4">' +
                '                  <input type="number" value="" class="txt-padding form-control" data-style-name="paddingRight" />' +
                '                  <small>right</small>' +
                '              </div>' +
                '          </div>' +
                '          <div class="row row-sm text-center">' +
                '              <div class="col-xs-4 col-xs-offset-4">' +
                '                  <input type="number" value="" class="txt-padding form-control" data-style-name="paddingBottom" />' +
                '                  <small>bottom</small>' +
                '              </div>' +
                '          </div>' +
                '      </div>' +
                '   </div>' +
                '   <hr />' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Background for</label>' +
                '       <div class="col-sm-12">' +
                '           <select class="form-control select-bg-for">' +
                '               <option value="container-bg" selected="selected">Container</option>' +
                '               <option value="container-content-wrapper">Container Content</option>' +
                '           </select>' +
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
                '       <label class="col-sm-12">Background repeat</label>' +
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
                '       <label class="col-sm-12">Background position</label>' +
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
                '       <label class="col-sm-12">Background size</label>' +
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
                '   <hr />' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Parallax</label>' +
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
                '   <hr />' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Extra class</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="text" value="" class="txt-extra-class form-control" />' +
                '           <em class="help-block text-muted small">These classes will be added to <code>.container-bg</code></em>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Is inverse</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="checkbox" value="" class="chk-inverse" />' +
                '       </div>' +
                '   </div>' +
                '   <hr />' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Columns settings</label>' +
                '       <div class="col-sm-12 columns-setting">' +
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
                    var target = container.find('.' + form.find('.select-bg-for').val());
                    var imageUrl = 'http://' + window.location.host + '/_hashes/files/' + hash;
                    target.css('background-image', 'url("' + imageUrl + '")');
                    form.find('#background-image-previewer').attr('src', imageUrl);
                }
            });
            form.find('#background-image-delete').on('click', function (e) {
                e.preventDefault();

                var container = keditor.getSettingContainer();
                var target = container.find('.' + form.find('.select-bg-for').val());
                target.css('background-image', '');
                form.find('#background-image-previewer').attr('src', '/static/images/photo_holder.png');
            });

            form.find('.select-bg-for').on('change', function () {
                var container = keditor.getSettingContainer();
                var containerBg = container.find('.container-bg');
                var containerContent = container.find('.container-content-wrapper');

                if (this.value === 'container-bg') {
                    var style = containerContent.prop('style');
                    containerBg.css('background', style.backgroundColor);
                    containerBg.css('background', style.backgroundImage);
                    containerBg.css('background', style.backgroundRepeat);
                    containerBg.css('background', style.backgroundPosition);
                    containerBg.css('background', style.backgroundSize);
                    containerContent.css('background', '');
                    containerBg.addClass('background-for');
                } else {
                    var style = containerBg.prop('style');
                    containerContent.css('background', style.backgroundColor);
                    containerContent.css('background', style.backgroundImage);
                    containerContent.css('background', style.backgroundRepeat);
                    containerContent.css('background', style.backgroundPosition);
                    containerContent.css('background', style.backgroundSize);
                    containerBg.css('background', '');
                    containerBg.removeClass('background-for');
                }
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
                var target = container.find('.' + form.find('.select-bg-for').val());

                if (colorHex && colorHex !== 'transparent') {
                    target.css('background-color', colorHex);
                } else {
                    target.css('background-color', '');
                }
            });

            form.find('.select-bg-repeat').on('change', function () {
                var container = keditor.getSettingContainer();
                var target = container.find('.' + form.find('.select-bg-for').val());

                target.css('background-repeat', this.value);
            });

            form.find('.select-bg-size').on('change', function () {
                var container = keditor.getSettingContainer();
                var target = container.find('.' + form.find('.select-bg-for').val());

                target.css('background-size', this.value);
            });

            form.find('.select-bg-position').on('change', function () {
                var container = keditor.getSettingContainer();
                var target = container.find('.' + form.find('.select-bg-for').val());

                target.css('background-position', this.value);
            });

            form.find('.txt-extra-class').on('change', function () {
                var container = keditor.getSettingContainer();
                var containerBg = container.find('.container-bg');

                containerBg.attr('class', 'container-bg ' + this.value.trim());
            });

            form.find('.chk-inverse').on('click', function () {
                var container = keditor.getSettingContainer();
                var containerBg = container.find('.container-bg');

                containerBg[this.checked ? 'addClass': 'removeClass']('container-inverse');
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

            form.find('.txt-padding').each(function () {
                var txt = $(this);
                var styleName = txt.attr('data-style-name');

                txt.on('change', function () {
                    var paddingValue = this.value || '';
                    var container = keditor.getSettingContainer();
                    var containerContent = container.find('.container-content-wrapper').get(0);

                    if (paddingValue.trim() === '') {
                        containerContent.style[styleName] = '';
                    } else {
                        if (isNaN(paddingValue)) {
                            paddingValue = 0;
                            this.value = paddingValue;
                        }
                        containerContent.style[styleName] = paddingValue + 'px';
                    }
                });
            });

            form.find('.select-layout').on('change', function (e) {
                var container = keditor.getSettingContainer();
                var containerLayout = container.find('.container-layout');
                var containerContent = container.find('.container-content-wrapper');

                containerLayout.removeClass('container container-fluid');
                containerContent.removeClass('container container-fluid');
                containerLayout.addClass(this.value);
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

            form.on('change', '.txt-extra-class-column', function () {
                var txt = $(this);
                var index = txt.attr('data-index');
                var container = keditor.getSettingContainer();
                var targetContainerContent = container.find('[data-type=container-content]').eq(+index);
                var originClasses = keditor.options.getContainerContentClasses(targetContainerContent)[0];

                targetContainerContent.attr('class', originClasses + ' ' + this.value);
            });

            form.on('click', '.chk-inverse-column', function () {
                var chk = $(this);
                var index = chk.attr('data-index');
                var container = keditor.getSettingContainer();
                var targetContainerContent = container.find('[data-type=container-content]').eq(+index);

                targetContainerContent[this.checked ? 'addClass': 'removeClass']('col-inverse');
            });

            form.find('.select-dock-type').on('change', function () {
                var containerBg = keditor.getSettingContainer().find('.container-bg');

                containerBg.removeClass('navbar-fixed-top navbar-fixed-bottom navbar-fixed-middle');
                if (this.value !== '') {
                    containerBg.addClass('navbar-fixed-' + this.value);
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
            var containerLayout = container.find('.container-layout');
            var containerContent = container.find('.container-content-wrapper');
            form.find('.parallax-options').html('');

            if (containerLayout.length === 0) {
                var layoutClass = '';
                if (containerContent.hasClass('container')) {
                    layoutClass = 'container';
                } else if (containerContent.hasClass('container-fluid')) {
                    layoutClass = 'container-fluid';
                }
                containerContent.wrap('<div class="container-layout ' + layoutClass + '"></div>');
                containerContent.removeClass('container container-fluid');
                containerLayout = container.find('.container-layout');
            }

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

            var imageUrl;
            var bgTarget;
            var bgImageBg = containerBg.get(0).style.backgroundImage;
            var bgImageContent = containerContent.get(0).style.backgroundImage;
            if (containerBg.hasClass('background-for')) {
                imageUrl = bgImageBg;
                bgTarget = containerBg;
                form.find('.select-bg-for').val('container-bg');
            } else {
                imageUrl = bgImageContent;
                bgTarget = containerContent;
                form.find('.select-bg-for').val('container-content-wrapper');
            }

            imageUrl = (imageUrl || '').replace(/^url\(['"]+(.+)['"]+\)$/, '$1');
            form.find('#background-image-previewer').attr('src', imageUrl !== 'none' ? imageUrl : '/static/images/photo_holder.png');

            form.find('.select-bg-repeat').val(bgTarget.get(0).style.backgroundRepeat || 'repeat');
            form.find('.select-bg-position').val(bgTarget.get(0).style.backgroundPosition || '0% 0%');
            form.find('.select-bg-size').val(bgTarget.get(0).style.backgroundSize || 'auto');

            var colorPicker = form.find('.color-picker');
            colorPicker.colorpicker('setValue', bgTarget.get(0).style.backgroundColor || '');

            var layout = '';
            if (containerLayout.hasClass('container')) {
                layout = 'container';
            } else if (containerLayout.hasClass('container-fluid')) {
                layout = 'container-fluid';
            }
            form.find('.select-layout').val(layout);

            form.find('.txt-padding').each(function () {
                var txt = $(this);
                var styleName = txt.attr('data-style-name');

                txt.val((containerContent.get(0).style[styleName] || '').replace('px', ''));
            });

            form.find('.txt-height').val(containerBg.get(0).style.height || '');

            form.find('.select-groups').selectpicker('val', (containerBg.attr('data-groups') || '').split(','));
            form.find('.txt-extra-class').val(containerBg.attr('class').replace('container-bg', '').trim());
            form.find('.chk-inverse').prop('checked', containerBg.hasClass('container-inverse'));

            var dockType = '';
            if (containerBg.hasClass('navbar-fixed-top')) {
                dockType = 'top';
            } else if (containerBg.hasClass('navbar-fixed-middle')) {
                dockType = 'middle';
            } else if (containerBg.hasClass('navbar-fixed-bottom')) {
                dockType = 'bottom';
            }
            form.find('.select-dock-type').val(dockType);

            keditor.options.buildExtraClassForColumns(form, container, keditor);
        },

        getContainerContentClasses: function (containerContent) {
            var classes = containerContent.attr('class').split(' ');
            var customClasses = [];
            var originClasses = [];

            for (var i = 0; i < classes.length; i++) {
                var _class = classes[i];

                if (_class) {
                    if(_class.indexOf('col-') !== 0 && (' keditor-container-content ui-droppable ui-sortable ').indexOf(' ' + _class + ' ') === -1) {
                        customClasses.push(_class);
                    } else {
                        originClasses.push(_class);
                    }
                }
            }

            return [originClasses.join(' '), customClasses.join(' ')];
        },

        buildExtraClassForColumns: function (form, container, keditor) {
            var htmlStr = '';

            container.find('[data-type=container-content]').each(function (index) {
                var containerContent = $(this);
                var customClasses = keditor.options.getContainerContentClasses(containerContent)[1];
                var isInverse = containerContent.hasClass('col-inverse');

                htmlStr += '<div class="clearfix">';
                if (index !== 0) {
                    htmlStr += '    <br />';
                }
                htmlStr += '    Column #' + (index + 1);
                htmlStr += '    <input type="text" class="form-control txt-extra-class-column" placeholder="Extra class" data-index="' + index + '" value="' + customClasses + '" />';
                htmlStr += '    <label class="checkbox-inline">';
                htmlStr += '        <input type="checkbox" class="chk-inverse-column" data-index="' + index + '" ' + (isInverse ? 'checked="checked"' : '') + ' /> Is inverse';
                htmlStr += '    </label>';
                htmlStr += '</div>';
            });

            form.find('.columns-setting').html(htmlStr);
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
