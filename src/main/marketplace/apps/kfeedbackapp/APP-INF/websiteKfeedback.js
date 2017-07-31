/**
 * get survey detail controlller
 * @param {Page} page
 * @param {Json} params
 */
function getSurvey(page, params) {
    var jsonDB = page.find(JSON_DB);
    var db = jsonDB.find(dbName);

    var surveySlug = params.survey;
    var result = {
        status: 0,
        msg: 'Survey is not exist'
    };

    if (isNull(jsonDB) || isNull(db) || surveySlug == null) {
        return views.textView(JSON.stringify({
            status: 0,
            msg: 'Survey is not exist'
        }));
    } else {
        var exists = db.child(surveySlug);
        log.warn(JSON.parse(exists.jsonObject));
        if (isNotNull(exists)) {
            result = {
                status: 1,
                survey: JSON.parse(exists.jsonObject)
            };
            var currentUser = page.find(params.miltonUserUrl);
            if (currentUser !== null) {
                log.info('current user {}', currentUser);
                result.survey.userId = currentUser.userId;
                result.survey.miltonUserUrl = params.miltonUserUrl;
            }
        }
    }

    return views.jsonObjectView(JSON.stringify(result));
}


/**
 * create feedback controlller
 * @param {Page} page
 * @param {Json} params
 */
function createFeedback(page, params) {
    var jsonDB = page.find(JSON_DB);
    var db = jsonDB.child(dbName);

    if (db === null) {
        db = jsonDB.createDb(dbName, dbTitle, dbType);

        log.info("Start create access");
        var createdDB = page.find(JSON_DB + '/' + dbName);
        transactionManager.begin();
        createdDB.setAllowAccess(true);
        createdDB.setAllowRest(true);
        transactionManager.commit();
        log.info("End create access");

        return views.textView(JSON.stringify({
            status: 0,
            msg: 'Please update and set allow access for database before use'
        }));
    }

    var cur = (new Date).getTime();


    var surveyId = params.survey;
    var survey = null;
    if (!surveyId) {
        return views.textView(JSON.stringify({
            status: 0,
            msg: 'Please send survey id'
        }));
    } else {
        survey = db.child(surveyId);
    }

    var feedback = {
        survey_id: surveyId,
        option_slug: params.option_slug,
        option_text: params.option_text,
        website: params.website,
        created: cur,
        profileId: params.profileId,
        processed: false
    };

    securityManager.runAsUser(survey.jsonObject.profileId, function () {
        db.createNew(cur, JSON.stringify(feedback), TYPE_FEEDBACK);
    });

    if (params.miltonUserUrl) {
        var userResource = page.find(params.miltonUserUrl);
        if (userResource) {
            var profileBean = userResource.profile;
            eventManager.goalAchieved("kfeedbackSubmittedGoal", profileBean);
        }
    } else {
        eventManager.goalAchieved("kfeedbackSubmittedGoal", {feedback: surveyId});
    }

    return views.jsonObjectView(JSON.stringify({
        status: 1,
        feedback: feedback
    }));
}
