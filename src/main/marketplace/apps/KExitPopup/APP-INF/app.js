controllerMappings
    .websiteController()
    .path('/exitp')
    .isPublic(true)
    .enabled(true)
    .defaultView(views.templateView('KExitPopup/kexitpopup.html'))
    .build();

controllerMappings
        .websiteController()
        .path('/isPageAllowed')
        .addMethod('GET', 'isPageAllowed')
        .isPublic(true)
        .enabled(true)
        .build();

controllerMappings
        .addTemplate(
            "theme/apps/KExitPopup/",
            "kexitpopup",
            "ExitPopup Content Template",
            false);
    


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

function saveSettings(page, params) {
    log.info('saveSettings > page={}, params={}', page, params);
    
    var enableFor = params.enableFor || '';    
    page.setAppSetting(APP_NAME, 'enableFor', enableFor);
    
    return views.jsonResult(true);
}

function isPageAllowed(page, params) {
    log.info('allow page > page={}, params={}', page, params);
    
    
    var appSettings = getAppSettings(page);
    var enableFor = appSettings.enableFor;
    var enableForList = enableFor.split(',');
    
    for(var i = 0; i < enableForList.length; i++){
        if(enableForList[i].trim() === '*' || params.pathname === enableForList[i].trim()){
            return views.jsonObjectView(JSON.stringify({"allowed":true}));            
            break;
        }
    }

    return views.jsonObjectView(JSON.stringify({"allowed":false}));
}
