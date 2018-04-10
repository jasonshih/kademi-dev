function generateUserVisitReportCsv(page, params, req, resp) {
    log.info("generateReportCsv");
    var rows = getUserVisitCSV(page, params);
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

function getUserVisitCSV(page, params) {
    var obj = getUserReportData(page, params, true);

    var data = obj.data;
    var pv = obj.pv;
    var m = obj.uniqueVisitors;
    var csvData = [];
    csvData.push(['Unique visitors']);
    csvData.push(['']);
    for(var key in m){
        csvData.push([key, m[key]]);
    }

    csvData.push(['']);
    csvData.push(['Date histogram']);
    csvData.push(['']);
    for (var i = 0; i < data.length; i++){
        var series = data[i];
        csvData.push(["Website: " + series.key]);
        for (var j = 0; j < series.values.length; j++){
            csvData.push([formatter.formatDate(formatter.toDate(series.values[j].x)), series.values[j].y]);
        }
    }

    csvData.push(['Date histogram']);
    csvData.push(['']);
    for (var i = 0; i < pv.length; i++){
        csvData.push([pv[i].name, pv[i].value]);
    }

    return csvData;
}

function getUserReportData(page, params, notJSON) {
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
    if (notJSON){
        return {data: data, uniqueVisitors: m, pv: pv};
    } else {
        return JSON.stringify({data: data, uniqueVisitors: m, pv: pv});
    }
}