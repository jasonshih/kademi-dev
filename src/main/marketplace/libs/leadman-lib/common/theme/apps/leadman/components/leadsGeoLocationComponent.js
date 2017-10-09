/**
 * Created by Anh on 07/07/2017.
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['leadsGeoLocation'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "leadsGeoLocation" component', component);
            $(document.body).trigger('onGoogleMapReady');
        },

        settingEnabled: true,

        settingTitle: 'Leads GeoLocation',

        initSettingForm: function (form, keditor) {
            flog('init "leadsGeoLocation" settings', form);

            return $.ajax({
                url: '_components/leadsGeoLocation?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    var leadsGeoLocationHeight = form.find('#leadsGeoLocationHeight');
                    leadsGeoLocationHeight.on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var panel = component.find('.lead-dash-page .map-donutchart');
                        panel.css('height', this.value);
                        component.attr('data-styles', panel.attr('style'));
                        keditor.initDynamicContent(dynamicElement).done(function () {
                            $(document.body).trigger('onGoogleMapReady');
                        });
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "leadsGeoLocation" component', component);
            var target = component.find('.lead-dash-page .map-donutchart');
            form.find('#leadsGeoLocationHeight').val(target.css('height').replace('px',''));
        }
    };
})(jQuery);
