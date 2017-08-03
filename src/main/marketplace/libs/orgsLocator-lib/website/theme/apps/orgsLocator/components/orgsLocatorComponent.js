(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;
    var win = $(this);
    
    KEditor.components['orgsLocator'] = {
        init: function (contentArea, container, component, keditor) {
            flog('init "orgsLocator" component', component);
    
            var orgsLocator = component.find('.orgs-locator-component');
            var id = orgsLocator.attr('id');
    
            orgsLocator.orgFinder({
                searchUrl: '/orgsLocator/',
                initLatLng: [-33.867, 151.195],
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
        }
    };
    
})(jQuery);