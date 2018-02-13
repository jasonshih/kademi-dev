(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['assetEditForm'] = {
        settingEnabled: true,
        settingTitle: 'Asset Edit Form Settings',
        initSettingForm: function (form, keditor) {
            var self = this;
            flog('initSettingForm "assetQueryList" component');

            return $.ajax({
                url: '_components/assetQueryList?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                }
            });
        },
        loadFields: function (form, keditor, callback) {
            var selectQuery = form.find('#asset-query-select');
            var targetType = selectQuery.find('option[value="' + selectQuery.val() + '"]').attr('data-target-type');

            $.ajax({
                url: '/content-types/' + targetType,
                dataType: 'json',
                type: 'get',
                data: {
                    asJson: true
                },
                success: function (resp) {
                    
                    if (typeof callback === 'function') {
                        callback();
                    }
                },
                error: function (jqXHR, textStatus, errorText) {
                    flog('Error in loading fields', jqXHR, textStatus, errorText);
                    var optionsStr = '<option value="">None</option>';
                    form.find('.select-thumbnail, .select-caption').html(optionsStr);

                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "assetQueryList" component');
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);

        }
    };

})(jQuery);