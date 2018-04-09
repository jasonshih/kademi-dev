function generateUserVisitReportCsv(page, params, req, resp) {
    log.info("generateReportCsv");
    var rows = getUserVisitCSV();
    return views.csvView(rows);
}

function findWebsite(page) {
    var websites = page.find('/').websites;
    var w = {};
    for (var i in websites) {
        w[websites[i].id.toString()] = websites[i].domainName || websites[i].name;
    }
    return w;
}

function getUserVisitCSV() {
    var map = formatter.newMap();
    map.put("aggInterval", "day");
    var resp = queryManager.runQuery("userVisit", map);
    var data = [];
    var byWebsite = resp.aggregations.get("byWebsite").buckets;
    for (var i in byWebsite) {
        var byWebBucket = byWebsite[i];
        var userVisits = byWebBucket.aggregations.get("userVisits").buckets;
        if (userVisits.length) {
            for (var j in userVisits) {
                var usersCount = userVisits[j].aggregations.get("usersCount").value;
                if (usersCount > 0) {
                    var byUsers = userVisits[j].aggregations.get("byUsers").buckets;
                    for (k in byUsers) {
                        var user = applications.userApp.findUserResource(byUsers[k].key);
                        var name;
                        if (user) {
                            name = user.formattedName;
                        } else {
                            name = byUsers[k].key;
                        }

                        var d = formatter.formatDate(userVisits[j].key);
                        data.push([name, d]);
                    }
                }
            }
        }
    }
    return data;
}

function getUserReportData(page, params) {
    var map = formatter.newMap();
    map.put("aggInterval", "day");
    var resp = queryManager.runQuery("userVisit", map);
    log.info('resp {}', resp);
    var data = [];
    var m = {};
    var pv = [];
    var byWebsite = resp.aggregations.get("byWebsite").buckets;
    var w = findWebsite(page);
    for (var i in byWebsite) {
        var byWebBucket = byWebsite[i];
        var userVisits = byWebBucket.aggregations.get("userVisits").buckets;
        if (userVisits.length) {
            if (w[byWebBucket.key]){

                if (params.aggWebsite){
                    if (params.aggWebsite == byWebBucket.key){
                        m[w[byWebBucket.key]] = byWebBucket.aggregations.get("totalUniqueUsers").value;
                        var series = {key: w[byWebBucket.key], values: []};
                        for (var j in userVisits) {
                            series.values.push({
                                x: userVisits[j].keyAsString,
                                y: userVisits[j].aggregations.get("usersCount").value
                            })
                        }
                        data.push(series);

                        var pageViewsB = byWebBucket.aggregations.get("byUsers").buckets;
                        for (var i in pageViewsB){
                            var ur = applications.userApp.findUserResource(pageViewsB[i].key);
                            if (ur){
                                pv.push({name: ur.formattedName, pv: pageViewsB[i].aggregations.get("pageViews").value})
                            }
                        }
                    }
                } else {
                    m[w[byWebBucket.key]] = byWebBucket.aggregations.get("totalUniqueUsers").value;
                    var series = {key: w[byWebBucket.key], values: []};
                    for (var j in userVisits) {
                        series.values.push({
                            x: userVisits[j].keyAsString,
                            y: userVisits[j].aggregations.get("usersCount").value
                        })
                    }
                    data.push(series);
                }

            }
        }
    }
    return JSON.stringify({data: data, uniqueVisitors: m, pv: pv});
}