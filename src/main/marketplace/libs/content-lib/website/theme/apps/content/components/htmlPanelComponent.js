(function ($) {
    var KEditor = $.keditor;
    var contentEditor = $.contentEditor;
    var flog = KEditor.log;

    KEditor.components['htmlPanel'] = {
        settingEnabled: true,
        settingTitle: 'Panel Settings',
        init: function (contentArea, container, component, keditor) {
            this.initCkeditor(keditor, component);
        },
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "htmlPanel" component');
            var that = this;
            return $.ajax({
                url: '_components/htmlPanel?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    $.getStyleOnce('/static/bootstrap-iconpicker/1.7.0/css/bootstrap-iconpicker.min.css');
                    $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/iconset/iconset-fontawesome-4.2.0.min.js', function () {
                        $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/bootstrap-iconpicker.min.js', function () {
                            form.find('.value-icon').iconpicker({
                                rows: 5,
                                cols: 5,
                                iconset: 'fontawesome',
                                search: true,
                                placement: 'left'
                            }).on('change', function (e) {
                                var component = keditor.getSettingComponent();
                                var dynamicElement = component.find('[data-dynamic-href]');
                                component.attr('data-icon', 'fa ' + e.icon);

                                keditor.initDynamicContent(dynamicElement).done(function () {
                                    that.initCkeditor(keditor, component);
                                });
                            });
                        });
                    });

                    contentEditor.initColorPicker(form.find('.iconColor'), function (color) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-icon-color', color);

                        keditor.initDynamicContent(dynamicElement).done(function () {
                            that.initCkeditor(keditor, component)
                        });
                    });

                    form.find('.iconSize').on('change', function (e) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-icon-size', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            that.initCkeditor(keditor, component)
                        });
                    });

                    form.find('.customIconColor').on('click', function (e) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-custom-icon-color', this.checked);
                        if (this.checked){
                            form.find('.iconColor').removeProp('disabled');
                        } else {
                            form.find('.iconColor').prop('disabled', true);
                        }
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            that.initCkeditor(keditor, component)
                        });
                    });

                    form.find('.bgstyle').on('change', function (e) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-bg', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            that.initCkeditor(keditor, component)
                        });
                    });

                    form.find('.showIcon').on('click', function (e) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-show-icon', this.checked);

                        keditor.initDynamicContent(dynamicElement).done(function () {
                            that.initCkeditor(keditor, component)
                        });
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "htmlPanel" component');

            contentEditor.showDefaultMenuControls(form, component, keditor);
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.value-icon').find('i').attr('class', 'fa ' + dataAttributes['data-icon']);
            form.find('.iconSize').val(dataAttributes['data-icon-size'])
            form.find('.bgstyle').val(dataAttributes['data-bg'])
            form.find('.iconColor').val(dataAttributes['data-icon-color']).colorpicker('setValue', dataAttributes['data-icon-color']);
            form.find('.customIconColor').prop('checked', dataAttributes['data-custom-icon-color'] == 'true');
            var showIcon = true;
            if (dataAttributes['data-show-icon'] && dataAttributes['data-show-icon'] != 'true'){
                showIcon = false;
            }
            form.find('.showIcon').prop('checked', showIcon);
        },
        initCkeditor: function (keditor, component) {
            var that = this;
            var options = keditor.options;
            var contentArea = component.parents('.keditor-content-area');
            var container = component.parents('.keditor-container');
            component.find('.textEdit').prop('contenteditable', true);

            component.find('.textEdit').on('input', function (e) {
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

            var editor = component.find('.textEdit').ckeditor(options.ckeditorOptions).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);

                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });
            editor.on( 'blur', function() {
                console.log( 'Saving...', editor.name, editor.getData() );

                component.attr('data-html', encodeURIComponent(editor.getData()));
                var dynamicElement = component.find('[data-dynamic-href]');
                keditor.initDynamicContent(dynamicElement).done(function () {
                    that.initCkeditor(keditor, component)
                });
            } );
        }
    };

})(jQuery);