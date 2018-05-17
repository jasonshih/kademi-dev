(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['salesLeaderboardWeb'] = {
        settingEnabled: true,

        settingTitle: 'Sales Leaderboard (Web)',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "salesLeaderboardWeb" component', form, keditor);

            return $.ajax({
                url: '_components/salesLeaderboardWeb?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-series').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-series', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-tag').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-tag', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.num-users').on('change', function () {
                        var number = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-num-users', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.hide-names').on('change', function () {
                        var number = $(this).prop("checked");
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-hide-names', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.hidden-text').on('change', function () {
                        var number = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-hidden-text', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.txt-height').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-row-height', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.show-sales').on('change', function () {
                        var number = $(this).prop("checked");
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-show-points', number);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "pointsLeaderboardWeb" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-series').val(dataAttributes['data-series']);
            form.find('.select-tag').val(dataAttributes['data-tag']);

            form.find('input.num-users').val(dataAttributes['data-num-users'] || 5);
            form.find('input.hide-names').prop("checked", dataAttributes['data-hide-names']  == 'true');
            form.find('input.hidden-text').val(dataAttributes['data-hidden-text']);

            form.find('input.txt-height').val(dataAttributes['data-row-height'] || 25);
            form.find('input.show-sales').prop("checked", dataAttributes['data-show-sales'] !== 'false');
        }
    };

})(jQuery);