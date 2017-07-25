(function (g) {
    var APP_NAME = 'googlemap-lib';
    
    g._saveSettings = function (page, params) {
        var apiKey = params.apiKey || '';
        
        page.setAppSetting(APP_NAME, 'apiKey', apiKey);
        
        return views.jsonResult(true);
    };
    
    
    g.getAppSettings = function (page) {
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
    };
    
    g.getGooglemapPortlet = function (page, params, context) {
        log.info('getGooglemapPortlet > page={}, params={}, context={}', [page, params, context]);
        
        var appSettings = g.getAppSettings(page);
    
        context.put('appSettings', appSettings);
        context.put('appSettings2', appSettings);
    }
    
})(this);

// ============================================================================
// Portlet
// ============================================================================
controllerMappings
    .websitePortletController()
    .portletSection('header')
    .templatePath('/theme/apps/googlemap-lib/googlemapPortlet.html')
    .method('getGooglemapPortlet')
    .enabled(true)
    .build();
