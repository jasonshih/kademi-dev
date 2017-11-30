(function ($) {
    var KEditor = $.keditor;
    var contentEditor = $.contentEditor;
    var flog = KEditor.log;

    KEditor.components['tile'] = {
        settingEnabled: true,
        settingTitle: 'Tile Settings',
        init: function (contentArea, container, component, keditor) {
            component.children('.keditor-component-content').css('min-height', 30);
            component.find('[data-dynamic-href="_components/tile"]').remove();
            if (!component.find('.tileComponent').length) {
                component.children('.keditor-component-content').html('<div class="tileComponent" style="background-color: #fff">\n' +
                    '    <a href="javascript:void(0)" class="embed-responsive embed-responsive-16by9 tileImage" style="background-image: url(\'/theme/img/photo_holder.png\')">\n' +
                    '    </a>\n' +
                    '<div class="tileBody" style="padding: 0 15px 15px 15px">\n' +
                    '        <h3>Tile heading</h3>\n' +
                    '        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet, architecto.</p>\n' +
                    '    </div>' +
                    '</div>');
            }
            this.initCkeditor(contentArea, container, component, keditor);
        },
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "tile" component');
            var that = this;
            return $.ajax({
                url: '/theme/apps/content/components/tileSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    var photoEdit = form.find('#photo-edit');
                    photoEdit.mselect({
                        contentTypes: ['image'],
                        bs3Modal: true,
                        pagePath: keditor.options.pagePath,
                        basePath: keditor.options.basePath,
                        onSelectFile: function (url, relativeUrl, fileType, hash) {
                            var imgDiv = keditor.getSettingComponent().find('.tileImage');
                            var src = '/_hashes/files/' + hash;
                            imgDiv.css('background-image', 'url("' + src + '")');
                        }
                    });

                    contentEditor.initColorPicker(form.find('.tilebackground'), function (color) {
                        var component = keditor.getSettingComponent();
                        component.find('.tileComponent').css('background-color', color);
                        component.attr('data-bgcolor', color);
                    });

                    form.find('.paddingpanel').on('change', function (e) {
                        var component = keditor.getSettingComponent();
                        component.attr('data-paddingpanel', this.value);
                        component.find('.tileComponent .tileBody').css('padding', this.value);
                    });

                    form.find('#photo-linkable').on('click', function () {
                        var component = keditor.getSettingComponent();
                        form.find('#photo-link').prop('disabled', !this.checked);
                        if (!this.checked){
                            component.attr('data-link', '');
                            form.find('#photo-link').val('');
                            component.find('.tileComponent .tileImage').attr('href', 'javascript:void(0)');
                        }
                    });

                    form.find('#photo-link').on('change', function () {
                        var component = keditor.getSettingComponent();
                        component.attr('data-link', this.value);
                        component.find('.tileComponent .tileImage').attr('href', this.value);
                    });

                    form.find('.photoStyle').on('change', function () {
                        var component = keditor.getSettingComponent();
                        component.attr('data-style', this.value);
                        if (this.value == "embed-responsive-4by3"){
                            component.find('.tileComponent .tileImage').addClass('embed-responsive-4by3').removeClass('embed-responsive-16by9');
                        } else if (this.value == "embed-responsive-16by9"){
                            component.find('.tileComponent .tileImage').removeClass('embed-responsive-4by3').addClass('embed-responsive-16by9');
                        }
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "tile" component');
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            var color = dataAttributes['data-bgcolor'] || 'white';
            form.find('.tilebackground').val(color).colorpicker('setValue', color);

            form.find('.paddingpanel').val(dataAttributes['data-paddingpanel'] || '0 15px 15px 15px');
            if (dataAttributes['data-link']){
                form.find('#photo-link').val(dataAttributes['data-link']);
                form.find('#photo-linkable').prop('checked', true);
            } else {
                form.find('#photo-linkable').prop('checked', false);
            }

            form.find('.photoStyle').val(dataAttributes['data-style'] || 'embed-responsive-16by9');
        },

        getContent: function (component, keditor) {
            flog('getContent "tile" component', component);
            var comp = component.clone();
            comp.find("[contenteditable]").removeAttr('contenteditable');
            return comp.find('.tileComponent').prop('outerHTML');
        },
        initCkeditor: function (contentArea, container, component, keditor) {
            var options = keditor.options;
            component.find('.tileBody').prop('contenteditable', true);

            component.find('.tileBody').on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(contentArea, e, component);
                }

                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(contentArea, e, container);
                }

                if (typeof options.onContentChanged === 'function') {
                    // options.onContentChanged.call(contentArea, e);
                }
            });

            var editor = component.find('.tileBody').ckeditor(options.ckeditorOptions).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);

                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });
            editor.on('change', function () {
                console.log('Saving...', editor.name, editor.getData());
            });
        }
    };

})(jQuery);