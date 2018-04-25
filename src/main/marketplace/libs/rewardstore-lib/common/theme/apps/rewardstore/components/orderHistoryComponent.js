(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['orderHistory'] = {
        settingEnabled: true,
        settingTitle: 'Order History Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "pointsEarned" component', form, keditor);

            return $.ajax({
                url: '_components/pointsEarned?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.value-label').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-label', this.value);
                        
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
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
                                
                                keditor.initDynamicContent(dynamicElement);
                            });
                        });
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "orderHistory" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);

            form.find('.value-label').val(dataAttributes['data-label']);
            form.find('.value-icon').find('i').attr('class', 'fa ' + dataAttributes['data-icon']);
        }
    };

})(jQuery);