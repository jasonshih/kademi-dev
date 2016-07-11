(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['profileUnsub'] = {
        init: function (contentArea, container, component, keditor) {
            var self = this;
        },
        initDateAgg: function () {
            flog('profileUnsub');
        },
        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },
        destroy: function (component, keditor) {
            // Do nothing
        },
        settingEnabled: true,
        settingTitle: 'Profile Unsubscribe Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "profileUnsub" component');

            var self = this;

            $.ajax({
                url: '_components/profileUnsub?settings',
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
            flog('showSettingForm "profileUnsub" component');

            var self = this;
        },
        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);