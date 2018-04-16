(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['membersTablePoints'] = {
        settingEnabled: true,

        settingTitle: 'Members Table Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "membersTable" component');

            return $.ajax({
                url: '_components/membersTablePoints?settings',
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

                    var tableColumnChks = form.find('.table-columns');
                    tableColumnChks.on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var arr = [];
                        tableColumnChks.each(function () {
                            if (this.checked) {
                                arr.push(this.value);
                            }
                        });

                        component.attr('data-columns', arr.join(','));
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.txt-title').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-title', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.showCustLink').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-show-cust-link', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.points-bucket').on('change', function () {
                        var selectedQuery = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-points-bucket', selectedQuery);
                        component.attr('data-points-bucket-title', $(this).find(':selected').text());
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=group]').on('change', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-group', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "membersTable" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-items-per-page').val(dataAttributes['data-items-per-page']);
            form.find('.query-height').val(dataAttributes['data-height']);
            form.find('.txt-title').val(dataAttributes['data-title']);
            form.find('.points-bucket').val(dataAttributes['data-points-bucket']);
            form.find('.show-headers').prop("checked", toBool(dataAttributes['data-headers']));
            form.find('.show-paginator').prop("checked", toBool(dataAttributes['data-showpaginator']));
            form.find('.showCustLink').prop("checked", toBool(dataAttributes['data-show-cust-link']));
            form.find('.select-query option').addClass('hide');

            var tableColumnChks = form.find('.table-columns');
            tableColumnChks.prop('checked', false);

            if (dataAttributes['data-columns']) {
                $.each(dataAttributes['data-columns'].split(','), function (index, value) {
                    tableColumnChks.filter('[value=' + value + ']').prop('checked', true);
                });
            }

            form.find('[name=group]').val(dataAttributes['data-group']);
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