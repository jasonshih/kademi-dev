/* global applications, queryManager, views, controllerMappings */

controllerMappings
        .websiteController()
        .path('/_leadManStatsSummary')
        .addMethod('GET', 'loadLeadManStatsSummary')
        .enabled(true)
        .build();

function loadLeadManStatsSummary(page, params) {
    var funnelName = params.funnelName;
    var startDate = queryManager.commonStartDate;
    var finishDate = queryManager.commonFinishDate;

    return views
            .jsonObjectView(
                    {
                        'tasks': loadTaskStats(funnelName, startDate, finishDate),
                        'leads': loadLeadStats(funnelName, startDate, finishDate),
                        'newContacs': loadProfileStats(funnelName, startDate, finishDate)
                    }
            )
            .wrapJsonResult();
}

function loadTaskStats(funnelName, startDate, finishDate) {
    var es = {
        "size": 0,
        "query": {
            "bool": {
                "minimum_should_match": 1,
                "should": [
                    {
                        "term": {
                            "cancelled": false
                        }
                    },
                    {
                        "bool": {
                            "must_not": {
                                "exists": {
                                    "field": "cancelled"
                                }
                            }
                        }
                    }
                ],
                "must": []
            }
        },
        "aggregations": {
            "completedTasks": {
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "completedDate": {
                                        "gte": startDate.time,
                                        "lte": finishDate.time
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            "dueTasks": {
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "dueDate": {
                                        "gte": startDate.time,
                                        "lte": finishDate.time
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }
    };

    if (funnelName !== null && typeof funnelName !== 'undefined' && funnelName.length > 0) {
        es.query.bool.must.push({
            "term": {
                "funnelName": funnelName
            }
        });
    }

    var resp = applications.search.searchManager.search(JSON.stringify(es), 'task');

    if (resp !== null && typeof resp !== 'undefined') {
        return JSON.parse(resp.toString()).aggregations;
    }

    return null;
}

function loadLeadStats(funnelName, startDate, finishDate) {
    var es = {
        "size": 0,
        "query": {
            "bool": {
                "minimum_should_match": 1,
                "should": [
                    {
                        "term": {
                            "cancelled": false
                        }
                    },
                    {
                        "bool": {
                            "must_not": {
                                "exists": {
                                    "field": "cancelled"
                                }
                            }
                        }
                    }
                ],
                "must": []
            }
        },
        "aggregations": {
            "closedLeads": {
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "closedDate": {
                                        "gte": startDate.time,
                                        "lte": finishDate.time
                                    }
                                }
                            }
                        ]
                    }
                },
                "aggs": {
                    "salesAmount": {
                        "sum": {
                            "field": "dealAmount"
                        }
                    }
                }
            },
            "createdLeads": {
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "createdDate": {
                                        "gte": startDate.time,
                                        "lte": finishDate.time
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }
    };

    if (funnelName !== null && typeof funnelName !== 'undefined' && funnelName.length > 0) {
        es.query.bool.must.push({
            "term": {
                "funnelName": funnelName
            }
        });
    }

    var resp = applications.search.searchManager.search(JSON.stringify(es), 'lead');

    if (resp !== null && typeof resp !== 'undefined') {
        return JSON.parse(resp.toString()).aggregations;
    }

    return null;
}

function loadProfileStats(funnelName, startDate, finishDate) {
    var leadsGroup = applications.leadMan.leadsGroup;

    var es = {
        "size": 0,
        "query": {
            "bool": {
                "must": [
                    {
                        "term": {
                            "memberships.group": leadsGroup.id
                        }
                    },
                    {
                        "range": {
                            "memberships.createdDate": {
                                "gte": startDate.time,
                                "lte": finishDate.time
                            }
                        }
                    }
                ]
            }
        }
    };

    var resp = applications.search.searchManager.search(JSON.stringify(es), 'profile');

    if (resp !== null && typeof resp !== 'undefined') {
        return JSON.parse(resp.toString()).hits.total;
    }

    return null;
}