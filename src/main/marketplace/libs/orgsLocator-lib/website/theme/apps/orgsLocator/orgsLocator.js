(function ($) {
    var win = $(window);
    flog("init orgFinder.1");
    
    var comps = $('.orgs-locator-component');
    
    flog("init orgFinder.xx", $(".main-content"), win );
    
    flog("init orgFinder.2",comps.length, comps);
    if ( comps.length > 0) {        
        flog("init orgFinder.3");
        flog("init orgFinder.4 api=", googleMapsApiKey);
        $('#org-map').orgFinder({
            searchUrl: '/orgsLocator/',
            googleAPIKey: googleMapsApiKey, // injected by googlemapPortlet.html
            initLatLng: [-33.867, 151.195],
            initZoomLevel: 15,
            orgTypes: orgTypes,
            onReady: function (formSearch, itemsWrapper, mapDiv) {
                win.on('resize', function () {
                    var mapWrapper = mapDiv.parent();
                    var winWidth = win.width();

                    itemsWrapper.css('height', '');
                    itemsWrapper.css('max-height', '');
                    mapWrapper.css('padding-bottom', '');

                    if (winWidth < 768) {
                        mapWrapper.css('padding-bottom', '120%');
                        itemsWrapper.css('max-height', 200);
                    } else if (winWidth < 992) {
                        itemsWrapper.css('max-height', 300);
                    } else {
                        itemsWrapper.css('height', mapWrapper.innerHeight() - 39);
                    }
                }).trigger('resize');
            }
        });
    }

})(jQuery);