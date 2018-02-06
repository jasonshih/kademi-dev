(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['badgesPanel'] = {
        settingEnabled: true,
        
        settingTitle: 'Achievement badges',
        
        initSettingForm: function (form, keditor) {
            return $.ajax({
                url: '_components/badgesPanel?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.select-topic').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-topic', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.select-badges-per-row').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-badges-per-row', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.chk-show-badge-title').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-show-badge-title', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                    
                    form.find('.chk-most-recent-badge').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        
                        component.attr('data-most-recent-badge', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                        form.find('.most-recent-badge-wrapper').css('display', this.checked ? 'none' : 'block');
                    });

                    form.find('.txt-padding').each(function () {
                        var txt = $(this);
                        var styleName = txt.attr('data-style-name');

                        txt.on('change', function () {
                            var paddingValue = this.value || '';
                            var target = keditor.getSettingComponent().find('.badgeStyle').get(0);

                            if (paddingValue.trim() === '') {
                                target.style[styleName] = '';
                            } else {
                                if (isNaN(paddingValue)) {
                                    paddingValue = 0;
                                    this.value = paddingValue;
                                }
                                target.style[styleName] = paddingValue + 'px';
                            }

                            var component = keditor.getSettingComponent();
                            var dynamicElement = component.find('[data-dynamic-href]');

                            component.attr('data-style', target.getAttribute('style') || '');
                            keditor.initDynamicContent(dynamicElement);
                        });
                    });

                    form.find('.txt-margin').each(function () {
                        var txt = $(this);
                        var styleName = txt.attr('data-style-name');

                        txt.on('change', function () {
                            var marginValue = this.value || '';
                            var target = keditor.getSettingComponent().find('.badgeStyle').get(0);

                            if (marginValue.trim() === '') {
                                target.style[styleName] = '';
                            } else {
                                if (isNaN(marginValue)) {
                                    marginValue = 0;
                                    this.value = marginValue;
                                }
                                target.style[styleName] = marginValue + 'px';
                            }

                            var component = keditor.getSettingComponent();
                            var dynamicElement = component.find('[data-dynamic-href]');

                            component.attr('data-style', target.getAttribute('style') || '');
                            keditor.initDynamicContent(dynamicElement);
                        });
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "badgesPanel" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-topic').val(dataAttributes['data-topic']);
            form.find('.select-badges-per-row').val(dataAttributes['data-badges-per-row'] || '4');
            form.find('.chk-show-badge-title').prop('checked', dataAttributes['show-badge-title'] === 'true');
            form.find('.chk-most-recent-badge').prop('checked', dataAttributes['most-recent-badge'] === 'true');
            form.find('.most-recent-badge-wrapper').css('display', dataAttributes['most-recent-badge'] === 'true' ? 'none' : 'block');

            var target = component.find('.badgeStyle').get(0);

            form.find('.txt-padding').each(function () {
                var txt = $(this);
                var styleName = txt.attr('data-style-name');

                txt.val((target.style[styleName] || '').replace('px', ''));
            });
            form.find('.txt-margin').each(function () {
                var txt = $(this);
                var styleName = txt.attr('data-style-name');

                txt.val((target.style[styleName] || '').replace('px', ''));
            });
        }
    };
    
})(jQuery);