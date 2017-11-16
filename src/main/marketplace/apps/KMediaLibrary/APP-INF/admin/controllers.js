/* global controllerMappings */

(function (g) {
    var mediaItemController = controllerMappings
            .adminController()
            .enabled(true)
            .pathSegmentResolver('mediaItem', 'mediaItemResolver');
    
})(this);