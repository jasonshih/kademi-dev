(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['blogArticleList'] = {
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
            flog('initSettingForm "blogArticleList" component');

            $.ajax({
                url: '/_components/web/blogArticleList?settings',
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

                        var dynamicElement = keditor.getSettingComponent().find('[data-dynamic-href]');
                        var contentArea = dynamicElement.closest('.keditor-content-area');

                        dynamicElement.attr('data-number-of-articles', number);
                        keditor.initDynamicContent(contentArea, dynamicElement);
                    });

                    form.find('.select-blog').on('change', function () {
                        var selectedBlog = this.value;
                        var dynamicElement = keditor.getSettingComponent().find('[data-dynamic-href]');

                        if (selectedBlog) {
                            var contentArea = dynamicElement.closest('.keditor-content-area');

                            dynamicElement.attr('data-blog', selectedBlog);
                            keditor.initDynamicContent(contentArea, dynamicElement);
                        } else {
                            dynamicElement.html('<p>Please select Blog</p>');
                        }
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "blogArticleList" component');

            var dynamicElement = component.find('[data-dynamic-href]');
            form.find('.number-of-articles').val(dynamicElement.attr('data-number-of-articles'));
            form.find('.select-blog').val(dynamicElement.attr('data-blog'));
        },

        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);