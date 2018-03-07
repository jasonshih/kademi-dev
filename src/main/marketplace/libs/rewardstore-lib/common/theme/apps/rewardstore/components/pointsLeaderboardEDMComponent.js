(function ($) {
    var KEditor = $.keditor;
    var edmEditor = $.edmEditor;
    var flog = KEditor.log;

    KEditor.components['pointsLeaderboardEDM'] = {
        settingEnabled: true,

        settingTitle: 'Points Leaderboard (Email)',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "pointsLeaderboardEDM" component', form, keditor);

            return $.ajax({
                url: '_components/pointsLeaderboardEDM?settings',
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

                    form.find('.txt-show-username').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-show-username', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    $.getScriptOnce('/static/inputmask/min/inputmask/inputmask.min.js', function () {
                        $.getScriptOnce('/static/inputmask/min/inputmask/inputmask.date.extensions.min.js', function () {
                            $.getScriptOnce('/static/inputmask/min/inputmask/jquery.inputmask.min.js', function () {
                                form.find('.start-date').inputmask("dd/mm/yyyy");
                                form.find('.end-date').inputmask("dd/mm/yyyy");
                            });
                        });
                    });

                    form.find('.start-date').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-start-date', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.end-date').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-end-date', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.txt-cell-padding').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number < 0) {
                            number = 0;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-cell-padding', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    edmEditor.initSimpleColorPicker(form.find('.txt-header-bg-color'), function (color) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-header-bg-color', color);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    edmEditor.initSimpleColorPicker(form.find('.txt-body-bg-color'), function (color) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-body-bg-color', color);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "pointsLeaderboardEDM" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-store').val(dataAttributes['data-points-bucket']);

            form.find('input.num-users').val(dataAttributes['data-num-users'] || 5);
            form.find('input.txt-height').val(dataAttributes['data-row-height'] || 25);
            form.find('input.txt-show-username').val(dataAttributes['data-show-username'] || 'true');
            form.find('input.start-date').val(dataAttributes['data-start-date']);
            form.find('input.end-date').val(dataAttributes['data-end-date']);
            form.find('.txt-cell-padding').val(dataAttributes['data-cell-padding']);
            form.find('.txt-header-bg-color').val(dataAttributes['data-header-bg-color'] || '').trigger('update');
            form.find('.txt-body-bg-color').val(dataAttributes['data-body-bg-color'] || '').trigger('update');
        }
    };

})(jQuery);