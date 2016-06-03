(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['blogArticleListEDM'] = {
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

        settingTitle: 'Blog Article List Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "blogArticleListEDM" component');

            $.ajax({
                url: '/_components/edm/blogArticleListEDM?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.number-of-articles').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number <= 0) {
                            number = 1;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');

                        component.attr('data-number-of-articles', number);
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });

                    form.find('.select-blog').on('change', function () {
                        var selectedBlog = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        if (selectedBlog) {
                            var contentArea = dynamicElement.closest('.keditor-content-area');

                            component.attr('data-blog', selectedBlog);
                            keditor.initDynamicContent(contentArea, dynamicElement);
                        } else {
                            dynamicElement.html('<p>Please select Blog</p>');
                        }
                    });

                    form.find('.select-layout').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');

                        component.attr('data-layout', this.value);
                        keditor.initDynamicContent(contentArea, dynamicElement);

                        form.find('.items-per-row-wrapper').css('display', this.value === 'grid' ? 'block' : 'none');
                    });

                    form.find('.items-per-row').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');

                        component.attr('data-items-per-row', this.value);
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "blogArticleListEDM" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.number-of-articles').val(dataAttributes['data-number-of-articles']);
            form.find('.select-blog').val(dataAttributes['data-blog']);
            form.find('.select-layout').val(dataAttributes['data-layout']).trigger('change');
            form.find('.items-per-row').val(dataAttributes['data-items-per-row'] || 3);
        },

        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);