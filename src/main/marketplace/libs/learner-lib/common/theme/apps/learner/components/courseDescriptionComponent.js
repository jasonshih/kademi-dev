(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['courseDescription'] = {
        settingEnabled: true,
        
        settingTitle: 'Course Description',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "courseDescription" component', form, keditor);
            
            return $.ajax({
                url: '_components/courseDescription?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.select-course').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-course', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "courseDescription" component', form, component, keditor);
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-course').val(dataAttributes['data-course'] || '');
        }
    };
    
})(jQuery);