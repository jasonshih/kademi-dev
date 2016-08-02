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
            flog('initSettingForm "googlemap" component');
            var apiKey = 'AIzaSyBUcuZxwpBXCPztG7ot-rITXJbycPuS7gs';
            var mapjs = '<script src="https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&callback=initKeditorMapSetting&libraries=places" async defer></script>';
            if (window.google && window.google.maps && google.maps.places){
                mapjs = '';
            }
            form.append(
                mapjs +
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
                            var i = setInterval(function(){
                                if (comp.find('.kgooglemap').data('map')){
                                    clearInterval(i);
                                    google.maps.event.trigger(input, 'focus')
                                    google.maps.event.trigger(input, 'keydown', {
                                        keyCode: 13
                                    });
                                }
                            },100);
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
        },
        showSettingForm: function (form, component, keditor) {
            var self = this;
            var maptype = component.attr('data-maptype');
            var place = component.attr('data-place');
            var ratio169 = component.find('.embed-responsive').hasClass('embed-responsive-16by9');
            var ratio43 = component.find('.embed-responsive').hasClass('embed-responsive-4by3');
            if (ratio43){
                form.find('.btn-googlemap-43').addClass('btn-primary').removeClass('btn-default');
            }
            if (ratio169){
                form.find('.btn-googlemap-169').addClass('btn-primary').removeClass('btn-default');
            }
            form.find('.mapType[value=' + maptype + ']').prop('checked', true);
            var src = component.find('iframe').attr('src');
            var iframe = '<iframe class="embed-responsive-item" src="' + src + '"></iframe>';
            if (!place){
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
