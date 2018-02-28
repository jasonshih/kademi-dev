(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['pointsLeaderboardWeb'] = {
        settingEnabled: true,

        settingTitle: 'Points Leaderboard (Web)',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "pointsLeaderboardWeb" component', form, keditor);

            return $.ajax({
                url: '_components/pointsLeaderboardWeb?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-store').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-points-bucket', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-tag').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-points-tag', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.num-users').on('change', function () {
                        var number = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-num-users', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.txt-height').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-row-height', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });


                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "pointsLeaderboardWeb" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-store').val(dataAttributes['data-points-bucket']);
            form.find('.select-tag').val(dataAttributes['data-points-tag']);

            form.find('input.num-users').val(dataAttributes['data-num-users'] || 5);
            form.find('input.txt-height').val(dataAttributes['data-row-height'] || 25);

        }
    };

})(jQuery);