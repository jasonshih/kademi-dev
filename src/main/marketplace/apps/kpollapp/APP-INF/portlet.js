function kpollAdminPortlet(page, params) {
    log.info('kpollAdminPortlet > {} {}', page, params);

    managePolls(page, params);
}

function kpollPortlet(page, params, context) {
    log.info('kpollPortlet > {} {}', page, params);

    var user = context.get('user');
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
            'answers'
        ],
        'size': 1,
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
    var poll = null;
    var answer = null;
    var answers = null;

    if (searchResult.hits.totalHits > 0) {
        poll = searchResult.hits.hits[0];
        poll.id = poll.getId();

        answer = getAnswerByUser(page, poll.id, user.name);
        answers = getAnswers(page, poll.id).answers;
    }

    if (poll) {
        context.put('poll', poll);

        if (answer) {
            context.put('answer', answer);
        }

        context.put('answers', answers);
    }
}

function answerPoll(page, params, context) {
    log.info('answerPoll > {} {} {}', [page, params, context]);

    var pollId = page.attributes.pollId;
    var status = {
        'data': null,
        'fieldMessages': [],
        'messages': [],
        'nextHref': '',
        'status': true
    };

    if (isNull(pollId)) {
        log.warn('This poll does not exist!');

        status.status = false;
        status.messages.push('This poll does not exist!');
    } else {
        var poll = getPollById(page, pollId);

        if (isNull(poll)) {
            log.warn('This poll with id="{}" does not exist!', pollId);

            status.status = false;
            status.messages.push('This poll does not exist!');
        } else {
            var answer = getAnswerByUser(page, pollId, page.currentUser.name);

            if (isNull(answer)) {
                if (poll.jsonObject.pointSystem && poll.jsonObject.point && !isNaN(poll.jsonObject.point)) {
                    var pointSystems = page.find('/rewards');
                    var pointSystem = pointSystems.child(poll.jsonObject.pointSystem);

                    if (isNull(pointSystem)) {
                        log.warn('Point system named="{}" does not exist! Adding point is skipped!', poll.jsonObject.pointSystem);
                    } else {
                        if (pointSystem.isInGroup()) {
                            var reason = 'Answered poll with name="' + poll.jsonObject.name + '"';

                            pointSystem.addPoint(page.currentUser, poll.jsonObject.point, reason);
                            log.info('Added "{}" point for user "{}" to "{}" with description: {}', poll.jsonObject.point, page.currentUser.name, poll.jsonObject.pointSystem, reason);
                        } else {
                            log.warn('Current user is not in any groups of Point system named="{}"', poll.jsonObject.pointSystem);
                        }
                    }
                }

                var kpollDB = getKpollDB(page);
                var data = {
                    user: page.currentUser.name,
                    pollId: pollId,
                    answer: params.answer,
                    date: (new Date()).toISOString()
                };
                var id = generateAnswererId();
                kpollDB.createNew(id, JSON.stringify(data), RECORD_TYPES.ANSWERER);

                try {
                    eventManager.goalAchieved("kpollAnsweredGoal", {"poll": pollId});
                } catch (e) {
                    log.error("Error with eventManager.goalAchieved {}", e);
                }

            } else {
                log.warn('You already answered this poll! Answer id: {}', answer.id);

                status.status = false;
                status.messages.push('You already answered this poll!');
            }
        }
    }

    return views.jsonObjectView(JSON.stringify(status));
}
