
// this is for when a product is accessed directly under a store url, ie without a category
var productInStoreMapping = controllerMappings
        .websiteController()
        .enabled(true)
        .isPublic(true)
        .title(function (page) {
            return "TODO";
        })
        // .seoContent('_genDealSeoContent')
        .defaultView(views.templateView('/theme/apps/KCommerce2/viewProduct.html'))
        .pathSegmentResolver('productInStore', 'resolveProduct');


var categoryMapping = controllerMappings
        .websiteController()
        .enabled(true)
        .isPublic(true)
        .title(function (page) {
            return "TODO";
        })
        // .seoContent('_genDealSeoContent')
        .defaultView(views.templateView('/theme/apps/KCommerce2/viewCategory.html'))
        .pathSegmentResolver('category', 'resolveCategory');

var cartMapping = controllerMappings
        .websiteController()
        .pathSegmentName('cart')
        .enabled(true)
        .isPublic(true)
        .defaultView(views.templateView('/theme/apps/KCommerce2/storeCheckout.html'))
        .postPriviledge('READ_CONTENT')
        .addMethod('POST', 'setCartItem', 'quantity')
        .addMethod('POST', 'removeCartItem', 'removeLineId')
        .addMethod('POST', 'setCartItemQuantity', 'newQuantity')
        .addMethod('POST', 'checkout', 'checkout');




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
        .child(cartMapping)
        .build();

function setCartItemQuantity(page, params, files, form) {
    log.info("setCartItem: form={}", form);
    var newQuantity = form.bigDecimalParam("newQuantity");
    var changeItemId = form.longParam("changeItemId");
    var cart = services.cartManager.shoppingCart(false);
    var item = cart.item(changeItemId);
    item.quantity = newQuantity;
    services.criteriaBuilders.getBuilder("productOrder").save(item);
    return views.jsonView(true, "Updated " + item.productSku.title + " to quantity " + item.quantity);
}

function setCartItem(page, params, files, form) {
    log.info("setCartItem: form={}", form);
    var quantity = form.integerParam("quantity");
    var skuId = form.longParam("skuId");
    var sku = services.criteriaBuilders.get("productSku").eq("id", skuId).executeSingle();
    var store = page.attributes.store;

    var cart = services.cartManager.shoppingCart(true);
    services.cartManager.addOrUpdateItem(cart, sku, quantity, store, true);
    return views.jsonView(true, "Added " + sku.title);
}

function removeCartItem(page, params, files, form) {
    log.info("removeCartItem: form={}", form);
    var lineId = form.integerParam("removeLineId");
    var didRemove = services.cartManager.removeItem(lineId);
    if( didRemove ) {
        return views.jsonView(true, "Removed " + lineId);
    } else {
        return views.jsonView(true, "Didnt find to remove " + lineId);
    }

}

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


function resolveCategory(rf, groupName, groupVal, mapOfGroups) {
    // we might want to use this later
    var store = mapOfGroups.get("store");

    var category = services.criteriaBuilders.get("category")
            .eq("name", groupVal)
            .executeSingle();

    return category;
}


