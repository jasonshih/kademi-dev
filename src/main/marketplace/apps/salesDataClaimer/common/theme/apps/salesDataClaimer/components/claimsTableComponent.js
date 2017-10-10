(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['claimsTable'] = {
        settingEnabled: true,

        settingTitle: 'Claims Table Settings',

        init: function (contentArea, container, component, keditor) {
            component.attr('data-query-type', "queryTable");
            component.attr('data-query', "tableClaims");
        },

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "claimsTable" component');

            return $.ajax({
                url: '_components/claimsTable?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);


                    form.find('.select-items-per-page').on('change', function () {
                        var selectedQuery = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-items-per-page', selectedQuery);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.query-height').on('change', function () {
                        var number = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        if (isNaN(number) || number < 200) {
                            number = 200;
                            this.value = number;
                        }

                        component.attr('data-height', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.show-headers').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        var inp = $(this);
                        component.attr('data-headers', inp.prop("checked"));
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            //self.initDateAgg();
                        });
                    });

                    //form.find('.show-paginator').on('change', function () {
                    //    var component = keditor.getSettingComponent();
                    //    var dynamicElement = component.find('[data-dynamic-href]');
                    //
                    //    var inp = $(this);
                    //    component.attr('data-showpaginator', inp.prop("checked"));
                    //    keditor.initDynamicContent(dynamicElement).done(function () {
                    //        //self.initDateAgg();
                    //    });
                    //});
                    
                    form.find('.txt-title').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-title', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "claimsTable" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-items-per-page').val(dataAttributes['data-items-per-page']);
            form.find('.query-height').val(dataAttributes['data-height']);
            form.find('.txt-title').val(dataAttributes['data-title']);
            form.find('.show-headers').prop("checked", toBool(dataAttributes['data-headers']));
            form.find('.show-paginator').prop("checked", toBool(dataAttributes['data-showpaginator']));
            form.find('.select-query option').addClass('hide');
            form.find('.'+dataAttributes['data-query-type']).removeClass('hide');

        }
    };

    function toBool(v) {
        if (v === true) {
            return true;
        }
        var b = (v === 'true');
        return b;
    }
})(jQuery);