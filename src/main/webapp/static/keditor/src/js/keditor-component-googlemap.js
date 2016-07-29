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
        init: function(contentArea, container, component, keditor){
            var apiKey = 'AIzaSyBUcuZxwpBXCPztG7ot-rITXJbycPuS7gs';
            var componentContent = component.children('.keditor-component-content');
            var script = '<script src="https://maps.googleapis.com/maps/api/js?key='+apiKey+'&callback=initMap" async defer></script>';
            if (!componentContent.find('.kgooglemap').length) {
                var id = keditor.generateId('component-googlemap');
                componentContent.find('.embed-responsive').append('<div style="height: 100%; width: 100%; position: absolute;" id="'+id+'" class="kgooglemap hide"></div>');
            }
        },
        getContent: function (component, keditor) {
            flog('getContent "googlemap" component', component);

            var componentContent = component.children('.keditor-component-content');
            componentContent.find('.googlemap-cover').remove();

            return componentContent.html();
        },

        settingEnabled: true,

        settingTitle: 'Google Map Settings',

        initSettingForm: function (form, keditor) {
            flog('initSettingForm "googlemap" component');
            var apiKey = 'AIzaSyBUcuZxwpBXCPztG7ot-rITXJbycPuS7gs';
            form.append(
                '<script src="https://maps.googleapis.com/maps/api/js?key='+apiKey+'&callback=initKeditorMapSetting&libraries=places" async defer></script>' +
                '<form class="form-horizontal" onsubmit="return false;">' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Map type</label>' +
                '       <div class="radio-inline">' +
                '           <label class="radio-inline"><input checked type="radio" name="mapType" class="mapType" value="embed"> Embed</label>' +
                '           <label class="radio-inline"><input type="radio" name="mapType" class="mapType" value="manually"> Manually</label>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group embed">' +
                '       <div class="col-sm-12">' +
                '           <textarea class="form-control" name="mapEmbedCode" placeholder="Embed code"></textarea>' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group manually hide">' +
                '       <div class="col-sm-12">' +
                '           <input class="form-control" name="mapAddress" placeholder="Enter address" />' +
                '       </div>' +
                '   </div>' +
                '   <div class="form-group">' +
                '       <label class="col-sm-12">Aspect Ratio</label>' +
                '       <div class="col-sm-12">' +
                '           <button type="button" class="btn btn-sm btn-default btn-googlemap-169">16:9</button>' +
                '           <button type="button" class="btn btn-sm btn-default btn-googlemap-43">4:3</button>' +
                '       </div>' +
                '   </div>' +
                '</form>'
            );
            form.find('.mapType').on('click', function(e){
                if (this.checked) {
                    $('.'+this.value).removeClass('hide');
                    var cls = form.find('.mapType').not(this).val();
                    $('.'+cls).addClass('hide');
                    var comp = keditor.getSettingComponent();
                    if (this.value === 'manually'){
                        comp.find('iframe').addClass('hide');
                        comp.find('.kgooglemap').removeClass('hide');
                        if (comp.find('.kgooglemap').data('map')){
                            google.maps.event.trigger(comp.find('.kgooglemap').data('map'), "resize");
                        } else {
                            self.initAutocomplete(comp, form);
                        }
                    } else {
                        comp.find('iframe').removeClass('hide');
                        comp.find('.kgooglemap').addClass('hide');
                    }
                }
            });

            var self = this;
            form.find('[name=mapEmbedCode]').on('change', function(){
                var iframe = $(this.value);
                var src = iframe.attr('src');
                if (iframe.length > 0 && src && src.length > 0) {
                    keditor.getSettingComponent().find('.embed-responsive-item').attr('src', src);
                } else {
                    alert('Your Google Map embed code is invalid!');
                }
            });


            var btn169 = form.find('.btn-googlemap-169');
            btn169.on('click', function (e) {
                e.preventDefault();

                keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-4by3').addClass('embed-responsive-16by9');
            });

            var btn43 = form.find('.btn-googlemap-43');
            btn43.on('click', function (e) {
                e.preventDefault();

                keditor.getSettingComponent().find('.embed-responsive').removeClass('embed-responsive-16by9').addClass('embed-responsive-4by3');
            });
        },
        showSettingForm: function (form, component, keditor) {

        },

        initAutocomplete: function (component, form) {
            if (!window.googleMapInitialized) {
                alert('google map is not initialized');
                return;
            }
            var mapdiv = component.find('.kgooglemap')[0];
            var map = new google.maps.Map(mapdiv, {
                center: {lat: -33.8688, lng: 151.2195},
                zoom: 13,
                mapTypeId: 'roadmap'
            });
            // Create the search box and link it to the UI element.
            var input = form.find('[name=mapAddress]')[0];
            var searchBox = new google.maps.places.SearchBox(input);
            //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            // Bias the SearchBox results towards current map's viewport.
            map.addListener('bounds_changed', function() {
                searchBox.setBounds(map.getBounds());
            });

            var markers = [];
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener('places_changed', function() {
                var places = searchBox.getPlaces();

                if (places.length == 0) {
                    return;
                }

                // Clear out the old markers.
                markers.forEach(function(marker) {
                    marker.setMap(null);
                });
                markers = [];

                // For each place, get the icon, name and location.
                var bounds = new google.maps.LatLngBounds();
                places.forEach(function(place) {
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
            });

            component.find('.kgooglemap').data('map', map);
        }
    };

    window.initKeditorMapSetting = function(){
        window.googleMapInitialized = true;
    }
})(jQuery);
