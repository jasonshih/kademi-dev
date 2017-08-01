var feedbackMapping = {
    "properties": {
        "survey_id": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "created": {
            "store": true,
            "type": "date"
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
        "option_text": {
            "type": "text",
            "store": true,
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "store": true
                }
            }
        },
        "processed": {
            "type": "boolean",
            "store": true
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