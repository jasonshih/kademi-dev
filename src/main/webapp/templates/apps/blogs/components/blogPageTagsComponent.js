(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['blogPageTags'] = {
        settingEnabled: true,

        settingTitle: 'Blog Tags Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "blogPageTags" component');

            return $.ajax({
                url: '_components/blogPageTags?settings',
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
            flog('showSettingForm "blogPageTags" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.select-blog').val(dataAttributes['data-blog']);
        }
    };

})(jQuery);
