var pollMapping = {
    "properties": {
        "name": {
            "type": "text",
            "store": true
        },
        "question": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "answers": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "enable": {
            "type": "boolean",
            "store": true
        },
        "created": {
            "type": "date",
            "store": true
        },
        "createdBy": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "groups": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "modified": {
            "type": "date",
            "store": true
        },
        "modifiedBy": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "startTime": {
            "type": "date",
            "store": true
        },
        "endTime": {
            "type": "date",
            "store": true
        },
        "point": {
            "type": "integer",
            "store": true
        },
        "pointSystem": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        }
    }
};

var answererMapping = {
    "properties": {
        "user": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "pollId": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "answer": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "date": {
            "type": "date",
            "store": true
        }
    }
};
