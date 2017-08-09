controllerMappings
    .adminController()
    .path("/kfeedback/")
    .enabled(true)
    .defaultView(views.templateView("kfeedback/index.html"))
    .build();

controllerMappings
    .adminController()
    .path("/kfeedback/uploadFiles")
    .enabled(true)
    .addMethod("POST", "uploadFile")
    .build();

controllerMappings
    .adminController()
    .path("/kfeedback/feedbacks/")
    .enabled(true)
    .addMethod("GET", "getFeedbackBySurvey")
    .build();

controllerMappings
    .adminController()
    .path("/kfeedback/surveys/")
    .enabled(true)
    .addMethod("GET", "getAllSurveys")
    .addMethod("POST", "createSurvey")
    .build();

/**
 * front end mapping
 */
controllerMappings
    .websiteController()
    .path("/send-feedback/")
    .enabled(true)
    .isPublic(true)
    .defaultView(views.templateView("kfeedback/index.html"))
    .build();

controllerMappings
    .websiteController()
    .path("/send-feedback-api/")
    .enabled(true)
    .isPublic(true)
    .addMethod("GET", "getSurvey")
    .addMethod("POST", "createFeedback")
    .postPriviledge("READ_CONTENT")
    .build();

controllerMappings.addNodeType("kfeedbackSubmittedGoal", "kfeedback/jb/kfeedbackSubmittedGoalNode.js");

controllerMappings.addComponent("kfeedback", "kfeedbackEmail", "email", "Shows emoticons with links", "Kfeedback App component");

controllerMappings.addTextJourneyField("kfeedback-result", "KFeedback result", "getLastFeedbackResult"); // see function below


function getLastFeedbackResult(lead, exitingNode, funnel, vars) {
    log.info('getLastFeedbackResult lead={} node={} funnel={} vars={}', [lead, exitingNode, funnel, vars]);
    var profileId = lead.profile.id;
    log.info("getLastFeedbackResult: profileid={}", profileId);
    var jsonDB = applications.KongoDB.findDatabase(dbName);
    log.info('jsondb is {}', jsonDB);
    
    var db = jsonDB;
    if (db == null) {
        log.error("Could not find database " + dbName);
        return null;
    }
    var queryJson = {
        '_source': ['option_slug'],
        'query': {
            'bool': {
                'must': {
                    "term": {"profileId": profileId}
                }
            }
        },
        'size': 1,
        'sort': [
            {"created": "desc"}
        ]
    };
    // find most recent response from this profile
    var searchResult = db.search(JSON.stringify(queryJson));
    log.info('search hit {}', searchResult.hits.totalHits);
    if (searchResult.hits.totalHits > 0) {
        var hit = searchResult.hits.hits[0];
        log.info('option slug return {}', hit.fields.option_slug.value);
        return hit.fields.option_slug.value;
    }
}

function initApp(orgRoot, webRoot, enabled) {
    log.info("initApp Kfeedback: orgRoot={}", orgRoot);
    
    var dbs = orgRoot.find(JSON_DB);
    if (isNull(dbs)) {
        page.throwNotFound('KongoDB is disabled. Please enable it for continue with this app!');
        return;
    }
    var db = dbs.child(dbName);
    
    if (isNull(db)) {
        log.info('{} does not exist!', dbTitle);
        db = dbs.createDb(dbName, dbTitle, dbName);
        
        if (!db.allowAccess) {
            setAllowAccess(db, true);
        }
    }
    
    saveMapping(db);
}

function setAllowAccess(db, allowAccess) {
    transactionManager.runInTransaction(function () {
        db.setAllowAccess(allowAccess);
    });
}

function uploadFile(page, params, files) {
    log.info('uploadFile > page {} params {} files {}', page, params, files);
    if (files !== null || !files.isEmpty()) {
        var filesArray = files.entrySet().toArray();
        
        for (var i = 0; i < filesArray.length; i++) {
            var file = filesArray[i].getValue();
            var fileHash = fileManager.uploadFile(file);
            
            return views.jsonObjectView({
                type: file.contentType,
                size: file.size,
                uploaded: new Date(),
                hash: fileHash
            });
        }
    }
}
