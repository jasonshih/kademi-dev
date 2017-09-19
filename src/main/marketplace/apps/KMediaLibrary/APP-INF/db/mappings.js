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
                    "type": "keyword",
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                },
                "name": {
                    "type": "keyword",
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                },
                "title": {
                    "type": "keyword",
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                },
                "caption": {
                    "type": "keyword",
                    "fields": {
                        "text": {
                            "type": "text"
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
                    "type": "keyword",
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                },
                "hash": {
                    "type": "text"
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
                    "type": "keyword",
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                },
                "name": {
                    "type": "keyword",
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                },
                "title": {
                    "type": "keyword",
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                },
                "parentCategory": {
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
})(this);