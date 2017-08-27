function getKpollDB(page) {
    var jsonDB = page.find('/jsondb/');
    
    if (isNull(jsonDB)) {
        page.throwNotFound('KongoDB is disabled. Please enable it for continue with this app!');
        return;
    }
    
    var kpollDB = jsonDB.child(DB_NAME);
    
    if (isNull(kpollDB)) {
        log.info('Kpoll DB does not exist!');
        
        kpollDB = jsonDB.createDb(DB_NAME, DB_TITLE, DB_NAME);
        setupDB(kpollDB);
    }
    
    if (!kpollDB.allowAccess) {
        setAllowAccess(kpollDB, true);
    }
    
    return kpollDB;
}

function setupDB(kpollDB) {
    var b = formatter.newMapBuilder();
    b.field(RECORD_TYPES.POLL, JSON.stringify(pollMappings));
    kpollDB.updateTypeMappings(b);
    
    var c = formatter.newMapBuilder();
    c.field(RECORD_TYPES.ANSWERER, JSON.stringify(answererMappings));
    kpollDB.updateTypeMappings(c);
}

function getPolls(page) {
    log.info('getPolls > page={} ', page);
    
    var kpollDB = getKpollDB(page);
    var polls = kpollDB.findByType(RECORD_TYPES.POLL);
    
    log.info('Found {} poll(s)', polls.length);
    
    return polls;
}

function getPollById(page, pollId) {
    log.info('getPollById > page={}, pollId={}', [page, pollId]);
    
    var kpollDB = getKpollDB(page);
    var poll = kpollDB.child(pollId);
    
    return poll;
}

function doDBSearch(page, queryJson) {
    log.info('doDBSearch > page={}', page);
    
    var kpollDB = getKpollDB(page);
    var queryString = JSON.stringify(queryJson);
    log.info('query={}', queryString);
    
    var searchResult = kpollDB.search(queryString);
    if (isNull(searchResult)) {
        log.info('searchResult=null');
    } else {
        log.info('searchResult={}', searchResult);
    }
    
    return searchResult;
}

function getAnswerByUser(page, pollId, user) {
    log.info('getAnswerByUser > page={}, pollId={}, user={}', [page, pollId, user]);
    var queryJson = {
        'stored_fields': [
            'user',
            'pollId',
            'answer',
            'date'
        ],
        'size': 1,
        'query': {
            'bool': {
                'must': [{
                    'type': {
                        'value': RECORD_TYPES.ANSWERER
                    }
                }],
                'filter': [{
                    'term': {
                        'pollId': pollId
                    }
                }, {
                    'term': {
                        'user': user
                    }
                }]
            }
        }
    };
    
    var searchResult = doDBSearch(page, queryJson);
    var answer = null;
    
    if (searchResult.hits.totalHits > 0) {
        answer = searchResult.hits.hits[0];
        answer.id = answer.getId();
    }
    
    return answer;
}

function getAnswers(page, pollId) {
    log.info('getAnswers > page={}, pollId={}', [page, pollId]);
    
    var poll = getPollById(page, pollId);
    var queryJson = {
        'sort': {
            'date': 'desc'
        },
        '_source': [
            'user',
            'answer',
            'date'
        ],
        'size': 10000,
        'query': {
            'bool': {
                'must': [
                    {
                        'type': {
                            'value': RECORD_TYPES.ANSWERER
                        }
                    },
                    {
                        'term': {
                            'pollId': pollId
                        }
                    }
                ],
            }
        },
        'aggregations': {
            'answers': {
                'terms': {
                    'field': 'answer'
                }
            }
        }
    };
    
    var searchResult = doDBSearch(page, queryJson);
    var answered = {};
    var answers = {
        total: searchResult.hits.totalHits,
        list: []
    };
    
    // Check user answers
    if (searchResult.hits.totalHits > 0) {
        var buckets = [];
        if (searchResult.aggregations && searchResult.aggregations.get('answers') && searchResult.aggregations.get('answers').buckets) {
            buckets = searchResult.aggregations.get('answers').buckets;
        }
        
        for (var i = 0; i < buckets.length; i++) {
            var ans = buckets[i];
            
            answered[ans.key] = {
                hit: ans.docCount,
                percent: safeInt(((ans.docCount / searchResult.hits.totalHits) * 100).toFixed(3))
            };
        }
    }
    
    log.info('answered={}', JSON.stringify(answered));
    
    for (var i = 0; i < poll.jsonObject.answers.length; i++) {
        var ans = poll.jsonObject.answers[i];
        
        answers.list.push({
            answer: ans,
            hit: answered[ans] ? answered[ans].hit : 0,
            percent: answered[ans] ? answered[ans].percent : 0,
        });
    }
    
    return {
        answers: answers,
        searchResult: searchResult
    };
}

function generatePollId() {
    return RECORD_TYPES.POLL + '-' + generateRandomText(32);
}

function generateAnswererId() {
    return RECORD_TYPES.ANSWERER + '-' + generateRandomText(32);
}

function editPollData(currentData, newData) {
    var data = {};
    
    for (var key in currentData.jsonObject) {
        if (key === 'groups' || key === 'answers') {
            data[key] = toJsArray(currentData.jsonObject[key]);
        } else {
            data[key] = currentData.jsonObject[key];
        }
    }
    
    for (var key in newData) {
        data[key] = newData[key];
    }
    
    return data;
}

function setAllowAccess(jsonDB, allowAccess) {
    transactionManager.runInTransaction(function () {
        jsonDB.setAllowAccess(allowAccess);
    });
}

function updatePollMapping(page) {
    var kpollDB = getKpollDB(page);
    kpollDB.updateTypeMappings(RECORD_TYPES.POLL, JSON.stringify(pollMappings));
}

function updateAnswerMapping(page) {
    var kpollDB = getKpollDB(page);
    kpollDB.updateTypeMappings(RECORD_TYPES.ANSWERER, JSON.stringify(answererMappings));
}

function checkPollId(rf, groupName, groupVal, mapOfGroups) {
    log.info('checkPollId > {} {} {} {}', [rf, groupName, groupVal, mapOfGroups]);
    
    var poll = getPollById(rf, groupVal);
    
    if (isNull(poll)) {
        return null;
    }
    
    return poll;
}

function genTitle(page) {
    log.info('genTitle > page={}', page);
    
    var title = 'Manage Polls | ' + page.attributes.pollId.jsonObject.name;
    
    return title;
}
