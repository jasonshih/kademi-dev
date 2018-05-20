
// this is for when a product is accessed directly under a store url, ie without a category
var productInStoreMapping = controllerMappings
        .websiteController()
        .enabled(true)
        .isPublic(true)
        .pathSegmentName('previewImage')
        .addMethod('GET', '_viewDealPreviewImage');

var categoryMapping = controllerMappings
        .websiteController()
        .enabled(true)
        .isPublic(true)
        .pathSegmentName('bannerImage')
        .addMethod('GET', '_viewDealBannerImage');



controllerMappings
        .websiteController()
        .enabled(true)
        .isPublic(true)
        // .mountRepository(g._config.REPO_NAME)
        .pathSegmentResolver('storeName', 'resolveStoreName')
        .defaultView(views.templateView('/theme/apps/KCommerce2/viewStore.html'))
        .title(function (page) {
            return "TODO";
        })
        // .seoContent('_genDealSeoContent')
        .postPriviledge('READ_CONTENT')
        .child(productInStoreMapping)
        .child(categoryMapping)
        .build();

function resolveStoreName(rf, groupName, groupVal) {
    var store = services.criteriaBuilders.get("ecommerceStore")
            .eq("name", groupVal)
            .eq("website", rf.website)
            .executeSingle();
    return store;
}

