function initLeadManApp(orgRoot, webRoot, enabled, repoDir) {
    var leadmanApp = applications.leadMan;
    log.info("initLeadManApp: orgRoot={} app={}", orgRoot, leadmanApp);
    var alertsApp = applications.alerts;
    
    if (webRoot) {
        var website = webRoot.website;
        var webName = webRoot.websiteName;
        // check and create the participants group
        
        var groupName = "leads";
        var group = orgRoot.find("groups").child(groupName);
        if (group == null) {
            group = orgRoot.createGroup(groupName);
            log.info("Created group '" + groupName + "'");
            if (alertsApp) {
                alertsApp.createAdminAlert("KLeadMan", "We've created a group called " + group.name + " for your customers and leads. Please be sure to <a href='/groups/" + groupName + "'>check the settings here</a>.");
            }
        }

        var salesGroupName = "sales";
        group = orgRoot.find("groups").child(salesGroupName);
        if (group == null) {
            group = orgRoot.createGroup(salesGroupName);
            orgRoot.addRoles(group, website, "Content Viewer", "Sales", "SalesTeamViewer", "TakeLead");            
            orgRoot.addGroupToWebsite(group, website);
            log.info("Created sales group '" + salesGroupName + "'");
            if (alertsApp) {
                alertsApp.createAdminAlert("KLeadMan", "We've created a group called " + group.name + " for your sales people. Please be sure to <a href='/groups/" + groupName + "'>check the settings here</a>.");
            }
        }

        var managerGroupName = "sales-manager";
        group = orgRoot.find("groups").child(managerGroupName);
        if (group == null) {
            group = orgRoot.createGroup(managerGroupName);
            orgRoot.addRoles(group, website, "Content Viewer", "Sales", "SalesTeamViewer", "TakeLead", "User Administrator", "SalesManager");            
            orgRoot.addGroupToWebsite(group, website);
            log.info("Created sales group '" + managerGroupName + "'");
            if (alertsApp) {
                alertsApp.createAdminAlert("KLeadMan", "We've created a group called " + group.name + " for your sales managers. Please be sure to <a href='/groups/" + groupName + "'>check the settings here</a>.");
            }
        }
        
        // Add current user to the sales and sales-manager groups, so they can login
        var curUser = securityManager.currentUser;
        securityManager.addToGroup(curUser, salesGroupName);
        if (alertsApp) {
            alertsApp.createAdminAlert("KLeadMan", "Added you to the " + salesGroupName + " group");
        }        
        securityManager.addToGroup(curUser, managerGroupName);
        if (alertsApp) {
            alertsApp.createAdminAlert("KLeadMan", "Added you to the " + managerGroupName + " group");
        }        
        
        
        // Create an orgtype for customer/lead companies
        var orgTypeName = "customer-company";
        var orgType = orgRoot.find("/orgTypes/" + orgTypeName);
        if( orgType == null ) {
            orgRoot.createOrgType(orgTypeName, "Company");
            if (alertsApp) {
                alertsApp.createAdminAlert("KLeadMan", "We've created an org type called " + orgTypeName + " for your customer companies");
            }            
        }
        
        // Create an orgtype for sales teams
        orgTypeName = "sales-team";
        orgType = orgRoot.find("/orgTypes/" + orgTypeName);
        if( orgType == null ) {
            orgRoot.createOrgType(orgTypeName, "Sales Team");
            if (alertsApp) {
                alertsApp.createAdminAlert("KLeadMan", "We've created an org type called " + orgTypeName + " for your sales teams.");
            }            
        }        

        // Create a funnel
 
        var col = repoDir.find("APP-INF/defaultFunnel");
        var hash = col.hash;
        var funnel = leadmanApp.createFunnel("journey1", hash);
        if (alertsApp) {
            alertsApp.createAdminAlert("KLeadMan", "We've created a customer journey for you here - <a href='/funnels/" + funnel.name + "'>Edit journey here</a>");
        }            
        
//x = y / 0; // cause a deliberate error
     
    } else {
        log.info("I'm in an organisation");
    }
}