// ============================================================================
// Portlet
// ============================================================================
controllerMappings
    .websitePortletController()
    .portletSection('endOfPage')
    .templatePath('/theme/apps/KToolbar/ktoolbar.html')
    .method('getKToolbar')
    .enabled(true)
    .build();

function saveSettings(page, params) {
    log.info('saveSettings > page={}, params={}', page, params);
    
    var translationEnabled = params.translationEnabled || '';
    
    page.setAppSetting(APP_NAME, 'translationEnabled', translationEnabled);
    
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

function isTranslationEnabled(page) {
    log.info('isTranslationEnabled > page={}', page);
    
    var translationEnabled = false;
    var settings = getAppSettings(page);
    
    if (isNotNull(settings)) {
        translationEnabled = settings.translationEnabled === 'true';
    }
    
    return translationEnabled;
}

function getKToolbar(page, params, context) {
    log.info('getKToolbar');
    
    var fontFamilyList = {
        'arial,helvetica,sans-serif': 'Arial',
        'comic sans ms,cursive': 'Comic Sans MS',
        'courier new,courier,monospace': 'Courier New',
        'lucida sans unicode,lucida grande,sans-serif': 'Lucida Sans Unicode',
        'tahoma,geneva,sans-serif': 'Tahoma',
        'times new roman,times,serif': 'Times New Roman',
        'trebuchet ms,helvetica,sans-serif': 'Trebuchet MS',
        'verdana,geneva,sans-serif': 'Verdana'
    };
    
    context.put('fontFamilyList', fontFamilyList);
}