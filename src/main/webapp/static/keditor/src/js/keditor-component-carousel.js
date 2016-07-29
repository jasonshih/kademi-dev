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
            if (!componentContent.find('.carousel').length) {
                var id = keditor.generateId('component-carousel');
                var html = '<div id="' + id + '" class="carousel slide" data-ride="carousel" data-wrap="true" data-interval="5000">' +
                    '<ol class="carousel-indicators">' +
                    '   <li data-target="'+id+'" data-slide-to="0" class="active"></li>' +
                    '   <li data-target="'+id+'" data-slide-to="1" class=""></li>' +
                    '</ol>' +
                    '<div class="carousel-inner" role="listbox">' +
                    '   <div data-hash="hash-static-images-ballon-flight-jpg" class="item active">' +
                    '       <img src="/static/images/ballon_flight.jpg" alt="">' +
                    '       <div class="carousel-caption"></div>' +
                    '   </div>' +
                    '   <div data-hash="hash-static-images-beach-house-jpg" class="item">' +
                    '       <img src="/static/images/beach_house.jpg" alt="">' +
                    '       <div class="carousel-caption"></div>' +
                    '   </div>' +
                    '</div>' +
                    '<a class="left carousel-control" href="#' + id + '" role="button" data-slide="prev">' +
                    '   <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>' +
                    '   <span class="sr-only">Previous</span>' +
                    '</a>' +
                    '<a class="right carousel-control" href="#' + id + '" role="button" data-slide="next">' +
                    '   <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>' +
                    '   <span class="sr-only">Next</span>' +
                    '</a>' +
                    '</div>';
                componentContent.html(html);
            }

        },
        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            return componentContent.html();
        },
        settingEnabled: true,

        settingTitle: 'Carousel settings',

        initSettingForm: function (form, keditor) {
            form.append(
                '<style>.carouselImageItem{position: relative; margin-top: 5px; padding: 5px; border: 1px solid #eee8d5} .carouselImageItem a{position: absolute; bottom: 5px; right: 5px;}</style>' +
                '<form class="form-horizontal">' +
                '   <div class="form-group">' +
                '       <div class="col-sm-12">' +
                '           <div class="carouselImageWrap" style="max-height: 250px; overflow-y: auto; overflow-x: hidden;"></div>' +
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
            $(document.body).on('click', '.carouselImageItem a', function(e){
                e.preventDefault();
                var hash = $(this).siblings('[data-hash]').attr('data-hash');
                self.refreshCarousel(keditor.getSettingComponent(), hash);
                $(this).parent().remove();
            });

            form.find('.carouselPause').on('change', function(e){
                e.preventDefault();
                var comp = keditor.getSettingComponent().find('.carousel');
                comp.attr('data-pause', this.value);
            });

            form.find('.carouselInterval').on('change', function(e){
                e.preventDefault();
                var comp = keditor.getSettingComponent().find('.carousel');
                comp.attr('data-interval', this.value);
            });

            form.find('.carouselWrap').on('click', function(e){
                var comp = keditor.getSettingComponent().find('.carousel');
                if (this.checked){
                    comp.attr('data-wrap', 'true');
                } else {
                    comp.attr('data-wrap', 'false');
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            // init
            var self = this;
            form.find('.carouselImageWrap').html('');
            component.find('.carousel-inner > .item').each(function(index, item){
                var url = $(item).find('img').attr('src');
                var hash = $(item).attr('data-hash');
                self.addImageToList(form, url, hash);
            });

            var isWrap = component.find('.carousel').attr('data-wrap');
            var pause = component.find('.carousel').attr('data-pause');
            var interval = component.find('.carousel').attr('data-interval');

            form.find('.carouselPause').val(pause);
            form.find('.carouselInterval').val(interval);
            form.find('.carouselWrap').prop('checked', isWrap==='true');
        },
        addImageToCarousel: function (component, url, hash) {
            var carousel = component.find('.carousel');
            var index = carousel.find('.carousel-indicators').children().length;
            var cls = index === 0 ? 'active' : '';
            carousel.find('.carousel-indicators').append('<li data-target="' + carousel.attr('id') + '" data-slide-to="' + index + '" class="' + cls + '"></li>');

            var html = '<div data-hash="' + hash + '" class="item ' + cls + '">' +
                '<img src="' + url + '" alt="">' +
                '<div class="carousel-caption">' +
                '</div>' +
                '</div>';
            carousel.find('.carousel-inner').append(html);
        },
        addImageToList: function (form, src, hash) {
            var image = $('<img class="img-responsive" />').attr('src', src).attr('data-hash', hash);
            var div = $('<div class="carouselImageItem"></div>');
            div.append(image);
            div.append('<a title="Delete this image" class="btn btn-sm btn-danger" href="#"><i class="fa fa-trash"></i> </a>');
            div.appendTo(form.find('.carouselImageWrap'));
        },
        refreshCarousel: function(component, hash){
            component.find('[data-hash='+hash+']').remove();
            if (!component.find('.carousel-inner .item.active').length){
                component.find('.carousel-inner .item:first-child').addClass('active');
            }
            component.find('.carousel-indicators li:last-child').remove();
        }
    }
})(jQuery);