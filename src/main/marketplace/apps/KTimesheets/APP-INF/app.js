
controllerMappings
        .websiteController()
        .path('/timesheets/')
        .defaultView(views.templateView('/theme/apps/KTimesheets/viewTimesheet.html'))
        .postPriviledge('READ_CONTENT')
        .addMethod('POST', 'saveTime')
        .enabled(true)
        .build();

controllerMappings.addComponent("KTimesheets", "timesheet", "web", "Shows a table to enter timesheet hours", "KTimesheets component");


function saveTime(page, params) {
    transactionManager.runInTransaction(function () {
        var item = params.item;
        var hours = formatter.toDouble( params.hours );
        var date = formatter.toDate(params.date);
        log.info("saveTime: hours={} date={} item={}", hours, item, date);
        services.timesheetManager.addUpdateHours(item, hours, date);
    });

    return views.jsonView(true, "Saved");
}
