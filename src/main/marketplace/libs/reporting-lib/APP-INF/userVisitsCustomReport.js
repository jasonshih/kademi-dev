function generateUserVisitReportCsv(page, params, req, resp) {
    log.info("generateReportCsv");
    var rows = getUserVisitCSV();
    return views.csvView(rows);
}

function findWebsite(id, page) {
    var websites = page.find('/websites').websites;
    var w = '';
    for (var i in websites) {
        if (websites[i].id == id) {
            w = websites[i].domainName || websites[i].name;
            break;
        }
    }
    return w;
}

function getUserVisitCSV() {
    var resp = queryManager.runQuery("userVisit");
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
                        var name = user.name;
                        if (user.firstName) {
                            name = user.firstName + " (" + user.name + ")";
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

function getUserReportData(page) {
    var resp = queryManager.runQuery("userVisit");
    var data = [];
    var byWebsite = resp.aggregations.get("byWebsite").buckets;
    for (var i in byWebsite) {
        var byWebBucket = byWebsite[i];
        var userVisits = byWebBucket.aggregations.get("userVisits").buckets;
        if (userVisits.length) {
            var series = {key: findWebsite(byWebBucket.key, page), values: []};
            for (var j in userVisits) {
                series.values.push({
                    x: userVisits[j].keyAsString,
                    y: userVisits[j].aggregations.get("usersCount").value
                })
            }
            data.push(series);
        }

    }
    return JSON.stringify(data);
}