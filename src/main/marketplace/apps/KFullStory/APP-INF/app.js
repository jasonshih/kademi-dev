// ============================================================================
// On Enable
// ============================================================================
function initKFullStory(orgRoot, webRoot, enabled) {
    log.info("initKFullStory: orgRoot={} app={}", orgRoot);
    
    if (webRoot) {
        var jsonDB = orgRoot.find(JSON_DB)
        
        if (isNull(jsonDB)) {
            page.throwNotFound('KongoDB is disabled. Please enable it for continue with this app!');
            return;
        }
        var db = jsonDB.child(DB_NAME);
        
        if (isNull(db)) {
            log.info('{} does not exist!', DB_TITLE);
            db = jsonDB.createDb(DB_NAME, DB_TITLE, DB_NAME);
            
            if (!db.allowAccess) {
                setAllowAccess(db, true);
            }
        }
        
        saveMapping(db);
    } else {
        log.info("I'm in an organisation");
    }
}

// ============================================================================
// /kfullstory/storeSession
// ============================================================================
controllerMappings
    .websiteController()
    .path("/kfullstory/storeSession")
    .enabled(true)
    .isPublic(true)
    .addMethod("POST", "saveSession")
    .postPriviledge("READ_CONTENT")
    .build();

controllerMappings
    .setUserTimelineFunction('generateProfileTimeline');

function generateProfileTimeline(page, userResource, list) {
    var queryJson = {
        'sort': {
            'savedDate': 'desc'
        },
        'stored_fields': [
            'session',
            'userId',
            'savedDate'
        ],
        'size': 999,
        'query': {
            'bool': {
                'must': [{
                    'type': {
                        'value': TYPE_RECORD
                    }
                }],
                'filter': [
                    {
                        'term': {
                            'userId': userResource.userId
                        }
                    }
                ]
            }
        }
    };
    var searchResult = doDBSearch(page, queryJson);
    
    if (searchResult && searchResult.hits.totalHits > 0) {
        for (var i = 0; i < searchResult.hits.totalHits; i++) {
            var record = searchResult.hits.hits[i];
            
            var bean = applications.stream.streamEventBuilder()
                .profile(userResource)
                .category('info')
                .icon('fa fa-play-circle')
                .desc('Your session url: ' + record.fields.session.value)
                .title('FullStory session is started')
                .inbound(false)
                .date(formatter.parseDate(record.fields.savedDate.value))
                .build();
            
            list.add(bean);
        }
    }
}

function saveSession(page, params) {
    log.info('saveSession > page={}, params={}', page, params);
    
    var db = getDB(page);
    var currentUser = securityManager.currentUser;
    
    var queryJson = {
        'stored_fields': [
            'session',
            'userId'
        ],
        'size': 1,
        'query': {
            'bool': {
                'must': [{
                    'type': {
                        'value': TYPE_RECORD
                    }
                }],
                'filter': [
                    {
                        'term': {
                            'session': params.session
                        }
                    }, {
                        'term': {
                            'userId': currentUser.userId
                        }
                    }
                ]
            }
        }
    };
    var searchResult = doDBSearch(page, queryJson);
    
    if (searchResult && searchResult.hits.totalHits > 0) {
        // Do nothing
    } else {
        var recordName = 'record-' + generateRandomText(32);
        
        securityManager.runAsUser(currentUser, function () {
            db.createNew(recordName, JSON.stringify({
                recordId: recordName,
                session: params.session,
                userId: currentUser.userId,
                savedDate: (new Date()).toISOString()
            }), TYPE_RECORD);
        });
    }
}

// ============================================================================
// Settings
// ============================================================================
function saveSettings(page, params) {
    log.info('saveSettings > page={}, params={}', page, params);
    
    var kfullstoryOrgId = params.kfullstoryOrgId || '';
    
    page.setAppSetting(APP_NAME, 'kfullstoryOrgId', kfullstoryOrgId);
    
    return views.jsonResult(true);
}


function getAppSettings(page) {
    log.info('getAppSettings > page={}', page);
    
    var websiteFolder = page.closest('websiteVersion');
    var org = page.organisation;
    var branch = null;
    
    if (websiteFolder !== null && typeof websiteFolder !== 'undefined') {
        branch = websiteFolder.branch;
    }
    
    var app = applications.get(APP_NAME);
    if (app !== null) {
        var settings = app.getAppSettings(org, branch);
        return settings;
    }
    
    return null;
}

// ============================================================================
// Portlet
// ============================================================================

// ============================================================================
// Portlet
// ============================================================================

// ============================================================================
// Portlet
// ============================================================================
controllerMappings
    .websitePortletController()
    .portletSection('header')
    .templatePath('/theme/apps/KFullStory/kfullstory.html')
    .method('getKFullStory')
    .enabled(true)
    .build();

function getKFullStory(page, params, context) {
    log.info('getKFullStory');
    
    var appSettings = getAppSettings(page);
    
    context.put('appSettings', appSettings);
}