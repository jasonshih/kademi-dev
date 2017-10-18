(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['comingUpAuction'] = {
        settingEnabled: true,
        settingTitle: 'Coming Up Auction',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "comingUpAuction" component');
            
            return $.ajax({
                url: '_components/comingUpAuction?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.chk-show-description').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-description', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "comingUpAuction" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.chk-show-description').prop('checked', dataAttributes['data-show-description'] === 'true');
        }
    };
    
})(jQuery);