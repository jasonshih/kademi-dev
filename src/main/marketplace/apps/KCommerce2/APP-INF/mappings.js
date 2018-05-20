
// this is for when a product is accessed directly under a store url, ie without a category
var productInStoreMapping = controllerMappings
        .websiteController()
        .enabled(true)
        .isPublic(true)
        .defaultView(views.templateView('/theme/apps/KCommerce2/viewProduct.html'))
        .pathSegmentResolver('productInStore', 'resolveProduct');


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
        .pathSegmentResolver('store', 'resolveStoreName')
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

function resolveProduct(rf, groupName, groupVal, mapOfGroups) {
    var store = mapOfGroups.get("store");
    // First try the webname
    var product = services.criteriaBuilders.get("productInEComStore")
            .join("product", "p")
            .eq("p.webName", groupVal)
            .eq("store", store)
            .executeSingle();

    if( product === null ) {
        // Didnt find webname, so try product name
        var product = services.criteriaBuilders.get("productInEComStore")
            .join("product", "p")
            .eq("p.name", groupVal)
            .eq("store", store)
            .executeSingle();
    }

    if( product === null ) {
        // Still nuttin, try using the segment as a product ID
        var id = formatter.toLong(groupVal, true);
        if( id !== null ) {
            var product = services.criteriaBuilders.get("productInEComStore")
                .join("product", "p")
                .eq("p.id", id)
                .eq("store", store)
                .executeSingle();
        }
    }
    return product;
}



