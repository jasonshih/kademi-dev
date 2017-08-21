controllerMappings.addComponent("salesDataClaimer/components", "claimForm", "html", "Displays form to enter a new sales claim", "Sales Data Claimer");
controllerMappings.addComponent("salesDataClaimer/components", "claimsList", "html", "Displays list of claims in table format", "Sales Data Claimer");
controllerMappings.addComponent("salesDataClaimer/components", "claimsPending", "html", "Displays pending claim need to approve", "Sales Data Claimer");

function initApp(orgRoot, webRoot, enabled) {
    log.info("initApp SalesDataClaimer: orgRoot={}", orgRoot);
    
    var dbs = orgRoot.find(JSON_DB);
    if (isNull(dbs)) {
        page.throwNotFound('KongoDB is disabled. Please enable it for continue with this app!');
        return;
    }
    
    var db = dbs.child(DB_NAME);
    if (isNull(db)) {
        log.info('{} does not exist!', DB_TITLE);
        db = dbs.createDb(DB_NAME, DB_TITLE, DB_NAME);
        
        if (!db.allowAccess) {
            setAllowAccess(db, true);
        }
    }
    
    saveMapping(db);
}

function saveSettings(page, params) {
    log.info('saveSettings > page={}, params={}', page, params);
    
    var dataSeries = params.dataSeries || '';
    
    page.setAppSetting(APP_NAME, 'dataSeries', dataSeries);
    
    return views.jsonResult(true);
};


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
};

function checkRedirect(page, params) {
    var href = page.href;
    if (!href.endsWith('/')) {
        href = href + '/';
    }
    
    return views.redirectView(href);
}

