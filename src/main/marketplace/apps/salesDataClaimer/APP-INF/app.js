controllerMappings.addQuery("/APP-INF/queries/claimsOverTime.query.json", ["salesDataClaimer"], ["ReportsViewer"]);

controllerMappings.addComponent("salesDataClaimer/components", "claimsList", "html", "Displays list of claims in table format", "Sales Data Claimer");
controllerMappings.addComponent("salesDataClaimer/components", "claimsMade", "html", "Displays a number of claims made", "Sales Data Claimer");
controllerMappings.addComponent("salesDataClaimer/components", "claimsPending", "html", "Displays a number of pending claims", "Sales Data Claimer");
controllerMappings.addComponent("salesDataClaimer/components", "claimsTotalAmount", "html", "Displays the total amount $ of claims", "Sales Data Claimer");
controllerMappings.addComponent("salesDataClaimer/components", "claimForm", "html", "Displays claim form", "Sales Data Claimer");
controllerMappings.addComponent("salesDataClaimer/components", "claimsOverTime", "html", "Displays histogram of claims over time", "Sales Data Claimer");

controllerMappings.addGoalNodeType("claimSubmittedGoal", "salesDataClaimer/claimSubmittedGoalNode.js", "checkSubmittedGoal");
function checkSubmittedGoal(rootFolder, lead, funnel, eventParams, customNextNodes, customSettings, event, attributes) {
    log.info('checkSubmittedGoal > lead={}, funnel={}, eventParams={}, customNextNodes={}, customSettings={}, event={}', lead, funnel, eventParams, customNextNodes, customSettings, event);
    if (!lead) {
        return true;
    }
    
    var claimId = attributes.get(LEAD_CLAIM_ID);
    
    if (isNotBlank(claimId)) {
        // Process only for this claim ID
        return safeString(eventParams.claim) === safeString(claimId);
    } else {
        attributes.put(LEAD_CLAIM_ID, eventParams.claim);
        
        return true;
    }
    
    return false;
}

controllerMappings.addGoalNodeType("claimProcessedGoal", "salesDataClaimer/claimProcessedGoalNode.js", "checkProcessedGoal");
function checkProcessedGoal(rootFolder, lead, funnel, eventParams, customNextNodes, customSettings, event, attributes) {
    log.info('checkProcessedGoal > lead={}, funnel={}, eventParams={}, customNextNodes={}, customSettings={}, event={}', lead, funnel, eventParams, customNextNodes, customSettings, event);
    if (!lead) {
        return true;
    }
    
    var claimId = attributes.get(LEAD_CLAIM_ID);
    
    if (isNotBlank(claimId)) {
        // Process only for this claim ID
        return safeString(eventParams.claim) === safeString(claimId);
    } else {
        attributes.put(LEAD_CLAIM_ID, eventParams.claim);
        
        return true;
    }
    
    return false;
}

function initApp(orgRoot, webRoot, enabled) {
    log.info("initApp SalesDataClaimer > orgRoot={}, webRoot={}", orgRoot, webRoot);
    
    var dbs = orgRoot.find(JSON_DB);
    if (isNull(dbs)) {
        log.error('ERROR: KongoDB is disabled. Please enable it for continue with this app!');
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
    var allowAnonymous = params.allowAnonymous || '';
    
    page.setAppSetting(APP_NAME, 'dataSeries', dataSeries);
    page.setAppSetting(APP_NAME, 'allowAnonymous', allowAnonymous);
    
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

function isAnonymousAllowed(page) {
    log.info('isAnonymousAllowed > page={}', page);
    
    var allowAnonymous = false;
    var settings = getAppSettings(page);
    
    if (isNotNull(settings)) {
        allowAnonymous = settings.allowAnonymous === 'true';
    }
    
    return allowAnonymous;
}

function checkRedirect(page, params) {
    var href = page.href;
    if (!href.endsWith('/')) {
        href = href + '/';
    }
    
    return views.redirectView(href);
}

