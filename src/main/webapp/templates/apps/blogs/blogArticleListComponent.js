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

            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <label for="photo-align" class="col-sm-12">Blog</label>' +
                '       <div class="col-sm-12">' +
                '           <select class="form-control select-blog">' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-align" class="col-sm-12">Number of articles</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="number" class="form-control number-articles" />' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            form.find('.number-articles').on('change', function () {
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

            $.ajax({
                url: 'http://localhost:8080/blogs/_DAV/PROPFIND',
                type: 'get',
                dataType: 'JSON',
                data: {
                    fields: 'name'
                },
                success: function (resp) {
                    var blogsOptionsStr = '<option value="">- None -</option>';

                    for (var i = 0; i < resp.length; i++) {
                        var blog = resp[i];
                        flog(blog);
                        if (blog.name !== 'blogs') {
                            blogsOptionsStr += '<option value="' + blog.name + '">' + blog.name + '</option>';
                        }
                    }

                    form.find('.select-blog').html(blogsOptionsStr).on('change', function () {
                        var selectedBlog = this.value;
                        var dynamicElement = keditor.getSettingComponent().find('[data-dynamic-href]');

                        if (selectedBlog) {
                            var contentArea = dynamicElement.closest('.keditor-content-area');

                            dynamicElement.attr('data-blog', selectedBlog);
                            keditor.initDynamicContent(contentArea, dynamicElement);
                        } else {
                            dynamicElement.html('');
                        }
                    });
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "blogArticleList" component');

            var dynamicElement = component.find('[data-dynamic-href]');
            form.find('.number-articles').val(dynamicElement.attr('data-number-of-articles'));
            form.find('.select-blog').val(dynamicElement.attr('data-blog'));
        },

        hideSettingForm: function (form, keditor) {
            // Do nothing
        }
    };

})(jQuery);