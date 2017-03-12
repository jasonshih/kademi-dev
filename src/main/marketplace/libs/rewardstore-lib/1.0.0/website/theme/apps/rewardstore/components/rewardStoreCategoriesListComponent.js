(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['rewardStoreCategoriesList'] = {
        settingEnabled: true,
        settingTitle: 'Categories List Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "rewardStoreCategoriesList" component');
            
            return $.ajax({
                url: '_components/rewardStoreCategoriesList?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.select-reward').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-reward', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    })
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "rewardStoreCategoriesList" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-reward').val(dataAttributes['data-reward'] || '');
        }
    };
    
})(jQuery);