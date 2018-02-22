(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['pointsTransaction'] = {
        settingEnabled: true,

        settingTitle: 'Points Transaction',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "pointsTransaction" component', form, keditor);

            return $.ajax({
                url: '_components/pointsTransaction?settings',
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

                    form.find('.select-points-type').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-points-type', this.value);
                        keditor.initDynamicContent(dynamicElement);

                        if (this.value == "org"){
                            form.find('.pointOrg').removeClass('hide');
                        } else {
                            form.find('.pointOrg').addClass('hide');
                        }
                    });

                    form.find('.select-orgtype').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-points-org-type', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-points-group').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-points-group', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-tx-type').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-tx-type', this.value);
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


                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "pointsTransaction" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-store').val(dataAttributes['data-points-bucket']);

            form.find('.select-points-type').val(dataAttributes['data-points-type'] || '');
            form.find('.select-orgtype').val(dataAttributes['data-points-org-type'] || '');
            form.find('.select-points-group').val(dataAttributes['data-points-group'] || '');
            form.find('.select-tx-type').val(dataAttributes['data-tx-type'] || '');
            form.find('input.start-date').val(dataAttributes['data-start-date']);
            form.find('input.end-date').val(dataAttributes['data-end-date']);

            if (dataAttributes['data-points-type'] == "org"){
                form.find('.pointOrg').removeClass('hide');
            } else {
                form.find('.pointOrg').addClass('hide');
            }
        }
    };

})(jQuery);