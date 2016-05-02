(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['recentPoints'] = {
        init: function (contentArea, container, component, options) {
        },
        getContent: function (component, options) {
            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },
        destroy: function (component, options) {
            // Do nothing
        },
        settingEnabled: true,
        settingTitle: 'Recent Points Settings',
        initSettingForm: function (form, keditor) {
            $.ajax({
                url: '/_components/web/recentPoints?settings',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);

                    form.find('.recentPointsBucket').on('change', function () {
                        var selectedBucket = this.value;
                        var dynamicElement = keditor.getSettingComponent().find('[data-dynamic-href]');

                        if (selectedBucket) {
                            var contentArea = dynamicElement.closest('.keditor-content-area');

                            dynamicElement.attr('data-bucket', selectedBucket);
                            keditor.initDynamicContent(contentArea, dynamicElement);
                        } else {
                            dynamicElement.html('<p>Please select a points bucket</p>');
                        }
                    });

                    form.find('.recentPointsDays').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 1) {
                            number = 1;
                            this.value = number;
                        }

                        var dynamicElement = keditor.getSettingComponent().find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');

                        dynamicElement.attr('data-days', number);
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });

                    form.find('.recentPointsHeight').on('change', function () {
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
                }
            });
        },
        showSettingForm: function (form, component, options) {
            flog('showSettingForm "recent points" component');

            var dynamicElement = component.find('[data-dynamic-href]');
            form.find('.recentPointsBucket').val(dynamicElement.attr('data-bucket'));
            form.find('.recentPointsDays').val(dynamicElement.attr('data-days'));
            form.find('.recentPointsHeight').val(dynamicElement.attr('data-height'));
        },
        hideSettingForm: function (form) {
            // Do nothing
        }
    };

})(jQuery);