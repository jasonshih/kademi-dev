// admin controllers
controllerMappings
    .adminController()
    .path('/ksurvey/')
    .enabled(true)
    .defaultView(views.templateView('ksurveyapp/manageSurveys.html'))
    .addMethod('GET', 'getSurveys')
    .addMethod('POST', 'saveSurvey', 'saveSurvey')
    .addMethod('POST', 'deleteSurvey', 'deleteSurvey')
    .addMethod('POST', 'clearSurveyResult', 'clearSurveyResult')
    .build();

controllerMappings
    .adminController()
    .path('/ksurvey')
    .enabled(true)
    .addMethod("GET", "checkRedirect")
    .build();

controllerMappings
    .adminController()
    .path('/ksurvey/(?<surveyId>[^/]*)/')
    .enabled(true)
    .addPathResolver('surveyId', 'findSurvey')
    .defaultView(views.templateView('ksurveyapp/surveyDetail.html'))
    .addMethod('GET', 'getSurvey')
    .addMethod('POST', 'saveSurvey')
    .title('generateTitle')
    .build();

controllerMappings
    .adminController()
    .path('/ksurvey/(?<surveyId>[^/]*)')
    .enabled(true)
    .addMethod("GET", "checkRedirect")
    .build();

controllerMappings
    .adminController()
    .path('/ksurvey/saveGroupAccess/')
    .enabled(true)
    .addMethod('POST', 'saveGroupAccess')
    .build();

controllerMappings
    .adminController()
    .path('/ksurvey/answer/')
    .enabled(true)
    .addMethod('GET','deleteAnswer', 'deleteAnswer')
    .addMethod('GET','getPlainAnswers', 'getPlainAnswers')
    .addMethod('POST','saveAnswer')
    .build();

controllerMappings
    .adminController()
    .path('/ksurvey/clearResult/')
    .enabled(true)
    .addMethod('POST','clearResult')
    .build();

controllerMappings
    .adminController()
    .path('/ksurvey/question/')
    .enabled(true)
    .addMethod('GET','getQuestion','getQuestion')
    .addMethod('GET','deleteQuestion','deleteQuestion')
    .addMethod('POST','saveQuestion')
    .build();

// website controllers
controllerMappings
    .websiteController()
    .path('/ksurvey/')
    .enabled(true)
    .defaultView(views.templateView('ksurveyapp/manageSurveys.html'))
    .addMethod('GET', 'getSurveys')
    .build();

controllerMappings
    .websiteController()
    .path('/ksurvey')
    .enabled(true)
    .addMethod("GET", "checkRedirect")
    .build();

controllerMappings
    .websiteController()
    .path('/ksurvey/(?<surveyId>[^/]*)/')
    .enabled(true)
    .postPriviledge("READ_CONTENT")
    .addPathResolver('surveyId', 'findSurvey')
    .defaultView(views.templateView('ksurveyapp/surveyDetail.html'))
    .addMethod('GET', 'getSurvey')
    .addMethod('POST', 'submitSurvey')
    .title('generateWebsiteTitle')
    .build();

controllerMappings
    .websiteController()
    .path('/ksurvey/(?<surveyId>[^/]*)')
    .enabled(true)
    .addMethod("GET", "checkRedirect")
    .build();

controllerMappings
    .websiteController()
    .path('/ksurvey/(?<surveyId>[^/]*)/result/')
    .enabled(true)
    .addPathResolver('surveyId', 'findSurvey')
    .defaultView(views.templateView('ksurveyapp/surveyResult.html'))
    .addMethod('GET', 'getSurvey')
    .title('generateWebsiteTitle')
    .build();

controllerMappings
    .websiteController()
    .path('/ksurvey/(?<surveyId>[^/]*)/result')
    .enabled(true)
    .addMethod("GET", "checkRedirect")
    .build();

function initApp(orgRoot, webRoot, enabled){
    log.info("initApp ksurveyapp: orgRoot={}", orgRoot);

    var dbs = orgRoot.find('jsondb');
    var db = dbs.child(DB_NAME);
    
    if (isNull(db)) {
        log.info('{} does not exist!', DB_TITLE);

        db = dbs.createDb(DB_NAME, DB_TITLE, DB_NAME);

        saveMapping(db);
    }
}

function checkRedirect(page, params) {
    var href = page.href;
    if (!href.endsWith('/')) {
        href = href + '/';
    }

    return views.redirectView(href);
}


controllerMappings.addNodeType("ksurveySubmittedGoal", "ksurveyapp/ksurveySubmittedGoalNode.js");

controllerMappings.addComponent("ksurveyapp", "ksurveyEmail", "email", "Shows button with link to survey", "Ksurvey App component");
controllerMappings.addComponent("ksurveyapp", "ksurveyForm", "html", "Shows survey form questions", "Ksurvey App component");
controllerMappings.addComponent("ksurveyapp", "ksurveyResult", "html", "Shows survey result", "Ksurvey App component");
controllerMappings.addComponent("ksurveyapp", "ksurveyList", "html", "Shows surveys list", "Ksurvey App component");
controllerMappings.journeyFieldsFunction(loadSurveyFields);

function loadSurveyFields(rootFolder, fields){
    log.info('KSurvey: loadSurveyFields');
    var jsonDB = applications.KongoDB.findDatabase(DB_NAME);
    log.info('jsondb is {}', jsonDB);
    var questions = jsonDB.findByType(RECORD_TYPES.QUESTION);
    log.info('questions count {}', questions.length);
    questions.forEach(function(q){
        log.info('question {}',  q);
        var surveyId = q.jsonObject.surveyId;

        if (q.jsonObject.type == 1){
            // Plain text question
            fields.addTextJourneyField( "ksurvey-"+ q.name, "KSurvey: "+ q.jsonObject.title, function(){
                log.info ('callback function {}', arguments);
                log.info ('question name {}', q.name);

                var lead = arguments[0];
                var profileId = lead.profile.name;
                log.info("loadSurveyFields: profileid={}", profileId);
                return getKsurveyFields(profileId, q.name, surveyId, true);
            });

        } else {
            var answers = getAnswersByQuestion(q.name, surveyId);
            fields.addSelectJourneyField( "ksurvey-"+ q.name, "KSurvey: "+ q.jsonObject.title, 'string', answers, ['contains', 'not_contains'], function(){
                log.info ('callback function {}', arguments);
                log.info ('question name {}', q.name);

                var lead = arguments[0];
                var profileId = lead.profile.name;

                log.info("loadSurveyFields: profileid={}", profileId);
                return getKsurveyFields(profileId, q.name, surveyId, false);
            });
        }

    });
}


function getKsurveyFields(profileId, questionId, surveyId, plainText) {
    var jsonDB = applications.KongoDB.findDatabase(DB_NAME);
    log.info('jsondb is {}', jsonDB);

    var db = jsonDB;
    if( db == null ) {
        log.error("Could not find database " + DB_NAME );
        return null;
    }

    var queryJson = {
        'stored_fields': ['answerBody', 'answerId'],
        'query': {
            'bool': {
                'must': [
                    {'type': { 'value': RECORD_TYPES.RESULT } },
                    {"term": {"userId": profileId} },
                    {"term": {"questionId": questionId} },
                    {"term": {"surveyId": surveyId} }
                ]
            }
        },
        'size': 100,
        'sort': [
            { "createdDate" : "desc" }
        ]
    };

    // find most recent response from this profile
    var searchResult = db.search(JSON.stringify(queryJson));
    log.info('getKsurveyFields search hit {}', searchResult.hits.totalHits);
    if (searchResult.hits.totalHits > 0){
        if (plainText) {
            var hit = searchResult.hits.hits[0];
            log.info('getKsurveyFields answerBody {}', hit.fields.answerBody.value);
            return hit.fields.answerBody.value;
        } else {
            var listAnswers = [];
            for(var i = 0; i < searchResult.hits.hits.length; i++){
                var hit = searchResult.hits.hits[i];
                log.info('getKsurveyFields answerId {}', hit.fields.answerId.value);
                // we need to return answer text to compare
                var answer = db.child(hit.fields.answerId.value);
                log.info('getKsurveyFields answer body {}', answer.jsonObject.body);
                listAnswers.push(answer.jsonObject.body);
            }
            log.info(' ZZANH {}', listAnswers);
            return listAnswers.join(' @KSURVEY@ ');
        }

    }
}

function getAnswersByQuestion(questionId, surveyId) {
    log.info('getAnswersByQuestion is {} {}', questionId, surveyId);
    var jsonDB = applications.KongoDB.findDatabase(DB_NAME);
    log.info('jsondb is {}', jsonDB);

    var db = jsonDB;
    if( db == null ) {
        log.error("Could not find database " + DB_NAME );
        return null;
    }

    var queryJson = {
        'stored_fields': ['body'],
        'query': {
            'bool': {
                'must': [
                    {'type': { 'value': RECORD_TYPES.ANSWER } },
                    {"term": {"questionId": questionId} },
                    {"term": {"surveyId": surveyId} }
                ]
            }
        },
        'size': 100
    };
    // find most recent response from this profile
    var searchResult = db.search(JSON.stringify(queryJson));
    log.info('search hit {}', searchResult.hits.totalHits);
    var arr = [];
    for (var i = 0; i < searchResult.hits.hits.length; i++){
        var hit = searchResult.hits.hits[i];
        log.info('getAnswersByQuestion answer body {}', hit.fields.body.value);
        arr.push(hit.fields.body.value);
    }

    return arr;
}