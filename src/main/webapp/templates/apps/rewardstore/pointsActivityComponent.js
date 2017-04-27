(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['pointsActivity'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "pieChart component', contentArea, container, component, keditor);

            var self = this;

            if ($('[href="/static/nvd3/1.8.2/nv.d3.min.css"]').length === 0) {
                $('head').append('<link href="/static/nvd3/1.8.2/nv.d3.min.css" rel="stylesheet" type="text/css" />');
            }

            $.getScriptOnce('/static/moment/2.17.1/moment.js', function () {
                $.getScriptOnce('/static/nvd3/1.8.2/d3.min.js', function () {
                    $.getScriptOnce('/static/nvd3/1.8.2/nv.d3.min.js', function () {
                        $.getScriptOnce('/theme/apps/rewardstore/jquery.pointsActivityChart.js', function () {
                            self.initPointsActivityChart();
                        });
                    });
                });
            });
        },
        initPointsActivityChart: function () {
            flog('initPointsActivityChart');

            $('.panel-points-activity-chart').each(function () {
                var queryData = $(this);

                if (!queryData.hasClass('initialized-pointsActivityChart')) {
                    queryData.pointsActivityChart();
                    queryData.addClass('initialized-pointsActivityChart');
                }
            });
        },
        settingEnabled: true,
        settingTitle: 'Points Activity Settings',
        initSettingForm: function (form, keditor) {
            var self = this;

            return $.ajax({
                url: '_components/pointsActivity?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.pointsActivityBucket').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-bucket', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPointsActivityChart();
                        });
                    });

                    form.find('.txt-title').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-title', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPointsActivityChart();
                        });
                    });

                    form.find('.pointsActivityHeight').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 99) {
                            number = 100;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-height', number);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initPointsActivityChart();
                        });
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "pointsActivity" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.pointsActivityBucket').val(dataAttributes['data-bucket']);
            form.find('.pointsActivityHeight').val(dataAttributes['data-height']);
            form.find('.txt-title').val(dataAttributes['data-title']);
        }
    };

})(jQuery);