function getPolls(page) {
    log.info('getPolls > page={} ', page);
    
    var kpollDB = getDB(page);
    var polls = kpollDB.findByType(RECORD_TYPES.POLL);
    
    log.info('Found {} poll(s)', polls.length);
    
    return polls;
}

function getPollById(page, pollId) {
    log.info('getPollById > page={}, pollId={}', [page, pollId]);
    
    var kpollDB = getDB(page);
    var poll = kpollDB.child(pollId);
    
    return poll;
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
    
    if (poll.jsonObject.answers && poll.jsonObject.answers[0] && poll.jsonObject.answers.length > 0) {
        for (var i = 0; i < poll.jsonObject.answers.length; i++) {
            var ans = poll.jsonObject.answers[i];
            
            answers.list.push({
                answer: ans,
                hit: answered[ans] ? answered[ans].hit : 0,
                percent: answered[ans] ? answered[ans].percent : 0,
            });
        }
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
