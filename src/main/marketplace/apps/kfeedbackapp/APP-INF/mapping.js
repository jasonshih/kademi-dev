var resultMapping = {
    "properties": {
        "surveyId": {
            "eager_global_ordinals": true,
            "store": true,
            "type": "keyword",
            "fields": {
                "text": {
                    "fielddata": true,
                    "store": true,
                    "type": "text"
                }
            }
        },
        "questionId": {
            "eager_global_ordinals": true,
            "store": true,
            "type": "keyword",
            "fields": {
                "text": {
                    "fielddata": true,
                    "store": true,
                    "type": "text"
                }
            }
        },
        "answerId": {
            "eager_global_ordinals": true,
            "store": true,
            "type": "keyword",
            "fields": {
                "text": {
                    "fielddata": true,
                    "store": true,
                    "type": "text"
                }
            }
        },
        "userId": {
            "eager_global_ordinals": true,
            "store": true,
            "type": "keyword",
            "fields": {
                "text": {
                    "fielddata": true,
                    "store": true,
                    "type": "text"
                }
            }
        },
        "createdDate": {
            "store": true,
            "type": "date"
        },
        "answerBody": {
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        }
    }
};
