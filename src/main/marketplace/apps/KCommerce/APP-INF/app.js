function initKCommerceApp(orgRoot, webRoot, enabled) {
    var ecommerceApp = applications.ecommerce;
    log.info("initKCommerceApp: orgRoot={} app={}", orgRoot, ecommerceApp);
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
        if (ecommerceApp.checkCreateStore(ecommerceStoreTitle, ecommerceStoreName, webName)) {
            log.info("Created ecommerce store");
            if (alertsApp) {
                alertsApp.createAdminAlert("Ecommerce Store", "We've created an ecommerce store called " + ecommerceStoreTitle + ". You can <a href='/ecommerce/" + ecommerceStoreName + "/'>manage it here</a>");
            }
        }

        var productsApp = applications.productsApp;
        if (productsApp) {
            var didAdd = false;
            if (productsApp.checkCreateCategory("elec", "Electronics")) {
                productsApp.checkCreateProduct("p1", "Ipad Mini", "elec");
                ecommerceApp.addToStore("p1", ecommerceStoreName);
                productsApp.checkCreateProduct("p2", "Laptop", "elec");
                ecommerceApp.addToStore("p2", ecommerceStoreName);
                didAdd = true;
            }
            if (productsApp.checkCreateCategory("home", "Homeware")) {
                productsApp.checkCreateProduct("p3", "Toaster", "home");
                ecommerceApp.addToStore("p3", ecommerceStoreName);
                productsApp.checkCreateProduct("p4", "Microwave", "home");
                ecommerceApp.addToStore("p4", ecommerceStoreName);
                didAdd = true;
            }
            if (productsApp.checkCreateCategory("exp", "Experiences")) {
                productsApp.checkCreateProduct("p5", "Antarctica", "exp");
                ecommerceApp.addToStore("p5", ecommerceStoreName);
                productsApp.checkCreateProduct("p6", "Hawaii", "exp");
                ecommerceApp.addToStore("p6", ecommerceStoreName);
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