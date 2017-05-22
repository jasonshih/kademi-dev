/**
 * Created by Anh on 7/19/2016.
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['blogPageArticles'] = {
        settingEnabled: true,

        settingTitle: 'Blog Articles',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "blogPageArticles" component', form, keditor);

            return $.ajax({
                url: '_components/blogPageArticles?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('[name=filter]').on('change', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        component.attr('data-filter', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=categories]').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var categories = [];
                        form.find('[name=categories]:checked').each(function(index, item){
                            categories.push(this.value);
                        });
                        component.attr('data-categories', categories.join(','));
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=tags]').on('click', function(e){
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var categories = [];
                        form.find('[name=tags]:checked').each(function(index, item){
                            categories.push(this.value);
                        });
                        component.attr('data-tags', categories.join(','));
                        keditor.initDynamicContent(dynamicElement);
                    });

                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "blogPageArticles" component', form, component, keditor);
            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('[name=filter]').val(dataAttributes['data-filter']);
            form.find('[name=categories]').each(function(index, item){
                if (dataAttributes['data-categories'].indexOf(this.value) !== -1){
                    this.checked = true;
                }
            });
            form.find('[name=tags]').each(function(index, item){
                if (dataAttributes['data-tags'].indexOf(this.value) !== -1){
                    this.checked = true;
                }
            })
        }
    };

})(jQuery);