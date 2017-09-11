controllerMappings
    .addReport("userVisitReport", "User visit report", "User visit report", "/theme/apps/reporting/userVisitsReport.html", "generateUserVisitReportCsv", "text/csv", "csv");

controllerMappings
    .addQuery("/APP-INF/queries/userVisit.query.json", ["log"],	["Administrator"]);

