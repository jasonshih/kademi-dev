(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['profileDetails'] = {
        initDateAgg: function () {
            flog('profileDetails');
        },
        settingEnabled: true,
        settingTitle: 'Profile Details Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "profileDetails" component');

            return $.ajax({
                url: '_components/profileDetails?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('#chkFirstName').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-first-name', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#chkSurname').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-sur-name', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#chkEmail').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-email', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#chkNickname').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-nick-name', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#chkPhone').on('click', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-phone', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('#extraFields').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var extraFields = this.value;
                        var arr = extraFields.split(',');
                        for(var i = 0; i < arr.length; i++){
                            arr[i] = arr[i] && arr[i].trim();
                        }
                        extraFields = arr.join(', ');
                        component.attr('data-extra-fields', extraFields);
                        keditor.initDynamicContent(dynamicElement);
                    });

                }
            });
        },
        initSelect: function (aggsSelect, selectedQuery, selectedAgg) {
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "profileDetails" component');

            var self = this;

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            if (!dataAttributes['data-first-name']){
                dataAttributes['data-first-name'] = 'true';
            }
            if (!dataAttributes['data-sur-name']){
                dataAttributes['data-sur-name'] = 'true';
            }
            if (!dataAttributes['data-nick-name']){
                dataAttributes['data-nick-name'] = 'true';
            }
            if (!dataAttributes['data-email']){
                dataAttributes['data-email'] = 'true';
            }
            if (!dataAttributes['data-phone']){
                dataAttributes['data-phone'] = 'true';
            }
            form.find('#chkFirstName').prop('checked', dataAttributes['data-first-name'] === 'true');
            form.find('#chkSurname').prop('checked', dataAttributes['data-sur-name'] === 'true');
            form.find('#chkEmail').prop('checked', dataAttributes['data-email'] === 'true');
            form.find('#chkNickname').prop('checked', dataAttributes['data-nick-name'] === 'true');
            form.find('#chkPhone').prop('checked', dataAttributes['data-phone'] === 'true');
            form.find('#extraFields').val(dataAttributes['data-extra-fields']);
        }
    };

})(jQuery);