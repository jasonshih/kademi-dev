(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['pointsUserPanel'] = {
        settingEnabled: true,
        settingTitle: 'Points User Panel',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "pointsUserPanel" component');
            
            return $.ajax({
                url: '_components/pointsUserPanel?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    // var txts = form.find('.txt-rewards-titles');
                    // var chks = form.find('.chk-rewards');
                    // var updateTitle = function () {
                    //     var component = keditor.getSettingComponent();
                    //     var dynamicElement = component.find('[data-dynamic-href]');
                    //     var rewardsTitles = [];
                    //     txts.each(function () {
                    //         if (!this.disabled) {
                    //             rewardsTitles.push(this.value || ' ');
                    //         }
                    //     });
                    //
                    //     component.attr('data-rewards-titles', rewardsTitles.join(','));
                    //     keditor.initDynamicContent(dynamicElement);
                    // };
                    //
                    // chks.on('click', function () {
                    //     var component = keditor.getSettingComponent();
                    //     var selectedRewards = [];
                    //     chks.each(function () {
                    //         if (this.checked) {
                    //             selectedRewards.push(this.value);
                    //         }
                    //     });
                    //
                    //     var input = $(this).parent().next();
                    //     input.prop('disabled', !this.checked);
                    //
                    //     component.attr('data-rewards', selectedRewards.join(','));
                    //     updateTitle();
                    // });
                    //
                    // txts.on('change', function () {
                    //     updateTitle();
                    // });

                    form.find('.points-tag').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-points-tag', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.panel-class').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-panel-class', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.inverted').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-inverted', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "pointsUserPanel" component');
            
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            // var selectedRewards = dataAttributes['data-rewards'];
            // selectedRewards = selectedRewards ? selectedRewards.split(',') : [];
            //
            // var rewardsTitles = dataAttributes['data-rewards-titles'];
            // rewardsTitles = rewardsTitles ? rewardsTitles.split(',') : [];
            //
            // var chks = form.find('.chk-rewards');
            // var txts = form.find('.txt-rewards-titles');
            // chks.prop('checked', false);
            // txts.val('').prop('disabled', true);
            // $.each(selectedRewards, function (i, reward) {
            //     chks.filter('[value="' + reward + '"]').prop('checked', true);
            //     txts.filter('[name="' + reward + '"]').prop('disabled', false).val(rewardsTitles[i]);
            // });

            form.find('.points-tag').val(dataAttributes['data-points-tag'] || 'h2');
            form.find('.panel-class').val(dataAttributes['data-panel-class'] || 'panel-primary');
            form.find('.inverted').prop('checked', dataAttributes['data-inverted'] != "false");
        }
    };
    
})(jQuery);