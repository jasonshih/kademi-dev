var DB_NAME = 'kpollDB';
var DB_TITLE = 'Kademi Poll DB';

var RECORD_TYPES = {
    POLL: 'poll',
    ANSWERER: 'answerer'
};

var pollMappings = {
    "properties": {
        "name": {
            "type": "text",
            "store": true
        },
        "question": {
            "type": "string",
            "index": "not_analyzed"
        },
        "answers": {
            "type": "string",
            "index": "not_analyzed"
        },
        "enable": {
            "type": "boolean"
        },
        "created": {
            "type": "date"
        },
        "createdBy": {
            "type": "string",
            "index": "not_analyzed"
        },
        "groups": {
            "type": "string",
            "index": "not_analyzed"
        },
        "modified": {
            "type": "date"
        },
        "modifiedBy": {
            "type": "string",
            "index": "not_analyzed"
        },
        "startTime": {
            "type": "date"
        },
        "endTime": {
            "type": "date"
        },
        "point": {
            "type": "integer"
        },
        "pointSystem": {
            "type": "string",
            "index": "not_analyzed"
        }
    }
};

var answererMappings = {
    "properties": {
        "user": {
            "type": "string",
            "index": "not_analyzed"
        },
        "pollId": {
            "type": "string",
            "index": "not_analyzed"
        },
        "answer": {
            "type": "string",
            "index": "not_analyzed"
        },
        "date": {
            "type": "date"
        }
    }
};
