(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['countNewQuotes'] = {
        settingEnabled: true,
        settingTitle: 'Count New Quotes',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "countNewQuotes" component');
            
            var self = this;
            
            return $.ajax({
                url: '_components/countNewQuotes?settings',
                type: 'get',
                dataType: 'HTML',
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
                                component.attr('data-iconfont', 'fa ' + e.icon);
                                
                                keditor.initDynamicContent(dynamicElement);
                            });
                        });
                    });
                    
                    form.find('.value-link').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-link', this.value);
                        
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "countNewQuotes" component');
            
            var self = this;
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);

            form.find('.value-label').val(dataAttributes['data-label']);
            form.find('.value-icon').find('i').attr('class', 'fa ' + dataAttributes['data-iconfont']);
            form.find('.value-link').val(dataAttributes['data-link']);
        }
    };
    
})(jQuery);