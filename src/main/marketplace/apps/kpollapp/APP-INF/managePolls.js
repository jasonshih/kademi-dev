function managePolls(page, params) {
    log.info('managePolls > {} {}', page, params);
    
    var polls = getPolls(page);
    
    page.attributes.polls = polls;
}

function savePoll(page, params) {
    log.info('savePoll > {} {}', page, params);
    
    var currentTime = (new Date()).toISOString();
    var data = {
        name: params.name || params.question,
        question: params.question,
        answers: params.answers.split(','),
        enable: params.enable || false
    };
    
    var id = params.id;
    var kpollDB = getKpollDB(page);
    
    if (id) {
        log.info('Update detail of poll: {}', id);
        
        var poll = getPollById(page, id);
        
        data.modified = currentTime;
        data.modifiedBy = params.user;
        data.startTime = params.startTime;
        data.endTime = params.endTime;
        data.point = params.point;
        data.pointSystem = params.pointSystem;
        data = editPollData(poll, data);
        
        poll.update(JSON.stringify(data), RECORD_TYPES.POLL);
    } else {
        log.info('Create new poll');
        
        data.created = currentTime;
        data.createdBy = params.user;
        
        id = generatePollId();
        
        kpollDB.createNew(id, JSON.stringify(data), RECORD_TYPES.POLL);
    }
    
    var status = {
        'data': null,
        'fieldMessages': [],
        'messages': [],
        'nextHref': '',
        'status': true,
        'pollId': id
    };
    
    return views.jsonObjectView(JSON.stringify(status)).wrapJsonResult();
}

function deletePolls(page, params) {
    var pollIds = params.pollId;
    log.info('deletePolls - ids: {}', pollIds);
    
    pollIds = pollIds.split(',');
    
    for (var i = 0, pollId; pollId = pollIds[i]; i++) {
        log.info('Preparing to delete poll with id ({})', pollId);
        var poll = getPollById(page, pollId);
        
        if (poll) {
            poll.delete();
        } else {
            log.info('Poll with id ({}) does not exist', pollId);
        }
    }
    
    var status = {
        'data': null,
        'fieldMessages': [],
        'messages': [],
        'nextHref': '',
        'status': true
    };
    
    return views.jsonObjectView(JSON.stringify(status)).wrapJsonResult();
}
