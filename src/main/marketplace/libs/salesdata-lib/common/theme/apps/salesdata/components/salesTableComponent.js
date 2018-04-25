(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['salesTable'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "salesTable" component', contentArea, container, component, keditor);

            var self = this;
        },

        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.initialized-salesTable').removeClass('initialized-salesTable');

            return componentContent.html();
        },

        settingEnabled: true,

        settingTitle: 'Sales Table Settings',

        initKpiVis: function () {
            flog('salesTable');

            $('.salesTable').each(function () {
                var kpiVis = $(this);

                if (!kpiVis.hasClass('initialized-salesTable')) {
                    kpiVis.addClass('initialized-salesTable');
                    kpiVis.kpiVis();
                }
            });
        },

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "salesTable" component');

            var self = this;

            return $.ajax({
                url: '_components/salesTable?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-data').on('change', function () {
                        var selectedKpi = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-name]');

                        if (selectedKpi) {
                            component.attr('data-name', selectedKpi);
                            keditor.initDynamicContent(dynamicElement).done(function () {
                                self.initKpiVis();
                            });
                        } else {
                            dynamicElement.html('<p>Please select Serie</p>');
                        }
                    });

                    form.find('.filter-by-user').on('change', function () {
                        var checked = $(this).prop("checked");
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-filter-by-user', checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.value-label').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-label', this.value);

                        keditor.initDynamicContent(dynamicElement);
                    });

                    $.getStyleOnce('/static/bootstrap-iconpicker/1.7.0/css/bootstrap-iconpicker.min.css');
                    $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/iconset/iconset-fontawesome-4.2.0.min.js', function () {
                        $.getScriptOnce('/static/bootstrap-iconpicker/1.7.0/js/bootstrap-iconpicker.min.js', function () {
                            form.find('.value-icon').iconpicker({
                                rows: 5,
                                cols: 5,
                                iconset: 'fontawesome',
                                search: true,
                                placement: 'left'
                            }).on('change', function (e) {
                                var component = keditor.getSettingComponent();
                                var dynamicElement = component.find('[data-dynamic-href]');
                                component.attr('data-icon', 'fa ' + e.icon);

                                keditor.initDynamicContent(dynamicElement);
                            });
                        });
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "salesTable" component');

            var dataAttributes = keditor.getDataAttributes(component, [], false);
            form.find('.select-data').val(dataAttributes['data-name']);
            form.find('.value-label').val(dataAttributes['data-label']);
            form.find('.value-icon').find('i').attr('class', 'fa ' + dataAttributes['data-icon']);
            form.find('.filter-by-user').prop("checked", dataAttributes['data-filter-by-user'] == "true");
        }
    };

})(jQuery);