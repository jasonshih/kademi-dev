/* global log, views, applications, Utils, formatter */

(function (g) {
    g.initApp = function (orgRoot, webRoot, enabled) {
        log.info("initApp KRecognition: orgRoot={}", orgRoot);
    };

    g.saveSettings = function (page, params) {
        log.info('saveSettings > page={}, params={}', page, params);

        return views.jsonResult(true);

    };

    g.getAppSettings = function (page) {
        log.info('getAppSettings > page={}', page);

        var websiteFolder = page.closest('websiteVersion');
        var org = page.organisation;
        var branch = null;

        if (Utils.isNotNull(websiteFolder)) {
            branch = websiteFolder.branch;
        }

        var app = applications.get(g.APP_NAME);
        if (app !== null) {
            var settings = app.getAppSettings(org, branch);
            return settings;
        }

        return null;
    };

    /**
     * A URL Resolver for topicId
     * @param {type} page
     * @param {type} groupName
     * @param {type} groupValue
     * @returns {unresolved}
     */
    g.resolveTopicId = function (page, groupName, groupValue) {
        var id = formatter.toLong(groupValue);
        return applications.userApp.recognitionService.getTopic(id);
    };

    /**
     * Redirect to an absolute URL
     * 
     * @param {type} page
     * @param {type} params
     * @returns {unresolved}
     */
    g.checkRedirect = function (page, params) {
        var href = page.href;
        if (!href.endsWith('/')) {
            href = href + '/';
        }

        return views.redirectView(href);
    };
})(this);