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
    .addMethod('POST', 'requestApproval', 'requestApproval')
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
                    'field5',
                    'tags'
                ],
                'size': 10000,
                'query': {
                    'bool': {
                        'must': [
                            {'type': {'value': TYPE_RECORD}},
                            {'term': {'soldBy': currentUser.name}}
                        ]
                    }
                }
            };
            
            var searchResult = doDBSearch(page, queryJson);
            
            page.attributes.searchResult = searchResult;
        } catch (e) {
            log.error('ERROR in getClaims: ' + e);
        }
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
        
        var tags = (params.tags || '').trim();
        tags = tags !== '' ? tags.split(',') : null;
        if (tags && tags.length > 5) {
            result.status = false;
            result.messages = ['Maximum tags is 5'];
            return views.jsonObjectView(JSON.stringify(result))
        }
        
        var tempDateTime = params.soldDate;
        var tempDate = tempDateTime.substring(0, tempDateTime.indexOf(' ')).split('/');
        var tempTime = tempDateTime.substring(tempDateTime.indexOf(' ') + 1, tempDateTime.length).split(':');
        var soldDate = new Date(+tempDate[2], +tempDate[1] - 1, +tempDate[0], +tempTime[0], +tempTime[1], 00, 00);
        
        var obj = {
            recordId: id,
            soldBy: params.soldBy,
            amount: amount,
            soldDate: soldDate,
            enteredDate: new Date(),
            modifiedDate: new Date(),
            productSku: params.productSku || '',
            status: RECORD_STATUS.NEW
        };
        
        if (tags) {
            obj.tags = tags.join(',');
        }
        
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
            
            var tags = (params.tags || '').trim();
            tags = tags !== '' ? tags.split(',') : null;
            if (tags && tags.length > 5) {
                result.status = false;
                result.messages = ['Maximum tags is 5'];
                return views.jsonObjectView(JSON.stringify(result))
            }
            
            var tempDateTime = params.soldDate;
            var tempDate = tempDateTime.substring(0, tempDateTime.indexOf(' ')).split('/');
            var tempTime = tempDateTime.substring(tempDateTime.indexOf(' ') + 1, tempDateTime.length).split(':');
            var soldDate = new Date(+tempDate[2], +tempDate[1] - 1, +tempDate[0], +tempTime[0], +tempTime[1], 00, 00);
            
            
            var obj = {
                recordId: id,
                soldBy: claim.jsonObject.soldBy,
                amount: amount,
                soldDate: soldDate,
                enteredDate: claim.jsonObject.enteredDate,
                modifiedDate: new Date(),
                productSku: params.productSku || '',
                status: claim.jsonObject.status,
                tags: claim.jsonObject.tags
            };
            
            if (tags) {
                obj.tags = tags.join(',');
            }
            
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

function requestApproval(page, params) {
    log.info('requestApproval > page={}, params={}', page, params);
    
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
                
                if (claim !== null) {
                    claim.jsonObject.status = RECORD_STATUS.REQUESTING;
                    claim.save();
                }
            })(ids[i]);
        }
    } catch (e) {
        result.status = false;
        result.messages = ['Error in requesting approval: ' + e];
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
                
                if (claim !== null) {
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
