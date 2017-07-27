var feedbackMapping = {
    "properties": {
        "created": {
            "type": "keyword",
            "store": true
        },
        "option_slug": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "createdBy": {
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        },
        "option_text": {
            "type": "text",
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                }
            }
        },
        "processed": {
            "type": "boolean"
        },
        "profileId": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "website": {
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