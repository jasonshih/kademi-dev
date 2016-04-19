(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['kpiVis'] = {
        init: function (contentArea, container, component, keditor) {
            // Do nothing
        },

        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },

        destroy: function (component, keditor) {
            // Do nothing
        },

        settingEnabled: true,

        settingTitle: 'KPI Visualisation Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "blogArticleList" component');

            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <label for="photo-align" class="col-sm-12">KPI</label>' +
                '       <div class="col-sm-12">' +
                '           <select class="form-control select-kpi">' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-align" class="col-sm-12">Type</label>' +
                '       <div class="col-sm-12">' +
                '           <select class="form-control select-type">' +
                '               <option value="dateHistogram">dateHistogram</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-align" class="col-sm-12">Height</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="number" class="form-control kpi-height" />' +
                '           <em class="help-block small text-muted">Minimum is 100</em>' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            $.ajax({
                url: 'http://localhost:8080/sales/_DAV/PROPFIND',
                type: 'get',
                dataType: 'JSON',
                data: {
                    fields: 'name,milton:title,href,milton:title,title'
                },
                success: function (resp) {
                    var kpisOptionsStr = '<option value="">- None -</option>';

                    for (var i = 0; i < resp.length; i++) {
                        var kpi = resp[i];
                        if (kpi.name !== 'sales') {
                            kpisOptionsStr += '<option value="' + kpi.href + '">' + kpi.name + '</option>';
                        }
                    }

                    form.find('.select-kpi').html(kpisOptionsStr).on('change', function () {
                        var selectedKpi = this.value;
                        var dynamicElement = keditor.getSettingComponent().find('[data-dynamic-href]');

                        if (selectedKpi) {
                            var contentArea = dynamicElement.closest('.keditor-content-area');

                            dynamicElement.attr('data-href', selectedKpi);
                            keditor.initDynamicContent(contentArea, dynamicElement);
                        } else {
                            dynamicElement.html('<p>Please select KPI</p>');
                        }
                    });
                }
            });

            form.find('.select-type').on('change', function () {
                var dynamicElement = keditor.getSettingComponent().find('[data-dynamic-href]');
                var contentArea = dynamicElement.closest('.keditor-content-area');

                dynamicElement.attr('data-visualisation', this.value);
                keditor.initDynamicContent(contentArea, dynamicElement);
            });

            form.find('.kpi-height').on('change', function () {
                var number = this.value;

                if (isNaN(number) || +number <= 99) {
                    number = 100;
                    this.value = number;
                }

                var dynamicElement = keditor.getSettingComponent().find('[data-dynamic-href]');
                var contentArea = dynamicElement.closest('.keditor-content-area');

                dynamicElement.attr('data-height', number);
                keditor.initDynamicContent(contentArea, dynamicElement);
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "blogArticleList" component');

            var dynamicElement = component.find('[data-dynamic-href]');
            form.find('.select-kpi').val(dynamicElement.attr('data-href'));
            form.find('.select-type').val(dynamicElement.attr('data-visualisation'));
            form.find('.kpi-height').val(dynamicElement.attr('data-height'));
        },

        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);