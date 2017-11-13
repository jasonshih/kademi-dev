(function (g) {
    var APP_NAME = 'facebookPixel';
    
    g._saveSettings = function (page, params) {
        var pixelId = params.pixelId || '';
        
        page.setAppSetting(APP_NAME, 'pixelId', pixelId);
        
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
    
    g.getFacebookPixelPortlet = function (page, params, context) {
        log.info('getFacebookPixelPortlet > page={}, params={}, context={}', [page, params, context]);
        
        var appSettings = g.getAppSettings(page);
    
        context.put('appSettings', appSettings);
    }
    
})(this);

// ============================================================================
// Portlet
// ============================================================================
controllerMappings
    .websitePortletController()
    .portletSection('header')
    .templatePath('/theme/apps/facebookPixel/facebookPixelPortlet.html')
    .method('getFacebookPixelPortlet')
    .enabled(true)
    .build();
