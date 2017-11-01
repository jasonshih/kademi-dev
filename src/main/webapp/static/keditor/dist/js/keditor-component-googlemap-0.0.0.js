/**!
 * KEditor - Kademi content editor
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 0.0.0
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap (optional), FontAwesome (optional)
 */
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
            component.find('.kgooglemap').html('');
            
            return componentContent.html();
        },
        
        settingEnabled: true,
        
        settingTitle: 'Google Map Settings',
        
        initSettingForm: function (form, keditor) {
            flog('init "googlemap" settings', form);
            var self = this;
            
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
                    
                    var mapTypes = form.find('.map-type');
                    form.find('.mapType').on('click', function () {
                        mapTypes.hide().filter('.' + this.value).show();
                        
                        var component = keditor.getSettingComponent();
                        var iframe = component.find('iframe');
                        var kgooglemap = component.find('.kgooglemap');
                        component.attr('data-maptype', this.value);
                        
                        iframe[this.value === 'manually' ? 'hide' : 'show']();
                        kgooglemap[this.value === 'manually' ? 'show' : 'hide']();
                        
                        if (this.value === 'manually') {
                            var mapData = kgooglemap.data('map');
                            
                            if (mapData) {
                                google.maps.event.trigger(mapData, 'resize');
                            } else {
                                self.initAutocomplete(component, form);
                                var input = form.find('[name=mapAddress]')[0];
                                
                                var i = setInterval(function () {
                                    if (mapData) {
                                        clearInterval(i);
                                        
                                        google.maps.event.trigger(input, 'focus');
                                        google.maps.event.trigger(input, 'keydown', {
                                            keyCode: 13
                                        });
                                    }
                                }, 100);
                            }
                        }
                    });
                    
                    form.find('[name=mapEmbedCode]').on('change', function () {
                        var iframe = $(this.value);
                        var src = iframe.attr('src');
                        if (iframe.length > 0 && src && src.length > 0) {
                            keditor.getSettingComponent().find('.embed-responsive-item').attr('src', src);
                        } else {
                            alert('Your Google Map embed code is invalid!');
                        }
                    });
                    
                    form.find('[name=mapRatio]').on('click', function () {
                        var component = keditor.getSettingComponent();
                        
                        component.find('.embed-responsive').removeClass('embed-responsive-4by3 embed-responsive-16by9').addClass('embed-responsive-' + this.value);
                        
                        if (component.attr('data-maptype') === 'manually') {
                            var mapData = component.find('.kgooglemap').data('map');
                            if (mapData) {
                                google.maps.event.trigger(mapData, "resize");
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
            
            var ratio = component.find('.embed-responsive').hasClass('embed-responsive-16by9') ? '16by9' : '4by3';
            form.find('.mapRatio[value=' + ratio + ']').prop('checked', true);
            form.find('.mapType[value=' + maptype + ']').prop('checked', true);
            
            var src = component.find('iframe').attr('src');
            var iframe = '<iframe class="embed-responsive-item" src="' + src + '"></iframe>';
            if (!place) {
                place = 'Hanoi, Vietnam';
            }
            form.find('[name=mapAddress]').val(place);
            form.find('[name=mapEmbedCode]').val(iframe);
            
            form.find('.map-type').hide().filter('.' + maptype).show();
            
            var firstLoad = component.attr('data-firstLoad');
            if (maptype === 'manually') {
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
