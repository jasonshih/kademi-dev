/* global Utils */

(function (g) {
    if (Utils.isNull(g.MAPPINGS)) {
        g.MAPPINGS = [];
    }

    /**
     * Mapping for Media Item
     */
    g.MAPPINGS.push({
        TYPE: g._config.RECORD_TYPES.MEDIA_ITEM,
        MAPPING: {
            "properties": {
                "id": {
                    "type": "keyword"
                },
                "name": {
                    "type": "keyword"
                },
                "title": {
                    "type": "text",
                    "fields": {
                        "text": {
                            "type": "keyword"
                        }
                    }
                },
                "caption": {
                    "type": "text",
                    "fields": {
                        "text": {
                            "type": "keyword"
                        }
                    }
                },
                "altText": {
                    "type": "keyword",
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                },
                "description": {
                    "type": "text",
                    "fields": {
                        "text": {
                            "type": "keyword"
                        }
                    }
                },
                "hash": {
                    "type": "keyword"
                },
                "contentType": {
                    "type": "keyword",
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                },
                "fileSize": {
                    "type": "long"
                },
                "width": {
                    "type": "long"
                },
                "height": {
                    "type": "long"
                },
                "createdDate": {
                    "type": "date"
                },
                "createdBy": {
                    "type": "keyword",
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                },
                "categories": {
                    "type": "keyword",
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                }
            }
        }
    });

    /* Mapping for Media Category */
    g.MAPPINGS.push({
        TYPE: g._config.RECORD_TYPES.MEDIA_CATEGORY,
        MAPPING: {
            "properties": {
                "id": {
                    "type": "keyword"
                },
                "name": {
                    "type": "keyword"
                },
                "title": {
                    "type": "text",
                    "fields": {
                        "text": {
                            "type": "keyword"
                        }
                    }
                },
                "parentCategory": {
                    "type": "keyword"
                }
            }
        }
    });
})(this);