controllerMappings
    .adminController()
    .path('/kpoll/managePolls/(?<pollId>[^/]*)')
    .enabled(true)
    .addPathResolver('pollId', 'checkPollId')
    .defaultView(views.templateView('kpollapp/managePoll.html'))
    .addMethod('GET', 'managePoll')
    .addMethod('POST', 'managePollGroups', 'group')
    .addMethod('POST', 'clearAnswerers', 'clearAnswerers')
    .title('genTitle')
    .build();

controllerMappings
    .adminController()
    .path('/kpoll/managePolls/(?<pollId>[^/]*)/viewResult')
    .enabled(true)
    .addPathResolver('pollId', 'checkPollId')
    .defaultView(views.templateView('kpollapp/viewResult.html'))
    .addMethod('GET', 'viewResult')
    .title('genTitle')
    .build();

function managePoll(page, params) {
    log.info('managePoll > page={}, param={}', page, params);
    
    var poll = page.attributes.pollId;
    var result = getAnswers(page, poll.name);
    page.attributes.poll = poll;
    page.attributes.answers = result.answers;
    page.attributes.searchResult = result.searchResult;
}

function viewResult(page, params) {
    log.info('viewResult > page={}, param={}', page, params);
    
    managePoll(page, params);
}

function managePollGroups(page, params) {
    log.info('managePollGroups > page={}, param={}', page, params);
    
    var poll = page.attributes.pollId;
    var status = {
        'data': null,
        'fieldMessages': [],
        'messages': [],
        'nextHref': '',
        'status': true
    };
    
    var group = params.group;
    var isAdd = params.isAdd;
    var groups = toJsArray(poll.jsonObject.groups);
    var indexOf = groups.indexOf(group);
    
    if (isAdd === 'true') {
        log.info('Add group "{}" into list', group);
        
        if (indexOf === -1) {
            groups.push(group);
        } else {
            log.info('Group "{}" is ready in list', group);
            return views.jsonObjectView(JSON.stringify(status)).wrapJsonResult();
        }
    } else {
        log.info('Remove group "{}" out of list', group);
        
        if (indexOf === -1) {
            log.info('Group "{}" is not in list', group);
            return views.jsonObjectView(JSON.stringify(status)).wrapJsonResult();
        } else {
            groups.splice(indexOf, 1);
        }
    }
    
    var data = editPollData(poll, {
        groups: groups
    });
    
    poll.update(JSON.stringify(data), RECORD_TYPES.POLL);
    
    return views.jsonObjectView(JSON.stringify(status)).wrapJsonResult();
}

function clearAnswerers(page, params) {
    log.info('clearAnswerers > page={}, params={}', page, params);
    
    var poll = page.attributes.pollId;
    var queryJson = {
        'sort': {
            'date': 'desc'
        },
        'stored_fields': [
            'user',
            'answer',
            'date'
        ],
        'size': 10000,
        'query': {
            'bool': {
                'must': [{
                    'type': {
                        'value': RECORD_TYPES.ANSWERER
                    }
                }],
                'filter': [
                    {
                        'term': {
                            'pollId': poll.name
                        }
                    }
                ]
            }
        }
    };
    var searchResult = doDBSearch(page, queryJson);
    log.info('There are {} answerer(s)', searchResult.hits.totalHits);
    
    var kpollDB = getDB(page);
    for (var i = 0; i < searchResult.hits.hits.length; i++) {
        var anwserer = searchResult.hits.hits[i];
        var record = kpollDB.child(anwserer.getId());
        
        if (isNotNull(record)) {
            record.delete();
        }
    }
    
    return views.jsonObjectView(JSON.stringify({
        status: true,
        messages: ['Deleted ' + searchResult.hits.totalHits + ' answerer(s)!']
    }));
}
