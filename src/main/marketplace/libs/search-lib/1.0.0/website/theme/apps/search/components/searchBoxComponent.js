(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['searchBox'] = {
        settingEnabled: true,
        settingTitle: 'Search box Settings',
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "searchBox" component');

            return $.ajax({
                url: '_components/searchBox?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('[name=scope]').on('change', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-scope', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=searchType]').on('change', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-search-type', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=placeholder]').on('change', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-placeholder', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=fullwidth]').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-fullwidth', this.checked);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "searchBox" component');
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('[name=scope]').val(dataAttributes['data-scope']);
            form.find('[name=searchType]').val(dataAttributes['data-search-type']);
            form.find('[name=placeholder]').val(dataAttributes['data-placeholder']);
            form.find('[name=fullwidth]').prop('checked', dataAttributes['data-fullwidth'] == "true");
        }
    };

})(jQuery);