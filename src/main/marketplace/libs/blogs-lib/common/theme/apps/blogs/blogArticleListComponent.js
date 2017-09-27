(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['blogArticleList'] = {
        settingEnabled: true,

        settingTitle: 'Blog Article List Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "blogArticleList" component');

            return $.ajax({
                url: '_components/blogArticleList?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.number-of-articles').on('change', function () {
                        var number = this.value;

                        if (isNaN(number) || +number < 0) {
                            number = 1;
                            this.value = number;
                        }

                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-number-of-articles', number);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-blog').on('change', function () {
                        var selectedBlog = this.value;
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-blog', selectedBlog);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-layout').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-layout', this.value);
                        keditor.initDynamicContent(dynamicElement);

                        form.find('.items-per-row-wrapper').css('display', this.value === 'grid' ? 'block' : 'none');
                    });

                    form.find('.items-per-row').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-items-per-row', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=filter]').on('change', function (e) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-filter', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-order').on('change', function (e) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-order-by', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('.select-sort').on('change', function (e) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-sort-by', this.value);
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=categories]').on('click', function (e) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var categories = [];
                        form.find('[name=categories]:checked').each(function (index, item) {
                            categories.push(this.value);
                        });
                        component.attr('data-categories', categories.join(','));
                        keditor.initDynamicContent(dynamicElement);
                    });

                    form.find('[name=tags]').on('click', function (e) {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');
                        var categories = [];
                        form.find('[name=tags]:checked').each(function (index, item) {
                            categories.push(this.value);
                        });
                        component.attr('data-tags', categories.join(','));
                        keditor.initDynamicContent(dynamicElement);
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "blogArticleList" component');

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            form.find('.number-of-articles').val(dataAttributes['data-number-of-articles']);
            form.find('.select-blog').val(dataAttributes['data-blog']);
            form.find('.select-order').val(dataAttributes['data-order-by']);
            form.find('.select-sort').val(dataAttributes['data-sort-by']);
            form.find('.select-layout').val(dataAttributes['data-layout']).trigger('change');
            form.find('.items-per-row').val(dataAttributes['data-items-per-row'] || 3);
            form.find('[name=filter]').val(dataAttributes['data-filter']);
            form.find('[name=categories]').each(function (index, item) {
                if (dataAttributes['data-categories'].indexOf(this.value) !== -1) {
                    this.checked = true;
                }
            });
            form.find('[name=tags]').each(function (index, item) {
                if (dataAttributes['data-tags'].indexOf(this.value) !== -1) {
                    this.checked = true;
                }
            })
        }
    };

})(jQuery);