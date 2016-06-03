(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['socialMedias'] = {
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
        settingTitle: 'Social Medias Settings',
        initSettingForm: function (form, keditor) {
            $.ajax({
                url: '/_components/web/socialMedias?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.socialMediasBucket').on('change', function () {
                        var selectedBucket = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        if (selectedBucket) {
                            var contentArea = dynamicElement.closest('.keditor-content-area');

                            component.attr('data-bucket', selectedBucket);
                            keditor.initDynamicContent(contentArea, dynamicElement);
                        } else {
                            dynamicElement.html('<p>Please select a points bucket</p>');
                        }
                    });

                    form.find('.socialMediasDays').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 1) {
                            number = 1;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');

                        component.attr('data-days', number);
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });

                    form.find('.socialMediasHeight').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 99) {
                            number = 100;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');

                        component.attr('data-height', number);
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "recent points" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.socialMediasBucket').val(dataAttributes['data-bucket']);
            form.find('.socialMediasDays').val(dataAttributes['data-days']);
            form.find('.socialMediasHeight').val(dataAttributes['data-height']);
        },
        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);