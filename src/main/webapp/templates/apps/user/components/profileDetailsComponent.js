(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['profileDetails'] = {
        init: function (contentArea, container, component, keditor) {
            var self = this;
        },
        initDateAgg: function () {
            flog('profileDetails');
        },
        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },
        destroy: function (component, keditor) {
            // Do nothing
        },
        settingEnabled: true,
        settingTitle: 'Profile Details Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "profileDetails" component');

            var self = this;

            $.ajax({
                url: '_components/profileDetails?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                }
            });
        },
        initSelect: function (aggsSelect, selectedQuery, selectedAgg) {
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "profileDetails" component');

            var self = this;
        },
        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);