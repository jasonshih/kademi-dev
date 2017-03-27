(function ($) {
    $.fn.contentEditor = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('[jquery.contentEditor] Method ' + method + ' does not exist on jquery.contentEditor');
        }
    };
    
    $.fn.contentEditor.DEFAULTS = {
        snippetsUrl: '',
        iframeMode: false,
        contentStyles: [{
            href: '/static/bootstrap/3.3.7/css/bootstrap.css'
        }]
    };
    
    var dependScripts = [
        '/static/jquery-ui/1.12.1-noui/jquery-ui.min.js',
        '/theme/toolbars.js',
        '/static/ckeditor456/ckeditor.js',
        '/static/ckeditor456/adapters/jquery.js',
        '/static/keditor/dist/js/keditor-0.0.0.min.js',
        '/static/keditor/dist/js/keditor-components-0.0.0.js',
        '/theme/apps/admin/contentEditorUtils.js',
        '/static/jquery.mselect/1.1.0/jquery.mselect-1.1.0.js'
    ];
    
    var dependStyles = [
        '/static/keditor/dist/css/keditor-0.0.0.min.css',
        '/static/keditor/dist/css/keditor-components-0.0.0.min.css',
        '/static/font-awesome/4.7.0/css/font-awesome.min.css',
        '/static/jquery.contentEditor/1.0.0/jquery.contentEditor-1.0.0.css'
    ];
    
    var isDependenciesChecked = false;
    
    var methods = {
        checkDependencies: function (options, callback) {
            if (isDependenciesChecked) {
                callback();
            }
            
            if (options.iframeMode) {
                $.getStyleOnce(dependStyles[0]);
                if (!$.isArray(options.contentStyles)) {
                    options.contentStyles = [];
                }
                
                $.each(dependStyles, function (i, style) {
                    options.contentStyles.push({
                        href: style
                    });
                });
            } else {
                $.each(dependStyles, function (i, style) {
                    $.getStyleOnce(style);
                });
            }
            
            function loadScript(index) {
                $.getScriptOnce(dependScripts[index], function () {
                    if (index === dependScripts.length - 1) {
                        isDependenciesChecked = true;
                        callback();
                    } else {
                        loadScript(index + 1);
                    }
                });
            }
            
            loadScript(0);
        },
        init: function (options) {
            options = $.extend({}, $.fn.contentEditor.DEFAULTS, options);
            
            return $(this).each(function () {
                var target = $(this);
                
                methods.checkDependencies(options, function () {
                    target.keditor({
                        contentAreasWrapper: '<div class="keditor-content-areas-wrapper"></div>',
                        niceScrollEnabled: false,
                        ckeditorOptions: {
                            skin: 'bootstrapck',
                            allowedContent: true,
                            bodyId: 'editor',
                            contentsCss: window.themeCssFiles,
                            templates_files: [templatesPath],
                            templates_replaceContent: false,
                            toolbarGroups: toolbarSets['Default'],
                            extraPlugins: 'embed_video,fuse-image,sourcedialog,modal',
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
                        snippetsUrl: options.snippetsUrl,
                        tabTooltipEnabled: false,
                        snippetsTooltipEnabled: false,
                        onContentChanged: function () {
                            var contentArea = $(this);
                            if (target.keditor('getContent').trim() === '') {
                                contentArea.addClass('empty');
                            } else {
                                contentArea.removeClass('empty');
                            }
                            
                            if (!$(document.body).hasClass('content-changed')) {
                                $(document.body).addClass('content-changed');
                            }
                        },
                        onInitContentArea: function (contentArea) {
                            var content = contentArea.html() || '';
                            
                            if (content === '') {
                                contentArea.addClass('empty');
                            }
                            
                            var unknownContainer = contentArea.children().not('section');
                            unknownContainer.wrap('<div data-type="container-content"></div>');
                            
                            return unknownContainer.parent();
                        },
                        onInitContainer: function (container) {
                            return container.children().children().not('section, .container-bg').attr('data-type', 'component-blank');
                        },
                        containerSettingEnabled: true,
                        containerSettingInitFunction: methods.initContainerSetting,
                        containerSettingShowFunction: methods.showContainerSettings,
                        allGroups: options.allGroups,
                        iframeMode: options.iframeMode,
                        contentStyles: options.contentStyles
                    });
                });
            });
        },
        initContainerSetting: function (form, keditor) {
            var allGroups = keditor.options.allGroups;
            
            $.ajax({
                url: '/theme/apps/admin/contentEditorContainerSetting.html',
                type: 'get',
                success: function (resp) {
                    form.html(resp);
                    
                    var groupsOptions = '';
                    groupsOptions += '<div class="checkbox">';
                    groupsOptions += '    <label><input type="checkbox" value="Anonymous" />Anonymous</label>';
                    groupsOptions += '</div>';
                    for (var name in allGroups) {
                        groupsOptions += '<div class="checkbox">';
                        groupsOptions += '    <label><input type="checkbox" value="' + name + '" />' + allGroups[name] + '</label>';
                        groupsOptions += '</div>';
                    }
                    
                    var selectGroups = form.find('.select-groups');
                    selectGroups.html(groupsOptions);
                    var selectGroupsItems = selectGroups.find('input[type=checkbox]');
                    
                    selectGroupsItems.on('click', function () {
                        var selectedGroups = [];
                        selectGroupsItems.each(function () {
                            if (this.checked) {
                                selectedGroups.push(this.value);
                            }
                        });
                        
                        selectedGroups = selectedGroups ? selectedGroups.join(',') : '';
                        var isAnonymous = selectedGroups === 'Anonymous';
                        
                        if (selectedGroups) {
                            selectGroupsItems.filter('[value=Anonymous]')
                                .prop('disabled', !isAnonymous)
                                .parent()[!isAnonymous ? 'addClass' : 'removeClass']('text-muted');
                            
                            selectGroupsItems.not('[value=Anonymous]').each(function () {
                                var target = $(this);
                                
                                target
                                    .prop('disabled', isAnonymous)
                                    .parent()[isAnonymous ? 'addClass' : 'removeClass']('text-muted');
                            })
                        } else {
                            selectGroupsItems.prop('disabled', false).parent().removeClass('text-muted');
                        }
    
                        var container = keditor.getSettingContainer();
                        container.find('.container-bg').attr('data-groups', selectedGroups);
                    });
                    
                    var basePath = window.location.pathname.replace('contenteditor', '');
                    if (methods.basePath) {
                        basePath = methods.basePath;
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
                            containerBg.get(0).style.backgroundColor = style.backgroundColor;
                            containerBg.get(0).style.backgroundImage = style.backgroundImage;
                            containerBg.get(0).style.backgroundRepeat = style.backgroundRepeat;
                            containerBg.get(0).style.backgroundPosition = style.backgroundPosition;
                            containerBg.get(0).style.backgroundSize = style.backgroundSize;
                            containerContent.css('background', '');
                            containerBg.addClass('background-for');
                        } else {
                            var style = containerBg.prop('style');
                            containerContent.get(0).style.backgroundColor = style.backgroundColor;
                            containerContent.get(0).style.backgroundImage = style.backgroundImage;
                            containerContent.get(0).style.backgroundRepeat = style.backgroundRepeat;
                            containerContent.get(0).style.backgroundPosition = style.backgroundPosition;
                            containerContent.get(0).style.backgroundSize = style.backgroundSize;
                            containerBg.css('background', '');
                            containerBg.removeClass('background-for');
                        }
                    });
                    
                    var txtBgColor = form.find('.txt-bg-color');
                    var txtBgColorPreview = txtBgColor.prev().find('i');
                    txtBgColor.on('change', function () {
                        var container = keditor.getSettingContainer();
                        var target = container.find('.' + form.find('.select-bg-for').val());
                        target.css('background-color', this.value);
                        txtBgColorPreview.css('color', this.value);
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
                        
                        containerBg.attr('class', 'container-bg ' + (containerBg.hasClass('background-for') ? 'background-for' : '') + this.value.trim());
                    });
                    
                    form.find('.chk-inverse').on('click', function () {
                        var container = keditor.getSettingContainer();
                        var containerBg = container.find('.container-bg');
                        
                        containerBg[this.checked ? 'addClass' : 'removeClass']('container-inverse');
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
                    
                    form.find('.select-layout').on('change', function () {
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
                        
                        methods.addDataTransition(form);
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
                        var originClasses = methods.getContainerContentClasses(targetContainerContent)[0];
                        
                        targetContainerContent.attr('class', originClasses + ' ' + this.value);
                    });
                    
                    form.on('click', '.chk-inverse-column', function () {
                        var chk = $(this);
                        var index = chk.attr('data-index');
                        var container = keditor.getSettingContainer();
                        var targetContainerContent = container.find('[data-type=container-content]').eq(+index);
                        
                        targetContainerContent[this.checked ? 'addClass' : 'removeClass']('col-inverse');
                    });
                    
                    form.find('.select-dock-type').on('change', function () {
                        var containerBg = keditor.getSettingContainer().find('.container-bg');
                        
                        containerBg.removeClass('navbar-fixed-top navbar-fixed-bottom navbar-fixed-middle');
                        if (this.value !== '') {
                            containerBg.addClass('navbar-fixed-' + this.value);
                        }
                    });
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
        showContainerSettings: function (form, container, keditor) {
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
                    methods.addDataTransition(form, name.replace('data-', ''), dataAttributes[name]);
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
            form.find('.txt-bg-color').val(bgTarget.get(0).style.backgroundColor || '').trigger('change');
            
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
    
            var selectGroups = form.find('.select-groups');
            var selectGroupsItems = selectGroups.find('input[type=checkbox]');
            var selectedGroups = containerBg.attr('data-groups') || '';
            var isAnonymous = selectedGroups === 'Anonymous';
            selectedGroups = selectedGroups ? selectedGroups.split(',') : [];
            
            if (selectedGroups.length > 0) {
                selectGroupsItems.filter('[value=Anonymous]')
                    .prop('disabled', !isAnonymous)
                    .parent()[!isAnonymous ? 'addClass' : 'removeClass']('text-muted');
        
                selectGroupsItems.not('[value=Anonymous]').each(function () {
                    var target = $(this);
            
                    target
                        .prop('disabled', isAnonymous)
                        .parent()[isAnonymous ? 'addClass' : 'removeClass']('text-muted');
                })
            } else {
                selectGroupsItems.prop('disabled', false).parent().removeClass('text-muted');
            }
            selectGroupsItems.prop('checked', false);
            $.each(selectedGroups, function (i, group) {
                selectGroupsItems.filter('[value="' + group + '"]').prop('checked', true);
            });
            
            form.find('.txt-extra-class').val(containerBg.attr('class').replace('container-bg', '').replace('background-for', '').trim());
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
            
            methods.buildExtraClassForColumns(form, container, keditor);
        },
        getContainerContentClasses: function (containerContent) {
            var classes = containerContent.attr('class').split(' ');
            var customClasses = [];
            var originClasses = [];
            
            for (var i = 0; i < classes.length; i++) {
                var _class = classes[i];
                
                if (_class) {
                    if (_class.indexOf('col-') !== 0 && (' keditor-container-content ui-droppable ui-sortable ').indexOf(' ' + _class + ' ') === -1) {
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
                var customClasses = methods.getContainerContentClasses(containerContent)[1];
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
        },
        
        getContent: function () {
            return $(this).keditor('getContent', false);
        }
    };
    
})(jQuery);