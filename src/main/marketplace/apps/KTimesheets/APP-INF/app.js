var APP_NAME = 'KTimesheets';

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


// ============================================================================
// Settings
// ============================================================================
function saveSettings(page, params) {
    log.info('saveSettings > page={}, params={}', page, params);

    var standardItems = params.standardItems || '';

    page.setAppSetting(APP_NAME, 'standardItems', standardItems);

    return views.jsonResult(true);
}


function getAppSettings(page) {
    log.info('getAppSettings > page={}', page);

    var websiteFolder = page.closest('websiteVersion');
    var org = page.organisation;
    var branch = null;

    if (websiteFolder !== null && typeof websiteFolder !== 'undefined') {
        branch = websiteFolder.branch;
    }

    var app = applications.get(APP_NAME);
    if (app !== null) {
        var settings = app.getAppSettings(org, branch);
        return settings;
    }

    return null;
}