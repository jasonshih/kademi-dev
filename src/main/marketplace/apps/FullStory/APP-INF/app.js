// ============================================================================
// On Enable
// ============================================================================
function initFullStory(orgRoot, webRoot, enabled) {
    log.info("initFullStory: orgRoot={} app={}", orgRoot);

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

        var currentUser = securityManager.currentUser;
        var savedUser = db.child(TYPE_DEFAULT_USER);

        if (isNull(savedUser)) {
            savedUser = db.createNew(TYPE_DEFAULT_USER, JSON.stringify({
                'userId': currentUser.userId,
                'userName': currentUser.name
            }), TYPE_DEFAULT_USER);
        }

    } else {
        log.info("I'm in an organisation");
    }
}

// ============================================================================
// /fullstory/storeSession
// ============================================================================
controllerMappings
        .websiteController()
        .path("/fullstory/storeSession")
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
                    .title('FullStory session is started')
                    .path(record.fields.session.value)
                    .inbound(true)
                    .date(formatter.parseDate(record.fields.savedDate.value))
                    .build();

            list.add(bean);
        }
    }
}

function saveSession(page, params) {
    log.info('saveSession > page={}, params={}', page, params);

    var db = getDB(page);
    var trackingApp = applications.tracking;
    var trackingId = null;
    var currentUser = securityManager.currentUser;
    var savedUser = db.child(TYPE_DEFAULT_USER);

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
                    }
                ]
            }
        }
    };

    if (isNotNull(currentUser)) {
        queryJson.query.bool.filter.push({
            'term': {
                'userId': currentUser.userId
            }
        });
    }

    if (isNotNull(trackingApp)) {
        trackingId = trackingApp.checkTracker();
        if (isNotBlank(trackingId)) {
            queryJson.query.bool.filter.push({
                'term': {
                    'trackingId': trackingId
                }
            });
        }
    }

    var searchResult = doDBSearch(page, queryJson);

    if (searchResult && searchResult.hits.totalHits > 0) {
        // Do nothing
    } else {
        var recordName = 'record-' + generateRandomText(32);

        var d = {
            recordId: recordName,
            session: params.session,
            savedDate: (new Date()).toISOString()
        };

        if (isNotBlank(trackingId)) {
            d.trackingId = trackingId;
        }

        if (isNotNull(currentUser)) {
            d.userId = currentUser.userId;
        }
        
        var runAsUser = isNotNull(currentUser) ? currentUser : savedUser.userName;

        securityManager.runAsUser(runAsUser, function () {
            db.createNew(recordName, JSON.stringify(d), TYPE_RECORD);
        });
    }
}

// ============================================================================
// Settings
// ============================================================================
function saveSettings(page, params) {
    log.info('saveSettings > page={}, params={}', page, params);

    var fullstoryOrgId = params.fullstoryOrgId || '';

    page.setAppSetting(APP_NAME, 'fullstoryOrgId', fullstoryOrgId);

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
        .templatePath('/theme/apps/FullStory/fullstory.html')
        .method('getFullStory')
        .enabled(true)
        .build();

function getFullStory(page, params, context) {
    log.info('getFullStory');

    var appSettings = getAppSettings(page);

    context.put('appSettings', appSettings);
}