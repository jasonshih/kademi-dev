(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['blogPageCategories'] = {
        settingEnabled: true,

        settingTitle: 'Blog Categories',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "blogPageCategories" component');

            return $.ajax({
                url: '_components/blogPageCategories?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-blog').on('change', function () {
                        var selectedBlog = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-blog', selectedBlog);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "blogPageCategories" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-blog').val(dataAttributes['data-blog']);
        }
    };

})(jQuery);
