function getAvailablePolls(page, user) {
    log.info('getAvailablePolls > page={}, user={}', page, user);
    
    var groups = [];
    var memberships = user.memberships;
    
    for (var i = 0; i < memberships.length; i++) {
        var membership = memberships[i];
        
        groups.push(membership.groupEntity.name);
    }
    
    log.info('User\'s groups are: {}', groups.join(', '));
    
    var queryJson = {
        'sort': {
            'created': 'desc'
        },
        'stored_fields': [
            'name',
            'question',
            'answers',
            'point'
        ],
        'size': 10000,
        'query': {
            'bool': {
                'must': [{
                    'type': {
                        'value': RECORD_TYPES.POLL
                    }
                }],
                'filter': [{
                    'term': {
                        'enable': true
                    }
                }, {
                    'terms': {
                        'groups': groups
                    }
                }, {
                    'range': {
                        'startTime': {
                            'lte': 'now'
                        }
                    }
                }, {
                    'range': {
                        'endTime': {
                            'gte': 'now'
                        }
                    }
                }]
            }
        }
    };
    
    var searchResult = doDBSearch(page, queryJson);
    var polls = [];
    
    for (var i = 0; i < searchResult.hits.hits.length; i++) {
        var poll = searchResult.hits.hits[i];

        var answer = getAnswerByUser(page, poll.id, user.name);
        if (isNull(answer)) {
            polls.push(poll);
        }
    }
    
    return polls;
}
