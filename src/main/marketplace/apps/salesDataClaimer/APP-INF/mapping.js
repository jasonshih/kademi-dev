var recordMapping = {
    "properties": {
        "recordId": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "soldDate": {
            "store": true,
            "type": "date"
        },
        "enteredDate": {
            "store": true,
            "type": "date"
        },
        "modifiedDate": {
            "store": true,
            "type": "date"
        },
        "amount": {
            "type": "long",
            "store": true
        },
        "status": {
            "type": "long",
            "store": true
        },
        "soldBy": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "soldById": {
            "type": "long",
            "store": true
        },
        "productSku": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "field1": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "field2": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "field3": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "field4": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "field5": {
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