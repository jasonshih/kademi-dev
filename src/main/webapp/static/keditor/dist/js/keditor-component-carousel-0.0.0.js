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
            
            if (carousel.find('.carousel-img').length === 0) {
                var self = this;
                var images = [];
                
                carousel.addClass('carousel-fixed-height');
                carousel.find('.carousel-inner .item').each(function () {
                    var item = $(this);
                    
                    images.push({
                        src: item.find('img').attr('src'),
                        hash: item.attr('data-hash')
                    });
                });
                
                carousel.attr('data-height', 200).css('height', 200);
                carousel.find('.carousel-inner').html('');
                carousel.find('.carousel-indicators').html('');
                
                $.each(images, function (i, image) {
                    self.addImageToCarousel(component, image.src, image.hash);
                });
            }
            
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
            flog('init "carousel" settings', form);
            
            var self = this;
            return $.ajax({
                url: '/static/keditor/componentCarouselSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    var basePath = window.location.pathname.substr(0, window.location.pathname.lastIndexOf('/') + 1);
                    var carouselAddImage = form.find('.carouselAddImage');
                    var carouselImageWrap = form.find('.carouselImageWrap');
                    
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
                            self.rearrangeItems(keditor.getSettingComponent(), form);
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
                    
                    form.find('.carouselHeight').on('change', function (e) {
                        var value = this.value;
                        
                        if (isNaN(value) || +value < 200) {
                            value = 200;
                            this.value = 200;
                        }
                        
                        var carousel = keditor.getSettingComponent().find('.carousel');
                        carousel.attr('data-height', value);
                        carousel.css('height', value);
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
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            var self = this;
            form.find('.carouselImageWrap').html('');
            component.find('.carousel-inner > .item').each(function (index, item) {
                var url = $(item).find('.carousel-img').css('background-image');
                url = url.replace(/^url\(['"]*(.+)["']*\)$/, '$1');
                var hash = $(item).attr('data-hash');
                self.addImageToList(form, url, hash);
            });
            
            var isWrap = component.find('.carousel').attr('data-wrap');
            var pause = component.find('.carousel').attr('data-pause');
            var interval = component.find('.carousel').attr('data-interval');
            var height = component.find('.carousel').attr('data-height');
            
            form.find('.carouselPause').val(pause);
            form.find('.carouselInterval').val(interval);
            form.find('.carouselWrap').prop('checked', isWrap === 'true');
            form.find('.carouselHeight').val(height);
        },
        
        addImageToCarousel: function (component, url, hash) {
            var carousel = component.find('.carousel');
            var index = carousel.find('.carousel-indicators').children().length;
            var cls = index === 0 ? 'active' : '';
            var backgroundUrl = "background-image: url('" + url + "')";
            carousel.find('.carousel-indicators').append('<li data-target="#' + carousel.attr('id') + '" data-slide-to="' + index + '" class="' + cls + '"></li>');
            
            carousel.find('.carousel-inner').append(
                '<div data-hash="' + hash + '" class="item ' + cls + '">' +
                '   <div class="carousel-img" style="' + backgroundUrl + '"></div>' +
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