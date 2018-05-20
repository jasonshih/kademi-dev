controllerMappings
    .websiteController()
    .path('/stores/')
    .enabled(true)
    .defaultView(views.templateView('KCommerce2/viewStores.html'))
    .addMethod('GET', 'getSurveys')
    .build();


controllerMappings.addComponent("ecommerce/components", "ecomProduct", "html", "Display ecom product details", "E-commerce App component");
controllerMappings.addComponent("ecommerce/components", "orderHistoryECom", "html", "Shows the current user's orders and status", "E-commerce App component");


function initKCommerceApp(orgRoot, webRoot, enabled) {
    var catalogManager = services.catalogManager;
    log.info("initKCommerceApp: orgRoot={} app={}", orgRoot, catalogManager);
    var alertsApp = applications.alerts;
    if (webRoot) {
        var website = webRoot.website;
        var webName = webRoot.websiteName;
        // check and create the ecommerce-users group
        var groupName = "ecommerce-users";
        var group = orgRoot.find("groups").child(groupName);
        if (group == null) {
            group = orgRoot.createGroup(groupName);
            orgRoot.addRoles(group, "eCommerce Store Viewer");
            orgRoot.addRoles(group, website, "Content Viewer");
            orgRoot.addGroupToWebsite(group, website);
            log.info("Created ecommerce group '" + groupName + "'");
            if (alertsApp) {
                alertsApp.createAdminAlert("ecommerce Store", "We've created a group called " + group.name + " for your new ecommerce store. Please be sure to <a href='/groups/" + groupName + "'>check the settings here</a>. You might want to allow public registration to this group.");
            }
        }

        var curUser = securityManager.currentUser;
        securityManager.addToGroup(curUser, group);


        // check and create the ecommerce store
        var ecommerceStoreName = webName + "-ecomstore";
        var ecommerceStoreTitle = webName + " ecomstore";
        if (catalogManager.checkCreateStore(ecommerceStoreTitle, ecommerceStoreName, webName)) {
            log.info("Created ecommerce store");
            if (alertsApp) {
                alertsApp.createAdminAlert("Ecommerce Store", "We've created an ecommerce store called " + ecommerceStoreTitle + ". You can <a href='/ecommerce/" + ecommerceStoreName + "/'>manage it here</a>");
            }
        }


        if (productsApp) {
            var didAdd = false;
            if (catalogManager.checkCreateCategory("elec", "Electronics")) {
                catalogManager.checkCreateProduct("p1", "Ipad Mini", "elec");
                catalogManager.addToStore("p1", ecommerceStoreName);
                catalogManager.checkCreateProduct("p2", "Laptop", "elec");
                catalogManager.addToStore("p2", ecommerceStoreName);
                didAdd = true;
            }
            if (catalogManager.checkCreateCategory("home", "Homeware")) {
                catalogManager.checkCreateProduct("p3", "Toaster", "home");
                catalogManager.addToStore("p3", ecommerceStoreName);
                catalogManager.checkCreateProduct("p4", "Microwave", "home");
                catalogManager.addToStore("p4", ecommerceStoreName);
                didAdd = true;
            }
            if (catalogManager.checkCreateCategory("exp", "Experiences")) {
                catalogManager.checkCreateProduct("p5", "Antarctica", "exp");
                catalogManager.addToStore("p5", ecommerceStoreName);
                catalogManager.checkCreateProduct("p6", "Hawaii", "exp");
                catalogManager.addToStore("p6", ecommerceStoreName);
                didAdd = true;
            }
            if( didAdd ) {
                alertsApp.createAdminAlert("Ecommerce Store", "We've added some products and categories for you.");
            }
        }
    } else {
        log.info("I'm in an organisation");
    }
}
