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

function storeImage(page, params, files) {
    log.info('storeImage > page={}, params={}', page, params);
    
    var fileHash;
    
    if (files !== null || !files.isEmpty()) {
        var filesArrays = files.entrySet().toArray();
        var file = filesArrays[0].getValue();
        fileHash = fileManager.uploadFile(file);
    } else {
        var block = data.croppedImage.split(';');
        var realData = block[1].split(',')[1];
        var file = formatter.fromBase64AsByteArray(realData);
        fileHash = fileManager.upload(file);
    }
    
    return views.jsonObjectView(JSON.stringify({
        status: true,
        hash: fileHash
    }));
}
