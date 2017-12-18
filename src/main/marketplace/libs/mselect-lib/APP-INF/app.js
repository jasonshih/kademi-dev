// ================================================================
// Crop Image
// ================================================================
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

// ================================================================
// Store Image
// ================================================================
controllerMappings
    .adminController()
    .path("/mselect-lib/storeImage")
    .enabled(true)
    .addMethod("POST", "storeImage")
    .build();

controllerMappings
    .websiteController()
    .path("/mselect-lib/storeImage")
    .enabled(true)
    .isPublic(true)
    .addMethod("POST", "storeImage")
    .build();

function storeImage(page, params) {
    log.info('storeImage > page={}, params={}', page, params);
    
    var fileData = params.file.replace('data:image/png;base64,', '');
    var file = formatter.fromBase64AsByteArray(fileData);
    var fileHash = fileManager.upload(file);
    
    return views.jsonObjectView(JSON.stringify({
        status: true,
        hash: fileHash
    }));
}
