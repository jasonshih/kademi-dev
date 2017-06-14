/**!
 * KEditor - Kademi content editor
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 0.0.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap (optional), FontAwesome (optional)
 */
/**
 * KEditor Jumbotron Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['accordion'] = {
        settingEnabled: false,

        init: function (contentArea, container, component, keditor) {
            var options = keditor.options;
            var id = keditor.generateId('accordion');
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.accordionWrap .panel-group').attr('id', id);
            componentContent.find('.accordionWrap a[data-toggle]').attr('data-parent', '#' + id);


            var panels = componentContent.find('.panel');
            panels.each(function (index, item) {
                var p = $(item);
                var itemId = keditor.generateId('heading' + index);
                var panelCollapseId = keditor.generateId('collapse' + index);
                p.find('.panel-heading').attr('id', itemId);
                p.find('.panel-collapse').attr('aria-labelledby', itemId).attr('id', panelCollapseId);
                var title = p.find('a[data-toggle]').html();
                if (title.indexOf('<div>') === -1) {
                    p.find('a[data-toggle]').attr('href', '#' + panelCollapseId).html('<div>' + title + '</div>');
                }
            });

            componentContent.find('.accordionWrap .panel-collapse').collapse('show');
            componentContent.find('.panel-footer, .btnAddAccordionItem').removeClass('hide');
            componentContent.find('.panel-title a div').prop('contenteditable', true);
            componentContent.find('.panel-collapse .panel-body').prop('contenteditable', true);

            componentContent.find('.panel-title a div, .panel-collapse .panel-body').on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(contentArea, e, component);
                }

                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(contentArea, e, container);
                }

                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(contentArea, e);
                }
            });

            var editor = componentContent.find('.panel-title a div, .panel-collapse .panel-body').ckeditor(options.ckeditorOptions).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);

                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });

            $(document).off('click', '.btnDeleteAccordionItem').on('click', '.btnDeleteAccordionItem', function (e) {
                e.preventDefault();

                if (confirm('Are you sure you want to delete this item?')) {
                    var panelsCount = componentContent.find('.panel').length;
                    if (panelsCount > 1) {
                        $(this).parents('.panel').remove();
                    } else {
                        Msg.error('You cant delete the last item');
                    }
                }
            });

            $(document).off('click', '.btnAddAccordionItem').on('click', '.btnAddAccordionItem', function (e) {
                e.preventDefault();
                var clone = componentContent.find('.panel').first().clone();
                var itemId = keditor.generateId('heading');
                var panelCollapseId = keditor.generateId('collapse');
                clone.find('.panel-heading').attr('id', itemId);
                clone.find('.panel-collapse').attr('aria-labelledby', itemId).attr('id', panelCollapseId);
                clone.find('a[data-toggle]').attr('href', '#' + panelCollapseId);
                componentContent.find('.accordionWrap .panel-group').append(clone);
                var editor = clone.find('.panel-title a div, .panel-collapse .panel-body').ckeditor(options.ckeditorOptions).editor;
                editor.on('instanceReady', function () {
                    flog('CKEditor is ready', component);

                    if (typeof options.onComponentReady === 'function') {
                        options.onComponentReady.call(contentArea, component, editor);
                    }
                });
            });
        },

        getContent: function (component, keditor) {
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.panel-title a div').each(function () {
                var h = $(this).html();
                $(this).parent('a').html(h);
            });
            componentContent.find('.panel-collapse .panel-body').each(function () {
                var h = $(this).html();
                $(this).replaceWith('<div class="panel-body">' + h + '</div>');
            });
            componentContent.find('.panel-footer, .btnAddAccordionItem').addClass('hide');
            return componentContent.html();
        },

        destroy: function (component, keditor) {
            flog('destroy "text" component', component);

            var id = component.find('.keditor-component-content').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        }
    };
})(jQuery);


/**
 * KEditor Audio Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['audio'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "audio" component', component);
            
            this.component = component;
            var img = component.find('img[data-src]');
            var componentId = '';
            if (!img.attr('id')) {
                componentId = keditor.generateId('component-audio');
                img.attr('id', componentId);
            } else {
                componentId = img.attr('id');
            }
            if (!img.parent().hasClass('audio-wrapper')) {
                img.wrap('<div class="audio-wrapper"></div>');
            }
            this.src = img.attr('data-src');
            this.width = img.attr('data-width');
            this.autostart = img.attr('data-autostart') === 'true';
            var instance = this;
            $.getScriptOnce('/static/jwplayer/6.10/jwplayer.js', function () {
                jwplayer.key = 'cXefLoB9RQlBo/XvVncatU90OaeJMXMOY/lamKrzOi0=';
                instance.buildJWAudioPlayerPreview(componentId);
            });
            
        },
        
        getContent: function (component, keditor) {
            flog('getContent "audio" component', component);
            
            var img = component.find('img[data-src]');
            var componentId = img.attr('id');
            
            var html = '<img data-componentId="' + componentId + '" src="/theme/apps/content/preview/audio.png" data-autostart="' + this.autostart + '" data-width="' + this.width + '" data-src="' + this.src + '" data-kaudio="' + this.src + '" />';
            return html;
        },
        
        settingEnabled: true,
        
        settingTitle: 'Audio settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "audio" settings', form);
            
            return $.ajax({
                url: '/static/keditor/componentAudioSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "audio" component', form, component);
            
            var instance = this;
            var btnAudioFileInput = form.find('.btn-audioFileInput');
            btnAudioFileInput.mselect({
                contentTypes: ['audio'],
                bs3Modal: true,
                pagePath: window.location.pathname.replace('contenteditor', ''),
                onSelectFile: function (url) {
                    instance.src = url;
                    instance.refreshAudioPlayerPreview();
                }
            });
            
            var img = component.find('img[data-src]');
            var componentId = img.attr('id');
            
            var autoplayToggle = form.find('#audio-autoplay');
            if (this.autostart) {
                autoplayToggle.prop('checked', true);
            }
            autoplayToggle.on('click', function (e) {
                instance.autostart = this.checked;
                instance.buildJWAudioPlayerPreview(componentId);
            });
            
            var audioWidth = form.find('#audio-width');
            audioWidth.val(this.width);
            audioWidth.on('change', function () {
                instance.width = this.value;
                instance.resizeAudioPlayerPreview();
            });
        },
        
        buildJWAudioPlayerPreview: function (componentId) {
            var width = this.width;
            var src = this.src;
            var autostart = this.autostart;
            var playerInstance = jwplayer(componentId);
            playerInstance.setup({
                file: src,
                width: width,
                height: 30,
                autostart: autostart,
                flashplayer: "/static/jwplayer/6.10/jwplayer.flash.swf",
                html5player: "/static/jwplayer/6.10/jwplayer.html5.js",
                primary: "flash"
            });
            playerInstance.onReady(function () {
                log('jwplayer preview init done');
            });
        },
        
        refreshAudioPlayerPreview: function () {
            var instance = this;
            var playerInstance = jwplayer(instance.componentId);
            var src = instance.src;
            playerInstance.load([{
                file: src
            }]);
            playerInstance.play();
        },
        
        resizeAudioPlayerPreview: function () {
            var instance = this;
            var playerInstance = jwplayer(instance.componentId);
            var width = instance.width;
            
            playerInstance.resize(width, 30);
        }
    };
    
})(jQuery);

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
            
            return $.ajax({
                url: '/static/keditor/componentCarouselSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
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
                url = url.replace(/^url\('*(.+)'*\)$/, '$1');
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
/**
 * KEditor Google Map Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['googlemap'] = {
        init: function (contentArea, container, component, keditor) {
            var script = component.find('script');
            if (script.length) {
                script.remove();
            }
            component.removeAttr('data-firstLoad');
            var place = component.attr('data-place');
            var maptype = component.attr('data-maptype');
            if (place && maptype === 'manually') {
                $(window).on('load', function () {
                    component.find('.btn-component-setting').trigger('click');
                });
            }
        },
        getContent: function (component, keditor) {
            flog('getContent "googlemap" component', component);
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.googlemap-cover').remove();
            var place = component.attr('data-place');
            var maptype = component.attr('data-maptype');
            component.find('.kgooglemap').html('');
            var script = '<script>$(function(){if(!$(document.body).hasClass("content-editor-page")){var apiKey="AIzaSyBUcuZxwpBXCPztG7ot-rITXJbycPuS7gs";var s=document.createElement("script");s.type="text/javascript";s.async=true;s.defer=true;s.src="https://maps.googleapis.com/maps/api/js?key="+apiKey+"&callback=kgooglemapInit&libraries=places";$("head").append(s);window.kgooglemapInit=function(){var mapdiv=$(".kgooglemap").not(".hide");mapdiv.each(function(){var parent=$(this).parents("[data-type=component-googlemap]");if(parent.attr("data-maptype")!=="manually")return;var map=new google.maps.Map(this,{zoom:13,mapTypeId:"roadmap"});var place=parent.attr("data-place");var input=parent.find("input")[0];input.value=place;var searchBox=new google.maps.places.SearchBox(input);map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);setTimeout(function(){google.maps.event.trigger(input,"focus");google.maps.event.trigger(input,"keydown",{keyCode:13});},500);map.addListener("bounds_changed",function(){searchBox.setBounds(map.getBounds());});var markers=[];searchBox.addListener("places_changed",function(){var places=searchBox.getPlaces();if(places.length==0){return;}markers.forEach(function(marker){marker.setMap(null);});markers=[];var bounds=new google.maps.LatLngBounds();places.forEach(function(place){if(!place.geometry){console.log("Returned place contains no geometry");return;}var icon={url:place.icon,size:new google.maps.Size(71,71),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(17,34),scaledSize:new google.maps.Size(25,25)};markers.push(new google.maps.Marker({map:map,icon:icon,title:place.name,position:place.geometry.location}));if(place.geometry.viewport){bounds.union(place.geometry.viewport);}else{bounds.extend(place.geometry.location);}});map.fitBounds(bounds);});})}}});</script>';
            component.find('.embed-responsive').append(script);
            return componentContent.html();
        },
        
        settingEnabled: true,
        
        settingTitle: 'Google Map Settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "googlemap" settings', form);
            
            return $.ajax({
                url: '/static/keditor/componentGoogleMapSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    var apiKey = 'AIzaSyBUcuZxwpBXCPztG7ot-rITXJbycPuS7gs';
                    var mapjs = '<script src="https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&callback=initKeditorMapSetting&libraries=places" async defer></script>';
                    if (window.google && window.google.maps && google.maps.places) {
                        mapjs = '';
                    }
                    
                    form.append(
                        mapjs + resp
                    );
                    
                    form.find('.mapType').on('click', function (e) {
                        if (this.checked) {
                            $('.' + this.value).removeClass('hide');
                            var cls = form.find('.mapType').not(this).val();
                            $('.' + cls).addClass('hide');
                            var comp = keditor.getSettingComponent();
                            comp.attr('data-maptype', this.value);
                            if (this.value === 'manually') {
                                comp.find('iframe').addClass('hide');
                                comp.find('.kgooglemap').removeClass('hide');
                                if (comp.find('.kgooglemap').data('map')) {
                                    google.maps.event.trigger(comp.find('.kgooglemap').data('map'), "resize");
                                } else {
                                    self.initAutocomplete(comp, form);
                                    var input = form.find('[name=mapAddress]')[0];
                                    var i = setInterval(function () {
                                        if (comp.find('.kgooglemap').data('map')) {
                                            clearInterval(i);
                                            google.maps.event.trigger(input, 'focus')
                                            google.maps.event.trigger(input, 'keydown', {
                                                keyCode: 13
                                            });
                                        }
                                    }, 100);
                                }
                            } else {
                                comp.find('iframe').removeClass('hide');
                                comp.find('.kgooglemap').addClass('hide');
                            }
                        }
                    });
                    
                    var self = this;
                    form.find('[name=mapEmbedCode]').on('change', function () {
                        var iframe = $(this.value);
                        var src = iframe.attr('src');
                        if (iframe.length > 0 && src && src.length > 0) {
                            keditor.getSettingComponent().find('.embed-responsive-item').attr('src', src);
                        } else {
                            alert('Your Google Map embed code is invalid!');
                        }
                    });
                    
                    var btn169 = form.find('.btn-googlemap-169');
                    var btn43 = form.find('.btn-googlemap-43');
                    
                    btn169.on('click', function (e) {
                        e.preventDefault();
                        $(this).addClass('btn-primary').removeClass('btn-default');
                        btn43.removeClass('btn-primary').addClass('btn-default');
                        keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-4by3').addClass('embed-responsive-16by9');
                        var comp = keditor.getSettingComponent();
                        if (comp.attr('maptype') === 'manually') {
                            if (comp.find('.kgooglemap').data('map')) {
                                google.maps.event.trigger(comp.find('.kgooglemap').data('map'), "resize");
                            }
                        }
                    });
                    
                    btn43.on('click', function (e) {
                        e.preventDefault();
                        $(this).addClass('btn-primary').removeClass('btn-default');
                        btn169.removeClass('btn-primary').addClass('btn-default');
                        keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-16by9').addClass('embed-responsive-4by3');
                        var comp = keditor.getSettingComponent();
                        if (comp.attr('maptype') === 'manually') {
                            if (comp.find('.kgooglemap').data('map')) {
                                google.maps.event.trigger(comp.find('.kgooglemap').data('map'), "resize");
                            }
                        }
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            var self = this;
            var maptype = component.attr('data-maptype');
            var place = component.attr('data-place');
            var ratio169 = component.find('.embed-responsive').hasClass('embed-responsive-16by9');
            var ratio43 = component.find('.embed-responsive').hasClass('embed-responsive-4by3');
            if (ratio43) {
                form.find('.btn-googlemap-43').addClass('btn-primary').removeClass('btn-default');
            }
            if (ratio169) {
                form.find('.btn-googlemap-169').addClass('btn-primary').removeClass('btn-default');
            }
            form.find('.mapType[value=' + maptype + ']').prop('checked', true);
            var src = component.find('iframe').attr('src');
            var iframe = '<iframe class="embed-responsive-item" src="' + src + '"></iframe>';
            if (!place) {
                place = 'Hanoi, Vietnam';
            }
            form.find('[name=mapAddress]').val(place);
            form.find('[name=mapEmbedCode]').val(iframe);
            var firstLoad = component.attr('data-firstLoad');
            if (maptype === 'manually') {
                form.find('.manually').removeClass('hide').siblings('.embed').addClass('hide');
                
                if (!firstLoad && place) {
                    var i = setInterval(function () {
                        if (window.googleMapInitialized) {
                            clearInterval(i);
                            self.initAutocomplete(component, form);
                            setTimeout(function () {
                                var input = form.find('[name=mapAddress]')[0];
                                google.maps.event.trigger(input, 'focus')
                                google.maps.event.trigger(input, 'keydown', {
                                    keyCode: 13
                                });
                                component.attr('data-firstLoad', 'false');
                            }, 1000);
                        }
                    }, 100);
                }
            } else {
                form.find('.manually').addClass('hide').siblings('.embed').removeClass('hide');
            }
        },
        
        initAutocomplete: function (component, form) {
            if (!window.googleMapInitialized) {
                alert('google map is not initialized');
                return;
            }
            var mapdiv = component.find('.kgooglemap')[0];
            var map = new google.maps.Map(mapdiv, {
                zoom: 13,
                mapTypeId: 'roadmap'
            });
            // Create the search box and link it to the UI element.
            var input = form.find('[name=mapAddress]')[0];
            var searchBox = new google.maps.places.SearchBox(input);
            //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
            
            // Bias the SearchBox results towards current map's viewport.
            map.addListener('bounds_changed', function () {
                searchBox.setBounds(map.getBounds());
            });
            
            var markers = [];
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            
            searchBox.addListener('places_changed', function () {
                var places = searchBox.getPlaces();
                
                if (places.length == 0) {
                    return;
                }
                
                // Clear out the old markers.
                markers.forEach(function (marker) {
                    marker.setMap(null);
                });
                markers = [];
                // For each place, get the icon, name and location.
                var bounds = new google.maps.LatLngBounds();
                places.forEach(function (place) {
                    if (!place.geometry) {
                        console.log("Returned place contains no geometry");
                        return;
                    }
                    
                    var icon = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };
                    
                    // Create a marker for each place.
                    markers.push(new google.maps.Marker({
                        map: map,
                        icon: icon,
                        title: place.name,
                        position: place.geometry.location
                    }));
                    
                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                map.fitBounds(bounds);
                component.attr('data-place', input.value);
            });
            
            component.find('.kgooglemap').data('map', map);
        }
    };
    
    window.initKeditorMapSetting = function () {
        window.googleMapInitialized = true;
    }
})(jQuery);

/**
 * KEditor Jumbotron Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var contentEditor = $.contentEditor;
    var flog = KEditor.log;
    
    KEditor.components['jumbotron'] = {
        settingEnabled: true,
        
        settingTitle: 'Jumbotron Settings',
        init: function (contentArea, container, component, keditor) {
            var self = this;
            var options = keditor.options;
            
            var componentContent = component.children('.keditor-component-content');
            componentContent.prop('contenteditable', true);
            
            componentContent.on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(contentArea, e, component);
                }
                
                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(contentArea, e, container);
                }
                
                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(contentArea, e);
                }
            });
            
            var editor = componentContent.ckeditor(options.ckeditorOptions).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);
                
                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });
        },
        
        getContent: function (component, keditor) {
            flog('getContent "jumbotron" component', component);
            
            var componentContent = component.find('.keditor-component-content');
            var id = componentContent.attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                return editor.getData();
            } else {
                return componentContent.html();
            }
        },
        
        initSettingForm: function (form, keditor) {
            flog('init "jumbotron" settings', form);
            
            return $.ajax({
                url: '/static/keditor/componentJumbotronSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    form.find('.chk-inverse').on('click', function () {
                        var comp = keditor.getSettingComponent();
                        comp.find('.jumbotron')[this.checked ? 'addClass' : 'removeClass']('jumbotron-inverse');
                    });
                    
                    form.find('[name=rounded]').on('click', function (e) {
                        var comp = keditor.getSettingComponent();
                        if (this.value == 'false') {
                            comp.find('.jumbotron').css('border-radius', '0');
                        } else {
                            comp.find('.jumbotron').css('border-radius', '');
                        }
                    });
                    
                    var buttonColorPicker = form.find('.button-color-picker');
                    contentEditor.initSimpleColorPicker(buttonColorPicker, function (color) {
                        var comp = keditor.getSettingComponent();
                        comp.find('.jumbotron').css('background-color', color);
                        comp.attr('data-bgcolor', color);
                    });
                    
                    var paddingSettings = form.find('.paddingSettings');
                    paddingSettings.on('change', function () {
                        var paddingValue = this.value || '';
                        var component = keditor.getSettingComponent();
                        var paddingProp = $(this).attr('name');
                        if (paddingValue.trim() === '') {
                            component.find('.jumbotron').css(paddingProp, '');
                        } else {
                            if (isNaN(paddingValue)) {
                                paddingValue = 0;
                                this.value = paddingValue;
                            }
                            component.find('.jumbotron').css(paddingProp, paddingValue + 'px');
                        }
                    });
                    
                    var marginSettings = form.find('.marginSettings');
                    marginSettings.on('change', function () {
                        var paddingValue = this.value || '';
                        var component = keditor.getSettingComponent();
                        var paddingProp = $(this).attr('name');
                        if (paddingValue.trim() === '') {
                            component.find('.jumbotron').css(paddingProp, '');
                        } else {
                            if (isNaN(paddingValue)) {
                                paddingValue = 0;
                                this.value = paddingValue;
                            }
                            component.find('.jumbotron').css(paddingProp, paddingValue + 'px');
                        }
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "jumbotron" component', component);
            form.find('[name=button-color]').val(component.attr('data-bgcolor')).trigger('update');
            form.find('.paddingSettings').each(function () {
                $(this).val(component.find('.jumbotron').css($(this).attr('name')).replace('px', ''));
            });
            form.find('.marginSettings').each(function () {
                $(this).val(component.find('.jumbotron').css($(this).attr('name')).replace('px', ''));
            });
            form.find('[name=showButton][value=false]').prop('checked', component.find('a').hasClass('hide'));
            form.find('[name=rounded][value=false]').prop('checked', component.find('.jumbotron').css('border-radius').replace('px', '') === '0');
            form.find('.chk-inverse').prop('checked', component.find('.jumbotron').hasClass('jumbotron-inverse'));
        },
        
        destroy: function (component, keditor) {
            flog('destroy "text" component', component);
            
            var id = component.find('.keditor-component-content').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        }
    };
    
})(jQuery);


/**
 * KEditor SVG Map Component (Australia)
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['ksvgmap'] = {
        init: function (contentArea, container, component, keditor) {
            var script = component.find('script');
            if (script.length) {
                script.remove();
            }
            if (component.attr('data-height')) {
                component.find('.ksvgmap').css('height', +component.attr('data-height'));
            }
            $.getScriptOnce('/static/jquery-jvectormap/jquery-jvectormap-2.0.3.min.js', function () {
                $.getScriptOnce('/static/jquery-jvectormap/jquery-jvectormap-au-mill.js', function () {
                    component.find('.ksvgmap').vectorMap({
                        map: 'au_mill',
                        backgroundColor: '#fff',
                        zoomButtons: false,
                        focusOn: {
                            x: 0.5,
                            y: 0.5,
                            scale: 1
                        },
                        regionStyle: {
                            initial: {
                                fill: '#efefef'
                            },
                            hover: {
                                fill: "#00aa90"
                            }
                        },
                        onRegionTipShow: function (e, el, code) {
                            if (component.attr('data-' + code))
                                el.html(el.html() + ' - ' + component.attr('data-' + code));
                        }
                    });
                    var i = setInterval(function () {
                        try {
                            var map = component.find('.ksvgmap').vectorMap('get', 'mapObject');
                            map.updateSize();
                            clearInterval(i);
                        } catch (e) {
                            flog('trying to get jvectormap object');
                        }
                    }, 50);
                });
            });
        },
        getContent: function (component, keditor) {
            flog('getContent "svgmap" component', component);
            var componentContent = component.children('.keditor-component-content');
            var script = '<script>$(function(){$(document.body).hasClass("content-editor-page")||$.getScriptOnce("/static/jquery-jvectormap/jquery-jvectormap-2.0.3.min.js",function(){$.getScriptOnce("/static/jquery-jvectormap/jquery-jvectormap-au-mill.js",function(){$(".ksvgmap").each(function(){var a=$(this).parents("[data-type=component-ksvgmap]");a.hasClass("ksvgInit")||(a.addClass("ksvgInit"),$(this).vectorMap({map:"au_mill",backgroundColor:"#fff",zoomButtons:!1,scale:5,regionStyle:{initial:{fill:"#efefef"},hover:{fill:"#00aa90"}},onRegionTipShow:function(b,c,d){a.attr("data-"+d)&&c.html("<span class=\'vectormap-tip-region-name\'>"+c.html()+"</span><span class=\'vectormap-tip-separator\'> - </span><span class=\'vectormap-tip-region-data\'>"+a.attr("data-"+d)+"</span>")}}))})})})});</script>';
            var css = '<link rel="stylesheet" href="/static/jquery-jvectormap/jquery-jvectormap-2.0.3.css">';
            component.find('.jvectormap-container').remove();
            var arr = $(document.body).find('[data-type="component-ksvgmap"]:not(.keditor-snippet)');
            if (arr.length > 0) {
                if ($(arr[arr.length - 1]).attr('id') === component.attr('id')) {
                    $(css).insertBefore(component.find('.ksvgmap'));
                    $(script).insertAfter(component.find('.ksvgmap'));
                }
            }
            
            return componentContent.html();
        },
        
        settingEnabled: true,
        
        settingTitle: 'SVGMap Settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "svgmap" settings', form);
            
            return $.ajax({
                url: '/static/keditor/componentKsvgMapSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    var component = keditor.getSettingComponent();
                    form.find('.state').on('change', function (e) {
                        var val = component.attr('data-' + this.value);
                        form.find('.stateMessage').val(val);
                    });
                    form.find('.stateMessage').on('change', function (e) {
                        var currentState = form.find('.state').val();
                        component.attr('data-' + currentState, this.value);
                    });
                    form.find('.height').on('change', function (e) {
                        component.attr('data-height', this.value);
                        component.find('.ksvgmap').css('height', this.value);
                        var map = component.find('.ksvgmap').vectorMap('get', 'mapObject');
                        map.updateSize();
                    });
                }
            });
        },
        showSettingForm: function (form, component, keditor) {
            var height = component.attr('data-height');
            var defaultState = form.find('.state').val();
            form.find('.height').val(height);
            form.find('.stateMessage').val(component.attr('data-' + defaultState));
        }
    };
})(jQuery);

/**
 * KEditor Photo Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['photo'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "photo" component', component);
            
            var componentContent = component.children('.keditor-component-content');
            var img = componentContent.find('img');
            
            img.css('display', 'inline-block');
            if (!img.css('vertical-align')) {
                img.css('vertical-align', 'middle');
            }
            
            var options = keditor.options;
            if (typeof options.onComponentReady === 'function') {
                options.onComponentReady.call(contentArea, component);
            }
        },
        
        settingEnabled: true,
        
        settingTitle: 'Photo Settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "photo" settings', form);
            
            var self = this;
            var options = keditor.options;
            
            return $.ajax({
                url: '/static/keditor/componentPhotoSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    var txtLink = form.find('#photo-link');
                    txtLink.on('change', function () {
                        var link = this.value.trim();
                        var pattern = new RegExp('^[a-zA-Z0-9_/%:/./-]+$');
                        var span = txtLink.next();
                        var formGroup = txtLink.closest('.form-group');
                        
                        if (pattern.test(link)) {
                            keditor.getSettingComponent().find('a').attr('href', link);
                            span.hide();
                            formGroup.removeClass('has-error');
                        } else {
                            span.show();
                            formGroup.addClass('has-error');
                        }
                    });
                    
                    var cbbTarget = form.find('#photo-target');
                    cbbTarget.on('change', function () {
                        keditor.getSettingComponent().find('a').attr('target', this.value);
                    });
                    
                    var chkLinkable = form.find('#photo-linkable');
                    chkLinkable.on('click', function () {
                        var img = keditor.getSettingComponent().find('img');
                        
                        if (chkLinkable.is(':checked')) {
                            txtLink.prop('disabled', false);
                            cbbTarget.prop('disabled', false);
                            img.wrap('<a href=""></a>');
                        } else {
                            txtLink.prop('disabled', true);
                            cbbTarget.prop('disabled', true);
                            img.unwrap('a');
                        }
                    });
                    
                    var photoEdit = form.find('#photo-edit');
                    photoEdit.mselect({
                        contentTypes: ['image'],
                        bs3Modal: true,
                        pagePath: options.pagePath,
                        basePath: options.basePath,
                        onSelectFile: function (url, relativeUrl, fileType, hash) {
                            var img = keditor.getSettingComponent().find('img');
                            img.attr('src', "/_hashes/files/" + hash);
                            self.showSettingForm(form, keditor.getSettingComponent(), options);
                        }
                    });
                    
                    var inputAlign = form.find('#photo-align');
                    inputAlign.on('change', function () {
                        var panel = keditor.getSettingComponent().find('.photo-panel');
                        panel.css('text-align', this.value);
                    });
                    
                    var inputVAlign = form.find('#v-align');
                    inputVAlign.on('change', function () {
                        var panel = keditor.getSettingComponent().find('.photo-panel').find('img');
                        panel.css('vertical-align', this.value);
                    });
                    
                    var inputResponsive = form.find('#photo-responsive');
                    inputResponsive.on('click', function () {
                        keditor.getSettingComponent().find('img')[this.checked ? 'addClass' : 'removeClass']('img-responsive');
                    });
                    
                    var cbbStyle = form.find('#photo-style');
                    cbbStyle.on('change', function () {
                        var img = keditor.getSettingComponent().find('img');
                        var val = this.value;
                        
                        img.removeClass('img-rounded img-circle img-thumbnail');
                        if (val) {
                            img.addClass(val);
                        }
                    });
                    
                    var inputWidth = form.find('#photo-width');
                    var inputHeight = form.find('#photo-height');
                    inputWidth.on('change', function () {
                        var img = keditor.getSettingComponent().find('img');
                        var newWidth = +this.value;
                        var newHeight = Math.round(newWidth / self.ratio);
                        
                        if (newWidth <= 0) {
                            newWidth = self.width;
                            newHeight = self.height;
                            this.value = newWidth;
                        }
                        
                        img.css({
                            'width': newWidth,
                            'height': newHeight
                        });
                        inputHeight.val(newHeight);
                    });
                    inputHeight.on('change', function () {
                        var img = keditor.getSettingComponent().find('img');
                        var newHeight = +this.value;
                        var newWidth = Math.round(newHeight * self.ratio);
                        
                        if (newHeight <= 0) {
                            newWidth = self.width;
                            newHeight = self.height;
                            this.value = newHeight;
                        }
                        
                        img.css({
                            'height': newHeight,
                            'width': newWidth
                        });
                        inputWidth.val(newWidth);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "photo" component', component);
            
            var self = this;
            var inputAlign = form.find('#photo-align');
            var inputVAlign = form.find('#v-align');
            var inputResponsive = form.find('#photo-responsive');
            var inputWidth = form.find('#photo-width');
            var inputHeight = form.find('#photo-height');
            var cbbStyle = form.find('#photo-style');
            var txtLink = form.find('#photo-link');
            var cbbTarget = form.find('#photo-target');
            var chkLinkable = form.find('#photo-linkable');
            
            txtLink.next().hide();
            txtLink.closest('.form-group').removeClass('has-error');
            
            var panel = component.find('.photo-panel');
            var img = panel.find('img');
            
            var a = img.parent('a');
            if (a.length > 0) {
                chkLinkable.prop('checked', true);
                txtLink.prop('disabled', false).val(a.attr('href'));
                cbbTarget.prop('disabled', false).val(a.attr('target'));
            } else {
                chkLinkable.prop('checked', false);
                txtLink.prop('disabled', true).val('');
                cbbTarget.prop('disabled', true).val('');
            }
            
            var algin = panel.css('text-align');
            if (algin !== 'right' || algin !== 'center') {
                algin = 'left';
            }
            
            var valign = img.css('vertical-align');
            
            if (img.hasClass('img-rounded')) {
                cbbStyle.val('img-rounded');
            } else if (img.hasClass('img-circle')) {
                cbbStyle.val('img-circle');
            } else if (img.hasClass('img-thumbnail')) {
                cbbStyle.val('img-thumbnail');
            } else {
                cbbStyle.val('');
            }
            inputAlign.val(algin);
            inputVAlign.val(valign);
            inputResponsive.prop('checked', img.hasClass('img-responsive'));
            inputWidth.val(img.width());
            inputHeight.val(img.height());
            
            $('<img />').attr('src', img.attr('src')).load(function () {
                self.ratio = this.width / this.height;
                self.width = this.width;
                self.height = this.height;
            });
        }
    };
    
})(jQuery);

/**
 * KEditor Text Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var contentEditor = $.contentEditor;
    var flog = KEditor.log;
    
    CKEDITOR.disableAutoInline = true;
    CKEDITOR.dtd.$removeEmpty['i'] = false;
    
    // Text component
    // ---------------------------------------------------------------------
    KEditor.components['text'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "text" component', component);
            
            var options = keditor.options;
            
            var componentContent = component.find('.keditor-component-content');
            var ckeditorPlace = componentContent.find('.keditor-component-text-content-inner');
            
            if (ckeditorPlace.length === 0) {
                var contentHtml = componentContent.html();
                ckeditorPlace = $('<div class="keditor-component-text-content-inner clearfix"></div>');
                componentContent.html(ckeditorPlace);
                ckeditorPlace.html(contentHtml);
                ckeditorPlace.wrap('<div class="keditor-component-text-content"></div>');
            }
            
            if (!ckeditorPlace.attr('id')) {
                ckeditorPlace.attr('id', keditor.generateId('component-text-content-inner'));
            }
            
            ckeditorPlace.prop('contenteditable', true);
            ckeditorPlace.on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(contentArea, e, component);
                }
                
                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(contentArea, e, container);
                }
                
                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(contentArea, e);
                }
            });
            
            var editor = ckeditorPlace.ckeditor(options.ckeditorOptions).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);
                
                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });
        },
        
        getContent: function (component, keditor) {
            flog('getContent "text" component', component);
            
            var componentContent = component.find('.keditor-component-content');
            var componentTextContent = componentContent.find('.keditor-component-text-content');
            
            var id = componentTextContent.children().attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                componentTextContent.html('<div class="keditor-component-text-content-inner clearfix">' + editor.getData() + '</div>');
            }
            
            return componentContent.html();
        },
        
        destroy: function (component, keditor) {
            flog('destroy "text" component', component);
            
            var id = component.find('.keditor-component-content').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        },
        
        settingEnabled: true,
        
        settingTitle: 'Text Settings',
        
        initSettingForm: function (form, keditor) {
            flog('initSettingForm "text" component');
            
            return $.ajax({
                url: '/static/keditor/componentTextSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    // =================================================================================
                    // Backgrounds
                    // =================================================================================
                    var basePath = window.location.pathname.replace('contenteditor', '');
                    if (keditor.options.basePath) {
                        basePath = keditor.options.basePath;
                    }
                    form.find('.background-image-edit').mselect({
                        contentTypes: ['image'],
                        bs3Modal: true,
                        pagePath: basePath,
                        basePath: basePath,
                        onSelectFile: function (url, relativeUrl, fileType, hash) {
                            var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                            var imageUrl = 'http://' + window.location.host + '/_hashes/files/' + hash;
                            target.css('background-image', 'url("' + imageUrl + '")');
                            form.find('.background-image-previewer').attr('src', imageUrl);
                        }
                    });
                    form.find('.background-image-delete').on('click', function (e) {
                        e.preventDefault();
                        
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('background-image', '');
                        form.find('.background-image-previewer').attr('src', '/static/images/photo_holder.png');
                    });
                    
                    var colorPicker = form.find('.txt-bg-color');
                    contentEditor.initSimpleColorPicker(colorPicker, function (color) {
                        target.css('background-color', color);
                    });
                    
                    form.find('.select-bg-repeat').on('change', function () {
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        
                        target.css('background-repeat', this.value);
                    });
                    
                    form.find('.select-bg-size').on('change', function () {
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        
                        target.css('background-size', this.value);
                    });
                    
                    form.find('.select-bg-position').on('change', function () {
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        
                        target.css('background-position', this.value);
                    });
                    
                    // =================================================================================
                    // Padding
                    // =================================================================================
                    form.find('.txt-padding').each(function () {
                        var txt = $(this);
                        var styleName = txt.attr('data-style-name');
                        
                        txt.on('change', function () {
                            var paddingValue = this.value || '';
                            var target = keditor.getSettingComponent().find('.keditor-component-text-content').get(0);
                            
                            if (paddingValue.trim() === '') {
                                target.style[styleName] = '';
                            } else {
                                if (isNaN(paddingValue)) {
                                    paddingValue = 0;
                                    this.value = paddingValue;
                                }
                                target.style[styleName] = paddingValue + 'px';
                            }
                        });
                    });
                    
                    // =================================================================================
                    // Margin
                    // =================================================================================
                    form.find('.txt-margin').each(function () {
                        var txt = $(this);
                        var styleName = txt.attr('data-style-name');
                        
                        txt.on('change', function () {
                            var marginValue = this.value || '';
                            var target = keditor.getSettingComponent().find('.keditor-component-text-content').get(0);
                            
                            if (marginValue.trim() === '') {
                                target.style[styleName] = '';
                            } else {
                                if (isNaN(marginValue)) {
                                    marginValue = 0;
                                    this.value = marginValue;
                                }
                                target.style[styleName] = marginValue + 'px';
                            }
                        });
                    });
                    
                    // =================================================================================
                    // Width and Height
                    // =================================================================================
                    form.find('.txt-height').on('change', function () {
                        var height = this.value || '';
                        if (isNaN(height)) {
                            height = '';
                        }
                        
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('height', height);
                    });
                    
                    form.find('.txt-max-height').on('change', function () {
                        var maxHeight = this.value || '';
                        if (isNaN(maxHeight)) {
                            maxHeight = '';
                        }
                        
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('max-height', maxHeight + 'px');
                    });
                    
                    form.find('.txt-width').on('change', function () {
                        var width = this.value || '';
                        if (isNaN(width)) {
                            width = '';
                        }
                        
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('width', width);
                    });
                    
                    form.find('.txt-max-width').on('change', function () {
                        var maxWidth = this.value || '';
                        if (isNaN(maxWidth)) {
                            maxWidth = '';
                        }
                        
                        var target = keditor.getSettingComponent().find('.keditor-component-text-content');
                        target.css('max-width', maxWidth + 'px');
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "text" component', component);
            
            var target = component.find('.keditor-component-text-content').get(0);
            
            var imageUrl = target.style.backgroundImage;
            imageUrl = (imageUrl || '').replace(/^url\(['"]+(.+)['"]+\)$/, '$1');
            form.find('.background-image-previewer').attr('src', imageUrl !== 'none' && imageUrl !== '' ? imageUrl : '/static/images/photo_holder.png');
            
            form.find('.select-bg-repeat').val(target.style.backgroundRepeat || 'repeat');
            form.find('.select-bg-position').val(target.style.backgroundPosition || '0% 0%');
            form.find('.select-bg-size').val(target.style.backgroundSize || 'auto');
            
            form.find('.txt-bg-color').val(target.style.backgroundColor || '').trigger('update')
            
            form.find('.txt-padding').each(function () {
                var txt = $(this);
                var styleName = txt.attr('data-style-name');
                
                txt.val((target.style[styleName] || '').replace('px', ''));
            });
            form.find('.txt-margin').each(function () {
                var txt = $(this);
                var styleName = txt.attr('data-style-name');
                
                txt.val((target.style[styleName] || '').replace('px', ''));
            });
            
            form.find('.txt-height').val((target.style.height || '').replace('px', ''));
            form.find('.txt-max-height').val((target.style.maxHeight || '').replace('px', ''));
            form.find('.txt-width').val((target.style.width || '').replace('px', ''));
            form.find('.txt-maxWith').val((target.style.maxWidth || '').replace('px', ''));
        }
    };
    
})(jQuery);

/**
 * KEditor Video Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['video'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "video" component', component);
            
            var self = this;
            
            var img = component.find('img[data-video-src]');
            img.attr('id', keditor.generateId('component-video'));
            
            var wrapper = img.parent();
            if (!wrapper.hasClass('video-wrapper')) {
                img.wrap('<div class="video-wrapper"></div>');
                wrapper = img.parent();
            }
            
            wrapper.attr('data-id', img.attr('id'));
            wrapper.attr('data-autostart', img.attr('data-autostart'));
            wrapper.attr('data-aspectratio', img.attr('data-aspectratio'));
            wrapper.attr('data-video-src', img.attr('data-video-src'));
            wrapper.attr('data-repeat', img.attr('data-repeat'));
            wrapper.attr('data-controls', img.attr('data-controls'));
            
            $.getScriptOnce('/static/jwplayer/6.10/jwplayer.js', function () {
                jwplayer.key = 'cXefLoB9RQlBo/XvVncatU90OaeJMXMOY/lamKrzOi0=';
                self.buildJWVideoPlayerPreview(component);
            });
        },
        
        getContent: function (component) {
            flog('getContent "video" component, component');
            
            var wrapper = component.find('.video-wrapper');
            var html = '<img class="video-jw" ';
            html += '       id="' + this.componentId + '" ';
            html += '       src="' + wrapper.attr('data-video-src') + '/alt-640-360.png" ';
            html += '       data-autostart="' + wrapper.attr('data-autostart') + '" ';
            html += '       data-aspectratio="' + wrapper.attr('data-aspectratio') + '" ';
            html += '       data-video-src="' + wrapper.attr('data-video-src') + '" ';
            html += '       data-repeat="' + wrapper.attr('data-repeat') + '" ';
            html += '       data-controls="' + wrapper.attr('data-controls') + '" />';
            wrapper.html(html);
            
            return component.find('.keditor-component-content').html();
        },
        
        settingEnabled: true,
        
        settingTitle: 'Video Settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "video" settings', form);
            var self = this;
            
            return $.ajax({
                url: '/static/keditor/componentVideoSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    var selectPicker = form.find('.select-border-style');
                    selectPicker.selectpicker().on('changed.bs.select', function () {
                        self.borderStyle = this.value;
                        keditor.getSettingComponent().find('.video-wrapper').css('border-style', this.value);
                    });
                    
                    var txtBorderWidth = form.find('.border-width');
                    txtBorderWidth.on('change', function () {
                        var width = this.value;
                        if (isNaN(width) || width < 0) {
                            width = 1;
                            this.value = width;
                        }
                        
                        self.borderWidth = width;
                        keditor.getSettingComponent().find('.video-wrapper').css('border-width', width);
                    });
                    
                    var colorPicker = form.find('.color-picker');
                    var input = colorPicker.find('input');
                    var previewer = colorPicker.find('.input-group-addon i');
                    colorPicker.colorpicker({
                        format: 'hex',
                        container: colorPicker.parent(),
                        component: '.input-group-addon',
                        align: 'left',
                        colorSelectors: {
                            'transparent': 'transparent'
                        }
                    }).on('changeColor.colorpicker', function (e) {
                        var colorHex = e.color.toHex();
                        
                        if (!input.val() || input.val().trim().length === 0) {
                            colorHex = '';
                            previewer.css('background-color', '');
                        }
                        
                        self.borderColor = colorHex;
                        keditor.getSettingComponent().find('.video-wrapper').css('border-color', colorHex);
                    });
                    
                    form.find('.chk-border').on('click', function () {
                        selectPicker.prop('disabled', !this.checked).selectpicker('refresh');
                        txtBorderWidth.prop('disabled', !this.checked);
                        colorPicker.colorpicker(this.checked ? 'enable' : 'disable');
                        
                        if (!this.checked) {
                            keditor.getSettingComponent().find('.video-wrapper').css('border', '');
                            selectPicker.selectpicker('val', '');
                            txtBorderWidth.val('');
                            colorPicker.colorpicker('setValue', 'transparent');
                        }
                    });
                    
                    var btnVideoFileInput = form.find('.btn-videoFileInput');
                    btnVideoFileInput.mselect({
                        contentTypes: ['video'],
                        bs3Modal: true,
                        pagePath: window.location.pathname.replace('contenteditor', ''),
                        onSelectFile: function (url) {
                            keditor.getSettingComponent().find('.video-wrapper').attr('data-video-src', url);
                            self.refreshVideoPlayerPreview(keditor);
                        }
                    });
                    
                    var autoplayToggle = form.find('#video-autoplay');
                    autoplayToggle.on('click', function () {
                        keditor.getSettingComponent().find('.video-wrapper').attr('data-autostart', this.checked);
                        self.buildJWVideoPlayerPreview(keditor);
                    });
                    
                    var loopToggle = form.find('#video-loop');
                    loopToggle.on('click', function () {
                        keditor.getSettingComponent().find('.video-wrapper').attr('data-repeat', this.checked);
                        self.buildJWVideoPlayerPreview(keditor);
                    });
                    
                    var ratio = form.find('.video-ratio');
                    ratio.on('click', function (e) {
                        if (this.checked) {
                            keditor.getSettingComponent().find('.video-wrapper').attr('data-aspectratio', this.value);
                            self.buildJWVideoPlayerPreview(keditor);
                        }
                    });
                    
                    var showcontrolsToggle = form.find('#video-showcontrols');
                    showcontrolsToggle.on('click', function (e) {
                        keditor.getSettingComponent().find('.video-wrapper').attr('data-controls', this.checked);
                        self.buildJWVideoPlayerPreview(keditor);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "video" component', form, component);
            
            var wrapper = component.find('.video-wrapper');
            var borderWidth = wrapper.css('border-width') || '';
            var isBorderEnabled = borderWidth !== '0px';
            
            var chkBorder = form.find('.chk-border');
            var txtBorderWidth = form.find('.border-width');
            var colorPicker = form.find('.color-picker');
            var selectPicker = form.find('.select-border-style');
            
            chkBorder.prop('checked', isBorderEnabled);
            selectPicker.prop('disabled', !isBorderEnabled).selectpicker('refresh').selectpicker('val', wrapper.css('border-style'));
            txtBorderWidth.prop('disabled', !isBorderEnabled).val(isBorderEnabled ? borderWidth.replace('px', '') : '');
            colorPicker.colorpicker(isBorderEnabled ? 'enable' : 'disable').colorpicker('setValue', isBorderEnabled ? wrapper.css('border-color') : '');
            
            form.find('#video-autoplay').prop('checked', wrapper.attr('data-autostart') === 'true');
            form.find('#video-loop').prop('checked', wrapper.attr('data-repeat') === 'true');
            form.find('.video-ratio').filter('[value="' + wrapper.attr('data-aspectratio') + '"]').prop('checked', true);
            form.find('#video-showcontrols').prop('checked', wrapper.attr('data-controls') === 'true');
        },
        
        buildJWVideoPlayerPreview: function (component) {
            if (!component.jquery) {
                component = component.getSettingComponent();
            }
            var wrapper = component.find('.video-wrapper');
            var src = wrapper.attr('data-video-src');
            var autostart = wrapper.attr('data-autostart');
            var repeat = wrapper.attr('data-repeat');
            var aspectratio = wrapper.attr('data-aspectratio');
            var controls = wrapper.attr('data-controls');
            var playerInstance = jwplayer(wrapper.attr('data-id'));
            var posterHref = src + '/alt-640-360.png';
            
            flog("buildJWPlayer", src, "aspectratio=", aspectratio);
            playerInstance.setup({
                autostart: autostart,
                repeat: repeat,
                controls: controls,
                aspectratio: aspectratio,
                flashplayer: "/static/jwplayer/6.10/jwplayer.flash.swf",
                html5player: "/static/jwplayer/6.10/jwplayer.html5.js",
                width: "100%",
                androidhls: true, //enable hls on android 4.1+
                playlist: [{
                    image: posterHref,
                    sources: [{
                        file: src
                    }
                        , {
                            file: src + "/../alt-640-360.webm"
                        }, {
                            file: src + "/../alt-640-360.m4v"
                        }]
                }]
                , primary: "flash"
            });
            
            playerInstance.onReady(function () {
                flog('jwplayer preview init done');
            });
        },
        
        refreshVideoPlayerPreview: function (keditor) {
            var wrapper = keditor.getSettingComponent().find('.video-wrapper');
            var playerInstance = jwplayer(wrapper.attr('data-id'));
            var src = wrapper.attr('data-video-src');
            
            playerInstance.load([{
                file: src
            }]);
            playerInstance.play();
        }
    };
})(jQuery);

/**
 * KEditor Vimeo Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['vimeo'] = {
        getContent: function (component, keditor) {
            flog('getContent "vimeo" component', component);
            
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.vimeo-cover').remove();
            
            return componentContent.html();
        },
        
        settingEnabled: true,
        
        settingTitle: 'Vimeo Settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "vimeo" settings', form);
            
            return $.ajax({
                url: '/static/keditor/componentVimeoSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    var btnEdit = form.find('.btn-vimeo-edit');
                    btnEdit.on('click', function (e) {
                        e.preventDefault();
                        
                        var inputData = prompt('Please enter Vimeo URL in here:');
                        var vimeoRegex = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
                        var match = inputData.match(vimeoRegex);
                        if (match && match[1]) {
                            keditor.getSettingComponent().find('.embed-responsive-item').attr('src', 'https://player.vimeo.com/video/' + match[1] + '?byline=0&portrait=0&badge=0');
                        } else {
                            alert('Your Vimeo URL is invalid!');
                        }
                    });
                    
                    var btn169 = form.find('.btn-vimeo-169');
                    btn169.on('click', function (e) {
                        e.preventDefault();
                        
                        keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-4by3').addClass('embed-responsive-16by9');
                    });
                    
                    var btn43 = form.find('.btn-vimeo-43');
                    btn43.on('click', function (e) {
                        e.preventDefault();
                        
                        keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-16by9').addClass('embed-responsive-4by3');
                    });
                    
                    var chkAutoplay = form.find('#vimeo-autoplay');
                    chkAutoplay.on('click', function () {
                        var embedItem = keditor.getSettingComponent().find('.embed-responsive-item');
                        var currentUrl = embedItem.attr('src');
                        var newUrl = (currentUrl.replace(/(\?.+)+/, '')) + '?byline=0&portrait=0&badge=0&autoplay=' + (chkAutoplay.is(':checked') ? 1 : 0);
                        
                        flog('Current url: ' + currentUrl, 'New url: ' + newUrl);
                        embedItem.attr('src', newUrl);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "vimeo" component', component);
            
            var embedItem = component.find('.embed-responsive-item');
            var chkAutoplay = form.find('#vimeo-autoplay');
            var src = embedItem.attr('src');
            
            chkAutoplay.prop('checked', src.indexOf('autoplay=1') !== -1);
        }
    };
    
})(jQuery);

/**
 * KEditor Youtube Component
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: @{version}
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap, FontAwesome (optional)
 */
(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    
    KEditor.components['youtube'] = {
        getContent: function (component, keditor) {
            flog('getContent "youtube" component', component);
            
            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.youtube-cover').remove();
            
            return componentContent.html();
        },
        
        settingEnabled: true,
        
        settingTitle: 'Youtube Settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "youtube" settings', form);
            
            return $.ajax({
                url: '/static/keditor/componentYoutubeSettings.html',
                type: 'get',
                dataType: 'HTML',
                success: function (resp) {
                    form.html(resp);
                    
                    var btnEdit = form.find('.btn-youtube-edit');
                    btnEdit.on('click', function (e) {
                        e.preventDefault();
                        
                        var inputData = prompt('Please enter Youtube URL in here:');
                        var youtubeRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'>]+)/;
                        var match = inputData.match(youtubeRegex);
                        if (match && match[1]) {
                            keditor.getSettingComponent().find('.embed-responsive-item').attr('src', 'https://www.youtube.com/embed/' + match[1]);
                        } else {
                            alert('Your Youtube URL is invalid!');
                        }
                    });
                    
                    var btn169 = form.find('.btn-youtube-169');
                    btn169.on('click', function (e) {
                        e.preventDefault();
                        
                        keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-4by3').addClass('embed-responsive-16by9');
                    });
                    
                    var btn43 = form.find('.btn-youtube-43');
                    btn43.on('click', function (e) {
                        e.preventDefault();
                        
                        keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-16by9').addClass('embed-responsive-4by3');
                    });
                    
                    var chkAutoplay = form.find('#youtube-autoplay');
                    chkAutoplay.on('click', function () {
                        var embedItem = keditor.getSettingComponent().find('.embed-responsive-item');
                        var currentUrl = embedItem.attr('src');
                        var newUrl = (currentUrl.replace(/(\?.+)+/, '')) + '?autoplay=' + (chkAutoplay.is(':checked') ? 1 : 0);
                        
                        flog('Current url: ' + currentUrl, 'New url: ' + newUrl);
                        embedItem.attr('src', newUrl);
                    });
                }
            });
        },
        
        showSettingForm: function (form, component, keditor) {
            flog('showSettingForm "youtube" component', component);
            
            var embedItem = component.find('.embed-responsive-item');
            var chkAutoplay = form.find('#youtube-autoplay');
            var src = embedItem.attr('src');
            
            chkAutoplay.prop('checked', src.indexOf('autoplay=1') !== -1);
        }
    };
    
})(jQuery);
