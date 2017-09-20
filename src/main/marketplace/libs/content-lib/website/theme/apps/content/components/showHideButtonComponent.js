(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['showHideButton'] = {
        settingEnabled: true,
        settingTitle: 'Show/hide button',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "showHideButton" component');
            
            return $.ajax({
                url: '_components/showHideButton?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.cbbButtonSize').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-button-size', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.cbbButtonColor').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-button-color', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.cbbButtonAlign').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-button-align', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.txtButtonClass').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-button-class', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    $.getStyleOnce('/static/bootstrap-iconpicker/1.7.0/css/bootstrap-iconpicker.min.css');
                    $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/iconset/iconset-fontawesome-4.2.0.min.js', function () {
                        $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/bootstrap-iconpicker.min.js', function () {
                            form.find('.btn-collapsed-icon, .btn-expanded-icon').iconpicker({
                                iconset: 'fontawesome',
                                cols: 10,
                                rows: 4,
                                placement: 'left'
                            });
                            
                            form.find('.txt-button-text').on('change', function (e) {
                                var component = keditor.getSettingComponent();
                                var dynamicElement = component.find('[data-dynamic-href]');
                                
                                component.attr('data-button-text', this.value);
                                keditor.initDynamicContent(dynamicElement);
                            });
                            
                            form.find('.btn-collapsed-icon').on('change', function (e) {
                                var component = keditor.getSettingComponent();
                                var dynamicElement = component.find('[data-dynamic-href]');
                                
                                component.attr('data-collapsed-icon', e.icon);
                                keditor.initDynamicContent(dynamicElement);
                            });
                            
                            form.find('.btn-expanded-icon').on('change', function (e) {
                                var component = keditor.getSettingComponent();
                                var dynamicElement = component.find('[data-dynamic-href]');
                                
                                component.attr('data-expanded-icon', e.icon);
                                keditor.initDynamicContent(dynamicElement);
                            });
                        });
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "showHideButton" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            
            form.find('.txt-button-text').val(dataAttributes['data-button-text'] || '');
            form.find('.cbbButtonSize').val(dataAttributes['data-button-size'] || 'btn-md');
            form.find('.cbbButtonAlign').val(dataAttributes['data-button-align'] || 'text-left');
            form.find('.cbbButtonColor').val(dataAttributes['data-button-color'] || 'btn-primary');
            form.find('.txtButtonClass').val(dataAttributes['data-button-class'] || '');
            
            $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/iconset/iconset-fontawesome-4.2.0.min.js', function () {
                $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/bootstrap-iconpicker.min.js', function () {
                    var iconCollapsed = dataAttributes['data-collapsed-icon'] || 'fa-caret-right';
                    form.find('.btn-collapsed-icon').find('i').attr('class', 'fa ' + iconCollapsed).end().find('input').val(iconCollapsed);
                    var iconExpanded = dataAttributes['data-expanded-icon'] || 'fa-caret-down';
                    form.find('.btn-expanded-icon').find('i').attr('class', 'fa ' + iconExpanded).end().find('input').val(iconExpanded);
                });
            });
        }
    };
    
})(jQuery);