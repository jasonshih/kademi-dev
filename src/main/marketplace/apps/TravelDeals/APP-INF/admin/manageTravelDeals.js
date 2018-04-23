/* global formatter, applications, views, _config, http, Utils, controllerMappings, securityManager */

(function (g) {
    g._manageTravelDealsAnalytics = function (page) {
        var db = _getOrCreateUrlDb(page);

        var q = {
            "size": 0,
            "query": {
                "bool": {
                    "must": [
                        {
                            "type": {
                                "value": _config.RECORD_TYPES.ACCESS_LOG
                            }
                        }
                    ]
                }

            },
            "aggs": {
                "dates": {
                    "date_histogram": {
                        "field": "reqDate",
                        "interval": "day"
                    }
                }
            }
        };

        var result = db.search(JSON.stringify(q));

        return views.searchResponseView(result);
    };

    /**
     *
     * @param {ControllerResource} page
     * @param {Map} params
     */
    g._manageTravelDeals = function (page, params) {
        var db = _getOrCreateUrlDb(page);
        var qString = safeString(params.q);

        var q = {
            "size": 10000,
            "stored_fields": ["name", "title", "cost", "startDate", "published", "category", "bookByDate"],
            "sort": [
                {
                    "published": {
                        "order": "asc"
                    }
                },
                {
                    "bookByDate": {
                        "order": "desc",
                        "missing": "_first"
                    }
                }
            ],
            "query": {
                "bool": {
                    "must": [
                        {
                            "type": {
                                "value": g._config.RECORD_TYPES.DEAL
                            }
                        }
                    ]
                }
            }

        };

        if (Utils.isStringNotBlank(qString)) {

            q.query.bool.must.push({
                "multi_match": {
                    "query": qString,
                    "type": "phrase",
                    "fields": ["title"]
                }
            });
        }

        /* Filter by type e.g. Active, Expired or draft */
        var dealType = Utils.safeString(http.request.params.dealType);
        dealType = dealType.toLowerCase();
        if (Utils.isStringBlank(dealType)) {
            dealType = 'draft';
        }

        switch (dealType) {
            case 'draft':
            {
                q.query.bool.must.push(
                        {
                            "bool": {
                                "minimum_should_match": 1,
                                "should": [
                                    {
                                        "term": {
                                            "published": false
                                        }
                                    },
                                    {
                                        "bool": {
                                            "must_not": {
                                                "exists": {
                                                    "field": "published"
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                );
                break;
            }
            case 'active':
            {
                q.query.bool.must.push(
                        {
                            "term": {
                                "published": true
                            }
                        },
                        {
                            "bool": {
                                "minimum_should_match": 1,
                                "should": [
                                    {
                                        "range": {
                                            "bookByDate": {
                                                "gte": "now-1d/d+1s"
                                            }
                                        }
                                    },
                                    {
                                        "bool": {
                                            "must_not": [
                                                {
                                                    "exists": {
                                                        "field": "bookByDate"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                );
                break;
            }
            case 'expired':
            {
                q.query.bool.must.push(
                        {
                            "term": {
                                "published": true
                            }
                        },
                        {
                            "range": {
                                "bookByDate": {
                                    "lte": "now-1d/d-1s"
                                }
                            }
                        }
                );
                break;
            }
        }

        page.attributes.deals = db.search(JSON.stringify(q));
        page.attributes.categories = db.findByType(_config.RECORD_TYPES.CATEGORY).sortByName;
        page.attributes.tags = db.findByType(_config.RECORD_TYPES.TAG).sortByName;

        /* Get enquiry count */
        var enquiryQuery = {
            "size": 0,
            "query": {
                "type": {
                    "value": g._config.RECORD_TYPES.ENQUIRY
                }
            },
            "aggs": {
                "deals": {
                    "terms": {
                        "field": "deal"
                    }
                }
            }
        };

        var enquiryResult = db.search(JSON.stringify(enquiryQuery));
        var buckets = enquiryResult.aggregations.get('deals').buckets;
        var enquiryMap = formatter.newMap();
        for (var i in buckets) {
            var b = buckets[i];
            enquiryMap.put(b.key.replace('deal_', ''), b.docCount);
        }

        page.attributes.enquiryCount = enquiryMap;

        /* Get view log */
        var viewsQuery = {
            "size": 0,
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "parentUrl": "/ourDeals"
                            }
                        },
                        {
                            "exists": {
                                "field": "website"
                            }
                        },
                        {
                            "wildcard": {
                                "contentType": "text/html*"
                            }
                        }
                    ]
                }
            },
            "aggs": {
                "deals": {
                    "terms": {
                        "field": "reqUrl"
                    }
                }
            }
        };

        var viewsResult = applications.search.searchManager.search(JSON.stringify(viewsQuery), 'log');
        var viewBuckets = viewsResult.aggregations.get('deals').buckets;
        var viewMap = formatter.newMap();
        for (var i in viewBuckets) {
            var b = viewBuckets[i];
            var dName = b.key.replace('/ourDeals/', '').replace('/', '');
            viewMap.put(dName, b.docCount);
        }

        page.attributes.viewCount = viewMap;

        /* Get Type Counts */
        var typeQuery = {
            "size": 0,
            "query": {
                "type": {
                    "value": _config.RECORD_TYPES.DEAL
                }
            },
            "aggs": {
                "draft": {
                    "filter": {
                        "bool": {
                            "minimum_should_match": 1,
                            "should": [
                                {
                                    "term": {
                                        "published": false
                                    }
                                },
                                {
                                    "bool": {
                                        "must_not": {
                                            "exists": {
                                                "field": "published"
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                "active": {
                    "filter": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "published": true
                                    }
                                },
                                {
                                    "bool": {
                                        "minimum_should_match": 1,
                                        "should": [
                                            {
                                                "range": {
                                                    "bookByDate": {
                                                        "gte": "now-1d/d+1s"
                                                    }
                                                }
                                            },
                                            {
                                                "bool": {
                                                    "must_not": [
                                                        {
                                                            "exists": {
                                                                "field": "bookByDate"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                },
                "expired": {
                    "filter": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "published": true
                                    }
                                },
                                {
                                    "range": {
                                        "bookByDate": {
                                            "lte": "now-1d/d-1s"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        };

        var typeResults = db.search(JSON.stringify(typeQuery));

        var typeJson = JSON.parse(typeResults.toString());

        page.attributes.typeResults = {
            "draftCount": typeJson.aggregations.draft.doc_count,
            "activeCount": typeJson.aggregations.active.doc_count,
            "expiredCount": typeJson.aggregations.expired.doc_count
        };
    };

    g._manageTravelDealsJson = function (page, params) {
        g._manageTravelDeals(page, params);

        return views.textView(page.attributes.deals.toString(), 'application/json');
    };

    /**
     *
     * @param {ControllerResource} page
     * @param {Map} params
     */
    g._addDeal = function (page, params) {
        var db = _getOrCreateUrlDb(page);
        var now = formatter.now;
        var startOfDay = formatter.parseDate(formatter.formatDate(formatter.now));
        var title = Utils.safeString(params.title);
        var name = Utils.replaceYuckyChars(title);
        var website = Utils.safeString(params.website);

        var count = 1;
        var newName = name;
        while (Utils.isNotNull(db.child(_config.RECORD_NAMES.DEAL(newName)))) {
            newName = name + '-' + count;
            count++;
        }

        var d = {
            title: title,
            name: newName,
            published: false,
            createdDate: formatter.formatDateTime(now),
            startDate: formatter.formatDate(startOfDay),
            website: website
        };

        var curUser = securityManager.currentUser;
        if (isNotNull(curUser)) {
            d.createdBy = curUser.name;
        }

        db.createNew(_config.RECORD_NAMES.DEAL(newName), JSON.stringify(d), _config.RECORD_TYPES.DEAL);
        return page.jsonResult(true, 'Deal Successfully added');
    };

    /**
     *
     * @param {ControllerResource} page
     * @param {Map} params
     */
    g._addCategory = function (page, params) {
        var db = _getOrCreateUrlDb(page);

        var title = Utils.safeString(params.newCategoryName);
        var name = Utils.replaceYuckyChars(title);

        var count = 1;
        var newName = name;
        while (isNotNull(db.child(_config.RECORD_NAMES.CATEGORY(newName)))) {
            newName = name + '-' + count;
            count++;
        }

        var d = {
            name: newName,
            title: title
        };

        db.createNew(_config.RECORD_NAMES.CATEGORY(newName), JSON.stringify(d), _config.RECORD_TYPES.CATEGORY);
        return page.jsonResult(true, 'Category Successfully added');
    };

    g._delCategory = function (page, params) {
        var db = _getOrCreateUrlDb(page);

        var name = safeString(params.delCat);
        var catName = _config.RECORD_NAMES.CATEGORY(name);

        var r = db.child(catName);

        if (isNotNull(r)) {
            r.delete();

            return page.jsonResult(true);
        }

        return page.jsonResult(false);
    };

    g._addTag = function (page, params) {
        var db = _getOrCreateUrlDb(page);

        var title = Utils.safeString(params.newTagName);
        var name = Utils.replaceYuckyChars(title);

        var count = 1;
        var newName = name;
        while (isNotNull(db.child(_config.RECORD_NAMES.TAG(newName)))) {
            newName = name + '-' + count;
            count++;
        }

        var d = {
            name: newName,
            title: title
        };

        db.createNew(_config.RECORD_NAMES.TAG(newName), JSON.stringify(d), _config.RECORD_TYPES.TAG);
        return page.jsonResult(true, 'Tag Successfully added');
    };

    g._delTag = function (page, params) {
        var db = _getOrCreateUrlDb(page);

        var name = safeString(params.delTag);
        var tagName = _config.RECORD_NAMES.TAG(name);

        var r = db.child(tagName);

        if (isNotNull(r)) {
            r.delete();

            return page.jsonResult(true);
        }

        return page.jsonResult(false);
    };

    g._reIndex = function (page) {
        var db = _getOrCreateUrlDb(page);

        log.info('reIndex db={}', db);

        _updateMappings(db);

        return page.jsonResult(true);
    };
})(this);