/**
 * Created by Anh on 8/22/2016.
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['blogArticleImage'] = {
        settingEnabled: true,

        settingTitle: 'Blog Article Image',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "blogArticleImage" component', form, keditor);

            return $.ajax({
                url: '_components/blogArticleImage?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('[name=orientation]').on('change', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-orientation', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "blogArticleImage" component', form, component, keditor);
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('[name=orientation]').val(dataAttributes['data-orientation']);
        }
    };

})(jQuery);