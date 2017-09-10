(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['onTrackAllKpis'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "onTrackAllKpis" component');
            
            var self = this;
            
            $.getScriptOnce('/static/jquery-knob/1.2.13/dist/jquery.knob.min.js', function () {
                self.initCircleSales(component);
            });
        },
        settingEnabled: true,
        settingTitle: 'Target Panel',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "onTrackAllKpis" component');
            
            var self = this;
            
            return $.ajax({
                url: '_components/onTrackAllKpis?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    var cbbLevel = form.find('.select-items-per-row');
                    cbbLevel.on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-items-per-row', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initCircleSales(dynamicElement);
                        });
                    });
                }
            });
        },
        initCircleSales: function (target) {
            flog('initCircleSales', target);
            
            var colours = target.find('.circle-sales-colors');
            target.find('.circle-sales-knob').each(function () {
                var knob = $(this);
                
                var fgColor = '';
                if (knob.hasClass('circle-sales-primary')) {
                    fgColor = colours.find('.btn-primary').css('background-color');
                } else if (knob.hasClass('circle-sales-info')) {
                    fgColor = colours.find('.btn-info').css('background-color');
                } else if (knob.hasClass('circle-sales-success')) {
                    fgColor = colours.find('.btn-success').css('background-color');
                } else if (knob.hasClass('circle-sales-warning')) {
                    fgColor = colours.find('.btn-warning').css('background-color');
                } else if (knob.hasClass('circle-sales-danger')) {
                    fgColor = colours.find('.btn-danger').css('background-color');
                }
                
                knob.attr({
                    'data-width': '100%',
                    'data-displayinput': 'false',
                    'data-thickness': '.15',
                    'data-bgColor': 'rgba(255, 255, 255, .2)',
                    'data-fgColor': fgColor
                }).knob({
                    readOnly: true
                });
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "onTrackAllKpis" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-items-per-row').val(dataAttributes['data-items-per-row'] || '3');
        }
    };
    
})(jQuery);