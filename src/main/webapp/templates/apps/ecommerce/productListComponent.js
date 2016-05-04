(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['productList'] = {
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

        settingTitle: 'Product List Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "productList" component', form, keditor);

            $.ajax({
                url: '/_components/web/productList?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-store').on('change', function () {
                        var selectedStore = this.value;
                        var dynamicElement = keditor.getSettingComponent().find('[data-dynamic-href]');

                        if (selectedStore) {
                            var contentArea = dynamicElement.closest('.keditor-content-area');
                            var storeHref = $(this).find('option').eq(this.selectedIndex).attr('data-href');

                            dynamicElement.attr('data-store', selectedStore);
                            dynamicElement.attr('data-category', '');
                            self.loadCategory(form, storeHref);
                            keditor.initDynamicContent(contentArea, dynamicElement);
                        } else {
                            dynamicElement.html('<p>Please select Store</p>');
                        }
                    });

                    form.find('.select-category').on('change', function () {
                        var selectedCategory = this.value;
                        var dynamicElement = keditor.getSettingComponent().find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');

                        dynamicElement.attr('data-category', selectedCategory);
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });

                    form.find('.number-of-products').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 0) {
                            number = 1;
                            this.value = number;
                        }

                        var dynamicElement = keditor.getSettingComponent().find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');

                        dynamicElement.attr('data-number-of-products', number);
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });

                    form.find('.products-per-row').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 0) {
                            number = 1;
                            this.value = number;
                        }

                        var dynamicElement = keditor.getSettingComponent().find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');

                        dynamicElement.attr('data-products-per-row', number);
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "productList" component', form, component, keditor);
        },

        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);