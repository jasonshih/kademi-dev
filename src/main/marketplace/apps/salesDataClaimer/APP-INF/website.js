controllerMappings
    .websiteController()
    .path('/salesDataClaims')
    .addMethod('GET', 'checkRedirect')
    .enabled(true)
    .build();

controllerMappings
    .websiteController()
    .path('/salesDataClaims/')
    .defaultView(views.templateView('/theme/apps/salesDataClaimer/viewClaims.html'))
    .addMethod('POST', 'createClaim', 'createClaim')
    .addMethod('POST', 'deleteClaims', 'deleteClaims')
    .postPriviledge('READ_CONTENT')
    .enabled(true)
    .build();

controllerMappings
    .websiteController()
    .path('/salesDataClaims/(?<claimId>[^/]*)')
    .addMethod('GET', 'checkRedirect')
    .enabled(true)
    .build();

controllerMappings
    .websiteController()
    .path('/salesDataClaims/(?<claimId>[^/]*)/')
    .addMethod('GET', 'getClaim')
    .addMethod('POST', 'updateClaim', 'updateClaim')
    .postPriviledge('READ_CONTENT')
    .enabled(true)
    .build();

controllerMappings
    .websiteController()
    .path('/salesDataClaimsProducts/')
    .addMethod('GET', 'searchProducts')
    .enabled(true)
    .build();

function getOwnClaims(page, params) {
    log.info('getOwnClaims > page={}, params={}', page, params);
    
    if (!params.claimId) {
        var currentUser = securityManager.getCurrentUser();
        return searchClaims(page, params.status, currentUser);
    }
}

function searchProducts(page, params) {
    var q = params.q;
    var prods = applications.productsApp.searchProducts(q, null);
    return views.jsonObjectView(prods);
}

function createClaim(page, params, files) {
    log.info('createClaim > page={}, params={}', page, params);
    
    var result = {
        status: true
    };
    
    try {
        var currentRoles = securityManager.getRoles();
        log.info('currentRoles={}', currentRoles);
        
        var db = getDB(page);
        var id = 'claim-' + generateRandomText(32);
        
        var amount = +params.amount;
        if (isNaN(amount)) {
            result.status = false;
            result.messages = ['Amount must be digits'];
            return views.jsonObjectView(JSON.stringify(result));
        }
        
        var tempDateTime = params.soldDate;
        var tempDate = tempDateTime.substring(0, tempDateTime.indexOf(' ')).split('/');
        var tempTime = tempDateTime.substring(tempDateTime.indexOf(' ') + 1, tempDateTime.length).split(':');
        var soldDate = new Date(+tempDate[2], +tempDate[1] - 1, +tempDate[0], +tempTime[0], +tempTime[1], 00, 00);
        var now = formatter.formatDateISO8601(formatter.now);
        
        var obj = {
            recordId: id,
            soldBy: params.soldBy,
            soldById: params.soldById,
            amount: amount,
            soldDate: soldDate,
            enteredDate: now,
            modifiedDate: now,
            productSku: params.productSku || '',
            status: RECORD_STATUS.NEW
        };
        
        // Parse extra fields
        var extraFields = getSalesDataExtreFields(page);
        for (var i = 0; i < extraFields.length; i++) {
            var ex = extraFields[i];
            var fieldName = 'field_' + ex.name;
            
            obj[fieldName] = params.get(fieldName) || '';
        }
        
        // Upload receipt
        var uploadedFiles = uploadFile(page, params, files);
        if (uploadedFiles.length > 0) {
            obj.receipt = '/_hashes/files/' + uploadedFiles[0].hash;
        }
        
        db.createNew(id, JSON.stringify(obj), TYPE_RECORD);
        eventManager.goalAchieved("claimSubmittedGoal", {"claim": id});
    } catch (e) {
        log.error('Error when creating claim: ' + e);
        result.status = false;
        result.messages = ['Error when creating claim: ' + e];
    }
    
    return views.jsonObjectView(JSON.stringify(result));
}

function updateClaim(page, params, files) {
    log.info('updateClaim > page={}, params={}', page, params);
    
    var result = {
        status: true
    };
    
    try {
        var db = getDB(page);
        var id = page.attributes.claimId;
        var claim = db.child(id);
        
        if (claim !== null) {
            var amount = +params.amount;
            if (isNaN(amount)) {
                result.status = false;
                result.messages = ['Amount must be digits'];
                return views.jsonObjectView(JSON.stringify(result));
            }
            
            var tempDateTime = params.soldDate;
            var tempDate = tempDateTime.substring(0, tempDateTime.indexOf(' ')).split('/');
            var tempTime = tempDateTime.substring(tempDateTime.indexOf(' ') + 1, tempDateTime.length).split(':');
            var soldDate = new Date(+tempDate[2], +tempDate[1] - 1, +tempDate[0], +tempTime[0], +tempTime[1], 00, 00);
            var now = formatter.formatDateISO8601(formatter.now);
            
            var obj = {
                recordId: id,
                soldBy: claim.jsonObject.soldBy,
                soldById: claim.jsonObject.soldById,
                amount: amount,
                soldDate: soldDate,
                enteredDate: claim.jsonObject.enteredDate,
                modifiedDate: now,
                productSku: params.productSku || '',
                status: claim.jsonObject.status,
                receipt: claim.jsonObject.receipt
            };
            
            // Parse extra fields
            var extraFields = getSalesDataExtreFields(page);
            for (var i = 0; i < extraFields.length; i++) {
                var ex = extraFields[i];
                var fieldName = 'field_' + ex.name;
                
                obj[fieldName] = params.get(fieldName) || '';
            }
            
            // Upload receipt
            var uploadedFiles = uploadFile(page, params, files);
            if (uploadedFiles.length > 0) {
                obj.receipt = '/_hashes/files/' + uploadedFiles[0].hash;
            }
            
            claim.update(JSON.stringify(obj), TYPE_RECORD);
        } else {
            result.status = false;
            result.messages = ['This claim does not exist'];
        }
    } catch (e) {
        log.error('Error when updating claim: ' + e);
        result.status = false;
        result.messages = ['Error when updating claim: ' + e];
    }
    
    return views.jsonObjectView(JSON.stringify(result));
}
