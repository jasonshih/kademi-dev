(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['levelProgressPanel'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "levelProgressPanel" component');
            
            $.getScriptOnce('/static/jquery-knob/1.2.13/dist/jquery.knob.min.js', function () {
                initCircleSales(component);
            });
        },
        
        settingEnabled: true,
        
        settingTitle: 'Level Progress panel',
        
        initSettingForm: function (form, keditor) {
            return $.ajax({
                url: '_components/levelProgressPanel?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.select-topic').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-topic', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            initCircleSales(component);
                        });
                    });
                    
                    form.find('.chk-show-topic-name').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-topic-name', this.checked);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            initCircleSales(component);
                        });
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "levelProgressPanel" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-topic').val(dataAttributes['data-topic']);
            form.find('.chk-show-topic-name').prop('checked', dataAttributes['data-show-topic-name'] === 'true');
        }
    };
    
})(jQuery);