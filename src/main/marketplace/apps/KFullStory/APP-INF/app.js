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

function saveSession(page, params) {
    log.info('saveSession > page={}, params={}', page, params);
    
    var db = getDB(page);
    
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