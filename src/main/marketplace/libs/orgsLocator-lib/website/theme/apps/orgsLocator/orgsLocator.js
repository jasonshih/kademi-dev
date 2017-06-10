$(function () {
    var win = $(window);

    $('#org-map').orgFinder({
        searchUrl: '/orgsLocator/',
        googleAPIKey: 'AIzaSyDS53FPtVGJPvZvrzh2sLcfPUQYS3gsh0c',
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
});