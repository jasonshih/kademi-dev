(function ($) {
    var win = $(window);
    
    $(function () {
        $('.orgs-locator-component').each(function () {
            var orgsLocator = $(this);
            var id = orgsLocator.attr('id');
            var initLat = orgsLocator.attr('data-lat');
            initLat = +initLat || -33.867;
            var initLng = orgsLocator.attr('data-lng');
            initLng = +initLng || 151.195;
            
            orgsLocator.orgFinder({
                searchUrl: '/orgsLocator/',
                initLatLng: [initLat, initLng],
                initZoomLevel: 15,
                orgTypes: window[id + '-orgTypes'],
                allowedCountries: window[id + '-allowedCountriess'],
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
        });
    });
    
})(jQuery);