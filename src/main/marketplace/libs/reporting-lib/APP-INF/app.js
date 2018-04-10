controllerMappings
    .addReport("userVisitReport", "User Active report", "User Active report", "/theme/apps/reporting/userVisitsReport.html", "generateUserVisitReportCsv", "text/csv", "csv");

controllerMappings
    .addQuery("/APP-INF/queries/userVisit.query.json", ["log"],	["Administrator"]);
controllerMappings
    .addQuery("/APP-INF/queries/userVisits.query.json", ["uservisit"],	["Administrator"]);

controllerMappings.addTableDef("tableUserVisit", "User Visits Table", "loadUserVisits")
    .addHeader("Full name")
    .addHeader("Number of visits")
    .addHeader("Last visit date");

function loadUserVisits(start, maxRows, rowsResult, rootFolder) {
    var resp = queryManager.runQuery("userVisits");
    var data = [];
    var byUsers = resp.aggregations.get("byUsers").buckets;
    for (var i in byUsers) {
        var byUser = byUsers[i];
        var top_hit = byUser.aggregations.get("top_hit").hits;
        var ur = applications.userApp.findUserResourceById(byUser.key);
        rowsResult.addRow();
        var link = "<a href='/custs/" + ur.name + "'>" + ur.thisUser.formattedName + "</a>";
        rowsResult.addCell(link);
        rowsResult.addCell(byUser.docCount);
        if (top_hit.totalHits > 0){
            rowsResult.addCell(formatter.formatDate(formatter.toDate(top_hit.hits[0].source.visitDate)));
        } else {
            rowsResult.addCell('');
        }
    }
}