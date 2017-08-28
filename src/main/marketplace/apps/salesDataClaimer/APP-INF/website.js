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
    .addMethod('GET', 'getClaims')
    .addMethod('POST', 'createClaim', 'createClaim')
    .addMethod('POST', 'deleteClaims', 'deleteClaims')
    .postPriviledge('WRITE_CONTENT')
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
    .postPriviledge('WRITE_CONTENT')
    .enabled(true)
    .build();

function getClaims(page, params) {
    log.info('getClaims > page={}, params={}', page, params);
    
    if (!params.claimId) {
        var results = searchClaims(page, params.status);
        page.attributes.searchResult = results;
    }
}

function searchClaims(page, status) {
        try {
            var currentUser = securityManager.getCurrentUser();
            var queryJson = {
                'stored_fields': [
                    'recordId',
                    'soldDate',
                    'enteredDate',
                    'modifiedDate',
                    'amount',
                    'status',
                    'productSku',
                    'field1',
                    'field2',
                    'field3',
                    'field4',
                    'field5'
                ],
                'size': 10000,
                'sort': [
                    {
                        'modifiedDate': 'desc'
                    },
                    {
                        'enteredDate': 'desc'
                    }
                ],
                'query': {
                    'bool': {
                        'must': [
                            {'type': {'value': TYPE_RECORD}},
                            {'term': {'soldBy': currentUser.name}}
                        ]
                    }
                }
            };
            
            if (status) {
                queryJson.query.bool.must.push({
                    'term': {'status': + status}
                });
            }
            
            var searchResult = doDBSearch(page, queryJson);
            
            page.attributes.searchResult = searchResult;
        } catch (e) {
            log.error('ERROR in getClaims: ' + e);
        }    
}

function getClaim(page, params) {
    log.info('getClaim > page={}, params={}', page, params);
    
    var result = {
        status: true
    };
    
    try {
        var db = getDB(page);
        var claim = db.child(page.attributes.claimId);
        
        if (claim !== null) {
            result.data = claim.jsonObject + '';
        } else {
            result.status = false;
            result.messages = ['This claim does not exist'];
        }
    } catch (e) {
        result.status = false;
        result.messages = ['Error when getting claim: ' + e];
    }
    
    return views.jsonObjectView(JSON.stringify(result));
}

function createClaim(page, params) {
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
            return views.jsonObjectView(JSON.stringify(result))
        }
        
        var tempDateTime = params.soldDate;
        var tempDate = tempDateTime.substring(0, tempDateTime.indexOf(' ')).split('/');
        var tempTime = tempDateTime.substring(tempDateTime.indexOf(' ') + 1, tempDateTime.length).split(':');
        var soldDate = new Date(+tempDate[2], +tempDate[1] - 1, +tempDate[0], +tempTime[0], +tempTime[1], 00, 00);
        
        var obj = {
            recordId: id,
            soldBy: params.soldBy,
            soldById: params.soldById,
            amount: amount,
            soldDate: soldDate,
            enteredDate: new Date(),
            modifiedDate: new Date(),
            productSku: params.productSku || '',
            field1: params.field1 || '',
            field2: params.field2 || '',
            field3: params.field3 || '',
            field4: params.field4 || '',
            field5: params.field5 || '',
            status: RECORD_STATUS.NEW
        };
        
        db.createNew(id, JSON.stringify(obj), TYPE_RECORD);
    } catch (e) {
        result.status = false;
        result.messages = ['Error when creating claim: ' + e];
    }
    
    return views.jsonObjectView(JSON.stringify(result))
}

function updateClaim(page, params) {
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
                return views.jsonObjectView(JSON.stringify(result))
            }
            
            var tempDateTime = params.soldDate;
            var tempDate = tempDateTime.substring(0, tempDateTime.indexOf(' ')).split('/');
            var tempTime = tempDateTime.substring(tempDateTime.indexOf(' ') + 1, tempDateTime.length).split(':');
            var soldDate = new Date(+tempDate[2], +tempDate[1] - 1, +tempDate[0], +tempTime[0], +tempTime[1], 00, 00);
            
            
            var obj = {
                recordId: id,
                soldBy: claim.jsonObject.soldBy,
                soldById: claim.jsonObject.soldById,
                amount: amount,
                soldDate: soldDate,
                enteredDate: claim.jsonObject.enteredDate,
                modifiedDate: new Date(),
                productSku: params.productSku || '',
                field1: params.field1 || '',
                field2: params.field2 || '',
                field3: params.field3 || '',
                field4: params.field4 || '',
                field5: params.field5 || '',
                status: claim.jsonObject.status
            };
            
            claim.update(JSON.stringify(obj), TYPE_RECORD);
        } else {
            result.status = false;
            result.messages = ['This claim does not exist'];
        }
    } catch (e) {
        result.status = false;
        result.messages = ['Error when updating claim: ' + e];
    }
    
    return views.jsonObjectView(JSON.stringify(result))
}

function deleteClaims(page, params) {
    log.info('deleteClaims > page={}, params={}', page, params);
    
    var result = {
        status: true
    };
    
    try {
        var db = getDB(page);
        var ids = params.ids;
        ids = ids.split(',');
        
        for (var i = 0; i < ids.length; i++) {
            (function (id) {
                var claim = db.child(id);
                
                if (claim !== null && +claim.jsonObject.status === RECORD_STATUS.NEW) {
                    claim.delete();
                }
            })(ids[i]);
        }
    } catch (e) {
        result.status = false;
        result.messages = ['Error in deleting: ' + e];
    }
    
    return views.jsonObjectView(JSON.stringify(result))
}
