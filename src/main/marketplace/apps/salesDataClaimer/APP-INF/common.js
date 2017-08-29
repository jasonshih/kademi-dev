function uploadFile(page, params, files) {
    log.info('uploadFile > page {} params {} files {}', page, params, files);
    
    var result = [];

    if (files !== null || !files.isEmpty()) {
        var filesArray = files.entrySet().toArray();

        for (var i = 0; i < filesArray.length; i++) {
            var file = filesArray[i].getValue();
            var fileHash = fileManager.uploadFile(file);
            
            result.push({
                fileName: fileHash,
                type: file.contentType,
                size: file.size,
                uploaded: new Date(),
                hash: fileHash
            });
        }
    }
    
    return result;
}