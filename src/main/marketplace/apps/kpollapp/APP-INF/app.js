// ============================================================================
// initApp
// ============================================================================
function initApp(orgRoot, webRoot, enabled) {
    log.info("initApp kpollapp > orgRoot={}, webRoot={}", orgRoot, webRoot);
    
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

// ============================================================================
// Admin Utilities
// ============================================================================
controllerMappings
    .adminController()
    .path('/updateMappingKpoll')
    .addMethod('POST', 'updateMapping')
    .enabled(true)
    .build();

// ============================================================================
// Components
// ============================================================================
controllerMappings.addComponent("kpollapp/components", "kpoll", "html", "Shows polls", "KPoll App component");
controllerMappings.addComponent("kpollapp/components", "kpollsTile", "html", "Shows polls in tile format", "KPoll App component;Tile component");

// ============================================================================
// JB Nodes
// ============================================================================
controllerMappings.addGoalNodeType("kpollAnsweredGoal", "kpollapp/kpollAnsweredGoalNode.js", null);