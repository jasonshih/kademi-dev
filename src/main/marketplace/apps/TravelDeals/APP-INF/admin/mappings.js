/* global controllerMappings, views */

(function (g) {
    var manageTravelDealController = controllerMappings
            .adminController()
            .enabled(true)
            .mountRepository(g._config.REPO_NAME)
            .pathSegmentResolver('dealName', '_resolveDealName')
            .defaultView(views.templateView('/theme/apps/travelDeals/manageTravelDeal.html'))
            .title(function (page) {
                return page.attributes.dealName.jsonObject.title;
            })
            .addMethod('GET', '_gotoEditor', 'gotoEditor')
            .addMethod('GET', '_manageTravelDeal')
            .addMethod('POST', '_saveDeal', 'title')
            .addMethod('POST', '_publishDeal', 'publish')
            /* Tips */
            .addMethod('POST', '_addTip', 'addTip')
            .addMethod('POST', '_reorderTip', 'reorderTip')
            .addMethod('POST', '_deleteTip', 'deleteTip')
            /* Recommended Links */
            .addMethod('POST', '_addLink', 'addLink')
            .addMethod('POST', '_reorderLink', 'reorderLink')
            .addMethod('POST', '_deleteLink', 'deleteLink')
            /* Images */
            .addMethod('POST', '_uploadBanner', 'uploadBanner')
            .addMethod('POST', '_removeBanner', 'removeBanner')
            .addMethod('POST', '_uploadPreview', 'uploadPreview')
            .addMethod('POST', '_removePreview', 'removePreview')
            /* Upload files */
            .addMethod('POST', '_uploadFiles', 'uploadFiles')
            .addMethod('POST', '_removeFiles', 'removeFiles')
            /* Duplicate Deal */
            .addMethod('POST', '_duplicateDeal', 'duplicateDeal')
            /* Delete Deal */
            .addMethod('POST', '_deleteDeal', "deleteDeal");

    controllerMappings
            .adminController()
            .enabled(true)
            .pathSegmentName('travelDeals')
            .defaultView(views.templateView('/theme/apps/travelDeals/manageTravelDeals.html'))
            .addMethod('GET', '_manageTravelDealsAnalytics', 'analytics')
            .addMethod('GET', '_manageTravelDealsJson', 'asJson')
            .addMethod('GET', '_manageTravelDeals')
            .addMethod('POST', '_addDeal', 'createNew')
            .addMethod('POST', '_addCategory', 'newCategoryName')
            .addMethod('POST', '_delCategory', 'delCat')
            .addMethod('POST', '_addTag', 'newTagName')
            .addMethod('POST', '_delTag', 'delTag')
            .addMethod('POST', '_reIndex', 'reindex')
            .child(manageTravelDealController)
            .build();
})(this);