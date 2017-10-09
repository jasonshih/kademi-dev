(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['claimsOverTime'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "claimsOverTime component', contentArea, container, component, keditor);

            var self = this;


            component.attr('data-queryname', 'tableClaimsOverTime');
            component.attr('data-querytype', "queryTable");
            if ($('[href="/static/nvd3/1.8.2/nv.d3.min.css"]').length === 0) {
                $('head').append('<link href="/static/nvd3/1.8.2/nv.d3.min.css" rel="stylesheet" type="text/css" />');
            }

            $.getScriptOnce('/static/nvd3/1.8.2/d3.min.js', function () {
                $.getScriptOnce('/static/nvd3/1.8.2/nv.d3.min.js', function () {
                    $.getScriptOnce('/theme/apps/reporting/jquery.dateAgg.js', function () {
                        self.initDateAgg();
                    });
                });
            });
        },
        initDateAgg: function () {
            flog('initDateAgg');

            $('.panel-claims-over-time').each(function () {
                var queryData = $(this);

                if (!queryData.hasClass('initialized-dateAgg')) {
                    queryData.addClass('initialized-dateAgg');
                    queryData.dateAgg();
                }
            });
            flog("initDateAgg: trigger date changed");
            $(document.body).trigger('pageDateChanged', ["1/1/2016", "1/1/2017", "This year", null]);
        },
        settingEnabled: true,
        settingTitle: 'Claims over time',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "claimsOverTime" component');

            var self = this;

            return $.ajax({
                url: '_components/claimsOverTime?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.txt-title').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-chart-title', this.value);
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            self.initDateAgg();
                        });
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "claimsOverTime" component');
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.txt-title').val(dataAttributes['data-chart-title']);
        }
    };
})(jQuery);