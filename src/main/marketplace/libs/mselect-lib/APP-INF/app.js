controllerMappings
    .adminController()
    .path("/mselect-lib/cropImage")
    .enabled(true)
    .addMethod("POST", "cropImage")
    .build();

controllerMappings
    .websiteController()
    .path("/mselect-lib/cropImage")
    .enabled(true)
    .isPublic(true)
    .addMethod("POST", "cropImage")
    .build();

function cropImage(page, params) {
    log.info('cropImage > page={}, params={}', page, params);
    
    var hash = fileManager.utils.cropImage(params.hash, params.x, params.y, params.w, params.h);
    
    return views.jsonObjectView(JSON.stringify({
        status: true,
        hash: hash
    }));
}