function initJourneysApp(orgRoot, webRoot, enabled, repoDir) {
    var leadmanApp = applications.leadMan;
    log.info("initJourneysApp: orgRoot={} app={}", orgRoot, leadmanApp);
    var alertsApp = applications.alerts;

    if (webRoot) {
        log.info("in a webroot");
        var website = webRoot.website;
        var webName = webRoot.websiteName;
        // check and create the participants group

    log.info("x1");
        var groupName = "customers";
        var group = orgRoot.find("groups").child(groupName);
        if (group == null) {
            group = orgRoot.createGroup(groupName);
            log.info("Created group '" + groupName + "'");
            if (alertsApp) {
                alertsApp.createAdminAlert("KJourneys", "We've created a group called " + group.name + " for your customers and leads. Please be sure to <a href='/groups/" + groupName + "'>check the settings here</a>.");
            }
        }
log.info("x2");
        var salesGroupName = "sales";
        group = orgRoot.find("groups").child(salesGroupName);
        if (group == null) {
            group = orgRoot.createGroup(salesGroupName);
            orgRoot.addRoles(group, website, "Content Viewer", "Sales", "SalesTeamViewer", "TakeLead");
            orgRoot.addGroupToWebsite(group, website);
            log.info("Created sales group '" + salesGroupName + "'");
            if (alertsApp) {
                alertsApp.createAdminAlert("KJourneys", "We've created a group called " + group.name + " for your sales people. Please be sure to <a href='/groups/" + group.name + "'>check the settings here</a>.");
            }
        }
log.info("x3");
        var managerGroupName = "sales-manager";
        group = orgRoot.find("groups").child(managerGroupName);
        if (group == null) {
            group = orgRoot.createGroup(managerGroupName);
            orgRoot.addRoles(group, website, "Content Viewer", "Sales", "SalesTeamViewer", "TakeLead", "User Administrator", "SalesManager");
            orgRoot.addGroupToWebsite(group, website);
            log.info("Created sales group '" + managerGroupName + "'");
            if (alertsApp) {
                alertsApp.createAdminAlert("KJourneys", "We've created a group called " + group.name + " for your sales managers. Please be sure to <a href='/groups/" + group.name + "'>check the settings here</a>.");
            }
        }
log.info("x4");
        // Add current user to the sales and sales-manager groups, so they can login
        var curUser = securityManager.currentUser;
        securityManager.addToGroup(curUser, salesGroupName);
        if (alertsApp) {
            alertsApp.createAdminAlert("KJourneys", "Added you to the " + salesGroupName + " group");
        }
        securityManager.addToGroup(curUser, managerGroupName);
        if (alertsApp) {
            alertsApp.createAdminAlert("KJourneys", "Added you to the " + managerGroupName + " group");
        }

log.info("x5");
        // Create an orgtype for customer/lead companies
        var custOrgTypeName = "customer-company";
        var orgType = orgRoot.find("/orgTypes/" + custOrgTypeName);
        if (orgType == null) {
            orgRoot.createOrgType(custOrgTypeName, "Company");
            if (alertsApp) {
                alertsApp.createAdminAlert("KJourneys", "We've created an org type called " + custOrgTypeName + " for your customer companies");
            }
        }
log.info("x6");
        // Create an orgtype for sales teams
        var salesOrgTypeName = "sales-team";
        orgType = orgRoot.find("/orgTypes/" + salesOrgTypeName);
        if (orgType == null) {
            orgRoot.createOrgType(salesOrgTypeName, "Sales Team");
            if (alertsApp) {
                alertsApp.createAdminAlert("KJourneys", "We've created an org type called " + salesOrgTypeName + " for your sales teams.");
            }
        }
log.info("x7");
        log.info("check funnsls");
        // Create a funnel
        var journeyName = "first-journey";
        var existingFunnel = orgRoot.find('/funnels/' + journeyName);
        if (existingFunnel == null) {
            log.info("Create a new journey");
            var col = repoDir.find("APP-INF/defaultFunnel");
            var hash = col.hash;
            var funnel = leadmanApp.createFunnel(journeyName, hash);
            log.info("Created funnel {}", funnel.name);
            if (alertsApp) {
                existingFunnel = orgRoot.find('/funnels/' + journeyName);
                alertsApp.createAdminAlert("KLeadMan", "We've created a customer journey for you here - <a href='/funnels/" + existingFunnel.name + "/"+ existingFunnel.liveVersion +"'>Edit journey here</a>");
            }
        } else {
            log.info("Cound existing funnel {}", existingFunnel.name);
        }

        leadmanApp.setSettings(salesGroupName, salesOrgTypeName, groupName, custOrgTypeName);


    } else {
        log.info("I'm in an organisation");
    }
}