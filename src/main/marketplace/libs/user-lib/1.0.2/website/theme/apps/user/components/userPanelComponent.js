(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['userPanel'] = {
        settingEnabled: true,
        settingTitle: 'User Panel Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "userPanel" component');
            
            return $.ajax({
                url: '_components/userPanel?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
    
                    var txts = form.find('.txt-rewards-titles');
                    var chks = form.find('.chk-rewards');
                    var updateTitle = function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var rewardsTitles = [];
                        txts.each(function () {
                            if (!this.disabled) {
                                rewardsTitles.push(this.value || ' ');
                            }
                        });
        
                        component.attr('data-rewards-titles', rewardsTitles.join(','));
                        keditor.initDynamicContent(dynamicElement);
                    };
                    
                    chks.on('click', function () {
                        var component = keditor.getSettingComponent();
                        var selectedRewards = [];
                        chks.each(function () {
                            if (this.checked) {
                                selectedRewards.push(this.value);
                            }
                        });
                        
                        var input = $(this).parent().next();
                        input.prop('disabled', !this.checked);
                        
                        component.attr('data-rewards', selectedRewards.join(','));
                        updateTitle();
                    });
                    
                    txts.on('change', function () {
                        updateTitle();
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "userPanel" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            var selectedRewards = dataAttributes['data-rewards'];
            selectedRewards = selectedRewards ? selectedRewards.split(',') : [];
            
            var rewardsTitles = dataAttributes['data-rewards-titles'];
            rewardsTitles = rewardsTitles ? rewardsTitles.split(',') : [];
            
            var chks = form.find('.chk-rewards');
            var txts = form.find('.txt-rewards-titles');
            chks.prop('checked', false);
            txts.val('').prop('disabled', true);
            $.each(selectedRewards, function (i, reward) {
                chks.filter('[value="' + reward + '"]').prop('checked', true);
                txts.filter('[name="' + reward + '"]').prop('disabled', false).val(rewardsTitles[i]);
            });
        }
    };
    
})(jQuery);