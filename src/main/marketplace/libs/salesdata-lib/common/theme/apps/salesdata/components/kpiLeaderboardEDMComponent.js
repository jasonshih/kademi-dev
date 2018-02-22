(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['kpiLeaderboardEDM'] = {
        settingEnabled: true,
        settingTitle: 'Points Leaderboard',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "kpiLeaderboardEDM" component', form, keditor);

            return $.ajax({
                url: '_components/kpiLeaderboardEDM?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-sales-data-series').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-sales-data-series', this.value);
                        keditor.initDynamicContent(dynamicElement);


                        $.ajax({
                            url: "/sales/" + this.value + "?kpis",
                            type: 'GET',
                            dataType: 'json',
                            success: function (resp) {
                                flog(resp);
                                if (resp.status) {
                                    $.each(resp.data, function () {
                                        form.find(".select-kpis").append($("<option />").val(this.name).text(this.title));
                                    });
                                }
                            }
                        });

                    });

                    form.find('.select-kpis').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-kpi', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-period').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-period', this.value);
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
            flog('showSettingForm "kpiLeaderboardEDM" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);


            var salesDataSeries = dataAttributes['data-sales-data-series'];
            var kpi = dataAttributes['data-kpi'];

            form.find('.select-sales-data-series').val(salesDataSeries);

            if (salesDataSeries !== "") {

                $.ajax({
                    url: "/sales/" + salesDataSeries + "?kpis",
                    type: 'GET',
                    dataType: 'json',
                    success: function (resp) {
                        flog(resp);
                        if (resp.status) {
                            $.each(resp.data, function () {
                                form.find(".select-kpis").append($("<option />").val(this.name).text(this.title));
                            });
                        }
                        form.find('.select-kpis').val(kpi);
                    }
                });
            }

            form.find('input.select-period').val(dataAttributes['data-period']);
            form.find('input.num-users').val(dataAttributes['data-num-users'] || 5);
            form.find('input.txt-height').val(dataAttributes['data-row-height'] || 25);

        }
    };

})(jQuery);
