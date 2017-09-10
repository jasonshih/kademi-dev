controllerMappings
    .addReport("userVisitReport", "User visit report", "User visit report", "/theme/apps/reporting/userVisitsReport.html", "generateUserVisitReportCsv", "text/csv", "csv");

function generateUserVisitReportCsv(page, params, req, resp) {
    log.info("generateReportCsv");
    return views.csvView(rows);
}

function findWebsite(id, page) {
    var websites = page.find('/websites').websites;
    var w = '';
    for (var i in websites){
        if (websites[i].id == id){
            w = websites[i].domainName || websites[i].name;
            break;
        }
    }
    return w;
}

function getUserReportData(page) {
    var resp = queryManager.runQuery("userVisit");
    var data = [];
    var byWebsite = resp.aggregations.get("byWebsite").buckets;
    for (var i in byWebsite){
        var byWebBucket = byWebsite[i];
        var userVisits = byWebBucket.aggregations.get("userVisits").buckets;
        if (userVisits.length){
            var series = {key: findWebsite(byWebBucket.key, page), values: []};
            for (var j in userVisits){
                series.values.push({
                    x: userVisits[j].keyAsString,
                    y: userVisits[j].docCount
                })
            }
            data.push(series);
        }

    }
    return JSON.stringify(data);
}

controllerMappings
    .addQuery("/APP-INF/queries/userVisit.query.json", ["log"],	["Administrator"]);

