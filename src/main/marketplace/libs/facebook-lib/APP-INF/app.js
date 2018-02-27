(function (g) {
    var APP_NAME = 'facebook-lib';

    controllerMappings
            .websitePortletController()
            .portletSection('header')
            .templatePath('/theme/apps/facebook-lib/fb.html')
            .method('getFacebookAppId')
            .enabled(true)
            .build();

    g.getFacebookAppId = function (page, params, contextMap) {
        log.info('getFacebookAppId > page={}, params={}, context={}', [page, params, contextMap]);

        var appSettings = g.getAppSettings(page);

        contextMap.put('facebookAppId', appSettings.get('fbAppId'));
    };

    g.saveSettings = function (page, params) {
        var apiKey = params.fbAppId || '';

        page.setAppSetting(APP_NAME, 'fbAppId', apiKey);

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
})(this);