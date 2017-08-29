controllerMappings
    .adminController()
    .path('/manageSaleDataClaimer')
    .addMethod('GET', 'checkRedirect')
    .enabled(true)
    .build();

controllerMappings
    .adminController()
    .path('/updateMappingSaleDataClaimer')
    .addMethod('POST', 'updateMapping')
    .enabled(true)
    .build();

controllerMappings
    .adminController()
    .path('/manageSaleDataClaimer/')
    .defaultView(views.templateView('/theme/apps/salesDataClaimer/viewClaims.html'))
    .addMethod('GET', 'getClaims')
    .addMethod('POST', 'approveClaims', 'approveClaims')
    .addMethod('POST', 'rejectClaims', 'rejectClaims')
    .addMethod('POST', 'deleteClaims', 'deleteClaims')
    .postPriviledge('WRITE_CONTENT')
    .enabled(true)
    .build();

controllerMappings
    .adminController()
    .path('/manageSaleDataClaimer/(?<claimId>[^/]*)')
    .addMethod('GET', 'checkRedirect')
    .enabled(true)
    .build();

controllerMappings
    .adminController()
    .path('/manageSaleDataClaimer/(?<claimId>[^/]*)/')
    .addMethod('GET', 'getClaim')
    .enabled(true)
    .build();

function getClaims(page, params) {
    log.info('getClaims.admin.2 > page={}, params={}', page, params);

    if (!params.claimId) {
        try {
            var currentUser = securityManager.getCurrentUser();
            var queryJson = {
                'stored_fields': [
                'receipt',
                    'recordId',
                    'soldDate',
                    'soldBy',
                    'soldById',
                    'enteredDate',
                    'modifiedDate',
                    'amount',
                    'status',
                    'productSku'
                ],
                'sort': [
                    {
                        'modifiedDate': 'desc'
                    }
                ],
                'size': 10000,
                'query': {
                    'bool': {
                        'must': [
                            {'type': {'value': TYPE_RECORD}}
                        ]
                    }
                }
            };

            if (params.status) {
                queryJson.query.bool.must.push({
                    'term': {'status': +params.status}
                });
            } else {

            }

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


function changeClaimsStatus(status, page, params, callback) {
    log.info('changeClaimsStatus > status={}, page={}, params={}', status, page, params, callback);

    var result = {
        status: true
    };

    var action;
    switch (status) {
        case RECORD_STATUS.APPROVED:
            action = 'approving';
            break;

        case RECORD_STATUS.REJECTED:
            action = 'rejecting';
            break;
    }

    try {
        var db = getDB(page);
        var ids = params.ids;
        ids = ids.split(',');

        for (var i = 0; i < ids.length; i++) {
            (function (id) {
                var claim = db.child(id);

                if (claim !== null) {
                    claim.jsonObject.status = status;
                    claim.save();

                    var enteredUser = applications.userApp.findUserResourceById(claim.jsonObject.soldById);
                    var custProfileBean = enteredUser.extProfileBean;

                }
            })(ids[i]);
        }

        if (typeof callback === 'function') {
            callback(result);
        }
    } catch (e) {
        log.error("Exception in changeClaimsStatus", e);
        result.status = false;
        result.messages = ['Error in ' + action + ': ' + e];
    }

    return views.jsonObjectView(JSON.stringify(result))
}

function approveClaims(page, params) {
    log.info('approveClaims > page={}, params={}', page, params);

    return changeClaimsStatus(RECORD_STATUS.APPROVED, page, params, function (result) {
        try {
            var db = getDB(page);
            var ids = params.ids;
            ids = ids.split(',');

            var settings = getAppSettings(page);
            var selectedDataSeries = settings.get('dataSeries');
            var dataSeries = applications.salesData.getSalesDataSeries(selectedDataSeries);

            for (var i = 0; i < ids.length; i++) {
                (function (id) {
                    var claim = db.child(id);

                    if (claim !== null) {
                        var obj = {
                            soldById: claim.jsonObject.soldById,
                            amount: formatter.toBigDecimal(claim.jsonObject.amount),
                            soldDate: formatter.toDate(claim.jsonObject.soldDate),
                            enteredDate: formatter.toDate(claim.jsonObject.enteredDate),
                            productSku: claim.jsonObject.productSku
                        };

                        var enteredUser = applications.userApp.findUserResourceById(obj.soldById);
                        var custProfileBean = enteredUser.extProfileBean;
                        applications.salesData.insertDataPoint(dataSeries, obj.amount, obj.soldDate, obj.soldDate, enteredUser.thisUser, enteredUser.thisUser, obj.enteredDate, obj.productSku);

                        eventManager.goalAchieved('claimProcessedGoal', custProfileBean, {'claim': id, 'status': RECORD_STATUS.APPROVED});
                    }
                })(ids[i]);
            }
        } catch (e) {
            log.error("Exception in approveClaims.1 {}", e);
            result.status = false;
            result.messages = ['Error in approving.1: ' + e];
        }
    });
}

function rejectClaims(page, params) {
    log.info('rejectClaims > page={}, params={}', page, params);

    return changeClaimsStatus(RECORD_STATUS.REJECTED, page, params);
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
