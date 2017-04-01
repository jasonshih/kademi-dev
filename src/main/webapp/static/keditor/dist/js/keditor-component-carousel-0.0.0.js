/**!
 * KEditor - Kademi content editor
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 0.0.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap (optional), FontAwesome (optional)
 */
/**
 * Created by Anh on 7/27/2016.
 */
/**
 * KEditor Carousel Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['carousel'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "carousel" component', component);
            var componentContent = component.children('.keditor-component-content');
            var carousel = componentContent.find('.carousel');
            var id = keditor.generateId('component-carousel');
            carousel.attr('id', id);
            carousel.find('.carousel-indicators li').attr('data-target', id);
            carousel.find('.carousel-control').attr('href', '#' + id);
        },
        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },
        settingEnabled: true,

        settingTitle: 'Carousel settings',

        initSettingForm: function (form, keditor) {
            form.append(
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <div class="carouselImageWrap"></div>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-block btn-primary carouselAddImage"><i class="fa fa-plus"></i> Add Image</button>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-responsive" class="col-sm-12">Cycle continuously</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="checkbox" class="carouselWrap" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-align" class="col-sm-12">Pause</label>' +
                '       <div class="col-sm-12">' +
                '           <select class="form-control carouselPause">' +
                '               <option selected value="">No</option>' +
                '               <option value="hover">Hover</option>' +
                '           </select>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label for="photo-height" class="col-sm-12">Interval</label>' +
                '       <div class="col-sm-12">' +
                '           <input type="number" class="form-control carouselInterval" value="5000" />' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );

            var basePath = window.location.pathname.substr(0, window.location.pathname.lastIndexOf('/') + 1);
            var carouselAddImage = form.find('.carouselAddImage');
            var carouselImageWrap = form.find('.carouselImageWrap');
            var self = this;

            carouselAddImage.mselect({
                contentTypes: ['image'],
                bs3Modal: true,
                pagePath: basePath,
                basePath: basePath,
                onSelectFile: function (url, relUrl, type, hash) {
                    flog('keditor carousel selected a file', url, hash);
                    self.addImageToList(form, url, hash);
                    self.addImageToCarousel(keditor.getSettingComponent(), url, hash);
                }
            });

            carouselImageWrap.sortable({
                handle: '.btn-sort-image',
                items: '> .carouselImageItem',
                axis: 'y',
                tolerance: 'pointer',
                sort: function () {
                    $(this).removeClass('ui-state-default');
                },
                update: function () {
                    self.rearrangeItems(keditor.getSettingComponent(),form);
                }
            });

            $(document.body).on('click', '.carouselImageItem a.btn-remove-image', function (e) {
                e.preventDefault();

                if (confirm('Are you sure that you want to delete this image?')) {
                    var btn = $(this);
                    var hash = btn.closest('.btn-group').siblings('[data-hash]').attr('data-hash');

                    self.refreshCarousel(keditor.getSettingComponent(), hash);
                    btn.closest('.carouselImageItem').remove();
                }
            });

            form.find('.carouselPause').on('change', function (e) {
                e.preventDefault();
                var comp = keditor.getSettingComponent().find('.carousel');
                comp.attr('data-pause', this.value);
            });

            form.find('.carouselInterval').on('change', function (e) {
                e.preventDefault();
                var comp = keditor.getSettingComponent().find('.carousel');
                comp.attr('data-interval', this.value);
            });

            form.find('.carouselWrap').on('click', function (e) {
                var comp = keditor.getSettingComponent().find('.carousel');
                if (this.checked) {
                    comp.attr('data-wrap', 'true');
                } else {
                    comp.attr('data-wrap', 'false');
                }
            });
        },

        showSettingForm: function (form, component, keditor) {
            var self = this;
            form.find('.carouselImageWrap').html('');
            component.find('.carousel-inner > .item').each(function (index, item) {
                var url = $(item).find('img').attr('src');
                var hash = $(item).attr('data-hash');
                self.addImageToList(form, url, hash);
            });

            var isWrap = component.find('.carousel').attr('data-wrap');
            var pause = component.find('.carousel').attr('data-pause');
            var interval = component.find('.carousel').attr('data-interval');

            form.find('.carouselPause').val(pause);
            form.find('.carouselInterval').val(interval);
            form.find('.carouselWrap').prop('checked', isWrap === 'true');
        },

        addImageToCarousel: function (component, url, hash) {
            var carousel = component.find('.carousel');
            var index = carousel.find('.carousel-indicators').children().length;
            var cls = index === 0 ? 'active' : '';
            carousel.find('.carousel-indicators').append('<li data-target="' + carousel.attr('id') + '" data-slide-to="' + index + '" class="' + cls + '"></li>');

            carousel.find('.carousel-inner').append(
                '<div data-hash="' + hash + '" class="item ' + cls + '">' +
                '   <img src="' + url + '" alt="" width="100%" height="" />' +
                '   <div class="carousel-caption"></div>' +
                '</div>'
            );
        },

        addImageToList: function (form, src, hash) {
            form.find('.carouselImageWrap').append(
                '<div class="carouselImageItem">' +
                '   <img class="img-responsive" src="' + src + '" data-hash="' + hash + '" />' +
                '   <div class="btn-group btn-group-sm">' +
                '       <a class="btn btn-info btn-sort-image" href="#"><i class="fa fa-sort"></i></a>' +
                '       <a title="Delete this image" class="btn btn-danger btn-remove-image" href="#"><i class="fa fa-trash"></i></a>' +
                '   </div>' +
                '</div>'
            );
        },

        refreshCarousel: function (component, hash) {
            component.find('[data-hash=' + hash + ']').remove();
            if (!component.find('.carousel-inner .item.active').length) {
                component.find('.carousel-inner .item:first-child').addClass('active');
            }
            component.find('.carousel-indicators li:last-child').remove();
        },

        rearrangeItems: function (component, form) {
            var self = this;
            var carousel = component.find('.carousel');
            carousel.find('.carousel-inner').html('');
            carousel.find('.carousel-indicators').html('');

            form.find('.carouselImageWrap').find('.carouselImageItem').each(function () {
                var carouselImageItem = $(this);
                var img = carouselImageItem.find('img');

                self.addImageToCarousel(component, img.attr('src'), img.attr('data-hash'));
            });
        }
    }

})(jQuery);