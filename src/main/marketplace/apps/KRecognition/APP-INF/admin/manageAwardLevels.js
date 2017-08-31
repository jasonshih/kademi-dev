/* global applications, Utils */

(function (g) {

    g._processPointsBucketForAllUsers = function (page, pointsBucket) {
        var isProfile = Utils.safeString(pointsBucket.pointsType) === 'POINTS_PROFILE';

        var q = {
            "size": 0,
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "rewardId": pointsBucket.id
                            }
                        }
                    ]
                }
            },
            "aggregations": {}
        };

        if (isProfile) {
            q.aggregations.users = {
                "terms": {
                    "field": "issuedToProfileName"
                },
                "aggs": {
                    "totalPoints": {
                        "sum": {
                            "field": "numPoints",
                            "missing": 0
                        }
                    }
                }
            };
        } else {
            q.aggregations.orgs = {
                "terms": {
                    "field": "issuedToOrgId"
                },
                "aggs": {
                    "totalPoints": {
                        "sum": {
                            "field": "numPoints",
                            "missing": 0
                        }
                    }
                }
            };
        }

        var results = applications.search.searchManager.search(JSON.stringify(q), 'rewardpoints');

        var json = JSON.parse(results.toString());
        var userBuckets = json.aggregations.users.buckets;

        for (var i = 0; i < userBuckets.length; i++) {
            var bucket = userBuckets[i];

            var userName = bucket.key;
            var totalPoints = bucket.totalPoints;
        }
    };
    g._processSalesDataForAllUsers = function (page, params) {

    };
})(this);