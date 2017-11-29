(function (g) {
    var APP_NAME = 'KConfirmDetails';

    g._saveSettings = function (page, params) {
        var groupName = params.groupName || '';
        var showExtraFields = params.showExtraFields || '';

        page.setAppSetting(APP_NAME, 'groupName', groupName);
        page.setAppSetting(APP_NAME, 'showExtraFields', showExtraFields);

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

    g.getKConfirmDetails = function (page, params, context) {
        log.info('KConfirmDetails > page={}, params={}, context={}', [page, params, context]);

        var appSettings = g.getAppSettings(page);

        context.put('appSettings', appSettings);
    }

// ============================================================================
// Portlet
// ============================================================================
    controllerMappings
            .websitePortletController()
            .portletSection('endOfPage')
            .templatePath('/theme/apps/KConfirmDetails/kConfirmDetails.html')
            .method('getKConfirmDetails')
            .enabled(true)
            .build();


    controllerMappings
            .websiteController()
            .path('/confirm-details')
            .addMethod('POST', 'updateUser')
            .isPublic(true)
            .postPriviledge('READ_CONTENT')
            .enabled(true)
            .build();

    g.updateUser = function (page, params) {
        log.info('updateUser > page={}, params={}', page, params);

        var userName = params.userName;
        var groupName = params.groupName;
        var result = {
            status: true
        };

        try{
            var orgData = page.closest("website").getOrgData();
            var group = orgData.createGroup(groupName);
        }catch(e){
            //Group exists
        }

        try {
            securityManager.addToGroup(userName, groupName);
        } catch (e) {
            log.error('Error when updating user: ' + e);
            result.status = false;
            result.messages = ['Error when updating user: ' + e];
        }
        return views.jsonObjectView(JSON.stringify(result));
    };

})(this);